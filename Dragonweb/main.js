// ============================================
//   DRACONIS — Main JavaScript
// ============================================

(function() {
  'use strict';

  // ===== LOADER =====
  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loaderFill');
  let progress = 0;

  const loadInterval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      loaderFill.style.width = '100%';
      clearInterval(loadInterval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initAll();
      }, 600);
    } else {
      loaderFill.style.width = progress + '%';
    }
  }, 120);

  document.body.style.overflow = 'hidden';

  // ===== CUSTOM CURSOR =====
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursorTrail');
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    setTimeout(() => {
      trail.style.left = mouseX + 'px';
      trail.style.top = mouseY + 'px';
    }, 80);
  });

  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1.6)';
    cursor.style.background = 'rgba(255,102,0,0.3)';
  });
  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.background = 'transparent';
  });

  // Cursor hover effects
  document.querySelectorAll('a, button, .culture-card, .myth-card, .tab-btn, .poly-stage, .species-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2)';
      cursor.style.borderColor = '#ffaa00';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursor.style.borderColor = '#ff6600';
    });
  });

  // ===== STAR FIELD =====
  function createStars() {
    const starField = document.createElement('div');
    starField.className = 'star-field';
    document.body.appendChild(starField);
    for (let i = 0; i < 120; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2 + 0.5;
      star.style.cssText = `
        width:${size}px;height:${size}px;
        left:${Math.random()*100}%;top:${Math.random()*100}%;
        --dur:${2+Math.random()*4}s;--delay:${Math.random()*5}s;
        --max-op:${0.3+Math.random()*0.4};
        opacity:0.1;
      `;
      starField.appendChild(star);
    }
  }

  // ===== NAVIGATION =====
  function initNav() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });

    navToggle.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'fixed';
      navLinks.style.top = '70px';
      navLinks.style.right = '24px';
      navLinks.style.background = 'rgba(5,2,10,0.97)';
      navLinks.style.padding = '20px 32px';
      navLinks.style.border = '1px solid rgba(200,169,110,0.2)';
      navLinks.style.gap = '16px';
    });

    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        if (navLinks.style.display === 'flex' && window.innerWidth < 768) {
          navLinks.style.display = 'none';
        }
      });
    });
  }

  // ===== SCROLL REVEAL =====
  function initScrollReveal() {
    const toReveal = document.querySelectorAll(
      '.culture-card, .species-card, .evo-card, .myth-card, .poly-step, .science-box, .section-header'
    );

    toReveal.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    toReveal.forEach(el => observer.observe(el));
  }

  // ===== DNA BARS ANIMATION =====
  function initDNABars() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.culture-card').forEach(card => observer.observe(card));
  }

  // ===== TABS =====
  function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        document.getElementById('tab-' + tab).classList.add('active');
      });
    });
  }

  // ===== POLYMORPHISM SKELETON SWITCHER =====
  function initPolymorphism() {
    const stages = document.querySelectorAll('.poly-stage');
    const panels = document.querySelectorAll('.skeleton-panel');

    stages.forEach(stage => {
      stage.addEventListener('click', () => {
        const target = stage.dataset.poly;
        stages.forEach(s => s.classList.remove('active'));
        stage.classList.add('active');
        panels.forEach(p => {
          p.classList.remove('active');
          if (p.id === 'skel-' + target) p.classList.add('active');
        });
        // Glow color based on form
        const colors = { dragon: '#c8a96e', transition: '#ff8844', human: '#4488ff' };
        document.documentElement.style.setProperty('--poly-glow', colors[target] || '#c8a96e');
      });
    });
  }

  // ===== SCROLL-BASED DRAGON FIRE =====
  function initScrollFire() {
    const fireStreams = document.querySelectorAll('.fire-stream');
    let lastScroll = 0;
    let fireActive = false;
    let fireTimeout;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScroll;
      lastScroll = currentScroll;

      if (Math.abs(delta) > 5) {
        if (!fireActive) {
          fireActive = true;
          fireStreams.forEach(stream => {
            stream.style.opacity = '1';
            stream.style.strokeDashoffset = '0';
          });
        }
        clearTimeout(fireTimeout);
        fireTimeout = setTimeout(() => {
          fireActive = false;
          fireStreams.forEach(stream => {
            stream.style.opacity = '0';
          });
        }, 500);
      }
    });
  }

  // ===== EMBER PARTICLES =====
  function createEmbers() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    for (let i = 0; i < 20; i++) {
      const ember = document.createElement('div');
      ember.className = 'ember-particle';
      ember.style.cssText = `
        left: ${Math.random() * 60 + 20}%;
        bottom: 20%;
        --dur: ${1.5 + Math.random() * 2}s;
        --delay: ${Math.random() * 3}s;
        background: hsl(${20 + Math.random() * 30}, 100%, ${50 + Math.random() * 30}%);
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        opacity: 0;
      `;
      hero.appendChild(ember);
    }
  }

  // ===== SECTION BACKGROUND PARALLAX =====
  function initParallax() {
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const offset = (scrollY - sectionTop) * 0.15;
        if (Math.abs(scrollY - sectionTop) < window.innerHeight * 1.5) {
          section.style.backgroundPositionY = `${offset}px`;
        }
      });
    });
  }

  // ===== DRAGON SVG GLOW ON SCROLL =====
  function initDragonGlow() {
    const dragonSvg = document.querySelector('#heroSvgDragon');
    if (!dragonSvg) return;
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const intensity = Math.min(scrolled / 300, 1);
      dragonSvg.style.filter = `drop-shadow(0 0 ${30 + intensity * 50}px rgba(200,100,0,${0.3 + intensity * 0.5}))`;
    });
  }

  // ===== MOUSE PARALLAX HERO =====
  function initMouseParallax() {
    const dragonContainer = document.getElementById('scrollDragon');
    const heroContent = document.querySelector('.hero-content');
    if (!dragonContainer) return;

    document.querySelector('.hero').addEventListener('mousemove', (e) => {
      const rect = document.querySelector('.hero').getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;

      dragonContainer.style.transform = `translateY(${20 + yPct * 20}px) translateX(${xPct * 15}px) rotate(${yPct * -2}deg)`;
      if (heroContent) {
        heroContent.style.transform = `translateX(${xPct * -8}px) translateY(${yPct * -5}px)`;
      }
    });
  }

  // ===== CULTURE CARD 3D TILT =====
  function initCardTilt() {
    document.querySelectorAll('.culture-card, .myth-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) rotateX(${yPct * -6}deg) rotateY(${xPct * 6}deg)`;
        card.style.transformStyle = 'preserve-3d';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transformStyle = '';
      });
    });
  }

  // ===== INIT ALL =====
  function initAll() {
    createStars();
    initNav();
    initScrollReveal();
    initDNABars();
    initTabs();
    initPolymorphism();
    initScrollFire();
    createEmbers();
    initDragonGlow();
    initMouseParallax();
    initCardTilt();
  }

})();
