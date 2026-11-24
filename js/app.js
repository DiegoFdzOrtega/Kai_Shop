/* =========================================================
   KAI COLLECT · Lógica de la web
   ========================================================= */
(async () => {
  "use strict";
  const DATOS = await (window.KAI_READY || Promise.resolve({ origen: "local" }));

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Enlaces desde CONFIG ---------- */
  const LINKS = { instagram: CONFIG.instagram, cardmarket: CONFIG.cardmarket, dm: CONFIG.instagramDM, tiktok: CONFIG.tiktok, youtube: CONFIG.youtube, maps: CONFIG.maps };
  const mapFrame = $("#mapFrame");
  if (mapFrame) {
    const mio = new IntersectionObserver(([en]) => { if (en.isIntersecting) { mapFrame.src = CONFIG.mapsEmbed; mio.disconnect(); } }, { rootMargin: "300px" });
    mio.observe(mapFrame);
  }
  $$("[data-link]").forEach((a) => (a.href = LINKS[a.dataset.link] || "#"));
  $("#year").textContent = new Date().getFullYear();
  $("#updated").textContent = CONFIG.actualizado;

  /* ---------- Textos editables desde el panel ---------- */
  const AJ = DATOS.ajustes || {};
  const setText = (sel, val) => { const el = $(sel); if (el && val) el.textContent = val; };
  setText("#txtSobre1", AJ.sobre_mi_1);
  setText("#txtSobre2", AJ.sobre_mi_2);
  if (AJ.cita) $("#txtCita").textContent = "“" + AJ.cita + "”";
  setText("#txtDireccion", AJ.direccion);
  if (AJ.horario) { $("#txtHorario").textContent = AJ.horario; $("#txtHorario").hidden = false; }
  if (AJ.foto_sobre_mi) {
    const img = new Image();
    img.alt = "Edu, Kai Collect";
    img.onload = () => { const f = $("#aboutFrame"); f.innerHTML = ""; f.appendChild(img); };
    img.src = AJ.foto_sobre_mi;
  }
  if (AJ.aviso) { $("#aviso").textContent = AJ.aviso; $("#aviso").hidden = false; }

  /* ---------- Header / menú ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 30);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burger = $("#burger"), nav = $("#nav");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  $$("#nav a").forEach((a) => a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", false);
    document.body.style.overflow = "";
  }));

  /* ---------- Glow que sigue al ratón ---------- */
  if (matchMedia("(pointer: fine)").matches) {
    addEventListener("pointermove", (e) => {
      document.documentElement.style.setProperty("--cx", e.clientX + "px");
      document.documentElement.style.setProperty("--cy", e.clientY + "px");
    }, { passive: true });
  }

  /* ---------- Contadores ---------- */
  const fmt = (n) => n >= 1000 ? (n / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1 }) + "K" : String(n);
  function countUp(el) {
    const target = +el.dataset.count, suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = fmt(target) + suffix; return; }
    const t0 = performance.now(), dur = 1600;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(Math.round(target * e)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  // número real de productos
  const heroCount = $('.hero__stats [data-count="28"]');
  if (heroCount) heroCount.dataset.count = PRODUCTOS.length;

  /* ---------- Reveal al hacer scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-in");
      $$("[data-count]", en.target).forEach(countUp);
      if (en.target.matches("[data-count]")) countUp(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 });
  $$(".reveal, .hero__stats").forEach((el) => io.observe(el));

  /* =========================================================
     PRODUCTOS
     ========================================================= */
  const TIPO_TXT = { sobre: "Booster Pack", bundle: "Booster Bundle", blister: "Blíster", etb: "Elite Trainer Box", box: "Booster Box", premium: "Colección Premium", tin: "Lata", jp: "Japonés", vintage: "Vintage" };

  function productArt(p) {
    const vars = `--c1:${p.c1};--c2:${p.c2}`;
    const set = esc(p.set);
    const pack = (extra = "") => `
      <div class="m-pack ${extra}" style="${vars}">
        <div class="swirl"></div>
        <span class="m-small">${esc(langs(p).join("/"))} · TCG</span>
        <span class="m-monogram">会</span>
        <span class="m-label">${set}</span>
        <span class="m-small">BOOSTER</span>
        <div class="foil"></div>
      </div>`;
    const box = (cls, sub) => `
      <div class="m-box ${cls}" style="${vars}">
        <div class="t"></div>
        <div class="s"><span class="m-label">${set}</span></div>
        <div class="f">
          <span class="m-small">${sub}</span>
          <span class="m-monogram">会</span>
          <span class="m-label">${set}</span>
          <div class="foil"></div>
        </div>
      </div>`;
    let inner;
    switch (p.tipo) {
      case "blister": inner = `<div class="m-blister"><div class="bubble">${pack()}</div><span class="tagline">3 BOOSTERS</span></div>`; break;
      case "etb":     inner = box("etb", "ELITE TRAINER"); break;
      case "box":     inner = box("box", "36 BOOSTERS"); break;
      case "premium": inner = box("premium", "PREMIUM COLLECTION"); break;
      case "jp":      inner = `
        <div class="m-box box jp" style="${vars}">
          <div class="t"></div>
          <div class="s"><span class="m-label">${set}</span></div>
          <div class="f"><span class="m-monogram">会</span><span class="m-label">拡張パック · ${set}</span><div class="foil"></div></div>
        </div>`; break;
      case "tin":     inner = `<div class="m-tin" style="${vars}"><div class="body"><span class="m-monogram">会</span></div><div class="lid"></div></div>`; break;
      case "vintage": inner = pack("vintage"); break;
      default:        inner = pack();
    }
    const photo = p.img ? `<img class="photo" src="${esc(p.img)}" alt="${esc(p.nombre)}" loading="lazy" onload="this.parentElement.classList.add('has-photo')" onerror="this.remove()">` : "";
    return `<div class="art" style="${vars}">${inner}${photo}</div>`;
  }

  const FLAG = Object.fromEntries(IDIOMAS.map((l) => [l.id, l.flag || ""]));
  const langs = (p) => Object.keys(p.stock);
  const qty = (p, lang = "all") => lang === "all" ? Object.values(p.stock).reduce((a, b) => a + b, 0) : (p.stock[lang] ?? 0);

  function stockBadge(n) {
    if (n <= 0) return `<span class="badge-stock out">Agotado</span>`;
    if (n <= 3) return `<span class="badge-stock low">Quedan ${n}</span>`;
    return `<span class="badge-stock ok">${n} en tienda</span>`;
  }

  const matchCat = (p, cat) => cat === "all" || p.tipo === cat || (cat === "jp" && "JP" in p.stock) || (cat === "kr" && "KR" in p.stock) || (cat === "30th" && p.set === "30th Celebration") || (cat === "ah" && p.set === "Ascended Heroes") || (cat === "151" && p.set.startsWith("151"));
  const state = { cat: "all", lang: "all", q: "", only: false, sort: "def" };
  const maxStock = Math.max(...PRODUCTOS.map((p) => qty(p)), 1);

  const langEl = $("#langs");
  langEl.innerHTML = IDIOMAS.filter((l) => l.id === "all" || PRODUCTOS.some((p) => l.id in p.stock)).map((l) => `<button class="seg${l.id === "all" ? " is-active" : ""}" data-lang="${l.id}" aria-pressed="${l.id === "all"}">${l.flag ? `<span>${l.flag}</span>` : ""}${esc(l.id === "all" ? l.nombre : l.id)}</button>`).join("");
  langEl.addEventListener("click", (e) => {
    const b = e.target.closest(".seg"); if (!b) return;
    $$(".seg", langEl).forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-pressed", x === b); });
    state.lang = b.dataset.lang; render();
  });

  // chips
  const chipsEl = $("#chips");
  chipsEl.innerHTML = CATEGORIAS.map((c) => {
    const n = PRODUCTOS.filter((p) => matchCat(p, c.id)).length;
    if (!n) return "";  // oculta categorías vacías
    return `<button class="chip${c.id === "all" ? " is-active" : ""}" role="tab" data-cat="${c.id}">${esc(c.nombre)}<b>${n}</b></button>`;
  }).join("");
  chipsEl.addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    $$(".chip", chipsEl).forEach((c) => c.classList.toggle("is-active", c === b));
    state.cat = b.dataset.cat; render();
  });
  $("#search").addEventListener("input", (e) => { state.q = e.target.value.trim().toLowerCase(); render(); });
  $("#onlyStock").addEventListener("change", (e) => { state.only = e.target.checked; render(); });
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });

  function render() {
    let list = PRODUCTOS.filter((p) =>
      matchCat(p, state.cat) &&
      (state.lang === "all" || state.lang in p.stock) &&
      (!state.only || qty(p, state.lang) > 0) &&
      (!state.q || (p.nombre + " " + p.set + " " + langs(p).join(" ")).toLowerCase().includes(state.q))
    );
    if (state.sort === "stock") list = [...list].sort((a, b) => qty(b, state.lang) - qty(a, state.lang));
    if (state.sort === "az") list = [...list].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    if (state.sort === "def") list = [...list].sort((a, b) => (qty(b, state.lang) > 0) - (qty(a, state.lang) > 0));

    $("#grid").innerHTML = list.map((p, i) => {
      const n = qty(p, state.lang);
      const pills = langs(p).map((l) => `<span class="lp${p.stock[l] <= 0 ? " is-zero" : ""}${state.lang === l ? " is-sel" : ""}">${FLAG[l]} ${l} <b>${p.stock[l]}</b></span>`).join("");
      return `
      <button class="card${n <= 0 ? " is-out" : ""}" data-id="${p.id}" style="animation-delay:${Math.min(i, 12) * 40}ms" aria-label="${esc(p.nombre)}, ${n > 0 ? n + " en tienda" : "agotado"}">
        ${p.tag ? `<span class="card__tag card__tag--${esc(p.tag)}">${esc(p.tag)}</span>` : ""}
        ${productArt(p)}
        <div class="card__body">
          <p class="card__set">${esc(TIPO_TXT[p.tipo] || p.tipo)} · ${esc(p.set)}</p>
          <h3 class="card__name">${esc(p.nombre)}</h3>
          <div class="card__foot">${stockBadge(n)}</div>
          <div class="langpills">${pills}</div>
          <div class="stock-bar"><i style="width:${Math.max(4, (n / maxStock) * 100)}%"></i></div>
        </div>
      </button>`; }).join("");

    const disp = list.filter((p) => qty(p, state.lang) > 0).length;
    $("#count").textContent = `${list.length} productos · ${disp} disponibles`;
    $("#empty").hidden = list.length > 0;
  }
  render();

  /* ---------- Modal ---------- */
  const modal = $("#modal");
  let lastFocus = null;
  let modalP = null, modalLang = null;
  function renderModalLang() {
    const p = modalP, n = p.stock[modalLang] ?? 0, name = (IDIOMAS.find((l) => l.id === modalLang) || {}).nombre || modalLang;
    $("#modalLangs").innerHTML = langs(p).map((l) => `<button class="seg${l === modalLang ? " is-active" : ""}" data-l="${l}" aria-pressed="${l === modalLang}"><span>${FLAG[l]}</span>${l}<b>${p.stock[l]}</b></button>`).join("");
    $("#modalTags").innerHTML = `${stockBadge(n)}${p.precio ? `<span class="lang">${esc(p.precio)}</span>` : `<span class="lang">Precio: consultar</span>`}`;
    const msg = n > 0
      ? `¡Hola Kai Collect! Me interesa "${p.nombre}" en ${name.toLowerCase()}. ¿Me lo podéis reservar?`
      : `¡Hola Kai Collect! ¿Os va a entrar "${p.nombre}" en ${name.toLowerCase()}? Avisadme 🙏`;
    $("#modalMsg").textContent = msg;
    $("#modalDM").textContent = n > 0 ? "Reservar por Instagram →" : "Avisarme por Instagram →";
  }
  $("#modalLangs").addEventListener("click", (e) => { const b = e.target.closest(".seg"); if (!b) return; modalLang = b.dataset.l; renderModalLang(); });
  function openModal(p) {
    lastFocus = document.activeElement;
    modalP = p;
    modalLang = state.lang !== "all" && state.lang in p.stock ? state.lang : (langs(p).find((l) => p.stock[l] > 0) || langs(p)[0]);
    $("#modalArt").innerHTML = productArt(p);
    $("#modalSet").textContent = `${TIPO_TXT[p.tipo] || p.tipo} · ${p.set}`;
    $("#modalTitle").textContent = p.nombre;
    $("#modalDM").href = CONFIG.instagramDM;
    renderModalLang();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $(".modal__close", modal).focus();
  }
  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lastFocus && lastFocus.focus();
  }
  $("#grid").addEventListener("click", (e) => {
    const c = e.target.closest(".card"); if (!c) return;
    openModal(PRODUCTOS.find((p) => p.id == c.dataset.id));
  });
  modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal(); });

  const toast = (t) => { const el = $("#toast"); el.textContent = t; el.classList.add("is-show"); clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove("is-show"), 2200); };
  $("#copyMsg").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText($("#modalMsg").textContent); toast("Mensaje copiado ✓ Pégalo en el DM"); }
    catch { toast("No se pudo copiar, cópialo a mano"); }
  });

  /* =========================================================
     SLABS 3D
     ========================================================= */
  function palette(g) { const [a, b, c] = TIPOS[g.tipo] || TIPOS.fuego; return `--p1:${a};--p2:${b};--p3:${c}`; }

  function slabHTML(g) {
    const photoF = g.front ? `<img class="photo" src="${esc(g.front)}" alt="${esc(g.nombre)}, slab por delante" onerror="this.remove()">` : "";
    const photoB = g.back ? `<img class="photo" src="${esc(g.back)}" alt="${esc(g.nombre)}, slab por detrás" onerror="this.remove()">` : "";
    const front = `
        <div class="label">
          <span class="label__co">${esc(g.empresa)}</span>
          <span class="label__name">${g.anio} ${esc(g.nombre)}</span>
          <span class="label__set">${esc(g.set)}</span>
          <span class="label__set">#${esc(g.num)}</span>
          <span class="label__grade"><small>${esc(g.etiqueta)}</small><b>${g.nota}</b></span>
        </div>
        <div class="window">
          ${g.carta ? `<img class="cardimg" src="${esc(g.carta)}" alt="${esc(g.nombre)}" onload="this.parentElement.classList.add('has-card')" onerror="this.remove()">` : ""}
          <div class="gcard" style="${palette(g)}">
            <div class="gcard__top"><b>${esc(g.nombre)}</b><span>${g.anio}</span></div>
            <div class="gcard__art"><span>会</span></div>
            <div class="gcard__txt"><i></i><i></i><i></i><i></i></div>
            <div class="gcard__foot"><span>${esc(g.set)}</span><span>${esc(g.num)}</span></div>
            <div class="shine"></div>
          </div>
        </div>`;
    const back = `
        <div class="label label--back">
          <div class="holo-sticker">会</div>
          <div class="barcode"></div>
          <span class="label__set">${esc(g.empresa)} ${g.nota} · ${esc(g.etiqueta)}</span>
        </div>
        <div class="window"><div class="gback"><span>K会I</span></div></div>`;
    return `
      <div class="slab">
        <div class="slab__side slab__side--l"></div><div class="slab__side slab__side--r"></div>
        <div class="slab__side slab__side--t"></div><div class="slab__side slab__side--b"></div>
        <div class="slab__face slab__face--front">${front}${photoF}<div class="shine"></div></div>
        <div class="slab__face slab__face--back">${back}${photoB}<div class="shine"></div></div>
      </div>`;
  }

  if (!GRADEADAS.length) {
    // Sin gradeadas: se oculta el Vault y el slab de la portada
    $("#heroSlab").hidden = true;
    $("#vault").hidden = true;
    $$('a[href="#vault"]').forEach((l) => (l.hidden = true));
  } else {
  // Slab del hero
  const heroSlab = $("#heroSlab");
  heroSlab.innerHTML = slabHTML(GRADEADAS[0]);
  heroSlab.addEventListener("click", () => $("#vault").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }));

  /* ---------- Vault ---------- */
  const viewer = $("#viewer"), inner = $("#slabInner"), info = $("#vaultInfo"), thumbs = $("#thumbs");
  let current = 0;
  const rot = { x: 0, y: 0, base: 0, dragging: false, sx: 0, sy: 0, startY: 0, startX: 0, last: performance.now() };

  const hint = document.createElement("div");
  hint.className = "drag-hint";
  hint.innerHTML = "⟲ Arrastra para girar";
  viewer.appendChild(hint);

  thumbs.innerHTML = GRADEADAS.map((g, i) => `
    <button class="thumb${i === 0 ? " is-active" : ""}" role="tab" data-i="${i}" style="${palette(g)}">
      <div class="mini${g.carta ? " mini--img" : ""}"${g.carta ? ` style="background-image:url('${esc(g.carta)}')"` : ""}></div><b>${esc(g.nombre)}</b><small>${esc(g.empresa)} ${g.nota}</small>
    </button>`).join("");
  thumbs.addEventListener("click", (e) => { const b = e.target.closest(".thumb"); if (b) select(+b.dataset.i); });

  function select(i) {
    current = i;
    const g = GRADEADAS[i];
    $$(".thumb", thumbs).forEach((t, k) => t.classList.toggle("is-active", k === i));
    inner.animate([{ opacity: 1, transform: inner.style.transform }, { opacity: 0, transform: inner.style.transform + " scale(.9)" }], { duration: 180 }).onfinish = () => {
      inner.innerHTML = slabHTML(g);
      rot.base = 0; rot.y = -60;
      inner.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
    };
    info.innerHTML = `
      <div class="grade-big"><b>${g.nota}</b><span>${esc(g.empresa)}<br>${esc(g.etiqueta)}</span></div>
      <h3>${esc(g.nombre)}</h3>
      <p class="set">${esc(g.set)}</p>
      <div class="vault__btns">
        <button class="btn btn--red" id="flipBtn">Dar la vuelta ⟲</button>
        <a class="btn btn--ghost" href="${CONFIG.instagramDM}" target="_blank" rel="noopener">¿Tienes una? Escríbenos</a>
      </div>`;
    $("#flipBtn").addEventListener("click", flip);
  }
  function flip() { rot.base += 180; rot.last = performance.now(); }

  inner.innerHTML = slabHTML(GRADEADAS[0]);
  select(0);

  // Arrastrar
  viewer.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button, a")) return;
    rot.dragging = true; rot.sx = e.clientX; rot.sy = e.clientY; rot.startY = rot.y; rot.startX = rot.x;
    viewer.setPointerCapture(e.pointerId);
    hint.classList.add("is-hidden");
  });
  viewer.addEventListener("pointermove", (e) => {
    if (!rot.dragging) return;
    rot.y = rot.startY + (e.clientX - rot.sx) * 0.6;
    rot.x = Math.max(-35, Math.min(35, rot.startX - (e.clientY - rot.sy) * 0.35));
  });
  const endDrag = () => {
    if (!rot.dragging) return;
    rot.dragging = false;
    rot.base = Math.round(rot.y / 180) * 180;  // encaja en la cara más cercana
    rot.last = performance.now();
  };
  viewer.addEventListener("pointerup", endDrag);
  viewer.addEventListener("pointercancel", endDrag);
  viewer.addEventListener("dblclick", flip);

  // Animación continua (suavizado + balanceo idle + brillo holo)
  let visible = true;
  new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(viewer);
  function loop(t) {
    if (visible && !rot.dragging) {
      const idle = t - rot.last > 1800 && !reduceMotion;
      const ty = rot.base + (idle ? Math.sin(t / 1500) * 16 : 0);
      const tx = idle ? Math.sin(t / 2100) * 6 : 0;
      rot.y += (ty - rot.y) * 0.08;
      rot.x += (tx - rot.x) * 0.08;
    }
    if (visible) {
      inner.style.transform = `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`;
      const a = ((rot.y % 360) + 360) % 360;
      inner.style.setProperty("--sx", (rot.y * 0.8).toFixed(1));
      inner.style.setProperty("--sp", (Math.sin(a * Math.PI / 180) * 25).toFixed(1) + "%");
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // Brillo del slab del hero siguiendo al ratón
  const heroVis = $(".hero__visual");
  heroVis.addEventListener("pointermove", (e) => {
    const r = heroVis.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    heroSlab.style.setProperty("--sx", (px * 80).toFixed(1));
    heroSlab.style.setProperty("--sp", (px * 30).toFixed(1) + "%");
  });

  }

  /* =========================================================
     EVENTOS + FAQ
     ========================================================= */
  $("#events").innerHTML = EVENTOS.map((ev, i) => `
    <li class="event reveal">
      <span class="event__n">${String(i + 1).padStart(2, "0")}</span>
      <span class="event__name">${esc(ev.nombre)}<small>${esc(ev.lugar)}</small></span>
      <span class="event__info">${esc(ev.info)}</span>
    </li>`).join("");
  $$("#events .reveal").forEach((el) => io.observe(el));

  $("#faqList").innerHTML = FAQ.map((f, i) => `
    <div class="faq-item reveal">
      <button aria-expanded="false" aria-controls="faq${i}">${esc(f.q)}<i>+</i></button>
      <div class="ans" id="faq${i}"><div><p>${esc(f.a)}</p></div></div>
    </div>`).join("");
  $$("#faqList .reveal").forEach((el) => io.observe(el));
  $("#faqList").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    const item = b.parentElement, open = !item.classList.contains("is-open");
    item.classList.toggle("is-open", open);
    b.setAttribute("aria-expanded", open);
  });
})();
