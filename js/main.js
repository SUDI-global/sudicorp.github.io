(() => {
  // Year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // AOS
  if (window.AOS) {
    AOS.init({ once: true, duration: 800, offset: 80 });
  }

  // Swiper
  if (window.Swiper) {
    new Swiper("#sectorsSwiper", {
      slidesPerView: 1.15,
      spaceBetween: 14,
      centeredSlides: false,
      loop: true,
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".swiper-next",
        prevEl: ".swiper-prev"
      },
      breakpoints: {
        576: { slidesPerView: 1.6 },
        768: { slidesPerView: 2.2 },
        992: { slidesPerView: 3.0 }
      }
    });
  }

  // Smooth “to top”
  const toTop = document.getElementById("toTop");
  const toggleTop = () => {
    if (!toTop) return;
    if (window.scrollY > 600) toTop.classList.remove("hidden");
    else toTop.classList.add("hidden");
  };
  toggleTop();
  window.addEventListener("scroll", toggleTop);

  if (toTop) {
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // Animated counters
  const counters = document.querySelectorAll("[data-count]");
  const animateCount = (el) => {
    const target = Number(el.getAttribute("data-count") || "0");
    if (!Number.isFinite(target)) return;

    // For 2013 keep static (looks better)
    if (target === 2013) { el.textContent = "2013"; return; }

    const start = 0;
    const duration = 900;
    const startTime = performance.now();

    const step = (t) => {
      const p = Math.min((t - startTime) / duration, 1);
      const value = Math.floor(start + (target - start) * p);
      el.textContent = String(value);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));

  // Form: mailto with content
  const form = document.getElementById("leadForm");
  const hint = document.getElementById("formHint");
  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const email = String(data.get("email") || "").trim();
      const msg = String(data.get("message") || "").trim();

      const subject = encodeURIComponent("طلب تواصل — شركة سودي العالمية للاستثمار");
      const body = encodeURIComponent(
`الاسم: ${name}
الهاتف: ${phone}
البريد: ${email}

الرسالة:
${msg}

— مرسل من موقع sudicorp.com`
      );

      window.location.href = `mailto:sudi@sudicorp.com?subject=${subject}&body=${body}`;
      if (hint) hint.textContent = "تم تجهيز بريد الإرسال… إذا لم يفتح، انسخ الرسالة وأرسلها إلى sudi@sudicorp.com";
      form.reset();
    });
  }
})();
