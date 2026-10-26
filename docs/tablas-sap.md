# Tablas del diccionario de SAP

`content/sap-tables.tsv` amplía el listado con tablas estándar de SAP ERP que todavía no tienen explicación propia. Cada línea es una tabla, con cuatro columnas separadas por tabuladores:

```
id	category	deliveryClass	description
J_1BNFDOC	TRANSP	A	Nota Fiscal Header
```

- `category` y `deliveryClass` usan los códigos de `taxonomy.json`.
- `description` es la descripción corta de SAP, en inglés.
- Las tablas que tienen su propio archivo en `content/tables/` también están en la lista, pero el sitio usa su archivo; de su línea solo toma la descripción corta, que aparece en la ficha como «Descripción oficial de SAP».

## De dónde sale

Del índice público de tablas de [SAP Datasheet](https://www.sapdatasheet.org/abap/tabl/index-a.html), que refleja el diccionario de un sistema SAP ERP (ECC 6.0). Se leyó **una sola vez, el 26 de octubre de 2026**: 265 páginas de índice, con una pausa de dos segundos entre página y página. Su `robots.txt` lo permite y sus condiciones de uso no lo prohíben. No se descargaron las fichas de cada tabla, y la lectura no se repite de forma automática.

Ese índice tiene 113.091 tablas. De las 1.018 explicadas en este proyecto, 995 están en él; las 23 que faltan solo existen en S/4HANA (`ACDOCA`, `MATDOC`…), lo que confirma que el índice es de ECC.

## Qué tablas se incluyeron

La idea es que el listado tenga las tablas que alguien pediría para cargar datos, no el diccionario entero. Se quedaron 9.764 tablas nuevas (10.782 en total con las explicadas):

1. **Datos de aplicación (clase de entrega A) con nombre de hasta 6 caracteres**: los datos maestros y los documentos. Las tablas clásicas del núcleo de SAP tienen nombres cortos: el 92 % de las 1.018 explicadas tiene 5 caracteres o menos.
2. **Configuración (clase C) con nombre de hasta 5 caracteres**: la configuración básica, como `T001W` o `TVAKT`.
3. **Las tablas de datos de Brasil** (`J_1B…` de clase A: nota fiscal, NF-e) y `FMIFIIT`, aunque tengan nombres más largos.

Se dejaron fuera:

- Las clases de entrega L (temporales), E y G (control y configuración protegida), S y W (sistema).
- Las tablas con espacio de nombres (`/ABC/…`): complementos y productos aparte.
- Las que SAP describe como obsoletas, de prueba, de copia de seguridad o temporales («obsolete», «do not use», «to be deleted», «test table»…).
- Familias de otros sectores o muy específicas: configuración de recursos humanos por país (`T5…`, `T7…`), servicios públicos (`TE…`), petróleo (`OI…`), hospitales (`N1…`, `N2…`, `TN…`) y las ~1.000 tablas de condiciones numeradas (`A001`…`A999`, salvo las explicadas).

Con estas reglas se conservarían 852 de las 995 tablas explicadas que están en el índice. Las demás (por ejemplo `FAGLFLEXA`, `STXH` o `T156`) siguen en el sitio porque tienen su propio archivo.

## Cómo cambiarla

Es un archivo de texto: se puede añadir, quitar o corregir una línea a mano. Al ejecutar `npm run dev`, `build` o `test`, el contenido se valida y el comando dice qué línea corregir si una categoría o clase de entrega no existe, si falta la descripción o si una tabla está repetida.

Para explicar una tabla de la lista, basta con crear su archivo en `content/tables/`: su ficha pasa a mostrar la explicación, el área y el módulo.
