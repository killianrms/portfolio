# Portfolio de Killian Ramus

Bienvenue sur le dépôt GitHub du code source de mon portfolio personnel. Ce site web sert de vitrine pour présenter mon parcours académique, mes compétences techniques, ainsi que les projets sur lesquels j'ai travaillé.

**Site en ligne :** [killianrms.com](https://killianrms.com/)

## ✨ Fonctionnalités

Ce portfolio a été développé avec une attention particulière portée à l'expérience utilisateur et à la présentation des informations :

### 🏠 Page Principale
*   **Présentation Complète :** Sections dédiées à ma biographie, mon parcours de formation (BUT Informatique), et mes compétences techniques (langages, OS, outils).
*   **Galerie de Projets Dynamique :**
    *   Affichage des projets personnels et universitaires.
    *   Filtrage des projets par catégorie avec animations fluides.
    *   Fenêtres modales pour afficher les détails de chaque projet (description, technologies, lien vers le dépôt GitHub).
    *   Effets de survol interactifs sur les cartes de projet.
*   **Design Responsive :** Interface adaptée à tous les types d'écrans (ordinateur, tablette, mobile).
*   **Thème Clair / Sombre :** Possibilité de basculer entre un thème clair et un thème sombre, avec sauvegarde de la préférence dans le `localStorage` du navigateur.
*   **Animations et Transitions :**
    *   Effet machine à écrire pour l'affichage du nom.
    *   Animations au défilement pour les éléments de timeline et compétences.
    *   Transitions fluides avec courbes de Bézier personnalisées.
    *   Effets de survol sophistiqués sur tous les éléments interactifs.
*   **Interactivité :**
    *   Calcul et affichage dynamique de mon âge.
    *   Navigation fluide entre les différentes sections (style Single Page Application).
    *   Sidebar rétractable en vue mobile pour les informations de contact.
*   **Formulaire de Contact Fonctionnel :** Formulaire avec validation côté client et envoi des messages via AJAX.

### 📚 Portfolio d'Apprentissage
*   **Validation des Compétences BUT :** Documentation complète des compétences du Niveau 2 - Parcours DACS (Développement d'Applications et Conception de Systèmes).
*   **Navigation par Onglets :** Organisation claire en 3 compétences principales :
    *   **Optimiser :** Analyser et améliorer la qualité et la performance d'applications
    *   **Gérer :** Concevoir et exploiter des bases de données de manière efficace et sécurisée
    *   **Conduire :** Planifier et piloter les différentes phases d'un projet informatique
*   **Système d'Accordéons Interactifs :** Chaque Activité/Compétence (AC) est présentée dans un accordéon déployable pour une navigation optimisée.
*   **Critères d'Évaluation Cliquables :** Les références CE sont interactives et affichent leurs descriptions dans des modales popup.
*   **Justifications Détaillées :** Chaque projet est associé à ses CE/AC correspondants avec des explications techniques précises.
*   **Design Moderne :** Interface épurée avec cartes projet, dégradés, et animations fluides.

## 🛠️ Technologies utilisées

Le projet est construit avec les technologies web standard :

*   **HTML5 :** Structure sémantique du contenu.
*   **CSS3 :** Mise en forme, design responsive, animations et gestion des thèmes (clair/sombre) via des variables CSS.
*   **JavaScript (ES6+) :** Interactivité, manipulation du DOM, filtrage des projets, gestion des modales, basculement de thème, calcul de l'âge, et soumission AJAX du formulaire de contact.

## 📂 Structure du projet

Le code source est organisé comme suit :

```
/
├── index.html                           # Page principale du portfolio
├── portfolio-apprentissage.html        # Portfolio d'apprentissage (validation BUT)
├── README.md                           # Ce fichier
├── cv.pdf                              # Mon Curriculum Vitae
├── sitemap.xml                         # Plan du site pour le référencement
├── favicon.ico                         # Icône du site
└── assets/
    ├── css/
    │   ├── style.css                   # Styles principaux (responsive, thèmes)
    │   ├── portfolio-layout.css        # Layout spécifique au portfolio
    │   ├── portfolio-apprentissage-style.css  # Styles pour le portfolio d'apprentissage
    │   ├── modern-enhancements.css     # Améliorations visuelles modernes
    │   ├── mobile-enhancements.css     # Optimisations mobiles
    │   └── typography-improvements.css  # Améliorations typographiques
    ├── js/
    │   ├── script.js                   # Logique principale (filtrage, modales, thèmes)
    │   ├── portfolio-apprentissage-script.js  # Interactions pour le portfolio BUT
    │   ├── modern-interactions.js      # Interactions avancées
    │   └── performance-optimizations.js # Optimisations de performance
    └── images/
        ├── skills/                     # Logos des compétences techniques
        └── *.webp                      # Images optimisées des projets
```

## 🚀 Comment lancer le projet localement

Aucune étape de build n'est nécessaire pour visualiser ce projet.

1.  **Clonez ce dépôt :**
    ```bash
    git clone https://github.com/killianrms/portfolio.git
    ```
2.  **Accédez au dossier du projet :**
    ```bash
    cd portfolio
    ```
3.  **Ouvrez le fichier `index.html`** directement dans votre navigateur web préféré.

## 📋 Pages disponibles

*   **Page principale :** `index.html` - Portfolio complet avec projets et compétences
*   **Portfolio d'apprentissage :** `portfolio-apprentissage.html` - Validation des compétences BUT avec CE/AC détaillés

## 🤝 Contributions

Les suggestions d'amélioration ou les rapports de bugs sont les bienvenus. N'hésitez pas à ouvrir une *issue* ou à proposer une *pull request*.

## 👤 Auteur

*   **Killian Ramus**
    *   GitHub : [@killianrms](https://github.com/killianrms)
    *   LinkedIn : [Killian Ramus](https://www.linkedin.com/in/killianrms/)
