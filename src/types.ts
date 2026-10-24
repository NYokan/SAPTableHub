export const LANGS = ['es', 'en', 'pt'] as const;
export type Lang = (typeof LANGS)[number];
export type L10n = Record<Lang, string>;
export type Mode = 'simple' | 'tech';

/** One table as listed in the generated index (see scripts/lib/content.mjs). */
export interface TableSummary {
  id: string;
  area: string;
  /** What the table holds: header, items, master data… */
  kind: string;
  /** TRANSP, CLUSTER or POOL. */
  cat: string;
  /** Delivery class: A, C, L, G, E, S or W. */
  dcl: string;
  title: L10n;
  syn: Record<Lang, string[]>;
  /** Field names; key fields start with "*". */
  f: string[];
  /** 1 when the table has a plain-language explanation. */
  p: 0 | 1;
}

export interface Relation {
  table: string;
  type: string;
  on: string;
}

export interface TableDetail {
  purpose: L10n | null;
  rel: Relation[];
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
