# Trabajo pendiente

Estado a 24 de octubre de 2026, en la rama `concepto-tabla` (commit `3db4e23` y siguientes). Lo que queda por verificar tabla a tabla (categoría, clase de entrega, dudas) está en [`pendientes.md`](pendientes.md); este archivo recoge el resto.

## Decisiones del propietario

- **Integrar `concepto-tabla` en `main`.** `main` sigue con el restyle base (`17096e5`) y 56 tablas; `origin/main` está aún en `baa09f3`. Nada de esta rama se ha mezclado con `main`.
- **Rama duplicada `concepto-tabla-v1`.** Apunta a `3f6efc1`, un estado anterior de `concepto-tabla`, y está también en GitHub. Se puede borrar (local y remota) si ya no hace falta.
- **Otros conceptos.** Las ramas `concepto-buscador`, `concepto-explorar` y `concepto-libre` siguen con sus worktrees en `Desktop\Proyectos\SAPTableHub\` (`wt-buscador`, `wt-explorar`, `wt-concepto-libre`). Cuando se elija la dirección definitiva, se pueden quitar con `git worktree remove` y borrar las ramas.

## Contenido

- **Campos y relaciones.** Solo 17 de las 1.003 tablas tienen campos y relaciones. Las demás muestran título, área, contenido y, cuando se conocen, componente, categoría y clase de entrega. Conviene cargarlos desde una fuente fiable (por ejemplo, una extracción de DD03L/DD04T y DD05S/DD08L de un sistema real), no escribirlos a mano.
- **Explicaciones.** 215 tablas tienen explicación (`purpose`) y sinónimos; las otras 788 no. Las búsquedas en lenguaje de negocio funcionan mejor en las que sí tienen.
- **Lista oficial de SAP.** De las 271 tablas clásicas de la lista de liberación de objetos (`objectReleaseInfo_PCELatest.json`), 249 están en el sitio. Las 22 restantes se descartaron por ser vistas, tablas de sistema o tener contenido dudoso (ver «Descartadas al integrar» en `pendientes.md`).
- **Volumen.** 1.003 tablas, justo por encima del objetivo de 1.000. No se rellenó con tablas dudosas; se pueden añadir más cuando se puedan verificar.

## Técnico

- **Tamaño del índice.** El índice pasa de 7,2 KB a 51,7 KB comprimido con gzip (312 KB sin comprimir). Si el catálogo crece mucho más (sobre 300 KB comprimido), habría que dividirlo por letra o por área.
- **Espacio que falta en `main`.** `src/views/common.ts:29` dice `tableHref =(` en `main`; en esta rama ya está corregido. Se arregla solo al integrar.

## Hecho en esta ronda (para referencia)

- Esquema ampliado: `component`, `s4only`, y `category`/`deliveryClass` opcionales; cinco áreas nuevas (Producción, Calidad, Mantenimiento, Proyectos, Controlling).
- De 56 a 1.003 tablas, con atribución de los datos de SAP en `NOTICE` y el README.
- Búsqueda: sinónimos exactos, erratas y desempate por tipo de contenido.
- Listado: los códigos largos solo se parten tras el espacio de nombres o un guion bajo, y los títulos de tablas solo S/4HANA ya no repiten «(S/4HANA)».
