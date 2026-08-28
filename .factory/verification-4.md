# Independent product verification — candidate 4

**Verdict: FAIL**

- Candidate: `4ccb9d3a3baf99bcdda81bd1d1cc4ec75aa1ef61`
- Branch/remote at start: `main` and `origin/main` both pointed to the candidate
- Live URL: <https://agent-permission-map.sociobot.in>
- Verified: 28 August 2026 UTC
- Contract: original researched brief and the supplied claims, demo, accessibility, design, CLI, performance, plain-language, and site-structure requirements

The earlier deployment-only concern is resolved: every public production file tested matches the candidate build byte-for-byte. The cold first-read gate, all declared claim commands after the required dependency install, the full authored suite, exact production build, clean package install, headers, privacy checks, and performance budgets pass. The candidate is still not releasable because default Codex trust handling incorrectly makes known global rules and explicit CLI overrides unresolved. Independent visual checks also found contrast, focus, and 200% text-resize failures missed by the authored axe suite.

## Release-blocking findings

### High — unknown project trust incorrectly hides known global Codex rules and explicit overrides

`src/lib.rs:342-351` checks whether any Codex project rule exists and, when trust was not supplied, marks **every** Codex row unresolved:

```rust
for rule in raw.iter_mut().filter(|rule| rule.vendor == "codex") {
    rule.unresolved = true;
}
```

Independent packaged-binary fixture:

- `~/.codex/rules/global.rules` contains the bundled global `git push = prompt` and `rm -rf = forbidden` rules.
- The repository contains only the bundled project `.codex/config.toml`.
- `permit-map inspect <repo> --json` uses the documented default unknown trust context.

Observed result:

```text
effective 0, unresolved 4
global command:git push  ask  unresolved
global command:rm -rf    deny unresolved
project approval:on-request and sandbox:workspace-write unresolved
```

The same command with `--codex-trust untrusted` correctly reports both global rules effective and only the two project rows unresolved. A second fixture passed an explicit `--codex-config 'sandbox_mode="danger-full-access"'`; the resulting highest-precedence `override` row was also incorrectly marked unresolved.

Official OpenAI documentation states that trust gates project `.codex/` layers, while user and system configuration continue to load. It also lists CLI flags and `--config` overrides at highest precedence: <https://developers.openai.com/codex/config-basic/#configuration-precedence>.

This contradicts the product's own README statements that **project** rows stay unresolved and supplied CLI context is used (`README.md:82-84`). It can obscure a known global forbidden rule in the tool's default invocation, directly breaking the core resolved-policy job. The `@claim:codex-context` fixture passes because it contains project files only; it does not exercise the global or override boundary.

### Medium — the source-repository link is invisible in the install section

The required install path renders “Clone the [blank], then build…” at both 1366 px and 390 px. The anchor inherits `--rail: #0c6971` from the global link rule while its section background is the same `#0c6971`, producing **1.00:1** contrast. The link remains in the accessibility tree and has a 44 px box, which is why the authored axe run did not report it, but its visible text is absent. The full clone command remains visible beside/below it, so this is not the sole install path.

Evidence: `site/src/main.ts:93`; `site/src/style.css:7,25`. Browser-computed foreground and ancestor background were both `rgb(12, 105, 113)`.

### Medium — focus indicators fail the 3:1 contrast baseline on colored sections

All focusable elements use the same `#a92f25` outline (`site/src/style.css:28`). Browser-computed contrast for real focused links is:

| Surface | Contrast | Required |
|---|---:|---:|
| Install teal `#0c6971` | 1.05:1 | 3:1 |
| Preview ink `#172826` | 2.28:1 | 3:1 |
| Footer `#0c1917` | 2.67:1 | 3:1 |

Keyboard order and operation work, but the focus indicator is not sufficiently visible in these sections.

### Medium — 200% text enlargement clips content with no horizontal recovery

