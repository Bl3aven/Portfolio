# Portfolio Mathys Tournayre

Version récupérée depuis le serveur SFTP OVH (`www`) puis nettoyée pour GitHub.

## Structure

- `index.html` : portfolio principal avec animations, assistant de contact, modales, compétences et viewer STL.
- `quiz.html` : quiz live autonome.
- `sandbox.html` : page utilitaire.
- `api/*.php` : endpoints Discord utilisés par l'assistant de contact.
- `stl/` : modèles 3D affichés dans le portfolio.

## Configuration API

Le fichier réel `api/config.php` n'est pas versionné volontairement.

Sur le serveur :

1. Copier `api/config.example.php` vers `api/config.php`.
2. Remplir les constantes Discord.
3. Garder `api/config.php` uniquement sur le serveur.

`api/create_admin_channel.php` est un script d'initialisation/admin et il est bloqué côté web par `api/.htaccess`.
