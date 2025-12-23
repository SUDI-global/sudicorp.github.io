// سنة
document.getElementById("year").textContent = new Date().getFullYear();

// موبايل منيو
const navToggle = document.getElementById("navToggle");
const navMobile = document.getElementById("navMobile");
if (navToggle && navMobile) {
  navToggle.addEventListener("click", () => {
    navMobile.classList.toggle("show");
    const isHidden = !navMobile.classList.contains("show");
    navMobile.setAttribute("aria-hidden", String(isHidden));
  });

  // اقفل القائمة بعد الضغط على رابط
  navMobile.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      navMobile.classList.remove("show");
      navMobile.setAttribute("aria-hidden", "true");
    });
  });
}

// Reveal عند السحب
const revealEls = document.querySelectorAll(".section, .hero__content, .hero__media, .card, .service, .step");
revealEls.forEach(el => el.classList.add("reveal"));

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("show");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

/**
 * 3D Background (Three.js)
 * خفيف، نقاط تتحرك — إذا ما في WebGL أو الموبايل تعبان، نوقفه
 */
(function init3D() {
  const canvas = document.getElementById("bg3d");
  if (!canvas || !window.THREE) return;

  // تقليل الحمل على الموبايل
  const isSmall = window.matchMedia("(max-width: 980px)").matches;
  const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduce) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall ? 1.2 : 1.6));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 18;

  // نجوم/نقاط
  const count = isSmall ? 600 : 1200;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3 + 0] = (Math.random() - 0.5) * 40;
    positions[i3 + 1] = (Math.random() - 0.5) * 24;
    positions[i3 + 2] = (Math.random() - 0.5) * 30;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    size: isSmall ? 0.06 : 0.07,
    transparent: true,
    opacity: 0.65
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  let t = 0;
  function animate() {
    t += 0.003;
    points.rotation.y = t * 0.5;
    points.rotation.x = Math.sin(t * 0.6) * 0.06;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
})();
