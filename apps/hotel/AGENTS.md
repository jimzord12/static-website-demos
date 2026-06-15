# Tier S (Small) Promotional Site

You are building **one promotional website** for a small local business. This site is produced by a repeatable "software factory": every site follows the same conventions so its shared parts can later be extracted into a reusable scaffold. **Follow the conventions exactly** — deviation breaks extraction and the quality gates.

---

## Per-site values to fill

Replace these before/while building. Never hard-code business data in components — it lives in `content/`.

- `{{BUSINESS_NAME}}` — display name
- `{{BUSINESS_TYPE}}` — e.g. restaurant, accountant, travel agency, small hotel
- `{{DOMAIN}}` — production domain
- `{{NAP}}` — name, address, phone (drives LocalBusiness schema + contact section)
- `{{BRAND_TOKENS}}` — colors, fonts, radii (see Design tokens)

---

## What we're building

A fast, accessible, bilingual (Greek/English) **promotional** site — typically 5–10 pages (home, about, services/menu, gallery, contact). It markets the business; it is **not** a web app. No user accounts, no dashboards, no database. Content is editor-curated and ships with the site.

---

## Tech stack (locked — do not substitute)

- **Next.js** (App Router)
- **TypeScript** — `strict` on, no `any`, no non-null assertions to dodge types
- **Tailwind v4** — CSS-first config via `@theme`; no `tailwind.config.js` for tokens
- **Shadcn** primitives — all UI is built on these, restyled with the design tokens
- **Zod** — every external/content input is parsed through a schema

Do not add UI kits, CSS-in-JS, state libraries, ORMs, or component frameworks. If you think you need one, you don't — ask first.

---

## Tier S constraints

- **Static-first.** The site statically renders/exports. No SSR-on-request, no databases, no admin UI.
- **Content is JSON.** The developer edits JSON by hand; there is no CMS. Do not build editing interfaces.
- **Host: Cloudflare Pages.**
- **The only permitted server code** is the contact-form handler (a single Cloudflare Pages Function / route handler that calls Resend). Everything else is static.

---

## Architecture & structure

- `content/` — all site content as JSON (per-locale), validated by Zod schemas.
- Content is consumed through a **`ContentRepository` interface** via a `JsonFileAdapter`. Pages/components read content **through the adapter**, never by importing JSON directly. This keeps a clean seam for a future headless-CMS adapter (Tier M).
- `components/` — presentational; receive typed, already-parsed data as props. No data fetching inside leaf components.
- Keep business data out of code. A component should render any valid content object of its type.

---

## Content & i18n

- **Greek + English are both first-class.** No hard-coded user-facing strings in components — all copy comes from locale content.
- Locale structure must make **adding a third language trivial** (drop in a new locale file; no code changes).
- Every content model has a Zod schema; invalid content fails loudly at build, not silently at runtime.

---

## SEO (required on every page)

- Next.js `metadata` API — unique title/description per page.
- `sitemap.xml` and `robots.txt` generated.
- `og:image` per page (sensible default).
- **LocalBusiness** structured data (JSON-LD) built from `{{NAP}}` — this is the correct schema type for these businesses. Do **not** use Product/Article schema.

---

## Design tokens

- Brand identity lives in **design tokens** (colors, typography, spacing, radii) defined in CSS `@theme`, set **before** building components.
- Components consume tokens; they never hard-code hex values or font names.
- Tokens are per-site (`{{BRAND_TOKENS}}`); structure is shared.

---

## Forms & integrations

- Contact form: validated with **Zod**, submitted to the single serverless handler, sent via **Resend**. Include spam protection (honeypot + basic rate limiting).
- **EU cookie consent** + analytics placeholder. Analytics tag fires only after consent. (Analytics provider is set per-site config.)

---

## Quality bar — Definition of Done

The site is not done until **all** of these pass automatically:

- [ ] **Lighthouse CI** — performance/SEO/best-practices budgets met; Core Web Vitals green.
- [ ] **Accessibility** — axe / Lighthouse a11y clean; keyboard-navigable; visible focus; semantic HTML.
- [ ] **Security headers** — A on securityheaders.com.
- [ ] **`npm audit`** — zero high/critical.
- [ ] **Playwright E2E** — contact-form submission, primary CTA/nav paths, mobile navigation.
- [ ] **Build is green** — TypeScript strict passes, all content validates against its Zod schemas.
- [ ] Bilingual (GR/EN) complete; language switcher works.
- [ ] Deploys cleanly to Cloudflare Pages.

---

## Hard "do not" list

- Don't hard-code copy, business data, or colors in components.
- Don't import JSON content directly — go through the adapter.
- Don't add libraries outside the locked stack without asking.
- Don't introduce server-rendered-on-request routes, databases, or an admin UI.
- Don't use Product/Article structured data — LocalBusiness only.
- Don't ship anything that fails a quality gate "for now."
- Don't silence type or schema errors to make a build pass.
