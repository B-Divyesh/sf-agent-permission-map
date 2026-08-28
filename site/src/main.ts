import "./style.css";

type Rule = {
  vendor: "claude" | "codex";
  layer: "global" | "repo" | "worktree";
  effect: "allow" | "ask" | "deny";
  status: "effective" | "shadowed";
  target: string;
  source: string;
};

const sampleRules: Rule[] = [
  { vendor: "claude", layer: "worktree", effect: "deny", status: "effective", target: "Bash(git status:*)", source: ".claude/settings.local.json" },
  { vendor: "claude", layer: "repo", effect: "allow", status: "effective", target: "Bash(npm test:*)", source: ".claude/settings.json" },
  { vendor: "claude", layer: "worktree", effect: "deny", status: "effective", target: "Read(.env*)", source: ".claude/settings.local.json" },
  { vendor: "claude", layer: "repo", effect: "allow", status: "effective", target: "Read(src/**)", source: ".claude/settings.json" },
  { vendor: "claude", layer: "repo", effect: "ask", status: "effective", target: "WebFetch(domain:docs.rs)", source: ".claude/settings.json" },
  { vendor: "codex", layer: "repo", effect: "ask", status: "effective", target: "approval:on-request", source: ".codex/config.toml" },
  { vendor: "codex", layer: "repo", effect: "ask", status: "effective", target: "command:git push", source: ".codex/rules/release.rules" },
  { vendor: "codex", layer: "repo", effect: "deny", status: "effective", target: "command:rm -rf", source: ".codex/rules/release.rules" },
  { vendor: "codex", layer: "repo", effect: "ask", status: "effective", target: "sandbox:workspace-write", source: ".codex/config.toml" },
  { vendor: "claude", layer: "repo", effect: "allow", status: "shadowed", target: "Bash(git status:*)", source: ".claude/settings.json" },
];

const app = document.querySelector<HTMLDivElement>("#app")!;
const routeStatus = document.querySelector<HTMLDivElement>("#route-status")!;

const wordmark = `
  <a class="wordmark" href="/" data-link aria-label="Permit Map home">
    <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M5 10h13l6 8 6-8h13v8H34l-10 14-10-14H5z"/><circle cx="24" cy="37" r="4"/></svg>
    <span>Permit Map</span>
  </a>`;

function header(): string {
  return `<header class="site-header"><div class="shell header-inner">${wordmark}
    <nav aria-label="Main navigation">
      <a href="/demo" data-link>Demo</a><a href="/#install" data-link>Install</a><a href="/privacy" data-link>Privacy</a>
    </nav></div></header>`;
}

function footer(): string {
  return `<footer><div class="shell footer-grid"><p><strong>Permit Map</strong><br><span>Resolve coding-agent permissions before a session.</span></p>
    <nav aria-label="Footer navigation"><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a><a href="https://hello-factory.sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external)</span></a></nav>
    <p class="build">Version 0.1.0 · build 2026.08.28</p></div></footer>`;
}

function routeMap(): string {
  return `<div class="route-map" aria-label="Policy layers resolve from global to worktree">
    <div><span class="station station-global">01</span><b>Global</b></div>
    <div><span class="station station-repo">02</span><b>Repo</b></div>
    <div><span class="station station-worktree">03</span><b>Worktree</b></div>
  </div>`;
}

function terminalPreview(compact = false): string {
  return `<figure class="terminal ${compact ? "terminal-compact" : ""}">
    <figcaption><span aria-hidden="true">● ● ●</span> bundled sample repository</figcaption>
    <pre tabindex="0" aria-label="Terminal output, scroll horizontally"><code><span class="prompt">$</span> permit-map inspect .

Permit Map — 4 sources, 9 effective, 1 shadowed

<span class="head">VENDOR   LAYER      EFFECT  STATUS      MATCHER</span>
claude   worktree  <span class="deny">deny</span>    effective   Bash(git status:*)
claude   repo      <span class="allow">allow</span>   effective   Bash(npm test:*)
codex    repo      <span class="ask">ask</span>     effective   command:git push
claude   repo      <span class="allow">allow</span>   <span class="shadow">shadowed</span>    Bash(git status:*)
                  ↳ replaced by settings.local.json</code></pre>
  </figure>`;
}

