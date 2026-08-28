# Independent product verification — candidate 3

**Verdict: FAIL**

- Candidate: `bb88e524767259aa4cf50ca85e5eaed8d11a611c`
- Branch/remote: `main` and `origin/main` both pointed to the candidate before this report
- Live URL: <https://agent-permission-map.sociobot.in>
- Verified: 28 August 2026 UTC
- Contract: original builder work order, researched brief, and supplied claims, demo, accessibility, design, CLI, performance, plain-language, and site-structure requirements

The prior deployment lag is resolved: the live site is healthy and byte-for-byte matches the candidate's production site output. The build, declared tests, package installation, accessibility scans, privacy checks, security headers, and performance budgets pass. The candidate is still not releasable. A common desktop viewport fails the explicit first-screen gate, and the CLI rejects a valid documented Codex rule field. The live installation path is also not usable by a visitor who does not already have the source checkout.

## Release-blocking findings

### High — the required first action is below the fold on a common desktop viewport

The explicit first-read gate fails at 1366 × 768. A cold load shows the headline and only the beginning of the audience sentence. The primary **Try it with sample data** action starts at CSS pixel 842, entirely below the 768 px viewport. The three required facts start at pixel 922.

Measured bounds:

| Viewport | Audience | Primary action | Three facts | Result |
|---|---:|---:|---:|---|
| 1366 × 768 | bottom 812 | top 842 | top 923 | **Fail** |
| 1440 × 900 | bottom 818 | top 848, bottom 900.06 | top 928 | Borderline/fail for complete first screen |
| 390 × 844 | bottom 476 | top 506, bottom 558 | bottom 752 | Pass |

At 1366 × 768 the screen therefore does not tell a cold visitor what to click first without scrolling. This is an explicit acceptance failure regardless of the otherwise clear wording. Evidence: `/tmp/permit-map-qa/live-cold-1366x768.png`.

### High — valid documented Codex rules with `justification` are rejected

Official OpenAI documentation lists optional `justification` as a supported `prefix_rule()` field and recommends it for forbidden rules: <https://developers.openai.com/codex/rules/>.

Independent fixture:

```python
prefix_rule(
  pattern = ["git", "push"],
  decision = "forbidden",
  justification = "Use the reviewed release workflow instead",
)
```

The candidate's packaged binary returned exit 2:

```text
Permit Map could not finish: Cannot parse .../.codex/rules/default.rules as Codex rules: line 1: unsupported prefix_rule argument 'justification'
```

The installed vendor CLI (`codex-cli 0.150.1`) accepted the same file and returned `decision: "forbidden"`, including the justification in its matched rule. The candidate parser explicitly rejects every argument except `pattern` and `decision` (`src/lib.rs`, `CodexRulesParser::parse`).

This blocks the core job for ordinary valid policy files. It also falsifies the broad registered `codex-rules` claim even though its narrower test fixture passes, because that test omits a documented field.

### High — “Start for real” leads to an unusable install command

The live install section says “Build from source” and offers only:

```sh
cargo install --path .
```

The entire live site has no link to the source repository and no clone command. Running the copied command in a clean directory exits 101 because no `Cargo.toml` exists. The demo's **Start for real** action routes directly to this section, so a visitor arriving from the deployed product cannot install the CLI end to end.

The site must link the repository and provide a complete clone/install sequence, or provide an actually published install target.

## Other findings

### Medium — browser sample mislabels Codex project layers as `repo`

The real bundled CLI reports all four Codex rows from `.codex/config.toml` and `.codex/rules/release.rules` with layer `project`. The live `/demo`, landing terminal preview, and downloadable `terminal-demo.svg` label those same rows `repo`.

That is a material mismatch in a product whose purpose is explaining policy layers. It also contradicts the demo statement that the browser shows the same bundled sample and the asset provenance statement that the SVG records real CLI output. The `demo-resolves` claim checks only counts and one Claude shadowed rule, so it misses this drift.

### Medium — an explicit safety claim is absent from the claims registry

