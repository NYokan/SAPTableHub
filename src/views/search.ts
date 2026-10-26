import { examples } from '../i18n/index.ts';
import { ic } from '../lib/icons.ts';
import { catalogRoute, routeHref, type SearchRoute } from '../lib/router.ts';
import { search, type Hit } from '../lib/search.ts';
import { esc } from '../lib/text.ts';
import { addButton, areaName, chipLink, countText, kindName, loc, modTag, num, tableHref, titleHTML, tx, type Ctx } from './common.ts';

/** Results shown at most: a common word can match thousands of tables of SAP's list. */
const MAX_SHOWN = 100;

/** Search in business language, for people who know what they need but not the table name. */
export function renderSearch(el: HTMLElement, r: SearchRoute, c: Ctx): Hit[] {
  if (el.dataset.view !== 'search') {
    el.dataset.view = 'search';
    el.className = 'wrap view view-search';
    // the search box is created once, so typing is never interrupted by a re-render
    el.innerHTML = `
      <h1 id="sh1" tabindex="-1"></h1>
      <p class="sub" id="ssub"></p>
      <p class="sub2"><a class="linkbtn" id="sall" data-link></a></p>
      <form class="sform" id="sform" role="search" autocomplete="off">
        <span class="si">${ic('search', 20)}</span>
        <label class="vh" for="q" id="qlabel"></label>
        <input id="q" type="search" enterkeyhint="search" autocapitalize="none" autocorrect="off" spellcheck="false">
        <button type="button" class="clear" id="clr" data-act="clear" hidden>${ic('x', 18)}</button>
        <span class="kbd" aria-hidden="true">/</span>
      </form>
      <div class="chips" id="schips" role="group"></div>
      <div class="try" id="stry"></div>
      <div class="bar"><span class="n" id="scount" aria-live="polite"></span></div>
      <div class="results" id="sresults"></div>`;
  }
  const get = (id: string) => el.querySelector<HTMLElement>('#' + id)!;
  get('sh1').textContent = tx(c, 'h1');
  get('ssub').textContent = tx(c, 'sub');
  const all = get('sall') as HTMLAnchorElement;
  all.textContent = tx(c, 'seeAll');
  all.href = routeHref(catalogRoute(c.lang));
  get('qlabel').textContent = tx(c, 'ph');
  const input = get('q') as HTMLInputElement;
  input.placeholder = tx(c, 'ph');
  if (document.activeElement !== input && input.value !== r.q) input.value = r.q;
  const clear = get('clr');
  clear.hidden = !r.q;
  clear.setAttribute('aria-label', tx(c, 'clear'));

  const at = (over: Partial<SearchRoute>) => routeHref({ ...r, ...over });
  get('schips').innerHTML =
    chipLink(at({ area: '' }), tx(c, 'all'), !r.area) +
    Object.keys(c.data.taxonomy.areas).map((k) => chipLink(at({ area: k }), areaName(c, k), r.area === k)).join('');

  const tryEl = get('stry');
  tryEl.hidden = !!r.q;
  tryEl.innerHTML = r.q
    ? ''
    : `<span>${esc(tx(c, 'tryl'))}:</span>` +
      examples(c.lang).map((x) => `<a href="${esc(at({ q: x }))}" data-link>${esc(x)}</a>`).join('');

  const res = search(c.entries, r.q, c.lang, r.area);
  get('scount').textContent = countText(c, res.hits.length);
  const box = get('sresults');
  if (!res.hits.length) {
    box.innerHTML = `<div class="empty"><strong>${esc(tx(c, 'none', { q: r.q }))}</strong><span class="muted">${esc(tx(c, 'noneHelp'))}</span></div>`;
    return res.hits;
  }
  const note = res.partial ? `<div class="empty muted partial">${esc(tx(c, 'partial'))}</div>` : '';
  const more = res.hits.length > MAX_SHOWN ? `<div class="empty muted partial">${esc(tx(c, 'moreHits', { n: num(c, MAX_SHOWN) }))}</div>` : '';
  box.innerHTML = `${note}<ul class="rows" id="rows">${res.hits.slice(0, MAX_SHOWN).map((h) => rowHTML(c, h)).join('')}</ul>${more}`;
  return res.hits;
}

function rowHTML(c: Ctx, h: Hit): string {
  const t = h.t;
  let hint = '';
  if (h.via && 'syn' in h.via) hint = `<span class="hint">${esc(tx(c, 'via'))} «${esc(h.via.syn)}»</span>`;
  else if (h.via && 'field' in h.via) {
    const f = c.data.fields[h.via.field];
    hint = `<span class="hint">${esc(tx(c, 'hasField'))} <span class="mono">${esc(h.via.field)}</span>${f ? ' · ' + esc(loc(c, f.label)) : ''}</span>`;
  } else if (h.via && 'comp' in h.via) hint = `<span class="hint">${esc(tx(c, 'inComp'))} <span class="mono">${esc(h.via.comp)}</span></span>`;
  const meta = t.x
    ? `<span class="mono">${esc([t.cat, t.dcl].filter(Boolean).join(' · '))}</span>`
    : `<span>${esc(kindName(c, t.kind))}</span><span aria-hidden="true">·</span><span>${esc(areaName(c, t.area))}</span>${modTag(c, t)}`;
  return `<li class="row"><a class="r-main" href="${esc(tableHref(c, t.id))}" data-link><span class="r-line"><span class="r-id big">${esc(t.id)}</span><span class="r-title dim">${titleHTML(c, t)}</span></span><span class="r-meta">${meta}</span>${hint}</a>${addButton(c, t.id)}</li>`;
}
