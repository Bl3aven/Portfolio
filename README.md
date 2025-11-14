# 🌐 Portfolio – Mathys Tournayre

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white)
![JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat&logo=nginx&logoColor=white)
![Discord](https://img.shields.io/badge/Discord_Bot-5865F2?style=flat&logo=discord&logoColor=white)

---

## 🚀 Présentation

**Portfolio personnel** de [Mathys Tournayre](https://tournayre.ovh) — DevOps & Full-Stack Developer.  
Conçu pour être **rapide, auto-hébergeable** et **visuellement élégant**, ce site met en avant mes projets (Flask, Nutanix, GLPI, DevOps, automatisation, sécurité) dans une interface fluide inspirée d’Apple.

Il combine une **partie statique** pour le contenu et une **API Node.js** intégrée pour le chat Discord et les widgets dynamiques (Instagram, LinkedIn).

---

## ✨ Fonctionnalités principales

### 🔧 Stack technique
- **Frontend** : HTML5 + Bootstrap 5 + AOS (animations), Splide.js (carrousel)
- **Design** : Thème “Liquid / Bubble” sombre inspiré d’Apple, palette néon personnalisée
- **Backend** :
  - **Node.js / Express** pour le relais Discord + API Instagram
  - **Nginx** comme reverse-proxy et serveur statique
  - Compatible avec **Flask** ou tout backend Python si besoin (projets liés)
- **Base 100% portable** : aucun CMS, juste des fichiers statiques + services Node

### 💬 Chat en direct (Discord)
- Bouton flottant en bas à droite de chaque page
- À l’ouverture d’une discussion :
  - Création automatique d’un salon privé dans un serveur Discord
  - Échanges bi-directionnels temps réel (site ↔ Discord)
- Messages et statut persistants via `localStorage`

### 📷 Widgets dynamiques
- **Instagram** : affichage des 6 dernières publications depuis `mathys.trye` (API Graph)
- **LinkedIn** : badge officiel `mathys-tournayre-63772a1bb`
- **A propos / Timeline** : animation “liquid” avec effets de défilement AOS

### 🧩 Pages incluses
| Page | Description |
|------|--------------|
| `/index.html` | Accueil avec effet typing, halo néon, carrousel projets |
| `/projects.html` | Grille filtrable + recherche + modale d’aperçu avec carrousel |
| `/about.html` | Présentation, timeline, widgets Instagram & LinkedIn |
| `/contact.html` | Formulaire ou redirection vers Discord / e-mail |
| `/api/*` | Routes Node.js pour chat Discord, Instagram, healthcheck |

---

## 🖌️ Palette & Style

| Élément | Couleur | Usage |
|----------|----------|-------|
| Noir abyssal | `#0A0B0D` | Fond principal |
| Gris graphite | `#1A1C20` | Panneaux secondaires |
| Rouge néon | `#FF004F` | Accents énergétiques |
| Orange plasma | `#FF6B00` | Transitions / Hover |
| Bleu cyan électrique | `#00E7FF` | Liens, contours, effets lumineux |
| Violet ionisé | `#6C00FF` | Bordures subtiles |
| Blanc pur LED | `#F5F5F7` | Texte et contrastes |

Design : **liquid / glassmorphism**, bulles floutées dynamiques, halo néon interactif.

---

## ⚙️ Installation locale

### Prérequis
- Node.js ≥ 18  
- Nginx ou un simple serveur statique (optionnel)  
- Un serveur Discord (si tu veux tester le chat)  
- (Optionnel) compte Meta Developer + token Instagram Basic Display

### Étapes

```bash
# Cloner le dépôt
git clone https://github.com/mathys-tournayre/portfolio.git
cd portfolio

# Installer les dépendances API
cd api
npm install
cp .env.example .env
# => remplir les clés (Discord, Instagram, etc.)

# Lancer le serveur API
node server.js
