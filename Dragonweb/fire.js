// ============================================
//   DRACONIS — Fire Canvas Animation
//   Real particle fire system for hero bg
// ============================================

(function() {
  'use strict';

  const canvas = document.getElementById('fireCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  let particles = [];
  let frameCount = 0;
  let scrollIntensity = 0;
  let isScrolling = false;
  let scrollTimer;
  let lastScrollY = 0;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  window.addEventListener('scroll', () => {
    const delta = Math.abs(window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;
    scrollIntensity = Math.min(delta * 0.04, 1);
    isScrolling = true;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      isScrolling = false;
      scrollIntensity = 0;
    }, 400);
  });

  // ===== FIRE PARTICLE CLASS =====
  class FireParticle {
    constructor(x, y, type = 'base') {
      this.reset(x, y, type);
    }

    reset(x, y, type) {
      this.type = type;
      this.x = x + (Math.random() - 0.5) * 60;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = -(Math.random() * 3 + 1.5);
      this.life = 0;
      this.maxLife = Math.random() * 80 + 60;
      this.size = Math.random() * 18 + 8;
      this.initialSize = this.size;
      this.hue = Math.random() * 30 + 10; // 10-40 (red-orange-yellow)
      this.sat = 100;
      this.lit = 50 + Math.random() * 20;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.08 + 0.02;
    }

    update() {
      this.life++;
      this.wobble += this.wobbleSpeed;
      const progress = this.life / this.maxLife;

      this.x += this.vx + Math.sin(this.wobble) * 0.8;
      this.y += this.vy;
      this.vy *= 0.985;
      this.vx *= 0.97;

      // Rise acceleration
      if (progress < 0.3) this.vy -= 0.04;

      // Size shrinks as it rises
      this.size = this.initialSize * (1 - progress * 0.7);

      // Hue shifts to yellow/white at top
      this.hue = 10 + progress * 40;
      this.lit = 50 + progress * 35;

      return this.life < this.maxLife && this.size > 0.5;
    }

    draw(ctx) {
      const progress = this.life / this.maxLife;
      const alpha = progress < 0.1 ? progress * 10 : progress > 0.7 ? (1 - progress) / 0.3 : 1;

      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size
      );
      gradient.addColorStop(0, `hsla(${this.hue + 20}, ${this.sat}%, ${this.lit + 20}%, ${alpha})`);
      gradient.addColorStop(0.4, `hsla(${this.hue}, ${this.sat}%, ${this.lit}%, ${alpha * 0.8})`);
      gradient.addColorStop(1, `hsla(${this.hue - 10}, ${this.sat}%, 30%, 0)`);

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    }
  }

  // ===== EMBER CLASS =====
  class Ember {
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 80;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 3;
      this.vy = -(Math.random() * 5 + 3);
      this.life = 0;
      this.maxLife = Math.random() * 120 + 80;
      this.size = Math.random() * 3 + 1;
      this.hue = Math.random() * 30 + 15;
    }

    update() {
      this.life++;
      this.x += this.vx + (Math.random() - 0.5) * 0.5;
      this.y += this.vy;
      this.vy *= 0.99;
      this.vy += (Math.random() - 0.5) * 0.1;
      this.vx += (Math.random() - 0.5) * 0.15;
      return this.life < this.maxLife;
    }

    draw(ctx) {
      const progress = this.life / this.maxLife;
      const alpha = (1 - progress) * 0.9;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * (1 - progress * 0.5), 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, ${60 + progress * 20}%, ${alpha})`;
      ctx.fill();
      ctx.restore();
    }
  }

  // ===== SMOKE CLASS =====
  class Smoke {
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 40;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = -(Math.random() * 1 + 0.5);
      this.life = 0;
      this.maxLife = Math.random() * 200 + 100;
      this.size = Math.random() * 30 + 15;
      this.rotation = Math.random() * Math.PI * 2;
    }

    update() {
      this.life++;
      this.x += this.vx;
      this.y += this.vy;
      this.vx += (Math.random() - 0.5) * 0.05;
      this.size += 0.3;
      this.rotation += 0.005;
      return this.life < this.maxLife;
    }

    draw(ctx) {
      const progress = this.life / this.maxLife;
      const alpha = progress < 0.1 ? 0 : (1 - progress) * 0.06;
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
      grad.addColorStop(0, `rgba(40,20,60,${alpha})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }
  }

  // ===== FIRE SOURCE POINTS =====
  const fireSources = [
    { x: 0.5, y: 1.05, intensity: 1.0, type: 'main' },      // center bottom
    { x: 0.3, y: 1.1, intensity: 0.5, type: 'secondary' },  // left
    { x: 0.7, y: 1.1, intensity: 0.5, type: 'secondary' },  // right
    { x: 0.15, y: 1.15, intensity: 0.25, type: 'accent' },  // far left
    { x: 0.85, y: 1.15, intensity: 0.25, type: 'accent' },  // far right
  ];

  // ===== SPAWN PARTICLES =====
  function spawnParticles() {
    const baseRate = 3;
    const scrollBoost = isScrolling ? scrollIntensity * 8 : 0;
    const totalRate = baseRate + scrollBoost;

    fireSources.forEach(source => {
      const count = Math.ceil(totalRate * source.intensity);
      for (let i = 0; i < count; i++) {
        if (Math.random() < 0.85) {
          particles.push({
            type: 'fire',
            obj: new FireParticle(source.x * W, source.y * H)
          });
        }
        if (Math.random() < 0.15) {
          particles.push({
            type: 'ember',
            obj: new Ember(source.x * W, source.y * H)
          });
        }
        if (Math.random() < 0.05) {
          particles.push({
            type: 'smoke',
            obj: new Smoke(source.x * W, source.y * H - 20)
          });
        }
      }
    });

    // Limit particle count
    const maxParticles = 600;
    if (particles.length > maxParticles) {
      particles.splice(0, particles.length - maxParticles);
    }
  }

  // ===== DRAW GROUND GLOW =====
  function drawGroundGlow() {
    const time = frameCount * 0.02;
    const pulse = 0.8 + Math.sin(time) * 0.2;

    const glow = ctx.createRadialGradient(
      W * 0.5, H,
      0,
      W * 0.5, H,
      W * 0.6
    );
    glow.addColorStop(0, `rgba(255, 80, 0, ${0.18 * pulse})`);
    glow.addColorStop(0.3, `rgba(180, 40, 0, ${0.08 * pulse})`);
    glow.addColorStop(0.7, `rgba(80, 10, 0, ${0.03 * pulse})`);
    glow.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.save();
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  // ===== DRAW SCROLL BURST =====
  function drawScrollBurst() {
    if (scrollIntensity <= 0) return;
    const burstX = W * 0.5;
    const burstY = H;
    const burst = ctx.createRadialGradient(burstX, burstY, 0, burstX, burstY, W * 0.4 * scrollIntensity);
    burst.addColorStop(0, `rgba(255,200,0,${scrollIntensity * 0.3})`);
    burst.addColorStop(0.5, `rgba(255,80,0,${scrollIntensity * 0.15})`);
    burst.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save();
    ctx.fillStyle = burst;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  // ===== VIGNETTE =====
  function drawVignette() {
    const vignette = ctx.createRadialGradient(W/2, H/2, H * 0.2, W/2, H/2, H);
    vignette.addColorStop(0, 'transparent');
    vignette.addColorStop(1, 'rgba(5, 2, 10, 0.7)');
    ctx.save();
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  // ===== MAIN LOOP =====
  function loop() {
    requestAnimationFrame(loop);
    frameCount++;

    ctx.clearRect(0, 0, W, H);

    drawGroundGlow();
    drawScrollBurst();
    spawnParticles();

    // Sort: smoke first, fire, embers on top
    particles.sort((a, b) => {
      const order = { smoke: 0, fire: 1, ember: 2 };
      return order[a.type] - order[b.type];
    });

    particles = particles.filter(p => {
      const alive = p.obj.update();
      if (alive) p.obj.draw(ctx);
      return alive;
    });

    drawVignette();
  }

  loop();

})();
