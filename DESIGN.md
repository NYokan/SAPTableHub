---
name: SAPTableHub
description: Listado de tablas estándar de SAP ERP en español, inglés y portugués, con explicaciones en lenguaje llano.
colors:
  sage-paper: "#f4f6f3"
  surface: "#ffffff"
  surface-sunk: "#ebeee9"
  line: "#d8ddd6"
  line-soft: "#e1e6df"
  rule: "#e8ece6"
  row-hover: "#f3f6f2"
  ink: "#16201c"
  muted: "#58655f"
  control-edge: "#7f8a84"
  ledger-green: "#0c6b5a"
  ledger-green-ink: "#ffffff"
  ledger-green-soft: "#d8eee6"
  key-amber: "#8a4f00"
  key-amber-soft: "#faebd0"
  match-yellow: "#fbe38e"
  match-ink: "#121512"
typography:
  display:
    fontFamily: "Instrument Sans, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(30px, 4.2vw, 46px)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  reading:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    letterSpacing: "0.07em"
  code:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "17px"
    fontWeight: 600
  code-small:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 600
rounded:
  tag: "4px"
  inner: "6px"
  control: "8px"
  field: "10px"
  card: "12px"
  search: "14px"
  pill: "999px"
spacing:
  gutter: "16px"
  gap: "12px"
  section: "30px"
  container: "1180px"
  header: "60px"
components:
  button-primary:
    backgroundColor: "{colors.ledger-green}"
    textColor: "{colors.ledger-green-ink}"
    rounded: "{rounded.card}"
    padding: "0 18px"
    height: "48px"
  button-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "0 18px"
    height: "48px"
  button-quiet:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    rounded: "{rounded.field}"
    padding: "0 14px"
    height: "44px"
  segment-selected:
    backgroundColor: "{colors.ledger-green-soft}"
    textColor: "{colors.ledger-green}"
    rounded: "{rounded.inner}"
    padding: "0 12px"
    height: "28px"
  chip-selected:
    backgroundColor: "{colors.ledger-green-soft}"
    textColor: "{colors.ledger-green}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "32px"
  module-tag:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.code-small}"
    rounded: "{rounded.tag}"
    padding: "0 6px"
    height: "22px"
  search-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.search}"
    height: "56px"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
---

# Design System: SAPTableHub

## Overview

**Creative North Star: "El catálogo de referencia"**

SAPTableHub se ve como una buena obra de consulta: un índice tranquilo y ordenado donde todo se lee y nada sobra. El tono es sobrio y confiable, porque lo que vende el sitio es que los datos están verificados. La densidad es alta pero respirada: filas de tabla con aire, un solo acento de color y los códigos técnicos siempre en monoespaciado, para que el ojo distinga a primera vista el nombre de SAP (`VBAK`) de su explicación en lenguaje llano.

El color se usa como información, no como adorno. El verde contable marca lo accionable y lo seleccionado; cada área de negocio tiene su propio color suave, que solo aparece en su etiqueta. El resto es papel salvia, tinta y líneas finas. Claro y oscuro son el mismo sistema: cada color es un token que se redefine en modo oscuro.

No es un panel de métricas ni una página de marketing: no hay números gigantes, gráficos decorativos, portadas ni llamados a la acción. Tampoco debe parecer un sitio oficial de SAP (ver PRODUCT.md).

**Key Characteristics:**
- Un solo acento (verde contable) para acciones y estado seleccionado.
- Códigos de SAP en JetBrains Mono; texto en Instrument Sans.
- Profundidad casi plana: superficies con borde fino, sombras solo en lo que flota.
- Un color por área de negocio, siempre como etiqueta con punto.
- Las mismas piezas en claro y oscuro, con contrastes AA en ambos.

## Colors

Una base neutra con matiz salvia, un acento verde profundo y una familia de colores suaves por área de negocio.

### Primary
- **Verde contable** (`ledger-green`): botones principales, pestaña activa, foco, enlaces, segmento y chip seleccionados, «+» de una tabla ya añadida. En oscuro se aclara para mantener contraste. Su versión suave (`ledger-green-soft`) es el fondo del estado seleccionado.

