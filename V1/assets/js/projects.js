(() => {
  // --- Données projets (exemples) ---
  const projects = [
    {
      id:'bastion',
      title:'Bastion web outils internes',
      desc:'Hub d’outils via Flask, authentification, UI sobre.',
      tags:['flask','devops'],
      href:'/projects.html#bastion',
      images:['/assets/img/projects/bastion-1.webp','/assets/img/projects/bastion-2.webp']
    },
    {
      id:'nutanix',
      title:'Fabrique de VMs Nutanix',
      desc:'GLPI → Nutanix + allocation IP via phpIPAM, logs détaillés.',
      tags:['devops','nutanix'],
      href:'/projects.html#nutanix',
      images:['/assets/img/projects/nutanix-1.webp','/assets/img/projects/nutanix-2.webp']
    },
    {
      id:'squad',
      title:'Admin serveur Squad',
      desc:'Bot Discord + RCON : vue équipes, logs temps réel, actions admin.',
      tags:['discord','flask'],
      href:'/projects.html#squad',
      images:['/assets/img/projects/squad-1.webp','/assets/img/projects/squad-2.webp']
    }
  ];

  const grid = document.getElementById('grid');
  const search = document.getElementById('search');
  const sortSel = document.getElementById('sort');
  const filters = [...document.querySelectorAll('.filter')];

  function render(list){
    grid.innerHTML = '';
    list.forEach(p=>{
      const card = document.createElement('div');
      card.className = 'col-md-6 col-lg-4';
      card.innerHTML = `
        <article class="liquid-bubble p-3 h-100 d-flex flex-column">
          <h3 class="h5 text-led">${p.title}</h3>
          <p class="text-light-600 flex-grow-1">${p.desc}</p>
          <div class="d-flex flex-wrap gap-2 mb-3">
            ${p.tags.map(t=>`<span class="pill">${t}</span>`).join('')}
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-cyan btn-sm preview" data-id="${p.id}">
              <i class="bi bi-eye"></i> Aperçu
            </button>
            <a class="btn btn-neon btn-sm" href="${p.href}">
              <i class="bi bi-box-arrow-up-right"></i> Ouvrir
            </a>
          </div>
        </article>`;
      grid.appendChild(card);
    });
  }

  function apply(){
    const q = (search.value || '').toLowerCase().trim();
    const active = document.querySelector('.filter.active')?.dataset.tag || 'all';
    let list = projects.filter(p => {
      const matchTag = active==='all' || p.tags.includes(active);
      const matchQ = !q || p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
      return matchTag && matchQ;
    });
    const mode = sortSel.value;
    if (mode==='alpha') list.sort((a,b)=>a.title.localeCompare(b.title));
    else list = list.slice().reverse(); // recent = derniers d'abord (exemple simple)
    render(list);
  }

  filters.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      filters.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      apply();
    });
  });
  search.addEventListener('input', apply);
  sortSel.addEventListener('change', apply);

  // Modale
  const modal = new bootstrap.Modal('#previewModal');
  grid.addEventListener('click', (e)=>{
    const b = e.target.closest('.preview');
    if(!b) return;
    const p = projects.find(x=>x.id===b.dataset.id);
    if(!p) return;

    document.getElementById('previewTitle').textContent = p.title;
    document.getElementById('previewDesc').textContent = p.desc;
    const link = document.getElementById('previewLink');
    link.href = p.href;

    const wrap = document.getElementById('previewCarousel');
    wrap.innerHTML = `
      <div class="splide__track">
        <ul class="splide__list">
          ${p.images.map(src=>`<li class="splide__slide"><img class="img-fluid rounded-3" src="${src}" alt=""></li>`).join('')}
        </ul>
      </div>`;
    const sp = new Splide('#previewCarousel', { type:'loop', gap:'12px', pagination:true, arrows:true });
    sp.mount();

    modal.show();
  });

  // première peinture
  apply();
})();
