/**
 * Alpha No_Code - Main JavaScript
 * Gestion du menu mobile, FAQ, scroll reveal et interactions
 */

// ==========================================================================
// MOBILE MENU
// ==========================================================================

/**
 * Initialise le menu mobile
 */
function initMobileMenu() {
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const menuOverlay = document.getElementById('menuOverlay');

  /**
   * Ouvre le menu mobile
   */
  const openMenu = () => {
    mobileMenu.classList.add('active');
    menuOverlay.classList.add('active');
    document.body.classList.add('menu-open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    closeMenuBtn.focus();
  };

  /**
   * Ferme le menu mobile
   */
  const closeMenu = () => {
    mobileMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerBtn.focus();
  };

  // Toggle du menu au clic sur le burger
  burgerBtn?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('active');
    isOpen ? closeMenu() : openMenu();
  });

  // Fermeture au clic sur le bouton de fermeture
  closeMenuBtn?.addEventListener('click', closeMenu);

  // Fermeture au clic sur l'overlay
  menuOverlay?.addEventListener('click', closeMenu);

  // Fermeture au touche Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Fermeture lors du clic sur un lien de navigation dans le menu mobile
  mobileMenu.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', () => closeMenu());
  });
}

// ==========================================================================
// SMOOTH SCROLL
// ==========================================================================

/**
 * Gère le scroll smooth vers les ancres
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Ignore les liens vides ou juste "#"
      if (!targetId || targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (!target) return;
      
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ==========================================================================
// SCROLL REVEAL
// ==========================================================================

/**
 * Anime les éléments au scroll (Intersection Observer)
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Si l'utilisateur préfère réduire les animations, on affiche tout directement
  if (reduceMotion) {
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  // Intersection Observer pour détecter les éléments visibles
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { 
    threshold: 0.15, 
    rootMargin: "0px 0px -50px 0px" 
  });

  // Observer chaque élément
  revealElements.forEach(el => observer.observe(el));
}

// ==========================================================================
// FAQ ACCORDION
// ==========================================================================

/**
 * Gère l'accordéon FAQ (1 élément ouvert à la fois)
 */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-trigger');
    const answerId = btn?.getAttribute('aria-controls');
    const answer = answerId ? document.getElementById(answerId) : null;

    btn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Ferme tous les autres items
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherBtn = other.querySelector('.faq-trigger');
        otherBtn?.setAttribute('aria-expanded', 'false');
      });

      // Toggle l'item actuel
      if (!isOpen) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// ==========================================================================
// ROI INTERACTION
// ==========================================================================

/**
 * Gère l'effet hover sur le ROI
 */
function initROIInteraction() {
  const roi = document.getElementById('roi-stat');
  
  if (!roi) return;

  roi.addEventListener('mouseenter', () => {
    roi.classList.add('is-active');
  });

  roi.addEventListener('mouseleave', () => {
    roi.classList.remove('is-active');
  });
}

// ==========================================================================
// INITIALISATION
// ==========================================================================

/**
 * Point d'entrée principal
 * Exécuté quand le DOM est chargé
 */

// ==========================================================================
// METHOD STEPPER — SCROLL "PIN" + SCROLL-DRIVEN STEP SWITCH (click still works)
// ==========================================================================

/**
 * Initialise la section Méthode (stepper) :
 * - Comportement demandé :
 *   1) On laisse scroller jusqu'à ce que la section soit entièrement visible
 *   2) La section se "fige" (scroll lock) sur la méthode
 *   3) La molette / trackpad fait défiler les cartes (plus lent)
 *   4) Sur la dernière carte, un scroll supplémentaire libère le scroll vers la section suivante
 * - Le clic sur les étapes reste possible (et met en pause l'auto-switch brièvement)
 */
