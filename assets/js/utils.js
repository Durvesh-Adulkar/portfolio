/**
 * ============================================================================
 * UTILITY FUNCTIONS & HELPERS
 * High-performance math, interpolation, and animation utilities.
 * Compatible with both file:// protocol and http:// server environments.
 * ============================================================================
 */

(function () {
  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  function debounce(func, wait) {
    if (wait === undefined) wait = 100;
    var timeout;
    return function () {
      var context = this, args = arguments;
      var later = function () {
        clearTimeout(timeout);
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function throttle(func, limit) {
    if (limit === undefined) limit = 16;
    var inThrottle;
    return function () {
      var args = arguments;
      var context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function () { inThrottle = false; }, limit);
      }
    };
  }

  // Export to global window object for universal file:// and http:// support
  window.PortfolioUtils = {
    lerp: lerp,
    clamp: clamp,
    easeOutCubic: easeOutCubic,
    easeOutExpo: easeOutExpo,
    debounce: debounce,
    throttle: throttle
  };
})();
