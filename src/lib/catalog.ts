import type { Lang, TableSummary } from '../types.ts';
import type { Entry } from './search.ts';
import { tokenize } from './text.ts';

export const LETTERS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '/'];
/** Rows per page of the table list. */
export const PAGE_SIZE = 50;

export type Sort = 'name' | 'desc';

export interface CatalogQuery {
  q: string;
  area: string;
  cat: string;
  letter: string;
  sort: Sort;
  /** 1-based. */
  page: number;
}

export interface CatalogResult {
  /** Rows of the current page. */
  rows: TableSummary[];
  /** Every row that matches, across pages (used by "Copy list"). */
  all: TableSummary[];
  total: number;
  pages: number;
  page: number;
  /** Index of the first row of the page in `all`. */
  start: number;
  /** Matches per letter, ignoring the letter filter, so the index can disable empty letters. */
  letterCounts: Record<string, number>;
}

/** Index letter of a table name: A–Z, "/" for namespaced tables, "#" for anything else. */
export function letterOf(id: string): string {
  const c = id.charAt(0).toUpperCase();
  if (c === '/') return '/';
  return /[A-Z]/.test(c) ? c : '#';
}

export function runCatalog(entries: Entry[], q: CatalogQuery, lang: Lang): CatalogResult {
  const words = tokenize(q.q);
  const base = entries
    .filter((x) => (!q.area || x.t.area === q.area) && (!q.cat || x.t.cat === q.cat))
    .filter((x) => words.every((w) => x.hay[lang].includes(w)))
    .map((x) => x.t);
  const letterCounts: Record<string, number> = {};
  for (const t of base) {
    const l = letterOf(t.id);
    letterCounts[l] = (letterCounts[l] ?? 0) + 1;
  }
  const all = (q.letter ? base.filter((t) => letterOf(t.id) === q.letter) : base.slice()).sort((a, b) =>
    q.sort === 'desc'
      ? a.title[lang].localeCompare(b.title[lang], lang) || a.id.localeCompare(b.id)
      : a.id.localeCompare(b.id),
  );
  const pages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, q.page), pages);
  const start = (page - 1) * PAGE_SIZE;
  return { rows: all.slice(start, start + PAGE_SIZE), all, total: all.length, pages, page, start, letterCounts };
}

/** Page numbers to show: first, last and the neighbours of the current one, with gaps as "…". */
export function pageList(current: number, pages: number): (number | '…')[] {
  const out: (number | '…')[] = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - current) <= 1) out.push(p);
    else if (out[out.length - 1] !== '…') out.push('…');
  }
  return out;
}
