'use strict';

// Attend que le DOM soit entièrement chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', () => {

  // IIFE pour encapsuler le script et éviter la pollution de la portée globale
  (function() {

    // --- Fonctions Utilitaires ---

    /**
     * Bascule la classe 'active' sur un élément DOM donné.
     * @param {Element} elem - L'élément sur lequel basculer la classe.
     */
    const elementToggleFunc = function (elem) {
      elem.classList.toggle("active");
    }

    // --- Barre Latérale ---

    const sidebar = document.querySelector("[data-sidebar]");
    const sidebarBtn = document.querySelector("[data-sidebar-btn]");

    if (sidebar && sidebarBtn) {
      // Fonctionnalité de basculement de la barre latérale pour mobile
      sidebarBtn.addEventListener("click", function () {
        elementToggleFunc(sidebar);
        // Basculer l'attribut aria-expanded
        const isExpanded = sidebar.classList.contains("active");
        sidebarBtn.setAttribute('aria-expanded', isExpanded);
      });
    }

    // --- Filtrage du Portfolio ---

    const filterList = document.querySelector(".filter-list");
    const filterButtons = document.querySelectorAll(".filter-list button");
    const projectItems = document.querySelectorAll(".project-item");

    if (filterList && filterButtons.length > 0 && projectItems.length > 0) {
      filterList.addEventListener("click", (event) => {
        const clickedButton = event.target.closest("button");

        // Quitter si le clic n'était pas sur un bouton dans la liste
        if (!clickedButton || !filterList.contains(clickedButton)) {
          return;
        }

        const filterValue = clickedButton.dataset.filter;

        // Mettre à jour l'état du bouton actif
        filterButtons.forEach(button => {
          button.classList.remove("active");
        });
        clickedButton.classList.add("active");

        // Filtrer les éléments du projet
        projectItems.forEach(item => {
          const itemCategory = item.dataset.category;

          if (filterValue === "all" || filterValue === itemCategory) {
            // Afficher l'élément (réinitialiser le style d'affichage permet au CSS de le contrôler)
            item.style.display = "";
          } else {
            // Masquer l'élément
            item.style.display = "none";
          }
        });
      });
    }

    // --- Calcul de l'Âge ---

    const ageElement = document.getElementById('age');
    if (ageElement) {
      const calculateAndDisplayAge = () => {
        const birthDate = new Date(2004, 5, 28); // Le mois est basé sur 0 (Juin = 5)
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        ageElement.textContent = age;
      };
      calculateAndDisplayAge();
    }


    // --- Formulaire de Contact ---

    const form = document.querySelector("[data-form]");
    const formInputs = document.querySelectorAll("[data-form-input]");
    const formBtn = document.querySelector("[data-form-btn]");
    const formStatus = document.querySelector(".form-status");

    if (form && formInputs.length > 0 && formBtn && formStatus) {
      // Retour de validation des entrées
      formInputs.forEach(input => {
        input.addEventListener("input", function () {
          const errorSpan = this.nextElementSibling;

          if (!this.checkValidity()) {
            this.classList.add("invalid");
            if (errorSpan && errorSpan.classList.contains('error-message')) {
              errorSpan.textContent = this.validationMessage;
            }
          } else {
            this.classList.remove("invalid");
            if (errorSpan && errorSpan.classList.contains('error-message')) {
              errorSpan.textContent = "";
            }
          }

          // Vérifier la validité globale du formulaire pour activer/désactiver le bouton de soumission
          formBtn.disabled = !form.checkValidity();
        });
      });

      // Soumission du formulaire AJAX
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        formBtn.disabled = true; // Désactiver le bouton pendant la soumission
        formStatus.style.display = "none"; // Masquer le statut précédent
        formStatus.textContent = "Envoi en cours..."; // Indiquer le traitement
        formStatus.style.color = "var(--light-gray)"; // Couleur neutre
        formStatus.style.display = "block";


        const formData = new FormData(form);
        const formAction = form.getAttribute("action");

        fetch(formAction, {
          method: "POST",
          body: formData,
          headers: { 'Accept': 'application/json' }
        })
        .then(response => {
          if (response.ok) {
            formStatus.innerHTML = "Merci ! Votre message a été envoyé.";
            formStatus.style.color = "var(--orange-yellow-crayola)"; // Couleur de succès
            form.reset();
            formInputs.forEach(input => input.classList.remove('invalid')); // Effacer les états de validation
            formBtn.disabled = true; // Garder désactivé après une réinitialisation réussie
          } else {
            return response.json().then(data => {
              let errorMessage = "Oups ! Une erreur s'est produite.";
              if (data && data.errors) {
                errorMessage = data.errors.map(error => error.message).join(", ");
              }
              throw new Error(errorMessage); // Lancer une erreur pour être attrapée ci-dessous
            }).catch(() => {
              // Attraper une erreur potentielle d'analyse JSON ou relancer une erreur générique
              throw new Error("Oups ! Une erreur serveur s'est produite.");
            });
          }
        })
        .catch(error => {
          formStatus.innerHTML = error.message || "Oups ! Une erreur réseau s'est produite.";
          formStatus.style.color = "var(--bittersweet-shimmer)"; // Couleur d'erreur
          formBtn.disabled = false; // Réactiver le bouton en cas d'erreur
        })
        .finally(() => {
           formStatus.style.display = "block"; // S'assurer que le statut est visible
           // Réactiver le bouton seulement si le formulaire est valide (peut être désactivé par l'événement d'entrée)
           if (form.checkValidity()) {
               formBtn.disabled = false;
           }
           // Si la réinitialisation a réussi, le bouton reste désactivé jusqu'à une nouvelle entrée
           if (formStatus.textContent.includes("Merci")) {
               formBtn.disabled = true;
           }
        });
      });
    }


    // --- Navigation des Pages ---

    const navigationLinks = document.querySelectorAll("[data-nav-link]");
    const pages = document.querySelectorAll("[data-page]");

    if (navigationLinks.length > 0 && pages.length > 0) {
      navigationLinks.forEach(link => {
        link.addEventListener("click", function () {
          const targetPage = this.innerHTML.toLowerCase();

          pages.forEach((page, index) => {
            const pageName = page.dataset.page;
            const correspondingLink = navigationLinks[index]; // Suppose que les liens et les pages sont dans un ordre correspondant

            if (targetPage === pageName) {
              page.classList.add("active");
              correspondingLink.classList.add("active");
            } else {
              page.classList.remove("active");
              correspondingLink.classList.remove("active");
            }
          });
          window.scrollTo(0, 0); // Faire défiler vers le haut lors du changement de page
        });
      });
    }


    // --- Basculement du Thème ---

    const themeBtn = document.querySelector("[data-theme-btn]");
    const htmlElement = document.documentElement;

    /**
     * Applique le thème spécifié en définissant l'attribut 'data-theme' sur l'élément <html>.
     * @param {string} theme - Le thème à appliquer ('light' ou 'dark').
     */
    const applyTheme = (theme) => {
      htmlElement.dataset.theme = theme;
      // Le CSS gère maintenant la visibilité de l'icône en fonction de l'attribut data-theme
    };

    /**
     * Bascule le thème entre 'light' et 'dark' et sauvegarde la préférence dans localStorage.
     */
    const toggleTheme = () => {
      const currentTheme = htmlElement.dataset.theme || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    };

    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);

      // Initialiser le thème au chargement
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        applyTheme(savedTheme);
      } else {
        // Par défaut, utiliser la préférence système ou 'dark' si la préférence n'est pas disponible/détectable
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
      }
    }


    // --- Gestion Générique des Modales ---

    /**
     * Ouvre une boîte de dialogue modale. Trouve l'overlay comme frère précédent.
     * @param {HTMLElement} modalElement - L'élément modal à ouvrir.
     */
    const openModal = function (modalElement) {
      if (!modalElement) return;
      const overlay = modalElement.closest('.modal-container')?.querySelector('.overlay'); // Trouver l'overlay dans le conteneur
      modalElement.closest('.modal-container')?.classList.add("active"); // Activer le conteneur
      // Envisager d'ajouter la gestion du focus ici
    }

    /**
     * Ferme une boîte de dialogue modale. Trouve l'overlay comme frère précédent.
     * @param {HTMLElement} modalElement - L'élément modal à fermer.
     */
    const closeModal = function (modalElement) {
      if (!modalElement) return;
      modalElement.closest('.modal-container')?.classList.remove("active"); // Désactiver le conteneur
      // Envisager de retourner le focus à l'élément déclencheur ici
    }

    // Délégation d'événements pour les déclencheurs de modales
    document.addEventListener('click', function (event) {
      const triggerButton = event.target.closest('[data-modal-trigger]');
      if (!triggerButton) return;

      const targetModalId = triggerButton.dataset.modalTrigger;
      // Trouver la *section* modale en utilisant l'attribut data-modal
      const modalElement = document.querySelector(`section[data-modal="${targetModalId}"]`);

      if (!modalElement) {
        console.error(`Modal section with data-modal="${targetModalId}" not found.`);
        return;
      }

      // Logique Spécifique à la Modale Projet
      if (targetModalId === 'project-details') {
        let dataSourceElement = null;

        // Check if the trigger button itself has the project data
        if (triggerButton.dataset.projectTitle) {
          dataSourceElement = triggerButton;
        } else {
          // Fallback to finding the closest .project-item
          dataSourceElement = triggerButton.closest(".project-item");
        }

        if (!dataSourceElement) {
            console.error("Could not find project data source for trigger:", triggerButton);
            return;
        }

        // Obtenir les données de l'élément projet
        const title = dataSourceElement.dataset.projectTitle || 'N/A';
        const category = dataSourceElement.dataset.projectCategory || 'N/A';
        const image = dataSourceElement.dataset.projectImage || '';
        const description = dataSourceElement.dataset.projectDescription || 'No description available.';
        const tech = dataSourceElement.dataset.projectTech || 'N/A';
        const link = dataSourceElement.dataset.projectLink || '#';

        // Get the role, group, and time information
        const role = dataSourceElement.dataset.projectRole || '';
        const group = dataSourceElement.dataset.projectGroup || '';
        const time = dataSourceElement.dataset.projectTime || '';

        // Create the project info string
        const projectInfo = role ? `${role} (${group} | ${time})` : '';

        // Find the project info element in the modal
        const modalProjectInfo = modalElement.querySelector(".project-info");

        // Set the text content of the project info element
        if (modalProjectInfo) {
          modalProjectInfo.textContent = projectInfo;
        }

        // Trouver les éléments de contenu dans la section modale spécifique
        const modalImg = modalElement.querySelector("[data-project-modal-img]");
        const modalTitle = modalElement.querySelector("[data-project-modal-title]");
        const modalCategory = modalElement.querySelector("[data-project-modal-category]");
        const modalDescription = modalElement.querySelector("[data-project-modal-description]");
        const modalTech = modalElement.querySelector("[data-project-modal-tech]");
        const modalLink = modalElement.querySelector("[data-project-modal-link]");

        // Remplir la modale
        if (modalImg) { modalImg.src = image; modalImg.alt = title; }
        if (modalTitle) modalTitle.textContent = title;
        if (modalCategory) modalCategory.textContent = category;
        if (modalDescription) modalDescription.textContent = description;
        if (modalTech) modalTech.textContent = tech;
        if (modalLink) modalLink.href = link;
      }

      // Ouvrir la modale en utilisant la fonction générique (en passant la *section* modale)
      openModal(modalElement);
    });

    // Délégation d'événements pour les déclencheurs de fermeture de modale (boutons et clics hors contenu)
    document.addEventListener('click', function (event) {
        // 1. Vérifier le clic sur le bouton de fermeture ([data-modal-close])
        const closeButton = event.target.closest('[data-modal-close]');
        if (closeButton) {
            // Trouver la section modale associée à ce bouton de fermeture
            const modalToClose = closeButton.closest('section[data-modal]');
            if (modalToClose) {
                closeModal(modalToClose);
                return; // Sortie : Fermé via un bouton dans le contenu de la modale
            }
            // Ou, si le déclencheur de fermeture est sur le conteneur/overlay lui-même
            const containerToClose = closeButton.closest('.modal-container.active');
             if (containerToClose) {
                 const modalInSection = containerToClose.querySelector('section[data-modal]');
                 if (modalInSection) {
                     closeModal(modalInSection);
                     return; // Sortie : Fermé via un bouton sur le conteneur/overlay
                 }
             }
        }

        // 2. Vérifier le clic sur le conteneur modal actif (en dehors de la section de contenu)
        const activeContainer = document.querySelector('.modal-container.active');
        // Si un conteneur actif existe et que la cible du clic *est* le conteneur lui-même
        if (activeContainer && event.target === activeContainer) {
            const modalInSection = activeContainer.querySelector('section[data-modal]');
            if (modalInSection) {
                closeModal(modalInSection);
                // Pas besoin de return ici car c'est la dernière vérification
            }
        }
    });
  // --- Interactivité de la Section Compétences --- (Mise à l'échelle de l'icône au survol supprimée selon le point 3 du todo)


// --- Animation d'Apparition pour les Blocs de Compétences ---

    const competenceBlocks = document.querySelectorAll('.competence-bloc');

    if (competenceBlocks.length > 0 && 'IntersectionObserver' in window) {
      const observerOptions = {
        root: null, // relatif à la fenêtre d'affichage du document
        rootMargin: '0px',
        threshold: 0.1 // déclencher lorsque 10% de l'élément est visible
      };

      const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target); // Arrêter d'observer une fois l'apparition effectuée
          }
        });
      };

      const competenceObserver = new IntersectionObserver(observerCallback, observerOptions);

      competenceBlocks.forEach(block => {
        competenceObserver.observe(block);
      });
    } else if (competenceBlocks.length > 0) {
        // Solution de repli pour les navigateurs plus anciens : afficher simplement les éléments immédiatement
        competenceBlocks.forEach(block => {
            block.style.opacity = 1;
            block.style.transform = 'translateY(0)';
        });
    }
})(); // Fin de l'IIFE

}); // Fin de DOMContentLoaded
