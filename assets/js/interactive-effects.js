/**
 * ============================================================================
 * INTERACTIVE EFFECTS
 * 3D Card Tilt, Magnetic Pull Buttons, Marquee Hover Control, Split-Text Reveal,
 * and Case Study Modal Controller.
 * Controlled for viewports > 768px and non-reduced-motion settings.
 * ============================================================================
 */

(function () {
  'use strict';

  var projectDetails = {
    gladiance: {
      title: "Gladiance (Smart Home IoT Automation)",
      company: "Velocetech Insights • Jul 2025 – Present",
      problem: "Modern smart environments require real-time control over diverse IoT hardware (lighting, climate, motor curtains, entertainment) with instant status feedback across concurrent mobile clients.",
      role: "Owned Flutter UI development, SignalR WebSocket integration for live device telemetry, mood controls, and scheduled automation rules.",
      architecture: "Flutter 3.x, Provider State Management, SignalR Realtime Sockets, REST API Integration, MVC Pattern, Device Status Caching.",
      outcome: "Shipped a responsive, low-latency mobile application capable of controlling smart home endpoints with live state updates."
    },
    asha: {
      title: "Asha (Government Health-Worker Platform)",
      company: "Velocetech Insights • Jul 2025 – Present",
      problem: "Healthcare workers operating in rural field environments need high-reliability tools for population registers and child/maternal health tracking under zero/low network coverage.",
      role: "Engineered complex form validation engines, offline-first SQLite database architecture, and background transport-layer synchronization.",
      architecture: "Flutter, SQLite Local Database, Provider State Management, Background Queue Sync, Multi-step Form Validation, REST APIs.",
      outcome: "Empowered health workers to record hundreds of patient encounters offline with automatic background sync upon internet reconnect."
    },
    attendance: {
      title: "Workforce QR Attendance & Geolocation",
      company: "CNC • Apr 2025 – Jul 2025",
      problem: "Companies required a tamper-proof employee attendance system to eliminate proxy check-ins and verify physical workplace presence.",
      role: "Developed camera-based QR scanning module, session-based authentication flow, and background geolocation verification.",
      architecture: "Flutter, QR Code Scanner, Geolocation & Background Tracking API, Session Token Security, REST APIs.",
      outcome: "Successfully deployed employee check-in/out tracking with verified GPS coordinates and anti-spoofing session security."
    },
    identity: {
      title: "Hotel Guest Identity Verification System",
      company: "IlikaIT • Oct 2024 – Apr 2025",
      problem: "Hospitality providers require automated guest identity verification to prevent impersonation and validate government IDs during check-in.",
      role: "Built document capture pipeline using device camera, facial liveness check interface, and identity verification API communication.",
      architecture: "Flutter, Custom Camera Controller, Facial Recognition Liveness Check Integration, Document OCR, REST APIs.",
      outcome: "Delivered high-accuracy guest document scanning and liveness verification, streamlining hotel check-in compliance."
    }
  };

  function initInteractiveEffects() {
    var isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = window.innerWidth <= 768;

    // 1. Split-text blur-to-focus load animation for Hero Title
    initSplitText();

    // 2. Case Study Modal Controller (Works on all viewports)
    initProjectModals();

    if (isReducedMotion || isMobile) return;

    // 3. 3D Tilt Effect on Project Cards
    init3DTilt();

    // 4. Magnetic CTA Button Effect
    initMagneticButtons();

    // 5. Interactive Drag-to-Scroll for Skills Tracks
    initSkillsScrollDrag();
  }

  function initSplitText() {
    var splitElements = document.querySelectorAll('.split-text-reveal');
    splitElements.forEach(function (el) {
      if (el.dataset.splitDone) return;
      var text = el.textContent.trim();
      el.textContent = '';
      
      var words = text.split(' ');
      words.forEach(function (word, wIdx) {
        var wordSpan = document.createElement('span');
        wordSpan.className = 'word-span';
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';

        for (var i = 0; i < word.length; i++) {
          var charSpan = document.createElement('span');
          charSpan.className = 'char-span';
          charSpan.textContent = word[i];
          charSpan.style.display = 'inline-block';
          charSpan.style.animationDelay = (wIdx * 120 + i * 35 + 150) + 'ms';
          wordSpan.appendChild(charSpan);
        }

        el.appendChild(wordSpan);
        if (wIdx < words.length - 1) {
          el.appendChild(document.createTextNode(' '));
        }
      });

      // Enable animation class
      el.classList.add('split-ready');
      el.dataset.splitDone = 'true';

      // Robust fail-safe timeout: Ensures text is 100% visible on all devices
      setTimeout(function () {
        el.classList.add('split-complete');
      }, 1200);
    });
  }

  function initProjectModals() {
    var cards = document.querySelectorAll('.project-card[data-project]');
    var modal = document.getElementById('project-modal');
    if (!modal) return;

    var modalCloseBtn = modal.querySelector('.modal-close-btn');
    var modalBackdrop = modal.querySelector('.modal-backdrop');

    cards.forEach(function (card) {
      function triggerModal(e) {
        e.preventDefault();
        var key = card.getAttribute('data-project');
        if (key && projectDetails[key]) {
          openModal(projectDetails[key]);
        }
      }

      card.addEventListener('click', triggerModal);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          triggerModal(e);
        }
      });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    function openModal(data) {
      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-company').textContent = data.company;
      document.getElementById('modal-problem').textContent = data.problem;
      document.getElementById('modal-role').textContent = data.role;
      document.getElementById('modal-architecture').textContent = data.architecture;
      document.getElementById('modal-outcome').textContent = data.outcome;

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (window.lenis) window.lenis.stop();
    }

    function closeModal() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      if (window.lenis) window.lenis.start();
    }
  }

  function init3DTilt() {
    var cards = document.querySelectorAll('.project-card, .tilt-card');

    cards.forEach(function (card) {
      var imageInner = card.querySelector('.project-image, .project-cover-vector, .tilt-inner');

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = -((y - centerY) / centerY) * 6; // Restrained tilt 6deg max
        var rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateZ(6px)';

        if (imageInner) {
          var imgTranslateX = ((x - centerX) / centerX) * -6;
          var imgTranslateY = ((y - centerY) / centerY) * -6;
          imageInner.style.transform = 'scale(1.04) translate(' + imgTranslateX.toFixed(2) + 'px, ' + imgTranslateY.toFixed(2) + 'px)';
        }
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        card.style.transition = 'transform 0.5s var(--ease-out-smooth)';
        if (imageInner) {
          imageInner.style.transform = 'scale(1) translate(0px, 0px)';
          imageInner.style.transition = 'transform 0.5s var(--ease-out-smooth)';
        }
      });

      card.addEventListener('mouseenter', function () {
        card.style.transition = 'none';
        if (imageInner) imageInner.style.transition = 'none';
      });
    });
  }

  function initMagneticButtons() {
    var magneticBtns = document.querySelectorAll('.magnetic-btn, .nav-cta, .contact-email-btn');

    magneticBtns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;

        var deltaX = e.clientX - centerX;
        var deltaY = e.clientY - centerY;

        var pullX = deltaX * 0.22;
        var pullY = deltaY * 0.22;

        btn.style.transform = 'translate(' + pullX.toFixed(2) + 'px, ' + pullY.toFixed(2) + 'px)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translate(0px, 0px)';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      });

      btn.addEventListener('mouseenter', function () {
        btn.style.transition = 'none';
      });
    });
  }

  function initSkillsScrollDrag() {
    var tracks = document.querySelectorAll('.skills-scroll-track');

    tracks.forEach(function (track) {
      var isDown = false;
      var startX;
      var scrollLeft;

      track.addEventListener('mousedown', function (e) {
        isDown = true;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
      });

      track.addEventListener('mouseleave', function () {
        isDown = false;
      });

      track.addEventListener('mouseup', function () {
        isDown = false;
      });

      track.addEventListener('mousemove', function (e) {
        if (!isDown) return;
        e.preventDefault();
        var x = e.pageX - track.offsetLeft;
        var walk = (x - startX) * 2;
        track.scrollLeft = scrollLeft - walk;
      });

      track.addEventListener('wheel', function (e) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          track.scrollLeft += e.deltaY;
        }
      }, { passive: true });
    });
  }

  window.initInteractiveEffects = initInteractiveEffects;
})();
