# Independent product verification — candidate 2

**Verdict: FAIL**

- Candidate: `bf224e9b2d846899aa3491c091fa170ee7f1a5e2`
- Branch/remote at verification: `main` and `origin/main` both pointed to the candidate
- Live URL: <https://agent-permission-map.sociobot.in>
- Verified: 28 August 2026 UTC
- Contract: original builder work order, researched brief, and injected claims, demo, accessibility, design, CLI, performance, plain-language, and site-structure requirements

The repaired deployment is healthy and matches the candidate. The first-read and one-click demo gates pass. All 14 declared test commands also pass. The candidate is nevertheless not releasable: ordinary, documented Codex rules can be omitted or resolved to the opposite decision, and independent boundary tests disprove three registered safety/error/isolation claims.

## Release-blocking findings

### Critical — Codex `forbidden` can be reported as an effective `allow`

Permit Map ranks Codex rules by layer/order rather than by the most restrictive matching decision (`src/lib.rs:365-395`). With one valid rule file containing:

```python
prefix_rule(pattern = ["git", "push"], decision = "forbidden")
prefix_rule(pattern = ["git", "push"], decision = "allow")
```

the candidate exits 0 and reports:

```text
effective  allow  command:git push
shadowed   deny   command:git push
```

The installed `codex-cli 0.150.1` evaluated the same file and command with `codex execpolicy check` and returned `decision: "forbidden"`, with both matching rules listed. Official OpenAI documentation likewise says Codex applies the most restrictive matching decision: `forbidden > prompt > allow`.

This reverses a deny into an allow in the product's core security decision. The shipped tests cover Codex config-layer precedence but never conflicting Codex command rules.

Official reference: <https://learn.chatgpt.com/docs/agent-configuration/rules>

### High — the Codex rules parser drops documented syntax and accepts malformed policy

`parse_codex_rules` treats each physical line as a whole rule (`src/lib.rs:575-635`). Independent fixtures demonstrate four incorrect results:

- The multiline `prefix_rule(...)` form used in the official documentation is read as zero rules. Permit Map exits 0 with several notes; `codex execpolicy check` matches it as `prompt`.
- A supported union pattern such as `["git", ["push", "status"]]` is flattened to the nonexistent single prefix `command:git push status`. Codex matches both `git push` and `git status` separately.
- A rule with no `decision` is ignored, while Codex correctly applies its documented default of `allow`.
- A syntactically malformed `.rules` file exits 0 and produces no rules. Codex rejects the same file as a parse error.

The last case directly disproves registered claim `cli-errors`: “malformed supported policy files exit with code 2.” It exits 0 for the product's supported `.rules` format. It also contradicts the README claim that the adapter reads `prefix_rule` entries with allow, prompt, or forbidden decisions.

Official references: <https://learn.chatgpt.com/docs/agent-configuration/rules> and <https://learn.chatgpt.com/docs/config-file/config-basic>

### High — a hard-link output alias overwrites a discovered vendor policy

Registered claim `vendor-policy-safe` says Permit Map refuses to write a report over a discovered vendor policy. The guard compares canonical path strings (`src/main.rs:149-203`) and does not compare file identity.

Independent reproduction:

1. Create `.claude/settings.json`.
2. Hard-link it to `report.md` (both paths have the same inode).
3. Run `permit-map inspect <repo> --no-global --format markdown --output <repo>/report.md`.

The command exited 0, printed `Wrote .../report.md`, changed the policy SHA-256 from `12cef99d...` to `5dd6f933...`, and `.claude/settings.json` began with `# Permit Map report`. This is a destructive violation of the product's explicit safety promise. The passing claim test checks only the identical path string, not aliases.

### High — the demo isolation claim is false when `--output` is used

Registered claim `demo-isolated` says the demo command changes nothing outside its temporary directory. From a clean caller directory:

```sh
permit-map demo --format markdown --output report.md
```

