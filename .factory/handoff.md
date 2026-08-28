# Permit Map repair handoff

Repair work order: `agent-permission-map-repair-2`
Verifier base: `90cf362d1ef9191ae9ae5956990662c49c104937`
Primary repair commit: `e2e6edc0fd28961115dda089bda63da518cc135c`

## Repaired release blockers

- Codex `.rules` files now use a complete documented-call parser. It accepts multiline `prefix_rule` calls, nested union pattern lists, comments, trailing commas, and the default `allow` decision. Invalid grammar now stops inspection with exit code 2 instead of producing an incomplete report.
- Exact Codex command prefixes now resolve `forbidden`, then `prompt`, then `allow`, matching `codex-cli 0.150.1` `execpolicy check`. Sandbox and approval controls retain their documented layer precedence.
- Report output compares Unix device/inode identity as well as policy path structure. It refuses hard-link or symlink aliases to discovered vendor policy. Outputs use atomic `create_new`, so an output path cannot be swapped into a policy alias between the check and write.
- `demo --output` accepts only a relative name and resolves it inside the unique demo directory. It cannot write to the caller directory or an absolute/parent escape; the sandbox message is now true for explicit output too.
- Hash navigation now focuses the destination heading. Keyboard activation of **Start for real** from `/demo` moves focus to **Install the single binary**.

## Regression coverage

- Rust coverage adds multiline/union/default Codex parsing and competing `forbidden`/`allow` selection.
- CLI integration adds malformed `.rules`, hard-link policy-alias refusal, and demo output isolation.
- Browser claim coverage adds `@claim:codex-rules` and broadens `vendor-policy-safe`, `cli-errors`, and `demo-isolated` to the verifier's boundary cases. There are 15 claims and exactly one tag for each.
- Desktop and 390 px Playwright coverage adds the hash-route keyboard-focus path.

## Verification evidence

All commands were run from this checkout after a clean `npm ci`:

```text
npm ci                                             PASS — 25 packages, 0 vulnerabilities
npm test                                           PASS — 5 Rust unit + 8 CLI integration + 52 Playwright cases
all 15 literal .factory/claims.json test commands  PASS — each invoked independently
npm run typecheck                                  PASS
npm run lint                                       PASS
cargo fmt --all -- --check                         PASS
cargo clippy --all-targets --all-features -- -D warnings  PASS
npm audit --audit-level=high                       PASS — 0 vulnerabilities
npm run build                                      PASS — release binary and dist/site
cargo package --locked --allow-dirty               PASS — permit-map-0.1.0.crate, 615 KiB
extracted-package cargo install + demo --json      PASS — 4 sources, 9 effective, 1 shadowed
```

The direct Codex compatibility reproduction used a `.rules` file with identical `forbidden` and `allow` `git push` prefixes. `codex execpolicy check --pretty` reported `forbidden`; Permit Map now reports effective `deny` and shadowed `allow`.

Local production site evidence at `http://127.0.0.1:4173`:

- Factory `verify-url.sh`: 200, 547 ms load; title, `lang`, one h1, main, image alt, and button names present; no console errors.
- Playwright axe scan: no serious/critical findings on `/`, `/demo`, `/privacy`, `/terms`, and 404 at desktop and 390 px. Keyboard skip link, demo/reset, back-focus restoration, and hash focus all pass.
- Browser privacy claim: no cookies, local/session storage, or cross-origin requests. No API, telemetry, account, or offline/PWA claim applies to this local CLI and static documentation site.
- Lighthouse (mobile): Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; LCP **1.81 s**, CLS **0**.
- Production assets: JS **4,831 bytes gzip**, CSS **3,846 bytes gzip**, hero WebP **128,376 bytes**.

## Deploy

Deployment class remains static; deploy `dist/site/`. The primary repair commit was pushed to `origin/main`, the configured factory deployment trigger. At the immediate post-push check the live edge was still serving the prior `main-HKHA4EeK.js` asset (`Last-Modified: 12:39 UTC`); this is an external deployment propagation delay. Recheck the live URL against the built `main-wfWOK7eh.js` asset before announcing the release.

## Known limits

- The parser intentionally covers documented `prefix_rule` syntax only. Other vendor rule forms fail safely with code 2 instead of being guessed or omitted.
- Codex trust, selected profile, and CLI config context remain invocation inputs. Project rows are unresolved until `--codex-trust` is supplied.
- No registry publish was performed; the ready-to-publish command is `cargo package --locked`.
