/**
 * Nav — Mobile navigation toggle, dropdown menus, active state highlighting.
 */

import { basePath } from '../utils/base-path.js';

export function initNav() {
  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    const toggleBodyScroll = (lock) => {
      document.body.style.overflow = lock ? 'hidden' : '';
    };
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      toggleBodyScroll(isOpen);
    });
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !mainNav.contains(e.target)) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        toggleBodyScroll(false);
      }
    });
  }

  // Dropdown menus
  document.querySelectorAll('.nav-dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = btn.parentElement;
      const wasOpen = dropdown.classList.contains('open');
      document.querySelectorAll('.nav-dropdown').forEach(d => {
        d.classList.remove('open');
        var toggle = d.querySelector('.nav-dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        dropdown.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown').forEach(d => {
      d.classList.remove('open');
      var toggle = d.querySelector('.nav-dropdown-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Active nav highlighting
  const currentPath = window.location.pathname;
  document.querySelectorAll('.main-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || href === currentPath.replace(/\/$/, '') || currentPath === basePath + '/' && (href === basePath + '/' || href === '/')) {
      link.classList.add('active');
    }
  });

  // Clickable article cards
  document.querySelectorAll('.article-card').forEach(card => {
    const link = card.querySelector('h2 a, h3 a, .card-title a');
    if (!link) return;
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) return;
      link.click();
    });
  });

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Scroll animations
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  // Zodiac wheel positioning
  const wheelAnimals = document.querySelectorAll('.wheel-animal');
  if (wheelAnimals.length) {
    const radius = 145;
    wheelAnimals.forEach((el, i) => {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x = 170 + radius * Math.cos(angle);
      const y = 170 + radius * Math.sin(angle);
      el.style.left = x + 'px';
      el.style.top = y + 'px';
    });
  }
}