exited 0 and created `report.md` in the caller directory. It then printed both `Wrote report.md` and `Nothing outside this temporary directory was read or changed.` (`src/main.rs:244-248`). The passing claim test runs only `demo --json` without the supported output option.

The implementation must constrain demo output to its sandbox, or the claim and unconditional message must accurately disclose the explicit-output exception.

## Other finding

### Medium — “Start for real” route navigation loses keyboard focus

On live mobile, keyboard activation of “Start for real” correctly navigates to `/#install` and eventually scrolls the install section to the top. Focus becomes `<body>`, not the new page `<h1>` or the target section. `navigate()` only moves focus when a URL has no hash (`site/src/main.ts:151-159`). This misses the supplied route-change focus requirement and leaves keyboard/screen-reader users without a useful focus position after changing from `/demo` to `/`.

## Mandatory claims gate

`.factory/claims.json` exists with 14 entries. Each ID appears in exactly one tagged test. Before broader QA, every literal `test` command was run separately from candidate HEAD through the demo/test entry point; all 14 commands passed in desktop Chromium and the 390 px mobile project.

| Claim | Declared test | Independent result |
|---|---|---|
| `demo-resolves` | Pass | Pass: 4 sources, 9 effective, 1 shadowed |
| `report-formats` | Pass | Pass: table, JSON, Markdown |
| `policy-files` | Pass | Pass for the tested known-path/decoy fixture |
| `no-account` | Pass | Pass |
| `mit-license` | Pass | Pass |
| `browser-privacy` | Pass | Pass: same-origin only; no cookies or browser storage |
| `cli-local` | Pass | Pass: no network/telemetry runtime dependency found |
| `resolution-order` | Pass | Pass for Claude exact matches |
| `codex-context` | Pass | Pass for tested config controls; does not cover command-rule resolution |
| `vendor-policy-safe` | Pass | **False** for a hard-link alias; policy was overwritten |
| `cli-errors` | Pass | **False** for malformed supported `.rules`; exit 0 |
| `vendor-boundaries` | Pass | Pass for its cross-vendor fixture |
| `touch-targets` | Pass | Pass at 390 px |
| `demo-isolated` | Pass | **False** with supported `--output`; caller file created |

Thus the test processes are green but the claims contract is not satisfied: three tagged tests do not exercise the full promise and independent valid inputs disprove them.

## First-read and demo gate

**Pass.** A cold 1440 × 900 page answers all three required questions in plain words:

- What: “See agent permissions before they run.”
- For whom: engineers using several coding agents and repositories.
- First action: “Try it with sample data,” immediately followed by “Opens a browser preview of the bundled repository.”

At 390 × 844, the headline, audience sentence, action, consequence, and all three plain facts are visible without scrolling. One click opens `/demo`, already populated with a `4 sources / 9 effective / 1 shadowed` report. The persistent banner reads “Demo — sample data, nothing is saved” and offers Reset and Start-for-real actions. Fresh desktop/mobile contexts had no cookies or local/session storage and requested only the product origin.

## Clean checkout, build, package, and CLI evidence

A separate Git clone was detached at the exact candidate before the final gate run.

| Check | Result |
|---|---|
| `npm ci` | Pass; 24 packages, 0 vulnerabilities |
| Every command in `.factory/claims.json` | Pass; all 14 separately |
| `npm test` | Pass; 4 Rust unit, 5 CLI integration, 48 Playwright cases |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `cargo fmt --all -- --check` | Pass |
| `cargo clippy --all-targets --all-features -- -D warnings` | Pass |
| `npm audit --audit-level=high` | Pass; 0 vulnerabilities |
| `npm run build` | Pass; release binary and `dist/site/` produced |
| `cargo package --locked` | Pass; 46 files, 608.1 KiB compressed |
| Install extracted crate to clean prefix | Pass; `permit-map 0.1.0` |
| Installed CLI `demo --json` | Pass; 4/9/1 counts |

