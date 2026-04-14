/**
 * Curated, hand-vetted list of extension-safe shampoos with verified
 * product-image URLs. Images are hosted on brand CDNs (Shopify) and have been
 * confirmed reachable. Each recommendation is sulfate-free and considered
 * safe for clip-ins, tape-ins, sew-ins, keratin bonds, and micro-links.
 *
 * NOTE: Olaplex No. 4 Bond Maintenance Shampoo is intentionally excluded —
 * many extension stylists advise against it.
 */

export type CuratedRecommendation = {
  productName: string;
  brand: string;
  score: number;
  grade: string;
  reason: string;
  imageUrl: string;
};

export const CURATED_RECOMMENDATIONS: CuratedRecommendation[] = [
  {
    productName: "OI Shampoo",
    brand: "Davines",
    score: 9,
    grade: "A",
    reason:
      "Sulfate-free with roucou oil — cleanses gently while adding silkiness and softness, perfect for keeping extension bonds intact.",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0052/8085/8198/files/Davines-76164-oi-shampoo-50ml-8004608297161-1.jpg?v=1770304028",
  },
  {
    productName: "MOMO Shampoo",
    brand: "Davines",
    score: 9,
    grade: "A",
    reason:
      "Moisture-rich, sulfate-free formula designed for dry hair. Keeps extensions hydrated without weighing them down.",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0052/8085/8198/files/wtlp58xhxuhbqhhvurck.jpg?v=1719320665",
  },
  {
    productName: "LOVE Smoothing Shampoo",
    brand: "Davines",
    score: 9,
    grade: "A",
    reason:
      "Gentle, sulfate-free cleanser that smooths frizz — ideal for textured or color-treated extensions.",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0052/8085/8198/files/Davines-75586UCL-LOVE-SMOOTHING-SHAMPOO-250ml-8004608298656-1.jpg?v=1770301795",
  },
  {
    productName: "DEDE Shampoo",
    brand: "Davines",
    score: 9,
    grade: "A",
    reason:
      "Lightweight daily shampoo — sulfate-free, pH-balanced, and safe for everyday extension wear.",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0052/8085/8198/files/097cee0442a4c26656948379f50adb40f2748f2e.jpg?v=1724093608",
  },
  {
    productName: "LOVE Curl Shampoo",
    brand: "Davines",
    score: 9,
    grade: "A",
    reason:
      "Sulfate-free curl-enhancing formula — defines texture without stripping moisture from curly extensions.",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0052/8085/8198/files/Davines-75524-love-curl-shampoo-250ml-8004608257097-1.jpg?v=1770301795",
  },
  {
    productName: "Perfect hair Day Shampoo",
    brand: "Living Proof",
    score: 9,
    grade: "A",
    reason:
      "Patented time-release cleansing tech — removes buildup gently without sulfates, keeping bonds and tape secure.",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0732/2039/1164/files/PDP-PhDShampoo-FS.png?v=1749574006",
  },
  {
    productName: "Restore Shampoo",
    brand: "Living Proof",
    score: 9,
    grade: "A",
    reason:
      "Repairs damaged strands with a sulfate-free, silicone-free formula — great for chemically-treated or well-worn extensions.",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0732/2039/1164/files/PDP-RestoreShampoo-FS.png?v=1749574864",
  },
  {
    productName: "No Frizz Shampoo",
    brand: "Living Proof",
    score: 9,
    grade: "A",
    reason:
      "Humidity-blocking yet sulfate-free. Smooths frizz on extensions without silicone buildup.",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0732/2039/1164/files/PDP-NoFrizzShampoo-FS.png?v=1749571299",
  },
  {
    productName: "Full Shampoo",
    brand: "Living Proof",
    score: 9,
    grade: "A",
    reason:
      "Adds body and volume without sulfates or heavy silicones — keeps fine extensions looking full and natural.",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0732/2039/1164/files/PDP-FullShampoo-FS.png?v=1749573237",
  },
  {
    productName: "Curl Shampoo",
    brand: "Living Proof",
    score: 9,
    grade: "A",
    reason:
      "Sulfate-free curl cleanser designed to preserve pattern and moisture — gentle enough for long-term extension care.",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0732/2039/1164/files/PDP-CurlShampoo-FS.png?v=1749569948",
  },
  {
    productName: "Ghost Shampoo",
    brand: "Verb",
    score: 9,
    grade: "A",
    reason:
      "Weightless, sulfate-free cleanser infused with moringa oil — ideal for keeping extensions shiny without buildup.",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0045/9790/7545/files/Verb_Ghost_Shampoo_Glass_Shelfie_Coral_1.jpg?v=1762440851",
  },
  {
    productName: "Hydrate Shampoo",
    brand: "Verb",
    score: 9,
    grade: "A",
    reason:
      "Deeply hydrating sulfate-free shampoo — perfect for keeping extensions soft, supple, and manageable.",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0045/9790/7545/files/0001s_0000s_0012_Verb_Hydrate_Shampoo_Glass_Shelfie_BlueJay_Single.jpg?v=1762440854",
  },
  {
    productName: "Bonding Shampoo",
    brand: "Verb",
    score: 9,
    grade: "A",
    reason:
      "Strengthening sulfate-free formula — reinforces hair's bond structure, which benefits both natural hair and extensions.",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0045/9790/7545/files/Verb_Bonding_Shampoo_Ultramarine_1.jpg?v=1772211421",
  },
  {
    productName: "Glossy Shampoo",
    brand: "Verb",
    score: 9,
    grade: "A",
    reason:
      "Shine-boosting, sulfate-free cleanser — keeps extensions glossy without weighing them down.",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0045/9790/7545/files/Verb_Glossy_Shampoo_Glass_Shelfie_Blue_Single.jpg?v=1762440853",
  },
];

/**
 * Pick `count` recommendations at random, excluding any whose brand+name
 * resembles the analyzed product so we don't recommend the same thing back.
 */
export function pickRecommendations(
  analyzedProductName: string | undefined,
  analyzedBrand: string | undefined,
  count = 3
): CuratedRecommendation[] {
  const needle = `${analyzedBrand ?? ""} ${analyzedProductName ?? ""}`
    .toLowerCase()
    .trim();

  const pool = CURATED_RECOMMENDATIONS.filter((rec) => {
    if (!needle) return true;
    const hay = `${rec.brand} ${rec.productName}`.toLowerCase();
    // Exclude exact-match on (brand+name) so we don't recommend the analyzed product itself.
    return !(needle.includes(hay) || hay.includes(needle));
  });

  // Fisher-Yates shuffle, then take top N (or the whole pool if smaller).
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
