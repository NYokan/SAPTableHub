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
}

export const LANGS: string[];
export function shardOf(id: string): string;
export function fileNameOf(id: string): string;
export function loadContent(dir: string): Content;
export function validate(content: Content): string[];
export function compile(content: Content): {
  index: { tables: any[] } & Record<string, unknown>;
  details: Record<string, Record<string, unknown>>;
};
