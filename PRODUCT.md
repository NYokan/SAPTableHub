# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Según el README, el sitio está «pensado para quien sabe de SAP y para quien no»: gente que necesita encontrar una tabla estándar de SAP ERP, entender para qué sirve y pedirla con su nombre técnico correcto. La selección se copia «para pegarla en tu solicitud», así que el trabajo típico termina en una solicitud escrita (de datos, accesos o una extracción) a otra persona o equipo.

Por confirmar: qué perfiles pesan más (usuarios de negocio, consultores SAP, analistas de datos o el equipo de TI que recibe las solicitudes). La pregunta se hizo en el init del 2 de noviembre de 2026 y quedó sin respuesta.

## Product Purpose

Encontrar cualquier tabla estándar de SAP ERP en segundos, en español, inglés o portugués, y llevarse su nombre listo para pegar. Éxito: llegar desde una palabra de negocio («factura», «proveedor») o un nombre técnico a la tabla correcta y copiarla sin conocer SAP por dentro.

## Positioning

Explicaciones en lenguaje llano escritas para este proyecto, en tres idiomas, sobre un catálogo amplio (unas 10.800 tablas; 1.018 explicadas y el resto con la descripción corta de SAP en inglés). Búsqueda por lenguaje de negocio y por nombre de campo, y una selección que se copia o se comparte como enlace.

## Operating Context

- Sitio público en internet, pensado en origen para el uso de la empresa del autor.
- Se usa en PC y en el móvil, en modo claro y oscuro.
- Las direcciones de cada página son estables para enlazarlas desde guías internas (`/es/table/VBAK`, `/es/selection?t=VBAK,VBAP`).
- La salida habitual es texto pegado en una solicitud o en Excel («Copiar listado» y «Copiar selección»).

## Capabilities and Constraints

- Listado A–Z con filtros por texto, área, categoría y «Con explicación»; búsqueda; ficha de cada tabla; Mi selección con copia y enlace compartido.
- Idiomas: es, en y pt. Todo texto nuevo de la interfaz va en los tres.
- Sitio estático (Vite + TypeScript, sin framework), publicado con cabeceras de Cloudflare.
- Términos del dominio que se mantienen tal cual: tabla, área, módulo, componente de aplicación, categoría (TRANSP, POOL, CLUSTER…), clase de entrega, clave, S/4HANA, ECC 6.0.

## Brand Commitments

- Proyecto independiente, sin relación con SAP SE; el pie de página lo dice y el sitio no debe parecer oficial de SAP.

## Evidence on Hand

- Contenido propio en `content/tables/*.json` (1.018 tablas explicadas) y datos del diccionario de SAP tomados de SAP Datasheet (`content/sap-tables.tsv`, `content/sap-fields.tsv`), con su atribución.
- Campos, claves y tipos contrastados con una referencia pública del diccionario de ECC 6.0 (leanx.eu).
- No hay testimonios, clientes, métricas de uso ni casos publicados; no se deben inventar.

## Product Principles

1. **No inventar datos técnicos.** Solo se muestran campos, claves, tipos, categorías y componentes verificados; lo que no se sabe con seguridad se muestra como «—» y se anota como pendiente.
2. **Decir de dónde viene cada dato.** Distinguir siempre lo explicado por el proyecto, lo tomado del diccionario de SAP y lo asignado por el proyecto (por ejemplo, un componente inferido).
3. **Del lenguaje de negocio al nombre técnico.** Cualquier persona debe poder llegar a la tabla correcta sin saber SAP, y quien sí sabe, llegar más rápido.
4. **Paridad entre idiomas.** Ninguna función ni texto existe solo en un idioma.
