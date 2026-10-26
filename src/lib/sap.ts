import type { SapRow, TableSummary } from '../types.ts';

// shared by every table of the list: none of them has synonyms or fields yet
const NO_SYN = { es: [], en: [], pt: [] };
const NO_FIELDS: string[] = [];

/** The tables of SAP's dictionary list as the site lists them, each marked with `x`. */
export const sapSummaries = (rows: SapRow[]): TableSummary[] =>
  rows.map(([id, desc, cat, dcl]) => ({ id, area: '', kind: '', cat, dcl, title: { es: desc, en: desc, pt: desc }, syn: NO_SYN, f: NO_FIELDS, p: 0, x: 1 }));

/** The table's page on SAP Datasheet, where its fields are listed. */
export const sapDatasheetHref = (id: string) => `https://www.sapdatasheet.org/abap/tabl/${encodeURIComponent(id.toLowerCase())}.html`;
