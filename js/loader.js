/* =========================================================
   Carga los datos desde Supabase (si está configurado).
   Si falla o tarda demasiado, la web usa js/data.js.
   ========================================================= */
window.KAI_READY = (async () => {
  const cfg = window.KAI_SUPABASE || {};
  if (!cfg.url || !cfg.anonKey) return { origen: "local" };

  const base = cfg.url.replace(/\/$/, "") + "/rest/v1/";
  const headers = { apikey: cfg.anonKey, Authorization: "Bearer " + cfg.anonKey };
  const get = (q) => fetch(base + q, { headers }).then((r) => {
    if (!r.ok) throw new Error(q + " → " + r.status);
    return r.json();
  });
  const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 6000));

  try {
    const [prods, grads, evs, faqs, ajs] = await Promise.race([
      Promise.all([
        get("productos?select=*&activo=eq.true&order=orden.asc,id.asc"),
        get("gradeadas?select=*&activo=eq.true&order=orden.asc,id.asc"),
        get("eventos?select=*&order=orden.asc,id.asc"),
        get("faq?select=*&order=orden.asc,id.asc"),
        get("ajustes?select=*"),
      ]),
      timeout,
    ]);

    PRODUCTOS = prods.map((p) => ({
      id: p.id, tipo: p.tipo, set: p.set_nombre, nombre: p.nombre, img: p.img,
      stock: p.stock || {}, tag: p.tag || "", precio: p.precio || "", c1: p.c1, c2: p.c2,
    }));
    GRADEADAS = grads.map((g) => ({
      id: "g" + g.id, nombre: g.nombre, set: g.set_nombre, anio: g.anio, num: g.num,
      empresa: g.empresa, nota: Number(g.nota), etiqueta: g.etiqueta, tipo: g.tipo,
      carta: g.carta, front: g.front, back: g.back, cert: "",
    }));
    EVENTOS = evs.map((e) => ({ nombre: e.nombre, lugar: e.lugar, info: e.info }));
    FAQ = faqs.map((f) => ({ q: f.pregunta, a: f.respuesta }));
    const aj = Object.fromEntries(ajs.map((a) => [a.clave, a.valor]));
    if (aj.actualizado) CONFIG.actualizado = aj.actualizado;
    return { origen: "supabase", ajustes: aj };
  } catch (err) {
    console.warn("[Kai] No se pudo leer Supabase, uso data.js:", err.message);
    return { origen: "local" };
  }
})();
