# Pendientes de verificar

Este archivo se genera al ampliar el contenido. Recoge lo que **no** se rellenó por no tener total seguridad, para revisarlo contra un sistema SAP real.

## Tablas sin categoría (6)

En el sitio se muestran con «—» en la categoría. Las demás se completaron o corrigieron con el diccionario de SAP ERP (ver «Corregidas con el diccionario de SAP» más abajo); estas no figuran en él porque solo existen en S/4HANA o en productos aparte. Según ese diccionario son cluster AUAA, AUAB, AUAO, AUAS, AUAV, BSEC, BSED, BSEG, BSET, CDPOS, KONV, MHND, REGUP, y 60 son pool.

- **Ventas** (2): `/SCMTMS/D_TORITE`, `/SCMTMS/D_TORROT`
- **Materiales** (2): `ACDOCA_M_EXTRACT`, `MATDOC_EXTRACT`
- **Producción** (1): `PPH_DBVM`
- **Controlling** (1): `MLDOC_EXTRACT`

## Tablas sin clase de entrega (13)

En el sitio se muestran con «—» en la clase de entrega. Tampoco figuran en el diccionario de SAP ERP.

- **Ventas** (2): `/SCMTMS/D_TORITE`, `/SCMTMS/D_TORROT`
- **Materiales** (6): `/SCWM/AQUA`, `/SCWM/LAGP`, `/SCWM/ORDIM_C`, `/SCWM/ORDIM_O`, `ACDOCA_M_EXTRACT`, `MATDOC_EXTRACT`
- **Producción** (1): `PPH_DBVM`
- **Finanzas** (3): `FINSC_LD_CMP`, `FINSC_LEDGER`, `FINSC_LEDGER_T`
- **Controlling** (1): `MLDOC_EXTRACT`

## Corregidas con el diccionario de SAP (209 cambios en 194 tablas)

El 26 de octubre de 2026 se comparó la categoría y la clase de entrega de cada tabla con el índice público de SAP Datasheet, que refleja el diccionario de SAP ERP (ver [tablas-sap.md](tablas-sap.md)), y se tomó el valor de SAP. 71 datos estaban vacíos y 138 eran distintos. Las dudas de la sección siguiente sobre la categoría o la clase de entrega de estas tablas quedan resueltas.

