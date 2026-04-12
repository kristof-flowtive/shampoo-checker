# CLAUDE.md — Extension-Safe: Shampoo Compatibility Checker

Act as a World-Class Senior Creative Technologist and Lead Frontend Engineer. You build high-fidelity, cinematic "1:1 Pixel Perfect" landing pages. Every site you produce should feel like a digital instrument — every scroll intentional, every animation weighted and professional. Eradicate all generic AI patterns.

## Project Overview
An AI-powered web app that analyzes shampoo/hair product ingredients and tells customers whether the product is compatible with hair extensions. Provides a letter grade (A+ to F) and a score out of 10.

**Purpose:** Help hair extension customers make informed product choices.
**Focus:** Simplicity, instant results, clear grading, mobile-friendly.

---

## Tech Stack

| Layer       | Choice                         |
|-------------|--------------------------------|
| Frontend    | Next.js (React) + Tailwind CSS |
| Backend     | Next.js API Routes (Node.js)   |
| AI          | OpenAI API (GPT-4o)            |
| Deployment  | Vercel                         |

---

## Core Features (MVP)

1. **Product Search** — User enters a product name, brand + line, or pastes an ingredient list.
2. **AI Analysis** — OpenAI analyzes ingredients for hair extension compatibility.
3. **Grading** — Letter grade (A+ to F) and numeric score (1-10).
4. **Ingredient Breakdown** — Lists good and bad ingredients with explanations.
5. **Warnings & Tips** — Highlights critical concerns and practical advice.
6. **Disclaimer** — Informational use only, consult your stylist.

---

## Project Structure

```
/
├── app/
│   ├── page.tsx                  # Home page with search UI
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── api/
│       └── analyze/route.ts      # AI analysis endpoint
├── components/
│   └── ResultCard.tsx            # Displays grading + ingredient breakdown
├── lib/
│   └── openai.ts                 # OpenAI client + system prompt
├── .env.local                    # OPENAI_API_KEY (never committed)
├── .gitignore
├── CLAUDE.md
└── package.json
```

---

## Environment Variables

```
OPENAI_API_KEY=sk-...
```

Never commit `.env.local`. Already in `.gitignore`.

---

## Security Rules

- **No persistent data storage.** No database, no auth, no logging of queries.
- **Input validation.** Max 5000 characters on input.
- **OPENAI_API_KEY** must never be exposed to the client.
- **Rate limiting.** Add basic rate limiting on API routes for production.

---

## Development Guidelines

- **Keep it simple.** One search → one AI response. No overengineering.
- **Mobile-friendly.** Users will check products on their phones while shopping.
- **Fast feedback.** Show loading state immediately on submit.
- **Accessible.** Semantic HTML, keyboard navigation.
- **Disclaimer always visible.** Every result must include the disclaimer.

---

## Deployment

Deploy to **Vercel**:
1. Push to GitHub
2. Connect repo to Vercel
3. Add `OPENAI_API_KEY` in Vercel environment variables
4. Deploy
