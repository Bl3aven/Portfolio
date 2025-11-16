document.addEventListener("DOMContentLoaded", () => {
  // AOS init
  if (window.AOS) {
    AOS.init({
      once: true,
      duration: 600,
      easing: "ease-out-quart",
    });
  }

  // Intro overlay (type Palmer)
  const overlay = document.getElementById("intro-overlay");
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (overlay) {
    if (prefersReduced) {
      overlay.classList.add("hidden");
    } else {
      setTimeout(() => {
        overlay.classList.add("hidden");
      }, 800);
    }
  }

  // Typing effect (simple)
  const typingEl = document.getElementById("typing-text");
  const fullText =
    "DevOps & Full-Stack • Automatisation • Sécurité • Cloud privé";
  if (typingEl && !prefersReduced) {
    typingEl.textContent = "";
    let idx = 0;
    const type = () => {
      if (idx <= fullText.length) {
        typingEl.textContent = fullText.slice(0, idx);
        idx++;
        setTimeout(type, 30);
      }
    };
    type();
  }

  // Skills pills
  const skills = [
    "Flask",
    "Node.js",
    "Nginx",
    "Docker",
    "Ansible",
    "Nutanix",
    "GLPI",
    "phpIPAM",
    "Discord Bots",
    "RCON Squad",
    "Linux",
    "Self-hosting",
  ];
  const pillsContainer = document.getElementById("skills-pills");
  if (pillsContainer) {
    skills.forEach((s, i) => {
      const span = document.createElement("span");
      span.className = "pill";
      span.style.opacity = "0";
      span.textContent = s;
      pillsContainer.appendChild(span);
      setTimeout(() => {
        span.style.transition = "opacity 0.4s ease-out, transform 0.4s ease-out";
        span.style.opacity = "1";
        span.style.transform = "translateY(0)";
      }, 80 * i);
    });
  }

  // Splide for featured projects
  if (window.Splide) {
    const el = document.getElementById("featured-projects");
    if (el) {
      new Splide(el, {
        type: "loop",
        perPage: 2,
        gap: "1.25rem",
        autoplay: true,
        breakpoints: {
          768: {
            perPage: 1,
          },
        },
      }).mount();
    }
  }

  // Footer year
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }
});
