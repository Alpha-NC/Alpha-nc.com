/**
 * Alpha No_Code — V3 Main JavaScript
 * Vanta.NET · Typewriter · Mobile menu · Stepper · FAQ · Scroll reveal
 */

// ── Configuration ──────────────────────────────────────────
const CONFIG = {
  vanta: {
    color:           0x0BA08F,
    backgroundColor: 0x0B1020,
    points:          7.0,
    maxDistance:     22.0,
    spacing:         20.0,
    showDots:        true
  },
  typewriter: {
    words:              ['briefs.', 'validations.', 'versions.', 'reporting.', 'relances.'],
    typingSpeed:        80,
    deletingSpeed:      42,
    pauseAfterTyping:   2200,
    pauseAfterDeleting: 360
  },
  breakpoints: {
    disableVanta: 768
  }
};

// ── State ───────────────────────────────────────────────────
let vantaEffect      = null;
let typewriterTimer  = null;
let resizeTimer      = null;

// ── Utilities ───────────────────────────────────────────────
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function isMobileDevice() {
  return window.innerWidth < CONFIG.breakpoints.disableVanta;
}
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

// ── Vanta Background ────────────────────────────────────────
function activateVantaFallback(container) {
  if (container) container.classList.add('vanta-fallback');
}
function destroyVanta() {
  if (!vantaEffect) return;
  vantaEffect.destroy();
  vantaEffect = null;
}
function initVanta() {
  const container = document.getElementById('hero-vanta-bg');
  if (!container) return;

  if (prefersReducedMotion() || isMobileDevice() || !isWebGLAvailable()) {
    destroyVanta();
    activateVantaFallback(container);
    return;
  }
  if (typeof VANTA === 'undefined' || typeof VANTA.NET === 'undefined') {
    activateVantaFallback(container);
    return;
  }

  container.classList.remove('vanta-fallback');
  destroyVanta();

  try {
    vantaEffect = VANTA.NET({
      el:              container,
      mouseControls:   true,
      touchControls:   false,
      gyroControls:    false,
      minHeight:       200,
      minWidth:        200,
      scale:           1,
      scaleMobile:     1,
      color:           CONFIG.vanta.color,
      backgroundColor: CONFIG.vanta.backgroundColor,
      points:          CONFIG.vanta.points,
      maxDistance:     CONFIG.vanta.maxDistance,
      spacing:         CONFIG.vanta.spacing,
      showDots:        CONFIG.vanta.showDots
    });
  } catch (e) {
    activateVantaFallback(container);
  }
}

// ── Typewriter ───────────────────────────────────────────────
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const { words, typingSpeed, deletingSpeed, pauseAfterTyping, pauseAfterDeleting } = CONFIG.typewriter;
  let wordIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;

  if (prefersReducedMotion()) {
    el.textContent = words[0];
    return;
  }

  function tick() {
    const word     = words[wordIndex];
    const current  = isDeleting ? word.slice(0, charIndex - 1) : word.slice(0, charIndex + 1);
    el.textContent = current;

    if (!isDeleting) {
      charIndex++;
      if (charIndex > word.length) {
        isDeleting = true;
        typewriterTimer = setTimeout(tick, pauseAfterTyping);
        return;
      }
    } else {
      charIndex--;
      if (charIndex < 0) {
        isDeleting = false;
        wordIndex  = (wordIndex + 1) % words.length;
        charIndex  = 0;
        typewriterTimer = setTimeout(tick, pauseAfterDeleting);
        return;
      }
    }
    typewriterTimer = setTimeout(tick, isDeleting ? deletingSpeed : typingSpeed);
  }
  typewriterTimer = setTimeout(tick, 800);
}

// ── Mobile Menu ─────────────────────────────────────────────
function initMobileMenu() {
  const burger  = document.getElementById('burgerBtn');
  const menu    = document.getElementById('mobileMenu');
  const overlay = document.getElementById('menuOverlay');
  const close   = document.getElementById('closeMenuBtn');
  if (!burger || !menu || !overlay) return;

  function openMenu() {
    menu.classList.add('is-open');
    overlay.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menu.classList.remove('is-open');
    overlay.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', openMenu);
  if (close) close.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

// ── Method Stepper (Desktop) ─────────────────────────────────
function initStepper() {
  const navItems = document.querySelectorAll('.stepper-nav-item');
  const cards    = document.querySelectorAll('.stepper-card');
  if (!navItems.length || !cards.length) return;

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const step = item.dataset.step;
      navItems.forEach(n => { n.classList.remove('active'); n.setAttribute('aria-pressed', 'false'); });
      cards.forEach(c => c.classList.remove('active'));
      item.classList.add('active');
      item.setAttribute('aria-pressed', 'true');
      const target = document.querySelector(`.stepper-card[data-step="${step}"]`);
      if (target) target.classList.add('active');
    });
  });
}

// ── Stepper Accordion (Mobile) ───────────────────────────────
function initStepperAccordion() {
  const triggers = document.querySelectorAll('.stepper-accordion-trigger');
  if (!triggers.length) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item    = trigger.closest('.stepper-accordion-item');
      const content = item.querySelector('.stepper-accordion-content');
      const isOpen  = trigger.classList.contains('active');

      // close all
      document.querySelectorAll('.stepper-accordion-trigger').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.stepper-accordion-content').forEach(c => {
        c.classList.remove('active');
      });

      if (!isOpen) {
        trigger.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        content.classList.add('active');
      }
    });
  });
}

// ── FAQ Accordion ────────────────────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('is-open');

      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('is-open');
        const a = i.querySelector('.faq-answer');
        if (a) a.hidden = true;
        const b = i.querySelector('.faq-question');
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        if (answer) { answer.hidden = false; }
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// ── Scroll Reveal ────────────────────────────────────────────
function initScrollReveal() {
  if (prefersReducedMotion()) {
    document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
}

// ── Stagger Reveal ───────────────────────────────────────────
function applyStagger(gridSelector, itemSelector, delayStep) {
  const step = delayStep || 80;
  document.querySelectorAll(gridSelector).forEach(grid => {
    grid.querySelectorAll(itemSelector).forEach((item, i) => {
      item.style.transitionDelay = (i * step) + 'ms';
    });
  });
}

function initStagger() {
  applyStagger('.friction-grid',   '.friction-card',   80);
  applyStagger('.offers-grid',     '.offer-card',      80);
  applyStagger('.verticals-grid',  '.vertical-card',   80);
  applyStagger('.team-grid',       '.team-card',       90);
  applyStagger('.rgpd-grid',       '.rgpd-item',       70);
  applyStagger('.method-grid-simple', '.method-card-simple', 60);
}

// ── Counter Animation ────────────────────────────────────────
function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix  || '';
  const prefix   = el.dataset.prefix  || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  if (isNaN(target)) return;

  const duration = 1400;
  const startTime = performance.now();

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function update(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value    = easeOut(progress) * target;
    el.textContent = prefix + value.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCounters() {
  if (prefersReducedMotion()) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-value[data-target]').forEach(el => observer.observe(el));
}

// ── Resize handler ───────────────────────────────────────────
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initVanta();
  }, 200);
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initVanta();
  initTypewriter();
  initMobileMenu();
  initStepper();
  initStepperAccordion();
  initFAQ();
  initStagger();
  initScrollReveal();
  initCounters();
});

window.addEventListener('resize', onResize, { passive: true });
