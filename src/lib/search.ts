import { LANGS, type DataIndex, type Lang, type TableSummary } from '../types.ts';
import { parseField } from './fields.ts';
import { norm, osa, tokenize } from './text.ts';

const STOP = new Set([
  'de', 'del', 'la', 'el', 'los', 'las', 'un', 'una', 'y', 'en', 'por', 'para', 'a',
  'of', 'the', 'an', 'and', 'for', 'in', 'to',
  'da', 'do', 'das', 'dos', 'o', 'as', 'os', 'um', 'uma', 'e', 'em',
]);

// client fields, which every client-dependent table has in its key
const CLIENT = new Set(['MANDT', 'CLIENT', 'MANDANT', 'RCLNT']);

interface Phrase {
  lang: Lang;
  raw: string;
  n: string;
  tok: string[];
}

interface FieldEntry {
  name: string;
  key: boolean;
  lc: string;
  labels: string[][];
}

/** A table prepared for searching and filtering. */
export interface Entry {
  t: TableSummary;
  order: number;
  id: string;
  titles: Phrase[];
  syns: Phrase[];
  words: string[];
  fields: FieldEntry[];
  /** The one key field besides the client, when there is just one: the field this table is the home of. */
  soleKey: string;
  /** SAP application component in lower case ("fi-aa"), or empty. */
  comp: string;
  /** Everything the list filter looks at, per language. */
  hay: Record<Lang, string>;
  /** A table known only from SAP's dictionary list (see sapEntries). */
  sap?: true;
}

export function buildEntries(data: DataIndex): Entry[] {
  const tx = data.taxonomy;
  return data.tables.map((t, order) => {
    const phrase = (lang: Lang, raw: string): Phrase => ({ lang, raw, n: norm(raw), tok: tokenize(raw) });
    const titles = LANGS.map((lang) => phrase(lang, t.title[lang]));
    const syns = LANGS.flatMap((lang) => t.syn[lang].map((raw) => phrase(lang, raw)));
    const words = [...new Set([...titles, ...syns].flatMap((p) => p.tok))];
    const fields = t.f.map((f) => {
      const { name, key } = parseField(f);
      const def = data.fields[name];
      return { name, key, lc: name.toLowerCase(), labels: LANGS.map((l) => tokenize(def ? def.label[l] : '')) };
    });
    const keys = fields.filter((f) => f.key && !CLIENT.has(f.name));
    const soleKey = keys.length === 1 ? keys[0].name : '';
    const comp = norm(t.comp ?? '');
    const hay = {} as Record<Lang, string>;
    for (const l of LANGS) {
      hay[l] = norm([t.id, t.title[l], tx.areas[t.area]?.[l] ?? '', tx.contents[t.kind]?.[l] ?? '', comp, ...t.syn[l]].join(' '));
    }
    return { t, order, id: t.id.toLowerCase(), titles, syns, words, fields, soleKey, comp, hay };
  });
}

/**
 * Entries for the tables of SAP's dictionary list, numbered from `start` so they come after the explained
 * tables when scores tie. They match by name and by the words of SAP's English description only.
 */
export function sapEntries(tables: TableSummary[], start: number): Entry[] {
  return tables.map((t, i) => {
    const raw = t.title.en;
    const title: Phrase = { lang: 'en', raw, n: norm(raw), tok: tokenize(raw) };
    const h = norm(t.id + ' ' + raw);
    return { t, order: start + i, id: t.id.toLowerCase(), titles: [title], syns: [], words: title.tok, fields: [], soleKey: '', comp: '', hay: { es: h, en: h, pt: h }, sap: true };
  });
}

/** Why a result matched, when the reason is not visible in its name or title. */
export type Via = { syn: string } | { field: string } | { comp: string } | null;

export interface Hit {
  t: TableSummary;
  via: Via;
}

export interface SearchResult {
  hits: Hit[];
  /** True when no table matched every word and the hits match only some of them. */
  partial: boolean;
}