### Secondary
- **Ámbar de clave** (`key-amber`, `key-amber-soft`): exclusivo de la etiqueta «Clave» de los campos de clave primaria.
- **Amarillo de coincidencia** (`match-yellow`, `match-ink`): resalta las letras que coinciden con lo escrito en el filtro o la búsqueda.

### Tertiary
- **Colores de área**: Ventas, Producción, Compras, Calidad, Mantenimiento, Finanzas, Proyectos, Controlling, Materiales y General tienen cada una un fondo, una tinta y un punto (`--a-*-bg`, `--a-*-ink`, `--a-*-dot`). General es gris pizarra, no verde, para que ninguna área se confunda con el acento.

### Neutral
- **Papel salvia** (`sage-paper`): fondo de página.
- **Superficie** (`surface`) y **superficie hundida** (`surface-sunk`): paneles y tablas; la hundida es el fondo de cabeceras de tabla, segmentos y bloques de texto copiable.
- **Tinta** (`ink`) y **tinta apagada** (`muted`): texto principal y secundario.
- **Líneas** (`line`, `line-soft`, `rule`): bordes de panel, bordes de controles secundarios y separadores de fila.
- **Borde de control** (`control-edge`): borde de los campos de búsqueda, con 3:1 sobre la superficie.

### Named Rules
**The One Accent Rule.** El verde contable es el único color de acción. Ningún otro color se usa para botones, enlaces o estado seleccionado.

**The Area Owns Its Color Rule.** El color de un área solo aparece en su etiqueta (fondo suave, tinta y punto). Nunca tiñe filas, títulos ni botones.

## Typography

**Display Font:** Instrument Sans (con system-ui)
**Body Font:** Instrument Sans (con system-ui)
**Label/Mono Font:** JetBrains Mono (con ui-monospace)

**Character:** una sans clara y moderna para leer, junto a una monoespaciada para todo lo que se teclea en SAP. Ambas se sirven desde el propio sitio.

### Hierarchy
- **Display** (600, clamp(30px, 4.2vw, 46px), 1.08, -0.025em): título de cada página («Listado de tablas», «Mi selección»). En la ficha de tabla, el nombre de la tabla en monoespaciado a escala similar.
- **Title** (500, 16px, 1.3): descripción de cada fila del listado.
- **Body** (400, 16px, 1.5): texto general.
- **Reading** (400, 17px, 1.5, máximo 54ch): párrafo «¿Para qué sirve?» de la ficha.
- **Label** (600, 13px, 0.07em, mayúsculas): títulos de sección de la ficha («CAMPOS PRINCIPALES»).
- **Code** (600, 17–19px, mono): nombres de tabla y de campo.
- **Code small** (600, 12px, mono): componente de SAP (`SD-SLS`), categoría y clase de entrega (`TRANSP · A`), tipos de campo.

### Named Rules
**The SAP Speaks Mono Rule.** Todo lo que se escribe tal cual en SAP (tablas, campos, componentes, categorías, tipos) va en JetBrains Mono. Lo que lo explica va en Instrument Sans.

## Layout

Una columna tranquila por página, en un contenedor de 1180px con 16px de margen lateral. El listado usa todo el ancho; las demás páginas (búsqueda, ficha, Mi selección) usan un ancho de lectura centrado.

- **Escritorio (desde 880px):** pestañas en la cabecera (60px, fija), índice A–Z como riel lateral que acompaña el scroll y listado como tabla de cinco columnas: número, tabla (112px), descripción, área y módulo, y contenido.
- **Columna «Área y módulo»:** el área y su código de SAP van siempre en una sola línea. Desde 1200px la columna mide 244px y muestra el componente completo (el más largo es «Mantenimiento PM-EQM-SF-MPC»); entre 880 y 1199px mide 156px y muestra solo el módulo («PM»). La columna «Contenido» mide al menos 256px desde 1200px, para que «Posiciones de documento CLUSTER · A» quepa en una línea; más angosta, los códigos pasan a su propia línea.
- **Móvil (hasta 879px):** barra inferior con Listado, Buscar y Mi selección; cada fila del listado es el nombre, la descripción debajo y una línea «Área · Contenido» sin colores ni códigos.
- **Ritmo:** 12px entre controles relacionados, 30px entre secciones de la ficha.

## Elevation & Depth

