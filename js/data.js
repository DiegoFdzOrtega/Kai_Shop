/* =========================================================
   KAI COLLECT · DATOS EDITABLES
   ---------------------------------------------------------
   Datos de RESPALDO: la web los usa si Supabase no está
   configurado (js/config.js). Con Supabase activo, Edu edita
   todo desde el panel /admin y este archivo se ignora.
   - stock: unidades POR IDIOMA, ej. { ES: 5, EN: 3, JP: 0 }
            (0 = agotado en ese idioma; si no existe, no se muestra)
   - img:   ruta a la foto real. Ya viene un nombre puesto: guarda
            la foto con ESE nombre en img/productos/ y aparece sola.
            Si la foto no existe, se ve el dibujo automático.
   - precio: opcional. Si está vacío se muestra "Consultar".
   - c1 / c2: colores del mockup automático.
   ⚠ Las cantidades actuales son de EJEMPLO.
   ========================================================= */

const CONFIG = {
  instagram: "https://www.instagram.com/kaicollect.tcg/",
  instagramDM: "https://ig.me/m/kaicollect.tcg",
  cardmarket: "https://www.cardmarket.com/es/Pokemon/Users/KaiCollect",
  tiktok: "https://www.tiktok.com/@kaicollect.tcg",
  youtube: "https://www.youtube.com/@kaicollect/shorts",
  ciudad: "Valencia, España",
  maps: "https://www.google.com/maps/place/POKEKAI/@39.5620403,-0.5033207,17z/data=!3m1!4b1!4m6!3m5!1s0xd605b719297f09d:0x65ed728f6af9568a!8m2!3d39.5620403!4d-0.5007404!16s%2Fg%2F11zk7qdt6c",
  mapsEmbed: "https://maps.google.com/maps?q=39.5620403,-0.5007404&z=16&output=embed",
  seguidores: 15700,
  actualizado: "24 nov 2026",
};

const IDIOMAS = [
  { id: "all", nombre: "Todos" },
  { id: "ES",  nombre: "Español", flag: "🇪🇸" },
  { id: "EN",  nombre: "Inglés",  flag: "🇬🇧" },
  { id: "JP",  nombre: "Japonés", flag: "🇯🇵" },
  { id: "KR",  nombre: "Coreano", flag: "🇰🇷" },
];

const CATEGORIAS = [
  { id: "all",      nombre: "Todo" },
  { id: "30th",     nombre: "30 Aniversario" },
  { id: "ah",       nombre: "Ascended Heroes" },
  { id: "151",      nombre: "151" },
  { id: "sobre",    nombre: "Sobres" },
  { id: "bundle",   nombre: "Booster Bundles" },
  { id: "blister",  nombre: "Blisters" },
  { id: "etb",      nombre: "Elite Trainer Box" },
  { id: "box",      nombre: "Booster Box" },
  { id: "premium",  nombre: "Colecciones" },
  { id: "tin",      nombre: "Latas" },
  { id: "jp",       nombre: "Japonés" },
  { id: "vintage",  nombre: "Vintage" },
];

