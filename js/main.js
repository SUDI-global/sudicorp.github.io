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
    };

    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
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
      const f = btn.getAttribute("data-filter");
      setActive(btn);

      sectorCards.forEach(card => {
        const tags = (card.getAttribute("data-tags") || "").split(/\s+/).filter(Boolean);
        const show = (f === "all") || tags.includes(f);
        card.style.display = show ? "" : "none";
      });
    });
  });

  // Fake profile download (prevent dead link)
  const downloadProfile = $("#downloadProfile");
  if (downloadProfile) {
    downloadProfile.addEventListener("click", (e) => {
      e.preventDefault();
      alert("ارفع ملف الـ PDF (مثلاً: profile.pdf) داخل نفس المجلد ثم غيّر رابط الزر له.");
    });
  }

  // WhatsApp sending from form
  const form = $("#contactForm");
  const note = $("#formNote");
  const waBtn = $("#whatsBtn");

  const buildWhatsAppUrl = (data) => {
    const phone = "966500000000"; // غيّره لرقمك بدون +
    const text =
`طلب تواصل - شركة سودي
الاسم: ${data.name}
الجوال: ${data.phone}
الخدمة: ${data.service}
الرسالة: ${data.message}`.trim();

    const encoded = encodeURIComponent(text);
    return `https://wa.me/${phone}?text=${encoded}`;
  };

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
    if (!d.phone || d.phone.length < 9) return "اكتب رقم جوال صحيح.";
    if (!d.service) return "اختر الخدمة المطلوبة.";
    if (!d.message || d.message.length < 5) return "اكتب رسالة واضحة.";
    return "";
  };

  if (waBtn && form) {
    waBtn.addEventListener("click", () => {
      const d = getFormData();
      const err = validate(d);
      if (note) note.textContent = err ? err : "سيتم فتح واتساب الآن...";
      if (err) return;
      window.open(buildWhatsAppUrl(d), "_blank", "noopener");
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = getFormData();
      const err = validate(d);
      if (note) note.textContent = err ? err : "تم! سيتم فتح واتساب لإرسال الطلب.";
      if (err) return;

      // Here we use WhatsApp as default "send" without backend.
      window.open(buildWhatsAppUrl(d), "_blank", "noopener");
      form.reset();
    });
  }

  // Smooth scroll (safe)
  document.documentElement.style.scrollBehavior = "smooth";
})();
