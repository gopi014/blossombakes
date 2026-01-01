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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runShared);
} else {
  // If script is appended after DOMContentLoaded (as done by include loader), run immediately
  runShared();
}

// Mobile nav toggle: attach handlers regardless of DOMContentLoaded state (elements may be injected)
function attachMobileNav() {
  try {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('nav-open', open);
    });
    // close nav on link click (mobile)
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        document.body.classList.remove('nav-open');
        const t = document.querySelector('.nav-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    }));
  } catch (e) {
    console.warn('attachMobileNav error', e);
  }
}

// run attachMobileNav after a short delay to allow includes to be injected
setTimeout(attachMobileNav, 120);
