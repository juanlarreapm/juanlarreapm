## Third preview: `/preview/sahil`

A new self-contained preview inspired by **sahillavingia.com**. Live site untouched. Same pattern as the other previews — scoped CSS, real data from the database, one route.

### What sahillavingia.com is doing (the DNA we're borrowing)

- **Personal-letter feel.** Reads like a homepage someone actually writes, not a portfolio template.
- **Single narrow column**, left-aligned, ~600–680px wide.
- **Warm off-white background**, near-black ink, **a bright accent color** used on links and one or two highlights.
- **Mixed typography**: a friendly serif for body + display, occasional handwritten / italic flourishes, no mono.
- **Inline links everywhere** — the page is conversational. Most navigation happens through underlined inline links, not a nav bar.
- **Lists over cards.** Work, writing, and projects appear as plain bulleted or dashed lists with year + one-line description.
- **First-person opening line.** The hero is literally a sentence: "I'm Sahil. I…"
- **Tiny photo or avatar** near the top — not a hero image.
- **Almost no UI chrome.** No buttons (links instead), no shadows, no cards, no gradients.

### Direction: `/preview/sahil` — Personal Letter

**Vibe**: A person introducing themselves on the internet circa 2010, but tasteful. Confident through plainness. Reads like an essay homepage.

**Palette**
- Background: warm cream `#FBF7F0`
- Ink: near-black `#1A1A1A`
- Muted: `#6B6760`
- Accent: bright coral-red `#E04E2C` (links, the one highlighted word in the hero) — swappable to terracotta to match brand memory
- Hairlines: `#E8E1D4`

**Typography**
- Body + display: a warm serif — **Fraunces** (already used in the project) or **Source Serif 4**
- Italic used liberally for emphasis and asides
- One handwritten accent font (**Caveat** or **Shadows Into Light**) for ONE element only — e.g. the signature, or a margin note like *"← currently"*
- Sizes: body 18px / 1.7, hero 32–40px (small for a hero — this is the point)

**Layout signals**
- Single column, max-width 640px, left-aligned (not centered)
- Small avatar (40–56px round) top-left next to name
- Hero is a paragraph, not a headline: *"I'm Juan. I'm a senior PM helping B2B SaaS go from zero to one. Currently at PartsTech."*
- Inline links underlined in coral
- Sections separated by a single blank line and a small italic label (e.g. *writing*, *work*, *now*)
- Work / case studies = dashed list: `— 2024  PartsTech — rebuilt checkout, +18% conversion`
- A `/now` style block: "Currently…" with 3–4 short bullets
- Footer: one line, plain text

**Hero sketch**
```text
[avatar]  Juan Larrea


I'm Juan. I'm a senior product manager helping
B2B SaaS companies go from zero to one — then
grow it. I've shipped twelve products across
five industries over the last eight years.

Right now I'm at PartsTech rebuilding how
shops buy parts. Before that, retail, edtech,
and consumer loyalty. I write occasionally
about product, taste, and shipping.

If you're hiring a PM who can build the thing,
sell it internally, and find the metric that
matters — say hi.

— juan
```

### What I'll build

| File | Action |
|---|---|
| `src/styles/sahil-theme.css` | New — `.sahil-theme` scoped tokens, serif type, link styling |
| `src/pages/preview/Sahil.tsx` | New — full one-page preview, real data from DB |
| `src/App.tsx` | Add route `/preview/sahil` |
| `index.html` | Add Caveat font (Fraunces already loaded) |

**Page sections** (all on one screen, scrollable):
1. **Header strip** — avatar + name, no nav
2. **Hero paragraph** — the introduction, with one accent word
3. ***now*** — 3–4 inline bullets of current focus
4. ***work*** — dashed list of case studies (real data, year + title + one-line outcome, each linkable)
5. ***writing*** — dashed list of blog posts (real data)
6. ***elsewhere*** — single-line list: email · linkedin · github
7. **Signature** — handwritten "— juan" in Caveat
8. **Footer** — one line, year + tiny note

Preview chrome (top-left "Back to live site", top-right "Sahil Preview · v1") matches the other previews.

### Zero changes
to your live site, `index.css`, navbar, footer, or any existing pages.

### After you review

You'll then have **three** directions to compare:
- `/preview/swiss` — loud, brutalist, agency-poster
- `/preview/quiet` — calm, neutral, minimalist product
- `/preview/sahil` — warm, personal, essayist

Pick a winner (or mix), and I migrate that direction into the real site.

Approve and I'll build it.
