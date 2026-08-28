# Permit Map repair handoff

Work order: `agent-permission-map-repair-3`  
Repair implementation: `c0756676daa94d7bbe4ff3995b40fdc92b7ee456`  
Base verifier report: `3d489e954ce2182fbd0905183041fa641e722402` / `.factory/verification-3.md`  
Artifact and deployment class: Rust CLI plus static Vite site (`dist/site`)

## Result

All release-blocking findings from verification-3 are repaired.

- The desktop hero now keeps the audience sentence, **Try it with sample data** action, and all three facts within a 1366 × 768 viewport. A Playwright regression checks each element's bottom bound.
- The Codex `.rules` parser accepts the documented optional quoted `justification` field, validates it is not duplicated, and safely omits it from Permit Map's normalized decision report. The bundled rule and the `@claim:codex-rules` fixture contain the documented field. `codex-cli 0.150.1` accepts the bundled rule and returns `prompt` plus its justification; Permit Map reports the corresponding `ask` row.
- **Start for real** now focuses the install section containing a source-repository link and a complete clone, change-directory, and `cargo install --path .` command. The README matches it.
- The browser demo, terminal preview, and downloadable terminal recording label bundled Codex files as `project`, matching real CLI output. `@claim:demo-resolves` compares every browser table row to `permit-map demo --format json`.
- “Permit Map does not change vendor settings.” is now the registered `vendor-settings-unchanged` claim. Its regression hashes every discovered supported project policy before and after a successful trusted inspection.
- `/demo`, `/privacy`, `/terms`, and the 404 document now have route-specific Open Graph and Twitter-card metadata. A route regression checks all required tags.

## Verification evidence

Clean dependency installation:

```text
npm ci                                              PASS — 24 packages added; 0 vulnerabilities
npm test                                            PASS — 5 Rust unit + 8 CLI integration + 60 Playwright tests
16 literal claims.json commands, separately        PASS — each in Chromium and 390 px mobile projects
npm run typecheck && npm run lint                   PASS
cargo fmt --all -- --check                          PASS
cargo clippy --all-targets --all-features -- -D warnings  PASS
npm audit --audit-level=high                        PASS — 0 vulnerabilities
npm run build                                       PASS — target/release/permit-map and dist/site
cargo package --locked --allow-dirty                PASS — permit-map-0.1.0.crate, 619 KiB
```

Consumer/package check passed from an extracted crate in a fresh temporary prefix: `cargo install --path <extracted> --root <prefix>` installed `permit-map 0.1.0`; `permit-map demo --format json` reported 4 sources, 9 effective rules, and 1 shadowed rule.

Browser and accessibility checks:

```text
Playwright desktop + 390 px mobile                  PASS — route, keyboard, focus restore, touch targets, overflow, demo reset
Playwright axe serious/critical, 5 routes × 2       PASS — 0 findings
/opt/fleet/lib/verify-url.sh local build            PASS — 540 ms, no console errors, title/lang/one h1/main/alts/buttons valid
Lighthouse local mobile                             PASS — Performance 100, Accessibility 100, Best Practices 100, SEO 100
                                                    FCP 1.0 s, LCP 1.9 s, TBT 0 ms, CLS 0
```

`@axe-core/cli` itself could not create a ChromeDriver session against this container's Playwright Chromium, even with its browser path supplied. The required equivalent Playwright axe integration ran successfully across every route and viewport.

Privacy, safety, and scope checks remain intact: the browser claim records only same-origin requests with no cookies or browser storage; the CLI has no network, telemetry, or agent-launch dependency; successful inspection preserves all vendor-policy hashes. There is no service worker or offline/update promise, API endpoint, sign-in, payment flow, or AI feature, so offline-update, backend response-policy, and live API identity checks are not applicable.

## Run and verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
cargo package --locked
```

Run the CLI demo with `cargo run -- demo --format json`. Build the static deployment with `npm run build:site`; deploy `dist/site`.

## Deployment

The static deployment is triggered by pushing `main`. `f3d70d0` was pushed to `origin/main` successfully. Immediately after the push, repeated HTTPS checks still returned the prior live asset hashes (`main-wfWOK7eh.js`, `style-Bnx-GhNB.css`) rather than this build's `main-C0zeLAHu.js` and `style-YOvF9uGK.css`; the factory static-deployment propagation is pending. The prior live route still returns HTTPS 200 with the expected static security headers. Recheck the hashes after propagation before calling the public rollout complete.

## Known gaps

No product gaps are known. The standalone axe CLI ChromeDriver launch is an environment-tool compatibility issue; the repository's Playwright axe integration is passing and is the accessibility gate used by `npm test`. Public CDN deployment propagation was still pending at handoff time.
