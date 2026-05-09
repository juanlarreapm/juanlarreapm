## Goal

Build a full **Sahil**-themed version of every page in the app (public + admin), and add a toggle in admin that flips the live site between the two designs:

- `b2b` — the current Warm Minimalist editorial design (default).
- `sahil` — the new dark editorial letter-style design from `/preview/sahil`.

The `/preview/sahil` route stays as a sandbox.

## How the toggle works

- One row in `site_settings`: `key = "active_theme"`, `value = "b2b" | "sahil"`. Default `"b2b"`.
- New hook `src/hooks/useActiveTheme.ts` reads it via React Query, defaults to `"b2b"` while loading so visitors never see a flash.
- A new `ThemedRoute` wrapper in `src/App.tsx` picks the right page component per route based on the active theme. Auth pages (`/auth`, `/reset-password`) and `/preview/*` are not themed.
- In `src/pages/Admin.tsx` Settings tab, add a "Live site design" card with a Switch:
  - Off → `b2b`. On → `sahil`.
  - Upserts `site_settings` (same pattern as `open_to_opportunities`), invalidates the `active_theme` query, toasts.
- Admin gate stays unchanged (`useAdminRole`).

## Pages to build (Sahil versions)

All under `src/pages/sahil/`. Each one fetches the same data its b2b twin does — only presentation changes. Shared shell `src/components/sahil/SahilLayout.tsx` provides the dark background, Fraunces typography, top bar (avatar + name left, text nav middle, Mail/LinkedIn/GitHub icons right with hairline divider), footer, and `usePageTracking()`.

Public:
- `Index.tsx` — letter hero + compact "selected work" (3 case studies) and "recent writing" (3 posts) row lists.
- `About.tsx` — narrative bio + experiences as `period — role · company` rows with italic section labels.
- `CaseStudies.tsx` / `CaseStudy.tsx` — text-row index; detail page with italic-labelled sections (problem / approach / solution / outcome / reflections / metrics) and inline tags.
- `Lab.tsx` / `LabProject.tsx` — same row treatment using `project_date`; detail shows tagline, inline tech stack, demo/github icon links.
- `Blog.tsx` / `BlogPost.tsx` — `date · title` list; post body restyled inside Sahil typography (h2/h3/blockquote/code, accent links).
- `Toolkit.tsx` — three italic sections (skills, tools, methodologies) as comma-separated inline lists, no icon grids.
- `Contact.tsx` — short letter intro + restyled form (underlined inputs, accent submit, terracotta focus ring).
- `NotFound.tsx` — minimal "this page wandered off" letter.

Admin (Sahil dark editorial reskin, same functionality):
- `src/pages/sahil/admin/Admin.tsx` and matching editor pages: `PostEditor`, `ExperienceEditor`, `CaseStudyEditor`, `LabEditor`, `ToolkitItemEditor`.
- Shared admin shell `src/components/sahil/SahilAdminLayout.tsx`: dark background, italic section labels for tabs, hairline-bordered tables and forms, terracotta primary buttons, no card chrome.
- Reuses existing data hooks/mutations as-is — only JSX + classes change.
- Auth and analytics tabs are restyled, not rewritten.

## CSS additions to `src/styles/sahil-theme.css`

- Row list (`yyyy | title`), inline tag pills, post-body typography.
- Form primitives: underlined inputs, textarea, select, switch, button.
- Admin primitives: hairline table, tab list, dialog, toast surface — all using existing `--sh-*` tokens.

## Out of scope

- No data migrations, no schema changes beyond the single `site_settings` row.
- No changes to auth flow or backend logic.
- The b2b site stays the default and remains fully intact.

## Technical details

- Theme switch helper:
  ```tsx
  const Page = theme === "sahil" ? SahilIndex : B2BIndex;
  ```
  applied per route. Sahil files import only `sahil-theme.css` so b2b styles never leak in.
- Migration seeds default: `INSERT INTO site_settings (key, value) VALUES ('active_theme', 'b2b') ON CONFLICT (key) DO NOTHING;`.
- Toggle write: `supabase.from("site_settings").upsert({ key: "active_theme", value }, { onConflict: "key" })`.

## Files to add

- `src/hooks/useActiveTheme.ts`
- `src/components/sahil/SahilLayout.tsx`, `SahilAdminLayout.tsx`
- `src/pages/sahil/Index.tsx`, `About.tsx`, `CaseStudies.tsx`, `CaseStudy.tsx`, `Lab.tsx`, `LabProject.tsx`, `Blog.tsx`, `BlogPost.tsx`, `Toolkit.tsx`, `Contact.tsx`, `NotFound.tsx`
- `src/pages/sahil/admin/Admin.tsx`, `PostEditor.tsx`, `ExperienceEditor.tsx`, `CaseStudyEditor.tsx`, `LabEditor.tsx`, `ToolkitItemEditor.tsx`

## Files to edit

- `src/App.tsx` — `ThemedRoute` wrapper for every public + admin route.
- `src/pages/Admin.tsx` (b2b) — add the "Live site design" toggle to Settings.
- `src/styles/sahil-theme.css` — list rows, forms, admin primitives, post-body styles.
- New migration to seed `site_settings.active_theme = 'b2b'`.
