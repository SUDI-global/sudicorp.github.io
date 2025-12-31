(() => {
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

  // تحديث السنة تلقائياً
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // تشغيل قائمة الجوال
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
    $$(".nav__link", menu).forEach(a => a.addEventListener("click", closeMenu));
  }

  // تصفية القطاعات (تجارة، طاقة شمسية، إلخ)
  const filterBtns = $$(".seg");
  const sectorCards = $$("#sectorCards .uCard");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const f = btn.getAttribute("data-filter") || "all";
      filterBtns.forEach(b => b.classList.toggle("is-active", b === btn));
      sectorCards.forEach(card => {
        const tags = (card.getAttribute("data-tags") || "").split(/\s+/).filter(Boolean);
        const show = (f === "all") || tags.includes(f);
        card.style.display = show ? "" : "none";
      });
    });
  });

  // --- التعديل الرسمي لزر تحميل البروفايل ---
  const downloadProfile = $("#downloadProfile");
  if (downloadProfile) {
    downloadProfile.addEventListener("click", (e) => {
      // هذا الرابط سيعمل فور رفعك للملف في مجلد assets
      const profileUrl = "/assets/profile.pdf"; 
      downloadProfile.href = profileUrl;
      downloadProfile.setAttribute("download", "SudiCorp-Profile.pdf");
    });
  }

  // إرسال البيانات عبر واتساب (نموذج التواصل)
  const form = $("#contactForm");
  const note = $("#formNote");
  const WA_NUMBER = "249125769999";

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const d = {
        name: fd.get("name"),
        phone: fd.get("phone"),
        service: fd.get("service"),
        message: fd.get("message")
      };
      
      const text = `طلب تواصل - شركة سودي\nالاسم: ${d.name}\nالخدمة: ${d.service}\nالرسالة: ${d.message}`;
      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
      form.reset();
      if (note) note.textContent = "تم توجيهك لواتساب...";
    });
  }
})();
