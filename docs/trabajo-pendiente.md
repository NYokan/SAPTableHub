# Trabajo pendiente

Estado a 25 de octubre de 2026, en la rama `concepto-tabla`. Lo que queda por verificar tabla a tabla (categoría, clase de entrega, dudas, tablas sin explicación y tablas sin campos) está en [`pendientes.md`](pendientes.md); este archivo recoge el resto.

## Integración en `main` y limpieza (requieren confirmación manual)

Claude Code bloqueó estas acciones por afectar a la rama principal o borrar ramas, así que siguen pendientes:

- **Integrar `concepto-tabla` en `main`.** En GitHub, `main` está en `baa09f3` (primera versión, 56 tablas) y `concepto-tabla` contiene ese commit, así que la integración es directa (sin conflictos). El commit `17096e5` ya forma parte de `concepto-tabla`; si tu `main` local lo tiene y no lo subiste, la integración sigue siendo directa. Desde la carpeta `SAPTableHub`:
  `git merge --ff-only concepto-tabla` y `git push origin main`.
- **`concepto-tabla-v1`** (local y en GitHub): es un estado anterior de `concepto-tabla` (`3f6efc1`) y no contiene nada que no esté ya en `concepto-tabla`. Para borrarla:
  `git branch -d concepto-tabla-v1` y `git push origin --delete concepto-tabla-v1`.
- **Conceptos descartados**: las ramas locales `concepto-buscador`, `concepto-explorar` y `concepto-libre` y sus carpetas `wt-buscador`, `wt-explorar` y `wt-concepto-libre` en `Desktop\Proyectos\SAPTableHub\`. Las carpetas no tienen cambios sin guardar. Para quitarlas sin perder las ramas:
  `git worktree remove ../wt-buscador` (y lo mismo con las otras dos).
- **`concepto-tabla`** y su carpeta `wt-tabla`: se pueden quitar igual una vez integrada en `main`.

## Contenido

- **Campos y relaciones.** 938 de las 1.018 tablas tienen su clave completa y sus campos principales, y 467 tienen relaciones. Nombres, claves y tipos se contrastaron con la referencia pública del diccionario de ECC 6.0 de leanx.eu (el 95 % de las claves escritas de memoria eran exactas; el resto se corrigió). Esa consulta fue única y no se repite de forma automática; los campos siguen pendientes de verificar contra un sistema SAP real. Faltan 80 tablas: 19 de S/4HANA sin referencia pública y 61 en las que no se tenía claro el significado de algún campo. Las relaciones de las tablas añadidas en la segunda pasada están por hacer. Una extracción de un sistema real (DD03L, DD04T, DD08L) permitiría completar y confirmar todo, incluidas las etiquetas oficiales.
- **Espacio en `main`.** `src/views/common.ts:29` dice `tableHref =(` en `main`; en `concepto-tabla` ya está corregido y se arregla al integrar.
- **Explicaciones.** 1.008 de 1.018 tablas tienen explicación y sinónimos. Las 10 restantes y las que conviene repasar están en `pendientes.md`.
- **Lista oficial de SAP.** De las 271 tablas clásicas de la lista de liberación de objetos, 249 están en el sitio; las 22 restantes se descartaron a propósito (vistas, tablas de sistema o contenido dudoso).
- **Más tablas.** Se pueden añadir cuando se puedan verificar; no se rellenó con tablas dudosas.

## Técnico

- **Tamaño del índice.** 806 KB sin comprimir y 164 KB con gzip (107 KB de tablas, sobre todo sinónimos, y 55 KB del diccionario de campos). Si el catálogo crece mucho más (sobre 300 KB comprimido), habría que dividirlo por letra o por área.
- **Servidores de desarrollo.** Claude Code los cerraba cuando faltaba memoria; se activó `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP=1` (variable de usuario de Windows y `~/.claude/settings.json`). Se aplica al abrir Claude Code de nuevo.
