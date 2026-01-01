// Shared small scripts used across pages: set footer year and mark active nav link
function runShared() {
  try {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const navLinks = document.querySelectorAll('.main-nav a');
    const path = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      const anchor = href.split('/').pop();
      if (anchor === path || (anchor === 'index.html' && path === '')) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  } catch (e) {
    console.warn('shared.js error', e);
  }
}

// expose for callers (include loader) to invoke if needed
window.runShared = runShared;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runShared);
} else {
  // If script is appended after DOMContentLoaded (as done by include loader), run immediately
  runShared();
}

// Mobile nav toggle: attach handlers regardless of DOMContentLoaded state (elements may be injected)
function attachMobileNav() {
  try {
    // avoid attaching handlers multiple times
    if (attachMobileNav._attached) return;
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', (e) => {
      // prevent the event from bubbling to the document delegated handler
      e.stopPropagation && e.stopPropagation();
      if (typeof window.toggleMobileNav === 'function') {
        const open = window.toggleMobileNav();
        // reflect backdrop state
        const backdrop = document.querySelector('.menu-backdrop');
        if (backdrop) backdrop.classList.toggle('show', Boolean(open));
      }
    });
    // close nav on link click (mobile)
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        document.body.classList.remove('nav-open');
        const t = document.querySelector('.nav-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
        const backdrop = document.querySelector('.menu-backdrop');
        if (backdrop) backdrop.classList.remove('show');
      }
    }));
    // backdrop click should close the menu
    const backdropEl = document.querySelector('.menu-backdrop');
    if (backdropEl) {
      backdropEl.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          document.body.classList.remove('nav-open');
          const t = document.querySelector('.nav-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
          backdropEl.classList.remove('show');
        }
      });
    }
    attachMobileNav._attached = true;
  } catch (e) {
    console.warn('attachMobileNav error', e);
  }
}

// run attachMobileNav after a short delay to allow includes to be injected
// expose attachMobileNav so include loader can call it deterministically
window.attachMobileNav = attachMobileNav;

// also add a delegated click handler as a robust fallback
document.addEventListener('click', function (e) {
  const toggle = e.target.closest && e.target.closest('.nav-toggle');
  if (toggle) {
    // if the dedicated handler is attached, do nothing here to avoid double-calls
    if (attachMobileNav._attached) return;
    // prefer a dedicated global toggle function if available
    if (typeof window.toggleMobileNav === 'function') {
      try {
        const opened = window.toggleMobileNav();
        const backdrop = document.querySelector('.menu-backdrop');
        if (backdrop) backdrop.classList.toggle('show', Boolean(opened));
      } catch (err) { /* ignore */ }
      return;
    }
    // call attachMobileNav logic directly if not yet wired
    try {
      const nav = document.querySelector('.main-nav');
      if (!nav) return;
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('nav-open', open);
  const backdrop = document.querySelector('.menu-backdrop');
  if (backdrop) backdrop.classList.toggle('show', Boolean(open));
    } catch (err) { /* ignore */ }
  }
});

// provide a global toggle function so inline handlers (or other consumers) can call it reliably
window.toggleMobileNav = function toggleMobileNav() {
  try {
    const nav = document.querySelector('.main-nav');
    const toggle = document.querySelector('.nav-toggle');
    if (!nav || !toggle) return false;
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    // toggle mobile nav class on body for styling
    try {
      document.body.classList.toggle('nav-open', open);
    } catch (e) {}
    return open;
  } catch (e) {
    return false;
  }
};

setTimeout(attachMobileNav, 120);
