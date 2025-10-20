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

        // Animation de filtre avec effet de propagation
        projectItems.forEach((item, index) => {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          
          setTimeout(() => {
            const itemCategory = item.dataset.category;
            
            if (filterValue === "all" || filterValue === itemCategory) {
              item.style.display = "";
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
              }, index * 50);
            } else {
              item.style.display = "none";
            }
          }, 100);
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

    if (form && formInputs.length > 0 && formBtn) {
      // Messages d'erreur en français
      const errorMessages = {
        fullname: {
          valueMissing: 'Veuillez entrer votre nom'
        },
        email: {
          valueMissing: 'Veuillez entrer votre email',
          typeMismatch: 'Veuillez entrer un email valide'
        },
        message: {
          valueMissing: 'Veuillez entrer votre message'
        }
      };

      // Validation en temps réel
      formInputs.forEach(input => {
        input.addEventListener('blur', function() {
          validateInput(this);
        });

        input.addEventListener('input', function() {
          if (this.classList.contains('error')) {
            validateInput(this);
          }
          // Activer/désactiver le bouton
          formBtn.disabled = !form.checkValidity();
        });
      });

      function validateInput(input) {
        const errorSpan = input.parentElement.querySelector('.error-message');
        
        if (!input.validity.valid) {
          input.classList.add('error');
          
          if (input.validity.valueMissing) {
            errorSpan.textContent = errorMessages[input.name].valueMissing;
          } else if (input.validity.typeMismatch) {
            errorSpan.textContent = errorMessages[input.name].typeMismatch;
          }
        } else {
          input.classList.remove('error');
          errorSpan.textContent = '';
        }
      }

      // Soumission du formulaire
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Valider tous les champs
        let isValid = true;
        formInputs.forEach(input => {
          validateInput(input);
          if (!input.validity.valid) isValid = false;
        });

        if (!isValid) return;

        // Désactiver le bouton et afficher le chargement
        formBtn.disabled = true;
        formBtn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon><span>Envoi...</span>';

        // Envoyer le formulaire
        fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => {
          if (response.ok) {
            // Succès
            form.reset();
            formBtn.innerHTML = '<ion-icon name="checkmark-circle"></ion-icon><span>Envoyé !</span>';
            formBtn.style.background = 'var(--orange-yellow-crayola)';
            formBtn.style.color = 'var(--smoky-black)';
            setTimeout(() => {
              formBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Envoyer</span>';
              formBtn.disabled = false;
              formBtn.style.background = '';
              formBtn.style.color = '';
            }, 3000);
          } else {
            throw new Error('Erreur lors de l\'envoi');
          }
        })
        .catch(error => {
          // Erreur
          formBtn.innerHTML = '<ion-icon name="close-circle"></ion-icon><span>Erreur</span>';
          formBtn.style.background = 'var(--bittersweet-shimmer)';
          formBtn.style.color = 'var(--white-1)';
          setTimeout(() => {
            formBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Envoyer</span>';
            formBtn.disabled = false;
            formBtn.style.background = '';
            formBtn.style.color = '';
          }, 3000);
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

          pages.forEach(page => {
            if (targetPage === page.dataset.page) {
              page.classList.add("active");
            } else {
              page.classList.remove("active");
            }
          });

          navigationLinks.forEach(navLink => {
            if (navLink === this) {
              navLink.classList.add("active");
            } else {
              navLink.classList.remove("active");
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
        // Par défaut, utiliser le mode sombre (dark)
        applyTheme('dark');
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
    // --- Animation de la Machine à Écrire pour le Nom ---
    const nameElement = document.querySelector('.name');
    if (nameElement) {
      const text = nameElement.textContent;
      nameElement.textContent = '';
      let index = 0;

      const typeWriter = () => {
        if (index < text.length) {
          nameElement.textContent += text.charAt(index);
          index++;
          setTimeout(typeWriter, 100);
        }
      };

      typeWriter();
    }

    // --- Indicateur de Progression de Lecture ---
    const progressBar = document.getElementById('reading-progress-bar');
    if (progressBar) {
      const updateProgressBar = () => {
        const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollProgress = (window.pageYOffset / scrollTotal) * 100;
        progressBar.style.width = scrollProgress + '%';
      };

      window.addEventListener('scroll', updateProgressBar);
      updateProgressBar(); // Initial call
    }

    // --- Compteur Animé pour les Badges ---
    const animateCounters = () => {
      const badges = document.querySelectorAll('.badge-number');

      badges.forEach(badge => {
        const target = badge.textContent;
        const isPlus = target.includes('+');
        const numericValue = parseInt(target.replace(/\D/g, ''));

        if (isNaN(numericValue)) return;

        const duration = 2000; // 2 secondes
        const increment = numericValue / (duration / 16); // 60 FPS
        let current = 0;

        const updateCounter = () => {
          current += increment;
          if (current < numericValue) {
            badge.textContent = Math.floor(current) + (isPlus ? '+' : '');
            requestAnimationFrame(updateCounter);
          } else {
            badge.textContent = numericValue + (isPlus ? '+' : '');
          }
        };

        // Observer pour démarrer l'animation quand le badge est visible
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                updateCounter();
                observer.unobserve(entry.target);
              }
            });
          }, { threshold: 0.5 });

          observer.observe(badge.closest('.badge'));
        } else {
          updateCounter();
        }
      });
    };

    animateCounters();

    // --- Support Clavier pour les Modales (Touche Escape) ---
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' || event.key === 'Esc') {
        const activeContainer = document.querySelector('.modal-container.active');
        if (activeContainer) {
          const modalInSection = activeContainer.querySelector('section[data-modal]');
          if (modalInSection) {
            closeModal(modalInSection);
          }
        }
      }
    });

    // --- Boutons de Partage Social ---
    document.addEventListener('click', function(event) {
      const shareTwitter = event.target.closest('[data-share-twitter]');
      const shareLinkedin = event.target.closest('[data-share-linkedin]');
      const shareCopy = event.target.closest('[data-share-copy]');

      const activeModal = document.querySelector('.project-modal-container.active');
      if (!activeModal) return;

      const projectTitle = activeModal.querySelector('[data-project-modal-title]')?.textContent || '';
      const projectLink = activeModal.querySelector('[data-project-modal-link]')?.href || window.location.href;

      if (shareTwitter) {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent('Découvrez mon projet : ' + projectTitle)}&url=${encodeURIComponent(projectLink)}`;
        window.open(twitterUrl, '_blank', 'noopener,noreferrer');
      }

      if (shareLinkedin) {
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectLink)}`;
        window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
      }

      if (shareCopy) {
        navigator.clipboard.writeText(projectLink).then(() => {
          const originalText = shareCopy.querySelector('span').textContent;
          shareCopy.querySelector('span').textContent = 'Lien copié !';
          shareCopy.style.color = 'var(--orange-yellow-crayola)';
          setTimeout(() => {
            shareCopy.querySelector('span').textContent = originalText;
            shareCopy.style.color = '';
          }, 2000);
        }).catch(err => {
          console.error('Erreur lors de la copie:', err);
        });
      }
    });

    // --- Animations de Défilement pour Timeline et Autres Éléments ---
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.timeline-item, .service-item, .skills-item');
      
      if (elements.length > 0 && 'IntersectionObserver' in window) {
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -100px 0px'
        };
        
        const observerCallback = (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }
          });
        };
        
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        elements.forEach(element => {
          element.style.opacity = '0';
          element.style.transform = 'translateY(20px)';
          element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          observer.observe(element);
        });
      }
    };
    
    animateOnScroll();

    // --- Réinitialiser les Animations lors de la Navigation entre Pages ---
    const navLinks = document.querySelectorAll('[data-nav-link]');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(animateOnScroll, 100);
      });
    });

})(); // Fin de l'IIFE

}); // Fin de DOMContentLoaded