- Categoría TRANSP → POOL (55): `T001Z`, `T003T`, `T004F`, `T004T`, `T007S`, `T008`, `T008T`, `T009`, `T009B`, `T009T`, `T010O`, `T016`, `T016T`, `T028B`, `T030`, `T030H`, `T030K`, `T040`, `T040A`, `T040S`, `T042`, `T042A`, `T042D`, `T042I`, `T043`, `T043G`, `T043T`, `T047`, `T047B`, `T047C`, `T047D`, `T047E`, `T047T`, `T048`, `T048T`, `T074`, `T074T`, `T077S`, `T077X`, `T077Y`, `T077Z`, `T157D`, `T157E`, `T166T`, `T691A`, `T691T`, `TBSL`, `TBSLT`, `TCA01`, `TKA3A`, `TSTL`, `TTXD`, `TTXJT`, `TVOID`, `TVOIT`
- Clase de entrega C → G (54): `T077D`, `T077K`, `T077X`, `T077Y`, `T134`, `T134T`, `T137`, `T137T`, `T149D`, `T156`, `T156T`, `T161`, `T161T`, `T163`, `T163D`, `T163I`, `T163K`, `T163Y`, `T166T`, `T333`, `T333T`, `T418`, `T418T`, `T438A`, `T438T`, `T439A`, `T439T`, `T459K`, `T691A`, `T691T`, `TCK19A`, `TCLA`, `TCLAT`, `TMABC`, `TNAPR`, `TPAR`, `TPART`, `TPTM`, `TPTMT`, `TQ30`, `TQ30T`, `TVAK`, `TVAKT`, `TVAP`, `TVAPT`, `TVEP`, `TVEPT`, `TVFK`, `TVFKT`, `TVLK`, `TVLKT`, `TVLP`, `TVTK`, `TVTKT`
- Clase de entrega — → C (28): `MARV`, `QPAC`, `QPAM`, `QPCD`, `QPCT`, `QPGR`, `QPGT`, `SETHEADER`, `SETHEADERT`, `SETLEAF`, `SETNODE`, `T006`, `T006A`, `T006B`, `T006C`, `T006D`, `T006T`, `T074T`, `T074U`, `T090NA`, `T090NAT`, `T811C`, `T811S`, `TBSL`, `TBSLT`, `TC21`, `TCJ_C_JOURNALS`, `UKMCRED_SGM0T`
- Clase de entrega — → A (17): `CBPR`, `CBPT`, `CVI_VEND_LINK`, `DOST`, `MDTB`, `PVBE`, `PVKT`, `QAKL`, `QCVK`, `QCVM`, `QDDR`, `QDPS`, `QDSV`, `T352R`, `TKA03`, `TKT03`, `VEVW`
- Clase de entrega C → E (9): `T048`, `T048T`, `T459A`, `T881`, `T881T`, `TQ15`, `TQ15T`, `TVOID`, `TVOIT`
- Clase de entrega A → C (7): `CSKA`, `CSKB`, `CSKU`, `SKA1`, `SKAS`, `SKAT`, `SKB1`
- Clase de entrega — → W (7): `DD04T`, `DD07L`, `DD07T`, `TADIR`, `TDEVC`, `TJ01`, `TJ01T`
- Categoría TRANSP → CLUSTER (6): `AUAA`, `AUAB`, `AUAO`, `AUAS`, `AUAV`, `MHND`
- Clase de entrega — → S (6): `T002`, `T002T`, `TABWG`, `TCA01`, `TJ02`, `TJ02T`
- Clase de entrega — → G (5): `T006I`, `T006J`, `TABW`, `TABWT`, `TVPT`
- Categoría — → TRANSP (4): `A304`, `A305`, `CVI_VEND_LINK`, `MDTB`
- Clase de entrega C → A (3): `T351`, `T351P`, `T351X`
- Categoría — → POOL (3): `A016`, `A017`, `A018`
- Clase de entrega A → W (2): `STXH`, `STXL`
- Clase de entrega C → S (2): `T148`, `T148T`
- Clase de entrega — → E (1): `TTYPT`

## Dudas anotadas al preparar el contenido (82)

