# Portfolio

Single-page portfolio built as a dark HUD-style interface — bracket-framed hero, live metric readouts in the project panels, scroll-driven count-ups, and a radar ping when you click empty grid space on desktop.

**Live demo:** _add Vercel URL after deploy_

![Hero preview](./public/preview.png)

## Stack

| Layer | Choice |
|---|---|
| UI | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 (`@theme` tokens, no config file) |
| Motion | GSAP + ScrollTrigger, Lenis smooth scroll |
| Lint | oxlint |

No component library. Six source components, seven runtime dependencies.

## Run locally

```bash
npm install
npm run build && npm run preview   # recommended — always works
```

`npm run dev` fails if the project path contains `%` (Vite bug). This folder is named `Top 1%`, so use preview or rename the parent directory.

```bash
npm run dev      # only after moving out of a path with %
npm run lint
```

## What's placeholder

Everything in `src/content.js` is invented — project names, metrics, panel numbers. Swap before this goes live.

Also replace in:

- `src/App.jsx` — About paragraph, email, GitHub/Writing links
- `src/components/Hero.jsx` — thesis lines
- `index.html` — title and meta description

The panel frames are DOM readouts, not images. Drop real screenshots into `Panel.jsx` later without moving the layout.

## Design tokens

Defined in `src/index.css`:

| Token | Hex | Used for |
|---|---|---|
| `void` | `#0A0C10` | Background |
| `panel` | `#12161C` | Project readout cards |
| `line` | `#262C34` | Dividers |
| `ink` | `#F4F1EA` | Body text |
| `ink-dim` | `#8B96A3` | Secondary text |
| `signal` | `#FF5A1F` | Accent — interactive and flagged metrics only |

`signal` is not decoration. It marks focus rings, hover, links, and rows marked `flag: true` in panel data.

## Motion (desktop)

- **Boot** — brackets + scan line, hero text lands in under 800ms
- **Scroll** — metric scores count up via one batched ScrollTrigger; bars use `scaleX`
- **Hover** — project panel scan sweep + bracket tighten
- **Click blank** — radar ping, horizontal scan line, coordinate flash
- **Cursor** — crosshair reticle; text selects only when the pointer is over actual glyphs

`prefers-reduced-motion: reduce` skips all of it and never mounts Lenis.

## Deploy

Pushes to `main` deploy automatically on Vercel. Build command: `npm run build`. Output: `dist`.

## Folder map

```
src/
  App.jsx           page shell + animation wiring
  content.js        five projects + skills (placeholder copy)
  motion.js         boot, count-ups, panel hover, nav pulse
  components/
    Hero.jsx        bracket frame + thesis
    HudCursor.jsx   reticle + radar ping
    HudField.jsx    parallax grid + scanner + TRK coords
    Panel.jsx       live DOM readout per project
    ProjectRow.jsx
    Section.jsx
    Nav.jsx
```

## License

MIT — use whatever you want, attribution optional.
