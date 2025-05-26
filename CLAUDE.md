# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Killian Ramus, showcasing academic background, technical skills, and projects. The site features:
- Static HTML/CSS/JavaScript (no build process required)
- Two main pages: index.html (main portfolio) and portfolio-apprentissage.html (learning portfolio)
- Responsive design with light/dark theme support
- Project filtering and modal functionality
- Contact form with AJAX submission

## Architecture

### File Structure
- `index.html` - Main portfolio page with sections for About, Resume, Portfolio, and Contact
- `portfolio-apprentissage.html` - Learning portfolio page with competency validation tabs
- `assets/css/` - Stylesheets split by concern:
  - `style.css` - Main styles including theme variables and responsive design
  - `portfolio-layout.css` - Shared layout styles
  - `portfolio-apprentissage-style.css` - Specific styles for learning portfolio
- `assets/js/` - JavaScript functionality:
  - `script.js` - Main site functionality (sidebar, filtering, modals, theme, contact form)
  - `portfolio-apprentissage-script.js` - Tab switching for learning portfolio

### Key JavaScript Features
- Theme switching with localStorage persistence
- Project filtering by category
- Modal system for project details
- Dynamic age calculation
- Sidebar toggle for mobile
- Form validation and AJAX submission

## Development

### Running Locally
No build process is required. Simply open `index.html` in a web browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (if http-server is installed)
http-server
```

### Making Changes
- CSS uses CSS custom properties for theming - modify variables in `:root` and `[data-theme="dark"]`
- Project data is embedded as data attributes on project links
- Modal content is dynamically generated from data attributes
- Contact form submission uses Formspree (configured in HTML)

### Testing
- Test responsive design at various breakpoints (main breakpoint at 1024px)
- Verify theme switching persists across page reloads
- Check project filtering functionality
- Test modal opening/closing behavior
- Verify form validation and submission