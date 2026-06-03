# Recap des acces connus de la session

Derniere mise a jour : 2026-06-03

Ce document resume les acces et points d'integration connus dans le contexte de travail actuel. Il ne contient volontairement aucun mot de passe, token, cle privee ou secret Discord/GitHub/SFTP.

## Regle de securite

- Les secrets ne sont pas recopies dans ce fichier.
- Les valeurs sensibles sont indiquees comme presentes/configurees, mais masquees.
- Ce recap decrit ce que je peux utiliser depuis l'environnement local actuel si les fichiers de configuration restent disponibles.
- Le fichier `token_bot_discord` est visible comme onglet ouvert dans l'IDE, mais je ne l'ai pas consulte pour etablir ce recap.

## Workspace local

- Racine locale visible : `c:\Users\mathy\OneDrive\Documents`
- Dossier du portfolio utilise : `c:\Users\mathy\OneDrive\Documents\.codex_tmp\Portfolio-github`
- Shell disponible : PowerShell
- Acces fichiers : lecture/ecriture locale autorisee dans l'environnement actuel
- Acces reseau : disponible

## Depot GitHub

- Depot : `https://github.com/Bl3aven/Portfolio`
- Remote Git local : `origin`
- Branche courante : `main`
- Dernier commit local connu : `e00bfc3 Add browser theme color integration`
- Push GitHub : fonctionnel via les identifiants Git locaux deja configures sur la machine
- Secret GitHub/PAT : non connu et non affiche ici

## Serveur SFTP

- Configuration source : `c:\Users\mathy\OneDrive\Documents\.vscode\sftp.json`
- Nom de profil : `OVH VPS`
- Protocole : `sftp`
- Port : `22`
- Hote : `ftp.cluster129.hosting.ovh.net`
- Identifiant : configure dans `sftp.json` et masque ici
- Mot de passe : present dans `sftp.json`, non recopie ici
- `remotePath` dans la configuration VS Code : vide
- Chemin distant effectivement utilise lors des derniers deploiements Codex : `www/`
- Derniere methode de deploiement utilisee : upload cible par SFTP des fichiers modifies, sans creation de backup persistant

## Site public

- Domaine principal : `https://tournayre.ovh/`
- Sitemap : `https://tournayre.ovh/sitemap.xml`
- Manifest : `https://tournayre.ovh/manifest.json`
- Pages/fichiers actifs connus :
  - `/index.html`
  - `/cv-mathys-tournayre.html`
  - `/cv-tournayre-fr-2026.pdf`
  - `/quiz.html`

## Assistant de contact

- Frontend : assistant integre dans `index.html`
- Endpoints utilises :
  - `/api/start_chat.php`
  - `/api/send_message.php`
  - `/api/poll_messages.php`
- Configuration serveur reelle : `api/config.php`
- Statut de `api/config.php` : non versionne, conserve uniquement cote serveur
- Exemple versionne : `api/config.example.php`
- Secrets Discord attendus cote serveur :
  - `DISCORD_BOT_TOKEN`
  - `DISCORD_GUILD_ID`
  - `DISCORD_CATEGORY_ID`
  - `DISCORD_PUBLIC_KEY`
- Les messages passent par la fenetre assistant du site ; Discord sert de relais technique cote serveur.

## Integrations externes du portfolio

- GitHub public projects widget :
  - Widget : RepoWidget
  - Source script : `https://cdn.jsdelivr.net/gh/peterbenoit/RepoWidget@latest/dist/repoWidget.min.js`
  - Donnees : depots publics GitHub du compte `Bl3aven`
  - Fallback local prevu si le widget externe ou l'API GitHub ne repond pas
- LinkedIn :
  - Profil : `https://www.linkedin.com/in/mathys-tournayre/`
  - Badge officiel LinkedIn tente via `https://platform.linkedin.com/badges/js/profile.js`
  - Carte locale de secours prevue si le badge officiel ne rend pas correctement

## Fichiers sensibles ou a ne pas publier

- `.vscode/sftp.json` : contient la configuration SFTP et un secret
- `token_bot_discord` : fichier potentiellement sensible visible dans l'IDE, non consulte ici
- `api/config.php` : contient les secrets Discord serveur, volontairement absent du depot
- Tout fichier `.env`, `.bak`, `.backup`, `.old`, `.sql`, `.zip`, `.tar`, `.gz` : bloque ou a eviter dans le site public

## Etat de publication connu

- GitHub : dernier push connu effectue sur `main`
- SFTP : derniers fichiers deployes et verifies par hash lors de la session precedente
- Backups SFTP : les anciens dossiers temporaires/backups connus avaient ete nettoyes precedemment

## Limites

- Ce recap ne garantit pas que les identifiants soient encore valides.
- Je ne conserve pas de coffre-fort de mots de passe exploitable ; les acces viennent des fichiers locaux, credentials Git de la machine, et du contexte de session.
- Pour publier ce fichier sur GitHub ou sur le serveur, il vaut mieux le relire avant, meme s'il est redige sans secret.