Normal table/JSON/Markdown reports, `--json`, help, version, empty repository recovery, missing path, malformed Claude JSON, unreadable Claude policy, and direct policy-path overwrite rejection were exercised. Missing, malformed JSON, and unreadable inputs returned code 2; an empty repository returned code 0 with the documented next step. The additional Codex and filesystem-alias boundary cases produced the blockers above.

## Live deployment and browser evidence

The deployed site now matches the candidate. Four route documents, hashed JS/CSS, favicon, touch icon, OG image, poster and provenance, robots, sitemap, and terminal SVG were byte-for-byte identical to the local production build. The deployment config is not publicly served (expected), while its 404 and cache/header behaviors are active.

- `/`, `/demo`, `/privacy`, `/terms`: HTTP 200; unknown path: HTTP 404.
- Factory `verify-url.sh`: pass; 608 ms load, title/lang/one h1/main/alt/button checks pass, no console errors.
- Independent axe: zero serious/critical findings on five routes at 1440 px and 390 px.
- Successful routes: no console errors, page errors, CSP violations, or failed subresources.
- Keyboard: skip link first; 3 px visible focus with 4 px offset; Enter opens demo; Space resets; live announcement works; back navigation restores the CTA. The hash-route focus defect is listed above.
- Mobile: no page overflow; all visible links/buttons measured at least 44 × 44 px. The report table has a labeled focusable horizontal scroll region.
- Reduced motion: media query matches; animation/transition duration becomes `0.00001s`, smooth scrolling becomes `auto`.
- 200% desktop-equivalent layout (640 CSS px): no horizontal document overflow or hidden text.
- Browser privacy: all observed requests were same-origin; cookies, local storage, and session storage stayed empty. Source/dependency inspection found no runtime API, analytics, authentication, or network client.
- Link crawl: every emitted internal link and the Param Factory external link returned 200.
- Headers: HTTPS/HSTS, self-restricted CSP, `nosniff`, strict-origin referrer policy, and camera/microphone/geolocation denial are present.
- Caching: HTML revalidates after 30 seconds; hashed assets are immutable for one year; the non-hashed poster uses one-day caching.

Fresh live mobile Lighthouse (valid run, no runtime error): Performance **97**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP **0.8 s**, LCP **1.5 s**, TBT **190 ms**, CLS **0**, Speed Index **0.8 s**, total transfer **136 KiB**.

Build budgets pass: JS **4,794 bytes gzip**, CSS **3,846 bytes gzip**, no webfonts, hero WebP **128,376 bytes**.

The art-deco transit-map identity is product-specific and matches `.factory/design.md`; desktop and mobile visual inspection found no overlap, clipping, or generic template treatment. The single-mode choice is explicit in the thesis and axe found no serious/critical contrast issue.

## Applicability

- Server endpoints/rate limiting: not applicable. The product is a static site plus local CLI, and no API/product-unlock request exists.
- Sign-in/Entra: not applicable; no sign-in exists.
- PWA/service worker/offline update: not applicable; no manifest, service worker, or offline claim exists.
- Backend concurrency/persistence/health identity: not applicable; no backend exists.
- AI feature: not applicable; deterministic policy resolution should not use model inference.

## Required before release

1. Parse Codex `.rules` with the real grammar (multiline calls, unions, default decisions, syntax errors) or invoke a compatible parser; never silently omit valid rules.
2. Resolve matching Codex command rules using the documented most-restrictive decision and add a `forbidden` + `allow` regression claim.
3. Make output safety identity-based and race-safe, or remove the categorical refusal claim; cover symlinks and hard links.
4. Keep every demo output inside the generated sandbox, or qualify the isolation promise and message when explicit output is requested.
5. Expand `cli-errors`, `vendor-policy-safe`, and `demo-isolated` tests to prove their complete wording.
6. Move focus on hash-bearing cross-route navigation.
