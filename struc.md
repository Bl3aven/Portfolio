Voici le “méga-prompt” que tu pourras coller dans un nouveau chat pour tout recréer from scratch 👇

````text
Tu es un assistant expert en :
- Frontend moderne (HTML5, CSS3, JS vanilla, Bootstrap 5, AOS, Splide, animations type Apple “liquid/glassmorphism”)
- Backend Node.js/Express et intégration Discord (bot, API, webhooks)
- Nginx, auto-hébergement et SEO technique (sitemap, robots, meta, schema.org)
- Intégration Instagram Basic Display et LinkedIn Widgets

🎯 OBJECTIF GLOBAL
Je veux que tu me génères **un portfolio web complet, clé en main**, prêt à être déployé sur mon serveur, qui respecte **très précisément** les spécifications suivantes :

---

## 1. Contexte et but

- Mon nom : **Mathys Tournayre** (alias Matt).
- Je suis **DevOps & Full-Stack**.
- J’héberge mon portfolio sur mon propre serveur sous le domaine :  
  **`https://portfolio.tournayre.ovh`**
- Je veux un site :
  - **statique côté frontend** (HTML/CSS/JS, sans framework SPA)
  - complété par une **petite API Node/Express** pour le chat Discord et Instagram.
- Le site doit être **SEO-friendly** et optimiser mon référencement sur :
  - “mathys tournayre”
  - “Mathys Tournayre DevOps”
  - etc.

---

## 2. Stack exigée

### Frontend
- **Sans React / Vue / Angular.**  
- HTML5 + **Bootstrap 5** (via CDN).
- **Bootstrap Icons** (via CDN).
- **AOS** pour les animations au scroll.
- **Splide.js** pour les carrousels/projets.
- CSS principal : `/assets/css/theme.css`.
- JS principal :
  - `/assets/js/home.js` (page d’accueil)
  - `/assets/js/chat.js` (widget chat)
  - `/assets/js/about-widgets.js` (about : Instagram & LinkedIn)
  - `/assets/js/projects.js` (page projets).

### Backend
- Dossier : `/api` à la racine du projet.
- **Node.js + Express**, module ES (import/export).
- Fichier principal : `api/server.js`.
- Fichier `api/package.json` minimal (scripts, dépendances).
- Utilisation de `dotenv` pour les secrets (`.env`).
- Aucune BDD : tout en mémoire / via APIs externes.

### Serveur web
- **Nginx** comme reverse proxy :
  - sert les fichiers statiques depuis `/var/www/portfolio`
  - proxy `/api/*` vers `http://127.0.0.1:3001`
- Fournis moi **un fichier de vhost Nginx complet** adapté au domaine `portfolio.tournayre.ovh`, incluant :
  - HTTP → HTTPS
  - TLS via Let’s Encrypt
  - CSP adaptée (self, jsdelivr, Google Analytics, platform.linkedin.com, graph.instagram.com, etc.)
  - headers de sécurité (HSTS, X-Frame-Options, X-Content-Type-Options…)
  - cache long sur assets statiques
  - route `/whoami` pour debug
  - rate-limit simple pour `/api/`.

---

## 3. Identité visuelle & design

### Palette de couleurs OBLIGATOIRE

- Noir abyssal : `#0A0B0D` – fond principal
- Gris graphite : `#1A1C20` – surfaces secondaires (cartes, panneaux)
- Rouge néon : `#FF004F` – accents, hover, CTA
- Orange plasma : `#FF6B00` – effets lumineux, focus, survols
- Bleu cyan électrique : `#00E7FF` – liens, contours, effets
- Violet ionisé : `#6C00FF` – détails, bordures, glow secondaire
- Blanc pur LED : `#F5F5F7` – texte principal

### Style global

- **Dark mode uniquement**, très lisible, contrasté.
- Style **“bulle d’eau / liquid / glassmorphism” façon Apple** :
  - cartes avec flou de fond, dégradés subtils, halo lumineux
  - coins arrondis, ombres douces
- Animation d’arrivée type **Palmer (Framer)** :
  - un overlay plein écran au chargement sur la **page d’accueil** :
    - bulle “Portfolio”
    - titre “Mathys Tournayre”
    - sous-titre “DevOps & Full-Stack — Automatisation, sécurité, cloud privé.”
  - l’overlay glisse vers le haut après ~0,6–0,8 s et disparaît.
  - respect de `prefers-reduced-motion` : pas d’animation si activé.
- Police : stack système moderne (Inter/Segoe UI/Roboto…).

---

## 4. Structure des pages

### 4.1 Pages à fournir

1. `index.html` (Accueil)
2. `about.html` (À propos)
3. `projects.html` (Projets)
4. `contact.html` (Contact)
5. `404.html` (Page 404 simple)
6. `robots.txt`
7. `sitemap.xml`
8. métadonnées SEO & OpenGraph sur chaque page.

### 4.2 Accueil (`index.html`)

- Navbar fixe en haut (Bootstrap) avec liens :
  - Accueil
  - À propos
  - Projets
  - Contact
