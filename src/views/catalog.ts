import { ic } from '../lib/icons.ts';
import { LETTERS, pageList, runCatalog, type CatalogResult } from '../lib/catalog.ts';
import { routeHref, type CatalogRoute } from '../lib/router.ts';
import { esc } from '../lib/text.ts';
import type { TableSummary } from '../types.ts';
import { addButton, areaName, chipLink, countText, dclName, kindName, loc, modeSeg, segLink, tableHref, tx, type Ctx } from './common.ts';

/** The table list: the improved version of an A–Z index of SAP tables. */
export function renderCatalog(el: HTMLElement, r: CatalogRoute, c: Ctx): CatalogResult {
  if (el.dataset.view !== 'catalog') {
    el.dataset.view = 'catalog';
    el.className = 'wrap view view-catalog';
    // the filter box is created once, so typing is never interrupted by a re-render
    el.innerHTML = `
      <div class="c-head"><h1 id="ctitle" tabindex="-1"></h1></div>
      <p class="c-intro" id="cintro"></p>
      <div class="c-ctl">
        <form class="cfilter" id="cform" role="search"><span class="si">${ic('search', 18)}</span><label class="vh" for="cq" id="cqlabel"></label><input id="cq" type="search" autocomplete="off" autocapitalize="none" spellcheck="false" enterkeyhint="search"></form>
        <div class="chips" id="cchips" role="group"></div>
        <div class="c-row2" id="crow"></div>
      </div>
      <nav class="az" id="az"></nav>
      <div class="cwrap" id="ctable"></div>`;
  }
  const get = (id: string) => el.querySelector<HTMLElement>('#' + id)!;
  const res = runCatalog(c.entries, r, c.lang);
  const at = (over: Partial<CatalogRoute>) => routeHref({ ...r, page: 1, ...over });
  const tech = c.mode === 'tech';

  get('ctitle').textContent = tx(c, 'catTitle') + (r.letter ? ' · ' + r.letter : '');
  get('cintro').textContent = tx(c, 'catIntro');
  get('cqlabel').textContent = tx(c, 'cfilter');
  const input = get('cq') as HTMLInputElement;
  input.placeholder = tx(c, 'cfilter');
  if (document.activeElement !== input && input.value !== r.q) input.value = r.q;

  get('cchips').innerHTML =
    chipLink(at({ area: '' }), tx(c, 'all'), !r.area) +
    Object.keys(c.data.taxonomy.areas).map((k) => chipLink(at({ area: k }), areaName(c, k), r.area === k)).join('');

  const cats = Object.keys(c.data.taxonomy.categories)
    .map((k) => `<option value="${esc(k)}"${r.cat === k ? ' selected' : ''}>${esc(k)}</option>`)
    .join('');
  get('crow').innerHTML = `
    <div class="grp"><span class="lbl">${esc(tx(c, 'sortBy'))}</span><div class="seg" role="group" aria-label="${esc(tx(c, 'sortBy'))}">${segLink(at({ sort: 'name' }), tx(c, 'sortName'), r.sort === 'name')}${segLink(at({ sort: 'desc' }), tx(c, 'sortDesc'), r.sort === 'desc')}</div></div>
    <div class="grp"><label class="lbl" for="ccat">${esc(tx(c, 'colCat'))}</label><span class="sel"><select id="ccat"><option value="">${esc(tx(c, 'allCats'))}</option>${cats}</select></span></div>
    <div class="grp">${modeSeg(c)}</div>
    <div class="grp"><span class="ccount" aria-live="polite">${esc(countText(c, res.total))}</span><button type="button" class="btn ghost" data-act="copyview">${ic('copy', 18)}${esc(tx(c, 'copyView'))}</button></div>`;

  const az = get('az');
  az.setAttribute('aria-label', tx(c, 'letters'));
  az.innerHTML =
    `<a href="${esc(at({ letter: '' }))}" data-link${!r.letter ? ' aria-current="true"' : ''}>${esc(tx(c, 'all'))}</a>` +
    LETTERS.map((l) => {
      const n = res.letterCounts[l] ?? 0;
      const label = esc(`${l} · ${countText(c, n)}`);
      if (!n) return `<span class="off" aria-label="${label}">${esc(l)}</span>`;
      return `<a href="${esc(at({ letter: l }))}" data-link aria-label="${label}"${r.letter === l ? ' aria-current="true"' : ''}>${esc(l)}</a>`;
    }).join('');

  const table = get('ctable');
  if (!res.total) {
    table.innerHTML = `<div class="panel empty"><strong>${esc(tx(c, 'noneCat'))}</strong></div>`;
    return res;
  }
  const head = `<div class="chead" aria-hidden="true"><span class="c-n">#</span><span>${esc(tx(c, 'colTable'))}</span><span>${esc(tx(c, 'colDesc'))}</span><span>${esc(tx(c, tech ? 'colCat' : 'colArea'))}</span><span>${esc(tx(c, tech ? 'colDcl' : 'colKind'))}</span></div>`;
  const rows = res.rows.map((t, i) => rowHTML(c, t, res.start + i + 1)).join('');
  table.innerHTML = `<div class="panel">${head}<ul class="rows">${rows}</ul></div>${pager(c, r, res)}${tech ? legend(c) : ''}`;
  return res;
}

function rowHTML(c: Ctx, t: TableSummary, n: number): string {
  const meta =
    c.mode === 'tech'
      ? `<span class="mono">${esc(t.cat)}</span><span class="dot" aria-hidden="true">·</span><span><span class="mono">${esc(t.dcl)}</span> ${esc(dclName(c, t.dcl))}</span>`
      : `<span>${esc(areaName(c, t.area))}</span><span class="dot" aria-hidden="true">·</span><span>${esc(kindName(c, t.kind))}</span>`;
  return `<li class="crow"><a class="cmain" href="${esc(tableHref(c, t.id))}" data-link><span class="c-n">${n}</span><span class="c-id">${esc(t.id)}</span><span class="c-title">${esc(loc(c, t.title))}</span><span class="c-meta">${meta}</span></a>${addButton(c, t.id)}</li>`;
}

function pager(c: Ctx, r: CatalogRoute, res: CatalogResult): string {
  if (res.pages < 2) return '';
  const go = (page: number) => esc(routeHref({ ...r, page }));
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
  const shown = tx(c, 'showing', { a: res.start + 1, b: res.start + res.rows.length, n: res.total });
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
  const head = ['#', tx(c, 'colTable'), tx(c, 'colDesc'), tx(c, 'colArea'), tx(c, 'colKind'), tx(c, 'colCat'), tx(c, 'colDcl')];
  const lines = rows.map((t, i) => [i + 1, t.id, loc(c, t.title), areaName(c, t.area), kindName(c, t.kind), t.cat, t.dcl].join('\t'));
  return [head.join('\t'), ...lines].join('\n');
}
