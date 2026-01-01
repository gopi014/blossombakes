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
