import { LANGS, type Lang } from '../types.ts';
import type { Sort } from './catalog.ts';

export type CatalogRoute = {
  name: 'catalog';
  lang: Lang;
  q: string;
  area: string;
  cat: string;
  letter: string;
  sort: Sort;
  page: number;
};
export type SearchRoute = { name: 'search'; lang: Lang; q: string; area: string };
export type TableRoute = { name: 'table'; lang: Lang; id: string };
export type SelectionRoute = { name: 'selection'; lang: Lang; shared: string[] | null };
export type NotFoundRoute = { name: 'notfound'; lang: Lang };
export type Route = CatalogRoute | SearchRoute | TableRoute | SelectionRoute | NotFoundRoute;

export const isLang = (s: string): s is Lang => (LANGS as readonly string[]).includes(s);

export const catalogRoute = (lang: Lang, over: Partial<Omit<CatalogRoute, 'name' | 'lang'>> = {}): CatalogRoute => ({
  name: 'catalog', lang, q: '', area: '', cat: '', letter: '', sort: 'name', page: 1, ...over,
});

const decode = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

/**
 * URLs:
 *   /es/                       table list (?q, area, cat, letter, sort=desc, page)
 *   /es/search?q=factura       search in business language
 *   /es/table/VBAK             one table
 *   /es/selection?t=VBAK,VBAP  my selection, or a shared one when ?t is present
 * Returns null for "/" so the caller can pick a language.
 */
export function parseRoute(pathname: string, search: string): Route | null {
  const parts = pathname.split('/').filter(Boolean).map(decode);
  if (!parts.length) return null;
  const [lang, page, ...rest] = parts;
  if (!isLang(lang)) return { name: 'notfound', lang: 'es' };
  const p = new URLSearchParams(search);
  const get = (k: string) => (p.get(k) ?? '').trim();
  if (!page) {
    return catalogRoute(lang, {
      q: get('q'),
      area: get('area'),
      cat: get('cat').toUpperCase(),
      letter: get('letter').toUpperCase(),
      sort: get('sort') === 'desc' ? 'desc' : 'name',
      page: Math.max(1, parseInt(get('page') || '1', 10) || 1),
    });
  }
  if (page === 'search' && !rest.length) return { name: 'search', lang, q: get('q'), area: get('area') };
  if (page === 'table' && rest.length) return { name: 'table', lang, id: rest.join('/').toUpperCase() };
  if (page === 'selection' && !rest.length) {
    const t = get('t');
    return { name: 'selection', lang, shared: t ? t.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean) : null };
  }
  return { name: 'notfound', lang };
}

export function routeHref(r: Route): string {
  const base = `/${r.lang}/`;
  const qs = (p: URLSearchParams) => {
    const s = p.toString();
    return s ? '?' + s : '';
  };
  switch (r.name) {
    case 'catalog': {
      const p = new URLSearchParams();
      if (r.q) p.set('q', r.q);
      if (r.area) p.set('area', r.area);
      if (r.cat) p.set('cat', r.cat);
      if (r.letter) p.set('letter', r.letter);
      if (r.sort === 'desc') p.set('sort', 'desc');
      if (r.page > 1) p.set('page', String(r.page));
      return base + qs(p);
    }
    case 'search': {
      const p = new URLSearchParams();
      if (r.q) p.set('q', r.q);
      if (r.area) p.set('area', r.area);
      return base + 'search' + qs(p);
    }
    case 'table':
      return base + 'table/' + encodeURIComponent(r.id);
    case 'selection':
      return base + 'selection' + (r.shared?.length ? '?t=' + r.shared.map(encodeURIComponent).join(',') : '');
    case 'notfound':
      return base;
  }
}

/** The same page in another language. */
export const withLang = (r: Route, lang: Lang): Route => ({ ...r, lang });
