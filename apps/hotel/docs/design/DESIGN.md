# DESIGN.md — {{HOTEL_NAME}}, Mykonos

> **An ultra-luxury, dramatic identity for a boutique Mykonos hotel.**
> Read top to bottom before building UI. Every section maps to a real token in
> `theme.css` (Tailwind v4 `@theme`) and `tokens.ts`. **When this doc and the code
> disagree, the code wins** — fix the doc.

**Replace before building** (search whole repo): `{{HOTEL_NAME}}` · `{{TAGLINE}}`.
Location is fixed: **Mykonos, Cyclades.** There is no prior brand — this identity is
authored from scratch.

**Golden rule:** components use **semantic tokens only** (`bg-surface`, `text-muted`,
`bg-cta`…). **Never** hard-code a hex and never use a primitive (`bronze-400`) in a
component. That indirection is what makes the light/dark "bands" (§0) work automatically.

---

## 0. The concept: chiaroscuro

Mykonos is a place of extreme contrast — blinding whitewashed cubes against a near-black
night sea, brass lanterns glowing in deep shadow. **That contrast is the whole design.**

The site is **dark by default** — cinematic onyx, the way the island looks at dusk — and
"dawns" into **whitewashed light bands** for the long-form storytelling sections, before
sinking back into dark. Light and dark alternate like day and night on the island.

The mechanism: any section can be wrapped in **`.band-light`** to flip to whitewash, or left
as-is for the default dark. **The same components work in both** because they read semantic
tokens that the band remaps (see §10). You never write two versions of a card.

Three materials carry the identity:
- **Onyx** — deep cinematic night. The default surface; drama and restraint.
- **Lime / whitewash** — the Cycladic glare. Light bands and all text-on-dark.
- **Bronze** — aged brass. The single metallic luxury signal: hairlines, eyebrows, the
  dark-band CTA. Used sparingly; metals read expensive only when rare.

…with **Aegean** blue as the cool structural counterpoint and a whisper of **sunset amber**
for warmth. Ultra-luxury means **restraint**: one accent in view, vast negative space.

### Why this isn't the generic "dark page + one neon accent"
That look is a known AI default. We're off it because (a) the accent is an **aged metallic**,
not a bright hue; (b) the page is **chiaroscuro**, not uniformly dark — the light bands are
half the design; (c) the palette is layered (onyx + lime + aegean + bronze + amber from real
Mykonian materials), not "black + one colour"; and (d) drama comes from **contrast and space**,
not glow effects.

---

## 1. Visual theme & atmosphere

| Aspect | Direction |
|---|---|
| Mood | Cinematic, nocturnal, sensual, expensive. Quiet confidence, never loud. |
| Density | Very low. Enormous negative space. One idea per screen. |
| Contrast | High and deliberate — onyx ↔ whitewash. This *is* the drama. |
| Voice | Sparse, literary, assured. Few words, perfectly chosen. Sentence case. |
| Imagery | Full-bleed, cinematic, often dark/moody (dusk, candlelight, sea at night). |
| Restraint | One bronze accent per viewport. One signature (§9). When unsure, remove. |

---

## 2. Colour palette & roles

Source of truth is **OKLCH in `theme.css`**; hex shown here for designers. Use the
**semantic** class in code. Semantic tokens **flip** between dark (default) and `.band-light`.

### Semantic roles (use THESE)

| Token | Role | Dark default → | `.band-light` → |
|---|---|---|---|
| `surface` | Page background | onyx-950 `#0D1214` | lime-50 `#F7F4EE` |
| `surface-raised` | Cards, modals | onyx-800 `#1A252A` | white `#FFFFFF` |
| `surface-sunken` | Subtle insets | onyx-900 `#121A1D` | lime-100 `#EFEAE0` |
| `text` | Primary text & headings | lime-50 `#F7F4EE` | ink-900 `#211D17` |
| `text-muted` | Secondary text (AA ✓) | lime-300 `#CFC4AE` | stone-600 `#6A5E49` |
| `text-subtle` | Decorative/large only | onyx-500 `#4A5C63` | stone-500 `#8A7C66` |
| `primary` | Links, structure | aegean-400 `#4E92A8` | aegean-600 `#266479` |
| `accent` | Metallic accent (hairlines, eyebrows) | bronze-300 `#D9BC8E` | bronze-700 `#7C5630` |
| `cta` | **CTA button fill** | bronze-400 `#C8A06D` | onyx-900 `#121A1D` |
| `cta-text` | Text on the CTA | onyx-950 `#0D1214` | lime-50 `#F7F4EE` |
| `highlight` | Sunset amber, very sparing | amber-500 `#D2843B` | amber-500 `#D2843B` |
| `border` | Hairlines, dividers | onyx-700 `#233138` | lime-200 `#E2DACB` |
| `border-strong` | Emphasis borders | onyx-600 `#324249` | lime-300 `#CFC4AE` |
| `ring` | Focus ring | bronze-400 `#C8A06D` | aegean-500 `#347E96` |

