## Sahil Case Studies + Lab — annotated index cards

### Problem
The current `sh-list` row (year · title · meta) feels thin and database-y. It doesn't pitch the work, has no visual hierarchy, and treats Case Studies and Lab identically as tiny one-liners.

### New pattern: annotated index cards
A vertical stack of generously sized, text-led entries separated by a hairline. No grid, no cover images. Each entry reads like a short editorial note — title-first, with a one-sentence pitch, a single hero stat pulled to the side, and a quiet meta row underneath.

```text
work
Case studies.
Twelve products, five industries, eight years…

────────────────────────────────────────────────
PartsTech                    2022 — Present
Rebuilding how independent
shops buy parts.                       3.4×
A new buyer experience shipped     weekly
to 8k shops in 6 months.          buyers
discovery · b2b marketplace · 0→1     →
────────────────────────────────────────────────
Intellum                          2020 — 2022
…
```

### Layout per card (≥ 720px)
- Two columns: left ~70% (text), right ~30% (hero stat, right-aligned).
- **Eyebrow**: company name, small caps, muted — `12px`, tracking `0.08em`.
- **Title**: `clamp(24px, 2.6vw, 32px)`, Fraunces 500, ink color, link target.
- **Pitch**: 1–2 lines from `description` (line-clamp 2), `sh-body` size, slight muted tint.
- **Meta row**: `tags` joined by `·`, plus year/period on the right edge, both `13px` muted.
- **Hero stat (right column)**: first item from `metrics` (Case Studies) or first `tech_stack` item / `status` (Lab). Big number + small label, right-aligned, accent color on the number. If no metric, the right column collapses and text goes full width.
- **Arrow affordance**: small `→` after the title that slides 4px on hover, accent color.

### Mobile (< 720px)
- Single column. Hero stat moves above the title as an inline accent line ("3.4× weekly buyers ·"), or is hidden if it would crowd. Period drops to the meta row.
- Padding tightens, hairline stays.

### Differences between Case Studies and Lab
Same component, different copy mapping (per the user's choice "same layout, different tone"):
- **Case Studies**: eyebrow = `company`, hero stat = `metrics[0]`, meta = `industry` + first 2 `tags`, year = `created_at`.
- **Lab**: eyebrow = `status` (e.g. "active", "archived" — small caps, muted; "active" gets accent dot), hero stat = `tech_stack[0]` rendered as a small monospace chip instead of a number, meta = remaining tech stack joined by `·`, year = `project_date || created_at`.

### Hover / interaction
- Whole card is a `<Link>`. On hover: title shifts to accent color, arrow nudges right, a 1px accent line draws under the title (200ms). No background fill, no shadow — keeps the editorial calm.

### Empty / loading states
- Loading: 3 skeleton cards using muted bars at the same heights.
- Empty: existing `sh-muted` "No case studies yet." message stays.

### Files to change
- `src/pages/sahil/CaseStudies.tsx` — replace `<ul className="sh-list">` block with new `<div className="sh-cards">` map.
- `src/pages/sahil/Lab.tsx` — same component shape, Lab-specific field mapping.
- `src/styles/sahil-theme.css` — add scoped classes:
  - `.sh-cards` (stack, dividers via `border-top` on each child after the first)
  - `.sh-card` (grid `1fr auto` on ≥ 720px, single column under)
  - `.sh-card-eyebrow`, `.sh-card-title`, `.sh-card-pitch`, `.sh-card-meta`
  - `.sh-card-stat` (big accent number + label) and `.sh-card-chip` (monospace pill for Lab)
  - Hover styles on `.sh-card:hover` cascading into title + arrow

### Out of scope
- No data model changes. No cover images on the index pages. No changes to the detail pages (`CaseStudy.tsx`, `LabProject.tsx`). No changes to the b2b versions.
