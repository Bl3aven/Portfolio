// api/server.js — version complète avec logs & création de salon
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const BOT_TOKEN  = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID   = process.env.DISCORD_GUILD_ID;
const CATEGORY_ID= process.env.DISCORD_CATEGORY_ID;
const PORT       = process.env.PORT || 3001;
const ECHO_MESSAGE = process.env.CHAT_ECHO || "Bonjour ! Votre salon privé vient d'être créé. Répondez ici ou directement dans Discord.";

function dlog(...args){ console.log(new Date().toISOString(), ...args); }

function api(url, opts={}){
  return fetch(`https://discord.com/api/v10${url}`, {
    ...opts,
    headers: {
      "Authorization": `Bot ${BOT_TOKEN}`,
      "Content-Type": "application/json",
      ...(opts.headers||{})
    }
  });
}

// Health & debug
app.get("/api/health", async (req,res)=>{
  try{
    const me = await api("/users/@me").then(r=>r.json());
    return res.json({ ok:true, user: me.username || me.id || "unknown", bot_user: me.username || "bot" });
  }catch(e){
    return res.status(500).json({ ok:false });
  }
});

// Créer un salon + 1er message
app.post('/api/start-chat', async (req,res)=>{
  try{
    const { firstMessage } = req.body || {};
    const channelName = `web-${Date.now().toString().slice(-6)}`;

    // 1) Créer le salon dans la catégorie
    const create = await api(`/guilds/${GUILD_ID}/channels`, {
      method:'POST',
      body: JSON.stringify({ name: channelName, type: 0, parent_id: CATEGORY_ID })
    });
    if(!create.ok){
      const txt = await create.text();
      console.error('DISCORD CREATE CHANNEL ERROR', create.status, txt);
      return res.status(500).json({ ok:false, error:'discord_error' });
    }
    const channel = await create.json();

    // 2) Publier UNIQUEMENT le message de l’utilisateur
    if(firstMessage){
      await api(`/channels/${channel.id}/messages`, {
        method:'POST',
        body: JSON.stringify({ content: String(firstMessage) })
      });
    }

    const ECHO = "Bonjour, merci d'avoir pris contact. Je vous répondrai dans quelques instants";
    return res.json({ ok:true, channel_id: channel.id, echo: ECHO });
  }catch(e){
    console.error('START_CHAT_ERROR', e);
    return res.status(500).json({ ok:false, error:'discord_error' });
  }
});


// Envoyer un message dans un salon existant → renvoie l'id du message Discord
app.post("/api/message", async (req,res)=>{
  try{
    const { channel_id, content } = req.body || {};
    const r = await api(`/channels/${channel_id}/messages`, {
      method:"POST",
      body: JSON.stringify({ content: String(content||"") })
    });
    if(!r.ok){
      const t = await r.text();
      console.error("SEND_MESSAGE_ERROR", r.status, t);
      return res.status(500).json({ ok:false });
    }
    const msg = await r.json();
    return res.json({ ok:true, id: msg.id });
  }catch(e){
    console.error("SEND_MESSAGE_ERROR", e);
    return res.status(500).json({ ok:false });
  }
});

// Récupérer les derniers messages (+ timestamp)
app.get("/api/messages", async (req,res)=>{
  try{
    const { channel_id, limit=20 } = req.query;
    const r = await api(`/channels/${channel_id}/messages?limit=${limit}`);
    const arr = await r.json();
    const messages = Array.isArray(arr)
      ? arr.map(m=>({
          id: m.id,
          author: m.author?.username,
          content: m.content,
          timestamp: m.timestamp // ISO
        }))
      : [];
    return res.json({ ok:true, messages });
  }catch(e){
    console.error("GET_MESSAGES_ERROR", e);
    return res.status(500).json({ ok:false, messages:[] });
  }
});


// --- Instagram preview (Basic Display API via backend) ---
app.get('/api/instagram', async (req,res)=>{
  try{
    const token = process.env.IG_BASIC_TOKEN; // long-lived token
    const limit = Number(req.query.limit || 6);
    if(!token) return res.status(500).json({ok:false, error:'missing_token'});

    const u = new URL('https://graph.instagram.com/me/media');
    u.searchParams.set('fields','id,caption,media_url,permalink,thumbnail_url,media_type,timestamp');
    u.searchParams.set('access_token', token);
    u.searchParams.set('limit', String(Math.min(limit, 12)));

    const r = await fetch(u);
    const j = await r.json();
    const items = Array.isArray(j.data) ? j.data : [];

    // on ne garde que images/vidéos affichables
    const feed = items.map(m=>({
      id: m.id,
      type: m.media_type,
      url: m.media_url || m.thumbnail_url,
      link: m.permalink,
      caption: m.caption || '',
      ts: m.timestamp
    })).filter(x=>!!x.url);

    res.json({ok:true, feed});
  }catch(e){
    console.error('IG_FEED_ERROR', e);
    res.status(500).json({ok:false, feed:[]});
  }
});

// Optionnel: servir le site si nécessaire
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "..")));

app.listen(PORT, ()=> dlog(`API ready on :${PORT}`));

// Log d’amorçage pour vérifier le token
(async ()=>{
  try{
    const me = await api("/users/@me").then(r=>r.json());
    dlog("Discord bot logged as:", me?.username || me?.id || "unknown");
  }catch(e){ dlog("BOT LOGIN CHECK FAILED", e); }
})();
