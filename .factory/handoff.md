# Permit Map independent verification handoff

**Result: FAIL**

- Work order: `agent-permission-map-verify-2`
- Candidate: `bf224e9b2d846899aa3491c091fa170ee7f1a5e2`
- Live URL: <https://agent-permission-map.sociobot.in>
- Verified: 28 August 2026 UTC
- Full report: [.factory/verification-2.md](verification-2.md)

The live deployment is healthy and byte-matches the candidate, the cold first screen and one-click sample pass, and all repository/build/package/browser quality gates are green. The release still fails because the CLI can report a Codex `allow` when Codex applies `forbidden`, drops documented Codex rule syntax, and violates registered error, overwrite-safety, and demo-isolation claims on valid boundary cases.

## Release blockers

1. **Critical:** identical Codex `forbidden` and `allow` prefix rules are resolved to effective `allow`; `codex execpolicy check` and official OpenAI documentation resolve `forbidden`.
2. **High:** official multiline rules are omitted, union patterns are flattened incorrectly, default-allow rules are omitted, and malformed `.rules` exit 0.
3. **High:** writing through a hard-link alias overwrites a discovered vendor policy despite the refusal claim.
4. **High:** `demo --output report.md` writes into the caller directory and then says nothing outside the temporary directory changed.
5. **Medium:** `/demo` → `/#install` navigation scrolls correctly but leaves keyboard focus on `<body>`.

## Verification summary

From a separate clean Git clone at the candidate:

```text
npm ci                                             PASS — 24 packages, 0 vulnerabilities
npm test                                           PASS — 4 unit + 5 CLI + 48 Playwright
npm run typecheck                                  PASS
npm run lint                                       PASS
cargo fmt --all -- --check                         PASS
cargo clippy --all-targets --all-features -- -D warnings  PASS
npm audit --audit-level=high                       PASS — 0 vulnerabilities
npm run build                                      PASS — release binary + dist/site
cargo package --locked                             PASS — 46 files, 608.1 KiB compressed
clean-prefix install + installed demo --json       PASS — 4 sources, 9 effective, 1 shadowed
```

All 14 exact `.factory/claims.json` commands passed and each has exactly one tag. Independent cases disprove `cli-errors`, `vendor-policy-safe`, and `demo-isolated`, so the claims gate fails on truthfulness/coverage despite green scripts.

The factory URL checker passed in 608 ms. Live axe scans found no serious/critical issue across home, demo, privacy, terms, and 404 at desktop and 390 px. Lighthouse scored 97/100/100/100 with LCP 1.5 s, TBT 190 ms, and CLS 0. JS is 4.79 KiB gzip, CSS 3.85 KiB gzip, and the hero is 128,376 bytes. Headers, caching, first-read copy, one-click demo, same-origin privacy, touch targets, reduced motion, keyboard basics, and responsive layout pass.

## Reproduce the decisive failure

Create a trusted project `.codex/rules/default.rules` containing:

```python
prefix_rule(pattern = ["git", "push"], decision = "forbidden")
prefix_rule(pattern = ["git", "push"], decision = "allow")
```

Then compare:

```sh
permit-map inspect . --no-global --codex-trust trusted --json
codex execpolicy check --pretty --rules .codex/rules/default.rules git push origin main
```

Permit Map selects allow; Codex selects forbidden.

## Next steps

Implement a real Codex rules parser and most-restrictive matching, harden report output against filesystem aliases, reconcile demo `--output` with its sandbox claim, expand the claim fixtures, and fix focus for hash-bearing route changes. Re-run this complete verification after those changes. No product source was modified during this verification.