let PRODUCTOS = [
  // --- 30th Celebration (30 aniversario) ---
  { id: 30, tipo: "sobre",   set: "30th Celebration", nombre: "Sobre 30th Celebration",                  img: "img/productos/30th-sobre.webp",                  stock: { EN: 40, ES: 20 }, c1: "#ffd400", c2: "#d10f2f", tag: "30th" },
  { id: 31, tipo: "bundle",  set: "30th Celebration", nombre: "Booster Bundle 30th Celebration (6 sobres)", img: "img/productos/30th-booster-bundle.webp",      stock: { EN: 8, ES: 4 },  c1: "#ffd400", c2: "#d10f2f", tag: "30th" },
  { id: 29, tipo: "etb",     set: "30th Celebration", nombre: "Elite Trainer Box 30th Celebration",      img: "img/productos/30th-elite-trainer-box.webp",      stock: { EN: 5, ES: 2 },  c1: "#e9d8a6", c2: "#d10f2f", tag: "30th" },
  { id: 32, tipo: "premium", set: "30th Celebration", nombre: "Poster Collection 30th Celebration",      img: "img/productos/30th-poster-collection.webp",      stock: { EN: 6, ES: 3 },  c1: "#29b6ff", c2: "#ffd400", tag: "30th" },
  { id: 33, tipo: "premium", set: "30th Celebration", nombre: "Tech Sticker Collection Lucario 30th Celebration", img: "img/productos/30th-tech-sticker-collection.webp", stock: { EN: 4, ES: 2 }, c1: "#7af0ff", c2: "#5a00ff", tag: "30th" },
  { id: 34, tipo: "premium", set: "30th Celebration", nombre: "Sylveon ex Box 30th Celebration",         img: "img/productos/30th-ex-box.webp",                 stock: { EN: 4, ES: 2 },  c1: "#ff8ad8", c2: "#2b4cff", tag: "30th" },
  { id: 35, tipo: "premium", set: "30th Celebration", nombre: "Knock Out Collection 30th Celebration",   img: "img/productos/30th-knock-out-collection.webp",   stock: { EN: 7, ES: 4 },  c1: "#c58b4a", c2: "#f5f5f5", tag: "30th" },
  { id: 36, tipo: "premium", set: "30th Celebration", nombre: "Binder Collection 30th Celebration",      img: "img/productos/30th-binder-collection.webp",      stock: { EN: 3, ES: 2 },  c1: "#1e1e1e", c2: "#e9d8a6", tag: "30th" },
  { id: 39, tipo: "premium", set: "30th Celebration", nombre: "Ditto Premium Collection 30th Celebration", img: "img/productos/30th-ditto-premium-collection.webp", stock: { EN: 3, ES: 2 }, c1: "#b388ff", c2: "#e9d8a6", tag: "30th" },
  { id: 40, tipo: "premium", set: "30th Celebration", nombre: "Figure Collection Mew 30th Celebration", img: "img/productos/30th-figure-collection-mew.webp", stock: { EN: 2, ES: 1 }, c1: "#ff8ad8", c2: "#e9d8a6", tag: "30th" },
  { id: 38, tipo: "premium", set: "30th Celebration", nombre: "Battle Deck 30th Celebration (Espeon ex / Umbreon ex)", img: "img/productos/30th-battle-deck.webp", stock: { EN: 6, ES: 3 }, c1: "#b04dff", c2: "#141428", tag: "30th" },
  { id: 18, tipo: "premium", set: "30th Celebration", nombre: "Ultra-Premium Collection 30th Celebration", img: "img/productos/30th-ultra-premium-collection.webp", stock: { EN: 2, ES: 1 }, c1: "#e9d8a6", c2: "#b08d57", tag: "Top" },
  { id: 37, tipo: "tin",     set: "30th Celebration", nombre: "Mini Tin Day Pikachu 30th Celebration",               img: "img/productos/30th-mini-tin.webp",               stock: { EN: 12, ES: 6 }, c1: "#ffd400", c2: "#d10f2f", tag: "30th" },
  { id: 41, tipo: "tin",     set: "30th Celebration", nombre: "Mini Tin Night Umbreon 30th Celebration", img: "img/productos/30th-mini-tin-umbreon.webp", stock: { EN: 9, ES: 4 }, c1: "#141428", c2: "#ffe066", tag: "30th" },

  // --- Ascended Heroes ---
  { id: 1,  tipo: "sobre",   set: "Ascended Heroes",      nombre: "Sobre Ascended Heroes",             img: "img/productos/ah-sobre.webp", stock: { ES: 48, EN: 29 }, c1: "#ffcc00", c2: "#ff3b3b", tag: "Nuevo" },
  { id: 42, tipo: "bundle",  set: "Ascended Heroes", nombre: "Booster Bundle Ascended Heroes (6 sobres)", img: "img/productos/ah-booster-bundle.webp", stock: { ES: 6, EN: 4 }, c1: "#ffcc00", c2: "#ff3b3b" },
  { id: 11, tipo: "etb",     set: "Ascended Heroes",      nombre: "Elite Trainer Box Ascended Heroes", img: "img/productos/ah-elite-trainer-box.webp", stock: { ES: 6, EN: 4 },  c1: "#ffcc00", c2: "#ff3b3b", tag: "Top" },
  { id: 44, tipo: "premium", set: "Ascended Heroes", nombre: "Tech Sticker Collection Charmander Ascended Heroes", img: "img/productos/ah-tech-sticker-collection.webp", stock: { ES: 4, EN: 2 }, c1: "#ff7a18", c2: "#5a00ff" },
  { id: 45, tipo: "premium", set: "Ascended Heroes", nombre: "Premium Poster Collection Mega Gardevoir ex", img: "img/productos/ah-premium-poster-collection.webp", stock: { ES: 2, EN: 2 }, c1: "#c2c8ff", c2: "#ff3b3b", tag: "Top" },
  { id: 47, tipo: "tin",     set: "Ascended Heroes", nombre: "Mini Tin Clefairy Ascended Heroes", img: "img/productos/ah-mini-tin-clefairy.webp", stock: { ES: 5, EN: 3 }, c1: "#ff8ad8", c2: "#ffcc00" },
  { id: 48, tipo: "tin",     set: "Ascended Heroes", nombre: "Mini Tin Riolu Ascended Heroes", img: "img/productos/ah-mini-tin-riolu.webp", stock: { ES: 4, EN: 2 }, c1: "#29b6ff", c2: "#1a1a40" },
  { id: 46, tipo: "tin",     set: "Ascended Heroes", nombre: "Mini Tin Pikachu Ascended Heroes", img: "img/productos/ah-mini-tin.webp", stock: { ES: 10, EN: 6 }, c1: "#ffcc00", c2: "#ff3b3b" },

  // --- Scarlet & Violet 151 ---
  { id: 55, tipo: "sobre",   set: "151", nombre: "Sobre 151", img: "img/productos/151-sobre.webp", stock: { EN: 12, ES: 8 }, c1: "#ff3b3b", c2: "#1e1e1e" },
  { id: 50, tipo: "bundle",  set: "151", nombre: "Booster Bundle 151 (6 sobres)", img: "img/productos/151-booster-bundle.webp", stock: { EN: 3, ES: 2 }, c1: "#ff3b3b", c2: "#1e1e1e" },
  { id: 49, tipo: "etb",     set: "151", nombre: "Elite Trainer Box 151", img: "img/productos/151-elite-trainer-box.webp", stock: { EN: 2, ES: 1 }, c1: "#ff3b3b", c2: "#1e1e1e", tag: "Top" },
  { id: 56, tipo: "etb",     set: "151", nombre: "Pokémon Center Elite Trainer Box 151", img: "img/productos/151-pokemon-center-etb.webp", stock: { EN: 1 }, c1: "#ff3b3b", c2: "#1e1e1e", tag: "Top" },
  { id: 51, tipo: "premium", set: "151", nombre: "Poster Collection 151", img: "img/productos/151-poster-collection.webp", stock: { EN: 2, ES: 1 }, c1: "#ff3b3b", c2: "#29b6ff" },
  { id: 52, tipo: "premium", set: "151", nombre: "Binder Collection 151", img: "img/productos/151-binder-collection.webp", stock: { EN: 1, ES: 1 }, c1: "#1e1e1e", c2: "#ff3b3b" },
  { id: 54, tipo: "premium", set: "151", nombre: "ex Box Zapdos ex 151", img: "img/productos/151-ex-box-zapdos.webp", stock: { EN: 2, ES: 2 }, c1: "#ffd400", c2: "#1e1e1e" },
  { id: 57, tipo: "premium", set: "151", nombre: "ex Box Alakazam ex 151", img: "img/productos/151-ex-box-alakazam.webp", stock: { EN: 2, ES: 1 }, c1: "#ffcc00", c2: "#7b2cff" },
  { id: 53, tipo: "premium", set: "151", nombre: "Ultra-Premium Collection 151", img: "img/productos/151-ultra-premium-collection.webp", stock: { EN: 1, ES: 0 }, c1: "#e9d8a6", c2: "#ff3b3b", tag: "Top" },
  { id: 58, tipo: "tin",     set: "151", nombre: "Mini Tin Gengar 151", img: "img/productos/151-mini-tin-gengar.webp", stock: { EN: 4, ES: 3 }, c1: "#7b2cff", c2: "#1e1e1e" },
  { id: 59, tipo: "tin",     set: "151", nombre: "Mini Tin Dragonite 151", img: "img/productos/151-mini-tin-dragonite.webp", stock: { EN: 4, ES: 2 }, c1: "#ff9f1a", c2: "#29b6ff" },

  // --- Japonés ---
  { id: 60, tipo: "sobre",   set: "30th Celebration", nombre: "Sobre 30th CELEBRATION japonés (M6a)", img: "img/productos/jp-30th-sobre.webp", stock: { JP: 30 }, c1: "#ffd400", c2: "#d10f2f", tag: "JP" },
  { id: 61, tipo: "box",     set: "30th Celebration", nombre: "Booster Box 30th CELEBRATION japonesa (20 sobres)", img: "img/productos/jp-30th-booster-box.webp", stock: { JP: 4 }, c1: "#ffd400", c2: "#d10f2f", tag: "JP" },
  { id: 62, tipo: "premium", set: "30th Celebration", nombre: "Premium Deck Set Espeon · Umbreon (JP)", img: "img/productos/jp-30th-premium-deck-espeon-umbreon.webp", stock: { JP: 2 }, c1: "#b04dff", c2: "#141428", tag: "JP" },
  { id: 63, tipo: "premium", set: "30th Celebration", nombre: "30th CELEBRATION FUTURISTIC BOX (JP)", img: "img/productos/jp-30th-futuristic-box.webp", stock: { JP: 1 }, c1: "#29b6ff", c2: "#ff3b3b", tag: "Top" },
  { id: 64, tipo: "sobre",   set: "Ascended Heroes", nombre: "Sobre MEGA Dream ex japonés (M2a)", img: "img/productos/jp-mega-dream-ex-sobre.webp", stock: { JP: 20 }, c1: "#ffcc00", c2: "#ff3b3b", tag: "JP" },
];

