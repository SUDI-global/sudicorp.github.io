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
     CONTACT FORM HANDLER
     ============================================ */

  function initContactForm() {
    const form = $('#contactForm');
    const note = $('#formNote');
    const WA_NUMBER = '249125769999';
    const BACKEND_URL = 'https://sudi-backend.onrender.com/submit';

    if (!form) return;

    // Helper function to show message
    const showMessage = (text, color) => {
      if (note) {
        note.textContent = text;
        note.style.color = color;
      }
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = {
        name: form.name?.value?.trim() || '',
        phone: form.phone?.value?.trim() || '',
        service: form.service?.value?.trim() || '',
        message: form.message?.value?.trim() || ''
      };

      // Validation
      if (!formData.name || !formData.phone || !formData.service || !formData.message) {
        showMessage('⚠️ يرجى ملء جميع الحقول المطلوبة', '#dc2626');
        return;
      }

      if (!/^\+?[0-9\s\-()]{7,}$/.test(formData.phone)) {
        showMessage('⚠️ رقم الجوال غير صحيح (على الأقل 7 أرقام)', '#dc2626');
        return;
      }

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
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          showMessage('✅ تم الحفظ بنجاح! جاري فتح واتساب...', '#16a34a');
        }
      } catch (error) {
        console.warn('خطأ في الاتصال بالسيرفر:', error);
        showMessage('⚠️ سيتم إرسال الرسالة عبر واتساب فقط', '#ff9800');
      }

      setTimeout(() => {
        const waMessage = `طلب تواصل جديد من شركة سودي\n\n👤 الاسم: ${formData.name}\n📞 الجوال: ${formData.phone}\n🏢 الخدمة: ${formData.service}\n📝 الرسالة:\n${formData.message}`;
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
    initLazyLoading();
    initActiveLinks();
    initCounterAnimation();
    initDarkModeSupport();
    
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
