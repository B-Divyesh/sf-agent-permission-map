# Permit Map v0.1.0 handoff

Work order: `agent-permission-map-build-1`

Completed: 28 August 2026

## What shipped

- A Rust `permit-map` single-binary CLI with helpful `inspect`, `demo`, and `--help` paths.
- Claude Code adapters for global, repo, and worktree `settings.json` permission lists.
- Codex adapters for sandbox mode, approval policy, and `prefix_rule` files.
- A resolver that marks exact matchers as effective or shadowed across layers.
- Conservative same-layer resolution where deny wins over ask and allow.
- Human terminal output plus stable schema-versioned JSON and reviewable Markdown.
- Empty-state and actionable parse/path errors with exit codes `0` and `2`.
- A bundled four-file sample under `examples/sample-repo/`.
- A sandboxed `permit-map demo` that copies sample files into a unique temporary directory.
- A static Vite site at `dist/site/` with `/`, `/demo`, `/privacy`, `/terms`, and styled 404 routes.
- The art-deco transit-poster system documented in `.factory/design.md`.
- Original generated poster art, a 1200×630 social image, favicon, and a self-hosted SVG terminal recording.
- Keyboard focus restoration, 390 px layouts, reduced-motion behavior, clear focus states, and horizontal table access.
- Claim registry, claim-tagged tests, copy audit, demo contract, MIT license, changelog, and complete README.

## Build and run

```sh
npm install
npm test
npm run build
./target/release/permit-map demo
```

Deployment root: `dist/site`

Static entry: `dist/site/index.html`

Package without publishing:

```sh
cargo package
```

## Verification

- `npm test`: passed. It runs 6 Rust tests and 34 Playwright cases across desktop Chromium and a 390 px Chromium profile.
- Claim command shape was checked directly with `npm test -- --grep @claim:resolution-order`.
- `cargo fmt --check`: passed.
- `cargo clippy --all-targets --all-features -- -D warnings`: passed.
- `cargo package --allow-dirty`: passed; package is 597.7 KiB compressed.
- `npm run build`: passed. Release binary is 929 KiB. Site output lands in `dist/site/`.
- `npm audit --audit-level=high`: passed with zero vulnerabilities.
- Worker `verify-url.sh`: passed against the local production preview. It found one h1, `lang=en`, a main landmark, alt text on every image, no unlabeled buttons, and no console errors. Measured load was 544 ms locally.
- Playwright axe checks found zero serious or critical issues on every route at desktop and mobile sizes.
- Local Lighthouse mobile run: Performance 100, Accessibility 100, Best Practices 100, SEO 100. LCP 1.7 s, Speed Index 0.9 s, TBT 50 ms, CLS 0.
- Production asset budgets: initial JS 4.71 KiB gzip; CSS 3.84 KiB gzip; no webfont payload; hero WebP 126 KiB.
- Visual inspection completed for the full desktop landing page, full 390 px landing page, and desktop demo report.

## Privacy and data handling

The CLI has no network or telemetry dependency. Automatic discovery uses only the supported policy paths listed in the README. The site sets no cookies and uses no browser storage, analytics, external scripts, fonts, or API calls. Browser sample values remain in memory. CLI sample values live in a new operating-system temporary directory.

## Known gaps and honest limits

- Pattern overlap is not inferred. Exact duplicate matchers resolve, while broader vendor-specific interactions remain visible with an adapter note.
- The Claude adapter supports allow, ask, and deny permission arrays. Other Claude settings are ignored.
- The Codex adapter supports top-level sandbox and approval controls plus single-line `prefix_rule` entries. Unsupported rule syntax is reported in notes rather than guessed.
- The browser demo mirrors the deterministic output from the bundled sample. It does not execute the Rust binary through WASM; the downloadable SVG records the real CLI output, and `permit-map demo` is the executable sandbox.
- The tool inspects one repository path per run. Teams can script JSON reports across many repositories.

## Suggested next steps

- Add adapters only when vendor precedence can be documented and tested with fixtures.
- Add release automation for platform binaries after the factory supplies signing and registry credentials.
- Test the pilot success measure with real multi-repository policy sets.
