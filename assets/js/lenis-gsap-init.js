/**
 * ============================================================================
 * LENIS & GSAP INITIALIZATION
 * Inertia-based smooth scrolling linked with GSAP ScrollTrigger.
 * Executed on viewports > 768px when prefers-reduced-motion is not active.
 * ============================================================================
 */

(function () {
  'use strict';

  function initLenisAndGSAP() {
    var isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = window.innerWidth <= 768;

    // Check if GSAP and ScrollTrigger are available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    if (isReducedMotion || isMobile || typeof Lenis === 'undefined') {
      // Lenis disabled for small mobile or reduced motion preferences
      document.documentElement.classList.add('no-lenis');
      return;
    }

    try {
      var lenis = new Lenis({
        duration: 1.2,
        easing: function (t) {
          return Math.min(1, 1.001 - Math.pow(2, -10 * t));
        },
        direction: 'vertical',
        gestureDirection: 'vertical',
        smoothTouch: false,
        touchMultiplier: 1.5,
        infinite: false
      });

      window.lenis = lenis;

      // Link Lenis scroll to GSAP ScrollTrigger
      if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add(function (time) {
          lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }

      document.documentElement.classList.add('has-lenis');
    } catch (e) {
      console.warn('Lenis smooth scroll initialization skipped:', e);
    }
  }

  window.initLenisAndGSAP = initLenisAndGSAP;
})();
