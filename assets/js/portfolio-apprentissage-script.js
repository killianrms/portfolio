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
});