- (Controlling) SETHEADER/SETHEADERT/SETNODE/SETLEAF (jerarquías de grupos de CO) no incluidas: figuran en official-fin.json, se dejan a Finanzas para evitar duplicados.
- (Controlling) T003O/T003P (clases de orden) son compartidas con Producción/Mantenimiento; incluidas aquí por las órdenes internas. Revisar si otra área también las preparó.
- (Controlling) Material ledger (CKMLHD, CKMLPP, CKMLCR, CKMLKEPH, MLHD, MLIT, MLPP, MLCR, MLDOC) incluido en CO; revisar solapes con Materiales/Finanzas.
- (Controlling) ACDOCP (datos de plan S/4HANA) incluida en CO por ser planificación; podría encajar en Finanzas.
- (Controlling) Presupuesto (BPGE, BPJA, BPBK, BPEG, BPEJ) es compartido con Proyectos (PS); incluido aquí por el presupuesto de órdenes internas.
- (Controlling) Componente de aplicación omitido en todas las tablas propias por prudencia.
- (Finanzas) TVPT excluida por no conocer con certeza su contenido.
- (Finanzas) Clase de entrega omitida en TBSL/TBSLT, T074U/T074T, T090NA/T090NAT, TABW/TABWT/TABWG, SET*, FINSC_*, TCJ_C_JOURNALS y UKMCRED_SGM0T por no estar seguro (pueden ser C o G/E).
- (Finanzas) Componente solo puesto en tablas de la lista oficial; en las propias se omitió.
- (Finanzas) UKM*, UDMCASEATTR00 (FSCM) y DFKK*/FKKVK* (FI-CA) existen en ECC 6.0 con esos componentes activos; no marcadas s4only.
- (Finanzas) S066/S067 son estructuras de información de gestión de créditos (SIS); podrían considerarse de Ventas.
- (Finanzas) SETHEADER/SETLEAF/SETNODE son grupos genéricos que también usa Controlling (grupos de centros de coste).
- (Finanzas) Quitadas porque ya aparecieron en content/ mientras trabajaba (otra área las creó): ACDOCP, LFB5, LFBK, LFBW, T077K, T077Y.
- (General) T006B y T006C: títulos basados en que guardan el formato comercial y técnico de las unidades por idioma; confirmar.
- (General) Clase de entrega omitida en T002, T002T, T006*, TJ02 y TJ02T (posiblemente S o C; no estoy seguro).
- (General) CVI_CUST_LINK, CVI_VEND_LINK, BUT0ID y DFKKBPTAXNUM existen en ECC 6.0 (no se marcan s4only).
- (General) STXL guarda el texto comprimido; se marca TRANSP, como en ECC.
- (General) Ninguna de la lista oficial es solo S/4HANA.
- (General) CVI_VEND_LINK ya existe en content/: no se recrea.
- (Materiales) CKMLHD, CKMLPP, CKMLCR, MLHD, MLIT, MLPP, MLCR y MLDOC ya existen en content/ (las añadió otra área); no se recrean.
- (Materiales) VEKP y VEPO (lista oficial de mat, LO-HU) también están en staging/sales: duplicado a resolver al integrar. TVTY/TVTYT las dejé a Ventas.
- (Materiales) Las 4 tablas /SCWM/ (EWM) se guardan como _SCWM_*.json y se validan igual que las demás. Marcadas s4only: no existen en ECC 6.0 (sí en sistemas SCM EWM independientes).
- (Materiales) RKPF (cabecera de reservas) incluida como reserva MM aunque RESB va a Producción.
- (Materiales) MARV sin clase de entrega; MATDOC_EXTRACT sin categoría ni clase; VEVW y tablas /SCWM/ sin clase.
- (Mantenimiento) No hay lista oficial para PM; todos los componentes se omiten por no estar seguro del componente exacto.
- (Mantenimiento) IFLO e ITOB son vistas de base de datos, no tablas: sin categoría ni clase de entrega. Retirar si el sitio solo admite tablas.
- (Mantenimiento) OBJK (lista de objetos) la comparten PM, SD y gestión de números de serie; se asigna a pm.
- (Mantenimiento) PMCO existe en ECC (costes estimados de órdenes PM); confirmar si se prefiere en co.
- (Mantenimiento) Se dejaron fuera por no estar seguro: T350, T399I, T352R, IHSG/IHGNS, INET, BGMZ, SER01-SER08, TQ80 (avisos, compartida con QM).
- (Mantenimiento) No se alcanzó el objetivo de ~80: mejor quedarse corto que inventar.
- (Producción) Lista oficial PP solo trae 16 tablas; se completó con 69 propias. Total 85, por debajo de 110: no se añadieron tablas sin total seguridad (p. ej. TCA02, TC26, TC30, TCO43, PLFT, STPN, T459B).
- (Producción) T003O/T003P (clases de orden) y AENR (números de cambio) no se incluyeron: son transversales (CO / logística general).
- (Producción) RESB y AFFW se pusieron en PP por el alcance asignado, aunque las usa también inventario (MM-IM).
- (Producción) MDTB sin categoría/clase por no tener certeza; PPH_DBVM marcada s4only (fichero de planificación de MRP Live).
- (Producción) Componente de aplicación solo en las tablas oficiales; en las propias se omitió.
- (Proyectos) No hay lista oficial para PS; componentes omitidos.
- (Proyectos) Las redes usan AUFK/AFKO/AFVC (de otras áreas); solo AFAB (relaciones) se incluye como propia de PS.
- (Proyectos) BPGE, BPJA, BPBK, BPEG y BPEJ ya existen en content/ (otra área): no se recrean; por eso solo 8 tablas con explicación.
- (Proyectos) TCJ1 = tipos de proyecto (campo PRART) y TCJ41 = perfiles de proyecto: bastante seguro, conviene confirmar.
- (Proyectos) Muy por debajo del objetivo de ~50: no conozco con total seguridad más tablas propias de PS (p. ej. textos de hitos, PSTX).
- (Compras) KONH, KONP y A016/A017/A018 (condiciones) son compartidas con Ventas; si Ventas también las prepara, quedarse con una sola versión. Sin componente por ser transversales.
- (Compras) CVI_VEND_LINK sin categoría/clase ni componente (vínculo proveedor-interlocutor comercial, existe en ECC 6.0 con CVI).
- (Compras) EKRS, ELBK, ELBM, ELBP sin componente por no estar seguro del subcomponente exacto.
- (Compras) No incluyo tablas Solo S/4HANA de compras: no conozco ninguna con total certeza.
- (Compras) Me quedo en ~70 tablas (por debajo de 110) para no incluir nombres dudosos (p. ej. T163D, T163L, WYT1, LFEI, RBVS, EKRSDC).
- (Compras) LFC1/LFC3 (cifras de proveedores) se dejan a Finanzas.
- (Calidad) Lista oficial QM solo trae 3 tablas; se completó con 40 propias. Total 43, por debajo de 60 por falta de certeza en otras (TQ31/TQ32, QDPA, QAKL, QCVV).
- (Calidad) QMEL/QMFE/QMUR/QMSM/QMMA se ponen en QM según instrucción, aunque las use mantenimiento. QMIH no se prepara.
- (Calidad) PLMK/PLMW (características del plan de inspección) se asignaron a QM; PLKO/MAPL quedan en PP.
- (Calidad) Clase de entrega omitida en catálogos (QPGR, QPCD, QPCT...), muestreo (QDSV, QDDR, QDPS) y certificados (QCVK, QCVM) por falta de certeza.
- (Calidad) QMMA (acciones) no lleva explicación; con explicación quedaron las 12 más usadas.
- (Ventas) /SCMTMS/D_TORROT y /SCMTMS/D_TORITE (órdenes de flete de TM integrado) marcadas s4only: no existen en ECC 6.0, aunque sí en SAP TM independiente; sin categoría/clase ni componente.
- (Ventas) UKMBP_CMS y UKMBP_CMS_SGM no se incluyen porque el lote de finanzas ya las prepara; UKM_ITEM (compromisos de crédito FSCM, existe en ECC con FSCM) sí se incluye en ventas: si finanzas la quiere, moverla allí.
- (Ventas) KNB5, KNBK, T077X (oficiales de ventas) y KNKA, KNKK, S066, S067, T077D, T691A, T691T (propias) se omitieron porque el lote de finanzas ya las prepara; si finanzas las retira, habría que recuperarlas aquí (KNKK es clave para créditos en ECC).
- (Ventas) TVKM/TVKMT, TPTM/TPTMT y TSKM/TSKMT se refieren a campos del material en su vista de ventas; se dejan en ventas.
- (Ventas) VEKP, VEPO, TVTY y TVTYT (unidades de manipulación/embalaje) las prepara el lote de materiales; se omiten aquí para no duplicar.
- (Ventas) Componentes solo en tablas de la lista oficial; en las propias se omite.
- (Ventas/Compras) Categoría de las tablas de condiciones A016, A017, A018, A304 y A305: muchas tablas de condiciones son pool en ECC (pool KAPOL), como A004 y A005, pero no hay certeza para estas cinco; se dejan sin categoría.
- (Controlling) MLDOC_EXTRACT: categoría y clase de entrega omitidas.
- (Controlling) Pocas incorporaciones: casi todas las tablas clásicas seguras de CO-OM/CO-PC/EC-PCA ya están en el sitio.
- (Finanzas) T047A: título genérico (parámetros de control del procedimiento de reclamación); no afirmo más detalle.
- (Finanzas) TTYPT y TVPT (lista oficial) siguen excluidas como en la primera ronda.
- (General) Componentes omitidos.
- (General) TTZZ/TTZZT y TTXOB/TTXOT/TTXID/TTXIT sin clase de entrega por no estar seguro.
- (General) T016/T016T (ramos) podrian ser de ventas; revisar duplicados con staging2/sales.
- (General) DRAW/DRAT/DRAD/TDWA/TDWAT (gestion de documentos) puestas en gen.
- (General) Descartadas por duda: BUT052, TB027, TB038A/B, TB039A/B, CVI_*_CT_LINK, TJ03/TJ04, TSAD2, ADRCITY/ADRSTREET, TZONE/TZONT.
- (Materiales) Lista oficial de mat ya cubierta en la 1a ronda; todas las añadidas son propias.
- (Materiales) SER03 no se incluye: ya está en staging2/pm.
- (Materiales) MLCD (ledger de materiales, resumen) no se incluye: las tablas ML/CKML están en el área co.
- (Materiales) No incluidas por duda: MSTB/MSTE/MSTQ (stock en tránsito), T159C, T305, T334T, T340D, MYMS, MSTA, TMFG, T149A/B.
- (Materiales) ACDOCA_M_EXTRACT sin categoría ni clase.
- (Mantenimiento) Componentes omitidos por no estar seguro del componente exacto.
- (Mantenimiento) T352R sin clase de entrega (revisiones: no sé si A o C).
- (Mantenimiento) SER01-SER03 (números de serie) asignadas a pm; las comparten SD/MM.
- (Mantenimiento) Descartadas por duda: SER04/SER05, BGMZ, IHSG/IHGNS, T357G, T399W, T370C, T377P, configuración de tipos de garantía.
- (Producción) Lista oficial PP ya cubierta en ronda 1; solo añadidas clásicas ECC de configuración/textos. Descartadas por no tener certeza total del nombre: textos de TC21/T459A/T438M, TCO43T, T435, T437S, PKOSA, AFFT, PLFT, STST.
- (Proyectos) No añado ninguna tabla: no conozco con total seguridad más tablas propias de PS que no estén ya (dudas: TCJ4T, TCN41, PSTX, PROJS/PRPSS/PRHIS; IMPR/IMTP/IMZO son de Gestión de inversiones, no de PS).
- (Compras) Lista oficial de purch ya cubierta (pendientes solo las T166*/T163D/RBSELBEST excluidas en la 1a ronda).
- (Compras) EIKP/EIPO (comercio exterior, SD-FT) se usan también en entregas y facturas: si Ventas las prepara, quedarse con una versión.
- (Compras) No incluidas por duda: T163L, T169G, WYT1, LFEI, EKUB, EKKI, T161S, T16FV.
- (Calidad) Lista oficial QM ya cubierta en ronda 1. Descartadas por no tener certeza total: TQ31/TQ31T (origen de lote), QASH, QCPR, QDPA/QDPK, textos de QDDR/QDSV.

