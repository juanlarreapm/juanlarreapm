## Two new preview routes to compare

You'll get two scoped, self-contained preview pages — same pattern as `/preview/editorial`, `/preview/terminal`, `/preview/8bit`. Live site stays untouched.

- **`/preview/swiss`** — Swiss / Brutalist Grid
- **`/preview/quiet`** — Soft Neutral Minimal

Both pull real data from your database (case studies, experiences) so they feel real, not lorem-ipsum.

---

### Direction 1 — Swiss / Brutalist (`/preview/swiss`)

**Vibe**: A printed annual report from a design-forward agency. Loud, confident, typographic.

**Palette**
- Background: pure white `#FFFFFF`
- Ink: true black `#0A0A0A`
- One accent: electric blue `#1F3DFF` (used sparingly — single links, one underline)

**Typography**
- Display: a heavy grotesque (Inter Display 900 or similar) at huge sizes — `clamp(80px, 14vw, 220px)` headlines
- Body: same grotesque at 14px, tight leading
- Mono labels: JetBrains Mono 10px UPPERCASE for section markers like `01 / WORK`

**Layout signals**
- Hard 12-column grid, visible hairline rules between sections
- Numbered sections (`§01`, `§02`) with footnote-style annotations in the margin
- Headline breaks across multiple lines intentionally, with one word in the accent color
- Asymmetric: huge left-aligned type, then dense small-print metadata column on the right
- No rounded corners, no shadows, no gradients — ever

**Hero sketch**
```text
§01 ——————————————————————————————————————————
                                          NEW YORK / REMOTE
B2B SAAS                                  AVAILABLE Q3 2026
PRODUCT                                   ──────────────
MANAGER                                   8 YRS · 5 INDUSTRIES
WHO SHIPS.                                12+ LAUNCHES
                                          $XXM ARR INFLUENCED
——————————————————————————————————————————
```

---

### Direction 2 — Soft Neutral Minimal (`/preview/quiet`)

**Vibe**: A calm, considered personal site. Minimalist but warm. Confident through restraint.

**Palette**
- Background: off-white `#F7F5F1` (warm paper)
- Ink: deep slate `#1B2024`
- Muted text: `#6B7077`
- Accent: muted sage `#7A8C7E` (only for the one current-status indicator and hover states)

**Typography**
- Display: a refined sans (Söhne / General Sans / Inter at light weight) at modest sizes — `clamp(40px, 6vw, 72px)`
- Body: same sans, 16px, generous 1.7 leading
- No mono, no serifs — single typeface, multiple weights

**Layout signals**
- Single narrow column, max-width 640px, centered
- Massive vertical whitespace between sections (200px+)
- Hairline dividers in `#E4E0DA`
- No grid lines, no numbering, no decoration
- Case studies as a quiet list — title, one-line outcome, year. Hover reveals more.

**Hero sketch**
```text


              ● open to new roles


              Juan Larrea

              Senior PM. I help B2B SaaS
              companies go from zero to one,
              then grow it.



              Currently shipping at PartsTech →


```

---

### What I'll build

| File | Action |
|---|---|
| `src/styles/swiss-theme.css` | New — scoped `.swiss-theme` tokens, type, grid utilities |
| `src/styles/quiet-theme.css` | New — scoped `.quiet-theme` tokens, type |
| `src/pages/preview/Swiss.tsx` | New — full one-page preview, real data |
| `src/pages/preview/Quiet.tsx` | New — full one-page preview, real data |
| `src/App.tsx` | Add two routes: `/preview/swiss`, `/preview/quiet` |
| `index.html` | Add one font (General Sans or similar) if needed |

Each preview includes: hero, proof strip / metrics, selected work (real case studies), experience timeline (real experiences), and a closing CTA. Internal links scroll within the page so the preview stays self-contained.

**Zero changes** to your live site, `index.css`, navbar, footer, or existing pages.

---

### After you review

1. **Pick a winner** — I migrate that direction into the real site (replace tokens, hero, case studies, navbar, footer, about)
2. **Iterate on one** — tweak palette, type, copy, layout
3. **Mix** — e.g. "Swiss type, Quiet palette" — I build a v2 preview combining them
4. **Reject both** — we delete the preview files and try a different direction

Approve and I'll build both previews so you can compare them live.