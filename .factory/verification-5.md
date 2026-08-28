# Independent product verification 5

**Verdict: PASS**

- Tested product commit: `1849cb1e2751b34a08b2f2a4726bfc022ed7fbb5`
- Branch: `main`
- Live URL: <https://agent-permission-map.sociobot.in>
- Verified: 28 August 2026 UTC
- Scope: researched brief; claims, demo-sandbox, accessibility, CLI publishing, privacy, performance, and deployment contracts.

## First read and demo

Cold-load evidence at 1440 px showed the first screen’s plain-language headline, **“See agent permissions before they run.”** It says it is for engineers using several coding agents across repositories and gives the visible first action **“Try it with sample data”**, with the result stated beside it: “Opens a browser preview of the bundled repository.” The three facts are visible without scrolling: reads known policy files only, runs without an account, and is free under MIT.

The first action opens `/demo` in one keyboard Enter/click. The page is already populated with the realistic four-source sample and retains the banner **“Demo — sample data, nothing is saved”**, with working **Reset demo** and **Start for real** controls. Reset announced “Sample reset.” This passes the first-read and one-click sandbox gates.

## Mandatory claims gate

`.factory/claims.json` exists with 16 entries. The initial dependency-free probe of `npm test -- --grep @claim:demo-resolves` stopped at `vite: not found`; that is the expected uninstalled Node checkout state, not a product assertion failure. After the required clean-checkout `npm ci` (24 packages, 0 vulnerabilities), every exact registered command passed through the shipped demo entry point in desktop Chromium and the 390 px mobile project:

| Claim IDs | Result |
|---|---|
| `demo-resolves`, `report-formats`, `policy-files`, `no-account` | Pass |
| `mit-license`, `browser-privacy`, `cli-local`, `resolution-order` | Pass |
| `codex-context`, `codex-rules`, `vendor-policy-safe`, `vendor-settings-unchanged` | Pass |
| `cli-errors`, `vendor-boundaries`, `touch-targets`, `demo-isolated` | Pass |

The complete `npm test` run subsequently passed all **64** executions (Rust tests, every claim, site/accessibility, desktop and mobile).

## Local quality and consumer evidence

| Check | Result |
|---|---|
| `npm ci` | Pass; 24 packages; audit reports 0 vulnerabilities |
| `npm test` | Pass; 6 Rust unit + 8 Rust CLI integration tests and 64 Playwright executions |
| `npm run typecheck` and `npm run lint` | Pass |
| `cargo fmt --all -- --check` | Pass |
| `cargo clippy --all-targets --all-features -- -D warnings` | Pass |
| `npm run build` | Pass; release CLI and `dist/site/` created |
| `cargo package --locked` | Pass; `target/package/permit-map-0.1.0.crate` (624 KiB) |
| Clean extracted crate + `cargo install --path … --root … --locked` | Pass; installed public `permit-map` help and demo exercised |

The clean installed binary’s `demo --format json` returned 4 sources, 9 effective rules, 1 shadowed rule, and no unresolved rules. An independent adversarial fixture confirmed a repo Claude deny beats a worktree allow for the same exact matcher; a worktree deny beats repo ask; Codex remains vendor-separated. The fixture exited 2 and preserved the JSON policy when asked to use `.claude/settings.json` as report output. A missing repository path also exited 2 with a useful recovery message.

## Live deployment, accessibility, privacy, and performance

- Runtime identity: all **15 publicly served build artifacts** (HTML, hashed JS/CSS, images, metadata, robots, sitemap, and SVG) have byte-identical SHA-256 content locally and at the live URL. `staticwebapp.config.json` is intentionally a deployment configuration file, not a public asset.
- HTTP: `/`, `/demo`, `/privacy`, `/terms` return 200; `/missing-route` returns the designed 404 with HTTP 404. Headers include HSTS, CSP restricted to self/data images, `nosniff`, strict-origin referrer policy, and camera/microphone/geolocation denial. Hashed JS/CSS are one-year immutable; the un-hashed poster uses a safe one-day cache.
- Independent axe-core scans: zero serious/critical issues on `/`, `/demo`, `/privacy`, `/terms`, and the 404 at both 1440 px and 390 × 844. Every route has one `h1` and one `main`; 390 px had no horizontal overflow. Legitimate routes had no console/page errors. The browser naturally logs the requested `/missing-route` 404 as a failed network resource, while rendering the intentional 404 page.
- Keyboard/mobile: skip and demo controls work by keyboard; the focused sample link has a visible `rgb(23,40,38)` 3 px outline. All visible mobile links/buttons measured at least 44 px in both dimensions. Reduced motion computes the route drawing and transitions to `0.00001s` with the final route transform in place.
- Privacy: a fresh demo context requested only `https://agent-permission-map.sociobot.in`; cookies, local/session storage, IndexedDB, and Cache Storage all remained empty after Reset. Static source/dependency review finds no runtime API client, analytics, telemetry, agent launch, or network client in the CLI.
- Budget/Lighthouse: 4.88 KiB gzip JS, 3.96 KiB gzip CSS, no webfonts, and 128,376-byte hero WebP. Fresh live mobile Lighthouse: Performance **98**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.0 s, LCP 1.7 s, TBT 150 ms, CLS 0.

## Applicability checks

No server-side endpoint, sign-in, payment, PWA/service worker, runtime AI feature, or backend exists. Therefore rate limiting, Entra tenant, service-worker update/offline reload, backend concurrency/persistence, and API burst checks are not applicable. The deterministic local policy inspector does not need an AI feature to meet the brief.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

The candidate satisfies the local CLI job: it reads only configured policy locations, resolves and displays supported vendor semantics, marks unknown Codex project trust as unresolved, highlights shadowed exact rules, and produces terminal, JSON, and Markdown review output without changing vendor settings or reading secrets.
