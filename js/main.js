
/* ===================================
   LIQUID GLYPH / 001
   Organic ripple interference
=================================== */

const canvas = document.getElementById("liquidCanvas");

if (canvas) {
  const ctx = canvas.getContext("2d");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let size = 300;
  let time = 0;
  let frameId = null;
  let disturbance = 0;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    size = rect.width;

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw() {
    const center = size / 2;
    const radius = size * 0.47;

    ctx.clearRect(0, 0, size, size);

    // Subtle atmospheric glow
    const glow = ctx.createRadialGradient(
      center, center, 0,
      center, center, radius
    );

    glow.addColorStop(0, "rgba(198,221,240,0.17)");
    glow.addColorStop(1, "rgba(198,221,240,0)");

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);

    // Draw irregular, interacting wavefronts
    const rings = 17;
    const points = 240;

    for (let i = 0; i < rings; i++) {
      const phase = (i / rings + time * 0.035) % 1;

      // Each ring travels outward and regenerates
      const baseRadius = 8 + phase * radius;

      const fadeIn = Math.min(1, phase * 8);
      const fadeOut = Math.min(1, (1 - phase) * 5);
      const opacity = fadeIn * fadeOut;

      ctx.beginPath();

      for (let j = 0; j <= points; j++) {
        const angle = (j / points) * Math.PI * 2;

        // Several interacting oscillations
        const wave1 = Math.sin(
          angle * 7 + time * 0.9 + i * 0.5
        ) * 3.5;

        const wave2 = Math.sin(
          angle * 13 - time * 1.2 + i
        ) * 2.2;

        const wave3 = Math.cos(
          angle * 4 + time * 0.5
        ) * 5;

        const interference =
          (wave1 + wave2 + wave3) *
          (0.3 + phase * 0.7);

        const r = baseRadius + interference + disturbance;

        const x = center + Math.cos(angle) * r;
        const y = center + Math.sin(angle) * r;

        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.closePath();

      
      // Soft Atomic Tangerine glow
      ctx.strokeStyle = `rgba(255,107,53,${opacity * 0.65})`;
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 9;
      ctx.shadowColor = "#FF6B35";
      ctx.stroke();

      // Sharp Electric Royal highlights
      ctx.strokeStyle = `rgba(2,8,135,${opacity * 0.75})`;
      ctx.lineWidth = 0.8;
      ctx.shadowBlur = 0;
      ctx.stroke();

    }

    // Small central disturbance
    ctx.beginPath();
    ctx.arc(center, center, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#C6DDF0";
    ctx.fill();

    disturbance *= 0.94;
  }

  function animate() {
    time += 0.016;
    draw();

    if (!reducedMotion.matches) {
      frameId = requestAnimationFrame(animate);
    }
  }

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const distance = Math.hypot(
      x - size / 2,
      y - size / 2
    );

    disturbance = Math.sin(distance * 0.1) * 5;
  });

  canvas.addEventListener("pointerleave", () => {
    disturbance = 0;
  });

  function updateMotion() {
    cancelAnimationFrame(frameId);
    frameId = null;
    draw();

    if (!reducedMotion.matches) {
      frameId = requestAnimationFrame(animate);
    }
  }

  resizeCanvas();
  updateMotion();

  window.addEventListener("resize", () => {
    resizeCanvas();
    draw();
  });

  reducedMotion.addEventListener("change", updateMotion);
}
