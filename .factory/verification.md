# Independent product verification

**Verdict: FAIL**

- Candidate: `085268444f0e1acfa78db96606d5e1343271809f`
- Branch: `main`
- Live URL: <https://agent-permission-map.sociobot.in>
- Verified: 28 August 2026 UTC
- Scope: original researched brief and injected accessibility, claims, demo, design, CLI, performance, plain-language, and site-structure contracts

The deployment is healthy and matches the candidate, but the CLI can reverse a real Claude Code deny into an effective allow. It also models current Codex configuration precedence incompletely. These are release blockers for a product whose job is to show the effective policy before an agent runs.

## Release-blocking findings

### Critical — Claude precedence can turn a real deny into a reported allow

`src/lib.rs` ranks `(layer, effect, order)`, so a worktree rule wins before the tool considers whether a lower-scope rule denies the same matcher. A fresh fixture with this policy reproduced the problem:

```json
// .claude/settings.json
{"permissions":{"deny":["Bash(git push:*)"]}}

// .claude/settings.local.json
{"permissions":{"allow":["Bash(git push:*)"]}}
```

The packed and clean-installed candidate returned exit 0 with:

```text
effective  worktree allow  Bash(git push:*)
shadowed   repo     deny   Bash(git push:*)
```

Current Claude Code documentation says rules are evaluated deny, then ask, then allow, and explicitly says a deny in any scope blocks an allow in another scope. Therefore Claude Code denies this command while Permit Map reports it as allowed.

Reference: <https://code.claude.com/docs/en/permissions#settings-precedence>

This also invalidates claim `resolution-order`: its test passes because it encodes the product's incorrect layer-first rule and never tests a lower-layer deny against a higher-layer allow.

### High — Codex configuration sources and precedence are incomplete

The adapter reads `~/.codex/config.toml`, one `<root>/.codex/config.toml`, and an undocumented `<root>/.codex/config.local.toml`. Current Codex configuration uses:

- project `.codex/config.toml` files from project root down to the current directory, closest first;
- selected profile files;
- user and system configuration;
- project trust, which can suppress project-scoped configuration and rules;
- CLI and `--config` overrides above those layers.

Official reference: <https://developers.openai.com/codex/config-file/config-basic#configuration-precedence>

A fixture with a root `.codex/config.toml` and a nested `services/api/.codex/config.toml` demonstrated that inspecting the root returned only the root policy, while inspecting the nested directory returned only the nested policy. The CLI never combined the layers. It also labels `config.local.toml` as a worktree layer although that path does not appear in the current precedence documentation. The report can therefore omit or invent effective Codex state without a prominent unsupported-semantics warning.

### High — the CLI can overwrite a vendor policy despite promising it never changes settings

The landing page and README say Permit Map does not change vendor settings. `--output` accepts a policy input path without a safety check. Against a temporary copy of the sample repository:

```sh
permit-map inspect "$repo" --no-global --format markdown \
  --output "$repo/.claude/settings.json"
```

The command exited 0, printed `Wrote .../.claude/settings.json`, and replaced the JSON policy with a Markdown report. A subsequent JSON parse failed on line 1. The CLI must reject output paths that overlap any discovered policy file, or the categorical promise must be narrowed and tested.

### High — the claims contract is not complete

The page and README make material claims absent from `.factory/claims.json`, including:

- “It does not change vendor settings.” This is false for the output-path case above.
- “It does not read source files or credential stores.” The registered `policy-files` test only asserts that decoy contents are absent from output; it does not observe file opens.
- The demo changes nothing outside its temporary directory.
- Missing paths, unreadable files, and malformed supported files exit with code 2.
- Different vendors never shadow one another, and pattern overlap remains visible but unresolved.

The attached claims contract makes an unlisted claim release-blocking. The registered `resolution-order` claim is additionally contradicted by current Claude behavior.

## Other findings

### Medium — mobile touch targets miss the 44 px baseline

At a 390 × 844 viewport, independent browser measurements found these visible links below 44 px high:

- “Open the full sample map”: 267.2 × 20 px
- Footer “Privacy”: 61.6 × 26.3 px
- Footer “Terms”: 50.1 × 26.3 px
- Footer “Built by Param Factory”: 191.6 × 26.3 px

This occurs on every route for the footer links. Keyboard focus is visible, but touch sizing does not meet the supplied accessibility and design contracts.

### Medium — no working TypeScript type-check gate

There is no `typecheck` or `lint` script and no `tsconfig.json`. An explicit `npx tsc --noEmit ...` check exited 2 because `@types/node` is absent and the installed Playwright type trees conflict. Vite still builds because it transpiles without type checking.

### Low — unknown URLs return HTTP 200

`/definitely-missing` renders the designed not-found screen but the server returns `200`, not `404`. This weakens crawler and monitoring semantics.

### Low — a non-versioned image is cached as immutable

`/permit-map-poster.webp` is not content-hashed but is served with `Cache-Control: public, max-age=31536000, immutable`. A future asset replacement at the same URL can remain stale for a year.

### Low — no direct `--json` flag

The CLI contract requests `--json` output for scripting. The installed binary rejects `--json` with exit 2. JSON is available through `--format json`, so this is a compatibility/usability gap rather than missing functionality.

## Mandatory claims gate

`.factory/claims.json` exists and contains eight entries, each with exactly one tagged test.

