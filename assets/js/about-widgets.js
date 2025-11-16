document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) {
    AOS.init({
      once: true,
      duration: 600,
    });
  }

  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  const grid = document.getElementById("ig-grid");
  if (!grid) return;

  fetch("/api/instagram?limit=6")
    .then((r) => r.json())
    .then((data) => {
      if (!data.ok || !Array.isArray(data.feed) || data.feed.length === 0) {
        grid.innerHTML =
          '<div class="text-muted small text-center">Aucune publication à afficher pour l’instant.</div>';
        return;
      }
      grid.innerHTML = "";
      data.feed.forEach((item) => {
        const div = document.createElement("a");
        div.href = item.link;
        div.target = "_blank";
        div.rel = "noreferrer";
        div.className = "ig-item";
        div.innerHTML = `
          <img src="${item.url}" alt="Publication Instagram" loading="lazy" />
          <div class="ig-item-overlay">
            <span>${new Date(item.ts).toLocaleDateString("fr-FR")}</span>
          </div>
        `;
        grid.appendChild(div);
      });
    })
    .catch((err) => {
      console.error(err);
      grid.innerHTML =
        '<div class="text-muted small text-center">Impossible de charger le flux Instagram.</div>';
    });
});
