window.ChatWidget = (function(){
  const root = document.getElementById('chat-root');
  const state = {
    open:false,
    channelId: localStorage.getItem('mt_chat_channel') || null,
    history:[],              // {id?, me, text, ts}
    seen: new Set(),         // ids déjà rendus
    outboxIds: new Set(),    // ids des messages postés via /api/message
    botName: null,
    timer:null
  };
  const API_BASE = '/api';

  init();  // fetch bot name then render

  async function init(){
    try{
      const r = await fetch(`${API_BASE}/health`);
      const h = await r.json();
      state.botName = h.bot_user || h.user || 'bot';
    }catch{}
    render();
  }

  function el(tag, attrs={}, kids=[]){
    const e = document.createElement(tag); Object.assign(e, attrs);
    kids.forEach(k => e.appendChild(typeof k==='string' ? document.createTextNode(k) : k));
    return e;
  }

  function render(){
    root.innerHTML='';
    const button = el('button',{className:'chat-button',onclick: open},[
      el('i',{className:'bi bi-chat-dots'}),' Discuter'
    ]);
    root.appendChild(button);
    if(!state.open) return;

    const panel = el('div',{className:'chat-panel'});
    const header = el('div',{className:'chat-header'},[
      el('div',{},[
        el('strong',{textContent:'Chat avec Mathys'}),
        el('div',{className:'small-hint'},['Je réponds rapidement 👋'])
      ]),
      el('button',{className:'btn btn-sm btn-outline-cyan',onclick: close},[el('i',{className:'bi bi-x-lg'})])
    ]);

    const body = el('div',{className:'chat-body'});

    // (ré)affiche l'historique proprement
    body.innerHTML='';
    state.history.forEach(m=>body.appendChild(renderMsg(m)));

    const inputWrap = el('div',{className:'chat-input'});
    const input = el('input',{className:'form-control',placeholder:'Écrivez votre message…',autofocus:true});
    const send  = el('button',{className:'btn btn-neon'},[el('i',{className:'bi bi-send'}),' Envoyer']);

    send.addEventListener('click', ()=> sendMsg(input, body));
    input.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); send.click(); }});

    inputWrap.append(input, send);
    panel.append(header, body, inputWrap);
    root.innerHTML=''; root.append(panel);

    if(state.channelId && !state.timer){ state.timer = setInterval(poll, 2500); poll(); }
  }

  function renderMsg(m){
    const wrap = el('div',{className:`msg ${m.me?'me':'bot'}`});
    wrap.appendChild(document.createTextNode(m.text));
    if(m.ts){
      const meta = el('span',{className:'meta'},[
        new Date(m.ts).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
      ]);
      wrap.appendChild(meta);
    }
    return wrap;
  }

  async function sendMsg(input, body){
    const text = input.value.trim(); if(!text) return; input.value='';
    const now = Date.now();

    // affichage immédiat côté client
    const tempId = `local-${now}-${Math.random().toString(36).slice(2,6)}`;
    const model = { id: tempId, me:true, text, ts:now };
    state.history.push(model);
    state.seen.add(tempId);
    body.appendChild(renderMsg(model));
    body.scrollTop = body.scrollHeight;

    try{
      if(!state.channelId){
        // 1er message → création + echo
        const r = await fetch(`${API_BASE}/start-chat`,{
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ firstMessage:text })
        });
        const data = await r.json();
        if(!data.ok) throw new Error('start-chat failed');
        state.channelId = data.channel_id || state.channelId;
        if(state.channelId) localStorage.setItem('mt_chat_channel', state.channelId);
        if(data.echo){
          const echoMsg = { me:false, text:data.echo, ts:Date.now() };
          state.history.push(echoMsg);
          body.appendChild(renderMsg(echoMsg));
        }
        // poll tout de suite
        poll();
        if(!state.timer){ state.timer = setInterval(poll, 2500); }
      }else{
        // envoie au salon existant et mémorise l'id renvoyé
        const r = await fetch(`${API_BASE}/message`,{
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ channel_id: state.channelId, content: text })
        });
        const data = await r.json();
        if(data?.id){ state.outboxIds.add(data.id); }
      }
    }catch(e){
      const err = { me:false, text:"Oups, une erreur est survenue. Réessayez dans un instant.", ts:Date.now() };
      state.history.push(err);
      body.appendChild(renderMsg(err));
    }
  }

  async function poll(){
    if(!state.channelId) return;
    try{
      const res = await fetch(`${API_BASE}/messages?channel_id=${encodeURIComponent(state.channelId)}&limit=50`);
      const data = await res.json();
      const list = Array.isArray(data.messages) ? data.messages.slice() : [];

      // tri asc sur timestamp
      list.sort((a,b)=> new Date(a.timestamp) - new Date(b.timestamp));

      let added=false;
      for(const m of list){
        if(!m.id) continue;
        if(state.seen.has(m.id)) continue;    // déjà rendu

        // si c'est un message qu'on vient d'envoyer via l'API → on le ignore (déjà affiché en "me")
        if(state.outboxIds.has(m.id)){
          state.seen.add(m.id);
          continue;
        }

        // tous les messages de Discord sont "incoming" (bot/agent)
        const model = { id:m.id, me:false, text:m.content, ts: Date.parse(m.timestamp) || Date.now() };
        state.history.push(model);
        state.seen.add(m.id);
        added=true;
      }
      if(added) render();
    }catch(e){ /* silencieux */ }
  }

  function open(){ state.open=true; render(); }
  function close(){ state.open=false; render(); if(state.timer){ clearInterval(state.timer); state.timer=null; } }

  return { open };
})();
    