'use strict';

// Performance Optimizations and Lazy Loading

document.addEventListener('DOMContentLoaded', () => {
  
  // ===== LAZY LOADING FOR IMAGES =====
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Load the image
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        
        // Add loaded class for animation
        img.addEventListener('load', () => {
          img.classList.add('loaded');
        });
        
        // Stop observing this image
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });

  // Observe all images with data-src
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => imageObserver.observe(img));

  // ===== PRELOAD CRITICAL RESOURCES =====
  const preloadLink = (href, as) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = href;
    document.head.appendChild(link);
  };

  // Preload critical fonts
  preloadLink('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap', 'style');
  
  // ===== OPTIMIZE ANIMATIONS =====
  // Reduce motion for users who prefer it
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--transition-std', '0.1s');
    document.documentElement.style.setProperty('--transition-1', '0.1s');
    document.documentElement.style.setProperty('--transition-2', '0.1s');
  }

  // ===== DEFER NON-CRITICAL CSS =====
  const loadDeferredStyles = () => {
    const addStylesNode = document.getElementById('deferred-styles');
    if (addStylesNode) {
      const replacement = document.createElement('div');
      replacement.innerHTML = addStylesNode.textContent;
      document.body.appendChild(replacement);
      addStylesNode.parentElement.removeChild(addStylesNode);
    }
  };

  if (window.requestIdleCallback) {
    window.requestIdleCallback(loadDeferredStyles);
  } else {
    window.addEventListener('load', loadDeferredStyles);
  }

  // ===== OPTIMIZE SCROLL PERFORMANCE =====
  let scrollTimeout;
  const scrollThrottle = () => {
    if (scrollTimeout) return;
    
    scrollTimeout = setTimeout(() => {
      scrollTimeout = null;
      // Add class during scroll for performance
      document.body.classList.add('is-scrolling');
      
      clearTimeout(document.body.scrollEndTimer);
      document.body.scrollEndTimer = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
      }, 100);
    }, 16); // ~60fps
  };

  window.addEventListener('scroll', scrollThrottle, { passive: true });

  // ===== PROGRESSIVE ENHANCEMENT =====
  // Check for WebP support
  const checkWebPSupport = () => {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  };

  checkWebPSupport().then(hasWebP => {
    if (hasWebP) {
      document.documentElement.classList.add('webp');
    } else {
      document.documentElement.classList.add('no-webp');
    }
  });

  // ===== OPTIMIZE FONT LOADING =====
  if ('fonts' in document) {
    Promise.all([
      document.fonts.load('400 1em Poppins'),
      document.fonts.load('600 1em Poppins'),
      document.fonts.load('700 1em Poppins')
    ]).then(() => {
      document.documentElement.classList.add('fonts-loaded');
    });
  }

  // ===== RESOURCE HINTS =====
  // Preconnect to external domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://unpkg.com'
  ];

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // ===== MEMORY MANAGEMENT =====
  // Clean up event listeners on page hide
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Pause animations
      document.querySelectorAll('[data-animation]').forEach(el => {
        el.style.animationPlayState = 'paused';
      });
    } else {
      // Resume animations
      document.querySelectorAll('[data-animation]').forEach(el => {
        el.style.animationPlayState = 'running';
      });
    }
  });

  // ===== OPTIMIZE MODAL LOADING =====
  const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', () => {
      // Preload modal content on hover
      const modalId = trigger.dataset.modalTrigger;
      const modal = document.querySelector(`[data-modal="${modalId}"]`);
      if (modal && !modal.dataset.preloaded) {
        modal.dataset.preloaded = 'true';
        // Trigger any lazy loading within the modal
        const modalImages = modal.querySelectorAll('img[data-src]');
        modalImages.forEach(img => imageObserver.observe(img));
      }
    }, { once: true });
  });

  // ===== CRITICAL CSS INLINE =====
  // Log performance metrics
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;
        
        console.log('Performance Metrics:');
        console.log(`Page Load Time: ${pageLoadTime}ms`);
        console.log(`Connect Time: ${connectTime}ms`);
        console.log(`Render Time: ${renderTime}ms`);
        
        // Send to analytics if needed
        if (window.gtag) {
          window.gtag('event', 'timing_complete', {
            'name': 'load',
            'value': pageLoadTime,
            'event_category': 'Performance'
          });
        }
      }, 0);
    });
  }

  // ===== SERVICE WORKER FOR OFFLINE =====
  if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('ServiceWorker registered:', registration);
      }).catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
    });
  }
});