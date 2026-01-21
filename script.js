/**
 * Alpha No_Code - Main JavaScript
 * Version 5.3 - Scroll-Driven Stepper Enhancement
 * Features: Mobile menu, FAQ, scroll reveal, Vanta.NET, Typewriter, Stepper, 
 *           Scroll-Driven Stepper, Advantages, ROI Calculator with Breakdown, Integrated Scratch Card
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
  // Scroll-driven stepper settings
  scrollStepper: {
    enabled: true,                    // Enable scroll-driven stepper
    cooldownMs: 1800,                 // Cooldown between step changes (ms)
    deltaThreshold: 150,              // Minimum accumulated delta to trigger step change
    accumulatorDecay: 0.92,           // Decay rate for accumulated delta (0-1)
    clickPauseMs: 1500,               // Pause after click before allowing scroll changes
    mobileBreakpoint: 768,            // Below this width, use fallback behavior
    unlockScrollBuffer: 50            // Extra scroll buffer when unlocking (px)
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
// SCROLL-DRIVEN STEPPER (METHOD SECTION)
// ==========================================================================

/**
 * Scroll-Driven Stepper Controller
 * Manages scroll-lock behavior for the Method section stepper
 */
class ScrollDrivenStepper {
  constructor() {
    // DOM Elements
    this.methodSection = document.getElementById('method');
    this.stepperNav = document.querySelector('.stepper-nav');
    this.stepperNavItems = document.querySelectorAll('.stepper-nav-item');
    this.stepperCards = document.querySelectorAll('.stepper-card');
    this.progressBar = document.querySelector('.stepper-scroll-progress-bar');
    
    // Early exit if elements not found or reduced motion preferred
    if (!this.methodSection || !this.stepperNav || this.stepperNavItems.length === 0) {
      console.log('ScrollDrivenStepper: Required elements not found');
      return;
    }
    
    if (prefersReducedMotion()) {
      console.log('ScrollDrivenStepper: Disabled due to prefers-reduced-motion');
      return;
    }
    
    if (!CONFIG.scrollStepper.enabled) {
      console.log('ScrollDrivenStepper: Disabled in config');
      return;
    }
    
    // State
    this.isLocked = false;
    this.currentStep = 1;
    this.totalSteps = this.stepperNavItems.length;
    this.deltaAccumulator = 0;
    this.lastWheelTime = 0;
    this.lastStepChangeTime = 0;
    this.clickPauseUntil = 0;
    this.isInitialized = false;
    
    // Config shortcuts
    this.cooldownMs = CONFIG.scrollStepper.cooldownMs;
    this.deltaThreshold = CONFIG.scrollStepper.deltaThreshold;
    this.accumulatorDecay = CONFIG.scrollStepper.accumulatorDecay;
    this.clickPauseMs = CONFIG.scrollStepper.clickPauseMs;
    this.mobileBreakpoint = CONFIG.scrollStepper.mobileBreakpoint;
    
    // Bound methods for event listeners
    this.handleWheel = this.handleWheel.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleNavClick = this.handleNavClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.checkSectionVisibility = this.checkSectionVisibility.bind(this);
    
    this.init();
  }
  
  /**
   * Initialize the scroll-driven stepper
   */
  init() {
    if (this.isInitialized) return;
    
    // Check if on mobile - use different behavior
    if (window.innerWidth < this.mobileBreakpoint) {
      console.log('ScrollDrivenStepper: Mobile detected, using accordion fallback');
      return;
    }
    
    // Bind events
    this.bindEvents();
    
    // Initial visibility check
    this.checkSectionVisibility();
    
    this.isInitialized = true;
    console.log('ScrollDrivenStepper initialized');
  }
  
  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Wheel event for scroll capture (non-passive to allow preventDefault)
    window.addEventListener('wheel', this.handleWheel, { passive: false });
    
    // Scroll event for visibility checking
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    
    // Click handlers for nav items (with pause behavior)
    this.stepperNavItems.forEach(item => {
      item.addEventListener('click', this.handleNavClick);
    });
    
    // Keyboard navigation within locked section
    document.addEventListener('keydown', this.handleKeydown);
    
