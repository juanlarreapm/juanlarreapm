# LinkedIn-style Experience Section

Rework Experience so a single company can hold multiple positions, like LinkedIn. One company header (name, link, optional date range) with nested roles underneath, each with its own period, description, and highlights.

## Data model

New `companies` table:
- `name` (text)
- `url` (text, optional)
- `display_order` (int)

Modify `experiences`:
- Add `company_id` (uuid, FK → companies.id)
- Keep `role`, `period`, `description`, `highlights`, `display_order`
- Drop reliance on `company` / `company_url` text columns (keep them temporarily for backfill, then drop in a follow-up migration)

Backfill: for each distinct `company` string in existing experiences, create one company row, then point all matching experience rows at it.

RLS: mirror the existing pattern — public can view, admins can manage.

## Admin changes

Reorganize the Experiences tab into two stacked sections:

1. **Companies** — list with add/edit/delete + reorder. Editor fields: name, url, display order.
2. **Positions** — when editing a position, pick a company from a dropdown (instead of typing a company name). Position editor keeps role, period, description, highlights, display order.

Alternatively: nest positions under each company card in the admin list (expand to see roles, "Add position" button per company). This matches LinkedIn's mental model and is what I'd recommend.

## /about display (both b2b and sahil themes)

Group positions by company, sorted by company `display_order`, then positions by their own `display_order` (most recent first).

```text
Company Name                              2019 – Present
  Senior Product Manager                  2022 – Present
    description + highlights
  Product Manager                         2019 – 2022
    description + highlights
```

The company header is rendered once with an aggregated date range (earliest → latest of its positions, or "Present" if any position is current). Each role sits indented underneath.

## Files touched

- Migration: create `companies`, alter `experiences`, backfill, RLS.
- `src/pages/ExperienceEditor.tsx` — replace company text inputs with company picker.
- New `src/pages/CompanyEditor.tsx` and route in `App.tsx`.
- `src/pages/Admin.tsx` — Experiences tab UI: company list with nested positions.
- `src/pages/About.tsx` and `src/pages/sahil/About.tsx` — group + render by company.
- `src/styles/sahil-theme.css` — small additions for nested role styling.

## Out of scope (call out)

- Company logos — can add later if you want them.
- Drag-and-drop reordering — using numeric `display_order` like the rest of admin.
