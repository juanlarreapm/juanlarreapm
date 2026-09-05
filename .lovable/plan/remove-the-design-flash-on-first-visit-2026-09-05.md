# Remove the design flash on first visit

## What's happening

The site remembers your chosen design in the browser after the first visit, so returning visitors see the right look instantly. In a brand-new/incognito window there's nothing remembered yet, so the page starts with the old design and swaps once the setting comes back from the server — that's the flicker you saw.

## The fix

Two changes, both small:

1. **Bake in the current choice as the starting point.** The page will assume the Sahil design from the very first paint (instead of assuming the old one), so a fresh visitor sees the correct look immediately. The remembered value and the server setting still win, so flipping the toggle in Admin keeps working.
2. **Hold the page for a beat when nothing is known yet.** On a truly first visit, show a neutral blank canvas in the correct background color while the setting loads (typically a fraction of a second) instead of rendering the wrong design and swapping. Once loaded it renders normally and is remembered for next time.

Result: no visible switch from one design to the other, in incognito or otherwise.

## Technical details

- `index.html`: the inline pre-React script currently only applies `sahil-theme` when `localStorage.active_theme_cache === "sahil"`. Change it to treat a missing cache value as the build-time default (`sahil`) — apply the class and the Sahil favicon; only an explicit `"b2b"` cache value skips it.
- `src/hooks/useActiveTheme.ts`: introduce `DEFAULT_THEME: ActiveTheme = "sahil"`, use it as the fallback in `readCachedTheme()`, and expose whether the value came from cache (`hasCachedTheme`) alongside the query's `isFetched` state.
- `src/App.tsx`: when there is no cached theme and the query hasn't resolved yet, render a minimal `bg-background` full-screen placeholder instead of the routes; keep existing `.sahil-theme` class + favicon effect as-is.
- Admin toggle, `site_settings.active_theme`, and the `/preview/*` routes are untouched.
