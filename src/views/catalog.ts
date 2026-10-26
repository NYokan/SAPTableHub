import { ic } from '../lib/icons.ts';
import { LETTERS, pageList, runCatalog, type CatalogResult } from '../lib/catalog.ts';
import { routeHref, type CatalogRoute } from '../lib/router.ts';
import { esc } from '../lib/text.ts';
import type { TableSummary } from '../types.ts';
import {
  addButton, areaBadge, areaName, catName, countText, dclName, highlight, kindName, loc, modTag, noExpTag, num, optLink, orDash, s4Badge, segLink, tableHref, titleHTML, tokenLink, tx, type Ctx,
} from './common.ts';

/**
 * The table list, table first: one search field alone on top, every other filter behind a "Filtros"
 * popover with the active ones as removable chips, the A–Z as a rail beside the table, and rows that
 * open the table's ficha in a side sheet (see sheet.ts).
 */
export function renderCatalog(el: HTMLElement, r: CatalogRoute, c: Ctx): CatalogResult {
  if (el.dataset.view !== 'catalog') {
    el.dataset.view = 'catalog';
    el.className = 'wrap view view-catalog';
    // the filter box is created once, so typing is never interrupted by a re-render
    el.innerHTML = `
      <div class="c-head"><h1 id="ctitle" tabindex="-1"></h1><p class="c-intro" id="cintro"></p></div>
      <form class="cfilter" id="cform" role="search"><span class="si">${ic('search', 20)}</span><label class="vh" for="cq" id="cqlabel"></label><input id="cq" type="search" autocomplete="off" autocapitalize="none" spellcheck="false" enterkeyhint="search"><kbd class="kbd" aria-hidden="true">/</kbd></form>
      <div class="c-tools" id="ctools"></div>
      <div class="c-body"><nav class="az" id="az"></nav><div class="cwrap" id="ctable"></div></div>`;
  }
  const get = (id: string) => el.querySelector<HTMLElement>('#' + id)!;
  const res = runCatalog(c.entries, r, c.lang);
  const at = (over: Partial<CatalogRoute>) => routeHref({ ...r, page: 1, open: '', ...over });

  get('ctitle').textContent = tx(c, 'catTitle') + (r.letter ? ' · ' + r.letter : '');
  get('cintro').textContent = tx(c, 'catIntro', { n: num(c, c.data.tables.length) });
  get('cqlabel').textContent = tx(c, 'cfilter');
  const input = get('cq') as HTMLInputElement;
  input.placeholder = tx(c, 'cfilter');
  if (document.activeElement !== input && input.value !== r.q) input.value = r.q;

  // the popover keeps its open state and the focused option across re-renders
  const tools = get('ctools');
  const wasOpen = tools.querySelector<HTMLDetailsElement>('details')?.open ?? false;
  const focusK = tools.contains(document.activeElement) ? (document.activeElement as HTMLElement).dataset.k : undefined;
  const cats = Object.keys(c.data.taxonomy.categories)
    .map((k) => `<option value="${esc(k)}"${r.cat === k ? ' selected' : ''}>${esc(k)} · ${esc(catName(c, k))}</option>`)
    .join('');
  const letters =
    optLink(at({ letter: '' }), tx(c, 'all'), !r.letter, 'pl-', ' role="listitem"') +
    LETTERS.map((l) =>
      res.letterCounts[l]
        ? optLink(at({ letter: l }), l, r.letter === l, 'pl-' + l, ` role="listitem" aria-label="${esc(`${l} · ${countText(c, res.letterCounts[l])}`)}"`)
        : `<span class="opt off" role="listitem" aria-label="${esc(`${l} · ${countText(c, 0)}`)}">${esc(l)}</span>`,
    ).join('');
  const body =
    `<p class="pop-h" id="ph-exp">${esc(tx(c, 'show'))}</p><div class="seg" role="group" aria-labelledby="ph-exp">${segLink(at({ exp: false }), tx(c, 'all'), !r.exp, 'exp-all')}${segLink(at({ exp: true }), tx(c, 'showExp'), r.exp, 'exp-on')}</div>` +
    `<p class="pop-h" id="ph-area">${esc(tx(c, 'colArea'))}</p><div class="opts" role="group" aria-labelledby="ph-area">` +
    optLink(at({ area: '' }), tx(c, 'all'), !r.area, 'area-') +
    Object.keys(c.data.taxonomy.areas).map((k) => optLink(at({ area: k }), areaName(c, k), r.area === k, 'area-' + k, ` data-a="${esc(k)}"`)).join('') +
    `</div><label class="pop-h" for="ccat">${esc(tx(c, 'colCat'))}</label><span class="sel"><select id="ccat" data-k="cat"><option value="">${esc(tx(c, 'allCats'))}</option>${cats}</select></span>` +
    `<p class="pop-h" id="ph-sort">${esc(tx(c, 'sortBy'))}</p><div class="seg" role="group" aria-labelledby="ph-sort">${segLink(at({ sort: 'name' }), tx(c, 'sortName'), r.sort === 'name', 'sort-name')}${segLink(at({ sort: 'desc' }), tx(c, 'sortDesc'), r.sort === 'desc', 'sort-desc')}</div>` +
    `<div class="pop-letters"><p class="pop-h" id="ph-l">${esc(tx(c, 'letters'))}</p><div class="lgrid" role="list" aria-labelledby="ph-l">${letters}</div></div>`;
  const tokens = [
    r.exp ? tokenLink(c, at({ exp: false }), tx(c, 'show'), tx(c, 'showExp')) : '',
    r.area ? tokenLink(c, at({ area: '' }), tx(c, 'colArea'), areaName(c, r.area)) : '',
    r.cat ? tokenLink(c, at({ cat: '' }), tx(c, 'colCat'), r.cat) : '',
    r.sort === 'desc' ? tokenLink(c, at({ sort: 'name' }), tx(c, 'sortBy'), tx(c, 'sortDesc')) : '',
    r.letter ? tokenLink(c, at({ letter: '' }), tx(c, 'letter'), r.letter) : '',
  ].filter(Boolean);
  const n = tokens.length;
  tools.innerHTML = `
    <div class="t-left">
      <details class="pop" id="cfilt"><summary class="fbtn" data-k="fbtn" aria-label="${esc(tx(c, 'filters') + (n ? ` (${n})` : ''))}">${ic('filter', 18)}<span>${esc(tx(c, 'filters'))}</span>${n ? `<span class="fn" aria-hidden="true">${n}</span>` : ''}</summary><div class="pop-in">${body}</div></details>
      ${tokens.join('')}
    </div>
    <div class="t-right">
      <span class="ccount" aria-live="polite">${esc(countText(c, res.total))}</span>
      <button type="button" class="tbtn" data-act="copyview" data-k="copy">${ic('copy', 18)}<span>${esc(tx(c, 'copyView'))}</span></button>
    </div>`;
  if (wasOpen) (tools.querySelector('details') as HTMLDetailsElement).open = true;
  if (focusK) tools.querySelector<HTMLElement>(`[data-k="${focusK}"]`)?.focus();

  const az = get('az');
  az.setAttribute('aria-label', tx(c, 'letters'));
  az.innerHTML =
    `<a class="az-all" href="${esc(at({ letter: '' }))}" data-link${!r.letter ? ' aria-current="true"' : ''}>${esc(tx(c, 'all'))}</a>` +
    LETTERS.map((l) => {
      const k = res.letterCounts[l] ?? 0;
      const label = esc(`${l} · ${countText(c, k)}`);
      if (!k) return `<span class="off" aria-label="${label}">${esc(l)}</span>`;
      return `<a href="${esc(at({ letter: l }))}" data-link aria-label="${label}"${r.letter === l ? ' aria-current="true"' : ''}>${esc(l)}</a>`;
    }).join('');

  const table = get('ctable');
  if (!res.total) {
    table.innerHTML = noneHTML(c, r, at);
    return res;
  }
  const head = `<div class="chead" aria-hidden="true"><span class="c-n">#</span><span>${esc(tx(c, 'colTable'))}</span><span>${esc(tx(c, 'colDesc'))}</span><span>${esc(tx(c, 'colAreaMod'))}</span><span>${esc(tx(c, 'colKind'))}</span></div>`;
  const rows = res.rows.map((t, i) => rowHTML(c, t, res.start + i + 1, r)).join('');
  table.innerHTML = `<div class="panel">${head}<ul class="rows">${rows}</ul></div>${pager(c, r, res)}${legend(c)}`;
  return res;
}