function scoreEntry(x: Entry, words: string[], full: string, lang: Lang) {
  let total = 0;
  let matched = 0;
  let via: Via = null;
  let viaScore = 0;
  for (const qt of words) {
    const best = { score: 0, via: null as Via };
    const cand = (score: number, v: Via = null) => {
      if (score > best.score) {
        best.score = score;
        best.via = v;
      }
    };
    if (x.id === qt) cand(120);
    else if (x.id.startsWith(qt)) cand(70);
    else if (qt.length >= 3 && x.id.includes(qt)) cand(25);
    // a whole word (or its plural) beats a longer word that merely starts the same ("factura" → "facturas", then "facturación")
    const whole = (w: string) => w === qt || w === qt + 's' || w === qt + 'es';
    // SAP's terse English descriptions weigh less than the explanations written for this site, so a table
    // explained here comes first when both match ("invoice" → VBRK before a table SAP calls "Invoice …")
    const titleScore = (p: Phrase) => (x.sap ? 12 : p.lang === lang ? 30 : 22);
    for (const p of x.titles) for (const w of p.tok) if (w.startsWith(qt)) cand(titleScore(p) + (whole(w) ? 2 : 0));
    for (const p of x.syns) for (const w of p.tok) if (w.startsWith(qt)) cand((p.lang === lang ? 26 : 19) + (whole(w) ? 2 : 0), { syn: p.raw });
    // a synonym that is exactly the word searched beats a title that merely contains it ("factura" → VBRK, not RBCO)
    for (const p of x.syns) if (p.n === qt) cand(p.lang === lang ? 40 : 29, { syn: p.raw });
    for (const f of x.fields) {
      // a field name points to its "home" table first: the one where it is a key of master data
      if (f.lc === qt) cand(18 + (f.key ? 10 : 0) + (x.t.kind === 'master' ? 8 : 0) + (x.soleKey === f.name ? 12 : 0), { field: f.name });
      else if (qt.length >= 3 && f.labels.some((ws) => ws.some((w) => w.startsWith(qt)))) cand(7, { field: f.name });
    }
    // near misses only among the explained tables: SAP's English words would bring noise to a search in Spanish
    if (best.score === 0 && qt.length >= 4 && !x.sap) {
      const max = qt.length >= 8 ? 2 : 1;
      const near = (w: string) =>
        osa(qt, w, max) <= max || (w.length > qt.length && osa(qt, w.slice(0, qt.length), max) <= max);
      // a one-word synonym one typo away is the closest reading ("provedor" → LFA1, whose synonym is "proveedor")
      if (x.syns.some((p) => p.tok.length === 1 && osa(qt, p.n, max) <= max)) cand(18, null);
      else if (x.titles.some((p) => p.tok.some(near))) cand(16);
      else if (x.words.some(near)) cand(12);
    }
    if (best.score > 0) {
      matched++;
      total += best.score;
      if (best.via && best.score > viaScore) {
        via = best.via;
        viaScore = best.score;
      }
    }
  }
  if (full.length >= 3 && (x.syns.some((p) => p.n.includes(full)) || x.titles.some((p) => p.n.includes(full)))) total += x.sap ? 8 : 25;
  // a title that starts with the thing searched is about that thing ("Centros de coste"), not one that mentions it in passing
  // ("Puestos de trabajo: asignación a centros de coste")
  if (matched && !x.sap && x.titles.some((p) => p.lang === lang && p.tok[0]?.startsWith(words[0]))) total += 6;
  return { total, matched, via };
}

// what a module or component code looks like once normalised: "sd", "fi-aa", "mm-pur"
const COMP_Q = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

const KIND_ORDER =['master', 'header', 'doc', 'items', 'text', 'config'];
const kindRank = (k: string) => {
  const i = KIND_ORDER.indexOf(k);
  return i < 0 ? KIND_ORDER.length : i;
};

/**
 * Ranks tables for a query written in business language or as a table/field name.
 * Every word must match; when nothing matches every word, tables matching some of them are returned as partial.
 */
export function search(entries: Entry[], query: string, lang: Lang, area = ''): SearchResult {
  const pool = area ? entries.filter((x) => x.t.area === area) : entries;
  const raw = tokenize(query);
  if (!raw.length) return { hits: pool.map((x) => ({ t: x.t, via: null })), partial: false };
  let words = raw.filter((w) => !STOP.has(w));
  if (!words.length) words = raw;
  const full = norm(query).trim();
  const scored = pool.map((x) => ({ x, ...scoreEntry(x, words, full, lang) }));
  // ties go to tables documented field by field, then to the ones most other tables relate to (the central ones),
  // then to those with an explanation, then to master data and headers before items, texts and configuration,
  // and only then to alphabetical order
  const tie = (a: (typeof scored)[number], b: (typeof scored)[number]) =>
    Math.sign(b.x.t.f.length) - Math.sign(a.x.t.f.length) ||
    (b.x.t.r ?? 0) - (a.x.t.r ?? 0) ||
    b.x.t.p - a.x.t.p ||
    kindRank(a.x.t.kind) - kindRank(b.x.t.kind) ||
    a.x.order - b.x.order;
  const toHit = (r: (typeof scored)[number]): Hit => ({ t: r.x.t, via: r.via });
  const all = scored.filter((r) => r.matched === words.length).sort((a, b) => b.total - a.total || tie(a, b));
  // a module or component code ("SD", "FI-AA", "MM-PUR") lists that component's tables, after a table of that exact
  // name if there is one and before anything that merely contains the letters
  if (COMP_Q.test(full)) {
    const inComp = scored.filter((r) => r.x.comp === full || r.x.comp.startsWith(full + '-')).sort(tie);
    if (inComp.length) {
      const taken = new Set(inComp.map((r) => r.x));
      const exact = all.filter((r) => r.x.id === full);
      for (const r of exact) taken.add(r.x);
      return {
        hits: [
          ...exact.map(toHit),
          ...inComp.filter((r) => r.x.id !== full).map((r) => ({ t: r.x.t, via: { comp: r.x.t.comp! } })),
          ...all.filter((r) => !taken.has(r.x)).map(toHit),
        ],
        partial: false,
      };
    }
  }
  if (all.length) return { hits: all.map(toHit), partial: false };
  const some = scored
    .filter((r) => r.matched > 0)
    .sort((a, b) => b.matched - a.matched || b.total - a.total || tie(a, b));
  return { hits: some.map(toHit), partial: some.length > 0 };
}
