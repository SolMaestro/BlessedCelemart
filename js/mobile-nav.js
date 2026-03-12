/* ============================================================
   BlessedCelemart — mobile-nav.js
   Drawer, search overlay, bottom nav, cart badge, scroll fx.
   ============================================================ */
(function () {
  'use strict';

  const header        = document.querySelector('.site-header');
  const hamburger     = document.querySelector('.header-hamburger');
  const drawer        = document.querySelector('.mobile-drawer');
  const overlay       = document.querySelector('.nav-overlay');
  const drawerClose   = document.querySelector('.drawer-close');
  const searchToggle  = document.querySelector('.header-search-toggle');
  const searchOverlay = document.querySelector('.search-overlay');
  const searchBack    = document.querySelector('.search-overlay-back');
  const searchInput   = document.querySelector('.search-overlay-input');

  /* Header scroll effect */
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* Drawer */
  function openDrawer() {
    drawer    && drawer.classList.add('is-open');
    overlay   && overlay.classList.add('is-open');
    hamburger && hamburger.classList.add('is-open');
    hamburger && hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const first = drawer && drawer.querySelector('button, a, input');
    first && first.focus();
  }
  function closeDrawer() {
    drawer    && drawer.classList.remove('is-open');
    overlay   && overlay.classList.remove('is-open');
    hamburger && hamburger.classList.remove('is-open');
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  hamburger   && hamburger.addEventListener('click', openDrawer);
  drawerClose && drawerClose.addEventListener('click', closeDrawer);

  /* Search overlay */
  function openSearch() {
    searchOverlay && searchOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput && searchInput.focus(), 350);
  }
  function closeSearch() {
    searchOverlay && searchOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  searchToggle && searchToggle.addEventListener('click', openSearch);
  searchBack   && searchBack.addEventListener('click', closeSearch);

  /* Overlay tap closes both */
  overlay && overlay.addEventListener('click', () => { closeDrawer(); closeSearch(); });

  /* ESC key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeDrawer(); closeSearch(); }
  });

  /* Focus trap inside drawer */
  drawer && drawer.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const els   = drawer.querySelectorAll('button:not([disabled]), a[href], input:not([disabled])');
    const first = els[0], last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first)  { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* Search chips fill input */
  document.querySelectorAll('.search-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (searchInput) { searchInput.value = chip.textContent.trim(); searchInput.focus(); }
    });
  });

  /* Bottom nav active state */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.bottom-nav-item').forEach(item => {
    const href = item.getAttribute('href') || '';
    if (href && path.includes(href.replace('.html', ''))) item.classList.add('active');
    if ((path === 'index.html' || path === '') && href === 'index.html') item.classList.add('active');
  });

  /* Cart badge — call window.updateCartBadge(n) from anywhere */
  window.updateCartBadge = function (count) {
    document.querySelectorAll('.action-badge, .bottom-nav-badge').forEach(b => {
      const prev = b.getAttribute('data-count');
      b.setAttribute('data-count', count);
      b.textContent = count > 99 ? '99+' : count;
      if (String(prev) !== String(count)) {
        b.classList.remove('updated');
        void b.offsetWidth;
        b.classList.add('updated');
        b.addEventListener('animationend', () => b.classList.remove('updated'), { once: true });
      }
    });
  };

  /* Init badge from localStorage */
  try {
    const cart  = JSON.parse(localStorage.getItem('bcm_cart') || '[]');
    const total = cart.reduce((s, i) => s + (i.qty || 1), 0);
    window.updateCartBadge(total);
  } catch (e) { window.updateCartBadge(0); }

  /* Desktop header search submit */
  const searchForm = document.querySelector('.header-search-form');
  searchForm && searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const q = searchForm.querySelector('.header-search-input').value.trim();
    if (q) window.location.href = 'pages/shop.html?q=' + encodeURIComponent(q);
  });

  /* Drawer search enter key */
  const drawerSearch = document.querySelector('.drawer-search-input');
  drawerSearch && drawerSearch.addEventListener('keydown', e => {
    if (e.key === 'Enter' && drawerSearch.value.trim())
      window.location.href = 'pages/shop.html?q=' + encodeURIComponent(drawerSearch.value.trim());
  });

})();
