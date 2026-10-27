/**
 * Application Entry & Controller
 * Coordinates content binding, static mode flag (?static=1),
 * canvas 3D engine, and keyboard accessibility.
 */

import { content } from './content.js';
import { InstancedCanvasEngine } from './canvas-engine.js';

class PortfolioApp {
  constructor() {
    this.canvasEngine = null;
    this.isStaticMode = false;
    this.canvasEl = document.getElementById('canvas-3d');
    this.staticToggleBtn = document.getElementById('static-toggle-btn');
    this.footerStaticToggleBtn = document.getElementById('footer-static-toggle');
    this.heroStatusText = document.getElementById('hero-status-text');

    this.init();
  }

  init() {
    this.checkStaticFlag();
    this.setupModeToggleButtons();
    this.setupCardTilt();
    this.setupMobileMenu();
    this.setupKeyboardNavigation();
  }

  // Check URL for ?static=1 or test for canvas support
  checkStaticFlag() {
    const urlParams = new URLSearchParams(window.location.search);
    const hasStaticFlag = urlParams.get('static') === '1';

    // Test canvas support
    let canvasSupported = false;
    try {
      canvasSupported = !!(this.canvasEl && this.canvasEl.getContext);
    } catch {
      canvasSupported = false;
    }

    // Enter static mode if requested or if canvas is unsupported
    if (hasStaticFlag || !canvasSupported) {
      this.enableStaticMode();
    } else {
      this.enableInteractiveMode();
    }
  }

  // Activate static hero fallback and disable 3D engine
  enableStaticMode() {
    this.isStaticMode = true;
    document.body.classList.add('static-mode');

    if (this.canvasEngine) {
      this.canvasEngine.stop();
    }

    this.updateToggleState(true);

    if (this.heroStatusText) {
      this.heroStatusText.textContent = content.hero.staticNotice;
    }
  }

  // Activate 3D instanced canvas engine
  enableInteractiveMode() {
    this.isStaticMode = false;
    document.body.classList.remove('static-mode');

    this.updateToggleState(false);

    if (this.heroStatusText) {
      this.heroStatusText.textContent = content.hero.interactiveNotice;
    }

    if (!this.canvasEngine && this.canvasEl) {
      try {
        this.canvasEngine = new InstancedCanvasEngine(this.canvasEl);
        this.canvasEngine.start();
      } catch (err) {
        console.warn('Canvas initialization failed, falling back to static mode', err);
        this.enableStaticMode();
      }
    } else if (this.canvasEngine) {
      this.canvasEngine.start();
    }
  }

  // Update aria-pressed and labels on toggle buttons
  updateToggleState(isStatic) {
    const headerLabel = document.getElementById('static-toggle-label');
    const footerLabel = document.getElementById('footer-static-toggle-label');

    const labelText = isStatic
      ? content.footer.staticToggleText.disable
      : content.footer.staticToggleText.enable;

    if (this.staticToggleBtn) {
      this.staticToggleBtn.setAttribute('aria-pressed', isStatic ? 'true' : 'false');
      if (headerLabel) headerLabel.textContent = labelText;
    }

    if (this.footerStaticToggleBtn) {
      this.footerStaticToggleBtn.setAttribute('aria-pressed', isStatic ? 'true' : 'false');
      if (footerLabel) footerLabel.textContent = labelText;
    }
  }

  // Toggle between ?static=1 and interactive mode
  toggleMode() {
    const url = new URL(window.location.href);
    if (this.isStaticMode) {
      url.searchParams.delete('static');
      window.history.replaceState({}, '', url.toString());
      this.enableInteractiveMode();
    } else {
      url.searchParams.set('static', '1');
      window.history.replaceState({}, '', url.toString());
      this.enableStaticMode();
    }
  }

  setupModeToggleButtons() {
    if (this.staticToggleBtn) {
      this.staticToggleBtn.addEventListener('click', () => this.toggleMode());
    }
    if (this.footerStaticToggleBtn) {
      this.footerStaticToggleBtn.addEventListener('click', () => this.toggleMode());
    }
  }

  // Accessible 3D card tilt effect (respects prefers-reduced-motion)
  setupCardTilt() {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cards = document.querySelectorAll('.project-card');

    cards.forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        if (motionQuery.matches || this.isStaticMode) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6; // max -6 to +6 deg
        const rotateY = ((x - centerX) / centerX) * 6;  // max -6 to +6 deg

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });

      card.addEventListener('focusout', () => {
        card.style.transform = '';
      });
    });
  }

  // Mobile navigation drawer toggle
  setupMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('primary-nav');
    if (!menuBtn || !nav) return;

    menuBtn.addEventListener('click', () => {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
      nav.classList.toggle('is-open', !isExpanded);
    });

    // Close on navigation click
    nav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        menuBtn.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      });
    });
  }

  // Keyboard navigation helpers (ESC closes mobile nav, visible focus jump)
  setupKeyboardNavigation() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const nav = document.getElementById('primary-nav');
        if (nav && nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          if (menuBtn) {
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.focus();
          }
        }
      }
    });
  }
}

// Bootstrap on DOM readiness
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PortfolioApp());
} else {
  new PortfolioApp();
}

