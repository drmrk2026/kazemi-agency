// Cinematic motion layer — GSAP + ScrollTrigger (loaded via CDN in each page).
// Respects prefers-reduced-motion throughout.
document.addEventListener('DOMContentLoaded', () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // ---------- 1. preloader curtain (single orchestrated entrance) ----------
  const pre = document.getElementById('preloader');
  if (pre) {
    if (reduced) {
      pre.style.display = 'none';
    } else {
      gsap.to(pre, {
        yPercent: -100, duration: 0.8, ease: 'power3.inOut', delay: 0.35,
        onComplete: () => pre.remove()
      });
    }
  }

  // ---------- 2. staggered reveal for repeating content blocks ----------
  if (!reduced) {
    const groups = [
      '.grid-3 > *', '.grid-2 > *', '.portfolio-grid > *', '.feature-row',
      '.timeline-item', '.article-card', '.price-card', '.dash-stat'
    ];
    groups.forEach(sel => {
      const els = gsap.utils.toArray(sel);
      if (!els.length) return;
      gsap.from(els, {
        opacity: 0, y: 24, duration: 0.6, ease: 'power2.out', stagger: 0.08,
        scrollTrigger: { trigger: els[0].closest('section') || els[0].parentElement, start: 'top 82%' }
      });
    });

    // hero heading + lead, once, on load
    const heroH1 = document.querySelector('.hero h1, .about-hero h1');
    if (heroH1) {
      gsap.from(heroH1, { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out', delay: 0.9 });
    }
    const heroLead = document.querySelector('.hero .lead, .hero .hero-actions');
    if (heroLead) {
      gsap.from(heroLead, { opacity: 0, y: 16, duration: 0.6, ease: 'power2.out', delay: 1.1 });
    }
  }

  // ---------- 3. marquee strip (CSS-driven loop via GSAP for smoothness) ----------
  const track = document.querySelector('.marquee-track');
  if (track && !reduced) {
    const clone = track.cloneNode(true);
    track.parentElement.appendChild(clone);
    gsap.to([track, clone], { xPercent: -100, duration: 22, repeat: -1, ease: 'none' });
  }

  // ---------- 4. magnetic hover on primary buttons (pointer-driven, not autoplay) ----------
  if (!reduced && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.btn-primary, .btn-accent').forEach(btn => {
      btn.classList.add('magnetic');
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(btn, { x: x * 0.2, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'power2.out' }));
    });
  }
});
