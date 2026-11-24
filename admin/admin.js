/* =========================================================
   KAI COLLECT · Panel de administración (Supabase)
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = (s = "") => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const LANGS = ["ES", "EN", "JP", "KR"];
  const FLAG = { ES: "🇪🇸", EN: "🇬🇧", JP: "🇯🇵", KR: "🇰🇷" };
  const TIPO_TXT = { sobre: "Sobre", bundle: "Booster Bundle", blister: "Blíster", etb: "ETB", box: "Booster Box", premium: "Colección", tin: "Lata", vintage: "Vintage" };
  const BUCKET = "imagenes";

  /* ---------- Configuración ---------- */
  const cfg = window.KAI_SUPABASE || {};
  if (!cfg.url || !cfg.anonKey || !window.supabase) { $("#noConfig").hidden = false; return; }
  const sb = window.supabase.createClient(cfg.url, cfg.anonKey);

  const S = { productos: [], gradeadas: [], eventos: [], faq: [], ajustes: {} };

  /* ---------- Utilidades ---------- */
  const toast = (msg, error = false) => {
    const t = $("#toast"); t.textContent = msg; t.classList.toggle("is-error", error); t.classList.add("is-show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("is-show"), error ? 5000 : 2200);
  };
  const fail = (err, ctx = "") => {
    console.error(ctx, err);
    let m = err?.message || String(err);
    if (err?.code === "42501" || /row-level security|permission/i.test(m)) m = "No tienes permiso para editar. ¿Tu usuario está en la tabla admins?";
    toast((ctx ? ctx + ": " : "") + m, true);
  };
  const imgUrl = (p) => !p ? "" : /^(https?:|data:|blob:)/.test(p) ? p : "../" + p.replace(/^\.?\//, "");
  const debounce = (fn, ms) => { const timers = new Map(); return (key, ...a) => { clearTimeout(timers.get(key)); timers.set(key, setTimeout(() => fn(key, ...a), ms)); }; };
  const slug = (s) => String(s).normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "img";
  const hoy = () => new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }).replace(".", "");

  async function touchActualizado() {
    const { error } = await sb.from("ajustes").upsert({ clave: "actualizado", valor: hoy() });
    if (error) console.warn(error);
  }

  /* ---------- Imágenes: comprimir y subir ---------- */
  async function compress(file, max = 1000) {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise((r) => c.toBlob(r, "image/webp", 0.88));
    return blob || file;
  }
  async function upload(blob, folder, name) {
    const ext = blob.type === "image/webp" ? "webp" : blob.type === "image/png" ? "png" : "jpg";
    const path = `${folder}/${Date.now()}-${slug(name)}.${ext}`;
    const { error } = await sb.storage.from(BUCKET).upload(path, blob, { contentType: blob.type || "image/webp", upsert: false });
    if (error) throw error;
    return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }
  async function removeStored(url) {
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    if (!url || !url.includes(marker)) return;
    const path = decodeURIComponent(url.split(marker)[1]);
    await sb.storage.from(BUCKET).remove([path]);
  }
  function setupDrop(dropEl, inputEl, previewEl, onFile, max = 1000) {
    const handle = async (file) => {
      if (!file || !file.type.startsWith("image/")) return toast("Eso no es una imagen", true);
      const blob = await compress(file, max);
      previewEl.src = URL.createObjectURL(blob); previewEl.hidden = false;
      onFile(blob);
    };
    inputEl.addEventListener("change", () => { handle(inputEl.files[0]); inputEl.value = ""; });
    ["dragenter", "dragover"].forEach((ev) => dropEl.addEventListener(ev, (e) => { e.preventDefault(); dropEl.classList.add("is-over"); }));
    ["dragleave", "drop"].forEach((ev) => dropEl.addEventListener(ev, () => dropEl.classList.remove("is-over")));
    dropEl.addEventListener("drop", (e) => { e.preventDefault(); handle(e.dataTransfer.files[0]); });
  }

  /* =========================================================
     LOGIN
     ========================================================= */
  async function start() {
    const { data } = await sb.auth.getSession();
    if (data.session) enter(data.session); else showLogin();
  }
  function showLogin(msg = "") { $("#app").hidden = true; $("#login").hidden = false; $("#loginError").textContent = msg; }

  $("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("#loginBtn"); btn.disabled = true; $("#loginError").textContent = "";
    const { data, error } = await sb.auth.signInWithPassword({ email: $("#loginEmail").value.trim(), password: $("#loginPass").value });
    btn.disabled = false;
    if (error) return ($("#loginError").textContent = /invalid/i.test(error.message) ? "Email o contraseña incorrectos." : error.message);
    enter(data.session);
  });
  $("#logout").addEventListener("click", async () => { await sb.auth.signOut(); showLogin(); });

  async function enter(session) {
    const { data, error } = await sb.from("admins").select("user_id").eq("user_id", session.user.id).maybeSingle();
    if (error || !data) {
      await sb.auth.signOut();
      return showLogin("Este usuario no es administrador. Añade su ID a la tabla «admins» (ver README).");
    }
    $("#userEmail").textContent = session.user.email;
    $("#login").hidden = true; $("#app").hidden = false;
    await loadAll();
    go(location.hash.slice(1) || "productos");
  }

  /* ---------- Navegación ---------- */
  function go(view) {
    if (!$("#view-" + view)) view = "productos";
    $$(".view").forEach((v) => (v.hidden = v.id !== "view-" + view));
    $$("#sideNav button").forEach((b) => b.classList.toggle("is-active", b.dataset.view === view));
    history.replaceState(null, "", "#" + view);
  }
  $("#sideNav").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) go(b.dataset.view); });

  async function loadAll() {
    const [p, g, e, f, a] = await Promise.all([
      sb.from("productos").select("*").order("orden").order("id"),
      sb.from("gradeadas").select("*").order("orden").order("id"),
      sb.from("eventos").select("*").order("orden").order("id"),
      sb.from("faq").select("*").order("orden").order("id"),
      sb.from("ajustes").select("*"),
    ]);
    const err = [p, g, e, f, a].find((r) => r.error);
    if (err) fail(err.error, "Cargando datos");
    S.productos = p.data || []; S.gradeadas = g.data || []; S.eventos = e.data || []; S.faq = f.data || [];
    S.ajustes = Object.fromEntries((a.data || []).map((x) => [x.clave, x.valor]));
    fillFilters(); renderProductos(); renderGradeadas(); renderEventos(); renderFaq(); fillTextos();
  }

  /* =========================================================
     PRODUCTOS
     ========================================================= */
  const total = (st) => Object.values(st || {}).reduce((a, b) => a + (Number(b) || 0), 0);

  function fillFilters() {
    const sets = [...new Set(S.productos.map((p) => p.set_nombre).filter(Boolean))].sort();
    const cur = $("#prodSet").value;
    $("#prodSet").innerHTML = `<option value="">Todos los sets</option>` + sets.map((s) => `<option${s === cur ? " selected" : ""}>${esc(s)}</option>`).join("");
    $("#setsList").innerHTML = sets.map((s) => `<option value="${esc(s)}">`).join("");
    const curT = $("#prodTipo").value;
    $("#prodTipo").innerHTML = `<option value="">Todos los tipos</option>` + Object.entries(TIPO_TXT).map(([k, v]) => `<option value="${k}"${k === curT ? " selected" : ""}>${v}</option>`).join("");
  }

  function renderProductos() {
    const q = $("#prodBuscar").value.trim().toLowerCase(), set = $("#prodSet").value, tipo = $("#prodTipo").value, agot = $("#prodAgotados").checked;
    const list = S.productos.filter((p) =>
      (!q || (p.nombre + " " + p.set_nombre).toLowerCase().includes(q)) &&
      (!set || p.set_nombre === set) && (!tipo || p.tipo === tipo) &&
      (!agot || Object.values(p.stock || {}).some((v) => Number(v) === 0)));

    const uds = S.productos.reduce((a, p) => a + total(p.stock), 0);
    const agotados = S.productos.filter((p) => Object.keys(p.stock || {}).length && total(p.stock) === 0).length;
    $("#prodResumen").textContent = `${S.productos.length} productos · ${uds} unidades en tienda · ${agotados} agotados`;

    $("#prodList").innerHTML = list.length ? list.map((p) => `
      <div class="prow${p.activo ? "" : " is-off"}" data-id="${p.id}">
        <div class="prow__img" style="background-image:url('${esc(imgUrl(p.img))}')"></div>
        <div>
          <div class="prow__name">${esc(p.nombre)}</div>
          <div class="prow__meta">
            <span class="pill">${esc(TIPO_TXT[p.tipo] || p.tipo)}</span>${esc(p.set_nombre)}
            ${p.tag ? `<span class="pill pill--red">${esc(p.tag)}</span>` : ""}
            ${p.activo ? "" : `<span class="pill pill--off">Oculto</span>`}
            <span class="saved">✓ Guardado</span>
          </div>
        </div>
        <div class="stocks">${LANGS.map((l) => {
          const v = p.stock?.[l];
          const has = v !== undefined && v !== null && v !== "";
          return `<div class="stk${has && Number(v) === 0 ? " is-zero" : ""}${has ? "" : " is-empty"}">
            <span>${FLAG[l]} ${l}</span>
            <div class="stk__ctrl"><button type="button" data-d="-1" aria-label="Quitar uno ${l}">−</button><input inputmode="numeric" data-l="${l}" value="${has ? Number(v) : ""}" aria-label="Stock ${l}" /><button type="button" data-d="1" aria-label="Añadir uno ${l}">+</button></div>
          </div>`; }).join("")}</div>
        <div class="prow__actions">
          <button class="icon-btn" data-act="toggle" title="${p.activo ? "Ocultar de la web" : "Mostrar en la web"}">${p.activo ? "👁" : "🙈"}</button>
          <button class="icon-btn" data-act="edit" title="Editar">✏️</button>
          <button class="icon-btn icon-btn--del" data-act="del" title="Borrar">🗑</button>
        </div>
      </div>`).join("") : `<div class="empty">No hay productos con ese filtro.</div>`;
  }
  ["input", "change"].forEach((ev) => ["#prodBuscar", "#prodSet", "#prodTipo", "#prodAgotados"].forEach((s) => $(s).addEventListener(ev, renderProductos)));

  const saveStock = debounce(async (id) => {
    const row = $(`.prow[data-id="${id}"]`); if (!row) return;
    const stock = {};
    $$("input[data-l]", row).forEach((i) => { const v = i.value.trim(); if (v !== "") stock[i.dataset.l] = Math.max(0, parseInt(v, 10) || 0); });
    const { error } = await sb.from("productos").update({ stock }).eq("id", id);
    if (error) return fail(error, "Guardando stock");
    const p = S.productos.find((x) => x.id == id); if (p) p.stock = stock;
    $$(".stk", row).forEach((s) => { const v = $("input", s).value.trim(); s.classList.toggle("is-empty", v === ""); s.classList.toggle("is-zero", v !== "" && Number(v) === 0); });
    const ok = $(".saved", row); ok.classList.add("is-on"); setTimeout(() => ok.classList.remove("is-on"), 1500);
    touchActualizado();
  }, 600);

  $("#prodList").addEventListener("click", async (e) => {
    const row = e.target.closest(".prow"); if (!row) return;
    const id = row.dataset.id, p = S.productos.find((x) => x.id == id);
    const step = e.target.closest("[data-d]");
    if (step) {
      const input = $("input", step.parentElement);
      const cur = input.value.trim() === "" ? null : parseInt(input.value, 10) || 0;
      const d = Number(step.dataset.d);
      if (cur === null && d < 0) return;
      input.value = Math.max(0, (cur ?? 0) + d);
      return saveStock(id);
    }
    const act = e.target.closest("[data-act]")?.dataset.act;
    if (act === "edit") openProd(p);
    if (act === "toggle") {
      const { error } = await sb.from("productos").update({ activo: !p.activo }).eq("id", id);
      if (error) return fail(error);
      p.activo = !p.activo; renderProductos(); toast(p.activo ? "Visible en la web" : "Oculto de la web");
    }
    if (act === "del") delProd(p);
  });
  $("#prodList").addEventListener("input", (e) => {
    if (e.target.matches("input[data-l]")) { e.target.value = e.target.value.replace(/[^\d]/g, ""); saveStock(e.target.closest(".prow").dataset.id); }
  });

  async function delProd(p) {
    if (!confirm(`¿Borrar "${p.nombre}"?\nNo se puede deshacer. Si solo quieres quitarlo un tiempo, usa el ojo 👁 para ocultarlo.`)) return false;
    const { error } = await sb.from("productos").delete().eq("id", p.id);
    if (error) { fail(error, "Borrando"); return false; }
    removeStored(p.img).catch(() => {});
    S.productos = S.productos.filter((x) => x.id !== p.id);
    fillFilters(); renderProductos(); toast("Producto borrado"); touchActualizado();
    return true;
  }

  /* ---------- Modal de producto ---------- */
  const pm = $("#prodModal"), pf = $("#prodForm");
  let prodEditing = null, prodBlob = null;
  setupDrop($("#prodDrop"), $("#prodFile"), $("#prodPreview"), (b) => (prodBlob = b));

  function openProd(p = null) {
    prodEditing = p; prodBlob = null; pf.reset(); $("#prodFile").value = "";
    $("#prodModalTitle").textContent = p ? "Editar producto" : "Nuevo producto";
    $("#prodBorrar").hidden = !p;
    const f = pf.elements;
    f.nombre.value = p?.nombre || ""; f.set_nombre.value = p?.set_nombre || ""; f.tipo.value = p?.tipo || "sobre";
    f.tag.value = p?.tag || ""; f.precio.value = p?.precio || ""; f.orden.value = p?.orden ?? 0; f.activo.checked = p ? p.activo : true;
    LANGS.forEach((l) => (f[l].value = p?.stock?.[l] ?? ""));
    const prev = $("#prodPreview");
    if (p?.img) { prev.src = imgUrl(p.img); prev.hidden = false; } else { prev.removeAttribute("src"); prev.hidden = true; }
    pm.showModal(); setTimeout(() => f.nombre.focus(), 50);
  }
  $("#nuevoProducto").addEventListener("click", () => openProd());
  $("#prodBorrar").addEventListener("click", async () => { if (prodEditing && (await delProd(prodEditing))) pm.close(); });

  pf.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = pf.elements, btn = $("#prodGuardar");
    if (!f.nombre.value.trim()) return f.nombre.focus();
    btn.disabled = true; btn.textContent = prodBlob ? "Subiendo foto…" : "Guardando…";
    try {
      const stock = {};
      LANGS.forEach((l) => { const v = f[l].value.trim(); if (v !== "") stock[l] = Math.max(0, parseInt(v, 10) || 0); });
      const row = {
        nombre: f.nombre.value.trim(), set_nombre: f.set_nombre.value.trim(), tipo: f.tipo.value,
        tag: f.tag.value.trim(), precio: f.precio.value.trim(), orden: parseInt(f.orden.value, 10) || 0,
        activo: f.activo.checked, stock,
      };
      if (prodBlob) {
        row.img = await upload(prodBlob, "productos", row.nombre);
        if (prodEditing?.img) removeStored(prodEditing.img).catch(() => {});
      }
      const q = prodEditing ? sb.from("productos").update(row).eq("id", prodEditing.id) : sb.from("productos").insert(row);
      const { error } = await q;
      if (error) throw error;
      pm.close(); toast(prodEditing ? "Producto actualizado ✓" : "Producto creado ✓");
      touchActualizado();
      const { data } = await sb.from("productos").select("*").order("orden").order("id");
      S.productos = data || S.productos; fillFilters(); renderProductos();
    } catch (err) { fail(err, "Guardando producto"); }
    finally { btn.disabled = false; btn.textContent = "Guardar"; }
  });

  /* =========================================================
     GRADEADAS
     ========================================================= */
  function renderGradeadas() {
    $("#gradList").innerHTML = S.gradeadas.length ? S.gradeadas.map((g) => `
      <button class="gcard${g.activo ? "" : " is-off"}" data-id="${g.id}">
        <div class="gcard__img" style="${g.carta ? `background-image:url('${esc(imgUrl(g.carta))}')` : ""}">${g.carta ? "" : "会"}</div>
        <span class="grade">${esc(g.empresa)} ${Number(g.nota)}</span>
        <b>${esc(g.nombre)}</b>
        <small>${esc(g.set_nombre)}${g.anio ? " · " + g.anio : ""}${g.activo ? "" : " · OCULTA"}</small>
      </button>`).join("") : `<div class="empty">Todavía no hay gradeadas.</div>`;
  }
  $("#gradList").addEventListener("click", (e) => { const c = e.target.closest(".gcard"); if (c) openGrad(S.gradeadas.find((g) => g.id == c.dataset.id)); });

  const gm = $("#gradModal"), gf = $("#gradForm");
  let gradEditing = null, gradBlob = null;
  setupDrop($("#gradDrop"), $("#gradFile"), $("#gradPreview"), (b) => (gradBlob = b));

  function openGrad(g = null) {
    gradEditing = g; gradBlob = null; gf.reset(); $("#gradFile").value = "";
    $("#gradModalTitle").textContent = g ? "Editar gradeada" : "Nueva gradeada";
    $("#gradBorrar").hidden = !g;
    const f = gf.elements;
    ["nombre", "set_nombre", "num", "etiqueta"].forEach((k) => (f[k].value = g?.[k] ?? (k === "etiqueta" ? "GEM MT" : "")));
    f.anio.value = g?.anio ?? ""; f.tipo.value = g?.tipo || "fuego"; f.empresa.value = g?.empresa || "PSA";
    f.nota.value = g ? Number(g.nota) : 10; f.orden.value = g?.orden ?? 0; f.activo.checked = g ? g.activo : true;
    const prev = $("#gradPreview");
    if (g?.carta) { prev.src = imgUrl(g.carta); prev.hidden = false; } else { prev.removeAttribute("src"); prev.hidden = true; }
    gm.showModal(); setTimeout(() => f.nombre.focus(), 50);
  }
  $("#nuevaGradeada").addEventListener("click", () => openGrad());

  gf.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = gf.elements, btn = $("#gradGuardar");
    if (!f.nombre.value.trim()) return f.nombre.focus();
    btn.disabled = true; btn.textContent = gradBlob ? "Subiendo imagen…" : "Guardando…";
    try {
      const row = {
        nombre: f.nombre.value.trim(), set_nombre: f.set_nombre.value.trim(), anio: parseInt(f.anio.value, 10) || null,
        num: f.num.value.trim(), empresa: f.empresa.value, nota: parseFloat(f.nota.value) || 10, etiqueta: f.etiqueta.value.trim(),
        tipo: f.tipo.value, orden: parseInt(f.orden.value, 10) || 0, activo: f.activo.checked,
      };
      if (gradBlob) {
        row.carta = await upload(gradBlob, "gradeadas", row.nombre);
        if (gradEditing?.carta) removeStored(gradEditing.carta).catch(() => {});
      }
      const { error } = gradEditing ? await sb.from("gradeadas").update(row).eq("id", gradEditing.id) : await sb.from("gradeadas").insert(row);
      if (error) throw error;
      gm.close(); toast("Gradeada guardada ✓");
      const { data } = await sb.from("gradeadas").select("*").order("orden").order("id");
      S.gradeadas = data || S.gradeadas; renderGradeadas();
    } catch (err) { fail(err, "Guardando gradeada"); }
    finally { btn.disabled = false; btn.textContent = "Guardar"; }
  });
  $("#gradBorrar").addEventListener("click", async () => {
    const g = gradEditing; if (!g || !confirm(`¿Borrar "${g.nombre}" del Vault?`)) return;
    const { error } = await sb.from("gradeadas").delete().eq("id", g.id);
    if (error) return fail(error, "Borrando");
    removeStored(g.carta).catch(() => {});
    S.gradeadas = S.gradeadas.filter((x) => x.id !== g.id); renderGradeadas(); gm.close(); toast("Gradeada borrada");
  });

  $$("[data-close]").forEach((b) => b.addEventListener("click", () => b.closest("dialog").close()));

  /* =========================================================
     EVENTOS y FAQ (filas editables con guardado automático)
     ========================================================= */
  function makeRows({ key, table, listEl, fields, emptyTxt, cls = "" }) {
    function render() {
      const items = S[key];
      $(listEl).innerHTML = items.length ? items.map((it, i) => `
        <div class="erow ${cls}" data-id="${it.id}">
          <div class="erow__order">
            <button data-mv="-1" ${i === 0 ? "disabled" : ""} aria-label="Subir">▲</button>
            <button data-mv="1" ${i === items.length - 1 ? "disabled" : ""} aria-label="Bajar">▼</button>
          </div>
          ${fields.map((f) => `<label>${f.label}${f.area
            ? `<textarea data-f="${f.name}" rows="2" placeholder="${esc(f.ph || "")}">${esc(it[f.name])}</textarea>`
            : `<input data-f="${f.name}" value="${esc(it[f.name])}" placeholder="${esc(f.ph || "")}" />`}</label>`).join("")}
          <button class="icon-btn icon-btn--del" data-del title="Borrar">🗑</button>
        </div>`).join("") : `<div class="empty">${emptyTxt}</div>`;
    }
    const save = debounce(async (id) => {
      const row = $(`${listEl} .erow[data-id="${id}"]`); if (!row) return;
      const upd = {}; $$("[data-f]", row).forEach((i) => (upd[i.dataset.f] = i.value));
      const { error } = await sb.from(table).update(upd).eq("id", id);
      if (error) return fail(error, "Guardando");
      Object.assign(S[key].find((x) => x.id == id), upd); toast("Guardado ✓");
    }, 700);
    $(listEl).addEventListener("input", (e) => { const r = e.target.closest(".erow"); if (r && e.target.dataset.f) save(r.dataset.id); });
    $(listEl).addEventListener("click", async (e) => {
      const r = e.target.closest(".erow"); if (!r) return;
      const idx = S[key].findIndex((x) => x.id == r.dataset.id);
      if (e.target.closest("[data-del]")) {
        if (!confirm("¿Borrar esta fila?")) return;
        const { error } = await sb.from(table).delete().eq("id", r.dataset.id);
        if (error) return fail(error, "Borrando");
        S[key].splice(idx, 1); render(); return toast("Borrado");
      }
      const mv = e.target.closest("[data-mv]");
      if (mv) {
        const j = idx + Number(mv.dataset.mv); if (j < 0 || j >= S[key].length) return;
        [S[key][idx], S[key][j]] = [S[key][j], S[key][idx]];
        S[key].forEach((x, k) => (x.orden = k));
        render();
        const res = await Promise.all(S[key].map((x) => sb.from(table).update({ orden: x.orden }).eq("id", x.id)));
        const bad = res.find((x) => x.error); if (bad) fail(bad.error, "Ordenando");
      }
    });
    async function add(row) {
      row.orden = S[key].length;
      const { data, error } = await sb.from(table).insert(row).select().single();
      if (error) return fail(error, "Añadiendo");
      S[key].push(data); render();
      const last = $(`${listEl} .erow:last-child [data-f]`); last?.focus(); last?.select?.();
    }
    return { render, add };
  }

  const ev = makeRows({
    key: "eventos", table: "eventos", listEl: "#evList", emptyTxt: "No hay eventos.",
    fields: [{ name: "nombre", label: "Evento", ph: "Iberian Card Show" }, { name: "lugar", label: "Lugar", ph: "Madrid" }, { name: "info", label: "Info", ph: "Stand Kai Collect · 14-15 dic" }],
  });
  const fq = makeRows({
    key: "faq", table: "faq", listEl: "#faqList", emptyTxt: "No hay preguntas.", cls: "erow--faq",
    fields: [{ name: "pregunta", label: "Pregunta", ph: "¿Compráis colecciones?" }, { name: "respuesta", label: "Respuesta", area: true }],
  });
  function renderEventos() { ev.render(); }
  function renderFaq() { fq.render(); }
  $("#nuevoEvento").addEventListener("click", () => ev.add({ nombre: "Nuevo evento", lugar: "", info: "" }));
  $("#nuevaFaq").addEventListener("click", () => fq.add({ pregunta: "Nueva pregunta", respuesta: "Respuesta" }));

  /* =========================================================
     TEXTOS
     ========================================================= */
  const TEXT_KEYS = ["aviso", "horario", "direccion", "sobre_mi_1", "sobre_mi_2", "cita"];
  function fillTextos() {
    const f = $("#textosForm").elements; TEXT_KEYS.forEach((k) => (f[k].value = S.ajustes[k] || ""));
    const prev = $("#fotoPreview"), url = S.ajustes.foto_sobre_mi;
    if (url) { prev.src = imgUrl(url); prev.hidden = false; } else { prev.removeAttribute("src"); prev.hidden = true; }
    $("#fotoQuitar").hidden = !url;
  }

  /* Foto de "Sobre mí": se sube y se guarda al momento */
  setupDrop($("#fotoDrop"), $("#fotoFile"), $("#fotoPreview"), async (blob) => {
    try {
      toast("Subiendo foto…");
      const old = S.ajustes.foto_sobre_mi;
      const url = await upload(blob, "sobre-mi", "edu");
      const { error } = await sb.from("ajustes").upsert({ clave: "foto_sobre_mi", valor: url });
      if (error) throw error;
      S.ajustes.foto_sobre_mi = url; $("#fotoQuitar").hidden = false;
      if (old) removeStored(old).catch(() => {});
      toast("Foto actualizada ✓ Ya se ve en la web");
    } catch (err) { fail(err, "Subiendo foto"); fillTextos(); }
  }, 1200);
  $("#fotoQuitar").addEventListener("click", async () => {
    if (!confirm("¿Quitar la foto de \"Sobre mí\"?")) return;
    const old = S.ajustes.foto_sobre_mi;
    const { error } = await sb.from("ajustes").upsert({ clave: "foto_sobre_mi", valor: "" });
    if (error) return fail(error, "Quitando foto");
    S.ajustes.foto_sobre_mi = ""; removeStored(old).catch(() => {}); fillTextos(); toast("Foto quitada");
  });
  $("#guardarTextos").addEventListener("click", async () => {
    const f = $("#textosForm").elements, btn = $("#guardarTextos");
    btn.disabled = true;
    const rows = TEXT_KEYS.map((k) => ({ clave: k, valor: f[k].value.trim() }));
    const { error } = await sb.from("ajustes").upsert(rows);
    btn.disabled = false;
    if (error) return fail(error, "Guardando textos");
    rows.forEach((r) => (S.ajustes[r.clave] = r.valor));
    toast("Textos guardados ✓ Ya se ven en la web");
  });

  /* Sesión caducada */
  sb.auth.onAuthStateChange((event) => { if (event === "SIGNED_OUT") showLogin(); });

  start();
})();