    // Resize handler
    window.addEventListener('resize', () => {
      if (window.innerWidth < this.mobileBreakpoint) {
        this.unlock();
      }
    });
  }
  
  /**
   * Check if the method section is fully visible in viewport
   * @returns {boolean}
   */
  isSectionFullyVisible() {
    const rect = this.methodSection.getBoundingClientRect();
    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
    
    // Section must be fully visible (top >= header, bottom <= viewport)
    const topVisible = rect.top >= headerHeight - 10; // Small tolerance
    const bottomVisible = rect.bottom <= window.innerHeight + 10;
    
    return topVisible && bottomVisible;
  }
  
  /**
   * Check if section is in view (partial visibility for unlock trigger)
   * @returns {boolean}
   */
  isSectionInView() {
    const rect = this.methodSection.getBoundingClientRect();
    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
    
    return rect.top < window.innerHeight && rect.bottom > headerHeight;
  }
  
  /**
   * Check section visibility and manage lock state
   */
  checkSectionVisibility() {
    if (window.innerWidth < this.mobileBreakpoint) {
      this.unlock();
      return;
    }
    
    const fullyVisible = this.isSectionFullyVisible();
    
    if (fullyVisible && !this.isLocked) {
      this.lock();
    } else if (!fullyVisible && this.isLocked) {
      // Check if we should stay locked (user still interacting)
      // Only unlock if section has scrolled out of view significantly
      const rect = this.methodSection.getBoundingClientRect();
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      
      if (rect.bottom < headerHeight || rect.top > window.innerHeight) {
        this.unlock();
      }
    }
  }
  
  /**
   * Lock the section for scroll-driven stepping
   */
  lock() {
    if (this.isLocked) return;
    
    this.isLocked = true;
    this.methodSection.classList.add('method-is-locked');
    this.deltaAccumulator = 0;
    
    // Sync current step with active nav item
    const activeItem = this.stepperNav.querySelector('.stepper-nav-item.active');
    if (activeItem) {
      this.currentStep = parseInt(activeItem.dataset.step) || 1;
    }
    
    this.updateProgress();
    console.log('ScrollDrivenStepper: Locked at step', this.currentStep);
  }
  
  /**
   * Unlock the section for normal scrolling
   */
  unlock() {
    if (!this.isLocked) return;
    
    this.isLocked = false;
    this.methodSection.classList.remove('method-is-locked');
    this.deltaAccumulator = 0;
    
    console.log('ScrollDrivenStepper: Unlocked');
  }
  
  /**
   * Handle wheel events
   * @param {WheelEvent} e
   */
  handleWheel(e) {
    // Skip if not locked or on mobile
    if (!this.isLocked || window.innerWidth < this.mobileBreakpoint) {
      return;
    }
    
    // Check if we're past the click pause period
    const now = Date.now();
    if (now < this.clickPauseUntil) {
      e.preventDefault();
      return;
    }
    
    // Determine scroll direction
    const direction = e.deltaY > 0 ? 1 : -1;
    
    // Check for unlock conditions BEFORE preventing default
    if (direction > 0 && this.currentStep === this.totalSteps) {
      // Last step + scroll down = unlock and continue
      this.unlock();
      this.methodSection.classList.add('method-scroll-complete');
      return; // Allow natural scroll
    }
    
    if (direction < 0 && this.currentStep === 1) {
      // First step + scroll up = unlock and continue
      this.unlock();
      return; // Allow natural scroll
    }
    
    // Prevent default scrolling while locked
    e.preventDefault();
    
    // Accumulate delta with decay
    const timeDelta = now - this.lastWheelTime;
    if (timeDelta > 100) {
      // Reset accumulator if too much time passed
      this.deltaAccumulator = 0;
    } else {
      // Apply decay to existing accumulator
      this.deltaAccumulator *= this.accumulatorDecay;
    }
    
    // Add new delta (normalize for trackpad vs mouse wheel)
    const normalizedDelta = Math.abs(e.deltaY);
    this.deltaAccumulator += normalizedDelta;
    this.lastWheelTime = now;
    
    // Check if we've accumulated enough to trigger a step change
    if (this.deltaAccumulator >= this.deltaThreshold) {
      // Check cooldown
      if (now - this.lastStepChangeTime >= this.cooldownMs) {
        this.changeStep(direction);
        this.lastStepChangeTime = now;
        this.deltaAccumulator = 0;
      }
    }
  }
  
  /**
   * Handle scroll events for visibility checking
   */
  handleScroll() {
    // Debounce check
    if (!this.scrollCheckPending) {
      this.scrollCheckPending = true;
      requestAnimationFrame(() => {
        this.checkSectionVisibility();
        this.scrollCheckPending = false;
      });
    }
  }
  
  /**
   * Handle navigation item clicks
   * @param {Event} e
   */
  handleNavClick(e) {
    const step = parseInt(e.currentTarget.dataset.step);
    if (!step || step === this.currentStep) return;
    
    // Set click pause to prevent immediate scroll override
    this.clickPauseUntil = Date.now() + this.clickPauseMs;
    
    // Update current step
    this.currentStep = step;
    this.updateProgress();
    
    // Don't call activateStep here - let the existing click handler do it
    console.log('ScrollDrivenStepper: Click set step to', step);
  }
  
  /**
   * Handle keyboard navigation while locked
   * @param {KeyboardEvent} e
   */
  handleKeydown(e) {
    if (!this.isLocked) return;
    
    // Only handle if focus is within the method section or on stepper nav
    const isInSection = this.methodSection.contains(document.activeElement);
    const isOnNav = this.stepperNav.contains(document.activeElement);
    
    if (!isInSection && !isOnNav) return;
    
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        if (this.currentStep < this.totalSteps) {
          e.preventDefault();
          this.changeStep(1);
          this.lastStepChangeTime = Date.now();
        }
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        if (this.currentStep > 1) {
          e.preventDefault();
          this.changeStep(-1);
          this.lastStepChangeTime = Date.now();
        }
        break;
      case 'Escape':
        // Allow escaping the lock
        this.unlock();
        break;
    }
  }
  
  /**
   * Change to next/previous step
   * @param {number} direction - 1 for next, -1 for previous
   */
  changeStep(direction) {
    const newStep = this.currentStep + direction;
    
    // Bounds check
    if (newStep < 1 || newStep > this.totalSteps) {
      return;
    }
    
    this.currentStep = newStep;
    this.activateStep(this.currentStep);
    this.updateProgress();
    
    console.log('ScrollDrivenStepper: Changed to step', this.currentStep);
  }
  
  /**
   * Activate a specific step (updates UI)
   * @param {number} stepNumber
   */
  activateStep(stepNumber) {
    // Update nav items
    this.stepperNavItems.forEach(item => {
      const isActive = parseInt(item.dataset.step) === stepNumber;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-pressed', isActive.toString());
      item.setAttribute('aria-selected', isActive.toString());
      item.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    
    // Update cards
    this.stepperCards.forEach(card => {
      const isActive = parseInt(card.dataset.step) === stepNumber;
      card.classList.toggle('active', isActive);
    });
    
    // Update stepper content aria-labelledby
    const stepperContent = document.querySelector('.stepper-content');
    if (stepperContent) {
      stepperContent.setAttribute('aria-labelledby', `stepper-tab-${stepNumber}`);
    }
    
    // Announce to screen readers
    this.announceStep(stepNumber);
  }
  
  /**
   * Update progress indicator
   */
  updateProgress() {
    const progress = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
    
    if (this.progressBar) {
      this.progressBar.style.setProperty('--stepper-progress', `${progress}%`);
    }
  }
  
  /**
   * Announce step change for screen readers
   * @param {number} stepNumber
   */
  announceStep(stepNumber) {
    const navItem = document.querySelector(`.stepper-nav-item[data-step="${stepNumber}"]`);
    const label = navItem?.querySelector('.stepper-nav-label')?.textContent || `Étape ${stepNumber}`;
    
    // Use aria-live region if available, otherwise create temporary one
    let liveRegion = document.getElementById('stepper-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'stepper-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
    
    liveRegion.textContent = `Étape ${stepNumber} sur ${this.totalSteps}: ${label}`;
  }
  
  /**
   * Destroy the controller and clean up
   */
  destroy() {
    window.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('keydown', this.handleKeydown);
    
    this.stepperNavItems.forEach(item => {
      item.removeEventListener('click', this.handleNavClick);
    });
    
    this.unlock();
    this.isInitialized = false;
    
    console.log('ScrollDrivenStepper destroyed');
  }
}

// Global instance
let scrollDrivenStepperInstance = null;

/**
 * Initialize the scroll-driven stepper
 */
function initScrollDrivenStepper() {
  // Destroy existing instance if any
  if (scrollDrivenStepperInstance) {
    scrollDrivenStepperInstance.destroy();
  }
  
  // Create new instance
  scrollDrivenStepperInstance = new ScrollDrivenStepper();
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
// ROI CALCULATOR & SCRATCH REVEAL GATING
// ==========================================================================

/**
 * ROI Calculator state
 */
let roiCalculated = false;

/**
 * Initializes the ROI Calculator and conditional scratch reveal
 */
function initROICalculator() {
  const form = document.getElementById('roi-calculator');
  const calcBtn = document.getElementById('roi-calc-btn');
  const scratchCard = document.getElementById('scratch-card');
  const scratchAnnualGain = document.getElementById('scratch-annual-gain');
  const scratchDaysValue = document.getElementById('scratch-days-value');
  const scratchFallbackGain = document.getElementById('scratch-fallback-gain');
  const scratchFallbackDays = document.getElementById('scratch-fallback-days');
  
  // Breakdown elements
  const breakdownToggle = document.getElementById('roi-breakdown-toggle');
  const breakdownPanel = document.getElementById('roi-breakdown');
  const breakdownTeam = document.getElementById('breakdown-team');
  const breakdownHours = document.getElementById('breakdown-hours');
  const breakdownRate = document.getElementById('breakdown-rate');
  const breakdownResult = document.getElementById('breakdown-result');
  
  // Scratch fallback container (reduced motion / no canvas)
  const scratchFallback = document.getElementById('scratch-fallback');
  
  // Input fields
  const teamSizeInput = document.getElementById('roi-team-size');
  const hoursLostInput = document.getElementById('roi-hours-lost');
  const hourlyRateInput = document.getElementById('roi-hourly-rate');
  
  if (!form || !scratchCard || !scratchAnnualGain || !scratchDaysValue) {
    console.warn('ROI Calculator elements not found');
    return;
  }
  
  const allInputs = [teamSizeInput, hoursLostInput, hourlyRateInput].filter(Boolean);

  // Disable breakdown until first calculation (avoid empty/collapsed confusion)
  if (breakdownToggle) {
    breakdownToggle.disabled = true;
    breakdownToggle.setAttribute('aria-expanded', 'false');
  }
  if (breakdownPanel) {
    breakdownPanel.setAttribute('hidden', '');
  }
  
  /**
   * Calculate ROI based on inputs
   * @returns {{ annualGain: number, daysRecovered: number, teamSize: number, hoursLost: number, hourlyRate: number, annualHours: number }}
   */
  function calculateROI() {
    const teamSize = parseInt(teamSizeInput?.value) || 5;
    const hoursLost = parseInt(hoursLostInput?.value) || 4;
    const hourlyRate = parseInt(hourlyRateInput?.value) || 35;
    
    // Calculate annual gain: team × hours/week × 47 weeks × hourly rate
    const weeksPerYear = 47; // ~52 weeks minus holidays
    const annualHours = teamSize * hoursLost * weeksPerYear;
    const annualGain = annualHours * hourlyRate;
    
    // Calculate days recovered: total hours / 8 hours per day
    const daysRecovered = Math.round(annualHours / 8);
    
    return { annualGain, daysRecovered, teamSize, hoursLost, hourlyRate, annualHours };
  }
  
  /**
   * Format number as K€ or M€
   * @param {number} value
   * @returns {string}
   */
  function formatCurrency(value) {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M€`;
    } else if (value >= 1000) {
      return `${Math.round(value / 1000)}K€`;
    } else {
      return `${value}€`;
    }
  }
  
  /**
   * Update the scratch content with calculated days
   * @param {number} days
   */
  function updateScratchContent(data) {
    const gainText = formatCurrency(data.annualGain);
    const daysText = `${data.daysRecovered}`;

    // Main (revealed after scratch)
    if (scratchAnnualGain) scratchAnnualGain.textContent = gainText;
    if (scratchDaysValue) scratchDaysValue.textContent = daysText;

    // Fallback (reduced motion / no canvas)
    if (scratchFallbackGain) scratchFallbackGain.textContent = gainText;
    if (scratchFallbackDays) scratchFallbackDays.textContent = daysText;
  }
  
  /**
   * Update breakdown panel with calculation details
   * @param {object} data
   */
  function updateBreakdownPanel(data) {
    if (breakdownTeam) breakdownTeam.textContent = data.teamSize;
    if (breakdownHours) breakdownHours.textContent = data.hoursLost;
    if (breakdownRate) breakdownRate.textContent = data.hourlyRate;
    if (breakdownResult) {
      breakdownResult.innerHTML = `${formatCurrency(data.annualGain)} <span style="color: rgba(255,255,255,0.6); font-weight: normal;">(${data.annualHours}h/an → ${data.daysRecovered} jours)</span>`;
    }
  }
  
  /**
   * Toggle breakdown panel visibility
   */
  function initBreakdownToggle() {
    if (!breakdownToggle || !breakdownPanel) return;
    
    breakdownToggle.addEventListener('click', () => {
      const isExpanded = breakdownToggle.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        breakdownToggle.setAttribute('aria-expanded', 'false');
        breakdownPanel.setAttribute('hidden', '');
      } else {
        breakdownToggle.setAttribute('aria-expanded', 'true');
        breakdownPanel.removeAttribute('hidden');
      }
    });
    
    // Keyboard support
    breakdownToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        breakdownToggle.click();
      }
    });
  }
  
  /**
   * Reveal the scratch card with animation
   */
  function revealScratchCard() {
    // Always reset internal scratch UI before showing
    const fallback = document.getElementById('scratch-fallback');
    const canvas = document.getElementById('scratch-canvas');
    const overlay = document.getElementById('scratch-overlay-text');
    const container = document.getElementById('scratchContainer');
    const resetBtn = document.getElementById('scratchReset');

    if (fallback) fallback.setAttribute('hidden', '');
    if (canvas) canvas.style.display = '';
    if (overlay) {
      overlay.style.display = '';
      overlay.classList.remove('hidden');
    }
    if (container) container.classList.remove('is-revealed');
    if (resetBtn) resetBtn.classList.remove('visible');

    // Remove hidden attributes
    scratchCard.removeAttribute('hidden');
    scratchCard.setAttribute('aria-hidden', 'false');
    scratchCard.classList.remove('is-hidden');
    
    // Add reveal animation (only if not prefers-reduced-motion)
    if (!prefersReducedMotion()) {
      scratchCard.classList.add('reveal-active');
    }
    
    // Initialize scratch canvas after revealing (deferred initialization)
    // Use setTimeout to ensure DOM is updated before canvas measurement
    setTimeout(() => {
      if (!scratchInstance) {
        initScratchReveal();
      } else {
        // Reset the scratch card for a fresh experience
        scratchInstance.reset();
      }
    }, 50);
    
    // Handle reduced motion / canvas fallback
    if (prefersReducedMotion() || !isCanvasSupported()) {
      showScratchFallback();
    }
    
    console.log('Scratch card revealed after ROI calculation');
  }
  
  /**
   * Check if canvas is supported
   * @returns {boolean}
   */
  function isCanvasSupported() {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
  }
  
  /**
   * Show fallback content (for reduced motion or no canvas)
   */
  function showScratchFallback() {
    const fallback = document.getElementById('scratch-fallback');
    const canvas = document.getElementById('scratch-canvas');
    const overlay = document.getElementById('scratch-overlay-text');
    
    if (fallback) fallback.removeAttribute('hidden');
    if (canvas) canvas.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
  }
  
  /**
   * Hide the scratch card
   */
  function hideScratchCard() {
    scratchCard.setAttribute('hidden', '');
    scratchCard.setAttribute('aria-hidden', 'true');
    scratchCard.classList.add('is-hidden');
    scratchCard.classList.remove('reveal-active');

    // Reset scratch UI so we never accumulate duplicates / spoilers
    const fallback = document.getElementById('scratch-fallback');
    const canvas = document.getElementById('scratch-canvas');
    const overlay = document.getElementById('scratch-overlay-text');
    const container = document.getElementById('scratchContainer');
    const resetBtn = document.getElementById('scratchReset');

    if (fallback) fallback.setAttribute('hidden', '');
    if (canvas) canvas.style.display = '';
    if (overlay) {
      overlay.style.display = '';
      overlay.classList.remove('hidden');
    }
    if (container) container.classList.remove('is-revealed');
    if (resetBtn) resetBtn.classList.remove('visible');
    
    console.log('Scratch card hidden');
  }
  
  /**
   * Handle ROI form submission
   * @param {Event} e
   */
  function handleROICalculation(e) {
    e.preventDefault();
    
    const result = calculateROI();
    const { annualGain, daysRecovered } = result;
    
    // Update breakdown panel
    updateBreakdownPanel(result);

    // Enable breakdown now that we have real data
    if (breakdownToggle) breakdownToggle.disabled = false;
    
    // Update scratch content (gain + jours)
    updateScratchContent(result);
    
    // Set flag and reveal scratch card
    roiCalculated = true;
    revealScratchCard();

    console.log(`ROI calculated (scratch only): ${formatCurrency(annualGain)}, ${daysRecovered} days recovered`);
  }
  
  /**
   * Handle input changes (strict mode: re-hide scratch on input change)
   */
  function handleInputChange() {
    if (roiCalculated) {
      // Strict mode: hide scratch card when inputs change
      roiCalculated = false;
      hideScratchCard();
      
      // Reset scratch values (avoid any spoiler)
      if (scratchAnnualGain) scratchAnnualGain.textContent = '—';
      if (scratchDaysValue) scratchDaysValue.textContent = '—';
      if (scratchFallbackGain) scratchFallbackGain.textContent = '—';
      if (scratchFallbackDays) scratchFallbackDays.textContent = '—';
      
      // Collapse breakdown panel
      if (breakdownToggle && breakdownPanel) {
        breakdownToggle.disabled = true;
        breakdownToggle.setAttribute('aria-expanded', 'false');
        breakdownPanel.setAttribute('hidden', '');
      }

      // Ensure fallback is hidden again (in case it was shown)
      if (scratchFallback) scratchFallback.setAttribute('hidden', '');
    }
  }
  
  // Initialize breakdown toggle
  initBreakdownToggle();
  
  // Bind form submission
  form.addEventListener('submit', handleROICalculation);
  
  // Bind input change listeners (strict mode)
  allInputs.forEach(input => {
    input.addEventListener('change', handleInputChange);
    input.addEventListener('input', handleInputChange);
  });
  
  // Ensure scratch card is hidden on load
  hideScratchCard();
  
  console.log('ROI Calculator initialized');
}

/**
 * Gère l'effet hover sur le ROI (legacy, kept for compatibility)
 */
function initROIInteraction() {
  const roi = document.getElementById('roi-stat');
  
  if (!roi) return;

  // Effet hover
  roi.addEventListener('mouseenter', () => {
    if (roi.dataset.calculated === 'true') {
      roi.classList.add('is-active');
    }
  });

  roi.addEventListener('mouseleave', () => {
    roi.classList.remove('is-active');
  });
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
// SCRATCH REVEAL MODULE
// ==========================================================================

let scratchInstance = null;

/**
 * Scratch Reveal class for interactive scratch-to-reveal effect
 */
class ScratchReveal {
  constructor(container, options = {}) {
    this.container = container;
    this.canvas = container.querySelector('#scratch-canvas');
    this.content = container.querySelector('#scratchContent');
    this.overlayText = container.querySelector('#scratch-overlay-text');
    this.resetBtn = document.querySelector('#scratchReset');
    
    if (!this.canvas || !this.content) {
      console.warn('Scratch canvas or content not found');
      return;
    }
    
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    
    // Configuration
    this.brushSize = options.brushSize || 40;
    this.revealThreshold = options.revealThreshold || 0.5; // 50% scratched to fully reveal
    this.scratchColor = options.scratchColor || '#1C2A64'; // Navy blue (dark Ocean)
    this.scratchColorAlt = options.scratchColorAlt || '#243272'; // Lighter navy
    
    this.isDrawing = false;
    this.scratchedPixels = 0;
    this.totalPixels = 0;
    this.isRevealed = false;
    
    this.init();
  }
  
  /**
   * Initialize the scratch canvas
   */
  init() {
    // Always start in "not revealed" state
    this.container?.classList.remove('is-revealed');
    this.setupCanvas();
    this.fillScratchLayer();
    this.bindEvents();
    
    console.log('Scratch Reveal initialized');
  }
  
  /**
   * Setup canvas dimensions
   */
  setupCanvas() {
    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    
    // Reset transform to avoid cumulative scaling on re-init/resize
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    
    this.totalPixels = this.canvas.width * this.canvas.height;
    
    // Responsive brush size
    this.brushSize = Math.max(30, Math.min(60, rect.width / 8));
  }
  
  /**
   * Fill the scratch layer with gradient pattern
   */
  fillScratchLayer() {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    
    // Create gradient background (Dark Ocean theme)
    const gradient = this.ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, this.scratchColor);
    gradient.addColorStop(0.5, this.scratchColorAlt);
    gradient.addColorStop(1, this.scratchColor);
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);
    
    // Add subtle noise pattern
    this.addNoisePattern(width, height);
    
    // Add instruction text
    this.addInstructionText(width, height);
  }
  
  /**
   * Add subtle noise pattern to scratch layer
   */
  addNoisePattern(width, height) {
    const imageData = this.ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 15;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    
    this.ctx.putImageData(imageData, 0, 0);
  }
  
  /**
   * Add instruction text to scratch layer
   */
  addInstructionText(width, height) {
    this.ctx.fillStyle = 'rgba(102, 241, 209, 0.3)';
    this.ctx.font = `bold ${Math.max(14, width / 15)}px Inter, sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    // Draw subtle pattern text
    for (let y = 30; y < height; y += 60) {
      for (let x = 40; x < width; x += 120) {
        this.ctx.fillText('?', x + (y % 60), y);
      }
    }
  }
  
  /**
   * Bind mouse and touch events
   */
  bindEvents() {
    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.stopDrawing());
    this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
    
    // Touch events
    this.canvas.addEventListener('touchstart', (e) => this.startDrawing(e), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => this.draw(e), { passive: false });
    this.canvas.addEventListener('touchend', () => this.stopDrawing());
    this.canvas.addEventListener('touchcancel', () => this.stopDrawing());
    
    // Reset button
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.reset());
    }
    
    // Resize handler
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        if (!this.isRevealed) {
          this.setupCanvas();
          this.fillScratchLayer();
        }
      }, 250);
    });
  }
  
  /**
   * Get coordinates from mouse or touch event
   */
  getCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    let x, y;
    
    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    return { x, y };
  }
  
  /**
   * Start drawing/scratching
   */
  startDrawing(e) {
    if (this.isRevealed) return;
    
    e.preventDefault();
    this.isDrawing = true;
    
    // Hide overlay text on first scratch
    if (this.overlayText && !this.overlayText.classList.contains('hidden')) {
      this.overlayText.classList.add('hidden');
    }
    
    const { x, y } = this.getCoords(e);
    this.scratch(x, y);
  }
  
  /**
   * Draw/scratch while moving
   */
  draw(e) {
    if (!this.isDrawing || this.isRevealed) return;
    
    e.preventDefault();
    const { x, y } = this.getCoords(e);
    this.scratch(x, y);
  }
  
  /**
   * Stop drawing/scratching
   */
  stopDrawing() {
    this.isDrawing = false;
    this.checkRevealThreshold();
  }
  
  /**
   * Scratch at given position
   */
  scratch(x, y) {
    this.ctx.globalCompositeOperation = 'destination-out';
    
    // Create radial gradient for soft brush
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, this.brushSize);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.brushSize, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.globalCompositeOperation = 'source-over';
  }
  
  /**
   * Check if enough has been scratched to reveal
   */
  checkRevealThreshold() {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    
    let transparentPixels = 0;
    
    // Count transparent pixels (alpha < 128)
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) {
        transparentPixels++;
      }
    }
    
    const scratchedPercent = transparentPixels / (this.canvas.width * this.canvas.height);
    
    if (scratchedPercent >= this.revealThreshold) {
      this.reveal();
    }
  }
  
  /**
   * Fully reveal the content
   */
  reveal() {
    if (this.isRevealed) return;
    
    this.isRevealed = true;

    // Mark container as revealed (used by CSS to unhide content)
    this.container?.classList.add('is-revealed');

    // Mark container as revealed (CSS controls visibility of the hidden content)
    this.container?.classList.add('is-revealed');
    
    // Fade out canvas
    this.canvas.style.transition = 'opacity 500ms ease';
    this.canvas.style.opacity = '0';
    
    // Show reset button
    if (this.resetBtn) {
      this.resetBtn.classList.add('visible');
    }
    
    // Announce to screen readers
    if (this.content) {
      this.content.setAttribute('aria-live', 'polite');
    }
    
    console.log('Scratch content revealed');
  }
  
  /**
   * Reset the scratch card
   */
  reset() {
    this.isRevealed = false;
    this.scratchedPixels = 0;

    // Back to hidden content state
    this.container?.classList.remove('is-revealed');
    
    // Reset canvas
    this.canvas.style.transition = 'none';
    this.canvas.style.opacity = '1';
    
    // Refill scratch layer
    this.fillScratchLayer();
    
    // Show overlay text again
    if (this.overlayText) {
      this.overlayText.classList.remove('hidden');
    }
    
    // Hide reset button
    if (this.resetBtn) {
      this.resetBtn.classList.remove('visible');
    }
    
    console.log('Scratch card reset');
  }
  
  /**
   * Destroy the scratch instance
   */
  destroy() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    // Remove event listeners would go here if needed
    this.canvas = null;
    this.ctx = null;
  }
}

