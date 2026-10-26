// Types for content.mjs, so the TypeScript tests can use it.
export interface ContentFile {
  file: string;
  data: any;
  parseError?: string;
}

export interface Content {
  taxonomy: Record<string, Record<string, any>>;
  fields: Record<string, any>;
  glossary: any[];
  tables: ContentFile[];
  /** content/sap-tables.tsv: the header's columns and every other line split at the tabs. */
  sap: { head: string[]; rows: { line: number; cols: string[] }[] };
  /** content/sap-fields.tsv, read the same way. */
  sapFields: { head: string[]; rows: { line: number; cols: string[] }[] };
}

export const LANGS: string[];
export const SAP_FILE: string;
export const SAP_HEAD: string[];
export const SAP_FIELDS_FILE: string;
export const SAP_FIELDS_HEAD: string[];
export function shardOf(id: string, split?: readonly string[]): string;
export const SPLIT_OVER: number;
export function fileNameOf(id: string): string;
export function loadContent(dir: string): Content;
export function validate(content: Content): string[];
export function compile(content: Content): {
  index: { tables: any[] } & Record<string, unknown>;
  details: Record<string, Record<string, unknown>>;
  /** [name, SAP short description, category, delivery class] of the tables with no file in tables/. */
  sap: [string, string, string, string][];
};
