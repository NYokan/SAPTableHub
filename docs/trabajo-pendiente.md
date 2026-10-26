# Trabajo pendiente

Estado a 26 de octubre de 2026, en `main`, publicado en https://saptablehub.pages.dev (Cloudflare Pages publica cada push a `main`). Lo que queda por verificar tabla a tabla (categoría, clase de entrega, dudas, tablas sin explicación y tablas sin campos) está en [`pendientes.md`](pendientes.md); este archivo recoge el resto.

## Limpieza en tu equipo

`concepto-tabla` ya está integrada en `main` y las ramas viejas se borraron de GitHub. En tu copia local pueden quedar:

- Las carpetas `wt-tabla`, `wt-buscador`, `wt-explorar` y `wt-concepto-libre` en `Desktop\Proyectos\SAPTableHub\`: se quitan sin perder sus ramas con `git worktree remove ../wt-buscador` (y lo mismo con las otras).
- Las ramas `concepto-tabla` y `concepto-tabla-v1` ya están enteras en `main`: `git branch -d concepto-tabla concepto-tabla-v1`.
- Las ramas `concepto-buscador`, `concepto-explorar` y `concepto-libre` guardan los diseños descartados, que no están en `main`: bórralas solo si ya no los quieres.

## Contenido

- **Campos y relaciones.** 938 de las 1.018 tablas tienen su clave completa y sus campos principales, y 467 tienen relaciones. Nombres, claves y tipos se contrastaron con la referencia pública del diccionario de ECC 6.0 de leanx.eu (el 95 % de las claves escritas de memoria eran exactas; el resto se corrigió). Esa consulta fue única y no se repite de forma automática; los campos siguen pendientes de verificar contra un sistema SAP real. Faltan 80 tablas: 19 de S/4HANA sin referencia pública y 61 en las que no se tenía claro el significado de algún campo. Las relaciones de las tablas añadidas en la segunda pasada están por hacer. Una extracción de un sistema real (DD03L, DD04T, DD08L) permitiría completar y confirmar todo, incluidas las etiquetas oficiales.
- **Explicaciones.** 1.008 de 1.018 tablas tienen explicación y sinónimos. Las 10 restantes y las que conviene repasar están en `pendientes.md`.
- **Lista oficial de SAP.** De las 271 tablas clásicas de la lista de liberación de objetos, 249 están en el sitio; las 22 restantes se descartaron a propósito (vistas, tablas de sistema o contenido dudoso).
- **Más tablas.** El listado tiene además 9.764 tablas importantes del diccionario de SAP sin explicación propia, en `content/sap-tables.tsv` (cómo se eligieron: [`tablas-sap.md`](tablas-sap.md)). Para explicar una, basta con crear su archivo en `content/tables/`; conviene empezar por las que más se pidan.

## Técnico

- **Tamaño de los datos.** El índice de las tablas explicadas ocupa 806 KB sin comprimir y 164 KB con gzip (107 KB de tablas, sobre todo sinónimos, y 55 KB del diccionario de campos). La lista de SAP va aparte: 600 KB sin comprimir y 139 KB con gzip. Ambos se piden a la vez al abrir el sitio. Si la lista creciera mucho más (sobre 500 KB comprimido), habría que cargarla por letra.
- **Servidores de desarrollo.** Claude Code los cerraba cuando faltaba memoria; se activó `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP=1` (variable de usuario de Windows y `~/.claude/settings.json`). Se aplica al abrir Claude Code de nuevo.