## Tablas sin explicación (10)

Al escribir las explicaciones del resto de tablas, estas se dejaron sin `purpose` ni sinónimos por no saber con precisión qué guardan:

- **Ventas** (3): `KNVD` (documentos de cliente), `KNVS` (datos de expedición del cliente), `VBLB` (pedidos abiertos con plan de entregas)
- **Compras** (1): `LFAT` (agrupaciones fiscales del proveedor)
- **Materiales** (1): `S039` (estructura del sistema de información logística)
- **Calidad** (1): `PLMW`: el título «valores por característica» podría no ser exacto; parece guardar especificaciones de característica que dependen del material.
- **Finanzas** (2): `FAAT_DOC_IT` (partidas estadísticas de activos fijos), `FAAT_YDDA` (valores de amortización por ejercicio)
- **Controlling** (2): `COEPB` (partidas por período), `CSSK` (centro de coste y clase de coste)

Títulos corregidos en esta ronda: `T683T` pasa a `T683U` (la tabla de textos de los esquemas de cálculo es T683U); `MDLG` ahora dice «almacenes asignados» (las áreas MRP se definen en MDLV); `T047` es el control de reclamaciones por sociedad, no los procedimientos; `FAAT_DOC_IT` guarda partidas estadísticas, no los movimientos reales (que van a ACDOCA).

