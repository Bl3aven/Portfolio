# Instructions permanentes — Portfolio Mathys Tournayre

Ce fichier est lu automatiquement par Claude Code à chaque session.
Appliquer **systématiquement** les règles ci-dessous après chaque modification.

---

## ✅ Checklist après chaque modification

### 1. Commit Git
- Toujours créer un commit après chaque changement, même mineur.
- Message clair : type + description courte + détails si nécessaire.
- Push immédiat sur `main` → `https://github.com/Bl3aven/Portfolio`

```bash
git add <fichiers>
git commit -m "type: description courte

Détails si nécessaire.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push origin main
```

### 2. Déploiement SFTP
- Déployer **immédiatement** après le commit via le script Python :

```bash
python "C:\Users\mathy\AppData\Local\Temp\deploy_portfolio.py"
```

- Hôte : `ftp.cluster129.hosting.ovh.net` · user : `otinwyn`
- Chemin distant : `www/`

### 3. Mise à jour du CV si nécessaire
Mettre à jour `cv-mathys-tournayre.html` (et le PDF associé si possible) si la modification touche :
- Une nouvelle compétence ou technologie ajoutée
- Une nouvelle expérience ou formation
- Un nouveau projet ou certification
- Le titre ou le positionnement professionnel

### 4. Éléments répétés — toujours mettre à jour toutes les occurrences
Certains éléments apparaissent à plusieurs endroits. **Une modification = mise à jour partout.**

| Élément | Où il apparaît |
|---|---|
| Bandeau de compétences (marquee) | `index.html` : **une seule copie** dans le HTML, le JS duplique automatiquement (`t.innerHTML = t.innerHTML + t.innerHTML`). Ne pas ajouter de copie manuelle. |
| Navigation desktop | `index.html` nav `.nav-desktop` |
| Navigation mobile | `index.html` `#mobileMenu` |
| Liens sociaux | `index.html` : section `#contact` + footer |
| Sphère 3D des compétences | `#skillsData` + `#skillCloudData` + objet JS `skillData` (3 endroits) |
| Marquee de compétences | Une seule copie HTML, le JS double automatiquement |
| Certification ribbon | Une seule copie HTML, le JS double automatiquement |

### 5. Vérification affichage mobile
Après **toute modification CSS ou de layout**, vérifier que l'affichage mobile est correct.

**Référence mobile : 390px de large (iPhone 15 standard)**

Points à vérifier :
- Les textes utilisent `clamp(min, vw, max)` — ne pas utiliser de valeurs `vw` sans `clamp`
- Aucun élément ne dépasse la largeur de l'écran (`overflow-x`)
- Les boutons sont lisibles (min 44px de hauteur tactile)
- Les grilles passent en 1 colonne à `≤620px` ou `≤480px`
- Les polices de grande taille (modals, hero) sont réduites à `≤620px`

**Règle typographique mobile :**
- Titres principaux : `clamp(1.8rem, Nvw, max)` avec N ≤ 12 pour les mots longs (≥8 chars)
- "TOURNAYRE" (9 chars) → maximum `11vw` à `≤620px`
- Vérifier que `clamp(min, Nvw, max)` à 390px ne génère pas un overflow

---

## 🗂️ Structure du projet

```
Portfolio-github/
├── index.html          ← Page principale
├── quiz.html           ← Quiz Kahoot-like (Supabase)
├── cv-mathys-tournayre.html  ← CV interactif
├── cv-tournayre-fr-2026.pdf  ← CV PDF
├── api/                ← Backend PHP (Discord assistant)
│   ├── config.php      ← NE PAS versionner (gitignore)
│   ├── start_chat.php
│   ├── send_message.php
│   ├── poll_messages.php
│   └── interaction.php
├── img/                ← Assets locaux
├── favicon/
├── stl/
└── CLAUDE.md           ← Ce fichier
```

## 🔑 Accès & credentials

Voir `c:\Users\mathy\OneDrive\Documents\Secrets` (ne jamais versionner ce fichier).

- **SFTP OVH** : `ftp.cluster129.hosting.ovh.net:22` · `otinwyn` · voir Secrets
- **Git** : `https://github.com/Bl3aven/Portfolio` · remote `origin`
- **Nextcloud** : `https://ntc.tournayre.ovh` · SSH `bl34v3n@192.168.1.64`

## 🎨 Design system

| Variable | Valeur |
|---|---|
| Fond | `#0a0a0c` |
| Accent | `#ff8c42` (orange) |
| Police | Inter (UI) + JetBrains Mono (code/tech) |
| Radius | `14px` (cards) |

## ⚠️ Pièges connus

- **Marquee** : ne jamais dupliquer les chips dans le HTML, le JS s'en charge.
- **PHP Imagick** : non installable sur le snap Nextcloud (ABI PHP 8.3 incompatible avec Ubuntu 26.04 PHP 8.5). Ne pas réessayer.
- **`.htaccess`** : les fichiers `.md`, `.log`, `.json`, `.sql` sont bloqués côté OVH.
- **Nextcloud sudo** : utiliser `echo 'password' | sudo -S command` sans heredoc pour éviter les conflits stdin.
- **deploy_portfolio.py** : le script existe dans `C:\Users\mathy\AppData\Local\Temp\` — le recréer si la session est fraîche (paramiko requis, clé Ed25519).
