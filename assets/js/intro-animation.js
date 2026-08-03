/**
 * ============================================================================
 * INTRO PARTICLE REVEAL ANIMATION
 * Canvas particle scatter, travel, and assembly intro animation.
 * Features an Eagle in Flight silhouette with particle assembly.
 * Compatible with both file:// protocol and http:// server environments.
 * ============================================================================
 */

(function () {
  function initIntroAnimation(onCompleteCallback) {
    var introContainer = document.getElementById('intro-container');
    var canvas = document.getElementById('intro-canvas');

    if (!introContainer || !canvas) {
      if (onCompleteCallback) onCompleteCallback();
      return;
    }

    var utils = window.PortfolioUtils || {};
    var lerp = utils.lerp || function (a, b, t) { return a + (b - a) * t; };
    var clamp = utils.clamp || function (v, min, max) { return Math.min(Math.max(v, min), max); };
    var easeOutCubic = utils.easeOutCubic || function (t) { return 1 - Math.pow(1 - t, 3); };

    var ctx = canvas.getContext('2d');
    var width = (canvas.width = window.innerWidth);
    var height = (canvas.height = window.innerHeight);

    var handleResize = function () {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Offscreen canvas to render target Eagle graphic
    var offscreen = document.createElement('canvas');
    var offscreenCtx = offscreen.getContext('2d');
    var graphicSize = Math.floor(Math.min(width, height) * 0.38);
    if (graphicSize < 140) graphicSize = 140;
    offscreen.width = graphicSize;
    offscreen.height = graphicSize;

    drawIntroGraphic(offscreenCtx, graphicSize);

    var imageData = offscreenCtx.getImageData(0, 0, graphicSize, graphicSize);
    var data = imageData.data;
    var imgWidth = imageData.width;
    var particleTargets = [];
    var step = 4;

    var offsetX = (width - graphicSize) / 2;
    var offsetY = (height - graphicSize) / 2;

    for (var y = 0; y < graphicSize; y += step) {
      for (var x = 0; x < graphicSize; x += step) {
        var index = (y * imgWidth + x) * 4;
        var alpha = data[index + 3];
        if (alpha > 128) {
          particleTargets.push({
            targetX: offsetX + x,
            targetY: offsetY + y,
            color: 'rgba(' + data[index] + ', ' + data[index + 1] + ', ' + data[index + 2] + ', ' + (alpha / 255) + ')'
          });
        }
      }
    }

    var particles = particleTargets.map(function (pt) {
      var angle = Math.random() * Math.PI * 2;
      var distance = Math.random() * Math.max(width, height) * 0.8 + 200;
      return {
        x: width / 2 + Math.cos(angle) * distance,
        y: height / 2 + Math.sin(angle) * distance,
        startX: width / 2 + Math.cos(angle) * distance,
        startY: height / 2 + Math.sin(angle) * distance,
        targetX: pt.targetX,
        targetY: pt.targetY,
        color: '#FFFFFF',
        size: Math.random() * 2 + 1.2,
        delay: Math.random() * 0.4
      };
    });

    var duration = 2800;
    var startTime = performance.now();
    var animationFrameId;

    function render(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      if (progress > 0.4 && progress < 0.95) {
        var auraAlpha = (progress - 0.4) * 0.4;
        var grad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, graphicSize);
        grad.addColorStop(0, 'rgba(255, 255, 255, ' + (auraAlpha * 0.15) + ')');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      particles.forEach(function (p) {
        var pProgress = clamp((progress - p.delay) / (1 - p.delay), 0, 1);
        var easeP = easeOutCubic(pProgress);

        p.x = lerp(p.startX, p.targetX, easeP);
        p.y = lerp(p.startY, p.targetY, easeP);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        setTimeout(function () {
          introContainer.classList.add('fade-out');

          window.removeEventListener('resize', handleResize);
          cancelAnimationFrame(animationFrameId);

          if (onCompleteCallback) onCompleteCallback();
        }, 300);
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  function drawIntroGraphic(ctx, size) {
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#FFFFFF';
    var s = size / 100;

    // ------------------------------------------------------------------------
    // 1. MAJESTIC EAGLE IN FLIGHT SILHOUETTE (Spread wings, feathers, head, beak, tail)
    // ------------------------------------------------------------------------
    ctx.beginPath();

    // Head & Beak facing left-forward
    ctx.moveTo(50 * s, 18 * s);
    ctx.lineTo(46 * s, 19 * s);
    ctx.lineTo(41 * s, 23 * s); // Beak tip
    ctx.lineTo(45 * s, 26 * s); // Under beak
    ctx.lineTo(46 * s, 29 * s); // Neck left

    // --- LEFT WING (Spreading out & up with feather tips) ---
    ctx.quadraticCurveTo(32 * s, 22 * s, 14 * s, 16 * s);
    ctx.lineTo(8 * s, 14 * s);    // Primary Feather Tip 1 (Top Left)
    ctx.lineTo(16 * s, 23 * s);   // Feather Notch 1
    ctx.lineTo(11 * s, 26 * s);   // Primary Feather Tip 2
    ctx.lineTo(20 * s, 32 * s);   // Feather Notch 2
    ctx.lineTo(16 * s, 36 * s);   // Feather Tip 3
    ctx.lineTo(25 * s, 42 * s);   // Feather Notch 3
    ctx.lineTo(22 * s, 46 * s);   // Feather Tip 4
    ctx.lineTo(31 * s, 50 * s);   // Lower Wing Edge
    ctx.quadraticCurveTo(38 * s, 55 * s, 43 * s, 60 * s); // Wing base to Body left

    // --- LOWER BODY & FAN TAIL ---
    ctx.lineTo(41 * s, 68 * s);   // Left Hip
    ctx.lineTo(32 * s, 85 * s);   // Outer Left Tail Feather Tip
    ctx.lineTo(41 * s, 80 * s);   // Tail Notch 1
    ctx.lineTo(45 * s, 89 * s);   // Inner Left Tail Feather Tip
    ctx.lineTo(50 * s, 84 * s);   // Center Tail Notch
    ctx.lineTo(55 * s, 89 * s);   // Inner Right Tail Feather Tip
    ctx.lineTo(59 * s, 80 * s);   // Tail Notch 2
    ctx.lineTo(68 * s, 85 * s);   // Outer Right Tail Feather Tip
    ctx.lineTo(59 * s, 68 * s);   // Right Hip

    // --- RIGHT WING (Symmetric Mirror) ---
    ctx.lineTo(57 * s, 60 * s);   // Body right to Wing base
    ctx.quadraticCurveTo(62 * s, 55 * s, 69 * s, 50 * s); // Lower Wing Edge right
    ctx.lineTo(78 * s, 46 * s);   // Feather Tip 4
    ctx.lineTo(75 * s, 42 * s);   // Feather Notch 3
    ctx.lineTo(84 * s, 36 * s);   // Feather Tip 3
    ctx.lineTo(80 * s, 32 * s);   // Feather Notch 2
    ctx.lineTo(89 * s, 26 * s);   // Feather Tip 2
    ctx.lineTo(84 * s, 23 * s);   // Feather Notch 1
    ctx.lineTo(92 * s, 14 * s);   // Primary Feather Tip 1 (Top Right)
    ctx.quadraticCurveTo(68 * s, 22 * s, 54 * s, 29 * s); // Wing top curve back to Neck right

    // Back to Head Crown
    ctx.lineTo(55 * s, 22 * s);
    ctx.lineTo(50 * s, 18 * s);
    ctx.closePath();
    ctx.fill();

    // ------------------------------------------------------------------------
    // 2. SOLID INNER WING CORES & CHEST (Dense particle body)
    // ------------------------------------------------------------------------
    // Central Chest Core
    ctx.beginPath();
    ctx.arc(50 * s, 44 * s, 14 * s, 0, Math.PI * 2);
    ctx.fill();

    // Left Wing Upper Core
    ctx.beginPath();
    ctx.moveTo(46 * s, 29 * s);
    ctx.quadraticCurveTo(28 * s, 24 * s, 16 * s, 20 * s);
    ctx.quadraticCurveTo(28 * s, 38 * s, 44 * s, 46 * s);
    ctx.closePath();
    ctx.fill();

    // Right Wing Upper Core
    ctx.beginPath();
    ctx.moveTo(54 * s, 29 * s);
    ctx.quadraticCurveTo(72 * s, 24 * s, 84 * s, 20 * s);
    ctx.quadraticCurveTo(72 * s, 38 * s, 56 * s, 46 * s);
    ctx.closePath();
    ctx.fill();

    // ------------------------------------------------------------------------
    // 3. AURA / SPARKLE STARS & DOTS (Floating around eagle)
    // ------------------------------------------------------------------------
    var stars = [
      { x: 50, y: 7, outer: 3.5, inner: 1.4 },  // Crown Star above head
      { x: 6, y: 8, outer: 3.0, inner: 1.2 },  // Left Wingtip Star
      { x: 94, y: 8, outer: 3.0, inner: 1.2 },  // Right Wingtip Star
      { x: 20, y: 62, outer: 2.5, inner: 1.0 },  // Lower Left Aura Star
      { x: 80, y: 62, outer: 2.5, inner: 1.0 }   // Lower Right Aura Star
    ];

    stars.forEach(function (st) {
      drawStar(ctx, st.x * s, st.y * s, st.outer * s, st.inner * s);
    });

    var dots = [
      { x: 28, y: 10, r: 1.8 },
      { x: 72, y: 10, r: 1.8 },
      { x: 10, y: 28, r: 1.6 },
      { x: 90, y: 28, r: 1.6 },
      { x: 35, y: 92, r: 1.8 },
      { x: 65, y: 92, r: 1.8 },
      { x: 50, y: 95, r: 2.0 }
    ];

    dots.forEach(function (d) {
      ctx.beginPath();
      ctx.arc(d.x * s, d.y * s, d.r * s, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawStar(ctx, cx, cy, outerRadius, innerRadius) {
    ctx.beginPath();
    for (var i = 0; i < 8; i++) {
      var r = (i % 2 === 0) ? outerRadius : innerRadius;
      var a = (i * Math.PI) / 4 - Math.PI / 2;
      var x = cx + Math.cos(a) * r;
      var y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  window.initIntroAnimation = initIntroAnimation;
})();
