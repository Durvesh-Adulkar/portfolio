/**
 * ============================================================================
 * SCROLL REVEAL OBSERVER
 * Uses IntersectionObserver for hardware-accelerated scroll animations.
 * Compatible with both file:// protocol and http:// server environments.
 * ============================================================================
 */

(function () {
  'use strict';

  function initScrollReveal() {
    var isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = window.innerWidth <= 768;

    // 1. Animated Metric Counters
    initCounters();

    // 2. SVG Timeline Drawing
    initSVGTimeline();

    // Check GSAP availability
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !isReducedMotion && !isMobile) {
      initGSAPScrollTrigger();
    } else {
      initIntersectionObserver(isReducedMotion);
    }
  }

  function initGSAPScrollTrigger() {
    gsap.registerPlugin(ScrollTrigger);

    // Staggered reveal for project cards
    var projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length) {
      gsap.fromTo(projectCards, 
        { y: 50, opacity: 0, scale: 0.92 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#projects',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Hero Section Parallax Layer
    var heroComposition = document.querySelector('.hero-3d-composition');
    if (heroComposition) {
      gsap.to(heroComposition, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Timeline Items Scroll Reveal
    var timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(function (item) {
      gsap.fromTo(item,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            onEnter: function() { item.classList.add('active'); }
          }
        }
      );
    });

    // General Reveal elements fallback
    var generalReveals = document.querySelectorAll('.reveal:not(.project-card)');
    generalReveals.forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%'
          }
        }
      );
    });
  }

  function initSVGTimeline() {
    var svgPath = document.querySelector('.timeline-svg-path-draw');
    var timelineContainer = document.querySelector('.timeline');

    if (!svgPath || !timelineContainer) return;

    var pathLength = svgPath.getTotalLength ? svgPath.getTotalLength() : 1000;
    svgPath.style.strokeDasharray = pathLength;
    svgPath.style.strokeDashoffset = pathLength;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.to(svgPath, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: timelineContainer,
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: 0.5
        }
      });
    } else {
      window.addEventListener('scroll', function () {
        var rect = timelineContainer.getBoundingClientRect();
        var windowHeight = window.innerHeight;
        var progress = (windowHeight - rect.top) / (rect.height + windowHeight * 0.5);
        progress = Math.max(0, Math.min(1, progress));
        svgPath.style.strokeDashoffset = pathLength * (1 - progress);
      }, { passive: true });
    }
  }

  function initCounters() {
    var counters = document.querySelectorAll('.metric-number[data-target]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-target'), 10) || 0;
          var suffix = el.getAttribute('data-suffix') || '';
          var duration = 1500;
          var start = 0;
          var startTime = null;

          function step(currentTime) {
            if (!startTime) startTime = currentTime;
            var progress = Math.min((currentTime - startTime) / duration, 1);
            var value = Math.floor(progress * target);
            el.textContent = value + suffix;
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = target + suffix;
            }
          }

          requestAnimationFrame(step);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { observer.observe(c); });
  }

  function initIntersectionObserver(isReducedMotion) {
    var revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    if (isReducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.05
    };

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(function (el) { observer.observe(el); });
  }

  window.initScrollReveal = initScrollReveal;
})();
