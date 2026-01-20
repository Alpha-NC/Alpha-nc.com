/**
 * Alpha No_Code - Main JavaScript
 * Version 4.0 - Major Update: Stepper, Advantages Toggle, Updated Hero
 * Features: Mobile menu, FAQ, scroll reveal, Vanta.NET, Typewriter, Stepper, Advantages
 */

// ==========================================================================
// CONFIGURATION
// ==========================================================================

const CONFIG = {
  // Vanta.NET settings (respecting brand colors)
  vanta: {
    color: 0x0BA08F,           // Ocean 1
    backgroundColor: 0x0B1020,  // Dark BG
    points: 8.0,
    maxDistance: 22.0,
    spacing: 18.0,
    showDots: true
  },
  // Typewriter settings
  typewriter: {
    words: ['briefs.', 'validations.', 'versions.', 'reporting.', 'relances.'],
    typingSpeed: 85,           // ms per character (typing)
    deletingSpeed: 45,         // ms per character (deleting)
    pauseAfterTyping: 2200,    // ms to pause after typing word
    pauseAfterDeleting: 380    // ms to pause after deleting word
  },
  // Stepper settings
  stepper: {
    autoPlayInterval: 5000,    // Auto-play interval (0 to disable)
    autoPlayEnabled: false     // Set to true for auto-advance
  },
  // Breakpoints
  breakpoints: {
    disableVanta: 768,         // Disable Vanta below this width
    mobileMenu: 1024           // Mobile menu breakpoint
  }
};

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

/**
 * Checks if user prefers reduced motion
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Checks if device is mobile based on breakpoint
 * @returns {boolean}
 */
function isMobileDevice() {
  return window.innerWidth < CONFIG.breakpoints.disableVanta;
}

/**
 * Checks if WebGL is available
 * @returns {boolean}
 */
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

// ==========================================================================
// VANTA.NET BACKGROUND
// ==========================================================================

let vantaEffect = null;

/**
 * Initializes Vanta.NET background on hero section
 */
function initVantaBackground() {
  const vantaContainer = document.getElementById('hero-vanta-bg');
  const heroSection = document.querySelector('.hero');
  
  if (!vantaContainer || !heroSection) {
    console.warn('Vanta container or hero section not found');
    return;
  }

  // Skip Vanta if reduced motion, mobile, or WebGL not available
  if (prefersReducedMotion()) {
    console.log('Vanta disabled: prefers-reduced-motion');
    activateFallback(vantaContainer);
    return;
  }

  if (isMobileDevice()) {
    console.log('Vanta disabled: mobile device');
    activateFallback(vantaContainer);
    return;
  }

  if (!isWebGLAvailable()) {
    console.log('Vanta disabled: WebGL not available');
    activateFallback(vantaContainer);
    return;
  }

  // Check if VANTA is loaded
  if (typeof VANTA === 'undefined' || typeof VANTA.NET === 'undefined') {
    console.warn('Vanta.js or VANTA.NET not loaded');
    activateFallback(vantaContainer);
    return;
  }

  try {
    // Destroy existing effect if any
    if (vantaEffect) {
      vantaEffect.destroy();
    }

    // Initialize Vanta.NET
    vantaEffect = VANTA.NET({
      el: vantaContainer,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: CONFIG.vanta.color,
      backgroundColor: CONFIG.vanta.backgroundColor,
      points: CONFIG.vanta.points,
      maxDistance: CONFIG.vanta.maxDistance,
      spacing: CONFIG.vanta.spacing,
      showDots: CONFIG.vanta.showDots
    });

    // Mark hero as Vanta active (hides default CSS glow)
    heroSection.classList.add('vanta-active');
    
    console.log('Vanta.NET initialized successfully');
  } catch (error) {
    console.error('Error initializing Vanta:', error);
    activateFallback(vantaContainer);
  }
}

/**
 * Activates fallback background when Vanta can't be used
 * @param {HTMLElement} container - The Vanta container element
 */
function activateFallback(container) {
  if (container) {
    container.classList.add('vanta-fallback');
  }
}

