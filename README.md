# SAPTableHub

Encuentra cualquier tabla estándar de SAP ERP en segundos. SAPTableHub es un listado de tablas SAP pensado para quien sabe de SAP y para quien no: muestra el nombre técnico de cada tabla, su descripción, área, categoría y clase de entrega, sus campos principales y sus tablas relacionadas. Está en **español, inglés y portugués**.

> Las explicaciones están escritas para este proyecto y no se extrajeron de un sistema SAP: los nombres, claves y tipos de campo se contrastaron con referencias públicas. Las tablas que aún no tienen explicación muestran la descripción corta de SAP, en inglés, tomada del índice público de SAP Datasheet (ver «Atribución de los datos»). Los tipos y longitudes pueden variar según la versión de SAP.

## Qué tiene

- **Listado** (página de inicio): unas 10.800 tablas en orden alfabético, con índice A–Z, filtro instantáneo, áreas, categoría, paginación y botón para copiar el listado y pegarlo en Excel. 1.018 tienen explicación en los tres idiomas; el resto, unas 9.800 tablas importantes del diccionario de SAP, muestran su descripción corta de SAP, todos sus campos y sus tablas de verificación. El filtro «Mostrar: Con explicación» deja solo las explicadas.
- **Buscar**: búsqueda en lenguaje de negocio (“factura”, “proveedor”, “stock”) en los tres idiomas, con tolerancia a errores de escritura. También encuentra tablas por nombre de campo (`MATNR` lleva a `MARA`).
- **Ficha de cada tabla**: para qué sirve, campos principales, datos técnicos y tablas relacionadas. Muestra el área y el componente de SAP, los campos con su tipo y clave, la categoría, la clase de entrega y cómo se une con otras tablas.
- **Mi selección**: marca tablas con `+`, cópialas como texto para tu solicitud (solo los nombres, o con su descripción y módulo: `A004 – Registros de condición: precio por material – SD-MD-CM`) o comparte un enlace con la selección.
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
  tables/VBAK.json    una tabla explicada por archivo
  sap-tables.tsv      tablas del diccionario de SAP aún sin explicación (ver docs/tablas-sap.md)
  sap-fields.tsv      sus campos, tal como los tiene el diccionario de SAP
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

Crea `content/tables/NOMBRE.json`. Solo `id`, `area`, `contents` y `title` son obligatorios. `category` y `deliveryClass` se rellenan solo cuando se conocen con seguridad (si faltan, el sitio muestra «—» y la tabla se anota en `docs/pendientes.md`); `component` guarda el componente de aplicación de SAP (por ejemplo `SD-SLS`), con `componentInferred: true` cuando no viene de la lista oficial de SAP sino que lo asignó el proyecto, y `s4only: true` marca las tablas que solo existen en S/4HANA:

```json
{
  "id": "VBAK",
  "area": "sales",
  "contents": "header",
  "component": "SD-SLS",
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
- Cada campo de `fields` debe existir en `fields.json`. Si en esa tabla tiene otra longitud que la del diccionario (por ejemplo, textos `VTEXT` de 40 caracteres), se indica con `"type": "CHAR 40"` en el propio campo.
- `synonyms` son las palabras de negocio con las que la gente buscaría la tabla. Mejoran mucho la búsqueda.
- Las tablas con espacio de nombres (`/ABC/TABLA`) se guardan como `_ABC_TABLA.json`.

Si la tabla ya está en `content/sap-tables.tsv`, no hace falta quitarla de ahí: el sitio usa el archivo nuevo y de la lista solo toma la descripción corta de SAP. Cómo se eligió esa lista y cómo cambiarla: [docs/tablas-sap.md](docs/tablas-sap.md).

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
- **Datos por grupos**: el listado carga un índice pequeño y, a la vez, la lista de tablas de SAP en un archivo aparte (unos 140 KB comprimidos) que el navegador guarda en caché por separado. El detalle de cada tabla explicada se agrupa por las dos primeras letras de su nombre y se carga al abrirla. Así el sitio puede crecer a miles de tablas sin superar el límite de 20.000 archivos del plan gratuito de Cloudflare Pages.
- **Pruebas con el ejecutor de Node** (`node --test`), sin librerías de pruebas.

## Licencia

Código bajo [Apache 2.0](LICENSE).

### Atribución de los datos

Los nombres de tabla y los componentes de aplicación de SAP proceden de [SAP/abap-atc-cr-cv-s4hc](https://github.com/SAP/abap-atc-cr-cv-s4hc) (archivo `src/objectReleaseInfo_PCELatest.json`), © SAP SE o una empresa filial de SAP y los colaboradores de abap-atc-cr-cv-s4hc, publicados bajo [Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0). Ver [NOTICE](NOTICE).

De ese archivo solo se toman los nombres y los componentes de aplicación. Los títulos, explicaciones y sinónimos de `content/tables/` están escritos para este proyecto y no reproducen las descripciones oficiales de SAP.

Los nombres, descripciones cortas, categorías y clases de entrega de `content/sap-tables.tsv` se leyeron una sola vez, el 26 de octubre de 2026, del [índice público de tablas de SAP Datasheet](https://www.sapdatasheet.org/abap/tabl/index-a.html), que refleja el diccionario de SAP ERP; su `robots.txt` permite esas páginas. Sus campos (`content/sap-fields.tsv`) se leyeron también una vez de la página de cada tabla en SAP Datasheet. Las descripciones cortas son textos de SAP y se muestran en inglés, tal como SAP las escribió; cada tabla enlaza a su página en SAP Datasheet. Qué tablas se incluyeron y por qué: [docs/tablas-sap.md](docs/tablas-sap.md). Las tablas que no figuran en esa lista se añadieron a mano; las que solo existen en S/4HANA llevan la marca «Solo S/4HANA». El componente de aplicación de esas tablas lo asignó el proyecto por conocimiento de SAP y está marcado como tal en la ficha (`componentInferred`).

Los campos principales (nombre, clave y tipo) se contrastaron con la referencia pública del diccionario de ECC 6.0 de [leanx.eu](https://leanx.eu/), consultada una vez y despacio, con permiso de su `robots.txt`. De ella solo se usan esos datos técnicos; las etiquetas de los campos están escritas para este proyecto. Esa consulta no se repite de forma automática, y los campos siguen pendientes de verificar contra un sistema SAP real. Las tablas que solo existen en S/4HANA no figuran en esa referencia y sus campos no se han podido contrastar.

Proyecto independiente, sin relación con SAP SE. SAP es una marca registrada de SAP SE.
