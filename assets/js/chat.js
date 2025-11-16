(function () {
  const API_BASE = "/api";
  let channelId = null;
  let polling = null;
  let messagesCache = new Set();

  function createUI() {
    const root = document.getElementById("chat-root");
    if (!root) return;

    // Toggle button
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "chat-toggle-btn";
    toggleBtn.innerHTML =
      '<i class="bi bi-chat-dots"></i><span>Discuter</span>';
    root.appendChild(toggleBtn);

    // Panel
    const panel = document.createElement("div");
    panel.className = "chat-panel";
    panel.innerHTML = `
      <div class="chat-header">
        <div>
          <div class="chat-header-title">Chat avec Mathys</div>
          <div class="small text-muted">Je répondrai dès que possible 👋</div>
        </div>
        <button class="btn btn-sm btn-outline-light rounded-pill px-2 py-1 chat-close">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="chat-body" id="chat-body"></div>
      <div class="chat-input-row">
        <input type="text" id="chat-input" placeholder="Écris ton message…" />
        <button id="chat-send"><i class="bi bi-send"></i></button>
      </div>
    `;
    root.appendChild(panel);

    const body = panel.querySelector("#chat-body");
    const input = panel.querySelector("#chat-input");
    const sendBtn = panel.querySelector("#chat-send");
    const closeBtn = panel.querySelector(".chat-close");

    // Toggle
    toggleBtn.addEventListener("click", () => {
      panel.classList.toggle("open");
      if (panel.classList.contains("open")) {
        input?.focus();
      }
    });
    closeBtn.addEventListener("click", () => panel.classList.remove("open"));

    // Retrieve channel from localStorage
    const stored = window.localStorage.getItem("chat_channel_id");
    if (stored) {
      channelId = stored;
      startPolling();
    }

    function appendMessage(author, content) {
      const div = document.createElement("div");
      div.className = "chat-msg " + (author === "me" ? "me" : "bot");
      div.textContent = content;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }

    async function startChat(firstMessage) {
      try {
        const res = await fetch(`${API_BASE}/start-chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstMessage,
            page: window.location.pathname,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          channelId = data.channel_id;
          window.localStorage.setItem("chat_channel_id", channelId);
          appendMessage("bot", data.echo);
          startPolling();
        } else {
          appendMessage("bot", "Une erreur est survenue, réessaie plus tard.");
        }
      } catch (err) {
        console.error(err);
        appendMessage("bot", "Impossible de contacter le serveur pour le moment.");
      }
    }

    async function sendMessage() {
      const value = input.value.trim();
      if (!value) return;
      appendMessage("me", value);
      input.value = "";

      if (!channelId) {
        await startChat(value);
        return;
      }
      try {
        await fetch(`${API_BASE}/message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channel_id: channelId, content: value }),
        });
      } catch (err) {
        console.error(err);
      }
    }

    function startPolling() {
      if (polling) return;
      polling = setInterval(async () => {
        if (!channelId) return;
        try {
          const res = await fetch(
            `${API_BASE}/messages?channel_id=${encodeURIComponent(
              channelId
            )}&limit=30`
          );
          const data = await res.json();
          if (!data.ok || !Array.isArray(data.messages)) return;
          data.messages.forEach((m) => {
            if (!messagesCache.has(m.id)) {
              messagesCache.add(m.id);
              const isMe = m.author === "site";
              if (!isMe) {
                const div = document.createElement("div");
                div.className = "chat-msg bot";
                div.textContent = m.content;
                body.appendChild(div);
                body.scrollTop = body.scrollHeight;
              }
            }
          });
        } catch (err) {
          console.error(err);
        }
      }, 2500);
    }

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", createUI);
})();
