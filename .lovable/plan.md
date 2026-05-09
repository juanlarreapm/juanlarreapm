## Sahil /about — revamped layout

### Problem
Current row uses a 3-column grid (`64px | 1fr | auto`). The `period` string ("2022 — Present") overflows 64px, and the description in the right column collides with the role/company. There's no room for highlights.

### New layout: compact timeline

Drop the `sh-list` table look entirely on About. Replace with a left-rail timeline where each role is a vertical block — period stays out of the way, role/company breathe, description and highlights sit underneath cleanly.

```text
about
A few notes on me.
{bio paragraph}
{resume link}

where I've worked
│
●  2022 — Present
│  Senior Product Manager · PartsTech
│  Rebuilding how independent shops buy parts. Led the discovery → MVP
│  for a new buyer experience and shipped it to 8k shops in 6 months.
│  • Grew weekly active buyers 3.4×
│  • Cut quote-to-order time from 7m to 90s
│  • Built the PM rituals from scratch
│
●  2020 — 2022
│  Product Manager · Intellum
│  ...
```

- **Left rail**: 1px hairline (`hsl(var(--sh-line))`) running the full section, with a small filled dot per role aligned to the top of the period.
- **Period**: small caps / italic, muted, sits on its own line so length never matters.
- **Role · Company**: own line, role in ink color, company linked to `company_url` if present, otherwise muted.
- **Description**: full body paragraph, normal `sh-body` line-height.
- **Highlights**: rendered as a tight bulleted list using a custom marker (small em dash or filled square in muted color), only when `highlights.length > 0`. Each entry stays on one line if short, wraps cleanly if long.
- **Spacing**: ~2.5rem between roles, no border between rows (the rail handles structure).

### Responsive behavior
- ≥ 640px: rail at 16px from left edge of content, content padded `pl-8`.
- < 640px: rail still present (looks good on mobile too) but reduce padding to `pl-6` and tighten role spacing to ~2rem.

### Hero section (top of page)
Keep mostly as-is, but tighten:
- `about` label, `A few notes on me.` heading.
- Bio paragraph in `sh-hero`.
- Resume link as inline sentence (already there).
- No changes to data fetching.

### CSS additions to `src/styles/sahil-theme.css`

New scoped classes (no impact on other pages):

- `.sh-timeline` — relative wrapper, `padding-left` for rail clearance, `::before` pseudo-element draws the vertical hairline.
- `.sh-timeline-item` — relative block, `margin-bottom: 2.5rem`, `::before` draws the dot (8px filled circle in `--sh-accent`, positioned over the rail).
- `.sh-timeline-period` — muted, italic, 14px, tabular numerics, mb-1.
- `.sh-timeline-role` — 18px ink, mb-2, with `· company` styled like existing list (link in ink, hover accent).
- `.sh-timeline-desc` — body paragraph, mb-3.
- `.sh-timeline-highlights` — `list-style: none`, each `li` prefixed with a muted `—` and 0.5rem indent, 15px, line-height 1.55, muted ink.

### Files to edit
- `src/pages/sahil/About.tsx` — replace the `sh-list` block with a `<div className="sh-timeline">` of `<article className="sh-timeline-item">` blocks rendering period / role · company / description / highlights bullets.
- `src/styles/sahil-theme.css` — add the timeline classes described above.

### Out of scope
- No data model changes (`experiences` already has `period`, `role`, `company`, `company_url`, `description`, `highlights`).
- No changes to other Sahil pages or to the b2b About.
- No new admin fields.
