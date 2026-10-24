import { loadDetail } from '../lib/data.ts';
import { ic } from '../lib/icons.ts';
import { catalogRoute, routeHref, type TableRoute } from '../lib/router.ts';
import { esc } from '../lib/text.ts';
import type { TableDetail, TableSummary } from '../types.ts';
import { areaBadge, bigAddButton, catName, dclName, kindName, loc, modeSeg, orDash, s4Badge, tableHref, tx, type Ctx } from './common.ts';

const cache = new Map<string, TableDetail | null>();

/** The detail of a table if it is already here; otherwise undefined, and `done` runs when it arrives. */
export function withDetail(id: string, done: (d: TableDetail | null) => void): TableDetail | null | undefined {
  if (cache.has(id)) return cache.get(id);
  loadDetail(id).then(
    (d) => {
      cache.set(id, d);
      done(d);
    },
    () => done(null),
  );
  return undefined;
}

/** One table's page. The summary renders at once; the explanation and relations arrive with its detail file. */
export function renderTable(el: HTMLElement, r: TableRoute, c: Ctx): TableSummary | undefined {
  el.dataset.view = 'table:' + r.id;
  el.className = 'wrap view view-table';
  const t = c.byId.get(r.id);
  const back = `<a class="back" href="${esc(routeHref(catalogRoute(c.lang)))}" data-link data-back>${ic('back', 20)}${esc(tx(c, 'back'))}</a>`;
  if (!t) {
    el.innerHTML = `${back}<div class="panel empty notfound"><strong>${esc(tx(c, 'tableNotFound', { id: r.id }))}</strong><a class="btn primary" href="${esc(routeHref(catalogRoute(c.lang)))}" data-link>${esc(tx(c, 'goCatalog'))}</a></div>`;
    return undefined;
  }
  const paint = (d: TableDetail | null | undefined) => {
    el.innerHTML = back + detailHTML(c, t, d);
  };
  const d = withDetail(t.id, (got) => {
    // the person may have moved on while the detail was loading
    if (el.dataset.view !== 'table:' + r.id) return;
    const y = window.scrollY;
    paint(got);
    window.scrollTo(0, y);
  });
  paint(d);
  return t;
}

/**
 * A table's full reading: name, purpose, fields, technical data, relations and glossary.
 * `d` is undefined while the detail is loading and null when the table has none.
 * `sheet` is set when it is shown in the side sheet over the list: the name is then the dialog's
 * heading, related tables open in the same sheet, and there is a link to the full page.
 */
