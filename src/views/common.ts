import { t, type StrKey, type Vars } from '../i18n/index.ts';
import { ic } from '../lib/icons.ts';
import { routeHref } from '../lib/router.ts';
import type { Entry } from '../lib/search.ts';
import { esc } from '../lib/text.ts';
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

/** An area as a small tinted tag; each area has its own muted hue (see the --a-* tokens). */
export const areaBadge = (c: Ctx, k: string) => `<span class="ab ab-${esc(k)}">${esc(areaName(c, k))}</span>`;

export const tableHref =(c: Ctx, id: string) => routeHref({ name: 'table', lang: c.lang, id });
export const countText = (c: Ctx, n: number) => (n === 1 ? tx(c, 'count1') : tx(c, 'countN', { n }));

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
    `<button type="button" data-act="mode" data-v="${v}" aria-pressed="${c.mode === v}">${esc(tx(c, key))}</button>`;
  return `<div class="seg" role="group" aria-label="${esc(tx(c, 'view'))}">${b('simple', 'simple')}${b('tech', 'tech')}</div>`;
}

/** A link styled as one option of a segmented control. */
export const segLink = (href: string, label: string, on: boolean) =>
  `<a href="${esc(href)}" data-link${on ? ' aria-current="true"' : ''}>${esc(label)}</a>`;

export const chipLink = (href: string, label: string, on: boolean) =>
  `<a class="chip" href="${esc(href)}" data-link${on ? ' aria-current="true"' : ''}>${esc(label)}</a>`;
