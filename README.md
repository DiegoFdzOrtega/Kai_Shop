# Kai Collect · Web

Web escaparate de **Kai Collect** (Pokémon TCG, Valencia). No vende online: muestra el stock en tienda y manda a Instagram / Cardmarket.

## Estructura
```
index.html        Página
css/styles.css    Estilos (paleta negro / blanco / rojo del logo)
js/data.js        ← DATOS EDITABLES: stock, gradeadas, eventos, FAQ, enlaces
js/app.js         Lógica (filtros, modal, vault 3D…)
img/productos/    Fotos reales de producto (opcional)
img/gradeadas/    Fotos de los slabs: delante y detrás
img/edu.jpg       Foto para "Sobre mí"
```

## Cómo cambiar cosas
- **Stock**: en `js/data.js`, cambia `stock` de cada producto (0 = agotado).
- **Foto real de un producto**: `img: "img/productos/mi-foto.jpg"`.
- **Gradeada con fotos reales**: rellena `front` y `back` con las fotos del slab por delante y por detrás. Si están vacías se dibuja un slab genérico.
- **Foto de Edu**: en `index.html`, sección Sobre mí, sustituye el placeholder por `<img src="img/edu.jpg">`.

Las cantidades de stock actuales son de ejemplo.

## Siguiente paso
Panel/backend para que Edu edite el stock sin tocar código.
