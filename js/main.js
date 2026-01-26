(() => {
  'use strict';

  /* ============================================
     UTILITY FUNCTIONS
     ============================================ */
  
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

  // Debounce helper for performance
  const debounce = (func, wait = 150) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  /* ============================================
     SMOOTH SCROLL NAVIGATION
     ============================================ */

  window.smoothScroll = function(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = $(href);
      if (target) {
        const header = $('.header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        window.history.pushState(null, null, href);
      }
    }
  };

  /* ============================================
     SPECIAL SCROLL TO CONTACT SECTION
     ============================================ */

  // Special function for scroll to contact section
  window.smoothScrollToContact = function() {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      const header = document.querySelector('.header');
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = contactSection.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      window.history.pushState(null, null, '#contact');
    }
  };

  /* ============================================
     SCROLL REVEAL ANIMATION
     ============================================ */

  class ScrollReveal {
    constructor() {
      this.elements = $$('.reveal-on-scroll');
      this.options = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
      };
      this.observer = new IntersectionObserver(
        entries => this.onIntersection(entries),
        this.options
      );
      this.init();
    }

    init() {
      this.elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        this.observer.observe(el);
      });
    }

    onIntersection(entries) {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          this.observer.unobserve(entry.target);
        }
      });
    }
  }

  /* ============================================
     MOBILE NAVIGATION TOGGLE
     ============================================ */

  function initMobileNav() {
    const toggle = $('.nav__toggle');
    const menu = $('#navMenu');
    
    if (!toggle || !menu) return;

    const closeMenu = () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    };

    const openMenu = () => {
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-open');
    };

    toggle.addEventListener('click', () => {
      menu.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    $$('.nav__link', menu).forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  /* ============================================
     SECTOR FILTERING
     ============================================ */

  function initSectorFilters() {
    const filterBtns = $$('.seg');
    const sectorCards = $$('#sectorCards .uCard');

    if (filterBtns.length === 0 || sectorCards.length === 0) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter') || 'all';
        
        filterBtns.forEach(b => {
          b.classList.toggle('is-active', b === btn);
        });

        sectorCards.forEach(card => {
          const tags = (card.getAttribute('data-tags') || '').split(/\s+/).filter(Boolean);
          const show = filter === 'all' || tags.includes(filter);
          
          card.style.display = show ? '' : 'none';
          
          if (show) {
            card.style.animation = 'none';
            setTimeout(() => {
              card.style.animation = '';
            }, 10);
          }
        });
      });
    });
  }

  /* ============================================
     FAQ ACCORDION (IMPROVED)
     ============================================ */

  function initFAQ() {
    const faqItems = $$('.faq__item');
    
    faqItems.forEach((item, index) => {
      item.addEventListener('toggle', (e) => {
        // Close other open items
        if (e.target.open) {
          faqItems.forEach((otherItem, otherIndex) => {
            if (otherIndex !== index && otherItem.open) {
              otherItem.open = false;
            }
          });
        }
      });
    });
  }

  /* ============================================
     SECURITY UTILITIES
     ============================================ */

  // XSS Protection: Sanitize input by escaping HTML entities
  function sanitizeInput(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Validate phone number format (10-20 actual digits, can include formatting)
  function validatePhone(phone) {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10 && digitsOnly.length <= 20;
  }

  // Enforce character limits for security
  function enforceMaxLength(str, maxLength) {
    return str.substring(0, maxLength);
  }

  /* ============================================
     CONTACT FORM HANDLER (WITH SECURITY ENHANCEMENTS)
     ============================================ */

  function initContactForm() {
    const form = $('#contactForm');
    const note = $('#formNote');
    const WA_NUMBER = '249125769999';
    const BACKEND_URL = 'https://sudi-backend.onrender.com/submit';

    if (!form) return;

    // Rate limiting: 5 requests per 5 minutes (300000ms)
    // NOTE: Client-side only. For production, implement server-side rate limiting.
    const RATE_LIMIT_MS = 300000; // 5 minutes
    const MAX_SUBMISSIONS = 5;
    let submissionTimes = [];

    // Character limits for security
    const MAX_NAME_LENGTH = 100;
    const MAX_PHONE_LENGTH = 20;
    const MAX_MESSAGE_LENGTH = 1000;

    // Helper function to show message
    const showMessage = (text, color) => {
      if (note) {
        note.textContent = text;
        note.style.color = color;
      }
    };

    // Check rate limit
    const checkRateLimit = () => {
      const now = Date.now();
      submissionTimes = submissionTimes.filter(time => now - time < RATE_LIMIT_MS);
      
      if (submissionTimes.length >= MAX_SUBMISSIONS) {
        return false;
      }
      
      submissionTimes.push(now);
      return true;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Rate limiting check
      if (!checkRateLimit()) {
        showMessage('⚠️ لقد تجاوزت الحد المسموح. يرجى الانتظار 5 دقائق قبل المحاولة مرة أخرى.', '#dc2626');
        return;
      }

      // Get and sanitize form data
      const rawData = {
        name: form.name?.value?.trim() || '',
        phone: form.phone?.value?.trim() || '',
        service: form.service?.value?.trim() || '',
        message: form.message?.value?.trim() || ''
      };

      // Apply character limits
      const formData = {
        name: enforceMaxLength(rawData.name, MAX_NAME_LENGTH),
        phone: enforceMaxLength(rawData.phone, MAX_PHONE_LENGTH),
        service: rawData.service,
        message: enforceMaxLength(rawData.message, MAX_MESSAGE_LENGTH)
      };

      // Validation
      if (!formData.name || !formData.phone || !formData.service || !formData.message) {
        showMessage('⚠️ يرجى ملء جميع الحقول المطلوبة', '#dc2626');
        return;
      }

      // Enhanced phone validation (10-20 digits)
      if (!validatePhone(formData.phone)) {
        showMessage('⚠️ رقم الجوال غير صحيح (يجب أن يحتوي على 10-20 رقم)', '#dc2626');
        return;
      }

      // Sanitize inputs to prevent XSS
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        phone: sanitizeInput(formData.phone),
        service: sanitizeInput(formData.service),
        message: sanitizeInput(formData.message)
      };

      const submitBtn = form.querySelector('button[type="submit"]');
      if (!submitBtn) return;

      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = '⌛ جاري الإرسال...';

      showMessage('⌛ جاري الحفظ سحابياً...', '#daa520');

      try {
        const response = await fetch(BACKEND_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sanitizedData)
        });

        if (response.ok) {
          showMessage('✅ تم الحفظ بنجاح! جاري فتح واتساب...', '#16a34a');
        }
      } catch (error) {
        console.warn('خطأ في الاتصال بالسيرفر:', error);
        showMessage('⚠️ سيتم إرسال الرسالة عبر واتساب فقط', '#ff9800');
      }

      setTimeout(() => {
        // Use sanitized data for WhatsApp message
        const waMessage = `طلب تواصل جديد من شركة سودي\n\n👤 الاسم: ${sanitizedData.name}\n📞 الجوال: ${sanitizedData.phone}\n🏢 الخدمة: ${sanitizedData.service}\n📝 الرسالة:\n${sanitizedData.message}`;
        const waURL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;
        
        window.open(waURL, '_blank');
        
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        if (note) {
          setTimeout(() => {
            note.textContent = '';
          }, 3000);
        }
      }, 1500);
    });
  }

  /* ============================================
     TOUCH SUPPORT FOR MOBILE
     ============================================ */

  function initTouchSupport() {
    let touchStartX = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchStartX - touchEndX;

      // Swipe right to close menu
      if (Math.abs(diffX) > 50 && diffX > 0) {
        const menu = $('#navMenu');
        const toggle = $('.nav__toggle');
        
        if (menu?.classList.contains('is-open')) {
          menu.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('nav-open');
        }
      }
    }, { passive: true });
  }

  /* ============================================
     IMAGE ERROR HANDLING
     ============================================ */

  function initImageErrorHandling() {
    const images = $$('img');
    
    // Placeholder SVG for broken images
    const placeholderSVG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="Arial, sans-serif" font-size="18"%3EImage not available%3C/text%3E%3C/svg%3E';
    
    images.forEach(img => {
      img.addEventListener('error', function() {
        if (this.src !== placeholderSVG) {
          this.src = placeholderSVG;
          this.alt = 'الصورة غير متوفرة';
        }
      }, { once: true });
    });
  }

  /* ============================================
     LAZY LOADING IMAGES
     ============================================ */

  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const images = $$('img[loading="lazy"]');
      
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const src = entry.target.dataset.src || entry.target.src;
            entry.target.src = src;
            entry.target.removeAttribute('loading');
            imageObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.01 });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  /* ============================================
     ACTIVE LINK HIGHLIGHTING (with debounce)
     ============================================ */

  function initActiveLinks() {
    const links = $$('.nav__link[href^="#"]');
    
    if (links.length === 0) return;

    const updateActiveLink = debounce(() => {
      let current = '';
      
      links.forEach(link => {
        const section = $(link.getAttribute('href'));
        if (section && section.offsetTop <= window.scrollY + 100) {
          current = link.getAttribute('href');
        }
      });

      links.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === current);
      });
    }, 100);

    window.addEventListener('scroll', updateActiveLink, { passive: true });
  }

  /* ============================================
     COUNTER ANIMATION
     ============================================ */

  function initCounterAnimation() {
    const stats = $$('.stat__num');
    
    if (stats.length === 0) return;

    const observed = new Set();
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !observed.has(entry.target)) {
          observed.add(entry.target);
          
          const target = entry.target;
          const text = target.textContent;
          const finalValue = parseInt(text.replace(/\D/g, ''));
          const suffix = text.replace(/\d/g, '');
          
          if (!isNaN(finalValue)) {
            let current = 0;
            const increment = Math.max(1, Math.ceil(finalValue / 30));
            
            const timer = setInterval(() => {
              current += increment;
              if (current >= finalValue) {
                target.textContent = finalValue + suffix;
                clearInterval(timer);
              } else {
                target.textContent = current + suffix;
              }
            }, 30);
          }
          
          counterObserver.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(stat => counterObserver.observe(stat));
  }

  /* ============================================
     SERVICE WORKER REGISTRATION (PWA)
     ============================================ */

  function initServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('✅ Service Worker registered successfully:', registration.scope);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              console.log('🔄 Service Worker update found');
              
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('📦 New content available, please refresh.');
                }
              });
            });
          })
          .catch((error) => {
            console.warn('❌ Service Worker registration failed:', error);
          });
      });
    }
  }

  /* ============================================
     DARK MODE SUPPORT
     ============================================ */

  function initDarkModeSupport() {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const setDarkMode = (isDark) => {
      document.documentElement.classList.toggle('dark-mode', isDark);
    };

    setDarkMode(darkModeQuery.matches);
    darkModeQuery.addEventListener('change', (e) => setDarkMode(e.matches));
  }

  /* ============================================
     INITIALIZATION
     ============================================ */

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll);
    } else {
      initAll();
    }
  }

  function initAll() {
    // Initialize core functions
    initMobileNav();
    initSectorFilters();
    initFAQ();
    initContactForm();
    initTouchSupport();
    initImageErrorHandling();
    initLazyLoading();
    initActiveLinks();
    initCounterAnimation();
    initDarkModeSupport();
    initServiceWorker();
    
    // Initialize scroll reveal animations
    new ScrollReveal();

    // Initialize animate.css animations
    const observerForAnimations = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate__animated');
          observerForAnimations.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    $$('[class*="animate__"]').forEach(el => {
      observerForAnimations.observe(el);
    });
  }

  init();

  // Expose functions if needed
  window.initSectorFilters = initSectorFilters;
  window.initFAQ = initFAQ;
})();
