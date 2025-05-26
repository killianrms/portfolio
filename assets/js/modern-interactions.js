'use strict';

document.addEventListener('DOMContentLoaded', () => {
  
  // ===== SMOOTH SCROLL REVEAL =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        scrollRevealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply scroll reveal to elements
  const revealElements = document.querySelectorAll('.service-item, .timeline-item, .skills-item, .project-item, .testimonials-item');
  revealElements.forEach(el => {
    el.classList.add('scroll-reveal');
    scrollRevealObserver.observe(el);
  });

  // ===== PARALLAX EFFECT =====
  let ticking = false;
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(el => {
      const speed = el.dataset.speed || 0.5;
      const yPos = -(scrolled * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
    
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick);

  // ===== TYPING EFFECT =====
  function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    
    type();
  }

  // Apply typing effect to name
  const nameElement = document.querySelector('.name');
  if (nameElement) {
    const originalText = nameElement.textContent;
    setTimeout(() => {
      typeWriter(nameElement, originalText, 100);
    }, 500);
  }

  // ===== ENHANCED PROJECT FILTERING =====
  const filterButtons = document.querySelectorAll('[data-filter-btn]');
  const projectItems = document.querySelectorAll('.project-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.dataset.filterBtn;
      
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter projects with animation
      projectItems.forEach((item, index) => {
        const shouldShow = filterValue === 'all' || item.dataset.category.toLowerCase() === filterValue;
        
        if (shouldShow) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, index * 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ===== MAGNETIC BUTTONS =====
  const magneticButtons = document.querySelectorAll('.form-btn, .cv-button-link');
  
  magneticButtons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate(0, 0)';
    });
  });

  // ===== CUSTOM CURSOR (Desktop only) =====
  if (window.matchMedia('(hover: hover)').matches) {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    const hoverElements = document.querySelectorAll('a, button, .project-item, .service-item');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  // ===== PROGRESS BARS ANIMATION =====
  const progressBars = document.querySelectorAll('.skills-item[data-skill-level]');
  
  progressBars.forEach(bar => {
    const level = bar.dataset.skillLevel;
    const progressElement = document.createElement('div');
    progressElement.className = 'skill-progress';
    progressElement.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: var(--orange-yellow-crayola);
      width: 0;
      transition: width 1.5s ease;
      border-radius: 3px;
    `;
    bar.style.position = 'relative';
    bar.appendChild(progressElement);
    
    // Animate on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          progressElement.style.width = level + '%';
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(bar);
  });

  // ===== SMOOTH PAGE TRANSITIONS =====
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const pages = document.querySelectorAll('[data-page]');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetPage = this.dataset.navLink;
      
      // Remove active class from all links and pages
      navLinks.forEach(l => l.classList.remove('active'));
      pages.forEach(p => {
        p.classList.remove('active');
        p.style.animation = 'fadeOut 0.3s ease forwards';
      });
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Show target page with animation
      setTimeout(() => {
        pages.forEach(p => {
          if (p.dataset.page === targetPage) {
            p.classList.add('active');
            p.style.animation = 'fadeIn 0.5s ease forwards';
          }
        });
      }, 300);
    });
  });

  // ===== FORM VALIDATION WITH VISUAL FEEDBACK =====
  const formInputs = document.querySelectorAll('.form-input, textarea[data-form-input]');
  
  formInputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.checkValidity()) {
        this.classList.add('valid');
        this.classList.remove('invalid');
      } else if (this.value.length > 0) {
        this.classList.add('invalid');
        this.classList.remove('valid');
      }
    });
    
    input.addEventListener('input', function() {
      if (this.value.length === 0) {
        this.classList.remove('valid', 'invalid');
      }
    });
  });

  // ===== LOADING STATE FOR IMAGES =====
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    img.classList.add('loading');
    
    img.addEventListener('load', function() {
      this.classList.remove('loading');
      this.style.animation = 'fadeIn 0.5s ease';
    });
  });

  // ===== DYNAMIC THEME BASED ON TIME =====
  const hour = new Date().getHours();
  if (hour >= 18 || hour < 6) {
    // Evening/Night - ensure dark theme
    if (document.documentElement.getAttribute('data-theme') === 'light') {
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        // Only switch if user hasn't manually selected a theme
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }
  }

  // ===== ENHANCED MODAL INTERACTIONS =====
  document.addEventListener('click', function(e) {
    if (e.target.matches('[data-modal-trigger]')) {
      e.preventDefault();
      const modal = document.querySelector('.modal');
      if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
          modal.style.opacity = '1';
        }, 10);
      }
    }
  });

  // ===== PERFORMANCE OPTIMIZATION =====
  // Debounce function for scroll events
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Optimize scroll events
  const optimizedScroll = debounce(() => {
    requestTick();
  }, 10);

  window.addEventListener('scroll', optimizedScroll, { passive: true });

  // ===== ANIMATE NUMBERS =====
  function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        element.textContent = end;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }

  // Apply to any numeric elements (e.g., stats)
  const statNumbers = document.querySelectorAll('[data-stat-number]');
  statNumbers.forEach(stat => {
    const value = parseInt(stat.textContent);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateValue(stat, 0, value, 2000);
          observer.unobserve(entry.target);
        }
      });
    });
    observer.observe(stat);
  });
});