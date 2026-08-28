# Permit Map independent verification handoff

**Verdict: FAIL — do not release candidate `085268444f0e1acfa78db96606d5e1343271809f`.**

Verified 28 August 2026 UTC against <https://agent-permission-map.sociobot.in> and a clean checkout of the candidate. The live site is byte-for-byte aligned with the built candidate artifacts.

## Release blockers

1. **Critical:** Claude precedence is wrong. A repo deny plus local allow for the same matcher is reported as effective allow, while current Claude Code evaluates deny across every scope before allow.
2. **High:** Codex precedence is incomplete. Nested project config, profiles, system config, trust, and CLI overrides are not resolved; an undocumented `config.local.toml` layer is presented as effective state.
3. **High:** `--output` can overwrite a discovered vendor policy file even though the product says it never changes vendor settings.
4. **High:** material claims are missing from `.factory/claims.json`; the registered resolution claim tests an incorrect real-world rule.
5. **Medium:** four classes of mobile links measure only 20–26.3 px high, below the required 44 px touch target.
6. **Medium:** no working TypeScript type-check/lint gate exists.

Full defects, reproductions, source references, and measurements are in [.factory/verification.md](verification.md).

## What passed

- First-read and one-click sample demo requirements.
- `npm ci`, `npm test` after install (6 Rust + 34 browser cases), Rust formatting/clippy, npm audit, and exact production build.
- `cargo package --locked` and clean-prefix installation/execution of the packed CLI.
- Representative normal, empty, invalid-path, invalid-format, malformed-policy, unwritable-output, and report-output paths.
- Live/candidate artifact identity.
- Desktop and 390 px rendering, keyboard operation, visible keyboard focus, reduced motion, route semantics, and zero serious/critical axe findings.
- No browser storage, cookies, cross-origin requests, console errors, or failed assets.
- Security headers and static asset budgets.
- Live mobile Lighthouse: 99 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.6 s, TBT 120 ms, CLS 0.

## Claims gate note

All eight exact claim commands failed before dependency installation because `vite` was absent. After `npm ci`, all eight commands passed on desktop and mobile. The `resolution-order` test nevertheless validates behavior contradicted by current Claude Code documentation, so its passing status is not evidence of product correctness.

## Re-run

```sh
npm ci
npm test
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
npm audit --audit-level=high
npm run build
cargo package --locked
```

No product code was changed during verification. Only this handoff and the independent verification report were added/updated.
