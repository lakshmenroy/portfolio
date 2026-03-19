/* =========================================
   MAIN.JS – Lakshmen Roy Portfolio
   ========================================= */
'use strict';

/* ── Utility ───────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

/* ── Particle Canvas ───────────────────── */
(function initParticles() {
  const canvas = $('#particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], raf;
  const rand = (a, b) => a + Math.random() * (b - a);

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkParticle() {
    return {
      x: rand(0, W), y: rand(0, H),
      r: rand(1, 2.2),
      dx: rand(-0.25, 0.25), dy: rand(-0.25, 0.25),
      alpha: rand(0.08, 0.45),
      rgb: Math.random() > 0.5 ? '29,78,216' : '220,38,38'
    };
  }

  function drawLines() {
    const n = particles.length;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(29,78,216,${0.06 * (1 - d / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.rgb},${p.alpha})`;
      ctx.fill();
    });
    raf = requestAnimationFrame(tick);
  }

  function init() {
    resize();
    particles = Array.from({ length: 90 }, mkParticle);
    cancelAnimationFrame(raf);
    tick();
  }

  window.addEventListener('resize', resize);
  init();
})();

/* ── Resume PDF detection ──────────────── */
// No redirect needed – resume.pdf exists. Just log if missing in dev.
(function checkResume() {
  fetch('resume.pdf', { method: 'HEAD' })
    .catch(() => console.warn('resume.pdf not found – add it to the portfolio root.'));
})();

/* ── Profile photo detection ───────────── */
(function checkPhoto() {
  const img = new Image();
  img.onload = () => {
    const wrap = $('#avatar-wrap');
    const icon = $('#avatar-icon');
    if (!wrap) return;
    if (icon) icon.remove();
    const el = document.createElement('img');
    el.src = 'assets/photo.jpg';
    el.alt = 'Laksh Menroy';
    el.className = 'avatar-photo';
    wrap.appendChild(el);
  };
  img.src = 'assets/photo.jpg';
})();

/* ── Navbar ────────────────────────────── */
const navbar   = $('#navbar');
const navLinks = $$('.nav-link');
const sections = $$('section[id]');
const backTop  = $('#back-to-top');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  navbar.classList.toggle('scrolled', y > 40);

  // Hide navbar on scroll-down on mobile for more screen real-estate
  if (window.innerWidth < 769) {
    navbar.style.transform = (y > lastScroll && y > 200) ? 'translateY(-100%)' : 'translateY(0)';
  }
  lastScroll = y;

  // Active nav link
  let current = '';
  sections.forEach(s => { if (y >= s.offsetTop - 130) current = s.id; });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));

  // Back-to-top
  if (backTop) backTop.classList.toggle('visible', y > 500);
}, { passive: true });

window.addEventListener('resize', () => {
  if (window.innerWidth >= 769) navbar.style.transform = 'translateY(0)';
});

/* ── Hamburger menu ────────────────────── */
const hamburger  = $('#hamburger');
const navLinksEl = $('#nav-links');

on(hamburger, 'click', () => {
  const open = hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

on(navLinksEl, 'click', e => {
  if (e.target.closest('a')) {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    document.body.style.overflow = '';
  }
});

document.addEventListener('click', e => {
  if (navLinksEl && navLinksEl.classList.contains('open') &&
      !e.target.closest('#nav-links') &&
      !e.target.closest('#hamburger')) {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ── Back to top ───────────────────────── */
on(backTop, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Smooth anchor scroll ──────────────── */
$$('a[href^="#"]').forEach(a => {
  on(a, 'click', e => {
    const target = $(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ── Typed text animation ──────────────── */
const phrases = [
  'AI / ML Engineer',
  'Computer Vision Specialist',
  'Edge AI Developer',
  'Kubernetes & Cloud Expert',
  'Robotics Enthusiast',
  'Building Smarter Cities 🌆'
];
let pIdx = 0, cIdx = 0, deleting = false;
const typedEl = $('#typed');

function typeWrite() {
  if (!typedEl) return;
  const phrase = phrases[pIdx];
  deleting ? cIdx-- : cIdx++;
  typedEl.textContent = phrase.slice(0, cIdx);
  let delay = deleting ? 45 : 85;
  if (!deleting && cIdx === phrase.length) { delay = 2200; deleting = true; }
  else if (deleting && cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; delay = 350; }
  setTimeout(typeWrite, delay);
}
typeWrite();

/* ── Counter animation (eased) ─────────── */
function animateCount(el) {
  const target = +el.dataset.count;
  const duration = 1400;
  const start = performance.now();
  (function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  })(start);
}

/* ── Intersection Observer helpers ─────── */
function observer(cb, opts = {}) {
  return new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => { if (entry.isIntersecting) cb(entry.target, obs); });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px', ...opts });
}

/* ── Wire all observers on DOM ready ───── */
document.addEventListener('DOMContentLoaded', () => {

  /* Section headers fade in */
  const hdrObs = observer((el, obs) => {
    el.style.opacity = '1'; el.style.transform = 'translateY(0)'; obs.unobserve(el);
  }, { threshold: 0.1 });
  $$('.section-header').forEach(el => {
    Object.assign(el.style, { opacity: '0', transform: 'translateY(24px)', transition: 'all .65s cubic-bezier(.4,0,.2,1)' });
    hdrObs.observe(el);
  });

  /* Timeline items slide in */
  const tlObs = observer((el, obs) => { el.classList.add('visible'); obs.unobserve(el); }, { threshold: 0.08 });
  $$('.timeline-item').forEach(el => tlObs.observe(el));

  /* Skill bars animate */
  const skillObs = observer((el, obs) => {
    $$('.skill-fill', el).forEach(f => { f.style.width = f.dataset.width + '%'; });
    obs.unobserve(el);
  }, { threshold: 0.2 });
  $$('.skill-category-card').forEach(el => skillObs.observe(el));

  /* Hero counters */
  const cntObs = observer((el, obs) => { $$('[data-count]', el).forEach(animateCount); obs.unobserve(el); }, { threshold: 0.4 });
  $$('.hero-stats').forEach(el => cntObs.observe(el));

  /* Staggered card/pill fade-up */
  const fuObs = observer((el, obs) => { el.classList.add('visible'); obs.unobserve(el); });
  $$('.about-mini-card,.edu-card,.cert-card,.project-card,.update-card,.contact-card,.soft-skill-pill,.highlight-item').forEach((el, i) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${(i % 5) * 0.07}s`;
    fuObs.observe(el);
  });

});

/* ── Contact form – Formspree AJAX ──────── */
const form        = $('#contact-form');
const formSuccess = $('#form-success');

on(form, 'submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    if (res.ok) {
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = 'linear-gradient(135deg,#059669,#10b981)';
      formSuccess && formSuccess.classList.remove('hidden');
      form.reset();
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        btn.style.background = '';
        btn.disabled = false;
        formSuccess && formSuccess.classList.add('hidden');
      }, 5000);
    } else {
      throw new Error();
    }
  } catch {
    btn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed – try LinkedIn';
    btn.style.background = 'linear-gradient(135deg,#dc2626,#ef4444)';
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  }
});

/* ── Global animation keyframe injection ── */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  #navbar { transition: transform .3s ease, background .3s ease, box-shadow .3s ease; }
`;
document.head.appendChild(style);

/* ── Dev signature ──────────────────────── */
console.log('%c LM. ', 'background:linear-gradient(135deg,#1d4ed8,#dc2626);color:#fff;font-size:18px;font-weight:900;padding:4px 10px;border-radius:6px;');
console.log('%cLaksh Menroy | AI/ML Engineer | github.com/lakshmenroy', 'color:#94a3b8;font-size:11px;');
