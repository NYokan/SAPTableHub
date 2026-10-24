import { t, type StrKey, type Vars } from '../i18n/index.ts';
import { ic } from '../lib/icons.ts';
import { routeHref } from '../lib/router.ts';
import type { Entry } from '../lib/search.ts';
import { esc, norm, tokenize } from '../lib/text.ts';
import type { DataIndex, L10n, Lang, Mode, TableSummary } from '../types.ts';

/** What every view needs to render. */
export interface Ctx {
  lang: Lang;
  mode: Mode;
  data: DataIndex;
  entries: Entry[];
  byId: Map<string, TableSummary>;
  selection: string[];
}

export const tx = (c: Ctx, key: StrKey, vars?: Vars): string => t(c.lang, key, vars);
export const loc = (c: Ctx, o: L10n | undefined): string => (o ? o[c.lang] : '');

export const areaName = (c: Ctx, k: string) => loc(c, c.data.taxonomy.areas[k]);
export const kindName = (c: Ctx, k: string) => loc(c, c.data.taxonomy.contents[k]);
export const catName = (c: Ctx, k: string) => loc(c, c.data.taxonomy.categories[k]?.name);
export const dclName = (c: Ctx, k: string) => loc(c, c.data.taxonomy.deliveryClasses[k]?.name);

/** An area as a tag in its own colour, with a dot of the same hue (see the --a-* tokens). */
export const areaBadge = (c: Ctx, k: string) => `<span class="ab ab-${esc(k)}">${esc(areaName(c, k))}</span>`;

/** The visible "S/4HANA only" mark for tables that do not exist in ECC; empty for the rest. */
export const s4Badge = (c: Ctx, t: TableSummary) => (t.s4 ? `<span class="s4" title="${esc(tx(c, 's4note'))}">${esc(tx(c, 's4only'))}</span>` : '');

/** Category and delivery class are left empty when not known for sure; they read as a dash. */
export const orDash = (v: string | undefined) => v || '—';

export const tableHref = (c: Ctx, id: string) => routeHref({ name: 'table', lang: c.lang, id });
export const countText = (c: Ctx, n: number) => (n === 1 ? tx(c, 'count1') : tx(c, 'countN', { n }));

/**
 * Escaped text with every word of the query that starts a word in it wrapped in <mark>,
 * ignoring case and accents ("factu" marks "Facturación").
 */
export function highlight(text: string, q: string): string {
  const words = tokenize(q);
  if (!words.length || !text) return esc(text);
  const chars = [...text];
  // one folded character per original character, so the indexes line up
  const folded = chars.map((ch) => (norm(ch) || ch).charAt(0)).join('');
  const on = new Array<boolean>(chars.length).fill(false);
  for (const w of words) {
    for (let i = folded.indexOf(w); i >= 0; i = folded.indexOf(w, i + 1)) {
      if (i === 0 || !/[a-z0-9]/.test(folded[i - 1])) on.fill(true, i, i + w.length);
    }
  }
  let out = '';
  for (let i = 0; i < chars.length; i++) {
    if (on[i] && !on[i - 1]) out += '<mark>';
    out += esc(chars[i]);
    if (on[i] && !on[i + 1]) out += '</mark>';
  }
  return out;
}

/** One option of a list inside the Filtros popover; the chosen one carries aria-current. */
export const optLink = (href: string, label: string, on: boolean, k: string, extra = '') =>
  `<a class="opt" href="${esc(href)}" data-link data-k="${esc(k)}"${on ? ' aria-current="true"' : ''}${extra}>${esc(label)}</a>`;

/** A filter in effect, shown next to the Filtros button: clicking it removes that filter. */
export const tokenLink = (c: Ctx, href: string, label: string, value: string) =>
  `<a class="token" href="${esc(href)}" data-link aria-label="${esc(tx(c, 'removeFilter', { f: `${label} ${value}` }))}"><span class="tk-l">${esc(label)}</span><span>${esc(value)}</span>${ic('x', 14)}</a>`;

/** The small "+" button that adds a table to the selection. */
export function addButton(c: Ctx, id: string): string {
  const on = c.selection.includes(id);
  return `<button class="add" data-act="add" data-id="${esc(id)}" aria-pressed="${on}" aria-label="${esc(tx(c, 'addAria', { id }))}">${ic(on ? 'check' : 'plus')}</button>`;
}

/** The wide version used on a table's page; it says what it does. */
export function bigAddButton(c: Ctx, id: string): string {
  const on = c.selection.includes(id);
  return `<button class="btn primary" data-act="add" data-id="${esc(id)}" data-big="1" aria-pressed="${on}">${bigAddLabel(c, on)}</button>`;
}

export const bigAddLabel = (c: Ctx, on: boolean) =>
  ic(on ? 'check' : 'plus', 18) + `<span>${esc(tx(c, on ? 'inList' : 'addList'))}</span>`;

/** Simple / Technical switch. */
export function modeSeg(c: Ctx): string {
  const b = (v: Mode, key: StrKey) =>
    `<button type="button" data-act="mode" data-v="${v}" data-k="mode-${v}" aria-pressed="${c.mode === v}">${esc(tx(c, key))}</button>`;
  return `<div class="seg" role="group" aria-label="${esc(tx(c, 'view'))}">${b('simple', 'simple')}${b('tech', 'tech')}</div>`;
}

/** A link styled as one option of a segmented control. */
export const segLink = (href: string, label: string, on: boolean, k = '') =>
  `<a href="${esc(href)}" data-link${k ? ` data-k="${esc(k)}"` : ''}${on ? ' aria-current="true"' : ''}>${esc(label)}</a>`;

export const chipLink = (href: string, label: string, on: boolean) =>
  `<a class="chip" href="${esc(href)}" data-link${on ? ' aria-current="true"' : ''}>${esc(label)}</a>`;
