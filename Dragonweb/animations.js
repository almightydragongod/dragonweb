// ============================================
//   DRACONIS — Scroll & Visual Animations
// ============================================

(function() {
  'use strict';

  // ===== SCROLL-DRIVEN DRAGON FIRE (SVG) =====
  function initSVGFire() {
    const fireStreams = document.querySelectorAll('.fire-stream');
    let lastScrollY = window.scrollY;
    let isAnimating = false;
    let activeAnimation = null;

    function animateFire(intensity) {
      fireStreams.forEach((stream, i) => {
        stream.style.transition = 'opacity 0.15s';
        stream.style.opacity = String(Math.min(intensity * (1 - i * 0.15), 1));
        stream.style.strokeWidth = String(10 - i * 2.5);
      });
    }

    function clearFire() {
      fireStreams.forEach(stream => {
        stream.style.opacity = '0';
      });
      isAnimating = false;
    }

    let clearTimeout_id = null;

    window.addEventListener('scroll', () => {
      const delta = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;

      const intensity = Math.min(delta / 30, 1);
      if (intensity > 0.05) {
        animateFire(intensity);
        clearTimeout(clearTimeout_id);
        clearTimeout_id = setTimeout(clearFire, 300);
      }
    }, { passive: true });
  }

  // ===== TYPED TEXT EFFECT FOR HERO DESC =====
  function initHeroReveal() {
    // After loader done, reveal hero elements with stagger
    const elems = document.querySelectorAll('.hero-eyebrow, .title-line, .title-sub, .hero-desc, .cta-btn');
    // Already handled by CSS animations - just ensure they're visible
  }

  // ===== SECTION ENTRANCE EFFECTS =====
  function initSectionEffects() {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // Trigger child animations
          const children = entry.target.querySelectorAll('.reveal');
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 80);
          });
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('section').forEach(s => sectionObserver.observe(s));
  }

  // ===== PROGRESS BAR (reading progress) =====
  function initProgressBar() {
    const bar = document.createElement('div');
    bar.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      height: 2px;
      width: 0%;
      background: linear-gradient(90deg, #ff2200, #ff6600, #ffdd00);
      z-index: 9999;
      transition: width 0.1s linear;
      pointer-events: none;
    `;
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      bar.style.width = progress + '%';
    }, { passive: true });
  }

  // ===== GLITCH EFFECT ON TITLE =====
  function initGlitch() {
    const title = document.querySelector('.title-line');
    if (!title) return;

    setInterval(() => {
      if (Math.random() > 0.92) {
        title.style.textShadow = `
          ${(Math.random()-0.5)*6}px 0 rgba(255,0,0,0.7),
          ${(Math.random()-0.5)*6}px 0 rgba(0,200,255,0.7)
        `;
        title.style.transform = `skewX(${(Math.random()-0.5)*3}deg)`;
        setTimeout(() => {
          title.style.textShadow = '';
          title.style.transform = '';
        }, 80);
      }
    }, 2000);
  }

  // ===== FIRE TRAIL ON MOUSE =====
  function initMouseFireTrail() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    let lastX = 0, lastY = 0;

    hero.addEventListener('mousemove', (e) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist > 20) {
        createMouseSpark(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    });

    function createMouseSpark(x, y) {
      const spark = document.createElement('div');
      spark.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${4 + Math.random()*6}px;
        height: ${4 + Math.random()*6}px;
        background: hsl(${10+Math.random()*40},100%,${50+Math.random()*30}%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9997;
        transform: translate(-50%,-50%);
        animation: sparkFade 0.6s ease forwards;
      `;
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 600);
    }

    // Inject spark CSS
    if (!document.getElementById('sparkStyle')) {
      const style = document.createElement('style');
      style.id = 'sparkStyle';
      style.textContent = `
        @keyframes sparkFade {
          0% { transform: translate(-50%,-50%) scale(1); opacity:1; }
          50% { transform: translate(-50%,-50%) scale(1.5) translateY(-10px); opacity:0.8; }
          100% { transform: translate(-50%,-50%) scale(0.2) translateY(-20px); opacity:0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ===== CULTURE CARD DATA ATTRIBUTE COLORS =====
  function initCultureColors() {
    const colorMap = {
      chinese: { primary: '#ff9900', glow: 'rgba(255,150,0,0.3)' },
      indian: { primary: '#aa44ff', glow: 'rgba(170,68,255,0.3)' },
      western: { primary: '#cc2200', glow: 'rgba(200,34,0,0.3)' }
    };
    document.querySelectorAll('.culture-card[data-culture]').forEach(card => {
      const culture = card.dataset.culture;
      const colors = colorMap[culture];
      if (!colors) return;
      const badge = card.querySelector('.card-badge');
      if (badge) badge.style.color = badge.style.borderColor = colors.primary;
      card.addEventListener('mouseenter', () => {
        card.style.boxShadow = `0 0 40px ${colors.glow}`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
      });
    });
  }

  // ===== SMOOTH COUNTER ANIMATION =====
  function animateCounters() {
    // Animate stat numbers if any
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count);
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.round(current);
      }, 16);
    });
  }

  // ===== EVOLUTION TIMELINE ANIMATION =====
  function initEvoTimeline() {
    const evoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const circle = entry.target.querySelector('.evo-circle');
          if (circle) {
            circle.style.boxShadow = '0 0 20px rgba(255,102,0,0.6), inset 0 0 10px rgba(255,102,0,0.2)';
            circle.style.borderColor = '#ffaa00';
          }
          entry.target.classList.add('evo-active');
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.evo-node').forEach(node => evoObserver.observe(node));
  }

  // ===== MYTHICAL CARD TWINKLING STARS =====
  function initMythicalEffects() {
    document.querySelectorAll('.myth-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        const symbol = card.querySelector('.myth-symbol');
        if (symbol) {
          symbol.style.animation = 'dragonFloat 1s ease-in-out infinite';
        }
      });
      card.addEventListener('mouseleave', () => {
        const symbol = card.querySelector('.myth-symbol');
        if (symbol) {
          symbol.style.animation = '';
        }
      });
    });
  }

  // ===== NAV ACTIVE SECTION HIGHLIGHT =====
  function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.style.color = '#c8a96e';
            }
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));
  }

  // ===== INIT =====
  window.addEventListener('load', () => {
    setTimeout(() => {
      initSVGFire();
      initSectionEffects();
      initProgressBar();
      initGlitch();
      initMouseFireTrail();
      initCultureColors();
      initEvoTimeline();
      initMythicalEffects();
      initNavHighlight();
    }, 800);
  });

})();
