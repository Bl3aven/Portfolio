(async function(){
  // Instagram grid
  const el = document.getElementById('ig-grid');
  if (el) {
    try{
      const r = await fetch('/api/instagram?limit=6');
      const data = await r.json();
      if (!data.ok || !Array.isArray(data.feed) || data.feed.length===0) {
        el.innerHTML = '<div class="text-light-600">Aucun contenu pour le moment.</div>';
      } else {
        el.innerHTML = '';
        data.feed.forEach(item=>{
          const a = document.createElement('a');
          a.href = item.link; a.target='_blank'; a.rel='noopener';
          a.className = 'ig-card liquid-bubble';
          a.innerHTML = `
            <div class="ig-thumb" style="background-image:url('${item.url.replace(/'/g,"%27")}')"></div>
            <div class="ig-meta">
              <span class="time">${new Date(item.ts).toLocaleDateString()}</span>
            </div>`;
          el.appendChild(a);
        });
      }
    }catch{ el.innerHTML = '<div class="text-light-600">Erreur de chargement.</div>'; }
  }
})();
