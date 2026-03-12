/**
 * Triumph Kia Teh — Portfolio
 * Vanilla JS: nav scroll, fade-up, hamburger, active section
 */

(function () {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const scrollThreshold = 80;

  // ----- 1. Sticky navbar scroll effect -----
  function updateNavScroll() {
    if (window.scrollY > scrollThreshold) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNavScroll, { passive: true });
  updateNavScroll();

  // ----- 2. Scroll-triggered fade-up (IntersectionObserver) -----
  const fadeElements = document.querySelectorAll('.fade-up');
  const fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
  );
  fadeElements.forEach(function (el) {
    fadeObserver.observe(el);
  });

  // ----- 3. Mobile hamburger menu -----
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ----- 4. Smooth scroll is handled by CSS (scroll-behavior: smooth) -----

  // ----- 5. Active nav link on scroll -----
  const navSectionIds = ['about', 'education', 'story', 'organizations', 'experience', 'recognition', 'speaking', 'writing', 'contact'];
  const navLinkElements = document.querySelectorAll('.nav-links a');

  function setActiveNav() {
    const scrollY = window.scrollY + 120;
    let currentId = '';

    if (scrollY < scrollThreshold) {
      currentId = 'about';
    } else {
      let lastPassed = '';
      navSectionIds.forEach(function (id) {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= scrollY) {
          lastPassed = id;
        }
      });
      currentId = lastPassed;
    }

    navLinkElements.forEach(function (link) {
      const href = link.getAttribute('href');
      const targetId = href && href.startsWith('#') ? href.slice(1) : '';
      if (targetId === currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();
})();
