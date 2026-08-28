# Polish round 1 — Permit Map

Base reviewed: `bad4fb763baefba4318eb7eb5ae93c2988779cce`. This round closes every finding in `.factory/review-1.md`; no earlier `review-*` or `polish-*` record exists.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | The landing action now opens the isolated `/?demo=1` route. At 390 px the sticky banner, compact summary, and three real decision/matcher/source rows fit above the fold. The compact table uses full source basenames, not clipped labels. | `@claim:demo-entry`; `site-tests/site.spec.ts` offline-reset check; [.factory/evidence/f-1-1-mobile-demo.png](evidence/f-1-1-mobile-demo.png); cold live [`/?demo=1`](https://agent-permission-map.sociobot.in/?demo=1) returned 200 with three rows above the fold. |
| F-1-2 | Split the Codex controls sentence into the reviewed short wording. | `reviewed README sentences use the approved short wording`; README copy audit. |
| F-1-3 | Split the Codex trust sentence and moved accepted values into the option sentence. | `reviewed README sentences use the approved short wording`; README copy audit. |
| F-1-4 | Split the verification sentence into two short sentences. | `reviewed README sentences use the approved short wording`; README copy audit. |
| F-1-5 | Rewrote the CTA helper to describe the isolated sample and registered the exact one-click behavior as `demo-entry`. | `@claim:demo-entry`; cold live [`/?demo=1`](https://agent-permission-map.sociobot.in/?demo=1) check. |
| F-1-6 | Narrowed preview copy to the sample and registered `demo-rule-provenance`, which compares every displayed decision, status, matcher, and source against `permit-map demo --format json`. | `@claim:demo-rule-provenance`; cold live [`/?demo=1`](https://agent-permission-map.sociobot.in/?demo=1) check. |
| F-1-7 | Registered the README’s complete no-third-party promise as `site-no-third-parties`, visiting every public route and asserting same-origin requests plus empty cookies, storage, IndexedDB, caches, and service workers. | `@claim:site-no-third-parties`; cold live routes `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` requested only the same origin with no browser persistence. |

The browser demo uses no persistent storage, so its isolation is stronger than a separate storage prefix: sample state exists only in the loaded document and cannot read or write real browser data. `/?demo=1` is the canonical one-click entry; `/demo` remains a real alternate route.

## Round evidence

- `npm test`: 78 Playwright executions plus 6 Rust unit and 8 Rust integration tests passed.
- `npm run typecheck`, `npm run lint`, `cargo fmt --all -- --check`, `cargo clippy --all-targets --all-features -- -D warnings`, `npm audit --audit-level=high`, and `npm run build` passed.
- Fresh clone `/tmp/permit-map-final.A6LMqi/repo`: `npm ci`, full suite, all 19 literal claim commands, typecheck/lint/fmt/clippy/audit/build, and `cargo package --locked` passed.
- Live deployment: `deploy-static.sh agent-permission-map dist/site` completed. `verify-url.sh` recorded clean cold responses in `evidence/live-home/` and `evidence/live-demo/`; live axe scans reported no serious or critical violations.