/* =========================================================
   GRADEADAS (VAULT 3D)
   - front / back: fotos del slab (delante / detrás). Guarda las
     fotos con ESE nombre en img/gradeadas/. Si no existen, se
     dibuja un slab genérico.
   ========================================================= */
let GRADEADAS = [
  { id: "g6", nombre: "Pikachu Grey Felt Hat", set: "Van Gogh Museum · SVP Promo", anio: 2023, num: "085", empresa: "PSA", nota: 10, etiqueta: "GEM MT", tipo: "vangogh", carta: "img/gradeadas/g6-pikachu-van-gogh.webp", front: "img/gradeadas/g6-pikachu-van-gogh-front.jpg", back: "img/gradeadas/g6-pikachu-van-gogh-back.jpg", cert: "KAI-0006" },
  { id: "g1", nombre: "Charizard", set: "Base Set · 1st Edition", anio: 1999, num: "4/102",  empresa: "PSA", nota: 10, etiqueta: "GEM MT", tipo: "fuego",   carta: "img/gradeadas/g1-charizard.webp", front: "img/gradeadas/g1-charizard-front.jpg", back: "img/gradeadas/g1-charizard-back.jpg", cert: "KAI-0001" },
  { id: "g2", nombre: "Lugia",     set: "Neo Genesis · Holo", anio: 2000, num: "9/111", empresa: "PSA", nota: 10, etiqueta: "GEM MT", tipo: "psiquico", carta: "img/gradeadas/g2-lugia.webp", front: "img/gradeadas/g2-lugia-front.jpg", back: "img/gradeadas/g2-lugia-back.jpg", cert: "KAI-0002" },
  { id: "g3", nombre: "Umbreon VMAX", set: "Evolving Skies · Alt Art", anio: 2021, num: "215/203", empresa: "PSA", nota: 10, etiqueta: "GEM MT", tipo: "siniestro", carta: "img/gradeadas/g3-umbreon-vmax.webp", front: "img/gradeadas/g3-umbreon-vmax-front.jpg", back: "img/gradeadas/g3-umbreon-vmax-back.jpg", cert: "KAI-0003" },
  { id: "g4", nombre: "Rayquaza ★", set: "EX Deoxys · Gold Star", anio: 2005, num: "107/107", empresa: "PSA", nota: 10, etiqueta: "GEM MT", tipo: "dragon", carta: "img/gradeadas/g4-rayquaza-gold-star.webp", front: "img/gradeadas/g4-rayquaza-front.jpg", back: "img/gradeadas/g4-rayquaza-back.jpg", cert: "KAI-0004" },
  { id: "g7", nombre: "Mew ex", set: "Paldean Fates · Special Illustration Rare", anio: 2024, num: "232/091", empresa: "PSA", nota: 10, etiqueta: "GEM MT", tipo: "psiquico", carta: "img/gradeadas/g7-mew-ex.webp", front: "", back: "", cert: "KAI-0007" },
  { id: "g5", nombre: "Blastoise", set: "Base Set · Holo", anio: 1999, num: "2/102", empresa: "CGC", nota: 9.5, etiqueta: "MINT+", tipo: "agua", carta: "img/gradeadas/g5-blastoise.webp", front: "img/gradeadas/g5-blastoise-front.jpg", back: "img/gradeadas/g5-blastoise-back.jpg", cert: "KAI-0005" },
];