/**
 * Destroys Vanta effect and cleans up resources
 */
function destroyVantaEffect() {
  if (vantaEffect) {
    vantaEffect.destroy();
    vantaEffect = null;
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.classList.remove('vanta-active');
    }
    
    console.log('Vanta effect destroyed');
  }
}

/**
 * Handles resize events for Vanta
 */
function handleVantaResize() {
  const vantaContainer = document.getElementById('hero-vanta-bg');
  
  if (isMobileDevice() || prefersReducedMotion()) {
    // Destroy Vanta on mobile/reduced motion
    if (vantaEffect) {
      destroyVantaEffect();
      activateFallback(vantaContainer);
    }
  } else {
    // Re-initialize Vanta on desktop
    if (!vantaEffect && !vantaContainer?.classList.contains('vanta-fallback')) {
      initVantaBackground();
    }
  }
}

// ==========================================================================
// TYPEWRITER EFFECT
// ==========================================================================

let typewriterInstance = null;

/**
 * Typewriter class for animated text effect
 */
class Typewriter {
  constructor(element, words, options = {}) {
    this.element = element;
    this.words = words;
    this.wordIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.isWaiting = false;
    this.isPaused = false;
    
    this.typingSpeed = options.typingSpeed || 85;
    this.deletingSpeed = options.deletingSpeed || 45;
    this.pauseAfterTyping = options.pauseAfterTyping || 2200;
    this.pauseAfterDeleting = options.pauseAfterDeleting || 380;
    
    this.timeoutId = null;
  }

  /**
   * Starts the typewriter animation
   */
  start() {
    if (prefersReducedMotion()) {
      // Show static text for reduced motion
      this.showStaticText();
      return;
    }
    
    this.type();
  }

  /**
   * Shows static text (fallback for reduced motion)
   */
  showStaticText() {
    const parent = this.element.parentElement;
    if (parent) {
      parent.classList.add('typewriter-static');
    }
    // Show first word statically
    this.element.textContent = this.words[0];
  }

  /**
   * Main typing loop
   */
  type() {
    if (this.isPaused) return;

    const currentWord = this.words[this.wordIndex];
    
    if (this.isDeleting) {
      // Deleting characters
      this.charIndex--;
      this.element.textContent = currentWord.substring(0, this.charIndex);
      
      if (this.charIndex === 0) {
        this.isDeleting = false;
        this.wordIndex = (this.wordIndex + 1) % this.words.length;
        
        // Pause before typing next word
        this.timeoutId = setTimeout(() => this.type(), this.pauseAfterDeleting);
        return;
      }
      
      this.timeoutId = setTimeout(() => this.type(), this.deletingSpeed);
    } else {
      // Typing characters
      this.charIndex++;
      this.element.textContent = currentWord.substring(0, this.charIndex);
      
      if (this.charIndex === currentWord.length) {
        // Pause after finishing word
        this.isDeleting = true;
        this.timeoutId = setTimeout(() => this.type(), this.pauseAfterTyping);
        return;
      }
      
      this.timeoutId = setTimeout(() => this.type(), this.typingSpeed);
    }
  }

  /**
   * Pauses the typewriter
   */
  pause() {
    this.isPaused = true;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * Resumes the typewriter
   */
  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.type();
    }
  }

  /**
   * Destroys the typewriter instance
   */
  destroy() {
    this.pause();
    if (this.element) {
      this.element.textContent = this.words[0];
    }
  }
}

/**
 * Initializes the typewriter effect
 */
function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter-text');
  
  if (!typewriterElement) {
    console.warn('Typewriter element not found');
    return;
  }

  // Destroy existing instance if any
  if (typewriterInstance) {
    typewriterInstance.destroy();
  }

  typewriterInstance = new Typewriter(
    typewriterElement,
    CONFIG.typewriter.words,
    {
      typingSpeed: CONFIG.typewriter.typingSpeed,
      deletingSpeed: CONFIG.typewriter.deletingSpeed,
      pauseAfterTyping: CONFIG.typewriter.pauseAfterTyping,
      pauseAfterDeleting: CONFIG.typewriter.pauseAfterDeleting
    }
  );

  typewriterInstance.start();
  console.log('Typewriter initialized');
}