Las explicaciones de las tablas de texto (…T) siguen una plantilla común y algunas listas de sinónimos incluyen el nombre técnico del campo clave (p. ej. `AUART`, `BSCHL`). Conviene repasar sobre todo las que los redactores marcaron como menos seguras: `EKAN`, `T006B`, `T006C`, `ELBM`, `ELBP`, `ESUC`, `T350`, `PMCO`.

## Tablas sin campos propios (80)

Las 61 del segundo grupo muestran ya en su ficha todos los campos del diccionario de SAP (ver [tablas-sap.md](tablas-sap.md)); siguen pendientes de tener sus campos principales con etiquetas en los tres idiomas. Las 19 de S/4HANA no están en ese diccionario y siguen sin campos.

938 de las 1.018 tablas tienen su clave completa y sus campos principales. Los nombres, las claves y los tipos de todas ellas, salvo cuatro de S/4HANA, se contrastaron una vez con la referencia pública del diccionario de ECC 6.0 de leanx.eu; esa consulta no se repite de forma automática y siguen pendientes de verificar contra un sistema SAP real. Quedan sin campos:

- **Solo S/4HANA, sin referencia pública con la que contrastar** (19): `ACDOCA_M_EXTRACT`, `ACDOCP`, `FAAT_DOC_IT`, `FAAT_PLAN_VALUES`, `FAAT_YDDA`, `FINSC_LD_CMP`, `FINSC_LEDGER`, `FINSC_LEDGER_T`, `FQM_FLOW`, `MATDOC`, `MATDOC_EXTRACT`, `MLDOC`, `MLDOCCCS`, `MLDOC_EXTRACT`, `PPH_DBVM`, `/SCWM/AQUA`, `/SCWM/LAGP`, `/SCWM/ORDIM_C`, `/SCWM/ORDIM_O`. Los campos de `ACDOCA`, `PRCD_ELEMENTS`, `/SCMTMS/D_TORITE` y `/SCMTMS/D_TORROT` se escribieron sin poder contrastarlos.
- **No se tenía claro el significado de algún campo** (61):
  - **Ventas** (8): `KNVS`, `T151`, `T173`, `T683`, `TPRIO`, `TVAKZ`, `TVAU`, `VBREVK`
  - **Compras** (3): `LFAT`, `S013`, `T027A`
  - **Materiales** (5): `PROP`, `T137`, `T148`, `T300`, `T301`
  - **Producción** (6): `AFWI`, `CRHS`, `S076`, `T411`, `TC26`, `TC30`
  - **Calidad** (2): `TQ05`, `TQ15`
  - **Mantenimiento** (2): `PMCO`, `T353I`
  - **Finanzas** (14): `ANEA`, `FDSB`, `KNB4`, `MHND`, `MHNK`, `REGUS`, `T040S`, `T043G`, `T047D`, `T047E`, `T096`, `TABWG`, `TTXJ`, `TVOID`
  - **Controlling** (19): `AUAB`, `BPGE`, `BPJA`, `CEPC_BUKRS`, `CKMLKEPH`, `CKMLPRKEPH`, `COFIT`, `COKP`, `COKS`, `COOI`, `COSB`, `GLPCT`, `KEPH`, `MLKEPH`, `TCK19A`, `TCKH3`, `TCKH4`, `TJ01`, `TKVS`
  - **General** (2): `TB004`, `THOC`

