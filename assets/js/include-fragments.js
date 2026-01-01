// Fetch and inject small HTML fragments (header/footer)
document.addEventListener('DOMContentLoaded', async () => {
  const includes = document.querySelectorAll('[data-include]');
  for (const el of includes) {
    const name = el.dataset.include;
    // If this site is hosted on github.io (user/org site), root-relative paths are safe.
    const isGitHubPagesRoot = location.hostname.endsWith('github.io');
    const paths = isGitHubPagesRoot ? [
      `/assets/includes/${name}.html`,
      `assets/includes/${name}.html`,
      `./assets/includes/${name}.html`
    ] : [
      `assets/includes/${name}.html`,
      `./assets/includes/${name}.html`,
      `/assets/includes/${name}.html`
    ];
    let loaded = false;
    for (const p of paths) {
      try {
        const resp = await fetch(p);
        if (resp && resp.ok) {
          el.innerHTML = await resp.text();
          loaded = true;
          break;
        }
      } catch (err) {
        // try next path
      }
    }
    if (!loaded) {
      // Likely running from file:// where fetch is blocked. Provide a helpful fallback.
      console.warn(`Failed to load include for ${name}. If you're opening the HTML file directly (file://), the browser may block fetch requests. Serve the folder via a local HTTP server (e.g. ` +
        "python3 -m http.server 8000") ;
      el.innerHTML = `<div class="include-error" style="padding:12px;border:1px dashed #ccc;background:#fff;margin:6px 0;color:#333;">Failed to load shared fragment: ${name}.html — please serve the site over HTTP (e.g. <code>python3 -m http.server 8000</code>) to enable fragment includes.</div>`;
    }
  }

  // After inserting fragments, load shared scripts (year + nav active)
  const s = document.createElement('script');
  s.src = 'assets/js/shared.js';
  s.defer = true;
  document.body.appendChild(s);
});