/* Paletas de color para los slabs generados (por tipo) */
const TIPOS = {
  fuego:     ["#ff7a18", "#ff2d2d", "#ffd200"],
  psiquico:  ["#c2c8ff", "#6c7bff", "#ffffff"],
  siniestro: ["#141428", "#3a3aff", "#ffe066"],
  dragon:    ["#00e08a", "#0a5c3a", "#ffd200"],
  agua:      ["#29b6ff", "#0b3d91", "#c6f1ff"],
  vangogh:   ["#ffd400", "#1e3a8a", "#f97316"],
};

let EVENTOS = [
  { nombre: "Iberian Trading Card Show", lugar: "Madrid", info: "Powered by Topps · 2026" },
  { nombre: "Iberian Card Show", lugar: "Edición 1", info: "Stand Kai Collect" },
  { nombre: "Swindon Card Show", lugar: "Reino Unido", info: "Valencia → UK" },
  { nombre: "ICONS", lugar: "Card show", info: "Buy · Sell · Trade" },
  { nombre: "Quedadas locales", lugar: "Comunidad Valenciana", info: "Plaza Ayto. San Antonio de Benagéber" },
];

let FAQ = [
  { q: "¿Vendéis por la web?", a: "No. La web muestra el stock disponible en tienda. Para reservar algo escríbenos por Instagram y te lo guardamos. Las ventas online van por Cardmarket." },
  { q: "¿Compráis colecciones?", a: "Sí. Compramos cartas gradeadas, producto sellado y cartas sueltas. Mándanos fotos por DM y te hacemos oferta." },
  { q: "¿Hacéis intercambios?", a: "Buy · Sell · Trade worldwide. Si tienes algo interesante, hablamos." },
  { q: "¿Las gradeadas están a la venta?", a: "Algunas sí y otras son de colección. Pregunta por la que te interese indicando el nº de certificado." },
  { q: "¿Enviáis fuera de España?", a: "Sí, a través de Cardmarket enviamos a toda Europa." },
];