Sistema casi plano: la profundidad la dan las superficies con borde fino de 1px sobre el papel salvia y los fondos hundidos. Solo lo que flota sobre el contenido lleva sombra.

### Shadow Vocabulary
- **Popover** (`box-shadow: 0 18px 50px rgba(0, 0, 0, 0.18)`): el panel de «Filtros».
- **Ficha lateral** (`box-shadow: -24px 0 60px rgba(0, 0, 0, 0.24)`): la ficha que se abre a la derecha del listado, sobre un velo (`--veil`).

### Named Rules
**The Flat Unless Floating Rule.** Paneles, filas y tarjetas no tienen sombra. La sombra se reserva para lo que tapa el contenido: popovers y la ficha lateral.

## Shapes

Esquinas suaves y consistentes por tamaño: 4px en etiquetas de código, 6px en etiquetas de área y opciones internas, 8–10px en controles, 12px en paneles y botones grandes, 14px en el campo de búsqueda y píldora completa (999px) en chips y contadores. Los bordes son de 1px; el campo de búsqueda del listado usa 1,5px con el borde de control.

## Components

### Buttons
- **Shape:** esquinas suaves (12px), alto 48px.
- **Primary:** fondo verde contable con texto blanco. Uno por grupo de acciones («Copiar selección», «Guardar en mi selección», «Deshacer»).
- **Default:** superficie blanca con borde de línea («Copiar enlace», «Copiar nombre»).
- **Quiet:** 44px, 14px de texto en tinta apagada, que pasa a tinta y borde de control al pasar el ratón («Quitar», «Quitar todas»).
- **Focus:** contorno de 2px en verde contable con 2px de separación, en todos los controles.

### Chips
- **Style:** píldora de 32px con borde de línea, para filtrar por área en la búsqueda.
- **State:** seleccionado en verde suave con texto verde en negrita.

### Segmented control
- Grupo hundido de 8px de radio con opciones de 28px; la seleccionada lleva fondo verde suave y texto verde («Solo nombres / Con descripción y módulo», «Todas / Con explicación»).

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** superficie, sobre el papel salvia.
- **Shadow Strategy:** ninguna (ver Elevation & Depth).
- **Border:** 1px de línea.
- **Internal Padding:** 16px en filas, 28px × 20px en estados vacíos.

### Inputs / Fields
- **Style:** campo de búsqueda de 56px, radio 14px, superficie blanca, lupa a la izquierda y atajo `/` a la derecha. El texto guía va en tinta apagada.
- **Focus:** contorno de 2px en verde contable.

### Navigation
- **Escritorio:** pestañas de texto en tinta apagada; la activa pasa a tinta con un subrayado de 2px.
- **Móvil:** barra inferior fija con ícono y texto; la activa en verde contable, con el contador de Mi selección como píldora.

### Area tag (signature)
Etiqueta de 24px con el fondo suave del área, su tinta, un punto de 7px del color del área y el nombre en 600. Va siempre seguida del código de SAP como etiqueta de código silenciosa (borde de línea, mono 12px, tinta apagada).

### Table row (signature)
Fila del listado como enlace completo: clic abre la ficha lateral, Ctrl+clic abre la página. Al pasar el ratón el fondo cambia a `row-hover`. Termina con el «+» para añadir a la selección, que se vuelve ✓ verde cuando la tabla ya está añadida.

## Do's and Don'ts

### Do:
- **Do** escribir todo código de SAP en JetBrains Mono y su explicación en Instrument Sans.
- **Do** usar el verde contable solo para acciones, foco y estado seleccionado.
- **Do** mostrar el área con su etiqueta de color y el código al lado, en una sola línea.
- **Do** mostrar «—» cuando un dato técnico no se conoce con seguridad.
- **Do** definir cada color nuevo como token en `:root` y redefinirlo para modo oscuro.

### Don't:
- **Don't** usar números gigantes, tarjetas de métricas ni gráficos decorativos: no es un panel de métricas.
- **Don't** usar portadas, ilustraciones ni llamados a la acción de marketing.
- **Don't** usar el color de un área fuera de su etiqueta.
- **Don't** poner sombra en paneles o filas; solo en lo que flota.
- **Don't** imitar la marca de SAP (su logo, su azul corporativo como acento ni el estilo Fiori): el sitio es independiente.