### Accessibility (verified — keep it true)
- Text on dark (lime-50 / onyx-950) → **17:1**. On light (ink-900 / lime-50) → **15:1**. ✓
- `text-muted`: 10:1 on dark, 5.8:1 on light. ✓ Safe for captions.
- `text-subtle`: low-contrast on purpose — **large/decorative only**, never body.
- **CTA: dark-band = onyx text on bronze (7.8:1); light-band = lime text on onyx (16:1). ✓**
  Never put white text on a light bronze fill — that fails AA. (That's exactly why the
  light-band CTA is onyx, not bronze.)
- Bronze as *accent text*: use bronze-300 on dark, bronze-700 on light (5.9:1). ✓

---

## 3. Typography

Two families. **Both must include the Greek subset** — the site is bilingual (`el`/`en`) and a
missing subset silently breaks half the copy.

| Role | Family | Why |
|---|---|---|
| Display / headings | **Playfair Display** | high-contrast Didone — glamorous, dramatic, luxe; has Greek |
| Body / UI | **Inter** | calm, neutral; lets the serif perform; has Greek |

Load with `next/font/google`, **`subsets: ['latin', 'greek']`**, `display: 'swap'`. Set body
Inter slightly light (weight 400) with mild tracking for a refined register.

### Type scale
Build in `rem`; `px` for intuition. Display sizes use `clamp()` (fluid, no media queries).
Tokens match `--text-*` in `theme.css`.

| Token | Font | Desktop | clamp() | Line height | Weight | Use |
|---|---|---|---|---|---|---|
| `display-xl` | Playfair | 80px / 5rem | `clamp(3rem, 7vw + 1rem, 5rem)` | 1.02 | 500 | Hero |
| `display-lg` | Playfair | 60px / 3.75rem | `clamp(2.5rem, 5vw + 1rem, 3.75rem)` | 1.08 | 500 | Section openers |
| `h1` | Playfair | 44px / 2.75rem | `clamp(2.25rem, 3vw + 1rem, 2.75rem)` | 1.12 | 600 | Page titles |
| `h2` | Playfair | 32px / 2rem | — | 1.2 | 600 | Headings |
| `h3` | Playfair | 24px / 1.5rem | — | 1.3 | 600 | Card titles |
| `quote` | Playfair italic | 32px / 2rem | `clamp(1.75rem, 3vw, 2rem)` | 1.35 | 500 | Pull-quotes (signature) |
| `lead` | Inter | 20px / 1.25rem | — | 1.7 | 400 | Intro paragraph |
| `body` | Inter | 17px / 1.0625rem | — | 1.75 | 400 | **Default prose** |
| `body-sm` | Inter | 15px / 0.9375rem | — | 1.6 | 400 | Dense UI, meta |
| `eyebrow` | Inter | 13px / 0.8125rem | — | 1.2 | 600 | Uppercase label |
| `caption` | Inter | 13px / 0.8125rem | — | 1.5 | 400 | Image captions |

**Eyebrows:** uppercase, `letter-spacing: 0.18em` (wide = luxury), colour `accent` (bronze).
**Measure:** prose capped at **62ch**. Never run body text full width.

---

## 4. Component styling

The contract. Build with shadcn primitives restyled by our tokens (§10). States:
default → hover → focus-visible → active → disabled. Because tokens flip per band, **specs
below work in both dark and light automatically.**

### Buttons
| Variant | Default | Hover | Focus-visible |
|---|---|---|---|
| **Primary (CTA)** | `bg-cta text-cta-text`, `rounded-md`, `px-7 py-3.5`, Inter 600, tracking 0.02em | `bg-cta-hover`, subtle lift | 2px `ring` offset 2px |
| **Outline** | transparent, `1px border-strong`, `text`, same padding | `border` → `accent` (bronze) | same ring |
| **Ghost** | transparent, `text` | `bg-surface-sunken` | same ring |
| **Link** | `text-primary`, underline-offset 3 | `text` + bronze underline | underline + ring |

- Min height **48px** (luxe targets run a touch larger). Disabled: 40% opacity.
- CTAs are quiet: e.g. "Reserve", "Enquire" — never "BOOK NOW!!". Verb stays through the flow.

### Cards (Room, Offer, Testimonial)
- `bg-surface-raised`, `rounded-lg`, `1px border`. On dark, lift via border + `shadow-glow`;
  on light, `shadow-1`. Hover (interactive): rise 4px + stronger shadow, `--duration-base`.
