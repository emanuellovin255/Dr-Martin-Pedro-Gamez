/* =========================================================
   CONFIG — completar con los datos del Dr. Martín
   (dejar vacío "" mientras no se tenga el dato)
   ========================================================= */
const CONFIG = {
  academyName: "Gámez Dental Academy",   // nombre oficial de la escuela / academia
  whatsapp: "",                           // solo dígitos con lada país, ej: "5219511234567"
  whatsappDisplay: "",                    // ej: "951 123 4567"
  youtubeChannel: "",                     // ej: "https://www.youtube.com/@canal"
  youtubeVideoId: "",                     // ID del último video, ej: "dQw4w9WgXcQ"
  lmsUrl: "",                             // URL de la plataforma de cursos
  instagram: "",
  facebook: "",
};

(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Toast ---------- */
  const toastEl = $("#toast");
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 3200);
  };

  /* ---------- Aplicar CONFIG ---------- */
  $$("[data-config]").forEach((el) => {
    const v = CONFIG[el.dataset.config];
    if (v) el.textContent = v;
  });

  $$("[data-config-href]").forEach((el) => {
    const v = CONFIG[el.dataset.configHref];
    if (v) {
      el.href = v;
    } else {
      el.removeAttribute("target");
      el.addEventListener("click", (e) => {
        e.preventDefault();
        toast("Enlace disponible próximamente.");
      });
    }
  });

  const waLink = (text = "") =>
    CONFIG.whatsapp
      ? `https://wa.me/${CONFIG.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`
      : null;

  const waFloat = $("#waFloat");
  const waDefault = waLink("Hola Dr. Martín, me gustaría agendar una consulta.");
  if (waDefault) {
    waFloat.href = waDefault;
  } else {
    waFloat.removeAttribute("target");
  }

  if (CONFIG.youtubeVideoId) {
    $("#ytPlayer").innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${CONFIG.youtubeVideoId}?rel=0" title="Video del Dr. Martín Gámez" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  }

  /* ---------- Header ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  const burger = $("#burger");
  const nav = $("#nav");
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    document.body.classList.toggle("menu-open", open);
  };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  /* ---------- Link activo ---------- */
  const links = $$(".nav__link");
  const sections = links.map((l) => $(l.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${en.target.id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- Reveal ---------- */
  const revealEls = $$(".reveal");
  const revealer = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
        el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 80}ms`;
        el.classList.add("is-visible");
        revealer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealer.observe(el));

  /* ---------- Contadores (solo si hay cifra real en data-count) ---------- */
  const counter = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseInt(el.dataset.count, 10);
      counter.unobserve(el);
      if (!target) return;
      const suffix = el.dataset.suffix || "+";
      const start = performance.now();
      const dur = 1600;
      const tick = (t) => {
        const p = Math.min((t - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + (p === 1 ? suffix : "");
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  $$("[data-count]").forEach((el) => counter.observe(el));

  /* ---------- Formulario "Avísame" ---------- */
  $("#notifyForm").addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    toast("¡Gracias! Te avisaremos cuando abran las inscripciones.");
  });

  /* ---------- Formulario de contacto → WhatsApp ---------- */
  const contactForm = $("#contactForm");
  contactForm.addEventListener("change", (e) => {
    if (e.target.name === "tipo") {
      contactForm.motivo.value = e.target.value === "Curso" ? "Información de cursos" : "Valoración / primera consulta";
    }
  });
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(contactForm);
    const msg =
      `Hola Dr. Martín, soy ${f.get("nombre")}.\n` +
      `Tipo: ${f.get("tipo")}\n` +
      `Motivo: ${f.get("motivo")}\n` +
      `Teléfono: ${f.get("telefono")}\n` +
      (f.get("mensaje") ? `Mensaje: ${f.get("mensaje")}` : "");
    const url = waLink(msg);
    if (url) {
      window.open(url, "_blank", "noopener");
    } else {
      toast("El número de WhatsApp estará disponible próximamente.");
    }
  });

  /* ---------- Año ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