// long names may wrap only after the namespace (/SCWM/) or, without one, after an underscore; never inside a word
const breakable = (id: string, html: string) => {
  const at = id.startsWith('/') ? /(<[^>]*>)|(?<=[A-Z0-9])\//g : /(<[^>]*>)|(?<=[A-Z0-9])_/g;
  return html.replace(at, (m, tag: string | undefined) => tag ?? `${m}<wbr>`);
};

/** A row: a link to the table's page (so Ctrl+click and "open in new tab" work); a plain click opens the sheet. */
function rowHTML(c: Ctx, t: TableSummary, n: number, r: CatalogRoute): string {
  // the area with the whole SAP component, then what the table holds with its category and delivery class
  const tech = [t.cat, t.dcl].filter(Boolean).join(' · ');
  const techTip = esc([t.cat && catName(c, t.cat), t.dcl && dclName(c, t.dcl)].filter(Boolean).join(' · '));
  // a table known only from SAP's list: no area or contents yet, just its category and delivery class
  const meta = t.x
    ? `<span class="c-ar">${noExpTag(c)}</span><span class="dot" aria-hidden="true">·</span><span class="c-kind"><span class="c-tech mono" title="${techTip}">${esc(tech)}</span></span>`
    : `<span class="c-ar">${areaBadge(c, t.area)}${modTag(c, t, true)}</span><span class="dot" aria-hidden="true">·</span><span class="c-kind">${esc(kindName(c, t.kind))}${tech ? `<span class="c-tech mono" title="${techTip}">${esc(tech)}</span>` : ''}</span>${t.s4 ? `<span class="c-s4"><span class="dot" aria-hidden="true">·</span>${esc(tx(c, 's4only'))}</span>` : ''}`;
  const open = r.open === t.id ? ' aria-current="true"' : '';
  return `<li class="crow${t.x ? ' is-sap' : ''}"><a class="cmain" href="${esc(tableHref(c, t.id))}" data-link data-open="${esc(t.id)}" aria-haspopup="dialog"${open}><span class="c-n">${n}</span><span class="c-id${t.id.length > 10 ? ' long' : ''}">${breakable(t.id, highlight(t.id, r.q))}</span><span class="c-title">${titleHTML(c, t, highlight(loc(c, t.title), r.q))}${s4Badge(c, t)}</span><span class="c-meta">${meta}</span></a>${addButton(c, t.id)}</li>`;
}

