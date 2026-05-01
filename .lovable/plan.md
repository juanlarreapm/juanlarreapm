## Preview the Rebrand at `/preview/editorial` Before Committing

Instead of changing your live site, I'll build the new "warm minimalist + outcome-first" design as a **standalone preview route** — exactly like the existing `/preview/terminal` and `/preview/8bit` routes. You can visit it, click around, share the URL with friends/mentors, and only after you approve will we roll it out to the real site.

---

### What gets built

A new route: **`/preview/editorial`**

It will be a fully styled, scoped preview that includes:

1. **Homepage** — new hero, proof strip, bento case studies, highlights, CTA
2. **About section** — editorial timeline of experience
3. **Case studies grid** — numbered bento layout
4. **New navbar + footer** — thin top bar, minimal footer

All on one scrollable page so you can see the whole new identity in one place. Internal links inside the preview will scroll to sections rather than navigating away (so the preview stays self-contained).

---

### How it stays isolated from your live site

Following the pattern of `src/styles/terminal-theme.css` and `src/styles/8bit-theme.css`:

- New file: **`src/styles/editorial-theme.css`** — all new color tokens, fonts, and utilities scoped under a `.editorial-theme` wrapper class
- New file: **`src/pages/preview/Editorial.tsx`** — the full preview page, wrapped in `<div className="editorial-theme">`
- New route added to `src/App.tsx`: `/preview/editorial`
- Real data: pulls your actual case studies, experiences, and bio from the database so it feels real
- **Zero changes** to `src/index.css`, `tailwind.config.ts` (except adding the Fraunces font family), the homepage, navbar, footer, or any existing page

Your live site at `/` keeps the current dark look. Nothing breaks.

The only shared change is loading the new font (Fraunces) in `index.html` — fonts are inert until used, so this won't affect the live site visually.

---

### What you'll see at `/preview/editorial`

```text
┌────────────────────────────────────────────────────────────┐
│ JUAN LARREA — PRODUCT             ABOUT  WORK  CONTACT  ◍ │
├────────────────────────────────────────────────────────────┤
│                                                            │
│   I take B2B SaaS                       ◍ Currently        │
│   from 0 to 1 —                           shipping at      │
│   then to scale.                          PartsTech        │
│                                                            │
│   Senior PM. 8 years. 5 industries.                        │
├────────────────────────────────────────────────────────────┤
│  08          05            12+           $XXM              │
│  YEARS       INDUSTRIES    LAUNCHES      ARR INFLUENCED    │
├────────────────────────────────────────────────────────────┤
│  SELECTED WORK                              ALL WORK →     │
│  ┌──────────────────────┐  ┌─────────────┐                │
│  │ 01 / PartsTech       │  │ 02 / ...    │                │
│  │ [outcome metric XL]  │  └─────────────┘                │
│  │                      │  ┌─────────────┐                │
│  │                      │  │ 03 / ...    │                │
│  └──────────────────────┘  └─────────────┘                │
├────────────────────────────────────────────────────────────┤
│  EXPERIENCE                                                │
│  2024 — now    PartsTech       Senior PM      [outcome]    │
│  2022 — 2024   Nordstrom       PM             [outcome]    │
│  ...                                                       │
└────────────────────────────────────────────────────────────┘
```

On a warm bone background, in Fraunces serif, with terracotta as the only accent color.

---

### After you review

You'll have three clean options:
1. **Ship it** — I migrate the design out of `/preview/editorial` into your real site (replacing `index.css` tokens, Hero, FeaturedCaseStudies, Navbar, Footer, About, etc.)
2. **Iterate** — tell me what to tweak (color, type, layout, copy) and I update the preview route until it's right
3. **Reject** — we delete the preview files and your live site is unchanged

---

### Files I'll create / touch

| File | Action |
|---|---|
| `src/pages/preview/Editorial.tsx` | **New** — the full preview page |
| `src/styles/editorial-theme.css` | **New** — scoped tokens, fonts, utilities |
| `src/App.tsx` | Add one route: `/preview/editorial` |
| `index.html` | Add Fraunces font link (inert until used) |

That's it. No risk to the current site.

---

### One thing to confirm

The proof-strip numbers (years / industries / launches / ARR influenced) — I'll start with placeholders pulled from what's on your site already (8 years, 5 industries) and put `12+` and `$XXM` as obvious placeholders. After you see the preview, you can tell me the real numbers and whether to wire them into the admin panel.

Approve this and I'll build the preview route so you can see the new direction live before any commitment.
