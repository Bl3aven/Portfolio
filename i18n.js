/**
 * i18n.js — Internationalisation FR/EN du portfolio
 * Détection automatique de la langue du navigateur + sélecteur manuel
 */
(function(){
  'use strict';

  const DEFAULT_LANG = 'fr';
  const SUPPORTED = ['fr', 'en'];
  const STORAGE_KEY = 'portfolio-lang';

  // =====================
  // DICTIONNAIRE DE TRADUCTIONS
  // =====================
  const dict = {
    // --- META ---
    'meta.description': {
      fr: 'Mathys Tournayre — Alternant ingénieur ISEN chez Oxeegen France. DevOps, Cloud, IA locale, infrastructure & automatisation.',
      en: 'Mathys Tournayre — ISEN engineering apprentice at Oxeegen France. DevOps, Cloud, Local AI, infrastructure & automation.'
    },
    'meta.og.title': {
      fr: 'Mathys Tournayre — DevOps, Cloud & IA Engineer',
      en: 'Mathys Tournayre — DevOps, Cloud & AI Engineer'
    },
    'meta.og.description': {
      fr: 'Découvrez mon portfolio DevOps, Cloud & IA : automatisation, sécurité, CI/CD, infrastructures modernes et IA locale.',
      en: 'Discover my DevOps, Cloud & AI portfolio: automation, security, CI/CD, modern infrastructure and local AI.'
    },
    'meta.twitter.title': {
      fr: 'Mathys Tournayre — DevOps, Cloud & IA Engineer',
      en: 'Mathys Tournayre — DevOps, Cloud & AI Engineer'
    },
    'meta.twitter.description': {
      fr: 'Portfolio DevOps, Cloud & IA — automatisation, sécurité, cloud, infrastructures et IA locale.',
      en: 'DevOps, Cloud & AI Portfolio — automation, security, cloud, infrastructure and local AI.'
    },

    // --- INTRO MODAL ---
    'intro.kicker': { fr: 'PORTFOLIO', en: 'PORTFOLIO' },
    'intro.name': { fr: 'TOURNAYRE MATHYS', en: 'MATHYS TOURNAYRE' },
    'intro.sub': { fr: 'Alternant & Apprenti Ingénieur ISEN<br>chez Oxeegen France', en: 'ISEN Engineering Apprentice<br>at Oxeegen France' },
    'intro.enter': { fr: 'Accéder au Portfolio', en: 'Enter Portfolio' },
    'intro.hint': { fr: 'BIENVENUE • Clique pour entrer • PORTFOLIO', en: 'WELCOME • Click to enter • PORTFOLIO' },

    // --- NAV ---
    'nav.profile': { fr: 'Profil', en: 'Profile' },
    'nav.experience': { fr: 'Expérience', en: 'Experience' },
    'nav.education': { fr: 'Formation', en: 'Education' },
    'nav.skills': { fr: 'Compétences', en: 'Skills' },
    'nav.ai': { fr: 'IA', en: 'AI' },
    'nav.projects': { fr: 'Projets', en: 'Projects' },
    'nav.interests': { fr: 'Centres d’intérêt', en: 'Interests' },
    'nav.contact': { fr: 'Contact', en: 'Contact' },
    'nav.portfolio': { fr: 'Portfolio', en: 'Portfolio' },

    // --- HERO ---
    'hero.title': { fr: 'DevOps, Cloud & <span>IA Engineer</span>', en: 'DevOps, Cloud & <span>AI Engineer</span>' },
    'hero.desc': { fr: 'Je conçois des plateformes modernes, automatisées et sécurisées pour les environnements cloud et professionnels.', en: 'I design modern, automated and secure platforms for cloud and enterprise environments.' },
    'hero.cta': { fr: 'Explorer mes projets', en: 'Explore my projects' },

    // --- SKILLS MARQUEE ---
    'skillchip.security': { fr: 'Sécurité', en: 'Security' },

    // --- SECTIONS TITLES ---
    'section.profile': { fr: 'Profil', en: 'Profile' },
    'section.certifications': { fr: 'Certifications', en: 'Certifications' },
    'section.experience': { fr: 'Expérience', en: 'Experience' },
    'section.education': { fr: 'Formation académique', en: 'Academic Background' },
    'section.skills': { fr: 'Compétences', en: 'Skills' },
    'section.ai': { fr: 'IA locale & workflows', en: 'Local AI & Workflows' },
    'section.projects': { fr: 'Projets', en: 'Projects' },
    'section.profiles': { fr: 'GitHub & LinkedIn', en: 'GitHub & LinkedIn' },
    'section.interests': { fr: 'Centres d’intérêt', en: 'Interests' },
    'section.contact': { fr: 'Contact', en: 'Contact' },

    // --- ABOUT / PROFILE ---
    'about.text': { fr: 'Alternant ingénieur ISEN chez Oxeegen France, spécialisé en automatisation, infrastructure moderne, DevOps et IA locale. Je conçois des systèmes fiables, maintenables et sécurisés, avec une approche orientée production : documentation, monitoring, durcissement, automatisation des opérations et intégration raisonnée d\'outils IA.', en: 'ISEN engineering apprentice at Oxeegen France, specialized in automation, modern infrastructure, DevOps and local AI. I design reliable, maintainable and secure systems with a production-oriented approach: documentation, monitoring, hardening, operations automation and thoughtful integration of AI tools.' },

    // --- EXPERIENCE ---
    'exp.oxeegen.title': { fr: 'Oxeegen — Technicien réseaux et systèmes (alternance)', en: 'Oxeegen — Network & Systems Technician (apprenticeship)' },
    'exp.oxeegen.meta': { fr: 'Vitrolles • Sur site • sept. 2025 → aujourd’hui', en: 'Vitrolles • On-site • Sep 2025 → Present' },
    'exp.oxeegen.1': { fr: 'Exploitation et maintien en conditions opérationnelles d’infrastructures (réseau & systèmes).', en: 'Operation and operational maintenance of network & systems infrastructure.' },
    'exp.oxeegen.2': { fr: 'Automatisation de tâches et déploiements (scripts, procédures, standardisation).', en: 'Task automation and deployments (scripts, procedures, standardization).' },
    'exp.oxeegen.3': { fr: 'Participation aux projets d’évolution (sécurité, segmentation, supervision, amélioration continue).', en: 'Participation in improvement projects (security, segmentation, monitoring, continuous improvement).' },
    'exp.oxeegen.4': { fr: 'Rédaction de documentation et transfert de compétences (runbooks, procédures).', en: 'Documentation writing and knowledge transfer (runbooks, procedures).' },

    'exp.itinsell.title': { fr: 'Itinsell Cloud — Technicien réseau et systèmes (alternance)', en: 'Itinsell Cloud — Network & Systems Technician (apprenticeship)' },
    'exp.itinsell.meta': { fr: 'La Ciotat • Sur site • avr. 2024 → sept. 2025', en: 'La Ciotat • On-site • Apr 2024 → Sep 2025' },
    'exp.itinsell.1': { fr: 'Conception d\'un <b>bastion web</b> interne centralisant les outils et accès d\'infrastructure.', en: 'Designed an internal <b>web bastion</b> centralizing infrastructure tools and access.' },
    'exp.itinsell.2': { fr: 'Déploiement automatisé de VMs sur environnement Nutanix (GLPI + API Prism + Ansible).', en: 'Automated VM deployment on Nutanix environment (GLPI + Prism API + Ansible).' },
    'exp.itinsell.3': { fr: 'Étude de faisabilité d\'une offre Nextcloud orientée conformité (HDS / ISO 27001).', en: 'Feasibility study for a compliance-oriented Nextcloud offering (HDS / ISO 27001).' },
    'exp.itinsell.4': { fr: 'Support opérationnel : diagnostic, amélioration sécurité, documentation, industrialisation.', en: 'Operational support: diagnostics, security improvement, documentation, industrialization.' },

    'exp.helicoidal.title': { fr: 'L\'HELICOIDAL — Poseur (CDD)', en: 'L\'HELICOIDAL — Installer (fixed-term contract)' },
    'exp.helicoidal.meta': { fr: 'Septèmes-les-Vallons • À distance • juin 2023 → juil. 2023', en: 'Septèmes-les-Vallons • Remote • Jun 2023 → Jul 2023' },
    'exp.helicoidal.1': { fr: 'Installation et assemblage d\'escaliers métalliques sur différents sites.', en: 'Installation and assembly of metal staircases on various sites.' },
    'exp.helicoidal.2': { fr: 'Lecture de plans, coordination, respect des délais et des consignes de sécurité.', en: 'Blueprint reading, coordination, deadline and safety compliance.' },

    'exp.starbucks.title': { fr: 'Starbucks — Barista (intérim)', en: 'Starbucks — Barista (temporary)' },
    'exp.starbucks.meta': { fr: 'Marseille • Sur site • juil. 2022 → mars 2023', en: 'Marseille • On-site • Jul 2022 → Mar 2023' },
    'exp.starbucks.1': { fr: 'Service client, rigueur opérationnelle, travail en équipe en environnement très dynamique.', en: 'Customer service, operational rigor, teamwork in a highly dynamic environment.' },
    'exp.starbucks.2': { fr: 'Respect des standards qualité / hygiène et gestion d\'équipement.', en: 'Quality/hygiene standards compliance and equipment management.' },

    // --- EDUCATION ---
    'edu.isen.title': { fr: 'ISEN — Diplôme d\'ingénieur (Numérique)', en: 'ISEN — Engineering Degree (Digital)' },
    'edu.isen.meta': { fr: 'sept. 2025 → sept. 2028', en: 'Sep 2025 → Sep 2028' },
    'edu.isen.1': { fr: 'Approfondissement Cloud, cybersécurité, systèmes distribués, ingénierie logicielle.', en: 'Advanced Cloud, cybersecurity, distributed systems, software engineering.' },
    'edu.isen.2': { fr: 'Approche projet, méthodes, qualité, industrialisation.', en: 'Project-based approach, methodologies, quality, industrialization.' },

    'edu.amu.title': { fr: 'Aix-Marseille Université — BUT Réseaux & Télécommunications', en: 'Aix-Marseille University — BUT Networks & Telecommunications' },
    'edu.amu.meta': { fr: '2022 → 2025 (selon ton parcours)', en: '2022 → 2025' },
    'edu.amu.1': { fr: 'Réseaux, systèmes, télécoms, virtualisation, services et exploitation.', en: 'Networks, systems, telecoms, virtualization, services and operations.' },
    'edu.amu.2': { fr: 'Vie étudiante : Vice-Président du Conseil Étudiant (2023–2024) — leadership & organisation.', en: 'Student life: Vice-President of the Student Council (2023–2024) — leadership & organization.' },

    'edu.bac.title': { fr: 'Groupe Scolaire St-Louis / Ste-Marie — Bac STI2D (SIN) — Mention Très Bien', en: 'St-Louis / Ste-Marie School — Bac STI2D (SIN) — High Honors' },
    'edu.bac.meta': { fr: '2020 → 2021', en: '2020 → 2021' },
    'edu.bac.1': { fr: 'Spécialité systèmes d\'information & numérique : bases réseau, électronique, projets.', en: 'Information systems & digital specialty: network basics, electronics, projects.' },

    'edu.insa.title': { fr: 'INSA Lyon — Parcours Ingénierie (Master / Engineering)', en: 'INSA Lyon — Engineering Program (Master / Engineering)' },
    'edu.insa.meta': { fr: 'août 2021 → juin 2022', en: 'Aug 2021 → Jun 2022' },
    'edu.insa.1': { fr: 'Base scientifique & ingénierie, travail en équipe et projets.', en: 'Scientific & engineering fundamentals, teamwork and projects.' },

    // --- SKILLS ---
    'skills.hint': { fr: 'Glisse pour faire tourner, clique sur une compétence pour les détails.', en: 'Drag to rotate, click a skill for details.' },
    'skills.desc.linux': { fr: 'Administration, durcissement, services, exploitation et troubleshooting.', en: 'Administration, hardening, services, operations and troubleshooting.' },
    'skills.desc.network': { fr: 'VLAN, routage, switching, design, segmentation et diagnostic L2/L3.', en: 'VLAN, routing, switching, design, segmentation and L2/L3 diagnostics.' },
    'skills.desc.python': { fr: 'Automatisation, scripts, intégrations API, tooling et maintenance.', en: 'Automation, scripts, API integrations, tooling and maintenance.' },
    'skills.desc.flask': { fr: 'Apps internes (bastion), API, templates, logique backend et intégrations.', en: 'Internal apps (bastion), API, templates, backend logic and integrations.' },
    'skills.desc.docker': { fr: 'Build, images, compose, isolation, bonnes pratiques de déploiement.', en: 'Build, images, compose, isolation, deployment best practices.' },
    'skills.desc.ansible': { fr: 'Provisioning, post-install, standardisation, idempotence et automatisation d\'infra.', en: 'Provisioning, post-install, standardization, idempotence and infrastructure automation.' },
    'skills.desc.nutanix': { fr: 'Opérations VM, templates, automatisation via Prism API et exploitation.', en: 'VM operations, templates, automation via Prism API and operations.' },
    'skills.desc.security': { fr: 'Hardening, contrôle d\'accès, segmentation, hygiène et défense en profondeur.', en: 'Hardening, access control, segmentation, hygiene and defense in depth.' },
    'skills.desc.reverseproxy': { fr: 'Nginx/Apache, TLS, vhosts, routage applicatif et sécurisation d\'exposition.', en: 'Nginx/Apache, TLS, vhosts, application routing and exposure security.' },
    'skills.desc.nmap': { fr: 'Découverte réseau, audit de surface d\'attaque, inventaire et troubleshooting.', en: 'Network discovery, attack surface audit, inventory and troubleshooting.' },
    'skills.desc.wireshark': { fr: 'Analyse de trames, diagnostic applicatif/réseau, compréhension des échanges.', en: 'Frame analysis, application/network diagnostics, exchange comprehension.' },
    'skills.desc.glpi': { fr: 'Inventaire, suivi, base de connaissance et automatisation via API.', en: 'Inventory, tracking, knowledge base and API automation.' },
    'skills.desc.pfsense': { fr: 'Firewall, NAT, VPN, règles, segmentation et services réseau.', en: 'Firewall, NAT, VPN, rules, segmentation and network services.' },
    'skills.desc.opnsense': { fr: 'Firewall, IDS/IPS, politiques réseau, durcissement et segmentation.', en: 'Firewall, IDS/IPS, network policies, hardening and segmentation.' },
    'skills.desc.nextcloud': { fr: 'Collaboration, stockage, durcissement, intégration et exploitation.', en: 'Collaboration, storage, hardening, integration and operations.' },
    'skills.desc.yealink': { fr: 'Déploiement/administration VoIP, postes, provisioning et supervision.', en: 'VoIP deployment/administration, endpoints, provisioning and monitoring.' },
    'skills.desc.prtg': { fr: 'Supervision, capteurs, alerting, dashboards et suivi de performance.', en: 'Monitoring, sensors, alerting, dashboards and performance tracking.' },
    'skills.desc.stormshield': { fr: 'Administration et règles de sécurité (FW), politiques, VPN et exploitation.', en: 'Security administration and rules (FW), policies, VPN and operations.' },
    'skills.desc.portainer': { fr: 'Gestion de stacks, déploiements Docker, environnements et RBAC.', en: 'Stack management, Docker deployments, environments and RBAC.' },
    'skills.desc.proxmox': { fr: 'Virtualisation, clusters, stockage, snapshots et exploitation.', en: 'Virtualization, clusters, storage, snapshots and operations.' },
    'skills.desc.phpipam': { fr: 'Gestion d\'adressage IP, inventaire réseau et intégration outillée.', en: 'IP address management, network inventory and tooled integration.' },
    'skills.desc.vmware': { fr: 'Virtualisation, templates, exploitation et intégration (environnements pro).', en: 'Virtualization, templates, operations and integration (enterprise environments).' },
    'skills.desc.ubiquiti': { fr: 'Wi‑Fi/réseau (UniFi), adoption, configuration, supervision et maintenance.', en: 'Wi‑Fi/network (UniFi), adoption, configuration, monitoring and maintenance.' },
    'skills.desc.graylog': { fr: 'Centralisation de logs, parsing, alerting et investigation.', en: 'Log centralization, parsing, alerting and investigation.' },
    'skills.desc.grafana': { fr: 'Dashboards, visualisation, métriques et observabilité.', en: 'Dashboards, visualization, metrics and observability.' },
    'skills.desc.comfyui': { fr: 'Workflows IA visuels par nœuds, automatisation de pipelines et itérations reproductibles.', en: 'Node-based visual AI workflows, pipeline automation and reproducible iterations.' },
    'skills.desc.openwebui': { fr: 'Interface auto-hébergée pour LLMs, connexion à Ollama et APIs compatibles, gestion des utilisateurs et workflows.', en: 'Self-hosted interface for LLMs, connection to Ollama and compatible APIs, user management and workflows.' },
    'skills.desc.openclaw': { fr: 'Exploration d\'agents IA capables d\'orchestrer des tâches, avec cadrage strict des permissions et des usages.', en: 'Exploration of AI agents capable of orchestrating tasks, with strict permission and usage framing.' },
    'skills.desc.lmstudio': { fr: 'Exécution et comparaison de modèles locaux, notamment avec backend Vulkan sur machines non CUDA.', en: 'Local model execution and comparison, notably with Vulkan backend on non-CUDA machines.' },
    'skills.desc.vulkan': { fr: 'Backend d\'accélération graphique exploité pour tester l\'inférence locale sur GPU compatibles.', en: 'Graphics acceleration backend used to test local inference on compatible GPUs.' },
    'skills.desc.ollama': { fr: 'Service local pour télécharger, servir et intégrer des modèles LLM dans une stack privée.', en: 'Local service to download, serve and integrate LLM models in a private stack.' },
    'skills.default.desc': { fr: 'Compétence utilisée en contexte d\'exploitation, d\'automatisation et de production.', en: 'Skill used in operations, automation and production contexts.' },

    // --- AI SECTION ---
    'ai.kicker': { fr: 'Lab personnel', en: 'Personal Lab' },
    'ai.lede.title': { fr: 'Interfaces, agents et inférence locale', en: 'Interfaces, Agents & Local Inference' },
    'ai.lede.p1': { fr: 'Je travaille autour d\'une stack IA auto-hébergeable : interfaces LLM, workflows génératifs, agents outillés et exécution locale de modèles. L\'objectif est de garder la main sur les données, les coûts, les performances et l\'intégration avec l\'infrastructure existante.', en: 'I work around a self-hostable AI stack: LLM interfaces, generative workflows, tooled agents and local model execution. The goal is to keep control over data, costs, performance and integration with existing infrastructure.' },
    'ai.lede.p2': { fr: 'Les expérimentations couvrent Open WebUI avec Ollama, ComfyUI pour les pipelines visuels, OpenClaw pour les usages agentiques, et LM Studio sur backend Vulkan pour exploiter du matériel local quand CUDA n\'est pas l\'option la plus naturelle.', en: 'Experiments cover Open WebUI with Ollama, ComfyUI for visual pipelines, OpenClaw for agentic uses, and LM Studio on Vulkan backend to leverage local hardware when CUDA isn\'t the most natural choice.' },
    'ai.stack.title': { fr: 'Stack suivie', en: 'Tracked Stack' },
    'ai.stack.gpulocal': { fr: 'GPU local', en: 'Local GPU' },
    'ai.project.owu.title': { fr: 'Open WebUI + Ollama', en: 'Open WebUI + Ollama' },
    'ai.project.owu.desc': { fr: 'Portail privé pour discuter avec des modèles locaux, gérer plusieurs backends et exposer une API interne propre.', en: 'Private portal to chat with local models, manage multiple backends and expose a clean internal API.' },
    'ai.project.comfy.title': { fr: 'ComfyUI', en: 'ComfyUI' },
    'ai.project.comfy.desc': { fr: 'Workflows images et automatisation de pipelines par nœuds, avec versions reproductibles et expérimentation rapide.', en: 'Image workflows and node-based pipeline automation, with reproducible versions and rapid experimentation.' },
    'ai.project.comfy.tag1': { fr: 'Diffusion', en: 'Diffusion' },
    'ai.project.comfy.tag2': { fr: 'Nodes', en: 'Nodes' },
    'ai.project.lmstudio.title': { fr: 'LM Studio + Vulkan', en: 'LM Studio + Vulkan' },
    'ai.project.lmstudio.desc': { fr: 'Tests de modèles locaux sur machines non CUDA, comparaison des performances et choix du bon backend d\'inférence.', en: 'Local model testing on non-CUDA machines, performance comparison and proper inference backend selection.' },
    'ai.project.lmstudio.tag1': { fr: 'Local LLM', en: 'Local LLM' },
    'ai.project.lmstudio.tag2': { fr: 'Bench', en: 'Bench' },
    'ai.project.agents.title': { fr: 'OpenClaw & agents', en: 'OpenClaw & Agents' },
    'ai.project.agents.desc': { fr: 'Exploration d\'agents capables d\'orchestrer des tâches, avec attention particulière aux permissions et aux limites de sécurité.', en: 'Exploration of agents capable of orchestrating tasks, with special attention to permissions and security boundaries.' },
    'ai.project.agents.tag1': { fr: 'Agents', en: 'Agents' },
    'ai.project.agents.tag2': { fr: 'Automation', en: 'Automation' },
    'ai.project.agents.tag3': { fr: 'SecOps', en: 'SecOps' },

    // --- PROJECTS ---
    'project.nutanix.title': { fr: 'Fabrique de VMs Nutanix', en: 'Nutanix VM Factory' },
    'project.nutanix.desc': { fr: 'Déploiement automatisé de machines virtuelles via GLPI, Prism API & Ansible.', en: 'Automated virtual machine deployment via GLPI, Prism API & Ansible.' },
    'project.bastion.title': { fr: 'Bastion Web DevOps', en: 'DevOps Web Bastion' },
    'project.bastion.desc': { fr: 'Portail sécurisé pour l\'accès centralisé aux outils cloud & infrastructure.', en: 'Secure portal for centralized access to cloud & infrastructure tools.' },
    'project.squad.title': { fr: 'Administration Squad', en: 'Administration Squad' },
    'project.squad.desc': { fr: 'Système RCON & Discord pour modération temps réel et logs intelligents.', en: 'RCON & Discord system for real-time moderation and smart logging.' },
    'project.nextcloud.title': { fr: 'Cloud HDS Nextcloud', en: 'Cloud HDS Nextcloud' },
    'project.nextcloud.desc': { fr: 'Architecture conforme HDS & ISO 27001 pour hébergement sécurisé.', en: 'HDS & ISO 27001 compliant architecture for secure hosting.' },
    'project.ailab.title': { fr: 'Lab IA locale', en: 'Local AI Lab' },
    'project.ailab.desc': { fr: 'Open WebUI, Ollama, LM Studio/Vulkan, ComfyUI et agents OpenClaw en environnement maîtrisé.', en: 'Open WebUI, Ollama, LM Studio/Vulkan, ComfyUI and OpenClaw agents in a controlled environment.' },
    'project.stl.title': { fr: 'Impression 3D (Galerie)', en: '3D Printing (Gallery)' },
    'project.stl.desc': { fr: 'Bibliothèque de modèles + paramètres d\'impression, avec aperçu 3D (STL/Three.js).', en: 'Model library + printing parameters, with 3D preview (STL/Three.js).' },

    // --- PROFILES ---
    'profiles.github.kicker': { fr: 'Dépôts publics', en: 'Public Repos' },
    'profiles.github.title': { fr: 'GitHub — Bl3aven', en: 'GitHub — Bl3aven' },
    'profiles.github.link': { fr: 'Voir GitHub', en: 'View GitHub' },
    'profiles.github.loading': { fr: 'Chargement des projets publics GitHub...', en: 'Loading public GitHub projects...' },
    'profiles.linkedin.kicker': { fr: 'Profil pro', en: 'Professional Profile' },
    'profiles.linkedin.title': { fr: 'LinkedIn', en: 'LinkedIn' },
    'profiles.linkedin.link': { fr: 'Voir LinkedIn', en: 'View LinkedIn' },
    'profiles.linkedin.identity': { fr: 'DevOps, Cloud & IA Engineer', en: 'DevOps, Cloud & AI Engineer' },
    'profiles.linkedin.desc': { fr: 'Profil professionnel public : expériences, certifications, réseau et actualités techniques.', en: 'Public professional profile: experience, certifications, network and technical updates.' },
    'profiles.linkedin.cta': { fr: 'Consulter le profil LinkedIn', en: 'View LinkedIn Profile' },
    'profiles.linkedin.summary': { fr: 'Aperçu rapide du profil professionnel : parcours, alternance, compétences Cloud, DevOps, infrastructure et IA locale.', en: 'Quick professional profile overview: background, apprenticeship, Cloud, DevOps, infrastructure and local AI skills.' },
    'profiles.linkedin.position': { fr: 'Positionnement', en: 'Positioning' },
    'profiles.linkedin.position.value': { fr: 'DevOps, Cloud & IA Engineer', en: 'DevOps, Cloud & AI Engineer' },
    'profiles.linkedin.formation': { fr: 'Formation', en: 'Education' },
    'profiles.linkedin.formation.value': { fr: 'Apprenti ingénieur ISEN', en: 'ISEN Engineering Apprentice' },
    'profiles.linkedin.focus': { fr: 'Focus', en: 'Focus' },
    'profiles.linkedin.focus.value': { fr: 'Automatisation, cybersécurité, LLM local, supervision', en: 'Automation, cybersecurity, local LLM, monitoring' },

    // --- INTERESTS ---
    'interest.ai.title': { fr: 'IA locale & agents', en: 'Local AI & Agents' },
    'interest.ai.desc': { fr: 'Veille et expérimentation autour d\'Open WebUI, ComfyUI, Ollama, LM Studio, Vulkan et agents outillés pour automatiser sans perdre la maîtrise des données.', en: 'Watch and experimentation around Open WebUI, ComfyUI, Ollama, LM Studio, Vulkan and tooled agents to automate without losing data control.' },
    'interest.cloud.title': { fr: 'Cloud & Infrastructure', en: 'Cloud & Infrastructure' },
    'interest.cloud.desc': { fr: 'Architecture, haute disponibilité, supervision, industrialisation et optimisation des environnements.', en: 'Architecture, high availability, monitoring, industrialization and environment optimization.' },
    'interest.security.title': { fr: 'Cybersécurité', en: 'Cybersecurity' },
    'interest.security.desc': { fr: 'Durcissement Linux, segmentation réseau, reverse proxy, bonnes pratiques, approche défense en profondeur.', en: 'Linux hardening, network segmentation, reverse proxy, best practices, defense in depth approach.' },
    'interest.homelab.title': { fr: 'Homelab & Automatisation', en: 'Homelab & Automation' },
    'interest.homelab.desc': { fr: 'Infrastructure perso (VMs, containers, reverse proxy, monitoring), scripts et standardisation des déploiements.', en: 'Personal infrastructure (VMs, containers, reverse proxy, monitoring), scripts and deployment standardization.' },
    'interest.communities.title': { fr: 'Serveurs & Communautés', en: 'Servers & Communities' },
    'interest.communities.desc': { fr: 'Administration serveur (RCON / Discord), automatisation, outils de modération et observabilité.', en: 'Server administration (RCON / Discord), automation, moderation tools and observability.' },

    // --- CONTACT ---
    'contact.text': { fr: 'Ouvert aux opportunités professionnelles Cloud, DevOps, infrastructure & IA locale.', en: 'Open to professional opportunities in Cloud, DevOps, infrastructure & local AI.' },

    // --- FOOTER ---
    'footer.copyright': { fr: '© 2026 — Mathys Tournayre', en: '© 2026 — Mathys Tournayre' },

    // --- CV MODAL ---
    'cv.title': { fr: 'CV — Mathys Tournayre', en: 'CV — Mathys Tournayre' },
    'cv.download': { fr: 'Télécharger', en: 'Download' },

    // --- STL MODAL ---
    'stl.title': { fr: 'Impression 3D — Galerie', en: '3D Printing — Gallery' },
    'stl.hint': { fr: 'Clique sur une carte pour manipuler l\'aperçu 3D (rotation auto). Clique sur la zone 3D pour ouvrir en plein écran. Échap pour fermer.', en: 'Click a card to manipulate the 3D preview (auto-rotate). Click the 3D area to open full screen. Esc to close.' },
    'stl.loading': { fr: 'Chargement du modèle…', en: 'Loading model…' },
    'stl.error': { fr: 'Erreur de chargement STL', en: 'STL loading error' },

    // --- ASSISTANT ---
    'assistant.header': { fr: 'Assistant Mathys', en: 'Mathys Assistant' },
    'assistant.welcome.1': { fr: 'Salut !', en: 'Hi there!' },
    'assistant.welcome.2': { fr: 'Pour démarrer la discussion, indique au moins ton prénom. Le nom et le téléphone sont facultatifs.', en: 'To start the conversation, please provide at least your first name. Last name and phone are optional.' },
    'assistant.firstname.label': { fr: 'Prénom *', en: 'First name *' },
    'assistant.lastname.label': { fr: 'Nom', en: 'Last name' },
    'assistant.phone.label': { fr: 'Téléphone', en: 'Phone' },
    'assistant.start.btn': { fr: 'Démarrer la discussion', en: 'Start conversation' },
    'assistant.nothanks.btn': { fr: 'Non merci', en: 'No thanks' },
    'assistant.error.firstname': { fr: 'Le prénom est nécessaire pour démarrer la discussion.', en: 'First name is required to start the conversation.' },
    'assistant.preparing': { fr: 'Préparation de la discussion...', en: 'Preparing the conversation...' },
    'assistant.error.start': { fr: 'Impossible de démarrer la discussion.', en: 'Unable to start the conversation.' },
    'assistant.ready': { fr: 'Parfait ! Tu peux m\'écrire ici, je te répondrai très vite.', en: 'Great! You can write to me here, I\'ll get back to you very quickly.' },
    'assistant.error.timeout': { fr: 'La discussion ne répond pas pour le moment. Tu peux réessayer ou m\'écrire par mail.', en: 'The conversation is not responding right now. You can try again or write to me by email.' },
    'assistant.retry': { fr: 'Réessayer', en: 'Try again' },
    'assistant.input.placeholder': { fr: 'Écris ton message...', en: 'Write your message...' },
    'assistant.send.btn': { fr: 'Envoyer', en: 'Send' },
    'assistant.you': { fr: 'Toi', en: 'You' },
    'assistant.assistant': { fr: 'Assistant', en: 'Assistant' },
    'assistant.error.sent': { fr: 'Message non envoyé.', en: 'Message not sent.' },
    'assistant.error.transmit': { fr: 'Le message n\'a pas été transmis. Réessaie dans quelques instants.', en: 'The message was not transmitted. Please try again in a moment.' },

    // --- GITHUB REPO WIDGET ---
    'github.updated': { fr: 'MAJ', en: 'Updated' },
    'github.recently': { fr: 'Mis à jour récemment', en: 'Updated recently' },
    'github.fallback': { fr: 'Dépôt public GitHub à consulter.', en: 'Public GitHub repository to explore.' },

    // --- CERT DATA ---
    'cert.ccnp.title': { fr: 'CCNP Core Networking', en: 'CCNP Core Networking' },
    'cert.ccnp.desc': { fr: 'Certification Cisco orientée routage & switching avancés (niveau pro).', en: 'Cisco certification focused on advanced routing & switching (professional level).' },
    'cert.cyberops.title': { fr: 'Cisco CyberOps Associate', en: 'Cisco CyberOps Associate' },
    'cert.cyberops.desc': { fr: 'Compétences SOC, analyse d\'alertes, sécurité opérationnelle.', en: 'SOC skills, alert analysis, operational security.' },
    'cert.aws.title': { fr: 'AWS Academy Cloud Foundations', en: 'AWS Academy Cloud Foundations' },
    'cert.aws.desc': { fr: 'Fondamentaux cloud AWS : services, sécurité, architecture, bonnes pratiques.', en: 'AWS cloud fundamentals: services, security, architecture, best practices.' },
    'cert.csne.title': { fr: 'Stormshield CSNE', en: 'Stormshield CSNE' },
    'cert.csne.desc': { fr: 'Expertise pare-feu Stormshield : design, sécurité, exploitation.', en: 'Stormshield firewall expertise: design, security, operations.' },
    'cert.csna.title': { fr: 'Stormshield CSNA', en: 'Stormshield CSNA' },
    'cert.csna.desc': { fr: 'Administration réseau & sécurité Stormshield (niveau administrateur).', en: 'Stormshield network & security administration (administrator level).' },
    'cert.pix.title': { fr: 'PIX', en: 'PIX' },
    'cert.pix.desc': { fr: 'Certification de compétences numériques (PIX).', en: 'Digital skills certification (PIX).' },
    'cert.secnum.title': { fr: 'SecNum (MOOC) — ANSSI', en: 'SecNum (MOOC) — ANSSI' },
    'cert.secnum.desc': { fr: 'Sensibilisation cybersécurité : menaces, hygiène, risques, bonnes pratiques.', en: 'Cybersecurity awareness: threats, hygiene, risks, best practices.' },
    'cert.bai.title': { fr: 'Brevet d\'initiation aéronautique', en: 'Aeronautical Initiation Certificate' },
    'cert.bai.desc': { fr: 'Culture aéronautique : bases techniques, réglementation, facteurs humains.', en: 'Aeronautical culture: technical basics, regulations, human factors.' },
    'cert.verify': { fr: 'Vérifier (Credly)', en: 'Verify (Credly)' },

    // --- STL Library ---
    'stl.item1.name': { fr: 'Support caméra (prototype)', en: 'Camera Mount (prototype)' },
    'stl.item1.subtitle': { fr: 'Pièce rigide + légère (usage intérieur).', en: 'Rigid + lightweight part (indoor use).' },
    'stl.item2.name': { fr: 'Clip câble (pack x6)', en: 'Cable Clip (pack x6)' },
    'stl.item2.subtitle': { fr: 'Accessoire bureau — impression rapide.', en: 'Desk accessory — quick print.' },
    'stl.item3.name': { fr: 'Bouton moleté (M6)', en: 'Knurled Knob (M6)' },
    'stl.item3.subtitle': { fr: 'Bonne résistance mécanique (atelier).', en: 'Good mechanical strength (workshop).' },

    // --- Language Switcher ---
    'lang.tooltip': { fr: 'Switch to English', en: 'Passer en Français' }
  };

  // =====================
  // DÉTECTION DE LANGUE
  // =====================
  function detectLang(){
    // 1. localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;

    // 2. navigator.language
    const navLang = (navigator.language || navigator.userLanguage || '').split('-')[0].toLowerCase();
    if (SUPPORTED.includes(navLang)) return navLang;

    return DEFAULT_LANG;
  }

  // =====================
  // EXPOSITION GLOBALE
  // =====================
  let currentLang = detectLang();

  window.__i18n = {
    get lang(){ return currentLang; },
    set lang(val){
      if (!SUPPORTED.includes(val)) return;
      if (val === currentLang) return;
      currentLang = val;
      localStorage.setItem(STORAGE_KEY, val);
      applyTranslations();
      if (typeof window.__onLangChange === 'function') window.__onLangChange(val);
    },

    t(key, fallback){
      const entry = dict[key];
      if (!entry) return fallback || key;
      return entry[currentLang] || entry[DEFAULT_LANG] || fallback || key;
    },

    getDict(){ return dict; }
  };

  // =====================
  // APPLICATION DES TRADUCTIONS AU DOM
  // =====================
  function applyTranslations(){
    const lang = currentLang;
    document.documentElement.lang = lang;

    // 1. Éléments avec data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const entry = dict[key];
      if (!entry) return;
      const text = entry[lang] || entry[DEFAULT_LANG];
      if (text === undefined) return;

      // Si le texte contient du HTML (ex: <br>, <b>, <span>), on utilise innerHTML
      if (/<[a-z][\s\S]*>/i.test(text)) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    // 2. Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const entry = dict[key];
      if (!entry) return;
      el.placeholder = entry[lang] || entry[DEFAULT_LANG] || '';
    });

    // 3. Meta tags
    document.querySelectorAll('[data-i18n-meta]').forEach(el => {
      const key = el.getAttribute('data-i18n-meta');
      const attr = el.getAttribute('data-i18n-attr') || 'content';
      const entry = dict[key];
      if (!entry) return;
      el.setAttribute(attr, entry[lang] || entry[DEFAULT_LANG] || '');
    });

    // 4. Titre de la page
    const title = dict['meta.og.title'];
    if (title) {
      document.title = (title[lang] || title[DEFAULT_LANG] || '').replace(/&/g, '&');
    }

    // 5. Mettre à jour les liens CV
    const cvIframe = document.querySelector('.cv-preview iframe');
    if (cvIframe) {
      const cvUrl = lang === 'en' ? 'cv-mathys-tournayre-en.html?modal=1' : 'cv-mathys-tournayre.html?modal=1';
      if (cvIframe.getAttribute('src') !== cvUrl) {
        cvIframe.setAttribute('src', cvUrl);
      }
    }

    const cvDownload = document.querySelector('.cv-download');
    if (cvDownload) {
      const cvPdf = lang === 'en' ? 'cv-tournayre-en-2026.pdf' : 'cv-tournayre-fr-2026.pdf';
      cvDownload.setAttribute('href', cvPdf);
    }

    // 6. LinkedIn badge locale
    const liBadge = document.querySelector('.LI-profile-badge');
    if (liBadge) {
      liBadge.setAttribute('data-locale', lang === 'en' ? 'en_US' : 'fr_FR');
    }
  }

  // =====================
  // INITIALISATION
  // =====================
  function init(){
    applyTranslations();

    // Injecter le language switcher dans la nav
    // Désactivé — le bouton EN/FR n'est plus affiché
    // injectLangSwitcher();
  }

  function injectLangSwitcher(){
    const navInner = document.querySelector('.nav-inner');
    if (!navInner) return;

    // Éviter les doublons
    if (document.getElementById('langSwitcher')) return;

    const otherLang = currentLang === 'fr' ? 'en' : 'fr';
    const label = currentLang === 'fr' ? 'EN' : 'FR';
    const tooltipKey = 'lang.tooltip';

    const btn = document.createElement('button');
    btn.id = 'langSwitcher';
    btn.className = 'lang-switcher';
    btn.setAttribute('data-i18n-title', tooltipKey);
    btn.setAttribute('aria-label', dict[tooltipKey] ? (dict[tooltipKey][currentLang] || '') : '');
    btn.textContent = label;
    btn.type = 'button';

    btn.addEventListener('click', () => {
      window.__i18n.lang = otherLang;
    });

    // Style inline (léger, ou via une classe globale)
    btn.style.cssText = `
      background: rgba(255,159,67,0.15);
      border: 1px solid rgba(255,159,67,0.4);
      color: #ff9f43;
      border-radius: 8px;
      padding: 4px 10px;
      font-size: 0.78rem;
      font-weight: 800;
      cursor: pointer;
      letter-spacing: 0.04em;
      transition: all 0.2s ease;
      margin: 0 0.5rem;
      white-space: nowrap;
      min-width: 38px;
      text-align: center;
    `;

    btn.addEventListener('mouseenter', () => {
      btn.style.background = 'rgba(255,159,67,0.28)';
      btn.style.transform = 'translateY(-1px)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'rgba(255,159,67,0.15)';
      btn.style.transform = 'translateY(0)';
    });

    // Insérer à côté du logo dans la nav-inner (grid: 1fr auto 1fr)
    // On le place dans le logo area pour qu'il soit centré avec le logo
    const existingSwitchers = navInner.querySelectorAll('.lang-switcher-wrap');
    if (existingSwitchers.length === 0) {
      const wrap = document.createElement('div');
      wrap.className = 'lang-switcher-wrap';
      wrap.style.cssText = 'display:flex; align-items:center; justify-content:center; gap:0.5rem;';

      // Déplacer le logo et le bouton dans le wrapper
      const logo = navInner.querySelector('.nav-logo');
      if (logo) {
        logo.parentNode.insertBefore(wrap, logo);
        wrap.appendChild(logo);
        wrap.appendChild(btn);
      } else {
        // Fallback: insérer dans nav-left
        const navLeft = navInner.querySelector('.nav-left');
        if (navLeft) navLeft.appendChild(btn);
      }
    }

    // Mettre à jour le bouton au changement de langue
    const origChange = window.__onLangChange;
    window.__onLangChange = function(newLang){
      const o = newLang === 'fr' ? 'en' : 'fr';
      btn.textContent = newLang === 'fr' ? 'EN' : 'FR';
      btn.setAttribute('aria-label', dict[tooltipKey] ? (dict[tooltipKey][newLang] || '') : '');
      if (typeof origChange === 'function') origChange(newLang);
    };
  }

  // Démarrage au DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();