export function detailHTML(c: Ctx, t: TableSummary, d: TableDetail | null | undefined, sheet?: { relHref: (id: string) => string }): string {
  const tech = c.mode === 'tech';
  const fields = t.f.map((f) => {
    const key = f.startsWith('*');
    const name = key ? f.slice(1) : f;
    return { name, key, def: c.data.fields[name] };
  });
  const keyBadge = `<span class="kb">${ic('key', 13)}${esc(tx(c, 'key'))}</span>`;

  let fieldsHTML: string;
  if (!fields.length) {
    fieldsHTML = `<div class="panel empty"><span class="muted">${esc(tx(c, 'noFields'))}</span></div>`;
  } else if (tech) {
    fieldsHTML =
      `<div class="panel" role="table" aria-label="${esc(tx(c, 'mainFields'))}"><div class="t-head" role="row"><span role="columnheader">${esc(tx(c, 'colField'))}</span><span role="columnheader">${esc(tx(c, 'colType'))}</span><span role="columnheader">${esc(tx(c, 'colMean'))}</span></div>` +
      fields
        .map((f) => `<div class="tf" role="row"><span class="nm" role="cell">${esc(f.name)}${f.key ? keyBadge : ''}</span><span class="ty" role="cell">${esc(f.def?.type ?? '')}</span><span class="mn" role="cell">${esc(loc(c, f.def?.label))}</span></div>`)
        .join('') +
      '</div>';
  } else {
    fieldsHTML =
      '<div class="panel">' +
      fields.map((f) => `<div class="f"><span class="lb">${esc(loc(c, f.def?.label))}${f.key ? keyBadge : ''}</span><span class="nm">${esc(f.name)}</span></div>`).join('') +
      '</div>';
  }

  const purpose =
    d === undefined
      ? `<p class="body muted">${esc(tx(c, 'loading'))}</p>`
      : d?.purpose
        ? `<p class="body">${esc(loc(c, d.purpose))}</p>`
        : `<p class="body muted">${esc(tx(c, 'noPlain'))}</p>`;

  const pk = fields.filter((f) => f.key).map((f) => f.name).join(', ') || '—';
  const meta = tech
    ? `<section class="sec"><h2>${esc(tx(c, 'about'))}</h2><dl class="meta panel">
        <div><dt>${esc(tx(c, 'objType'))}</dt><dd>${t.cat ? `${esc(catName(c, t.cat))} (${esc(t.cat)})` : '—'}</dd></div>
        <div><dt>${esc(tx(c, 'colDcl'))}</dt><dd>${t.dcl ? `${esc(t.dcl)} · ${esc(dclName(c, t.dcl))}` : '—'}</dd></div>
        <div><dt>${esc(tx(c, 'comp'))}</dt><dd>${esc(orDash(t.comp))}</dd></div>
        <div><dt>${esc(tx(c, 'pkey'))}</dt><dd>${esc(pk)}</dd></div>
        <div><dt>${esc(tx(c, 'official'))}</dt><dd class="pend">${esc(tx(c, 'pending'))}</dd></div>
      </dl><p class="fnote">${esc(tx(c, 'verNote'))}</p></section>`
    : '';

  const rels = (d?.rel ?? []).filter((x) => c.byId.has(x.table));
  const related = rels.length
    ? `<section class="sec"><h2>${esc(tx(c, 'related'))}</h2><div class="panel">` +
      rels
        .map((x) => {
          const o = c.byId.get(x.table)!;
          return `<a class="rel" href="${esc(sheet ? sheet.relHref(o.id) : tableHref(c, o.id))}" data-link><span class="tx"><span class="kind">${esc(loc(c, c.data.taxonomy.relationTypes[x.type]))}</span><span class="tt"><span class="rid">${esc(o.id)}</span><span class="rt">${esc(loc(c, o.title))}</span></span>${tech ? `<span class="jn">${esc(tx(c, 'joinBy'))} ${esc(x.on)}</span>` : ''}</span>${ic('chev', 18)}</a>`;
        })
        .join('') +
      '</div></section>'
    : '';

  const glossary = `<section class="sec"><details class="gl"><summary>${esc(tx(c, 'glossary'))}${ic('down', 18)}</summary><dl>${c.data.glossary
    .map((g) => `<dt>${esc(loc(c, g.term))}</dt><dd>${esc(loc(c, g.definition))}</dd>`)
    .join('')}</dl></details></section>`;

  const title = sheet
    ? `<h2 class="d-title" id="sheet-title">${esc(t.id)}</h2>`
    : `<h1 class="d-title" id="dh" tabindex="-1">${esc(t.id)}</h1>`;
  return `
    <div class="d-head">
      <div class="d-tags">${areaBadge(c, t.area)}<span class="tag">${esc(kindName(c, t.kind))}</span>${s4Badge(c, t)}</div>
      ${title}
      <p class="d-sub">${esc(loc(c, t.title))}</p>
    </div>
    <div class="actions">${bigAddButton(c, t.id)}<button type="button" class="btn" data-act="copyname" data-id="${esc(t.id)}">${ic('copy', 18)}${esc(tx(c, 'copyName'))}</button></div>
    <section class="sec"><h2>${esc(tx(c, 'purpose'))}</h2>${purpose}</section>
    <section class="sec"><div class="bar"><h2>${esc(tx(c, 'mainFields'))}</h2>${fields.length ? modeSeg(c) : ''}</div>${fieldsHTML}${fields.length ? `<p class="fnote">${esc(tx(c, 'fieldsNote'))}</p>` : ''}</section>
    ${meta}${related}${glossary}`;
}