- Image top, fixed aspect (3:2 or 4:5 for rooms), `rounded-t-lg`, **no CLS** (set dimensions).
- Inside: `eyebrow` → `h3` → `body-sm` → footer (PriceTag + Outline button).
- **PriceTag:** Inter 600 `text`; "from €…" prefix in `text-muted`. Prices are never bronze —
  price is information, not the CTA.

### Inputs (contact / enquiry)
- `bg-surface-sunken`, `1px border`, `rounded-md`, `px-4 py-3.5`, Inter `body`.
- Focus: `border` → `ring` + 2px ring. Error: `border` amber + helper text. Label above, 600.

### Header / nav
- Transparent over the hero; gains `bg-surface/90` + backdrop blur + hairline `border` on
  scroll. Logo left (Playfair or wordmark), sparse nav centre/right in `body-sm` `text`,
  `LanguageSwitcher` + one Primary "Reserve" CTA far right. Mobile → drawer below `lg`.

### Badges / tags
- `1px accent` (bronze) outline + `eyebrow` type, `rounded-full`, `px-3 py-1`. Sparse:
  "Private pool", "Sea view".

### Accordion (FAQ) — typically inside a `.band-light` section
- `body` question (600) + bronze chevron; `1px border` rows. Open answer in `text-muted`,
  height animates `--duration-base`. Full keyboard + ARIA.

### StarRating
- Filled stars `highlight` (amber), empty `border-strong`. Decorative stars `aria-hidden`;
  expose the number ("4.9 out of 5").

---

## 5. Layout principles

- **Spacing (4px rhythm):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160, 200. Tailwind
  defaults match.
- **Section rhythm (ultra-luxury = tall):**
  - `--space-section` = `clamp(5rem, 10vw, 9rem)`
  - `--space-section-lg` = `clamp(7rem, 14vw, 12rem)` (hero, feature, full-bleed)
- **Containers:** prose `62ch` · content `max-w-[1180px]` · imagery **full-bleed**.
- **Grid:** 12-col desktop, 32px gutter. Rooms/gallery 2–3 up desktop → 1 up mobile.
- **Whitespace philosophy:** space *is* the luxury. Crowding kills this identity faster than
  any colour mistake.

---

## 6. Depth & elevation

Drama comes from **contrast and light**, not heavy shadows.

| Token | Value | Use |
|---|---|---|
| `shadow-1` | `0 1px 2px rgba(13,18,20,.18), 0 4px 16px rgba(13,18,20,.14)` | Cards on **light** bands |
| `shadow-2` | `0 8px 30px rgba(13,18,20,.22)` | Hover / raised on light |
| `shadow-3` | `0 20px 60px rgba(13,18,20,.30)` | Modal, lightbox |
| `shadow-glow` | `0 0 0 1px var(--color-border), 0 8px 40px rgba(0,0,0,.45)` | Elevation on **dark** bands |

On dark, prefer a **hairline border + faint glow** over a drop shadow (shadows vanish on
near-black). Reserve a soft bronze glow only for the single hero focal point, if at all.

**Radius — architectural, restrained (not pill-everything):**
| Token | Value | Use |
|---|---|---|
| `radius-sm` | 4px | inputs, chips |
| `radius-md` | 8px | **buttons**, inputs |
| `radius-lg` | 14px | cards |
| `radius-xl` | 24px | feature media |
| `radius-full` | 9999px | avatars, dots, tag pills only |

---

## 7. Motion

Slow, weighted, cinematic — like a film, not a web app. Sophistication reads as *patience*.

- **Durations:** `fast` 180ms (hover) · `base` 280ms · `slow` 450ms · `deliberate` 650ms
  (scroll reveals, hero).
- **Easing:** `standard` `cubic-bezier(.2,0,0,1)` · `entrance` `cubic-bezier(0,0,0,1)` ·
  `exit` `cubic-bezier(.3,0,1,1)`.
- **Scroll reveals:** fade + rise **24px**, `deliberate` + `entrance`, **stagger ~90ms**.
  IntersectionObserver + CSS only (no animation library). See `tokens.ts` `useReveal()`.
- **Band transitions:** when a dark section meets a light one, let imagery bleed across the
  seam; don't hard-cut with a coloured divider.
- **Hero:** slow subtle parallax / ken-burns drift only. No autoplay video at launch.
- **`prefers-reduced-motion: reduce` → no transforms/parallax; opacity fades or nothing.**
  Hard requirement.

---

## 8. Responsive behaviour