Títulos que conviene revisar porque los campos reales no encajan con ellos: `TCKH4` (presentada como tabla de textos, pero no tiene campo de texto), `TCK19A` y `T047D` (sus campos son de formularios, no de importes mínimos).

En las tablas de totales por período (`COSP`, `COSS`, `COSR`, `COST`, `RPSCO`, `RPSQT`, `MVER`) solo se muestran las columnas de los primeros períodos como muestra.

Un campo puede llevar en una tabla una etiqueta propia (144 casos) o un tipo propio (133 casos) cuando difiere del diccionario general; conviene repasar las etiquetas propias.

## Descartadas al integrar

Estas tablas se prepararon pero se quitaron antes de entrar en `content/`:

- `IFLO`, `ITOB`: son vistas, no tablas.
- `USR21`, `TTXOB`, `TTXOT`, `TTXID`, `TTXIT`, `TTZZ`, `TTZZT`: configuración interna del sistema.
- `T047A`: no se pudo describir su contenido con seguridad.
- `BGMKT`, `TVLPT`: no figuran ni en la referencia pública de ECC ni en la lista de SAP; las tablas reales son `BGMK` y `TVAPT` (textos de los tipos de posición).
- En `DOST` y `QAKL` se quitó la clase de entrega por no tener seguridad.