At a 390 × 844 viewport, setting the root text size to 200% produces document widths of 613 px on `/`, 574 px on `/demo`, 432 px on `/privacy`, 399 px on `/terms`, and 555 px on the 404 page. `body { overflow-x: clip; }` prevents horizontal recovery (`window.scrollX` remains `0` after `scrollTo(1000, 0)`).

Concrete loss includes the 404 headline extending to x=555, header navigation extending beyond the right edge, and enlarged home/demo content. Normal-size 390 px pages have no overflow. This fails the supplied requirement that text resize to 200% without loss.

### Low — README attributes Codex rule syntax to the Claude adapter

`README.md:75` says “The Claude adapter reads `permissions.allow`, `permissions.ask`, and documented multiline `prefix_rule` entries.” `prefix_rule` is Codex syntax. The implementation handles it in the Codex adapter, so the product works but this support statement is misleading.

## Mandatory claims gate

`.factory/claims.json` exists with 16 entries, and every ID has one tagged test. As explicitly requested, the literal commands were first invoked before dependency installation; each stopped before its claim assertion because the clean checkout had no `node_modules` (`vite: not found`, exit 127). After the required `npm ci` (24 packages, 0 vulnerabilities), every exact command was run separately and exited 0 in both configured Playwright projects.

| Claim | Result after clean install | Evidence |
|---|---|---|
| `demo-resolves` | Pass | Browser rows exactly equal CLI rows; 4 sources, 9 effective, 1 shadowed |
| `report-formats` | Pass | Terminal, JSON, and Markdown |
| `policy-files` | Pass | Known-path fixture ignores decoy `.env`, unrelated JSON, and undocumented path |
| `no-account` | Pass | Fresh browser contexts |
| `mit-license` | Pass | LICENSE and Cargo metadata |
| `browser-privacy` | Pass | Same-origin only; no cookies or web storage |
| `cli-local` | Pass | No network/telemetry/process-launch dependency |
| `resolution-order` | Pass | Claude deny/ask/allow exact-match precedence |
| `codex-context` | Authored test passes; independent boundary fails | Project-only fixture misses global and override rows |
| `codex-rules` | Pass | Multiline, union, default, restrictive match, and justification fixture |
| `vendor-policy-safe` | Pass | Direct and hard-link policy targets preserved |
| `vendor-settings-unchanged` | Pass | All discovered project policies retain hashes |
| `cli-errors` | Pass | Missing and malformed inputs exit 2 |
| `vendor-boundaries` | Pass | Vendors remain separate; overlaps stay visible |
| `touch-targets` | Pass | All visible home links at least 44 px |
| `demo-isolated` | Pass | Caller unchanged; output escape attempts rejected |

The pre-install exits are dependency-prerequisite failures rather than executed claim assertions. The reproducible clean-checkout sequence is `npm ci` followed by the registered commands. The independent Codex result above nevertheless falsifies the intended trust-boundary behavior and blocks release.

## First-read and demo gate

**Pass.** A cold live load states all three required answers in the first screen:

- What: “See agent permissions before they run.”
- Who: engineers using several coding agents across repositories.
- First click: “Try it with sample data,” followed by “Opens a browser preview of the bundled repository.”

At 1366 × 768, the audience sentence ends at y=539, the action at y=622, and all three facts at y=722. At 390 × 844, they end at y=476, y=558, and y=752 respectively. One click opens `/demo`, immediately showing the four-source policy table plus the persistent **Demo — sample data, nothing is saved**, **Reset demo**, and **Start for real** controls.

## Clean checkout, build, package, and CLI evidence

| Check | Result |
|---|---|
| `npm ci` | Pass; 24 packages installed, 0 vulnerabilities |
| All 16 literal claim commands after install | Pass; 32 targeted browser executions |
| `npm test` | Pass; 5 Rust unit + 8 CLI integration + 60 Playwright tests |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `cargo fmt --all -- --check` | Pass |
| `cargo clippy --all-targets --all-features -- -D warnings` | Pass |
| `npm audit --audit-level=high` | Pass; 0 vulnerabilities |
| `npm run build` | Pass; release binary and `dist/site/` produced |
| `cargo package --locked` | Pass; 48 files, 619.4 KiB compressed |
| Extracted crate install into a clean prefix | Pass; `permit-map 0.1.0`, 985,200-byte binary |
| Installed `demo --json` | Pass; 4 sources, 9 effective, 1 shadowed |

