/**
 * ============================================================================
 * ARTISTIC AMBIENT BACKGROUND MESH
 * Subtle, calm radial lighting movement on Canvas.
 * Compatible with both file:// protocol and http:// server environments.
 * ============================================================================
 */

(function () {
  function initBackgroundMesh() {
    var canvas = document.getElementById('bg-mesh');
    if (!canvas) return;

    var utils = window.PortfolioUtils || {};
    var lerp = utils.lerp || function(a, b, t) { return a + (b - a) * t; };

    var ctx = canvas.getContext('2d');
    var width = (canvas.width = window.innerWidth);
    var height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', function () {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    var mouseX = width / 2;
    var mouseY = height / 2;
    var targetMouseX = mouseX;
    var targetMouseY = mouseY;

    window.addEventListener('mousemove', function (e) {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    });

    var orbs = [
      { x: width * 0.2, y: height * 0.3, radius: 450, vx: 0.15, vy: 0.1, color: 'rgba(255, 255, 255, 0.035)' },
      { x: width * 0.8, y: height * 0.7, radius: 550, vx: -0.12, vy: 0.14, color: 'rgba(200, 200, 200, 0.025)' },
      { x: width * 0.5, y: height * 0.5, radius: 600, vx: 0.08, vy: -0.09, color: 'rgba(180, 180, 180, 0.02)' }
    ];

    function animate() {
      mouseX = lerp(mouseX, targetMouseX, 0.03);
      mouseY = lerp(mouseY, targetMouseY, 0.03);

      var parallaxX = (mouseX - width / 2) * 0.04;
      var parallaxY = (mouseY - height / 2) * 0.04;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      orbs.forEach(function (orb) {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -100 || orb.x > width + 100) orb.vx *= -1;
        if (orb.y < -100 || orb.y > height + 100) orb.vy *= -1;

        var currentX = orb.x + parallaxX;
        var currentY = orb.y + parallaxY;

        var grad = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, orb.radius);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(currentX, currentY, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  window.initBackgroundMesh = initBackgroundMesh;
})();
