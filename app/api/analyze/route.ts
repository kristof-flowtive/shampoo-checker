import { NextRequest, NextResponse } from "next/server";
import { openai, SYSTEM_PROMPT } from "@/lib/openai";

const MAX_IMAGE_CHARS = 7_500_000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, imageBase64 } = body ?? {};

    const hasText = typeof query === "string" && query.trim().length > 0;
    const hasImage = typeof imageBase64 === "string" && imageBase64.length > 0;

    if (!hasText && !hasImage) {
      return NextResponse.json(
        { error: "Please provide a product name, ingredients, or an image." },
        { status: 400 }
      );
    }

    if (hasText && query.length > 5000) {
      return NextResponse.json(
        { error: "Input is too long. Please keep it under 5000 characters." },
        { status: 400 }
      );
    }

    if (hasImage) {
      if (!imageBase64.startsWith("data:image/")) {
        return NextResponse.json(
          { error: "Invalid image format." },
          { status: 400 }
        );
      }
      if (imageBase64.length > MAX_IMAGE_CHARS) {
        return NextResponse.json(
          { error: "Image is too large. Please keep it under 5MB." },
          { status: 400 }
        );
      }
    }

    let raw: string | null;

    if (hasImage) {
      // Step 1: Identify the product from the image and extract any visible ingredients
      const idCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Look at this hair product photo. Return ONLY a JSON object with these fields:
{
  "brand": "the brand name you can see",
  "productName": "the full product name you can see",
  "ingredients": "the full ingredient list if visible on the label, or null if not visible"
}
Return ONLY the JSON, no markdown fences, no extra text.`,
              },
              { type: "image_url", image_url: { url: imageBase64 } },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 1000,
      });

      const idRaw = (idCompletion.choices[0]?.message?.content ?? "")
        .replace(/^```(?:json)?\s*\n?/i, "")
        .replace(/\n?```\s*$/i, "")
        .trim();

      let productInfo: {
        brand: string;
        productName: string;
        ingredients: string | null;
      };
      try {
        productInfo = JSON.parse(idRaw);
      } catch {
        return NextResponse.json(
          {
            error:
              "Couldn't identify the product from this image. Try a clearer photo or type the product name instead.",
          },
          { status: 400 }
        );
      }

      if (productInfo.ingredients) {
        // Ingredients visible on label — analyze directly, no web search needed
        const response = await openai.responses.create({
          model: "gpt-4o",
          instructions: SYSTEM_PROMPT,
          input: `Analyze this product for hair extension compatibility. The ingredients were read directly from the product label.\n\nBrand: ${productInfo.brand}\nProduct: ${productInfo.productName}\nIngredients: ${productInfo.ingredients}`,
          temperature: 0.3,
        });
        raw = response.output_text ?? null;
      } else {
        // No ingredients visible — search the web using the identified product name
        const searchQuery = [productInfo.brand, productInfo.productName]
          .filter(Boolean)
          .join(" ");
        const response = await openai.responses.create({
          model: "gpt-4o",
          tools: [{ type: "web_search_preview" }],
          instructions: SYSTEM_PROMPT,
          input: `I identified this product from a photo: "${searchQuery}". Search the web for its full ingredient list, then analyze it for hair extension compatibility. Base your analysis on the actual ingredients you find. If you cannot find the exact product, say so in the summary but still provide your best analysis.`,
          temperature: 0.3,
        });
        raw = response.output_text ?? null;
      }
    } else {
      // Text path: use Responses API with web search so GPT can look up real ingredients
      const response = await openai.responses.create({
        model: "gpt-4o",
        tools: [{ type: "web_search_preview" }],
        instructions: SYSTEM_PROMPT,
        input: `Search the web for the full ingredient list of this hair product, then analyze it for hair extension compatibility. If you find the ingredients, base your analysis on the actual ingredient list. If you cannot find the exact product, say so in the summary but still provide your best analysis based on what you can find about the brand/line.\n\nProduct: ${query.trim()}`,
        temperature: 0.3,
      });

      raw = response.output_text ?? null;
    }

    if (!raw) {
      return NextResponse.json(
        { error: "No response from AI. Please try again." },
        { status: 500 }
      );
    }

    // Strip markdown code fences GPT sometimes adds despite instructions
    const content = raw
      .replace(/^```(?:json)?\s*\n?/i, "")
      .replace(/\n?```\s*$/i, "")
      .trim();

    const result = JSON.parse(content);

    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }
    const message =
      error instanceof Error ? error.message : "Something went wrong.";
    console.error("Analyze API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