The landing page says “It does not change vendor settings.” This is a user-reliance claim but is not listed verbatim in `.factory/claims.json`. `vendor-policy-safe` covers attempts to direct report output onto one discovered policy or hard-link alias; it does not hash every discovered policy before and after a successful inspection. Under the supplied claims contract, this needs its own registered end-to-end assertion or narrower copy.

### Low — secondary route documents omit social metadata

`/demo`, `/privacy`, `/terms`, and the 404 document have route-specific titles, descriptions, canonicals, and icons, but omit the Open Graph and Twitter card tags required by the supplied site-structure contract. The home document includes them and the 1200 × 630 image is valid.

## Mandatory claims gate

`.factory/claims.json` exists with 15 entries, and every ID occurs in exactly one `@claim:<id>` test. After the required locked dependency install, every literal `test` command was run separately. All 15 commands exited 0 in both configured browser projects (30 targeted Playwright executions), with the Rust tests and production site build also rerun by each command.

| Claim | Declared test | Independent result |
|---|---|---|
| `demo-resolves` | Pass | Counts pass; browser Codex layer labels drift from CLI (finding above) |
| `report-formats` | Pass | Table, JSON, and Markdown exercised |
| `policy-files` | Pass | Known-path fixture ignores `.env`, unrelated JSON, and undocumented config path |
| `no-account` | Pass | Fresh browser context, no form/cookies |
| `mit-license` | Pass | MIT text and Cargo metadata |
| `browser-privacy` | Pass | Same-origin only; cookies and web storage empty |
| `cli-local` | Pass | No runtime network/telemetry dependency or process launch |
| `resolution-order` | Pass | Claude exact deny/ask/allow fixture |
| `codex-context` | Pass | Unknown/trusted nested project fixture |
| `codex-rules` | Script passes | **Claim falsified:** valid documented `justification` is rejected |
| `vendor-policy-safe` | Pass | Direct and hard-link targets rejected; original bytes preserved |
| `cli-errors` | Pass | Missing path, malformed Claude JSON, and malformed rules exit 2 |
| `vendor-boundaries` | Pass | Vendor separation and overlap visibility |
| `touch-targets` | Pass | Independent all-route 390 px audit also found none below 44 × 44 |
| `demo-isolated` | Pass | Relative output stays in temp dir; absolute and `..` escapes exit 2 |

Raw command logs: `/tmp/permit-map-qa/claims-post-install.log` and `/tmp/permit-map-qa/local-gates.log`.

## First-read and demo evidence

The copy itself is clear:

- What it does: “See agent permissions before they run.”
- For whom: engineers using several coding agents across repositories.
- What to click: “Try it with sample data.”

At 390 × 844 all three, the click consequence, and three facts fit in the first viewport. At 1366 × 768 the action is below the fold, so the overall first-read result is **FAIL**. Once reached, the action opens `/demo` in one click and immediately shows the seeded 4-source, 9-effective, 1-shadowed report. The persistent banner exposes **Reset demo** and **Start for real**.

## Clean checkout, build, package, and CLI evidence

The tree began clean at the exact candidate. Only this verification report and handoff were changed.

| Check | Result |
|---|---|
| `npm ci` | Pass; 24 packages added, 25 audited, 0 vulnerabilities |
| All 15 literal `.factory/claims.json` commands | Pass individually after install |
| `npm test` | Pass; 5 unit + 8 CLI integration + 52 Playwright tests |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `cargo fmt --all -- --check` | Pass |
| `cargo clippy --all-targets --all-features -- -D warnings` | Pass |
| `npm audit --audit-level=high` | Pass; 0 vulnerabilities |
| `npm run build` | Pass; release binary and `dist/site/` produced |
| `cargo package --locked --allow-dirty` | Pass; 47 files, 615.1 KiB compressed |
| Extracted crate install to a clean prefix | Pass; `permit-map 0.1.0`, 962 KiB binary |
| Installed `demo --format json` | Pass; 4 sources, 9 effective, 1 shadowed |

