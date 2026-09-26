// Lightweight, zero-dependency celebration confetti particle burst for BlitzCount / ZählFix

export function launchConfetti(canvasElement, durationMs = 3500) {
  if (!canvasElement) return;

  const ctx = canvasElement.getContext('2d');
  if (!ctx) return;

  const width = canvasElement.width = window.innerWidth;
  const height = canvasElement.height = window.innerHeight;

  const colors = ['#FF4081', '#FFEB3B', '#00E676', '#00B0FF', '#FF9100', '#E040FB', '#FFD700'];
  const confettiCount = 120;
  const particles = [];

  for (let i = 0; i < confettiCount; i++) {
    particles.push({
      x: width / 2 + (Math.random() * 80 - 40),
      y: height * 0.45 + (Math.random() * 40 - 20),
      w: Math.random() * 12 + 6,
      h: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.8) * 18,
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 12,
      gravity: 0.35,
      drag: 0.96,
      alpha: 1
    });
  }

  const startTime = Date.now();
  let animationFrameId;

  function render() {
    const elapsed = Date.now() - startTime;
    ctx.clearRect(0, 0, width, height);

    let aliveCount = 0;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.rotation += p.vRotation;

      if (elapsed > durationMs - 1000) {
        p.alpha = Math.max(0, (durationMs - elapsed) / 1000);
      }

      if (p.alpha > 0 && p.y < height + 20) {
        aliveCount++;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    }

    if (elapsed < durationMs && aliveCount > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  }

  render();

  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    ctx.clearRect(0, 0, width, height);
  };
}
