document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) {
    AOS.init({ once: true, duration: 600 });
  }

  const projects = [
    {
      id: "bastion",
      title: "Bastion web interne (Flask)",
      description:
        "Portail centralisé des outils internes d’Itinsell Cloud, avec authentification, navigation simple et design maintenable.",
      tags: ["flask", "devops", "self-hosting"],
      link: "#",
      images: ["/assets/img/projects/bastion-1.webp"],
      createdAt: "2024-05-01",
    },
    {
      id: "nutanix",
      title: "Fabrique de VMs Nutanix via GLPI",
      description:
        "Application Flask connectée à GLPI et phpIPAM pour déployer automatiquement des VMs Nutanix (clonage de templates, IP fixe, etc.).",
      tags: ["nutanix", "devops", "glpi"],
      link: "#",
      images: ["/assets/img/projects/nutanix-1.webp"],
      createdAt: "2024-04-15",
    },
    {
      id: "squad",
      title: "Administration serveur Squad (Discord + RCON)",
      description:
        "Bot Discord pour visualiser en temps réel les équipes d’un serveur Squad, envoyer des commandes RCON, et suivre les logs interprétés.",
      tags: ["discord", "squad", "bot"],
      link: "#",
      images: ["/assets/img/projects/squad-1.webp"],
      createdAt: "2024-03-10",
    },
  ];

  const filtersContainer = document.getElementById("project-filters");
  const searchInput = document.getElementById("project-search");
  const sortSelect = document.getElementById("project-sort");
  const grid = document.getElementById("project-grid");

  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.tags))
  ).sort();
  let currentFilter = "all";
  let currentSearch = "";
  let currentSort = "recent";

  function buildFilters() {
    if (!filtersContainer) return;
    filtersContainer.innerHTML = "";

    const allButton = document.createElement("button");
    allButton.type = "button";
    allButton.className = "btn btn-sm btn-outline-light rounded-pill me-1 mb-1";
    allButton.dataset.value = "all";
    allButton.textContent = "Tous";
    filtersContainer.appendChild(allButton);

    allTags.forEach((tag) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.value = tag;
      btn.className = "btn btn-sm btn-outline-light rounded-pill me-1 mb-1";
      btn.textContent = tag;
      filtersContainer.appendChild(btn);
    });

    filtersContainer.addEventListener("click", (e) => {
      if (e.target instanceof HTMLButtonElement && e.target.dataset.value) {
        currentFilter = e.target.dataset.value;
        filtersContainer
          .querySelectorAll("button")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        renderProjects();
      }
    });

    allButton.classList.add("active");
  }

  function filterAndSort() {
    let result = projects.slice();

    if (currentFilter !== "all") {
      result = result.filter((p) => p.tags.includes(currentFilter));
    }
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (currentSort === "recent") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (currentSort === "az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (currentSort === "za") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }
    return result;
  }

  function renderProjects() {
    if (!grid) return;
    const list = filterAndSort();
    grid.innerHTML = "";

    if (list.length === 0) {
      grid.innerHTML =
        '<div class="col-12 text-center text-muted small">Aucun projet ne correspond à cette recherche.</div>';
      return;
    }

    list.forEach((p) => {
      const col = document.createElement("div");
      col.className = "col-md-6 col-lg-4";
      col.innerHTML = `
        <div class="card project-card liquid-bubble h-100">
          <div class="card-body d-flex flex-column">
            <h3 class="h6 card-title mb-2">${p.title}</h3>
            <p class="small text-muted flex-grow-1">${p.description}</p>
            <div class="d-flex flex-wrap gap-1 mb-3">
              ${p.tags
                .map(
                  (t) =>
                    `<span class="project-tag">${t}</span>`
                )
                .join("")}
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <button class="btn btn-sm btn-outline-light rounded-pill project-preview-btn" data-id="${
                p.id
              }">
                Aperçu
              </button>
              <a href="${p.link}" class="small text-muted" target="_blank" rel="noreferrer">
                Ouvrir
              </a>
            </div>
          </div>
        </div>
      `;
      grid.appendChild(col);
    });

    bindPreviewButtons();
  }

  function bindPreviewButtons() {
    const buttons = document.querySelectorAll(".project-preview-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = btn.dataset.id;
        const project = projects.find((p) => p.id === id);
        if (!project) return;
        openModal(project);
      });
    });
  }

  let splideModal = null;

  function openModal(project) {
    const modalElement = document.getElementById("projectModal");
    const titleEl = document.getElementById("projectModalLabel");
    const descEl = document.getElementById("projectModalDescription");
    const tagsEl = document.getElementById("projectModalTags");
    const linkEl = document.getElementById("projectModalLink");
    const slidesContainer = document.getElementById("projectModalSlides");

    if (!modalElement || !titleEl || !descEl || !tagsEl || !linkEl || !slidesContainer)
      return;

    titleEl.textContent = project.title;
    descEl.textContent = project.description;
    tagsEl.innerHTML = project.tags
      .map((t) => `<span class="project-tag">${t}</span>`)
      .join("");
    linkEl.href = project.link || "#";

    slidesContainer.innerHTML = "";
    project.images.forEach((src) => {
      const li = document.createElement("li");
      li.className = "splide__slide";
      li.innerHTML = `<img src="${src}" alt="${project.title}" class="img-fluid rounded-3" />`;
      slidesContainer.appendChild(li);
    });

    if (splideModal) {
      splideModal.destroy();
    }
    if (window.Splide) {
      splideModal = new Splide("#projectModalCarousel", {
        type: "loop",
        perPage: 1,
      });
      splideModal.mount();
    }

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  buildFilters();
  renderProjects();

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value;
      renderProjects();
    });
  }
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderProjects();
    });
  }

  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }
});