function home(): string {
  return `${header()}<main id="main">
    <section class="hero shell" aria-labelledby="home-title">
      <div class="hero-copy">
        <p class="eyebrow">Local policy inspector · line 01</p>
        <h1 id="home-title" tabindex="-1">See agent permissions before they run</h1>
        <p class="lede">For engineers using several coding agents, Permit Map resolves the rules each repository will apply.</p>
        <div class="primary-row"><a id="demo-cta" class="ticket primary" href="/demo" data-link>Try it with sample data <span aria-hidden="true">→</span></a><p>Opens a browser preview of the bundled repository.</p></div>
        <ul class="plain-facts"><li>Reads known policy files only.</li><li>Runs without an account.</li><li>Free under the MIT license.</li></ul>
      </div>
      <div class="hero-art">
        <img src="/permit-map-poster.webp" width="1200" height="800" fetchpriority="high" alt="Three geometric rail routes converge on permit, review, and stop signals." />
        ${routeMap()}
      </div>
    </section>
    <section class="preview-section" aria-labelledby="preview-title"><div class="shell preview-grid">
      <div><p class="eyebrow light">Resolved policy · line 02</p><h2 id="preview-title">One table shows every decision</h2><p>See what wins, what gets shadowed, and which file set each rule.</p><a class="text-link" href="/demo" data-link>Open the full sample map →</a></div>
      ${terminalPreview()}
    </div></section>
    <section class="steps shell" aria-labelledby="steps-title"><p class="eyebrow">Working timetable · line 03</p><h2 id="steps-title">Inspect a repository in three steps</h2>
      <ol><li><span>01</span><div><h3>Point at a repository</h3><p>Permit Map checks documented Claude Code and Codex policy paths.</p></div></li><li><span>02</span><div><h3>Check the decision context</h3><p>Claude denies win. Codex project rules need the trust context.</p></div></li><li><span>03</span><div><h3>Share the result</h3><p>Print a table or write JSON and Markdown for review.</p></div></li></ol>
    </section>
    <section id="install" class="install-band" aria-labelledby="install-title"><div class="shell install-grid"><div><p class="eyebrow light">Depart from your terminal</p><h2 id="install-title" tabindex="-1">Install the single binary</h2><p>Build from source with a current Rust toolchain.</p></div><div class="command"><code>cargo install --path .</code><button type="button" data-copy="cargo install --path .">Copy command</button></div></div></section>
    <section class="limits shell" aria-labelledby="limits-title"><div><p class="eyebrow">Clear boundaries · line 04</p><h2 id="limits-title">What Permit Map does not do</h2></div><ul><li>It does not run an agent.</li><li>It does not change vendor settings.</li><li>It does not read source files or credential stores.</li><li>It does not guess when vendor patterns overlap.</li></ul></section>
  </main>${footer()}`;
}

function rulesTable(): string {
  return `<div class="table-wrap" tabindex="0" aria-label="Resolved permission table, scroll horizontally for all columns"><table>
    <caption class="sr-only">Nine effective rules and one shadowed rule from the sample repository.</caption>
    <thead><tr><th scope="col">Vendor</th><th scope="col">Layer</th><th scope="col">Decision</th><th scope="col">Status</th><th scope="col">Matcher</th><th scope="col">Source</th></tr></thead>
    <tbody>${sampleRules.map(rule => `<tr class="${rule.status}"><td>${rule.vendor}</td><td>${rule.layer}</td><td><span class="decision ${rule.effect}">${rule.effect}</span></td><td>${rule.status}</td><td><code>${escapeHtml(rule.target)}</code></td><td><code>${escapeHtml(rule.source)}</code></td></tr>`).join("")}</tbody>
  </table></div>`;
}

function demo(): string {
  return `${header()}<aside class="demo-banner" aria-label="Demo mode"><div class="shell"><p><strong>Demo — sample data, nothing is saved</strong></p><div><button type="button" id="reset-demo">Reset demo</button><a href="/#install" data-link>Start for real</a></div></div></aside>
  <main id="main"><section class="demo-head shell"><div><p class="eyebrow">Bundled sample · isolated preview</p><h1 tabindex="-1">Review the resolved permission map</h1><p>The sample combines Claude Code and Codex policies from four files.</p></div><div class="demo-summary" aria-label="Report summary"><div><strong>4</strong><span>sources</span></div><div><strong>9</strong><span>effective</span></div><div><strong>1</strong><span>shadowed</span></div></div></section>
  <section class="report shell" aria-labelledby="rules-title"><div class="report-heading"><div><h2 id="rules-title">Resolved rules</h2><p id="demo-status" aria-live="polite">Claude denies win across scopes. This sample marks its Codex project as trusted.</p></div><a class="ticket secondary" href="/terminal-demo.svg" download>Download terminal recording</a></div>${rulesTable()}</section>
  <section class="adapter-notes shell" aria-labelledby="notes-title"><h2 id="notes-title">Adapter notes</h2><ul><li>Claude evaluates exact matches as deny, then ask, then allow across scopes.</li><li>Codex reads system, user, selected profile, and trusted project layers. Unknown trust stays unresolved.</li><li>Pattern overlap stays visible because vendor meanings can differ.</li></ul></section>
  </main>${footer()}`;
}

