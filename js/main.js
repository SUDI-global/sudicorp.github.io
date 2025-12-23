(() => {
  // Year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Mobile nav
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    // close on link click
    nav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Reveal on scroll
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("is-visible");
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));

  // Simple “professional” form behavior (no backend)
  const form = document.getElementById("leadForm");
  const hint = document.getElementById("formHint");
  if (form && hint) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const msg = String(data.get("message") || "").trim();

      // فتح بريد جاهز للإرسال (حل نظيف بدون سيرفر)
      const subject = encodeURIComponent("طلب تواصل – شركة سودي العالمية للاستثمار");
      const body = encodeURIComponent(
`الاسم: ${name}
البريد: ${email}

الرسالة:
${msg}

— تم الإرسال من موقع sudicorp.com`
      );

      window.location.href = `mailto:sudi@sudicorp.com?subject=${subject}&body=${body}`;
      hint.textContent = "تم تجهيز بريد الإرسال… إذا لم يفتح البريد، انسخ الرسالة وأرسلها إلى sudi@sudicorp.com";
      form.reset();
    });
  }
})();
