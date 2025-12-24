/* SUDI Light Corporate - No external libs */

(function () {
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => Array.from(root.querySelectorAll(q));

  // Year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = $("#navToggle");
  const nav = $("#nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // close on link click (mobile)
    $$(".navlink", nav).forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Smooth scroll with offset (sticky bars)
  const stickyOffset = () => 130; // topbar+header approx
  $$(".navlink").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = $(href);
      if (!target) return;

      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - stickyOffset();
      window.scrollTo({ top: y, behavior: "smooth" });
      history.replaceState(null, "", href);
    });
  });

  // Active nav link on scroll
  const sections = ["#about", "#sectors", "#capabilities", "#why", "#contact"]
    .map((id) => $(id))
    .filter(Boolean);

  function setActiveLink() {
    const y = window.scrollY + stickyOffset() + 20;
    let current = "#top";
    for (const sec of sections) {
      if (sec.offsetTop <= y) current = `#${sec.id}`;
    }
    $$(".navlink").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === current);
    });
  }
  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  // Back to top button
  const toTop = $("#toTop");
  if (toTop) {
    window.addEventListener(
      "scroll",
      () => {
        const show = window.scrollY > 700;
        toTop.style.display = show ? "grid" : "none";
      },
      { passive: true }
    );
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // Mailto form
  const leadForm = $("#leadForm");
  const formHint = $("#formHint");
  if (leadForm) {
    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(leadForm);
      const name = (data.get("name") || "").toString().trim();
      const phone = (data.get("phone") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const message = (data.get("message") || "").toString().trim();

      const subject = encodeURIComponent(`طلب تواصل - ${name || "عميل"}`);
      const body = encodeURIComponent(
        `الاسم: ${name}\nالهاتف: ${phone}\nالبريد: ${email}\n\nالرسالة:\n${message}\n`
      );

      if (formHint) formHint.textContent = "تم فتح البريد…";
      window.location.href = `mailto:sudi@sudicorp.com?subject=${subject}&body=${body}`;
      setTimeout(() => { if (formHint) formHint.textContent = ""; }, 2500);
    });
  }

  // Counters (stats)
  function animateCount(el, to) {
    const isYear = to >= 1900 && to <= 2100;
    const duration = 900;
    const start = performance.now();
    const from = parseInt(el.textContent || "0", 10) || 0;

    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(from + (to - from) * eased);
      el.textContent = isYear ? String(to) : String(val);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = String(to);
    }
    requestAnimationFrame(tick);
  }

  const statNums = $$(".stat-num[data-count]");
  const seen = new WeakSet();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && !seen.has(en.target)) {
          seen.add(en.target);
          const to = parseInt(en.target.getAttribute("data-count"), 10);
          animateCount(en.target, to);
        }
      });
    },
    { threshold: 0.5 }
  );
  statNums.forEach((el) => io.observe(el));

  // Simple carousel (sectors)
  const track = $("#sectorTrack");
  const dotsWrap = $("#sectorDots");
  const btnPrev = $("#prevSector");
  const btnNext = $("#nextSector");

  if (track && dotsWrap && btnPrev && btnNext) {
    const slides = $$(".slide", track);
    let index = 0;

    const slidesPerView = () => (window.matchMedia("(max-width: 980px)").matches ? 1 : 3);
    const pageCount = () => Math.ceil(slides.length / slidesPerView());

    function buildDots() {
      dotsWrap.innerHTML = "";
      const pages = pageCount();
      for (let i = 0; i < pages; i++) {
        const d = document.createElement("button");
        d.className = "dot" + (i === index ? " active" : "");
        d.type = "button";
        d.setAttribute("aria-label", `page ${i + 1}`);
        d.addEventListener("click", () => go(i));
        dotsWrap.appendChild(d);
      }
    }

    function update() {
      const per = slidesPerView();
      const pages = pageCount();
      index = Math.max(0, Math.min(index, pages - 1));

      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = 0; // already in padding
      const offsetSlides = index * per;
      const x = offsetSlides * (slideWidth + gap);

      // Because each .slide has padding, using translate by its full width still works (flex item width)
      track.style.transform = `translateX(${x}px)`;

      $$(".dot", dotsWrap).forEach((d, i) => d.classList.toggle("active", i === index));
    }

    function go(i) {
      index = i;
      update();
    }

    btnNext.addEventListener("click", () => go(index + 1));
    btnPrev.addEventListener("click", () => go(index - 1));

    window.addEventListener("resize", () => {
      buildDots();
      update();
    });

    // init
    buildDots();
    update();

    // Auto-play (خفيف)
    let t = setInterval(() => {
      const pages = pageCount();
      go((index + 1) % pages);
    }, 4500);

    // stop auto on hover (desktop)
    const carousel = track.parentElement;
    if (carousel) {
      carousel.addEventListener("mouseenter", () => clearInterval(t));
      carousel.addEventListener("mouseleave", () => {
        clearInterval(t);
        t = setInterval(() => {
          const pages = pageCount();
          go((index + 1) % pages);
        }, 4500);
      });
    }
  }
})();