// ==========================================================================
// STEPPER (METHOD SECTION)
// ==========================================================================

let stepperAutoPlayInterval = null;

/**
 * Initializes the stepper component for the method section
 */
function initStepper() {
  const stepperNav = document.querySelector('.stepper-nav');
  const stepperCards = document.querySelectorAll('.stepper-card');
  const stepperNavItems = document.querySelectorAll('.stepper-nav-item');
  
  if (!stepperNav || stepperCards.length === 0) {
    return;
  }

  // Skip interactive stepper for reduced motion
  if (prefersReducedMotion()) {
    // Show all cards
    stepperCards.forEach(card => card.classList.add('active'));
    return;
  }

  /**
   * Activates a specific step
   * @param {number} stepNumber - The step to activate (1-5)
   */
  function activateStep(stepNumber) {
    // Update nav items
    stepperNavItems.forEach(item => {
      const isActive = parseInt(item.dataset.step) === stepNumber;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-pressed', isActive.toString());
    });

    // Update cards
    stepperCards.forEach(card => {
      const isActive = parseInt(card.dataset.step) === stepNumber;
      card.classList.toggle('active', isActive);
    });
  }

  // Click handlers for nav items
  stepperNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const step = parseInt(item.dataset.step);
      activateStep(step);
      
      // Reset auto-play timer if enabled
      if (CONFIG.stepper.autoPlayEnabled) {
        resetAutoPlay();
      }
    });
  });

  // Keyboard support
  stepperNav.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const currentActive = document.querySelector('.stepper-nav-item.active');
      const currentStep = parseInt(currentActive?.dataset.step || 1);
      
      let nextStep;
      if (e.key === 'ArrowRight') {
        nextStep = currentStep < 5 ? currentStep + 1 : 1;
      } else {
        nextStep = currentStep > 1 ? currentStep - 1 : 5;
      }
      
      activateStep(nextStep);
      
      // Focus the new active item
      const nextItem = document.querySelector(`.stepper-nav-item[data-step="${nextStep}"]`);
      nextItem?.focus();
    }
  });

  // Auto-play functionality (if enabled)
  function startAutoPlay() {
    if (!CONFIG.stepper.autoPlayEnabled || CONFIG.stepper.autoPlayInterval <= 0) return;
    
    stepperAutoPlayInterval = setInterval(() => {
      const currentActive = document.querySelector('.stepper-nav-item.active');
      const currentStep = parseInt(currentActive?.dataset.step || 1);
      const nextStep = currentStep < 5 ? currentStep + 1 : 1;
      activateStep(nextStep);
    }, CONFIG.stepper.autoPlayInterval);
  }

  function resetAutoPlay() {
    if (stepperAutoPlayInterval) {
      clearInterval(stepperAutoPlayInterval);
    }
    startAutoPlay();
  }

  // Start auto-play
  startAutoPlay();

  // Intersection observer to pause auto-play when not visible
  if (CONFIG.stepper.autoPlayEnabled) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAutoPlay();
        } else {
          if (stepperAutoPlayInterval) {
            clearInterval(stepperAutoPlayInterval);
          }
        }
      });
    }, { threshold: 0.3 });

    const methodSection = document.getElementById('method');
    if (methodSection) {
      observer.observe(methodSection);
    }
  }

  console.log('Stepper initialized');
}

/**
 * Initializes the stepper accordion for mobile
 */
