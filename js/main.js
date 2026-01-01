(() => {
  'use strict';

  /* ============================================
     UTILITY FUNCTIONS
     ============================================ */
  
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

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
      if (menu.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
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
      if (e.key === 'Escape') {
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
     FAQ ACCORDION
     ============================================ */

  function initFAQ() {
    const faqItems = $$('.faq__item');
    
    faqItems.forEach(item => {
      const summary = item.querySelector('summary');
      
      if (summary) {
        summary.addEventListener('click', (e) => {
          e.preventDefault();
          
          faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.hasAttribute('open')) {
              otherItem.removeAttribute('open');
            }
          });
          
          if (item.hasAttribute('open')) {
            item.removeAttribute('open');
          } else {
            item.setAttribute('open', true);
          }
        });
      }
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

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = {
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        service: form.service.value.trim(),
        message: form.message.value.trim()
      };

      if (!formData.name || !formData.phone || !formData.service || !formData.message) {
        if (note) {
          note.textContent = '⚠️ يرجى ملء جميع الحقول المطلوبة';
          note.style.color = '#dc2626';
        }
        return;
      }

      if (!/^\+?[0-9\s\-()]+$/.test(formData.phone)) {
        if (note) {
          note.textContent = '⚠️ رقم الجوال غير صحيح';
          note.style.color = '#dc2626';
        }
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = '⌛ جاري الإرسال...';

      if (note) {
        note.textContent = '⌛ جاري الحفظ سحابياً...';
        note.style.color = '#daa520';
      }

      try {
        const response = await fetch(BACKEND_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          if (note) {
            note.textContent = '✅ تم الحفظ بنجاح! جاري فتح واتساب...';
            note.style.color = '#16a34a';
          }
        }
      } catch (error) {
        console.warn('خطأ في الاتصال بالسيرفر:', error);
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
     HEADER STICKY BEHAVIOR
     ============================================ */

  function initHeaderBehavior() {
    const header = $('.header');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  /* ============================================
     TOUCH SUPPORT FOR MOBILE
     ============================================ */

  function initTouchSupport() {
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      if (Math.abs(diffX) > Math.abs(diffY) && diffX > 50) {
        const menu = $('#navMenu');
        const toggle = $('.nav__toggle');
        
        if (menu && menu.classList.contains('is-open')) {
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
            entry.target.src = entry.target.dataset.src || entry.target.src;
            entry.target.removeAttribute('loading');
            imageObserver.unobserve(entry.target);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  /* ============================================
     ACTIVE LINK HIGHLIGHTING
     ============================================ */

  function initActiveLinks() {
    const links = $$('.nav__link[href^="#"]');
    
    window.addEventListener('scroll', () => {
      let current = '';
      
      links.forEach(link => {
        const section = $(link.getAttribute('href'));
        if (section && section.offsetTop <= window.scrollY + 100) {
          current = link.getAttribute('href');
        }
      });

      links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === current) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }

  /* ============================================
     COUNTER ANIMATION
     ============================================ */

  function initCounterAnimation() {
    const stats = $$('.stat__num');
    const observed = new Set();

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !observed.has(entry.target)) {
          observed.add(entry.target);
          
          const target = entry.target;
          const finalValue = parseInt(target.textContent.replace(/\D/g, ''));
          const suffix = target.textContent.replace(/\d/g, '');
          
          if (!isNaN(finalValue)) {
            let current = 0;
            const increment = Math.ceil(finalValue / 30);
            
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
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark-mode');
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (e.matches) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
    });
  }

  /* ============================================
     YEAR UPDATE
     ============================================ */

  function updateYear() {
    const yearElement = $('#year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  /* ============================================
     INITIALIZATION
     ============================================ */

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initAll();
      });
    } else {
      initAll();
    }
  }

  function initAll() {
    updateYear();
    initMobileNav();
    initSectorFilters();
    initFAQ();
    initContactForm();
    initHeaderBehavior();
    initTouchSupport();
    initLazyLoading();
    initActiveLinks();
    initCounterAnimation();
    initDarkModeSupport();
    
    new ScrollReveal();

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

  window.initSectorFilters = initSectorFilters;
  window.initFAQ = initFAQ;
})();
