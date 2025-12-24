(() => {
  // سنة الفوتر
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // زر أعلى
  const toTop = document.getElementById("toTop");
  const toggleTop = () => {
    if (!toTop) return;
    if (window.scrollY > 450) toTop.classList.add("show");
    else toTop.classList.remove("show");
  };
  window.addEventListener("scroll", toggleTop, { passive: true });
  toggleTop();

  if (toTop) {
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // عدادات بسيطة
  const counters = document.querySelectorAll("[data-counter]");
  const runCounter = (el) => {
    const target = Number(el.getAttribute("data-counter") || "0");
    const duration = 900;
    const start = performance.now();
    const from = 0;

    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const val = Math.floor(from + (target - from) * p);
      el.textContent = String(val);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (counters.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          runCounter(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.35 });

    counters.forEach(c => io.observe(c));
  }

  // سلايدر القطاعات بدون مكتبات
  const track = document.getElementById("sectorTrack");
  const prev = document.getElementById("prevSector");
  const next = document.getElementById("nextSector");

  const scrollByCard = (dir) => {
    if (!track) return;
    const card = track.querySelector(".sector-card");
    const w = card ? card.getBoundingClientRect().width : 280;
    track.scrollBy({ left: dir * (w + 14), behavior: "smooth" });
  };

  if (prev) prev.addEventListener("click", () => scrollByCard(1));   // RTL
  if (next) next.addEventListener("click", () => scrollByCard(-1));

  // نموذج الرسالة: يفتح البريد
  const form = document.getElementById("leadForm");
  const hint = document.getElementById("formHint");

  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      const name = (fd.get("name") || "").toString().trim();
      const phone = (fd.get("phone") || "").toString().trim();
      const email = (fd.get("email") || "").toString().trim();
      const message = (fd.get("message") || "").toString().trim();

      const subject = `طلب تواصل - ${name || "عميل"}`;
      const body =
`الاسم: ${name}
الهاتف: ${phone}
البريد: ${email}

الرسالة:
${message}
`;

      const mailto = `mailto:sudi@sudicorp.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;

      if (hint) hint.textContent = "تم فتح البريد. إذا ما فتح: انسخ الرسالة وأرسلها يدويًا.";
    });
  }
})();
