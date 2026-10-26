export const LANGS = ['es', 'en', 'pt'] as const;
export type Lang = (typeof LANGS)[number];
export type L10n = Record<Lang, string>;

/** One table as listed in the generated index (see scripts/lib/content.mjs). */
export interface TableSummary {
  id: string;
  area: string;
  /** What the table holds: header, items, master data… */
  kind: string;
  /** TRANSP, CLUSTER or POOL; empty when not known for sure. */
  cat: string;
  /** Delivery class: A, C, L, G, E, S or W; empty when not known for sure. */
  dcl: string;
  /** SAP application component, such as SD-SLS. */
  comp?: string;
  /** 1 when the component was assigned by the project rather than taken from SAP's official list. */
  ci?: 1;
  /** 1 when the table exists only in S/4HANA, not in ECC. */
  s4?: 1;
  title: L10n;
  syn: Record<Lang, string[]>;
  /** Field names; key fields start with "*", and a type of its own for this table follows a colon. */
  f: string[];
  /** 1 when the table has a plain-language explanation. */
  p: 0 | 1;
  /** How many other tables relate to this one, when any do. */
  r?: number;
  /**
   * 1 for a table known only from SAP's dictionary list: no explanation, area or fields yet, and `title`
   * holds SAP's short description in English for every language.
   */
  x?: 1;
}

/** A table of SAP's dictionary list as generated: name, SAP's short description, category, delivery class. */
export type SapRow = [id: string, desc: string, cat: string, dcl: string];

export interface Relation {
  table: string;
  type: string;
  on: string;
}

export interface TableDetail {
  purpose: L10n | null;
  rel: Relation[];
  /** Labels of fields that mean something narrower in this table than in the dictionary. */
  lab?: Record<string, L10n>;
  /** SAP's own short description of the table, in English, when SAP's dictionary list has it. */
  sd?: string;
}

export interface FieldDef {
  type: string;
  label: L10n;
}

export interface NamedCode {
  name: L10n;
  help: L10n;
}

export interface Taxonomy {
  areas: Record<string, L10n>;
  contents: Record<string, L10n>;
  categories: Record<string, NamedCode>;
  deliveryClasses: Record<string, NamedCode>;
  relationTypes: Record<string, L10n>;
}

export interface GlossaryEntry {
  term: L10n;
  definition: L10n;
}

export interface DataIndex {
  tables: TableSummary[];
  fields: Record<string, FieldDef>;
  taxonomy: Taxonomy;
  glossary: GlossaryEntry[];
}