function initStepperAccordion() {
  const accordionItems = document.querySelectorAll('.stepper-accordion-item');
  
  if (accordionItems.length === 0) return;

  // Skip for reduced motion
  if (prefersReducedMotion()) {
    // Show all content
    accordionItems.forEach(item => {
      const content = item.querySelector('.stepper-accordion-content');
      const trigger = item.querySelector('.stepper-accordion-trigger');
      if (content) content.classList.add('active');
      if (trigger) trigger.classList.add('active');
    });
    return;
  }

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.stepper-accordion-trigger');
    const content = item.querySelector('.stepper-accordion-content');

    trigger?.addEventListener('click', () => {
      const isActive = trigger.classList.contains('active');

      // Close all items
      accordionItems.forEach(otherItem => {
        const otherTrigger = otherItem.querySelector('.stepper-accordion-trigger');
        const otherContent = otherItem.querySelector('.stepper-accordion-content');
        otherTrigger?.classList.remove('active');
        otherTrigger?.setAttribute('aria-expanded', 'false');
        otherContent?.classList.remove('active');
      });

      // Toggle current item
      if (!isActive) {
        trigger.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        content?.classList.add('active');
      }
    });
  });

  console.log('Stepper accordion initialized');
}

// ==========================================================================
// ADVANTAGES TOGGLE (MOBILE)
// ==========================================================================

/**
 * Initializes the advantages toggle for mobile view
 */
function initAdvantagesToggle() {
  const toggleBtns = document.querySelectorAll('.advantages-toggle-btn');
  const columns = document.querySelectorAll('.advantages-column');
  
  if (toggleBtns.length === 0 || columns.length === 0) return;

  // Set initial active state
  const setActiveColumn = (target) => {
    // Update buttons
    toggleBtns.forEach(btn => {
      const isActive = btn.dataset.target === target;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive.toString());
    });

    // Update columns
    columns.forEach(col => {
      const isActive = col.dataset.column === target;
      col.classList.toggle('active', isActive);
    });
  };

  // Click handlers
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setActiveColumn(btn.dataset.target);
    });
  });

  // Set initial state (without on mobile)
  if (window.innerWidth < 768) {
    setActiveColumn('without');
  }

  console.log('Advantages toggle initialized');
}

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

  if (!burgerBtn || !mobileMenu) return;

  /**
   * Ouvre le menu mobile
   */
  const openMenu = () => {
    mobileMenu.classList.add('active');
    menuOverlay?.classList.add('active');
    document.body.classList.add('menu-open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    closeMenuBtn?.focus();
  };

  /**
   * Ferme le menu mobile
   */
  const closeMenu = () => {
    mobileMenu.classList.remove('active');
    menuOverlay?.classList.remove('active');
    document.body.classList.remove('menu-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerBtn.focus();
  };

  // Toggle du menu au clic sur le burger
  burgerBtn.addEventListener('click', () => {
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
      
      // Calcul de l'offset pour tenir compte du header sticky
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Met à jour le focus pour l'accessibilité
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
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
  const reduceMotion = prefersReducedMotion();

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

    // Support clavier (Enter et Espace)
    btn?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
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

  // Effet hover
  roi.addEventListener('mouseenter', () => {
    roi.classList.add('is-active');
  });

  roi.addEventListener('mouseleave', () => {
    roi.classList.remove('is-active');
  });

  // Animation au scroll (une seule fois)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        roi.classList.add('is-active');
        // Retire l'effet après 2s pour permettre l'interaction hover
        setTimeout(() => {
          roi.classList.remove('is-active');
        }, 2000);
        observer.unobserve(roi);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(roi);
}

// ==========================================================================
// ACTIVE NAV LINK
// ==========================================================================

/**
 * Met en surbrillance le lien de navigation actif
 */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Retire la classe active de tous les liens
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Ajoute la classe active au lien correspondant
        const activeLink = document.querySelector(`.nav-menu .nav-link[href="#${id}"]`);
        activeLink?.classList.add('active');
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-100px 0px -50% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

// ==========================================================================
// KEYBOARD NAVIGATION
// ==========================================================================

/**
 * Améliore la navigation au clavier
 */
function initKeyboardNavigation() {
  // Permet de skipper vers le contenu principal
  const skipLink = document.querySelector('.skip-link');
  const mainContent = document.getElementById('main-content');
  
  if (skipLink && mainContent) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
    });
  }

  // Gestion du focus trap dans le menu mobile
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) {
    const focusableElements = mobileMenu.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      mobileMenu.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      });
    }
  }
}

// ==========================================================================
// EXTERNAL LINKS
// ==========================================================================

