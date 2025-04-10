'use strict';

// Wait for the DOM to be fully loaded before executing script
document.addEventListener('DOMContentLoaded', () => {

  // IIFE to encapsulate the script and avoid global scope pollution
  (function() {

    // --- Helper Functions ---

    /**
     * Toggles the 'active' class on a given DOM element.
     * @param {Element} elem - The element to toggle the class on.
     */
    const elementToggleFunc = function (elem) {
      elem.classList.toggle("active");
    }

    // --- Sidebar ---

    const sidebar = document.querySelector("[data-sidebar]");
    const sidebarBtn = document.querySelector("[data-sidebar-btn]");

    if (sidebar && sidebarBtn) {
      // Sidebar toggle functionality for mobile
      sidebarBtn.addEventListener("click", function () {
        elementToggleFunc(sidebar);
        // Toggle aria-expanded attribute
        const isExpanded = sidebar.classList.contains("active");
        sidebarBtn.setAttribute('aria-expanded', isExpanded);
      });
    }

    // --- Portfolio Filtering ---

    const filterList = document.querySelector(".filter-list");
    const filterButtons = document.querySelectorAll(".filter-list button");
    const projectItems = document.querySelectorAll(".project-item");

    if (filterList && filterButtons.length > 0 && projectItems.length > 0) {
      filterList.addEventListener("click", (event) => {
        const clickedButton = event.target.closest("button");

        // Exit if the click wasn't on a button inside the list
        if (!clickedButton || !filterList.contains(clickedButton)) {
          return;
        }

        const filterValue = clickedButton.dataset.filter;

        // Update active button state
        filterButtons.forEach(button => {
          button.classList.remove("active");
        });
        clickedButton.classList.add("active");

        // Filter project items
        projectItems.forEach(item => {
          const itemCategory = item.dataset.category;

          if (filterValue === "all" || filterValue === itemCategory) {
            // Show item (resetting display style lets CSS control it)
            item.style.display = "";
            // Optionally add 'active' class if needed for animations/transitions later
            // item.classList.add("active");
          } else {
            // Hide item
            item.style.display = "none";
            // Optionally remove 'active' class
            // item.classList.remove("active");
          }
        });
      });
    }

    // --- Age Calculation ---

    const ageElement = document.getElementById('age');
    if (ageElement) {
      const calculateAndDisplayAge = () => {
        const birthDate = new Date(2004, 5, 28); // Month is 0-indexed (June = 5)
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


    // --- Contact Form ---

    const form = document.querySelector("[data-form]");
    const formInputs = document.querySelectorAll("[data-form-input]");
    const formBtn = document.querySelector("[data-form-btn]");
    const formStatus = document.querySelector(".form-status");

    if (form && formInputs.length > 0 && formBtn && formStatus) {
      // Input validation feedback
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

          // Check overall form validity to enable/disable submit button
          formBtn.disabled = !form.checkValidity();
        });
      });

      // AJAX form submission
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        formBtn.disabled = true; // Disable button during submission
        formStatus.style.display = "none"; // Hide previous status
        formStatus.textContent = "Envoi en cours..."; // Indicate processing
        formStatus.style.color = "var(--light-gray)"; // Neutral color
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
            formStatus.style.color = "var(--orange-yellow-crayola)"; // Success color
            form.reset();
            formInputs.forEach(input => input.classList.remove('invalid')); // Clear validation states
            formBtn.disabled = true; // Keep disabled after successful reset
          } else {
            return response.json().then(data => {
              let errorMessage = "Oups ! Une erreur s'est produite.";
              if (data && data.errors) {
                errorMessage = data.errors.map(error => error.message).join(", ");
              }
              throw new Error(errorMessage); // Throw error to be caught below
            }).catch(() => {
              // Catch potential JSON parsing error or re-throw generic
              throw new Error("Oups ! Une erreur serveur s'est produite.");
            });
          }
        })
        .catch(error => {
          formStatus.innerHTML = error.message || "Oups ! Une erreur réseau s'est produite.";
          formStatus.style.color = "var(--bittersweet-shimmer)"; // Error color
          formBtn.disabled = false; // Re-enable button on error
        })
        .finally(() => {
           formStatus.style.display = "block"; // Ensure status is visible
           // Re-enable button only if form is valid (might be disabled from input event)
           if (form.checkValidity()) {
               formBtn.disabled = false;
           }
           // If reset was successful, button remains disabled until new input
           if (formStatus.textContent.includes("Merci")) {
               formBtn.disabled = true;
           }
        });
      });
    }


    // --- Page Navigation ---

    const navigationLinks = document.querySelectorAll("[data-nav-link]");
    const pages = document.querySelectorAll("[data-page]");

    if (navigationLinks.length > 0 && pages.length > 0) {
      navigationLinks.forEach(link => {
        link.addEventListener("click", function () {
          const targetPage = this.innerHTML.toLowerCase();

          pages.forEach((page, index) => {
            const pageName = page.dataset.page;
            const correspondingLink = navigationLinks[index]; // Assumes links and pages are in corresponding order

            if (targetPage === pageName) {
              page.classList.add("active");
              correspondingLink.classList.add("active");
            } else {
              page.classList.remove("active");
              correspondingLink.classList.remove("active");
            }
          });
          window.scrollTo(0, 0); // Scroll to top when changing pages
        });
      });
    }


    // --- Theme Toggle ---

    const themeBtn = document.querySelector("[data-theme-btn]");
    const htmlElement = document.documentElement;

    /**
     * Applies the specified theme by setting the 'data-theme' attribute on the <html> element.
     * @param {string} theme - The theme to apply ('light' or 'dark').
     */
    const applyTheme = (theme) => {
      htmlElement.dataset.theme = theme;
      // CSS handles icon visibility based on the data-theme attribute now
    };

    /**
     * Toggles the theme between 'light' and 'dark' and saves the preference to localStorage.
     */
    const toggleTheme = () => {
      const currentTheme = htmlElement.dataset.theme || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    };

    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);

      // Initialize theme on load
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        applyTheme(savedTheme);
      } else {
        // Default to system preference or dark if preference not available/detectable
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
      }
    }


    // --- Generic Modal Handling ---

    /**
     * Opens a modal dialog. Finds the overlay as the previous sibling.
     * @param {HTMLElement} modalElement - The modal element to open.
     */
    const openModal = function (modalElement) {
      if (!modalElement) return;
      const overlay = modalElement.closest('.modal-container')?.querySelector('.overlay'); // Find overlay within container
      modalElement.closest('.modal-container')?.classList.add("active"); // Activate container
      // Consider adding focus management here
    }

    /**
     * Closes a modal dialog. Finds the overlay as the previous sibling.
     * @param {HTMLElement} modalElement - The modal element to close.
     */
    const closeModal = function (modalElement) {
      if (!modalElement) return;
      modalElement.closest('.modal-container')?.classList.remove("active"); // Deactivate container
      // Consider returning focus to the trigger element here
    }

    // Event delegation for modal triggers
    document.addEventListener('click', function (event) {
      const triggerButton = event.target.closest('[data-modal-trigger]');
      if (!triggerButton) return;

      const targetModalId = triggerButton.dataset.modalTrigger;
      // Find modal *section* using data-modal attribute
      const modalElement = document.querySelector(`section[data-modal="${targetModalId}"]`);

      if (!modalElement) {
        console.error(`Modal section with data-modal="${targetModalId}" not found.`);
        return;
      }

      // Project Modal Specific Logic
      if (targetModalId === 'project-details') {
        const projectItem = triggerButton.closest(".project-item");
        if (!projectItem) {
            console.error("Could not find parent .project-item for trigger:", triggerButton);
            return;
        }

        // Get data from the project item
        const title = projectItem.dataset.projectTitle || 'N/A';
        const category = projectItem.dataset.projectCategory || 'N/A';
        const image = projectItem.dataset.projectImage || '';
        const description = projectItem.dataset.projectDescription || 'No description available.';
        const tech = projectItem.dataset.projectTech || 'N/A';
        const link = projectItem.dataset.projectLink || '#';

        // Find content elements within the specific modal section
        const modalImg = modalElement.querySelector("[data-project-modal-img]");
        const modalTitle = modalElement.querySelector("[data-project-modal-title]");
        const modalCategory = modalElement.querySelector("[data-project-modal-category]");
        const modalDescription = modalElement.querySelector("[data-project-modal-description]");
        const modalTech = modalElement.querySelector("[data-project-modal-tech]");
        const modalLink = modalElement.querySelector("[data-project-modal-link]");

        // Populate the modal
        if (modalImg) { modalImg.src = image; modalImg.alt = title; }
        if (modalTitle) modalTitle.textContent = title;
        if (modalCategory) modalCategory.textContent = category;
        if (modalDescription) modalDescription.textContent = description;
        if (modalTech) modalTech.textContent = tech;
        if (modalLink) modalLink.href = link;
      }

      // Open the modal using the generic function (passing the modal *section*)
      openModal(modalElement);
    });

    // Event delegation for modal close triggers (buttons and overlay)
    document.addEventListener('click', function (event) {
        const closeTrigger = event.target.closest('[data-modal-close]');
        if (!closeTrigger) return;

        // Find the closest parent modal *section* to close
        const modalToClose = closeTrigger.closest('section[data-modal]');

        if (modalToClose) {
            closeModal(modalToClose);
        } else if (closeTrigger.classList.contains('overlay')) {
            // If overlay clicked directly, find the active modal *section* within its container
            const activeModalSection = closeTrigger.closest('.modal-container')?.querySelector('section[data-modal].active');
             if (activeModalSection) {
                 closeModal(activeModalSection);
             }
        }
    });
  // --- Skills Section Interactivity ---

  const skillItems = document.querySelectorAll(".skill-item");

  if (skillItems.length > 0) {
    skillItems.forEach(item => {
      const icon = item.querySelector(".skill-icon img");

      if (icon) {
        // Add transition directly via JS for simplicity here
        icon.style.transition = 'transform 0.2s ease-in-out';

        item.addEventListener('mouseenter', () => {
          icon.style.transform = 'scale(1.15)'; // Scale up the icon
        });

        item.addEventListener('mouseleave', () => {
          icon.style.transform = 'scale(1)'; // Reset scale
        });
      }
    });
  }

})(); // End of IIFE

}); // End of DOMContentLoaded