/** Nothing matched: the words that found nothing, crossed out, and the ways on. */
function noneHTML(c: Ctx, r: CatalogRoute, at: (o: Partial<CatalogRoute>) => string): string {
  const filtered = !!(r.area || r.cat || r.letter || r.exp);
  const shown = r.q || r.letter || '—';
  const title = r.q ? tx(c, 'none', { q: r.q }) : r.letter ? tx(c, 'noneLetter', { l: r.letter }) : tx(c, 'noneCat');
  const go = (href: string, label: string) => `<a class="go" href="${esc(href)}" data-link><span>${esc(label)}</span>${ic('arrow', 18)}</a>`;
  const ways = [
    r.q ? go(at({ q: '' }), tx(c, 'clearText')) : '',
    filtered ? go(at({ area: '', cat: '', letter: '', exp: false }), tx(c, 'clearFilters')) : '',
    r.q ? go(routeHref({ name: 'search', lang: c.lang, q: r.q, area: '' }), tx(c, 'tryBiz', { q: r.q })) : '',
  ].join('');
  return `<div class="none">
    <p class="none-q" aria-hidden="true">${esc(shown)}</p>
    <h2>${esc(title)}</h2>
    <p class="muted">${esc(tx(c, 'noneHelp'))}</p>
    <div class="ways">${ways}</div>
  </div>`;
}

function pager(c: Ctx, r: CatalogRoute, res: CatalogResult): string {
  if (res.pages < 2) return '';
  const go = (page: number) => esc(routeHref({ ...r, page, open: '' }));
  const prev = res.page > 1
    ? `<a href="${go(res.page - 1)}" data-link>${ic('back', 16)}${esc(tx(c, 'prev'))}</a>`
    : `<span class="off">${ic('back', 16)}${esc(tx(c, 'prev'))}</span>`;
  const next = res.page < res.pages
    ? `<a href="${go(res.page + 1)}" data-link>${esc(tx(c, 'next'))}${ic('chev', 16)}</a>`
    : `<span class="off">${esc(tx(c, 'next'))}${ic('chev', 16)}</span>`;
  const nums = pageList(res.page, res.pages)
    .map((p) =>
      p === '…'
        ? '<span class="gap" aria-hidden="true">…</span>'
        : `<a href="${go(p)}" data-link aria-label="${esc(tx(c, 'pageN', { n: p }))}"${p === res.page ? ' aria-current="page"' : ''}>${p}</a>`,
    )
    .join('');
  const shown = tx(c, 'showing', { a: num(c, res.start + 1), b: num(c, res.start + res.rows.length), n: num(c, res.total) });
  return `<nav class="pager" aria-label="${esc(tx(c, 'pageN', { n: res.page }))}"><span class="muted">${esc(shown)}</span><div class="pg">${prev}${nums}${next}</div></nav>`;
}

function legend(c: Ctx): string {
  const tax = c.data.taxonomy;
  const items = [...Object.entries(tax.categories), ...Object.entries(tax.deliveryClasses)]
    .map(([k, v]) => `<dt class="mono">${esc(k)}</dt><dd>${esc(loc(c, v.help))}</dd>`)
    .join('');
  return `<details class="gl legend"><summary>${esc(tx(c, 'legend'))}${ic('down', 18)}</summary><dl>${items}</dl></details>`;
}

/** Tab-separated text of every matching row, ready to paste into a spreadsheet. */
export function catalogTSV(c: Ctx, rows: TableSummary[]): string {
  const head = ['#', tx(c, 'colTable'), tx(c, 'colDesc'), tx(c, 'colArea'), tx(c, 'colKind'), tx(c, 'colCat'), tx(c, 'colDcl'), tx(c, 'comp'), tx(c, 's4only')];
  const lines = rows.map((t, i) =>
    [i + 1, t.id, loc(c, t.title), areaName(c, t.area), kindName(c, t.kind), orDash(t.cat), orDash(t.dcl), orDash(t.comp), t.s4 ? '✓' : ''].join('\t'),
  );
  return [head.join('\t'), ...lines].join('\n');
}