function initMethodStepperScrollLock() {
  const section = document.querySelector('#method');
  if (!section) return;

  const navItems = Array.from(section.querySelectorAll('.stepper-nav-item[data-step]'));
  const cards = Array.from(section.querySelectorAll('.stepper-card[data-step]'));
  const accordionTriggers = Array.from(section.querySelectorAll('.stepper-accordion-trigger[data-step]'));
  const accordionItems = Array.from(section.querySelectorAll('.stepper-accordion-item[data-step]'));

  if (!navItems.length || !cards.length) return;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const MAX_STEP = Math.max(...cards.map(c => parseInt(c.dataset.step, 10)).filter(Number.isFinite));
  let activeStep = 1;

  // Scroll-lock state
  let pinned = false;
  let snappedOnce = false;
  let wheelAccum = 0;
  let lastSwitchAt = 0;
  let manualPauseUntil = 0;

  // Tunables (slower + more deliberate)
  const DELTA_THRESHOLD = 240;     // ↑ = moins sensible trackpad
  const SWITCH_COOLDOWN = 1400;    // ↑ = plus lent
  const SNAP_DELAY_MS = 220;

  function clampStep(n) {
    return Math.max(1, Math.min(MAX_STEP, n));
  }

  function setActiveUI(step) {
    // Cards
    cards.forEach(card => {
      const s = parseInt(card.dataset.step, 10);
      card.classList.toggle('active', s === step);
      card.setAttribute('aria-hidden', s === step ? 'false' : 'true');
    });

    // Nav buttons
    navItems.forEach(btn => {
      const s = parseInt(btn.dataset.step, 10);
      const isActive = s === step;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    // Mobile accordion (if present)
    if (accordionItems.length && accordionTriggers.length) {
      accordionItems.forEach(item => {
        const s = parseInt(item.dataset.step, 10);
        const isActive = s === step;
        item.classList.toggle('active', isActive);
        const content = item.querySelector('.stepper-accordion-content');
        const trigger = item.querySelector('.stepper-accordion-trigger');
        if (content && trigger) {
          trigger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
          content.hidden = !isActive;
        }
      });
    }
  }

  function activateStep(step, source = 'scroll') {
    const next = clampStep(step);
    if (next === activeStep) return;
    activeStep = next;
    setActiveUI(activeStep);

    // Petite aide UX : quand on clique, on met en pause l'auto-switch
    if (source === 'click') {
      manualPauseUntil = Date.now() + 1600;
      wheelAccum = 0;
    }
  }

  function getNextSection(el) {
    let cur = el.nextElementSibling;
    while (cur) {
      if (cur.matches && cur.matches('section')) return cur;
      cur = cur.nextElementSibling;
    }
    return null;
  }

  function getPrevSection(el) {
    let cur = el.previousElementSibling;
    while (cur) {
      if (cur.matches && cur.matches('section')) return cur;
      cur = cur.previousElementSibling;
    }
    return null;
  }

  function scrollToSection(target, direction = 'down') {
    if (!target) return;
    const behavior = prefersReducedMotion ? 'auto' : 'smooth';
    target.scrollIntoView({ behavior, block: 'start' });
  }

  function isFullyVisible(el) {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    // tolérance de 8px pour éviter les micro-écarts
    return rect.top >= -8 && rect.bottom <= vh + 8;
  }

  function isReasonablyPinnable(el) {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    // si la section est trop grande pour tenir à l'écran, on évite le scroll-lock agressif
    return rect.height <= vh * 0.98;
  }

  function pin() {
    if (pinned || prefersReducedMotion) return;
    pinned = true;
    wheelAccum = 0;
    section.classList.add('is-pinned');
    document.body.classList.add('method-scrolllock');
  }

  function unpin() {
    if (!pinned) return;
    pinned = false;
    wheelAccum = 0;
    section.classList.remove('is-pinned');
    document.body.classList.remove('method-scrolllock');
  }

  function maybeSnapAndPin() {
    if (prefersReducedMotion) return;

    // On ne "fige" que si la section peut tenir à l'écran ET est entièrement visible
    if (!isReasonablyPinnable(section)) {
      unpin();
      return;
    }

    if (isFullyVisible(section)) {
      if (!snappedOnce) {
        // Snap doux pour que l'utilisateur voie la section en entier avant blocage
        const behavior = prefersReducedMotion ? 'auto' : 'smooth';
        section.scrollIntoView({ behavior, block: 'center' });
        snappedOnce = true;
        setTimeout(() => {
          if (isFullyVisible(section)) pin();
        }, SNAP_DELAY_MS);
      } else {
        pin();
      }
    } else {
      // Si on sort de la zone, on libère
      unpin();
      snappedOnce = false;
    }
  }

  // Click handlers (desktop nav)
  navItems.forEach(btn => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.dataset.step, 10);
      activateStep(step, 'click');
    });
  });

  // Click handlers (mobile accordion)
  accordionTriggers.forEach(tr => {
    tr.addEventListener('click', () => {
      const step = parseInt(tr.dataset.step, 10);
      activateStep(step, 'click');
    });
  });

  // Wheel / trackpad — pinned mode
  function onWheel(e) {
    if (!pinned) return;

    // Si l'utilisateur est en train de cliquer/choisir, on respecte une pause
    const now = Date.now();
    if (now < manualPauseUntil) return;

    // Empêcher le scroll de que la page bouge : on est "figé" sur la section
    e.preventDefault();

    // Si trop tôt après un switch, on ignore pour ralentir
    if (now - lastSwitchAt < SWITCH_COOLDOWN) return;

    wheelAccum += e.deltaY;

    if (Math.abs(wheelAccum) < DELTA_THRESHOLD) return;

    const dir = wheelAccum > 0 ? 1 : -1;
    wheelAccum = 0;

    if (dir > 0) {
      if (activeStep < MAX_STEP) {
        activateStep(activeStep + 1, 'scroll');
        lastSwitchAt = now;
      } else {
        // Dernière carte => libérer et aller à la section suivante au prochain "cran"
        unpin();
        lastSwitchAt = now;
        const next = getNextSection(section);
        scrollToSection(next, 'down');
      }
    } else {
      if (activeStep > 1) {
        activateStep(activeStep - 1, 'scroll');
        lastSwitchAt = now;
      } else {
        // Première carte => libérer et remonter à la section précédente
        unpin();
        lastSwitchAt = now;
        const prev = getPrevSection(section);
        scrollToSection(prev, 'up');
      }
    }
  }

  // Keyboard support while pinned
  function onKeyDown(e) {
    if (!pinned) return;

    const keys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Spacebar'];
    if (!keys.includes(e.key)) return;

    e.preventDefault();
    const now = Date.now();
    if (now < manualPauseUntil) return;
    if (now - lastSwitchAt < SWITCH_COOLDOWN) return;

    const down = (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ' || e.key === 'Spacebar');
    if (down) {
      if (activeStep < MAX_STEP) {
        activateStep(activeStep + 1, 'scroll');
        lastSwitchAt = now;
      } else {
        unpin();
        lastSwitchAt = now;
        const next = getNextSection(section);
        scrollToSection(next, 'down');
      }
    } else {
      if (activeStep > 1) {
        activateStep(activeStep - 1, 'scroll');
        lastSwitchAt = now;
      } else {
        unpin();
        lastSwitchAt = now;
        const prev = getPrevSection(section);
        scrollToSection(prev, 'up');
      }
    }
  }

  // Touch support (basic) while pinned: block touchmove to avoid leaving the section
  function onTouchMove(e) {
    if (!pinned) return;
    e.preventDefault();
  }

  // Listen
  window.addEventListener('scroll', maybeSnapAndPin, { passive: true });
  window.addEventListener('resize', () => {
    snappedOnce = false;
    maybeSnapAndPin();
  }, { passive: true });

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKeyDown, { passive: false });
  window.addEventListener('touchmove', onTouchMove, { passive: false });

  // Initial UI state
  setActiveUI(activeStep);
  // Start watching after a tick
  setTimeout(maybeSnapAndPin, 200);
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initFAQ();
  initROIInteraction();
  initMethodStepperScrollLock();

  // Log pour confirmer que le script est chargé
  console.log('✅ Alpha No_Code - Script chargé avec succès');
});