Independent CLI cases covered table/JSON/Markdown, help/version, empty repository recovery, non-directory and missing paths, malformed Claude JSON, malformed Codex TOML/rules, invalid profile names, strict Codex rule selection, unions/default decisions, existing report preservation, hard-link policy preservation, and absolute/parent demo-output escapes. All behaved as documented except valid `justification` support.

## Live deployment, accessibility, privacy, and performance

- Deployment identity: 13 public files, including all route HTML, hashed JS/CSS, images, terminal SVG, robots, and sitemap, matched local `dist/site` byte-for-byte by SHA-256. The live hashed assets are `main-wfWOK7eh.js` and `style-Bnx-GhNB.css`. Unknown-route body also matches the local 404 output.
- Routes: `/`, `/demo`, `/privacy`, `/terms` return 200; an unknown route returns the designed 404 with HTTP 404.
- Factory `verify-url.sh`: pass; 631 ms network-idle load, title/lang/one h1/main/alt/button checks pass, no console errors on the home route.
- Independent axe: zero serious/critical findings across home, demo, privacy, terms, and 404 at 1440 px and 390 px.
- Keyboard: skip link is first; every interactive home/demo control is reachable; focus uses a 3 px outline with 4 px offset; Enter opens demo; Space resets it; route changes focus the destination heading; back restores the initiating CTA. No trap found.
- Mobile/zoom: no document overflow on five routes at 390 px; every visible link/button measured at least 44 × 44 px; 200% root text produced no horizontal document overflow.
- Reduced motion: the media query matches, smooth scrolling becomes `auto`, and animation/transition duration drops to `0.00001s`.
- Privacy: full route/demo observation contacted only `https://agent-permission-map.sociobot.in`; cookies, local storage, and session storage remained empty. Source/dependency review found no API, analytics, authentication, telemetry, network client, or subprocess launch.
- Browser errors: none on successful routes. Loading the intentional 404 logs the expected failed-document 404 and no page exception.
- Headers: HTTPS/HSTS, self-only CSP, `nosniff`, strict-origin referrer policy, and camera/microphone/geolocation denial are present. Hashed assets use one-year immutable caching and conditional requests return 304; HTML revalidates after 30 seconds; Brotli is served.
- Live links: all internal routes, the downloadable SVG, and the external Param Factory link returned 200.
- Lighthouse mobile: Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP **1.7 s**, LCP **1.7 s**, TBT **0 ms**, CLS **0**, Speed Index **1.6 s**, total transfer **136 KiB**.
- Build budgets: JS **4,831 bytes gzip**, CSS **3,846 bytes gzip**, no webfonts, hero WebP **128,376 bytes**.

The art-deco transit identity is distinctive and consistent with `.factory/design.md`. Manual desktop/mobile review found no document overflow or clipping outside the first-screen vertical-fit defect. Contrast passes axe; the single-mode decision and asset provenance are documented.

## Applicability

- Server endpoints/rate limiting: not applicable. This is a static site plus local CLI; no API or product-unlock endpoint exists.
- Sign-in/Entra: not applicable; there is no sign-in.
- PWA/service-worker update/offline reload: not applicable; there is no service worker, manifest, or offline claim.
- Backend concurrency, persistence, and health identity: not applicable; there is no backend.
- AI leverage: not applicable; deterministic local policy resolution should not use a model.

## Required before release

1. Keep the audience sentence, primary sample action, and three facts fully visible at 1366 × 768; reduce the desktop headline/hero vertical demand.
2. Accept and safely ignore or report the documented optional Codex `justification` field; add it to the `@claim:codex-rules` fixture and compare with `codex execpolicy check`.
3. Make **Start for real** actionable with a repository link and complete clone/install instructions, or publish a valid registry install target.
4. Generate the browser sample and terminal recording from the real CLI output, or correct Codex layers from `repo` to `project`; assert row equality in the demo claim.
5. Register and fully test “does not change vendor settings,” or narrow/remove that wording.
6. Add route-specific Open Graph and Twitter metadata to non-home documents.