/**
 * Initialize the scratch reveal module
 * Note: Only initializes if the scratch card is visible (not hidden)
 */
function initScratchReveal() {
  const scratchCard = document.getElementById('scratch-card');
  const container = document.getElementById('scratchContainer');
  
  if (!container) {
    return;
  }
  
  // Don't initialize if card is hidden
  if (scratchCard && scratchCard.hasAttribute('hidden')) {
    console.log('Scratch reveal: deferred initialization (card hidden)');
    return;
  }
  
  // Skip for reduced motion
  if (prefersReducedMotion()) {
    // Show fallback content directly
    const canvas = container.querySelector('#scratch-canvas');
    const overlayText = container.querySelector('#scratch-overlay-text');
    const fallback = document.getElementById('scratch-fallback');
    
    if (canvas) canvas.style.display = 'none';
    if (overlayText) overlayText.style.display = 'none';
    if (fallback) fallback.removeAttribute('hidden');
    
    console.log('Scratch reveal: reduced motion mode (fallback shown)');
    return;
  }
  
  // Destroy existing instance
  if (scratchInstance) {
    scratchInstance.destroy();
  }
  
  scratchInstance = new ScratchReveal(container, {
    brushSize: 45,
    revealThreshold: 0.45, // 45% scratched to reveal
    scratchColor: '#1C2A64', // Navy blue
    scratchColorAlt: '#243272' // Lighter navy
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
  
  if (scratchInstance) {
    scratchInstance.destroy();
    scratchInstance = null;
  }
  
  if (scrollDrivenStepperInstance) {
    scrollDrivenStepperInstance.destroy();
    scrollDrivenStepperInstance = null;
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
  initROICalculator();
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
  initScrollDrivenStepper();
  
  // Advantages toggle (mobile)
  initAdvantagesToggle();
  
  // Scratch reveal module
  initScratchReveal();
  
  // Event handlers
  initVisibilityHandling();
  initResizeHandling();

  // Log pour confirmer que le script est chargé
  console.log('Alpha No_Code - Script v5.3 chargé avec succès');
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
