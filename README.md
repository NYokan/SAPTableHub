# SAPTableHub

Encuentra cualquier tabla estándar de SAP ERP en segundos. SAPTableHub es un listado de tablas SAP pensado para quien sabe de SAP y para quien no: muestra el nombre técnico de cada tabla, su descripción, área, categoría y clase de entrega, sus campos principales y sus tablas relacionadas. Está en **español, inglés y portugués**.

> **Estado: beta.** El contenido actual es de ejemplo y está escrito a mano: no se extrajo de un sistema SAP y falta verificarlo. Los tipos y longitudes de campo pueden variar según la versión de SAP.

## Qué tiene

- **Listado** (página de inicio): todas las tablas en orden alfabético, con índice A–Z, filtro instantáneo, áreas, categoría, paginación y botón para copiar el listado y pegarlo en Excel.
- **Buscar**: búsqueda en lenguaje de negocio (“factura”, “proveedor”, “stock”) en los tres idiomas, con tolerancia a errores de escritura. También encuentra tablas por nombre de campo (`MATNR` lleva a `MARA`).
- **Ficha de cada tabla**: para qué sirve, campos principales, datos técnicos y tablas relacionadas. Vista **Simple** (lenguaje llano) o **Técnica** (tipos, claves, cómo se une con otras tablas).
- **Mi selección**: marca tablas con `+`, cópialas como texto para tu solicitud o comparte un enlace con la selección.
- Direcciones propias para cada página, para enlazarlas desde una guía: `/es/table/VBAK`, `/es/?letter=V`, `/es/selection?t=VBAK,VBAP`.
- Diseño para PC y para móvil (iOS y Android), modo claro y oscuro.

## Requisitos

- [Node.js](https://nodejs.org/) **22.12 o superior** (se recomienda la versión LTS más reciente).
- npm, que viene con Node.js.

## Empezar

```bash
npm install
npm run dev
```

Abre la dirección que aparece en la terminal (normalmente http://localhost:5173).

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Sitio en modo desarrollo, se recarga al guardar. |
| `npm run build` | Valida el contenido, revisa los tipos y genera el sitio final en `dist/`. |
| `npm run preview` | Sirve `dist/` para probar el sitio final. |
| `npm test` | Ejecuta las pruebas (búsqueda, listado, direcciones y validación del contenido). |
| `npm run check` | `build` y `test` juntos: lo que conviene ejecutar antes de cada commit. |
| `npm run data` | Solo valida el contenido y regenera `src/generated/`. |

## Estructura

```
content/              ← lo que se edita a mano
  tables/VBAK.json    una tabla por archivo
  fields.json         diccionario de campos (tipo y significado en es/en/pt)
  taxonomy.json       áreas, contenidos, categorías, clases de entrega y tipos de relación
  glossary.json       glosario rápido
scripts/              validación del contenido y generación de datos
src/
  i18n/               textos de la interfaz en es, en y pt
  lib/                búsqueda, listado, direcciones y carga de datos
  views/              páginas: listado, búsqueda, ficha de tabla y selección
  styles/app.css      estilos
  generated/          datos generados (no se edita ni se sube a git)
tests/                pruebas
public/               archivos que se publican tal cual (favicon, cabeceras de Cloudflare)
```

## Añadir o editar una tabla

Crea `content/tables/NOMBRE.json`. Solo `id`, `area`, `contents`, `category`, `deliveryClass` y `title` son obligatorios:

```json
{
  "id": "VBAK",
  "area": "sales",
  "contents": "header",
  "category": "TRANSP",
  "deliveryClass": "A",
  "title": { "es": "Pedidos de venta (cabecera)", "en": "Sales orders (header)", "pt": "Pedidos de venda (cabeçalho)" },
  "purpose": { "es": "…", "en": "…", "pt": "…" },
  "synonyms": { "es": ["pedido de venta"], "en": ["sales order"], "pt": ["pedido de venda"] },
  "fields": [{ "name": "MANDT", "key": true }, { "name": "VBELN", "key": true }, { "name": "ERDAT" }],
  "relations": [{ "table": "VBAP", "type": "items", "on": "VBELN" }]
}
```

- `area`, `contents`, `category`, `deliveryClass` y `relations[].type` usan los códigos de `taxonomy.json`.
- Cada campo de `fields` debe existir en `fields.json`.
- `synonyms` son las palabras de negocio con las que la gente buscaría la tabla. Mejoran mucho la búsqueda.
- Las tablas con espacio de nombres (`/ABC/TABLA`) se guardan como `_ABC_TABLA.json`.

Al ejecutar `npm run dev`, `build` o `test`, el contenido se valida. Si falta una traducción, un campo no existe o una relación apunta a una tabla que no está, el comando se detiene y dice qué archivo corregir.

## Textos de la interfaz

Están en `src/i18n/es.json`, `en.json` y `pt.json`. Las pruebas comprueban que los tres archivos tengan las mismas claves.

## Publicar en Cloudflare Pages (gratis)

**Con GitHub** (se publica solo en cada push):

1. En Cloudflare: *Workers & Pages* → *Create* → *Pages* → *Connect to Git* y elige este repositorio.
2. *Build command*: `npm run build`
3. *Build output directory*: `dist`
4. La versión de Node se toma de `.nvmrc` (22).

**Sin GitHub** (subida directa desde tu equipo):

```bash
npm run build
npx wrangler pages deploy dist --project-name saptablehub
```

El sitio no tiene `404.html`, así que Cloudflare Pages lo trata como una aplicación de una sola página: cualquier dirección (`/es/table/VBAK`) abre `index.html` y el sitio muestra la página correcta. `public/_headers` deja en caché los archivos con hash y añade cabeceras de seguridad básicas.

## Decisiones técnicas

- **Sitio 100 % estático, sin servidor ni base de datos**: es lo más rápido, lo más estable y no tiene cuotas que puedan cortar el servicio en el plan gratuito.
- **Sin framework**: TypeScript y Vite, sin dependencias en tiempo de ejecución salvo las fuentes. Menos piezas que actualizar.
- **Datos por grupos**: el listado carga un índice pequeño; el detalle de cada tabla se agrupa por las dos primeras letras de su nombre y se carga al abrirla. Así el sitio puede crecer a miles de tablas sin superar el límite de 20.000 archivos del plan gratuito de Cloudflare Pages.
- **Pruebas con el ejecutor de Node** (`node --test`), sin librerías de pruebas.

## Licencia

Código bajo [Apache 2.0](LICENSE).

Proyecto independiente, sin relación con SAP SE. SAP es una marca registrada de SAP SE.
