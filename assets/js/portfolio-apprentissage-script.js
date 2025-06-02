'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('#portfolio-apprentissage .tab-button');
    const tabPanes = document.querySelectorAll('#portfolio-apprentissage .tab-content .tab-pane');

    if (tabButtons.length > 0 && tabPanes.length > 0) {
        // Function to switch tabs
        const switchTab = (targetTabId) => {
            tabPanes.forEach(pane => {
                if (pane.id === targetTabId) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });

            tabButtons.forEach(button => {
                if (button.dataset.tab === targetTabId) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
        };

        // Add click event listeners to tab buttons
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTabId = button.dataset.tab;
                switchTab(targetTabId);
            });
        });

        // Optional: Activate the first tab by default if no tab is active
        // This is already handled by adding 'active' class in HTML, but good for robustness
        const activeTab = document.querySelector('#portfolio-apprentissage .tab-button.active');
        if (activeTab) {
            switchTab(activeTab.dataset.tab);
        } else if (tabButtons.length > 0) {
            // Fallback: if no button is marked active, activate the first one
            switchTab(tabButtons[0].dataset.tab);
        }
    } else {
        console.warn('Tab buttons or panes not found on portfolio-apprentissage page.');
    }


    // Prevent page scroll to top when project modals are opened
    // Assumes modals are triggered by <a> tags with href="#" within tab panes of the portfolio section
    const projectModalTriggers = document.querySelectorAll('#portfolio-apprentissage .tab-pane a[href="#"]');

    projectModalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            // This prevents the default anchor behavior (e.g., jumping to the top of the page).
            // The actual modal opening logic is assumed to be handled by another script or inline
            // and should still work as expected.
        });
    });

    // Accordion functionality for AC sections
    const accordionHeaders = document.querySelectorAll('#portfolio-apprentissage .ac-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const targetId = header.dataset.target;
            const targetContent = document.getElementById(targetId);
            const accordionItem = header.closest('.ac-item');
            
            if (accordionItem && targetContent) {
                // Toggle active state
                accordionItem.classList.toggle('active');
                
                // Optional: Close other accordion items (uncomment for exclusive behavior)
                // const allItems = document.querySelectorAll('#portfolio-apprentissage .ac-item');
                // allItems.forEach(item => {
                //     if (item !== accordionItem) {
                //         item.classList.remove('active');
                //     }
                // });
            }
        });
    });

    // CE Modal functionality
    const ceDefinitions = {
        'CE2.01': 'En formalisant et modélisant des situations complexes',
        'CE2.02': 'En recensant les algorithmes et les structures de données usuels',
        'CE2.03': 'En s\'appuyant sur des schémas de raisonnement',
        'CE2.04': 'En justifiant les choix et validant les résultats',
        'CE4.01': 'En respectant les réglementations sur le respect de la vie privée et la protection des données personnelles',
        'CE4.02': 'En respectant les enjeux économiques, sociétaux et écologiques de l\'utilisation du stockage de données',
        'CE4.03': 'En s\'appuyant sur des bases mathématiques',
        'CE4.04': 'En assurant la cohérence et la qualité',
        'CE5.01': 'En communiquant efficacement avec les différents acteurs d\'un projet',
        'CE5.02': 'En respectant les règles juridiques et les normes en vigueur',
        'CE5.03': 'En sensibilisant à une gestion éthique, responsable, durable et interculturelle',
        'CE5.04': 'En adoptant une démarche proactive, créative et critique'
    };

    const ceModal = document.querySelector('[data-ce-modal-container]');
    const ceModalTitle = document.querySelector('[data-ce-modal-title]');
    const ceModalDescription = document.querySelector('[data-ce-modal-description]');
    const ceCloseButtons = document.querySelectorAll('[data-ce-modal-close]');

    // Handle CE clicks
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('ce-clickable')) {
            e.preventDefault();
            const ceCode = e.target.dataset.ce;
            const ceDescription = ceDefinitions[ceCode];
            
            if (ceDescription) {
                ceModalTitle.textContent = ceCode;
                ceModalDescription.textContent = ceDescription;
                ceModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    });

    // Handle CE modal close
    ceCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            ceModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close modal on overlay click
    ceModal.querySelector('.overlay').addEventListener('click', () => {
        ceModal.classList.remove('active');
        document.body.style.overflow = '';
    });
});