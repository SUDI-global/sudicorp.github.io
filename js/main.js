(() => {
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

  // Year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  const toggle = $(".nav__toggle");
  const menu = $("#navMenu");
  if (toggle && menu) {
    const closeMenu = () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    };

    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
    });

    // Close on link click
    $$(".nav__link", menu).forEach(a => a.addEventListener("click", closeMenu));

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("is-open")) return;
      const isInside = menu.contains(e.target) || toggle.contains(e.target);
      if (!isInside) closeMenu();
    });

    // Close on escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  // Sector filter
  const filterBtns = $$(".seg");
  const sectorCards = $$("#sectorCards .uCard");

  const setActive = (btn) => {
    filterBtns.forEach(b => b.classList.toggle("is-active", b === btn));
  };

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const f = btn.getAttribute("data-filter") || "all";
      setActive(btn);

      sectorCards.forEach(card => {
        const tags = (card.getAttribute("data-tags") || "").split(/\s+/).filter(Boolean);
        const show = (f === "all") || tags.includes(f);
        card.style.display = show ? "" : "none";
      });
    });
  });

  // Prevent dead download link
  const downloadProfile = $("#downloadProfile");
  if (downloadProfile) {
    downloadProfile.addEventListener("click", (e) => {
      e.preventDefault();
      alert("ارفع ملف البروفايل داخل assets باسم profile.pdf ثم خلّي الرابط يكون: /assets/profile.pdf");
    });
  }

  // Contact -> WhatsApp
  const form = $("#contactForm");
  const note = $("#formNote");
  const copyBtn = $("#copyBtn");

  const WA_NUMBER = "249125769999"; // رقمك بدون +

  const getFormData = () => {
    const fd = new FormData(form);
    return {
      name: (fd.get("name") || "").toString().trim(),
      phone: (fd.get("phone") || "").toString().trim(),
      service: (fd.get("service") || "").toString().trim(),
      message: (fd.get("message") || "").toString().trim(),
    };
  };

  const validate = (d) => {
    if (!d.name || d.name.length < 2) return "اكتب اسم صحيح.";
    if (!d.phone || d.phone.length < 8) return "اكتب رقم تواصل صحيح.";
    if (!d.service) return "اختر الخدمة المطلوبة.";
    if (!d.message || d.message.length < 5) return "اكتب رسالة واضحة.";
    return "";
  };

  const buildText = (d) => {
    return `طلب تواصل - شركة سودي العالمية للاستثمار
الاسم: ${d.name}
رقم التواصل: ${d.phone}
الخدمة: ${d.service}
الرسالة: ${d.message}
الموقع: https://sudicorp.com/`.trim();
  };

  const openWhatsApp = (text) => {
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  };

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = getFormData();
      const err = validate(d);
      if (note) note.textContent = err ? err : "سيتم فتح واتساب الآن...";
      if (err) return;

      openWhatsApp(buildText(d));
      form.reset();
    });
  }

  if (copyBtn && form) {
    copyBtn.addEventListener("click", async () => {
      const d = getFormData();
      const err = validate(d);
      if (note) note.textContent = err ? err : "نسخ الرسالة...";
      if (err) return;

      const text = buildText(d);
      try {
        await navigator.clipboard.writeText(text);
        if (note) note.textContent = "تم نسخ الرسالة. الصقها في أي مكان.";
      } catch {
        if (note) note.textContent = "المتصفح منع النسخ. انسخ يدويًا من الحقول.";
      }
    });
  }
})();
