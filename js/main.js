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

  // زر تحميل البروفايل
  const downloadProfile = $("#downloadProfile");
  if (downloadProfile) {
    downloadProfile.addEventListener("click", (e) => {
      const profileUrl = "/assets/profile.pdf"; 
      downloadProfile.href = profileUrl;
      downloadProfile.setAttribute("download", "SudiCorp-Profile.pdf");
    });
  }

  // --- الجزء المحدث: إرسال للـ Backend السحابي + واتساب ---
  const form = $("#contactForm");
  const note = $("#formNote");
  const WA_NUMBER = "249125769999";
  const BACKEND_URL = "https://sudi-backend.onrender.com/submit"; // رابطك في Render

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const d = {
        name: fd.get("name"),
        phone: fd.get("phone"),
        service: fd.get("service"),
        message: fd.get("message")
      };

      if (note) note.textContent = "جاري الحفظ سحابياً وتوجيهك لواتساب...";

      // 1. محاولة الحفظ في قاعدة البيانات السحابية (Python)
      try {
        await fetch(BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(d)
        });
      } catch (err) {
        console.log("الـ Backend لا يستجيب حالياً، سيتم الاكتفاء بالواتساب.");
      }

      // 2. التوجيه للواتساب كالمعتاد
      const text = `طلب تواصل - شركة سودي\nالاسم: ${d.name}\nالخدمة: ${d.service}\nالرسالة: ${d.message}`;
      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
      
      form.reset();
    });
  }
})();
