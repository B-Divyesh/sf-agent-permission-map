# Permit Map repair handoff

Repair work order: `agent-permission-map-repair-1`  
Base candidate: `085268444f0e1acfa78db96606d5e1343271809f`  
Primary repair commit: `e46d89784d3f38c793bb925431b4f6ab8322d04c`

## Completed repairs

- Claude now resolves an exact matcher by vendor order across every discovered scope: deny, then ask, then allow. A repo deny can no longer become a worktree allow.
- Codex now models the documented system, user, selected profile, and project-root-to-working-directory layers. Project rows remain `unresolved` until `--codex-trust trusted` or `--codex-trust untrusted` is supplied; `--codex-profile` and repeatable `--codex-config key=value` record invocation context. The undocumented `config.local.toml` layer was removed.
- `--output` refuses any discovered or known Claude/Codex vendor policy filename. `--json` is now a scripting shorthand for `--format json`.
- Registered the missing safety, isolation, exit-code, vendor-boundary, Codex-context, and 390 px touch-target claims. The corrected Claude claim has a reverse-scope deny regression fixture.
- Raised the full-sample link and all footer links to a measured 44 px minimum target at 390 px.
- Added strict TypeScript checking (`npm run typecheck`) and a lint gate (`npm run lint`), including the required Node typings.
- Replaced the non-versioned WebP immutable cache policy with one-day caching. The static build now emits real Demo, Privacy, Terms, and 404 documents; `staticwebapp.config.json` rewrites known routes and serves the designed 404 with HTTP 404.

## Verification evidence

Run after a clean `npm ci`:

```text
npm run lint                                      PASS
npm test                                          PASS — 4 Rust unit + 5 CLI integration + 48 Playwright cases
cargo fmt --check                                 PASS
cargo clippy --all-targets --all-features -- -D warnings  PASS
npm audit --audit-level=high                      PASS — 0 vulnerabilities
npm run build                                     PASS — target/release/permit-map and dist/site/
cargo package --locked --allow-dirty              PASS — 46 files, 607.5 KiB compressed
clean-prefix cargo install + permit-map demo --json PASS — 9 effective, 1 shadowed
```

The full browser suite ran against desktop Chromium and a 390 × 844 touch viewport. It includes keyboard demo/reset operation, route-focus restoration, serious/critical axe scans on `/`, `/demo`, `/privacy`, `/terms`, and the missing-route view, browser privacy checks, reduced-motion coverage from the existing suite, and the 44 px link measurement.

All 14 declared claims in `.factory/claims.json` ran through `npm test`; each has exactly one tagged regression test. The safety test proves that an attempted Markdown report at `.claude/settings.json` exits 2 and leaves the JSON policy byte-for-byte unchanged.

Local Lighthouse on the production build (`127.0.0.1:4173`, headless Chromium) recorded: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; LCP **1.7 s**, CLS **0**. Produced assets: JS **4.76 KiB gzip**, CSS **3.85 KiB gzip**, poster **128,376 bytes**.

## Run and deploy

```sh
npm ci
npm test
npm run lint
npm run build
cargo install --path .
permit-map inspect . --codex-trust trusted
```

Deployment class remains static. Deploy `dist/site/`; the `main` push is the configured factory deployment trigger. No credentials, analytics, or external runtime services are required.

## Known limits

- Codex CLI flags and project trust cannot be discovered from policy files alone. Permit Map marks affected project rows unresolved until the caller supplies the trust setting and any relevant `--codex-config` values. This is intentional fail-safe behavior, not an inferred effective policy.
- Offline reload and server-side identity checks are not applicable: this is a local CLI with a static documentation/demo site and makes no offline claim or backend/API request.
