import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;
const DISCORD_CATEGORY_ID = process.env.DISCORD_CATEGORY_ID;
const IG_BASIC_TOKEN = process.env.IG_BASIC_TOKEN;

app.use(express.json());

// CORS simple (si servi derrière Nginx, tu peux réduire)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

function discordHeaders() {
  return {
    Authorization: `Bot ${DISCORD_TOKEN}`,
    "Content-Type": "application/json",
  };
}

/**
 * GET /api/health
 * Vérifie la connexion à l'API Discord
 */
app.get("/api/health", async (req, res) => {
  if (!DISCORD_TOKEN) {
    return res.json({ ok: false, error: "DISCORD_BOT_TOKEN manquant" });
  }
  try {
    const meRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bot ${DISCORD_TOKEN}` },
    });
    const me = await meRes.json();
    res.json({ ok: true, bot_user: me });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Erreur Discord" });
  }
});

/**
 * POST /api/start-chat
 * Body: { firstMessage, page }
 */
app.post("/api/start-chat", async (req, res) => {
  if (!DISCORD_TOKEN || !DISCORD_GUILD_ID) {
    return res.json({
      ok: false,
      error: "Variables Discord manquantes (token/guild)",
    });
  }
  const { firstMessage, page } = req.body || {};
  try {
    // Créer un salon dans la guilde
    const channelName =
      "site-" +
      new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

    const payload = {
      name: channelName,
      type: 0, // text
      topic: `Conversation depuis le portfolio (page: ${page || "/"})`,
    };
    if (DISCORD_CATEGORY_ID) {
      payload.parent_id = DISCORD_CATEGORY_ID;
    }

    const createRes = await fetch(
      `https://discord.com/api/guilds/${DISCORD_GUILD_ID}/channels`,
      {
        method: "POST",
        headers: discordHeaders(),
        body: JSON.stringify(payload),
      }
    );
    const channel = await createRes.json();
    if (!channel.id) {
      console.error("Erreur création salon Discord:", channel);
      return res
        .status(500)
        .json({ ok: false, error: "Impossible de créer le salon Discord" });
    }

    // Envoyer premier message
    if (firstMessage) {
      await fetch(
        `https://discord.com/api/channels/${channel.id}/messages`,
        {
          method: "POST",
          headers: discordHeaders(),
          body: JSON.stringify({
            content: firstMessage,
          }),
        }
      );
    }

    res.json({
      ok: true,
      channel_id: channel.id,
      echo:
        "Bonjour, merci d'avoir pris contact. Je vous répondrai dans quelques instants",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Erreur lors de start-chat" });
  }
});

/**
 * POST /api/message
 * Body: { channel_id, content }
 */
app.post("/api/message", async (req, res) => {
  const { channel_id, content } = req.body || {};
  if (!channel_id || !content) {
    return res.status(400).json({ ok: false, error: "Paramètres manquants" });
  }
  try {
    const r = await fetch(
      `https://discord.com/api/channels/${channel_id}/messages`,
      {
        method: "POST",
        headers: discordHeaders(),
        body: JSON.stringify({ content }),
      }
    );
    const data = await r.json();
    if (!data.id) {
      console.error("Erreur envoi message:", data);
      return res
        .status(500)
        .json({ ok: false, error: "Échec de l’envoi du message" });
    }
    res.json({ ok: true, id: data.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Erreur lors de l’envoi" });
  }
});

/**
 * GET /api/messages?channel_id=...&limit=30
 * Retourne les derniers messages du salon
 */
app.get("/api/messages", async (req, res) => {
  const channel_id = req.query.channel_id;
  const limit = Math.min(parseInt(req.query.limit) || 30, 100);
  if (!channel_id) {
    return res.status(400).json({ ok: false, error: "channel_id requis" });
  }
  try {
    const r = await fetch(
      `https://discord.com/api/channels/${channel_id}/messages?limit=${limit}`,
      { headers: discordHeaders() }
    );
    const raw = await r.json();
    if (!Array.isArray(raw)) {
      console.error("Erreur fetch messages:", raw);
      return res
        .status(500)
        .json({ ok: false, error: "Impossible de récupérer les messages" });
    }
    const messages = raw
      .map((m) => ({
        id: m.id,
        author: m.author?.bot ? "bot" : m.author?.username || "inconnu",
        content: m.content,
        timestamp: m.timestamp,
      }))
      .reverse();
    res.json({ ok: true, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Erreur lors de la lecture" });
  }
});

/**
 * GET /api/instagram?limit=6
 * Récupère les derniers posts via Instagram Basic Display
 * (simplifié, sans refresh token ici)
 */
app.get("/api/instagram", async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 6, 12);
  if (!IG_BASIC_TOKEN) {
    // Fallback fictif pour développement
    return res.json({
      ok: true,
      feed: [],
    });
  }
  try {
    const url = new URL("https://graph.instagram.com/me/media");
    url.searchParams.set("fields", "id,caption,media_url,permalink,media_type,timestamp");
    url.searchParams.set("access_token", IG_BASIC_TOKEN);
    url.searchParams.set("limit", limit.toString());

    const igRes = await fetch(url.toString());
    const igData = await igRes.json();
    if (!igData.data) {
      console.error("Réponse Instagram inattendue:", igData);
      return res.json({ ok: true, feed: [] });
    }

    const feed = igData.data.map((item) => ({
      id: item.id,
      type: item.media_type,
      url: item.media_url,
      link: item.permalink,
      caption: item.caption,
      ts: item.timestamp,
    }));

    res.json({ ok: true, feed });
  } catch (err) {
    console.error(err);
    res.json({ ok: true, feed: [] });
  }
});

app.listen(PORT, () => {
  console.log(`API portfolio en écoute sur http://127.0.0.1:${PORT}`);
});
