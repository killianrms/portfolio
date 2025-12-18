'use strict';

// Attend que le DOM soit entièrement chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', () => {

  // IIFE pour encapsuler le script et éviter la pollution de la portée globale
  (async function () {

    // --- Internationalisation (i18n) ---
    let currentLang = localStorage.getItem('lang') || 'fr';
    let translations = {};

    const loadTranslations = async (lang) => {
      try {
        const response = await fetch(`./assets/i18n/${lang}.json`);
        return await response.json();
      } catch (error) {
        console.error('Error loading translations:', error);
        return null;
      }
    };

    const updateText = () => {
      // Expose translations globally for other functions (e.g. modal)
      window.portfolioTranslations = translations;

      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let text = translations;
        for (const k of keys) {
          text = text ? text[k] : null;
        }
        if (text) {
          element.innerHTML = text;
        }
      });

      // Update specific attributes like placeholders
      document.querySelectorAll('[data-i18n-attr]').forEach(element => {
        const attrs = element.getAttribute('data-i18n-attr').split(',');
        attrs.forEach(attrPair => {
          const [attr, key] = attrPair.split(':');
          const keys = key.split('.');
          let text = translations;
          for (const k of keys) {
            text = text ? text[k] : null;
          }
          if (text) {
            element.setAttribute(attr, text);
          }
        });
      });

      // Update Language Dropdown
      const langText = document.querySelector('.lang-toggle-btn .lang-text');
      const langFlag = document.querySelector('.lang-toggle-btn .flag');
      if (langText && langFlag) {
        langText.textContent = currentLang.toUpperCase();
        langFlag.textContent = currentLang === 'fr' ? '🇫🇷' : '🇬🇧';
      }

      // Update html lang attribute
      document.documentElement.lang = currentLang;
    };

    const setLanguage = async (lang) => {
      currentLang = lang;
      localStorage.setItem('lang', lang);
      translations = await loadTranslations(lang);
      if (translations) {
        window.translations = translations; // Expose globally
        updateText();
        // Dispatch event for other scripts
        document.dispatchEvent(new CustomEvent('translationsLoaded', { detail: { lang, translations } }));
        // Update filter buttons translation explicitly if needed (handled by data-i18n now)
      }
    };

    // Initialize translations
    await setLanguage(currentLang);

    // Language Dropdown Logic
    const langDropdown = document.querySelector('.lang-dropdown');
    const langToggleBtn = document.querySelector('[data-lang-btn]');
    const langOptions = document.querySelectorAll('[data-lang-select]');

    if (langToggleBtn && langDropdown) {
      // Toggle dropdown
      langToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('active');
      });

      // Handle selection
      langOptions.forEach(btn => {
        btn.addEventListener('click', () => {
          const selectedLang = btn.dataset.langSelect;
          setLanguage(selectedLang);
          langDropdown.classList.remove('active');
        });
      });

      // Close on click outside
      document.addEventListener('click', (e) => {
        if (!langDropdown.contains(e.target)) {
          langDropdown.classList.remove('active');
        }
      });
    }


    // --- Particles Background ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let particlesArray;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      class Particle {
        constructor(x, y, directionX, directionY, size, color) {
          this.x = x;
          this.y = y;
          this.directionX = directionX;
          this.directionY = directionY;
          this.size = size;
          this.color = color;
        }

        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
          // Opacity based on theme could be cool, but fixed is fine
          ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--orange-yellow-crayola');
          ctx.fill();
        }

        update() {
          if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
          }
          if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
          }
          this.x += this.directionX;
          this.y += this.directionY;
          this.draw();
        }
      }

      function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
          let size = (Math.random() * 2) + 1;
          let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
          let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
          let directionX = (Math.random() * 0.4) - 0.2;
          let directionY = (Math.random() * 0.4) - 0.2;
          let color = '#FFD700';

          particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
      }

      function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
          particlesArray[i].update();
        }
        connect();
      }

      function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
          for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
              ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
              opacityValue = 1 - (distance / 20000);
              ctx.strokeStyle = `rgba(255, 219, 112, ${opacityValue * 0.2})`; // Using theme color
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
              ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
              ctx.stroke();
            }
          }
        }
      }

      window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
      });

      init();
      animate();
    }

    // --- Fonctions Utilitaires ---

    /**
     * Bascule la classe 'active' sur un élément DOM donné.
     * @param {Element} elem - L'élément sur lequel basculer la classe.
     */
    const elementToggleFunc = function (elem) {
      elem.classList.toggle("active");
    }

    /**
     * Extrait l'ID d'une vidéo YouTube depuis différents formats d'URL
     * @param {string} url - L'URL YouTube
     * @returns {string|null} - L'ID de la vidéo ou null si non trouvé
     */
    const extractYouTubeID = function (url) {
      if (!url) return null;

      // Formats supportés:
      // https://www.youtube.com/watch?v=VIDEO_ID
      // https://youtu.be/VIDEO_ID
      // https://www.youtube.com/embed/VIDEO_ID
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[7].length === 11) ? match[7] : null;
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
      // Messages d'erreur dynamiques
      const getErrorMessages = () => {
        const t = window.translations?.contact?.validation || {};
        return {
          fullname: {
            valueMissing: t.fullname || 'Veuillez entrer votre nom'
          },
          email: {
            valueMissing: t.email_missing || 'Veuillez entrer votre email',
            typeMismatch: t.email_invalid || 'Veuillez entrer un email valide'
          },
          message: {
            valueMissing: t.message || 'Veuillez entrer votre message'
          }
        };
      };

      let errorMessages = getErrorMessages();

      // Mettre à jour les messages si la langue change
      document.addEventListener('translationsLoaded', () => {
        errorMessages = getErrorMessages();
      });

      // Validation en temps réel
      formInputs.forEach(input => {
        input.addEventListener('blur', function () {
          validateInput(this);
        });

        input.addEventListener('input', function () {
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
          input.setAttribute('aria-invalid', 'true');
          input.setAttribute('aria-describedby', errorSpan.id || (errorSpan.id = 'error-' + input.name));

          if (input.validity.valueMissing) {
            errorSpan.textContent = errorMessages[input.name].valueMissing;
          } else if (input.validity.typeMismatch) {
            errorSpan.textContent = errorMessages[input.name].typeMismatch;
          }
        } else {
          input.classList.remove('error');
          input.removeAttribute('aria-invalid');
          input.removeAttribute('aria-describedby');
          errorSpan.textContent = '';
        }
      }

      // Soumission du formulaire
      form.addEventListener('submit', function (e) {
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
          const targetPage = this.dataset.navLink;

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

      // Arrêter la vidéo YouTube si elle est en cours de lecture
      const modalVideo = modalElement.querySelector("[data-project-modal-video]");
      if (modalVideo) {
        modalVideo.src = '';
      }

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
        const videoUrl = dataSourceElement.dataset.projectVideo || '';

        // Get the role, group, and time information
        const role = dataSourceElement.dataset.projectRole || '';
        const group = dataSourceElement.dataset.projectGroup || '';
        const time = dataSourceElement.dataset.projectTime || '';

        // Create the project info string
        const projectInfo = role ? `${role} (${group} | ${time})` : '';

        // Find the project info element in the modal
        const modalProjectInfo = modalElement.querySelector("[data-project-modal-info]");

        // Set the text content of the project info element
        // Set the text content of the project info element
        if (modalProjectInfo) {
          const t = window.portfolioTranslations || {};
          const translatedInfo = t.modal?.role_group_time
            ? t.modal.role_group_time.replace('{{role}}', role).replace('{{group}}', group).replace('{{time}}', time)
            : projectInfo;
          modalProjectInfo.textContent = translatedInfo;
        }

        // Trouver les éléments de contenu dans la section modale spécifique
        const modalImg = modalElement.querySelector("[data-project-modal-img]");
        const modalTitle = modalElement.querySelector("[data-project-modal-title]");
        const modalCategory = modalElement.querySelector("[data-project-modal-category]");
        const modalDescription = modalElement.querySelector("[data-project-modal-description]");
        const modalTech = modalElement.querySelector("[data-project-modal-tech]");
        const modalLink = modalElement.querySelector("[data-project-modal-link]");
        const modalVideoContainer = modalElement.querySelector("[data-project-video-container]");
        const modalVideo = modalElement.querySelector("[data-project-modal-video]");

        // Remplir la modale
        const t = window.portfolioTranslations || {};
        if (modalImg) { modalImg.src = image; modalImg.alt = title; }
        if (modalTitle) modalTitle.textContent = title;
        if (modalCategory) modalCategory.textContent = category;

        // Dynamic labels
        const descLabel = t.modal?.description || '📝 Description';
        const techLabel = t.modal?.technologies || '🛠️ Technologies Utilisées';
        const githubLabel = t.modal?.view_github || 'Voir sur GitHub';

        if (modalDescription) {
          // Inject label before content if not present or just replace content? 
          // The HTML structure might need the label to be separate. 
          // Looking at previous view_file, the labels seem to be H4 tags in the JS template... 
          // WAIT. The file being edited uses `modalElement` which is an EXISTING DOM element, NOT a template string generator?
          // Let's re-read lines 600-610 carefully.
          // Lines 608: `if (modalDescription) modalDescription.innerHTML = description;`
          // The "Description" LABEL is likely static in the HTML of the modal itself, OR generated dynamically.
          // Reviewing index.html for the modal structure is safer.
          // BUT the previous plan assumed generating HTML string.
          // Line 550 starts `if (targetModalId === 'project-details')`.
          // It populates EXISTING elements.
          // So I need to find where the "Description" H4 header is.
          // If it's static in HTML, I should add data-i18n to it in index.html.
          // IF the modal is dynamic, I need to see where it comes from.
          // The `project-details` modal in index.html... let's check it.
          modalDescription.innerHTML = description;
        }
        if (modalTech) modalTech.textContent = tech;
        if (modalLink) {
          modalLink.href = link;
          // Update the link text
          const span = modalLink.querySelector('span');
          if (span) span.textContent = githubLabel;
        }

        // Gérer la vidéo YouTube
        if (modalVideoContainer && modalVideo) {
          if (videoUrl) {
            // Convertir l'URL YouTube en format embed
            const videoId = extractYouTubeID(videoUrl);
            if (videoId) {
              modalVideo.src = `https://www.youtube.com/embed/${videoId}`;
              modalVideoContainer.style.display = 'block';
            } else {
              modalVideoContainer.style.display = 'none';
            }
          } else {
            modalVideoContainer.style.display = 'none';
            modalVideo.src = '';
          }
        }
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
    document.addEventListener('keydown', function (event) {
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
    document.addEventListener('click', function (event) {
      const shareTwitter = event.target.closest('[data-share-twitter]');
      const shareLinkedin = event.target.closest('[data-share-linkedin]');
      const shareCopy = event.target.closest('[data-share-copy]');

      const activeModal = document.querySelector('.project-modal-container.active');
      if (!activeModal) return;

      const projectTitle = activeModal.querySelector('[data-project-modal-title]')?.textContent || '';
      const projectLink = activeModal.querySelector('[data-project-modal-link]')?.href || window.location.href;

      const shareText = window.portfolioTranslations?.share?.text || 'Découvrez mon projet : ';
      const copyText = window.portfolioTranslations?.share?.copied || 'Lien copié !';

      if (shareTwitter) {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + projectTitle)}&url=${encodeURIComponent(projectLink)}`;
        window.open(twitterUrl, '_blank', 'noopener,noreferrer');
      }

      if (shareLinkedin) {
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectLink)}`;
        window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
      }

      if (shareCopy) {
        navigator.clipboard.writeText(projectLink).then(() => {
          const originalText = shareCopy.querySelector('span').textContent;
          shareCopy.querySelector('span').textContent = copyText;
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


    // --- Bouton Retour en Haut ---
    const backToTopBtn = document.querySelector("[data-back-to-top]");

    if (backToTopBtn) {
      window.addEventListener("scroll", function () {
        if (window.scrollY >= 100) {
          backToTopBtn.classList.add("active");
        } else {
          backToTopBtn.classList.remove("active");
        }
      });
    }

    // --- Accessibilité : Gestion du Focus dans les Modales (Trap Focus) ---
    /**
     * Garde le focus à l'intérieur de l'élément modal
     * @param {HTMLElement} element - L'élément modal
     * @param {KeyboardEvent} e - L'événement clavier
     */
    const trapFocus = (element, e) => {
      const focusableEls = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
      const firstFocusableEl = focusableEls[0];
      const lastFocusableEl = focusableEls[focusableEls.length - 1];
      const KEYCODE_TAB = 9;

      if (e.key === 'Tab' || e.keyCode === KEYCODE_TAB) {
        if (e.shiftKey) /* shift + tab */ {
          if (document.activeElement === firstFocusableEl) {
            lastFocusableEl.focus();
            e.preventDefault();
          }
        } else /* tab */ {
          if (document.activeElement === lastFocusableEl) {
            firstFocusableEl.focus();
            e.preventDefault();
          }
        }
      }
    }

    // Ajouter l'écouteur pour le trap focus quand une modale est ouverte
    const modalContainers = document.querySelectorAll('.modal-container');
    modalContainers.forEach(container => {
      container.addEventListener('keydown', function (e) {
        if (this.classList.contains('active')) {
          trapFocus(this, e);
        }
      });
    });

  })(); // Fin de l'IIFE

}); // Fin de DOMContentLoaded