function policyPage(kind: "privacy" | "terms"): string {
  const privacy = kind === "privacy";
  const title = privacy ? "Privacy without a data trail" : "Use Permit Map on your terms";
  return `${header()}<main id="main"><article class="legal shell"><p class="eyebrow">${privacy ? "Privacy notice" : "Terms of use"} · 28 August 2026</p><h1 tabindex="-1">${title}</h1>${privacy ? `
    <p>Permit Map is a local command-line tool. It has no account, telemetry, analytics, or network client.</p>
    <h2>Files it opens</h2><p>The CLI opens documented Claude Code and Codex policy paths. It reads permission fields and ignores unrelated settings.</p>
    <h2>Files it does not open</h2><p>The CLI does not scan source files, environment files, keychains, or credential stores.</p>
    <h2>Website data</h2><p>This website sets no cookies and stores no browser data. The demo uses bundled sample data in memory.</p>` : `
    <p>Permit Map is free software under the MIT license.</p>
    <h2>No warranty</h2><p>The tool reports supported policy fields. Review vendor documentation before relying on a report for security decisions.</p>
    <h2>Your responsibility</h2><p>You control which repository the CLI inspects. You remain responsible for agent access and configuration.</p>
    <h2>Changes</h2><p>Material changes will appear in this page and the project changelog.</p>`}</article></main>${footer()}`;
}

function notFound(): string {
  return `${header()}<main id="main"><section class="not-found shell"><div class="signal-mark" aria-hidden="true"><span></span></div><p class="eyebrow">Route not found · 404</p><h1 tabindex="-1">This permission line ends here</h1><p>The address does not match a Permit Map page.</p><a class="ticket primary" href="/" data-link>Return to the map</a></section></main>${footer()}`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]!);
}

function render(path = window.location.pathname): void {
  let content: string;
  let title: string;
  if (path === "/") { content = home(); title = "Permit Map — resolve coding-agent permissions"; }
  else if (path === "/demo") { content = demo(); title = "Demo — Permit Map"; }
  else if (path === "/privacy") { content = policyPage("privacy"); title = "Privacy — Permit Map"; }
  else if (path === "/terms") { content = policyPage("terms"); title = "Terms — Permit Map"; }
  else { content = notFound(); title = "Page not found — Permit Map"; }
  app.innerHTML = content;
  document.title = title;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = `https://agent-permission-map.sociobot.in${path === "/" ? "/" : path}`;
  bindActions();
  routeStatus.textContent = document.querySelector("h1")?.textContent ?? "Page changed";
}

function navigate(url: URL): void {
  const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  history.replaceState({ scrollY: window.scrollY, focusId: active?.id || null }, "", window.location.href);
  history.pushState({ scrollY: 0, focusId: null }, "", `${url.pathname}${url.hash}`);
  render(url.pathname);
  requestAnimationFrame(() => {
    if (url.hash) {
      const target = document.querySelector<HTMLElement>(url.hash);
      target?.scrollIntoView();
      (target?.querySelector<HTMLElement>("h1, h2, h3, h4, h5, h6, [tabindex]") ?? target ?? document.querySelector<HTMLElement>("h1"))?.focus();
    } else { window.scrollTo(0, 0); document.querySelector<HTMLElement>("h1")?.focus(); }
  });
}

function bindActions(): void {
  document.querySelectorAll<HTMLAnchorElement>("a[data-link]").forEach(link => link.addEventListener("click", event => {
    const url = new URL(link.href);
    if (url.origin !== window.location.origin) return;
    event.preventDefault();
    navigate(url);
  }));
  document.querySelector<HTMLButtonElement>("[data-copy]")?.addEventListener("click", async event => {
    const button = event.currentTarget as HTMLButtonElement;
    try { await navigator.clipboard.writeText(button.dataset.copy!); button.textContent = "Copied"; }
    catch { button.textContent = "Copy failed"; }
  });
  document.querySelector<HTMLButtonElement>("#reset-demo")?.addEventListener("click", () => {
    const status = document.querySelector<HTMLParagraphElement>("#demo-status")!;
    status.textContent = "Sample reset. Claude denies win across scopes; the sample Codex project is trusted.";
    document.querySelector<HTMLTableElement>("table")?.classList.add("reset-pulse");
    setTimeout(() => document.querySelector<HTMLTableElement>("table")?.classList.remove("reset-pulse"), 240);
  });
}

history.replaceState({ scrollY: window.scrollY, focusId: null }, "", window.location.href);
window.addEventListener("popstate", event => {
  render();
  requestAnimationFrame(() => {
    window.scrollTo(0, event.state?.scrollY ?? 0);
    const previous = event.state?.focusId ? document.getElementById(event.state.focusId) : null;
    (previous ?? document.querySelector<HTMLElement>("h1"))?.focus();
  });
});
render();
