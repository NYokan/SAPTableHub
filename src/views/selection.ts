import { requestLine } from '../lib/catalog.ts';
import { ic } from '../lib/icons.ts';
import { catalogRoute, routeHref, type SelectionRoute } from '../lib/router.ts';
import { esc } from '../lib/text.ts';
import { countText, loc, modTag, tableHref, tx, type Ctx } from './common.ts';

export type Format = 'names' | 'desc';
let format: Format = 'names';
export const setFormat = (f: Format) => {
  format = f;
};

/** The tables "remove all" just took out, so the empty page can offer to put them back. */
let cleared: string[] = [];
export const setCleared = (ids: string[]) => {
  cleared = ids;
};
export const clearedIds = () => cleared;

/** Text to paste into a request: one table per line, optionally with its description and module. */
export function selectionText(c: Ctx, ids: string[]): string {
  return ids
    .map((id) => {
      const t = c.byId.get(id);
      return format === 'desc' ? requestLine(id, loc(c, t?.title), t?.comp) : id;
    })
    .join('\n');
}

/** The tables a shared link points to, keeping only names the site knows. */
export const sharedIds = (c: Ctx, r: SelectionRoute) => (r.shared ?? []).filter((id) => c.byId.has(id));

/** My selection, or a selection someone shared through a link (?t=VBAK,VBAP). */
export function renderSelection(el: HTMLElement, r: SelectionRoute, c: Ctx): void {
  el.dataset.view = 'selection';
  el.className = 'wrap view view-selection';
  const shared = r.shared !== null;
  const ids = shared ? sharedIds(c, r) : c.selection;
  const title = tx(c, shared ? 'shared' : 'mySelection');
  const intro = tx(c, shared ? 'sharedIntro' : 'listIntro');
  let h = `<div class="l-head"><h1 tabindex="-1">${esc(title)}</h1><span class="count${ids.length ? '' : ' zero'}">${ids.length}</span></div><p class="l-intro">${esc(intro)}</p>`;

  if (!ids.length) {
    const go = (cls: string) => `<a class="btn${cls}" href="${esc(routeHref(catalogRoute(c.lang)))}" data-link>${ic('table', 18)}${esc(tx(c, 'goCatalog'))}</a>`;
    // right after "remove all", the way back comes first
    h += !shared && cleared.length
      ? `<div class="panel empty" style="margin-top:20px"><strong>${esc(tx(c, 'cleared', { tables: countText(c, cleared.length) }))}</strong><div class="actions" style="margin-top:16px"><button type="button" class="btn primary" data-act="undoclear">${esc(tx(c, 'undo'))}</button>${go('')}</div></div>`
      : `<div class="panel empty" style="margin-top:20px"><strong>${esc(tx(c, 'listEmpty'))}</strong><span class="muted">${esc(tx(c, 'listEmptyHelp'))}</span><div style="margin-top:16px">${go(' primary')}</div></div>`;
    el.innerHTML = h;
    return;
  }

  const fmt = (v: Format, key: 'fmtN' | 'fmtD') =>
    `<button type="button" data-act="fmt" data-v="${v}" aria-pressed="${format === v}">${esc(tx(c, key))}</button>`;
  h += `<div class="l-tools"><div class="seg" role="group">${fmt('names', 'fmtN')}${fmt('desc', 'fmtD')}</div>${shared ? '' : `<button type="button" class="btn ghost rmall" data-act="rmall">${ic('x', 16)}${esc(tx(c, 'clearAll'))}</button>`}</div>`;
  h +=
    '<div class="panel"><ul class="rows">' +
    ids
      .map((id) => {
        const t = c.byId.get(id);
        const rm = shared
          ? ''
          : `<button type="button" class="rm" data-act="rm" data-id="${esc(id)}" aria-label="${esc(tx(c, 'rmAria', { id }))}">${esc(tx(c, 'remove'))}</button>`;
        return `<li class="row"><a class="r-main" href="${esc(tableHref(c, id))}" data-link><span class="r-line"><span class="r-id big">${esc(id)}</span><span class="r-title dim">${esc(loc(c, t?.title))}</span>${t ? modTag(c, t, true) : ''}</span></a>${rm}</li>`;
      })
      .join('') +
    '</ul></div>';
  h += `<pre class="out" id="out">${esc(selectionText(c, ids))}</pre>`;
  h += shared
    ? `<div class="actions"><button type="button" class="btn primary" data-act="saveshared">${ic('plus', 18)}${esc(tx(c, 'saveShared'))}</button><button type="button" class="btn" data-act="copylist">${ic('copy', 18)}${esc(tx(c, 'copyList'))}</button></div>`
    : `<div class="actions"><button type="button" class="btn primary" data-act="copylist">${ic('copy', 18)}${esc(tx(c, 'copyList'))}</button><button type="button" class="btn" data-act="copylink">${ic('link', 18)}${esc(tx(c, 'copyLink'))}</button></div>`;
  el.innerHTML = h;
}
