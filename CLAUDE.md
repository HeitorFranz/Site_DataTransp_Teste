# Datatransp website

Marketing site for DataTransp (transport companies and fleet operators). Astro 7 static output with React 19 islands, deployed to Vercel at https://datatransp.com.br. Site copy is in Brazilian Portuguese.

## Commands

- `npm run dev` — local dev server
- `npm run build` — static build into `dist/`
- `npm run typecheck` — `astro check` on the whole site, including `.astro` files
- `vercel dev` — the only way to exercise `api/contact.ts` locally; `astro preview` does not run Vercel functions

## Layout

- `src/data/empresa.ts` — single source for company info, navigation, modules, integrations, testimonials and news (`newsItems`). Pages under `src/pages/funcionalidades/`, `integracoes/` and `novidades/` generate their `[slug]` routes from these arrays, so new content goes here, not in page files.
- `src/data/depoimentos.ts` — customer testimonials (home and /clientes), from the Oct 2026 satisfaction survey. Respect each client's consent: show name/role only for those who allowed it, logo only if authorized. Logos live in `public/clientes/` as WebP.
- `src/pages/novidades/feed.xml.js`, `sitemap.xml.ts`, `robots.txt.ts` — generated from the same data.
- `src/styles/tokens.css` — brand colors (red `--brand-red`, navy `--brand-navy`) and design tokens. Use the tokens; don't hard-code colors.
- `src/layouts/SiteLayout.astro` wraps every page (pass `bodyClass` for page-specific styling); `src/components/layout/` holds Header and Footer.
- Home page: `src/components/home/*` sections, `src/styles/home.css` (classes prefixed `dt-`), `src/scripts/home-map.ts` (canvas map) and `src/scripts/home-motion.ts` (GSAP ScrollTrigger/SplitText + Lenis). Animations must keep content readable without JS and under `prefers-reduced-motion`.
- Fonts: Archivo (headings) and Barlow (body), loaded in `SiteLayout.astro`.
- `api/contact.ts` — Vercel serverless endpoint for both contact forms (nodemailer/SMTP, same-origin check, honeypot, consent, in-memory rate limit).
- `vercel.json` — `.html` → clean-URL redirects and security headers. Keep the redirects when renaming routes.
- `docs/` — PRODUCT.md (content rules), market research and draft testimonials; not part of the build.

## Content rules (see docs/PRODUCT.md)

- Never invent company metrics, customer quotes or logos, cities, staff profiles, integration specs, screenshots, social URLs or service hours. Use only content already in the repo or explicitly approved by the user.
- Don't present illustrative statuses or sample values as live product data.
- Copy decisions from the owner (Oct 2026): call the product just "DataTransp", never "DataTransp ERP" or "ERP". Don't show client counts, team size, city counts or state lists ("7 estados + DF"); say the company serves transport companies "em todo o Brasil".
- Keep existing routes, navigation labels, legal pages and contact destinations.
- Contact forms: keep field names, order, consent checkbox, validation and submission behavior unchanged.
- Keep the Datatransp name, logo and red/navy palette. Preserve responsive navigation, keyboard access and visible focus.

## Secrets

SMTP credentials live only in a local `.env` (gitignored) and in Vercel project settings. Never commit or edit `.env`; document new variables in `.env.example`. A project hook blocks Claude from writing `.env*` files and `package-lock.json`, another runs `astro check` on each edited `.ts`/`.tsx`/`.astro` file, and a Stop hook runs `npm run build` at the end of each turn. The `visual-qa` subagent checks a page in Chrome (mobile and desktop) via the chrome-devtools MCP.
