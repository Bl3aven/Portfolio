// home.js — effets légers et performants
(() => {
  // AOS animations
  AOS.init({
    duration: 550,
    easing: 'ease-out',
    once: true,
    offset: 60,
  });

  // Splide carrousel projets (responsive)
  const splide = new Splide('#projects-splide', {
    type: 'loop',
    perPage: 3,
    gap: '16px',
    arrows: true,
    pagination: true,
    breakpoints: {
      992: { perPage: 2 },
      576: { perPage: 1 }
    }
  });
  splide.mount();

  // Typing effect (très léger, sans lib)
  const typedEl = document.getElementById('typed');
  if (typedEl) {
    const full = typedEl.textContent.trim();
    typedEl.textContent = '';
    let i = 0;
    const step = () => {
      typedEl.textContent = full.slice(0, i++);
      if (i <= full.length) requestAnimationFrame(step);
    };
    setTimeout(step, 350);
  }

  // Parallaxe douce du halo de hero
  const hero = document.querySelector('.hero');
  const glow = document.querySelector('.hero-glow');
  if (hero && glow) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      glow.style.setProperty('--gx', (x * 100).toFixed(2) + '%');
      glow.style.setProperty('--gy', (y * 100).toFixed(2) + '%');
    });
  }

  // Stagger sur les "pill" via IntersectionObserver
  const skills = document.querySelectorAll('#skills .pill');
  if (skills.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          skills.forEach((el, idx) => {
            el.style.transition = 'transform .35s ease, box-shadow .35s ease, border-color .35s ease';
            el.style.transform = 'translateY(0)';
            el.style.opacity = '1';
            el.style.transitionDelay = `${idx * 50}ms`;
          });
          io.disconnect();
        }
      });
    }, { threshold: 0.2 });
    skills.forEach(el => {
      el.style.transform = 'translateY(8px)';
      el.style.opacity = '0';
      io.observe(el);
    });
  }
})();
