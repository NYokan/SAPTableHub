# Pendientes de verificar

Este archivo se genera al ampliar el contenido. Recoge lo que **no** se rellenó por no tener total seguridad, para revisarlo contra un sistema SAP real.

## Tablas sin categoría (8)

En el sitio se muestran con «—» en la categoría. Solo BSEG, BSET, KONV y CDPOS están marcadas como cluster (ECC).

- **Ventas** (2): `/SCMTMS/D_TORITE`, `/SCMTMS/D_TORROT`
- **Compras** (1): `CVI_VEND_LINK`
- **Materiales** (2): `ACDOCA_M_EXTRACT`, `MATDOC_EXTRACT`
- **Producción** (2): `MDTB`, `PPH_DBVM`
- **Controlling** (1): `MLDOC_EXTRACT`

## Tablas sin clase de entrega (70)

En el sitio se muestran con «—» en la clase de entrega.

- **Ventas** (2): `/SCMTMS/D_TORITE`, `/SCMTMS/D_TORROT`
- **Compras** (1): `CVI_VEND_LINK`
- **Materiales** (8): `/SCWM/AQUA`, `/SCWM/LAGP`, `/SCWM/ORDIM_C`, `/SCWM/ORDIM_O`, `ACDOCA_M_EXTRACT`, `MARV`, `MATDOC_EXTRACT`, `VEVW`
- **Producción** (7): `DOST`, `MDTB`, `PPH_DBVM`, `PVBE`, `PVKT`, `TC21`, `TCA01`
- **Calidad** (12): `QAKL`, `QCVK`, `QCVM`, `QDDR`, `QDPS`, `QDSV`, `QPAC`, `QPAM`, `QPCD`, `QPCT`, `QPGR`, `QPGT`
- **Mantenimiento** (1): `T352R`
- **Finanzas** (18): `FINSC_LD_CMP`, `FINSC_LEDGER`, `FINSC_LEDGER_T`, `SETHEADER`, `SETHEADERT`, `SETLEAF`, `SETNODE`, `T074T`, `T074U`, `T090NA`, `T090NAT`, `TABW`, `TABWG`, `TABWT`, `TBSL`, `TBSLT`, `TCJ_C_JOURNALS`, `UKMCRED_SGM0T`
- **Controlling** (9): `CBPR`, `CBPT`, `MLDOC_EXTRACT`, `T811C`, `T811S`, `TJ01`, `TJ01T`, `TKA03`, `TKT03`
- **General** (12): `T002`, `T002T`, `T006`, `T006A`, `T006B`, `T006C`, `T006D`, `T006I`, `T006J`, `T006T`, `TJ02`, `TJ02T`

## Dudas anotadas al preparar el contenido (81)

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
- (Materiales) Las 4 tablas /SCWM/ (EWM) se guardan como _SCWM_*.json; el verificador ignora archivos que empiezan por _, así que no las valida. Marcadas s4only: no existen en ECC 6.0 (sí en sistemas SCM EWM independientes).
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

## Descartadas al integrar

Estas tablas se prepararon pero se quitaron antes de entrar en `content/`:

- `IFLO`, `ITOB`: son vistas, no tablas.
- `USR21`, `TTXOB`, `TTXOT`, `TTXID`, `TTXIT`, `TTZZ`, `TTZZT`: configuración interna del sistema.
- `T047A`: no se pudo describir su contenido con seguridad.
- En `DOST` y `QAKL` se quitó la clase de entrega por no tener seguridad.

Algunas dudas de la sección anterior mencionan estas tablas: ya no están en el sitio.