Algunas dudas de la sección anterior mencionan estas tablas: ya no están en el sitio.

## Contraste con la lista oficial de SAP

De las 271 tablas de base de datos de `objectReleaseInfo_PCELatest.json` (las que no están liberadas para la nube; las liberadas son casi todas estructuras), el sitio tiene 265. Se añadieron DD04T, DD07L, DD07T, RBSELBEST, T163D, T166C, T166K, T166P, T166T, T683T, TADIR, TDEVC, TTYPT, TVCIN, TVCINT, TVPT y VBFS, con campos contrastados en leanx.eu. Quedan fuera:

- BAPIRET1, BAPIRETURN, BAPIRETURN1, LDBCB y SCX_SRCPOS: son estructuras, no tablas.
- EHEWAD_WA_TRRQLA (gestión de residuos de EHS, solo S/4HANA): no hay referencia pública con la que escribir su ficha.
- TVPT: la categoría de entrega y el sentido exacto de PSTYO están por confirmar.

## Componentes de aplicación

Las 1.018 tablas tienen componente. 265 vienen de la lista oficial de SAP; los otros 753 los asignó el proyecto (`componentInferred: true`, la ficha lo indica). De las 675 asignadas en la última pasada (RESB se tomó de la lista oficial), 185 se dieron como seguras, 436 con el módulo seguro y el subcomponente probable, y 55 solo al nivel de módulo. La lista de códigos de referencia es la de S/4HANA Cloud, que no trae algunos componentes clásicos (FI-AR-CR, TR-CM, PP-BD-BOM, SD-BIL-RR, MM-IS-PU): en esos casos se usó el equivalente actual o el nivel superior. Dudas señaladas:

- Gestión de status (JEST, JCDS, JSTO, TJ02, TJ20, TJ30 y sus textos): solo «CA».
- Gestión de créditos (KNKK, KNKA, T691A, T691T): FI-AR-AR en lugar de FI-AR-CR.
- Cash management (FDES, FDSB, FDSR): FIN-FSCM-CLM en lugar de TR-CM.
- Ledger de materiales (CKML*, ML*, MLDOC*): CO-PC-ACT.
- Listas de materiales (STKO, STPO, MAST…): LO-MD-BOM.
- Ciclos de reparto T811C y T811S (CO-OM o FI-SL), ACDOCP (FI-GL), PVBE y PVKT (PP-KAB), S011 y S012 (MM-PUR), VBREVE y VBREVK (SD-BIL), KONA (SD-BIL), TQ80 (QM-QN).