- Hero section :
  - Grand titre “Mathys Tournayre”
  - Effet **typing** sur le sous-titre :  
    “DevOps & Full-Stack • Automatisation • Sécurité • Cloud privé”
  - Deux boutons :
    - “Voir mes projets” → `/projects.html`
    - “Me contacter” → `/contact.html`
  - Halo néon animé en fond (parallaxe légère au mouvement de souris).
- Section “Ce que je fais” (liste de services / compétences concrètes).
- Section “Points forts” avec **pills/badges** (Flask, Nginx, Ansible, Docker, Nutanix, GLPI, etc.) :
  - apparition en **stagger** via IntersectionObserver.
- Section **“Projets mis en avant”** avec **carrousel Splide** (3 projets min) :
  - Bastion web d’outils internes (Flask)
  - Fabrique de VMs Nutanix (GLPI + phpIPAM)
  - Admin serveur Squad (bot Discord + RCON)
  - chaque slide → carte cliquable vers `projects.html`.

### 4.3 À propos (`about.html`)

- Header en bulle liquid : titre + bouton “Télécharger mon CV” (fichier fictif `assets/cv.pdf`).
- Timeline “liquid” (verticale) retraçant :
  - alternance chez Itinsell Cloud (bastion Flask, fabrique Nutanix/GLPI, étude Nextcloud HDS)
  - projets persos (bots Discord, scripts GLPI, Squad, etc.)
- Bloc **Instagram** :
  - Titre, lien `@mathys.trye`
  - Grille de **6 posts** (images carrées) récupérés par `/api/instagram`.
- Bloc **LinkedIn** :
  - Badge officiel profil : `mathys-tournayre-63772a1bb`.

### 4.4 Projets (`projects.html`)

- Header bulle “Projets”.
- Barre d’outils :
  - Filtres sous forme de **pills** : all, flask, devops, discord, nutanix…
  - champ recherche texte
  - select tri (plus récent, A–Z).
- Grille de cartes projets **générées en JS** à partir d’un tableau d’objets :
  - id, title, description, tags, lien, liste d’images.
- Bouton “Aperçu” sur chaque carte → ouvre une **modale** avec :
  - titre, description
  - carrousel Splide d’images
  - bouton “Ouvrir” (lien externe ou ancre interne).

### 4.5 Contact (`contact.html`)

- Bulle avec :
  - texte court invitant à me contacter
  - boutons mail, LinkedIn, Discord.
- Tu peux mettre un formulaire HTML (non fonctionnel) ou simple liste de moyens de contact, mais en gardant cohérence visuelle.

---

## 5. Chat widget connecté à Discord

### UI (frontend)

- Script dans `/assets/js/chat.js`.
- Widget :
  - bouton flottant en bas à droite, style bulle néon (“Discuter” + icône).
  - quand ouvert : panneau (bulle) avec :
    - header : “Chat avec Mathys” + petit texte “Je réponds rapidement 👋”
    - corps : historique des messages (moi vs bot)
    - input texte + bouton envoyer.
- Fonctionnement :
  - au **premier message** :
    - appel POST `/api/start-chat` avec `{ firstMessage, page }`
    - l’API renvoie `channel_id` et un message `echo` :
      - **exactement** :  
        `"Bonjour, merci d'avoir pris contact. Je vous répondrai dans quelques instants"`
    - le `channel_id` est mémorisé dans `localStorage` pour reprendre la conversation.
  - messages suivants :
    - POST `/api/message` avec `{ channel_id, content }`.
  - **Poll** régulier (2–3s) sur `/api/messages?channel_id=...` :
    - ajoute les messages Discord côté widget
    - pas de doublons
    - mes messages (site) alignés à droite, ceux venant de Discord à gauche.

### API Node/Express (backend)

Dans `api/server.js`, implémente les routes suivantes :

- `GET /api/health`  
  → vérifie l’auth Discord (`/users/@me`), renvoie `{ ok:true, user, bot_user }`.

- `POST /api/start-chat`  
  - crée un **nouveau salon texte** dans un **serveur Discord** et une **catégorie dédiée**.
  - corps : `{ firstMessage, page }`.
  - utilise :
    - `DISCORD_BOT_TOKEN`
    - `DISCORD_GUILD_ID`
    - `DISCORD_CATEGORY_ID` (catégorie où créer les salons)
  - envoie dans le salon :
    - le `firstMessage` (sans mentionner que ça vient du site).
  - renvoie :
    - `{ ok:true, channel_id: "...", echo: "Bonjour, merci d'avoir pris contact. Je vous répondrai dans quelques instants" }`.

- `POST /api/message`  
  - envoie un message dans un salon existant.
  - corps : `{ channel_id, content }`
  - renvoie `{ ok:true, id: "<id_message_discord>" }`.

- `GET /api/messages`  
  - récupère les derniers messages du salon donné.
  - query : `channel_id`, `limit` (default 20–50).
  - renvoie :
    - `{ ok:true, messages: [{id, author, content, timestamp}, ...] }`.

