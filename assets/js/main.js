/**
 * ============================================================================
 * MAIN ENTRY POINT
 * Coordinates all portfolio modules and design systems.
 * Compatible with both file:// protocol and http:// server environments.
 * ============================================================================
 */

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // 1. Initialize Lenis Inertia Scroll & GSAP ScrollTrigger
    if (typeof window.initLenisAndGSAP === 'function') {
      window.initLenisAndGSAP();
    }

    // 2. Initialize Ambient Background Mesh Layer
    if (typeof window.initBackgroundMesh === 'function') {
      window.initBackgroundMesh();
    }

    // 3. Initialize Navigation & Liquid Glass Observers
    if (typeof window.initNavigation === 'function') {
      window.initNavigation();
    }

    // 4. Initialize Interactive Effects (3D Tilt, Magnetic Buttons, Split Text)
    if (typeof window.initInteractiveEffects === 'function') {
      window.initInteractiveEffects();
    }

    // 5. Initialize Intro Particle Reveal & Scroll Reveal
    if (typeof window.initIntroAnimation === 'function') {
      window.initIntroAnimation(function () {
        if (typeof window.initScrollReveal === 'function') {
          window.initScrollReveal();
        }
      });
    } else {
      if (typeof window.initScrollReveal === 'function') {
        window.initScrollReveal();
      }
    }

    // Replay intro feature button (for testing/demoing)
    var replayBtn = document.getElementById('replay-intro-btn');
    if (replayBtn) {
      replayBtn.addEventListener('click', function (e) {
        e.preventDefault();
        try {
          sessionStorage.removeItem('portfolio_intro_seen');
        } catch (err) {}
        window.location.reload();
      });
    }
  });
})();
