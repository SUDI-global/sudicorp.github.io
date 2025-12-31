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

  // تصفية القطاعات
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

  // --- الجزء الذي قمت بتصحيحه لك (الحفظ والواتساب) ---
  const form = $("#contactForm");
  const note = $("#formNote");
  const WA_NUMBER = "249125769999";
  const BACKEND_URL = "https://sudi-backend.onrender.com/submit"; 

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const d = {
        name: form.name.value,
        phone: form.phone.value,
        service: form.service.value,
        message: form.message.value
      };

      if (note) {
          note.textContent = "⌛ جاري الحفظ سحابياً...";
          note.style.color = "#daa520";
      }

      try {
        // الحفظ في قاعدة البيانات
        const resp = await fetch(BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(d)
        });

        if (resp.ok) {
            if (note) note.textContent = "✅ تم الحفظ! جاري فتح واتساب...";
        }
      } catch (err) {
        console.log("خطأ في الاتصال بالسيرفر:", err);
      }

      // التوجيه للواتساب (يعمل دائماً حتى لو فشل السيرفر)
      const text = `طلب تواصل - شركة سودي\nالاسم: ${d.name}\nالخدمة: ${d.service}\nالرسالة: ${d.message}`;
      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
      
      setTimeout(() => {
          window.open(url, "_blank");
          form.reset();
          if (note) note.textContent = "";
      }, 1000);
    });
  }
})();