/**
 * Ajoute les attributs de sécurité aux liens externes
 */
function initExternalLinks() {
  const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
  
  externalLinks.forEach(link => {
    // Ajoute les attributs de sécurité s'ils ne sont pas déjà présents
    if (!link.hasAttribute('rel')) {
      link.setAttribute('rel', 'noopener noreferrer');
    }
    
    // Ajoute target="_blank" si pas déjà présent
    if (!link.hasAttribute('target')) {
      link.setAttribute('target', '_blank');
    }

    // Ajoute une indication visuelle pour l'accessibilité (sr-only)
    if (!link.querySelector('.sr-only')) {
      const srText = document.createElement('span');
      srText.className = 'sr-only';
      srText.textContent = ' (s\'ouvre dans un nouvel onglet)';
      link.appendChild(srText);
    }
  });
}

// ==========================================================================
// VISIBILITY CHANGE HANDLING
// ==========================================================================

/**
 * Handles page visibility changes (pause/resume animations)
 */
function initVisibilityHandling() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Page is hidden - pause animations
      if (typewriterInstance) {
        typewriterInstance.pause();
      }
      if (stepperAutoPlayInterval) {
        clearInterval(stepperAutoPlayInterval);
      }
    } else {
      // Page is visible - resume animations
      if (typewriterInstance && !prefersReducedMotion()) {
        typewriterInstance.resume();
      }
    }
  });
}

// ==========================================================================
// RESIZE HANDLING
// ==========================================================================

let resizeTimeout = null;

/**
 * Debounced resize handler
 */
function initResizeHandling() {
  window.addEventListener('resize', () => {
    // Debounce resize events
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    
    resizeTimeout = setTimeout(() => {
      handleVantaResize();
      
      // Re-initialize advantages toggle state on resize
      const columns = document.querySelectorAll('.advantages-column');
      if (window.innerWidth >= 768) {
        columns.forEach(col => col.classList.remove('active'));
      } else {
        // Ensure one column is active on mobile
        const activeCol = document.querySelector('.advantages-column.active');
        if (!activeCol) {
          const withoutCol = document.querySelector('.advantages-column[data-column="without"]');
          withoutCol?.classList.add('active');
        }
      }
    }, 250);
  });
}

// ==========================================================================
// CLEANUP
// ==========================================================================

/**
 * Cleanup function for page unload
 */
function cleanup() {
  destroyVantaEffect();
  
  if (typewriterInstance) {
    typewriterInstance.destroy();
    typewriterInstance = null;
  }
  
  if (stepperAutoPlayInterval) {
    clearInterval(stepperAutoPlayInterval);
    stepperAutoPlayInterval = null;
  }
  
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
}

// ==========================================================================
// INITIALISATION
// ==========================================================================

/**
 * Point d'entrée principal
 * Exécuté quand le DOM est chargé
 */
document.addEventListener('DOMContentLoaded', () => {
  // Fonctionnalités principales
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initFAQ();
  initROIInteraction();
  
  // Navigation et accessibilité
  initActiveNavLink();
  initKeyboardNavigation();
  initExternalLinks();
  
  // Typewriter effect
  initTypewriter();
  
  // Stepper (method section)
  initStepper();
  initStepperAccordion();
  
  // Advantages toggle (mobile)
  initAdvantagesToggle();
  
  // Event handlers
  initVisibilityHandling();
  initResizeHandling();

  // Log pour confirmer que le script est chargé
  console.log('Alpha No_Code - Script v4.0 chargé avec succès');
});

// ==========================================================================
// WINDOW LOAD (Heavy assets)
// ==========================================================================

/**
 * Opérations différées après le chargement complet
 */
window.addEventListener('load', () => {
  // Initialize Vanta.NET background (needs Three.js to be loaded)
  initVantaBackground();
  
  // Précharge les fonts pour éviter le FOUT
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      document.body.classList.add('fonts-loaded');
    });
  }
  
  console.log('Alpha No_Code - All assets loaded');
});

// ==========================================================================
// CLEANUP ON UNLOAD
// ==========================================================================

window.addEventListener('beforeunload', cleanup);
