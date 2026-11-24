# Kai Collect · Web + Panel

Diseño web para **Kai Collect**, la tienda de Pokémon TCG de un amigo en Valencia, con panel de administración para que él gestione el stock.

- **Web pública:** catálogo de stock filtrable por set, tipo e idioma (ES / EN / JP / KR), slabs gradeados en 3D, tienda en Google Maps, redes y FAQ.
- **Panel `/admin`:** login, stock por idioma con guardado automático, productos nuevos con subida de foto, gradeadas, eventos, FAQ, textos, horario y barra de aviso.
- **Tecnología:** HTML, CSS y JavaScript sin frameworks + [Supabase](https://supabase.com) (base de datos, login y almacenamiento de imágenes).

> Pokémon y sus imágenes pertenecen a Nintendo, Creatures Inc. y GAME FREAK. Proyecto sin afiliación oficial.

## Estructura

```
index.html, css/, js/, img/   Web pública
js/config.js                  ← URL y clave pública de Supabase
js/data.js                    Datos de respaldo (si Supabase no está configurado)
js/loader.js                  Lee los datos de Supabase
admin/                        Panel de administración
supabase/schema.sql           Tablas, seguridad y bucket de imágenes
supabase/seed.sql             Productos actuales para empezar
```

## Puesta en marcha (unos 10 minutos)

1. **Crear el proyecto:** en [supabase.com](https://supabase.com) → *New project* (plan gratuito).
2. **Crear las tablas:** *SQL Editor* → pega `supabase/schema.sql` → **Run**. Después pega `supabase/seed.sql` → **Run**.
3. **Crear el usuario de Edu:** *Authentication → Users → Add user* (email + contraseña, marca *Auto confirm*).
4. **Hacerle administrador:** copia su **User UID** y ejecuta en el SQL Editor:
   ```sql
   insert into public.admins (user_id) values ('PEGA-AQUI-EL-UID');
   ```
5. **Cerrar el registro público:** *Authentication → Sign In / Providers →* desactiva **Allow new users to sign up**.
6. **Conectar la web:** *Project Settings → API* → copia **Project URL** y la clave **anon public** en `js/config.js`.
7. **Publicar:** sube la carpeta a GitHub y activa **GitHub Pages** (o Netlify). El panel queda en `https://tu-web/admin/`.

### Seguridad

- La clave *anon* es pública por diseño. Lo que protege los datos son las reglas **RLS** de `schema.sql`.
- Cualquiera puede **leer**. Solo los usuarios de la tabla `admins` pueden **crear, editar o borrar**, y lo mismo vale para subir imágenes.

## Cómo lo usa Edu

| Quiere… | En el panel |
|---|---|
| Cambiar stock | **Productos** → escribe el número o pulsa − / + (se guarda solo). Vacío = no lo vende en ese idioma · 0 = agotado |
| Añadir un producto | **+ Nuevo producto** → arrastra la foto (se comprime sola a WebP) |
| Quitarlo un tiempo | Botón 👁 (lo oculta sin borrarlo) |
| Poner un aviso | **Textos y aviso** → "Barra de aviso" (ej. *Cerrado el lunes*) |
| Horario / dirección | **Textos y aviso** |
| Foto de "Sobre mí" | **Textos y aviso** → arrastra la foto (se guarda al momento) |
| Card shows | **Eventos** (▲▼ para ordenar) |

Sin `js/config.js` configurado, la web funciona igual con los datos de `js/data.js`.