Independent installed-CLI cases covered help/version, demo JSON/Markdown, trusted/unknown/untrusted sample contexts, an empty repository, missing and non-directory paths, malformed JSON, invalid format and profile values, existing-output preservation, and recovery by choosing a new output path. Exit codes and recovery messages were useful. The bundled `justification` rule was also compared to `codex-cli 0.150.1`: both reported `git push` as prompt/ask and `rm -rf` as forbidden/deny.

## Live deployment, browser, privacy, and performance

- Deployment identity: all 15 public files in `dist/site` (route HTML, hashed JS/CSS, images, metadata assets, robots, sitemap, and terminal SVG) matched live bytes by SHA-256. The deployed assets are `main-C0zeLAHu.js` and `style-YOvF9uGK.css`; the designed unknown route matches local 404 bytes and returns HTTP 404.
- Factory `verify-url.sh`: pass; 784 ms network-idle load, valid title/lang/one h1/main/alts/buttons, no console errors.
- Independent axe: zero serious/critical findings across five routes at 1366 px and 390 px. The manual contrast failures above remain real and are not detected by this axe configuration.
- Keyboard: skip link is first; Enter opens demo; Space resets it; route changes focus the destination heading; **Start for real** focuses Install; no trap found.
- Normal responsive layout: no horizontal overflow on any tested route at 390 px; every visible link/button measured at least 44 × 44 px.
- Reduced motion: media query matches, scroll behavior becomes `auto`, and transition duration falls to `0.00001s`.
- Privacy: full home/demo/navigation observation contacted only `https://agent-permission-map.sociobot.in`; cookies, local storage, and session storage stayed empty. Source/dependency review found no API client, analytics, telemetry, sign-in, or subprocess launch.
- Console/page/request errors: none on successful routes and interactions.
- Links: all live internal links, the repository, and Param Factory returned 200. The Open Graph image is 1200 × 630.
- Response policies: HSTS, same-origin CSP, `nosniff`, strict-origin referrer policy, and camera/microphone/geolocation denial are present. HTML revalidates after 30 seconds; hashed assets use one-year immutable caching; the hero uses one-day caching; conditional asset requests return 304; Brotli is served.
- Bundle budgets: JS 4,910 bytes gzip; CSS 3,876 bytes gzip; no font files; hero WebP 128,376 bytes.
- Live mobile Lighthouse: Performance **98**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP **0.9 s**, LCP **1.5 s**, TBT **180 ms**, CLS **0**, Speed Index **0.9 s**, transfer **136 KiB**.

The art-deco transit visual system is distinctive, documented, and consistently implemented. The visual result is otherwise strong on desktop and mobile.

## Applicability

- Server endpoints and rate limiting: not applicable. This is a static site plus local CLI; source and runtime capture show no API or product-unlock endpoint. `/api`-style unknown paths are static 404s.
- Sign-in/Entra: not applicable; there is no sign-in.
- PWA/service-worker update/offline reload: not applicable; there is no service worker, manifest, or offline claim.
- Backend concurrency, persistence, and health identity: not applicable; there is no backend.
- AI leverage: not applicable; deterministic local policy resolution should not use a model.

## Required before release

1. Under unknown trust, mark only project-scoped Codex rows unresolved. Keep system, user, profile, and explicit override rows resolved according to documented precedence; add claim coverage for all boundaries.
2. Give the install-section source link a foreground color with at least 4.5:1 contrast on teal.
3. Provide focus-ring tokens that maintain at least 3:1 contrast on paper, teal, ink, and footer surfaces.
4. Reflow all routes at 200% text size without clipped content; do not use document-level clipping to hide overflow.
5. Correct the README's Claude/Codex adapter attribution.