- **Breakpoints (Tailwind):** `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280.
- Display type is `clamp()`-fluid (§3). Nav → drawer below `lg`. Grids → single col below `md`.
- Touch targets ≥ **48×48px**; tap spacing ≥ 8px.
- Section padding shrinks via the `clamp()` tokens — no manual mobile overrides.
- **Test Greek layout:** Greek strings often run longer than English; don't pin widths to
  English length, and check Playfair Greek glyphs render at display sizes.

---

## 9. Signature element

**One** memorable thing, tied to Mykonos, consistent across the page:

> **Chiaroscuro + the bronze horizon.** The page descends through dark and light like the
> island's day and night, and at the top of each section sits a single **bronze hairline rule**
> under a wide-tracked eyebrow — a "brass horizon." The property's story runs as oversized
> **Playfair italic pull-quotes** (`quote` token) breaking the dark, lit like a line of text
> caught in lamplight.

Do **not** add 01 / 02 / 03 section numbers — the sections aren't a sequence, so numbering
would be decoration. The drama is the light, not ornament.

---

## 10. Implementation handoff (read me, junior dev)

### How the three files fit together
- **`theme.css`** — source of truth. Primitives (OKLCH) → semantic tokens fed to Tailwind v4
  via `@theme` / `@theme inline`, so `bg-surface`, `text-accent`, `bg-cta`, `rounded-md`,
  `shadow-1`, `font-display`, `text-display-xl` all work as utilities.
- **`tokens.ts`** — typed module for what CSS can't own: **motion values used by JS** (the
  reveal observer) and **type-safe semantic-token names**.
- **`DESIGN.md`** (this file) — the human/agent spec. Keep in sync.

### The band system (this is the important part)
The page is **dark by default.** To make a section whitewash, add **`.band-light`** to it:

```tsx
<section className="bg-surface text-text">…dark by default…</section>
<section className="band-light bg-surface text-text">…now whitewash…</section>
```

`bg-surface`/`text-text`/`bg-cta` etc. resolve to **different values** inside `.band-light`
because the semantic CSS variables are remapped there (see `theme.css`). **Write each
component once** — never a dark and a light copy.

### shadcn restyle (once, in `theme.css`)
shadcn's `--background`, `--foreground`, `--primary`, `--border`, `--ring`, `--radius` are
pointed at our semantic tokens — and they flip in `.band-light` too. So
`npx shadcn@latest add button|dialog|accordion…` arrives wearing this identity in both bands.

### Build order
1. Add `theme.css` + `tokens.ts`. Confirm **Playfair + Inter load with the Greek subset.**
2. Build a dev-only `/styleguide` route (`noindex`): every swatch, the type scale, buttons in
   all states, a card, the same card inside `.band-light`, shadows, a motion demo. If the
   showcase reads right in **both bands**, sections will too.
3. Wire shadcn; add Button + Dialog; verify they inherit tokens in both bands.
4. Then build sections (dark Hero → light About story → dark Rooms → …).

### Definition of done (every component)
- Semantic tokens only — grep the file for `#`; there should be **zero** hex.
- Looks correct in **both** the default dark band and inside `.band-light`.
- Visible keyboard focus (`ring`), full keyboard operability, correct ARIA.
- Works in `el` and `en`.
- Respects `prefers-reduced-motion`. No layout shift (images have dimensions).

---

## 11. Agent / quick-prompt reference

**Palette one-liner:** dark cinematic onyx by default, whitewashed lime light bands for
reading, aged bronze as the single metallic accent and dark-band CTA, Aegean blue for
structure, a whisper of sunset amber. High contrast = the drama.

**Type one-liner:** Playfair Display (dramatic Didone, Greek-capable) + Inter body (calm),
fluid `clamp()` headings, wide-tracked bronze eyebrows, 62ch measure.

**Prompt for a coding agent:**
> "Use DESIGN.md. Build {SECTION} as a thin organism over the content adapter. Semantic
> tokens only — no hex, no primitives. The page is dark by default; wrap reading sections in
> `.band-light`. Playfair Display headings, Inter body. Bronze is the only accent and is rare.
> Cinematic full-bleed imagery, vast negative space. IntersectionObserver + CSS scroll reveals
> (fade + rise 24px, 90ms stagger) that respect prefers-reduced-motion. Keyboard-accessible,
> no CLS, works in el and en."

**Do**
- Let darkness and whitewash alternate; let imagery bleed across the seam.
- Keep one bronze accent per viewport; let space do the work.
- Use Playfair for voice, Inter for wayfinding; quiet, assured copy.

**Don't**
- Use pure black/white, or a bright/neon accent.
- Make everything a pill, or add a second accent to fight the bronze.
- Crowd a section to get "more above the fold." Autoplay video. Shout in CTAs.
