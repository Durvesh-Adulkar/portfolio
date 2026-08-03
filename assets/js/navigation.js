/**
 * ============================================================================
 * NAVIGATION & SCROLL TRACKING
 * Desktop floating navbar hide/show on scroll direction,
 * Mobile bottom nav active section tracker, smooth scrolling.
 * Compatible with both file:// protocol and http:// server environments.
 * ============================================================================
 */

(function () {
  function initNavigation() {
    var header = document.querySelector('.site-header');
    var navPill = document.querySelector('.nav-pill');
    var navLinksContainer = document.querySelector('.nav-links');
    var navLinks = document.querySelectorAll('.nav-link');
    var mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    var sections = document.querySelectorAll('section[id]');

    if (!sections.length) return;

    // Create or locate dynamic spring indicator inside nav-links
    var indicator = navLinksContainer ? navLinksContainer.querySelector('.nav-pill-indicator') : null;
    if (navLinksContainer && !indicator) {
      indicator = document.createElement('div');
      indicator.className = 'nav-pill-indicator';
      navLinksContainer.appendChild(indicator);
    }

    var utils = window.PortfolioUtils || {};
    var throttle = utils.throttle || function (fn) { return fn; };

    var lastScrollY = window.scrollY;
    var scrollThreshold = 10;

    var handleHeaderScroll = throttle(function () {
      var currentScrollY = window.scrollY;
      var scrollDelta = currentScrollY - lastScrollY;

      // Liquid glass navbar shrink on scroll down
      if (currentScrollY > 60) {
        header && header.classList.add('scrolled');
      } else {
        header && header.classList.remove('scrolled');
      }

      if (currentScrollY < 80) {
        header && header.classList.remove('header-hidden');
      } else if (scrollDelta > scrollThreshold) {
        header && header.classList.add('header-hidden');
      } else if (scrollDelta < -scrollThreshold) {
        header && header.classList.remove('header-hidden');
      }

      lastScrollY = currentScrollY;
    }, 50);

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    if ('IntersectionObserver' in window) {
      var observerOptions = {
        root: null,
        rootMargin: '-30% 0px -40% 0px',
        threshold: 0
      };

      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            setActiveNavLink(id);
          }
        });
      }, observerOptions);

      sections.forEach(function (section) { sectionObserver.observe(section); });
    }

    function setActiveNavLink(id) {
      var activeLink = null;
      navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href) href = href.replace('#', '');
        if (href === id) {
          link.classList.add('active');
          activeLink = link;
        } else {
          link.classList.remove('active');
        }
      });

      // Update sliding spring indicator position
      if (indicator && activeLink && navLinksContainer) {
        var containerRect = navLinksContainer.getBoundingClientRect();
        var linkRect = activeLink.getBoundingClientRect();

        var leftOffset = linkRect.left - containerRect.left;
        var width = linkRect.width;

        indicator.style.transform = 'translateX(' + leftOffset + 'px)';
        indicator.style.width = width + 'px';
        indicator.style.opacity = '1';
      }

      mobileNavItems.forEach(function (item) {
        var href = item.getAttribute('href');
        if (href) href = href.replace('#', '');
        if (href === id) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        var targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          
          // Recalculate dynamic header offset so section title lands cleanly below floating header
          var headerEl = document.querySelector('.site-header');
          var isMobile = window.innerWidth <= 768;
          var headerOffset = isMobile ? 24 : ((headerEl ? headerEl.offsetHeight : 64) + 32);

          if (window.lenis && typeof window.lenis.scrollTo === 'function') {
            window.lenis.scrollTo(targetElement, { offset: -headerOffset });
          } else {
            var elementPosition = targetElement.getBoundingClientRect().top;
            var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    window.addEventListener('resize', throttle(function () {
      var activeLink = document.querySelector('.nav-link.active');
      if (activeLink) {
        var href = activeLink.getAttribute('href');
        if (href) setActiveNavLink(href.replace('#', ''));
      }
    }, 100));
  }

  window.initNavigation = initNavigation;
})();
