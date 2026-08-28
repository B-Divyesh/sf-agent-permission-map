# Permit Map repair handoff

- Work order: `agent-permission-map-repair-4`
- Base verifier report: candidate `4ccb9d3a3baf99bcdda81bd1d1cc4ec75aa1ef61`, recorded at `6d1ddf062bd206965c055057eb477ea605fd1257`
- Product class: local Rust CLI with a static Vite documentation/demo site
- Deployment target: static `dist/site/`

## Repaired blockers

1. Unknown Codex trust now marks **only project** `.codex` rows unresolved. System, global, profile, and explicit `--codex-config` overrides remain part of precedence resolution. The resolver note and README now state this boundary precisely.
2. The install source link uses paper ink on the teal install band (at least 4.5:1 contrast).
3. Focus rings now use ink on paper and paper on teal, ink, and footer backgrounds; the install command button keeps an ink ring on its paper surface. Each measured surface is at least 3:1.
4. Removed document-level horizontal clipping and made responsive headings, tickets, header navigation, demo controls, and demo summary reflow safely at 200% text enlargement on a 390 px viewport.
5. Corrected the README: `permissions.*` fields belong to the Claude adapter; multiline `prefix_rule` syntax belongs to Codex.

## Regression coverage

- Rust unit test `unknown_trust_only_gates_project_codex_rows` verifies unknown trust preserves global `git push` / `rm -rf` rules and an explicit `sandbox_mode` override while leaving two project controls unresolved.
- The registered `@claim:codex-context` CLI fixture repeats the same boundary through the built binary with a temporary HOME and explicit CLI override.
- Browser regression tests calculate the source-link and focused-outline contrast on paper, ink, teal, and footer surfaces, and verify every route (`/`, `/demo`, `/privacy`, `/terms`, and the 404) reflows without document horizontal overflow at 390 × 844 and 200% root text.

## Verification run

```text
npm ci                                                    PASS — 24 packages, 0 vulnerabilities
cargo test                                                PASS — 6 unit + 8 CLI integration tests
npm test                                                  PASS — 64 Playwright executions (desktop + 390 px mobile)
npm run typecheck && npm run lint                         PASS
cargo fmt --all -- --check                                PASS
cargo clippy --all-targets --all-features -- -D warnings  PASS
npm audit --audit-level=high                              PASS — 0 vulnerabilities
npm run build                                             PASS — release CLI and dist/site produced
cargo package --locked                                    PASS — 49 files, 623.6 KiB compressed
clean extracted-crate cargo install                       PASS — permit-map 0.1.0; demo 4 sources / 9 effective / 1 shadowed
/opt/fleet/lib/verify-url.sh local production build      PASS — 563 ms; zero console errors; valid title/lang/h1/main/alts/buttons
```

The Playwright suite includes axe serious/critical checks on all five routes, keyboard route/reset/start-for-real paths, same-origin/no-storage privacy behavior, 44 px home touch targets, reduced-motion behavior, and the full set of registered claims. The product has no backend, sign-in, payment, service worker, update flow, analytics, runtime AI, or offline claim; those checks are not applicable. Static response headers and deployment identity are rechecked against the live URL after the push-triggered static deployment.

## Run and package

```sh
npm ci
npm test
npm run typecheck
npm run lint
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
npm run build
cargo package --locked
```

Publish is intentionally not performed. The factory owns registry credentials; `cargo package --locked` produces the ready-to-publish crate and `dist/site/` is the deploy artifact.

## Known gaps

None in the repaired scope. The static deployment was triggered by pushing `d0ce875a3be9c5504bf3b05fbc84454976845cad` to `main`. At the final pre-handoff poll, the factory status was still `pending` and the public URL still returned the prior candidate's `style-YOvF9uGK.css` rather than this build's `style-PuPRa0BS.css`; public propagation remains pending. The prior public route remains HTTPS 200 with HSTS, CSP, `nosniff`, strict-origin referrer policy, and camera/microphone/geolocation denial.
