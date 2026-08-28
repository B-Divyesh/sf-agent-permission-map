# Permit Map visual thesis

## Direction

Permit Map uses an **art-deco transit poster** system. Agent rules behave like routes: they start in different jurisdictions, cross at repository boundaries, and end at a clear permit signal. The visual language borrows the geometry, strict hierarchy, and ink texture of 1930s rail posters without copying a historic mark.

The site is intentionally single-mode. Its warm paper field and near-black ink mimic a printed station notice and keep the policy table legible. The utility is the hero; ornament works only as route-finding structure.

## Tokens

- `--paper: #f4eddb` — warm timetable stock.
- `--paper-deep: #e5d7b8` — section bands and table stripes.
- `--ink: #172826` — near-black green; body text, 12.4:1 on paper.
- `--muted: #4d5c57` — secondary text, 6.1:1 on paper.
- `--rail: #0c6971` — teal route ink; links and focus accents.
- `--signal: #bd3a2d` — vermilion stop signal; large display accents only.
- `--brass: #a66b18` — warning and rule intersections.
- `--allow: #21653d`, `--deny: #9e2f27`, `--ask: #805600` — always paired with words or symbols.
- Spacing follows an 8 px base: 4, 8, 16, 24, 32, 48, 72, 96.
- Corners are clipped or square. Borders use double lines and stepped deco geometry, never soft floating cards.

## Type

- Display: **Aptos Display / Arial Narrow / sans-serif**, uppercase with tracked letters. It evokes destination boards without shipping a font payload.
- Body and interface: **Atkinson Hyperlegible / system-ui / sans-serif**. The system fallback keeps the site zero-font-download and readable at small sizes.
- CLI specimens: **ui-monospace / SFMono-Regular / monospace**, with tabular figures.

## Composition and interaction grammar

The landing page is a split transit placard, not a centered hero. A tall numbered route line binds the left copy to the live terminal at right. Sections alternate between open paper and full-width timetable bands. Buttons resemble punched tickets: clipped corners, solid ink, and a short directional arrow. Tables use route-colored left rules and explicit status words.

The signature interaction is a one-time **route draw**: the hero line grows from global to repo to worktree in 700 ms. Hover and focus shift tickets by 2 px along the route. No decorative element loops.

## Motion and responsive policy

- UI feedback lasts 160–220 ms and uses transform or opacity only.
- The route draws once on first paint. Results enter as one group, never staggered beyond 300 ms.
- `prefers-reduced-motion: reduce` removes route drawing and all transforms; final states appear immediately.
- At 390 px, the route becomes a horizontal key above stacked copy and terminal. Deco corner ornaments are dropped. All controls remain at least 44 px.

## Original asset plan and provenance

- `site/public/permit-map-poster.webp`: original raster poster generated for this product with `/opt/fleet/lib/gen-image.sh`, then compressed locally to WebP at no more than 300 KB. It shows abstract rail lines converging on allow, ask, and deny signals. It contains no required text.
- `site/public/og-image.png`: a deterministic 1200×630 composition made from the same generated poster plus live HTML typography, captured locally. The generated art remains the only raster illustration.
- `site/public/terminal-demo.svg`: hand-authored from output of the real bundled CLI demo. It is a documentation record, not decorative art.
- Logo, favicon, route marks, and icons are original inline SVG geometry drawn for Permit Map.

Generation prompt: “Art-deco transit poster illustration for a local developer security CLI; geometric rail lines from three origins converge through switches into green permit, amber review, and red stop signals; flat screenprint, warm cream paper, deep forest ink, petrol teal, restrained vermilion and brass; crisp symmetrical geometry, subtle paper grain; no people, no computers, no logos, no lettering, no words, no gradients, no watermark; wide landscape composition with strong right-side destination medallion.” Deployment: factory-image. License: project-owned generated asset under the repository MIT license.
