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
// MÉTHODE — AUTO SWITCH AU SCROLL (SANS CHANGER LA STRUCTURE)
// ==========================================================================

/**
 * Améliore la compréhension de la section "Méthode" :
 * - Les cartes se "switchent" automatiquement au scroll (1 cran = 1 étape)
 * - La carte active est mise en avant
 * - Le clic reste possible (et met en pause l'auto pendant un court instant)
 *
 * Sans modifier la structure HTML.
 */
function initMethodScrollStepper() {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia && window.matchMedia('(min-width: 900px)').matches; // only on larger screens
  if (prefersReduced || !isDesktop) return;

  const section = document.getElementById('method');
  if (!section) return;

  const rows = Array.from(section.querySelectorAll('.timeline-row'));
  if (!rows.length) return;

  let activeIndex = 0;
  let lastSwitchAt = 0;
  let clickPauseUntil = 0;
  let wheelAccum = 0;

  // Slower switching
  const SWITCH_COOLDOWN_MS = 1100; // <- plus lent
  const DELTA_THRESHOLD = 90;      // <- évite micro scrolls
  const CLICK_PAUSE_MS = 1400;

  function setActive(index, { scroll = false } = {}) {
    const clamped = Math.max(0, Math.min(rows.length - 1, index));
    activeIndex = clamped;

    rows.forEach((row, i) => row.classList.toggle('is-active', i === clamped));

    if (scroll) rows[clamped].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Initial state
  setActive(0, { scroll: false });

  // Click keeps working + pauses auto
  rows.forEach((row, i) => {
    row.addEventListener('click', () => {
      clickPauseUntil = Date.now() + CLICK_PAUSE_MS;
      setActive(i, { scroll: true });
    });
  });

  // Update active row as user scrolls normally
  const io = new IntersectionObserver((entries) => {
    if (Date.now() < clickPauseUntil) return;

    let best = null;
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
    }
    if (!best) return;

    const idx = rows.indexOf(best.target);
    if (idx !== -1 && idx !== activeIndex) setActive(idx, { scroll: false });
  }, {
    threshold: [0.35, 0.5, 0.65, 0.8],
    rootMargin: '-10% 0px -35% 0px'
  });

  rows.forEach(r => io.observe(r));

  function inPinnedZone() {
    // "Se fixe sur la section" : on active le mode stepper quand la section est bien cadrée
    const rect = section.getBoundingClientRect();
    const topGate = 150;
    const bottomGate = window.innerHeight - 150;
    return rect.top <= topGate && rect.bottom >= bottomGate;
  }

  function handleWheel(e) {
    if (!inPinnedZone()) return;
    if (Date.now() < clickPauseUntil) return;

    wheelAccum += e.deltaY;

    if (Math.abs(wheelAccum) < DELTA_THRESHOLD) return;

    const now = Date.now();
    if (now - lastSwitchAt < SWITCH_COOLDOWN_MS) return;

    const dir = wheelAccum > 0 ? 1 : -1;
    wheelAccum = 0;

    const next = activeIndex + dir;

    // At edges, let natural scroll exit the section
    if (next < 0 || next >= rows.length) return;

    // Prevent default scroll -> step-by-step progression
    e.preventDefault();
    lastSwitchAt = now;
    setActive(next, { scroll: true });
  }

  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('resize', () => { wheelAccum = 0; });
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initFAQ();
  initROIInteraction();
  initMethodScrollStepper();

  // Log pour confirmer que le script est chargé
  console.log('✅ Alpha No_Code - Script chargé avec succès');
});