- Log minimal sur la console (`console.log`) pour debug.

ENV à prévoir dans `.env` :

```env
DISCORD_BOT_TOKEN=...
DISCORD_GUILD_ID=...
DISCORD_CATEGORY_ID=...
IG_BASIC_TOKEN=...   # token long-lived Instagram
PORT=3001
````

---

## 6. Widget Instagram & LinkedIn

### Instagram

* Route backend : `GET /api/instagram?limit=6`

  * utilise `IG_BASIC_TOKEN` (Instagram Basic Display / Graph API).
  * appelle `https://graph.instagram.com/me/media` avec les bons champs :

    * `id, caption, media_url, permalink, media_type, timestamp`
  * renvoie :

    * `{ ok:true, feed:[ { id, type, url, link, caption, ts }, ... ] }`.
* Front (dans `about-widgets.js`) :

  * fetch `/api/instagram?limit=6`
  * si ok → remplir la grille `#ig-grid` avec des cartes bulles (image + date)
  * fallback message si erreur.

### LinkedIn

* Intégrer le badge **officiel** pour :
  `mathys-tournayre-63772a1bb`
  via script `https://platform.linkedin.com/badges/js/profile.js`
  et `<div class="LI-profile-badge" ...>`.

---

## 7. CSS global (`assets/css/theme.css`)

Tu dois générer un **fichier unique cohérent** qui contient :

* Palette + classes utilitaires (`text-led`, `bg-graphite`, `.pill`, etc.).
* Styles “liquid bubble” (`.liquid-bubble`, timeline, filtres, etc.).
* Styles chat widget (`#chat-root`, `.chat-panel`, `.msg.me/.msg.bot`, responsive bottom-sheet sur mobile).
* Styles hero + halo + parallaxe (`.hero`, `.hero-glow`).
* Styles Splide (pagination, flèches aux couleurs du thème).
* Styles Instagram grid, modale projet, etc.
* Media queries :

  * <600px → chat en bottom sheet
  * <768px → grille Instagram adaptative
  * support `prefers-reduced-motion`.

---

## 8. Nginx : vhost complet

Donne moi un **bloc Nginx complet** pour :

* `server_name portfolio.tournayre.ovh` (HTTPS)
* `server_name www.portfolio.tournayre.ovh` (redirection vers apex)
* racine : `/var/www/portfolio`
* index : `index.html`
* sections :

  * `location /` → statique (sans fallback SPA global)
  * `location /app/` → fallback vers `/app/index.html` (si besoin)
  * `location ^~ /api/` → proxy vers `127.0.0.1:3001` (sans slash final)

    * gestion CORS basique
    * `limit_req` pour rate-limit API
    * `access_log off` pour éviter le bruit des polls
  * cache long sur `.css`, `.js`, `.jpg`, `.png`, `.webp`, `.svg`, `.ico`, `.woff2`
  * pas de cache agressif sur `.html`
  * servira `/robots.txt` et `/sitemap.xml` proprement
  * page 404 custom `/404.html`
  * bloc PHP optionnel (`location ~ \.php$`) avec `php8.2-fpm` (ou adaptable).
* TLS :

  * chemins typiques Let’s Encrypt : `/etc/letsencrypt/live/portfolio.tournayre.ovh/...`
* CSP (Content-Security-Policy) adaptée à :

  * `self`
  * `https://cdn.jsdelivr.net`
  * `https://www.googletagmanager.com`
  * `https://www.google-analytics.com`
  * `https://region1.google-analytics.com`
  * `https://platform.linkedin.com`
  * `https://graph.instagram.com`
  * `https://media.licdn.com`
* Headers de sécurité standards.

---

## 9. README.md GitHub

Génère aussi un `README.md` pour le dépôt GitHub qui résume :

* stack technique
* fonctionnalités (chat Discord, Instagram, LinkedIn, design liquid)
* structure du projet
* instructions d’installation (Node, .env, Nginx)
* capture d’écran à prévoir
* licence MIT.

---

## 10. Format de ta réponse

* Donne-moi **tous les fichiers** clairement séparés, par exemple :

  * `index.html`
  * `about.html`
  * `projects.html`
  * `contact.html`
  * `404.html`
  * `assets/css/theme.css`
  * `assets/js/home.js`
  * `assets/js/chat.js`
  * `assets/js/about-widgets.js`
  * `assets/js/projects.js`
  * `api/package.json`
  * `api/server.js`
  * `.env.example` (avec variables à remplir)
  * `nginx.conf` (vhost ou extrait à coller dans `sites-available`)
  * `README.md`
  * `robots.txt`
  * `sitemap.xml`

* Le code doit être **directement utilisable**, sans trous (pas de pseudo-code).

* Tous les textes visibles pour l’utilisateur doivent être en **français**.

* Ne pose pas de questions complémentaires : fais au mieux avec ces specs détaillées.

```
::contentReference[oaicite:0]{index=0}
```