The literal first run from the untouched checkout occurred before dependency installation, as requested. All eight commands exited 127 at `npm run build:site` because `vite` was not installed. After `npm ci`, every exact command passed in desktop Chromium and the 390 px mobile project:

| Claim | Post-install result | Evidence |
|---|---|---|
| `demo-resolves` | Pass | 2 browser cases; 4 sources, 9 effective, 1 shadowed |
| `report-formats` | Pass | table, JSON, and Markdown exercised |
| `policy-files` | Pass, test insufficient for read privacy | policy output excludes `.env` and unrelated JSON |
| `no-account` | Pass | clean contexts; no form or cookies |
| `mit-license` | Pass | LICENSE and Cargo metadata |
| `browser-privacy` | Pass | same-origin requests; no cookies/local/session storage |
| `cli-local` | Pass | source and dependency-name inspection |
| `resolution-order` | Test passes, product claim fails | test encodes incorrect Claude precedence |

Because the claims contract says any failing claim test is release-blocking, the raw clean-clone command result is itself a gate failure. More importantly, the post-install `resolution-order` test proves the wrong real-world behavior.

## First-read and demo test

**Pass.** In a cold, storage-free browser context, the first screen answers:

- What it does: “See agent permissions before they run.”
- Who it is for: engineers using several coding agents across repositories.
- What to click first: “Try it with sample data.”

One click opens `/demo`, already populated with the 4-source/9-effective/1-shadowed report. The persistent banner says “Demo — sample data, nothing is saved” and exposes “Reset demo” and “Start for real.” Reset gives an `aria-live` confirmation. No account is requested.

## Local build and package evidence

| Check | Result |
|---|---|
| `npm ci` | Pass; 22 packages, 0 vulnerabilities |
| `npm test` | Pass; 6 Rust tests and 34 Playwright cases |
| `cargo fmt --check` | Pass |
| `cargo clippy --all-targets --all-features -- -D warnings` | Pass |
| `npm audit --audit-level=high` | Pass; 0 vulnerabilities |
| `npm run build` | Pass; release binary and `dist/site/` produced |
| `cargo package --locked` | Pass; 40 files, 597.6 KiB compressed |
| Clean-prefix install from packaged crate | Pass; `permit-map 0.1.0` |
| Installed CLI `demo --format json` | Pass; 4/9/1 counts |
| Explicit TypeScript check | Fail; no usable type-check setup |

The release binary is 950,696 bytes. Representative CLI recovery checks passed: empty directory exits 0 with a next step; nonexistent path, file-as-path, invalid format, and unwritable output all exit 2 with useful errors. Normal Markdown output succeeds.

## Live deployment evidence

All candidate build artifacts checked are byte-for-byte identical to live responses: HTML, hashed JS/CSS, favicon, apple-touch icon, OG image, poster image and provenance JSON, robots, sitemap, and terminal SVG.

- `/`, `/demo`, `/privacy`, and `/terms`: HTTP 200.
- `verify-url.sh`: pass; 767 ms observed load, one h1, `lang=en`, main landmark, all images have alt text, no unlabeled buttons, no console errors.
- Independent axe scans: zero serious/critical findings across `/`, `/demo`, `/privacy`, `/terms`, and the not-found view at 1440 px and 390 px.
- Keyboard: skip link is first; all controls are reachable; focus outline is 3 px with 4 px offset; Enter opens the demo; Space resets it; history restores focus.
- Reduced motion: route animation computes to `0.00001s`; scrolling and transforms are removed.
- No horizontal document overflow at 390 px on tested routes; the wide data table has its own labeled, focusable scroll region.
- Browser privacy: only the site origin was requested; cookies, local storage, session storage, IndexedDB, and Cache Storage remained empty after demo/reset.
- Link crawl: every emitted internal link, terminal download, and Param Factory external link returned 200.
- No console errors, page errors, CSP violations, or failed subresources.

Live response policy includes HTTPS, HSTS, CSP restricted to self/data images, `nosniff`, strict-origin referrer policy, and a restrictive permissions policy. Hashed JS/CSS are cached for one year immutable; HTML revalidates after 30 seconds.

Lighthouse mobile against the live URL:

- Performance 99
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 0.9 s; LCP 1.6 s; Speed Index 0.9 s; TBT 120 ms; CLS 0

Production budgets pass: JS 4.71 KiB gzip, CSS 3.84 KiB gzip, no webfonts, hero WebP 128,376 bytes.

## Applicability checks

- Server endpoints/rate limiting: not applicable. This is a static site plus local CLI, and the browser issues no API requests.
- Sign-in/Entra: not applicable; there is no sign-in.
- PWA/service worker/offline reload: not applicable; no PWA or offline claim is made.
- Backend concurrency/persistence/health identity: not applicable; no backend exists.
- AI leverage: not applicable; deterministic local policy resolution does not benefit from model inference.

## Required next actions

1. Implement vendor-correct Claude precedence and add the reverse-scope deny fixture as a claim test.
2. Model current Codex project, trust, profile, system, and override layers, or report them as unsupported so the result cannot be mistaken for effective policy.
3. Prevent report output from overwriting any discovered input policy.
4. Register and meaningfully test every material privacy/safety/behavior claim.
5. Raise all mobile targets to at least 44 × 44 px and add a measured regression test.
6. Add a real TypeScript type-check gate; correct the 404/cache issues and CLI flag gap.
