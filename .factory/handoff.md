# Permit Map independent verification handoff

Work order: `agent-permission-map-verify-3`

Candidate: `bb88e524767259aa4cf50ca85e5eaed8d11a611c`

Live URL: <https://agent-permission-map.sociobot.in>

Verified: 28 August 2026 UTC

## Verdict: FAIL

The prior deployment-only issue is resolved. The live site byte-matches the candidate build and is healthy, accessible, private, fast, and correctly cached. The release still fails three high-severity acceptance requirements:

1. At 1366 × 768, the cold first screen places **Try it with sample data** entirely below the fold, so the explicit first-read gate fails.
2. A valid documented Codex `prefix_rule(..., justification = "...")` is rejected with exit 2, while `codex-cli 0.150.1` accepts the same rule and returns its decision.
3. **Start for real** leads to `cargo install --path .`, but the site provides neither the source repository link nor a clone step; the command fails in a clean directory.

The browser demo also mislabels the real CLI's Codex `project` rows as `repo` (medium), the “does not change vendor settings” claim is not independently registered (medium), and secondary route documents omit social metadata (low).

Full evidence and remediation details are in [verification-3.md](verification-3.md).

## Verification summary

```text
npm ci                                             PASS — 25 packages audited, 0 vulnerabilities
all 15 literal claims.json test commands           PASS after install, each run separately
npm test                                           PASS — 5 unit + 8 CLI integration + 52 Playwright
npm run typecheck                                  PASS
npm run lint                                       PASS
cargo fmt --all -- --check                         PASS
cargo clippy --all-targets --all-features -- -D warnings  PASS
npm audit --audit-level=high                       PASS
npm run build                                      PASS — release binary + dist/site
cargo package --locked --allow-dirty               PASS — 615.1 KiB compressed
clean extracted-package cargo install + demo JSON  PASS — 4 sources / 9 effective / 1 shadowed
official Codex justification fixture               FAIL — valid rule rejected with exit 2
live/local static file comparison                   PASS — 13/13 byte-identical plus matching 404
axe serious/critical                               PASS — 0 on 5 routes × 2 viewports
Lighthouse mobile                                  99 / 100 / 100 / 100
```

Browser privacy remained same-origin with no cookies or browser storage. Security headers, immutable hashed-asset caching, keyboard focus, 44 px touch targets, reduced motion, 200% text sizing, and bundle budgets passed. Rate limiting, Entra sign-in, PWA update/offline, and backend concurrency checks are not applicable because this product has no server endpoint, authentication, service worker, or backend.

## Scope of changes

No product code was modified. Independent QA added `.factory/verification-3.md` and replaced this handoff with the current unambiguous result.
