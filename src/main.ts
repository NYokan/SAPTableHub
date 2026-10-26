import '@fontsource/instrument-sans/latin-400.css';
import '@fontsource/instrument-sans/latin-400-italic.css';
import '@fontsource/instrument-sans/latin-500.css';
import '@fontsource/instrument-sans/latin-600.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import '@fontsource/jetbrains-mono/latin-600.css';
import './styles/app.css';
import { t, type StrKey } from './i18n/index.ts';
import { byName, runCatalog } from './lib/catalog.ts';
import { loadIndex, loadSap } from './lib/data.ts';
import { ic } from './lib/icons.ts';
import { catalogRoute, isLang, parseRoute, routeHref, withLang, type Route } from './lib/router.ts';
import { sapSummaries } from './lib/sap.ts';
import { buildEntries, sapEntries } from './lib/search.ts';
import { KEYS, load, save } from './lib/store.ts';
import type { Lang, TableSummary } from './types.ts';
import { catalogTSV, renderCatalog } from './views/catalog.ts';
import { bigAddLabel, tableHref, type Ctx } from './views/common.ts';
import { renderSearch } from './views/search.ts';
import { renderSelection, selectionText, setFormat, sharedIds, type Format } from './views/selection.ts';
import { createSheet } from './views/sheet.ts';
import { detailHTML, renderTable, withDetail } from './views/table.ts';

const $ = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const view = $('#view');
const narrowScreen = window.matchMedia('(max-width:479px)');

let ctx: Ctx | null = null;
let route: Route;

function detectLang(): Lang {
  const saved = load(KEYS.lang);
  if (saved && isLang(saved)) return saved;
  for (const l of navigator.languages ?? [navigator.language]) {
    const code = (l || '').slice(0, 2).toLowerCase();
    if (isLang(code)) return code;
  }
  return 'es';
}

const currentRoute = (): Route => parseRoute(location.pathname, location.search) ?? catalogRoute(detectLang());

function readSelection(byId: Map<string, TableSummary>): string[] {
  try {
    const v: unknown = JSON.parse(load(KEYS.selection) ?? '[]');
    return Array.isArray(v) ? v.filter((id): id is string => typeof id === 'string' && byId.has(id)) : [];
  } catch {
    return [];
  }
}

/* ---------- shell: header, bottom bar, footer ---------- */

const LANG_NAMES: Record<Lang, string> = { es: 'Español', en: 'English', pt: 'Português' };

function paintLangOptions() {
  for (const o of $<HTMLSelectElement>('#lang').options) {
    const code = o.value as Lang;
    o.textContent = narrowScreen.matches ? code.toUpperCase() : `${code.toUpperCase()} · ${LANG_NAMES[code]}`;
  }
}

function paintThemeButton() {
  const cur = document.documentElement.getAttribute('data-theme');
  const dark = cur === 'dark' || (!cur && window.matchMedia('(prefers-color-scheme: dark)').matches);
  $('#themebtn').innerHTML = ic(dark ? 'sun' : 'moon', 20);
}

function paintShell(lang: Lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll<HTMLElement>('[data-i]').forEach((e) => {
    e.textContent = t(lang, e.dataset.i as StrKey);
  });
  document.querySelectorAll<HTMLElement>('[data-al]').forEach((e) => {
    e.setAttribute('aria-label', t(lang, e.dataset.al as StrKey));
  });
  const hrefs: Record<string, string> = {
    catalog: routeHref(catalogRoute(lang)),
    search: routeHref({ name: 'search', lang, q: '', area: '' }),
    selection: routeHref({ name: 'selection', lang, shared: null }),
  };
  const section = route.name === 'search' ? 'search' : route.name === 'selection' ? 'selection' : 'catalog';
  document.querySelectorAll<HTMLAnchorElement>('a[data-nav]').forEach((a) => {
    a.href = hrefs[a.dataset.nav!];
    if (a.classList.contains('brand')) return;
    if (a.dataset.nav === section) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  $<HTMLSelectElement>('#lang').value = lang;
  paintLangOptions();
  paintThemeButton();
  updateCounts();
}

function updateCounts() {
  const n = ctx?.selection.length ?? 0;
  for (const sel of ['#cnt-h', '#cnt-n']) {
    const e = $(sel);
    e.textContent = String(n);
    e.classList.toggle('zero', n === 0);
  }
}

/** Refresh every "+" button after the selection changes, without re-rendering the page. */
function updateAddButtons() {
  if (!ctx) return;
  const c = ctx;
  document.querySelectorAll<HTMLElement>('[data-act="add"]').forEach((b) => {
    const on = c.selection.includes(b.dataset.id!);
    b.setAttribute('aria-pressed', String(on));
    b.innerHTML = b.dataset.big ? bigAddLabel(c, on) : ic(on ? 'check' : 'plus');
  });
}

/* ---------- rendering and navigation ---------- */

function render() {
  paintShell(route.lang);
  if (!ctx) return;
  ctx.lang = route.lang;
  let title: string;
  switch (route.name) {
    case 'catalog': {
      renderCatalog(view, route, ctx);
      const open = ctx.byId.get(route.open);
      title = open ? `${open.id} · ${open.title[route.lang]}` : t(route.lang, 'catTitle') + (route.letter ? ' · ' + route.letter : '');
      break;
    }
    case 'search':
      renderSearch(view, route, ctx);
      title = t(route.lang, 'navSearch') + (route.q ? ': ' + route.q : '');
      break;
    case 'table': {
      const found = renderTable(view, route, ctx);
      title = found ? `${found.id} · ${found.title[route.lang]}` : route.id;
      break;
    }
    case 'selection':
      renderSelection(view, route, ctx);
      title = t(route.lang, route.shared ? 'shared' : 'mySelection');
      break;
    case 'notfound':
      view.dataset.view = 'notfound';
      view.className = 'wrap view view-notfound';
      view.innerHTML = `<div class="panel empty notfound"><strong>${t(route.lang, 'notFound')}</strong><a class="btn primary" href="${routeHref(catalogRoute(route.lang))}" data-link>${t(route.lang, 'goCatalog')}</a></div>`;
      title = t(route.lang, 'notFound');
      break;
  }
  document.title = `${title} · SAPTableHub`;
  syncSheet();
}

/* ---------- the ficha in a side sheet over the list ---------- */

/** The row that opened the sheet, so focus can go back to it when the sheet closes. */
let sheetFrom = '';

const sheet = createSheet(() => closeSheet());

function closeSheet() {
  if (route.name !== 'catalog' || !route.open) return;
  // opened from the list: going back closes it and leaves no extra step in the history
  if (history.state?.sheet) history.back();
  else navigate(routeHref({ ...route, open: '' }), true);
}

function openSheet(id: string) {
  if (route.name !== 'catalog') return;
  const replace = !!route.open;
  navigate(routeHref({ ...route, open: id }), replace);
  if (!replace) history.replaceState({ ...(history.state ?? {}), sheet: true }, '');
}

/** Shows the table named in ?open= in the sheet, or closes the sheet when there is none. */
function syncSheet() {
  const c = ctx;
  const id = c && route.name === 'catalog' ? route.open : '';
  const tb = id ? c?.byId.get(id) : undefined;
  if (!c || !tb || route.name !== 'catalog') {
    if (sheet.isOpen()) {
      sheet.hide();
      const back = sheetFrom && route.name === 'catalog' ? view.querySelector<HTMLElement>(`.cmain[data-open="${CSS.escape(sheetFrom)}"]`) : null;
      back?.focus();
    }
    return;
  }
  if (!sheet.isOpen()) sheetFrom = id;
  const r = route;
  const paint = (d: Parameters<typeof detailHTML>[2]) =>
    sheet.show(id, detailHTML(c, tb, d, { relHref: (other) => routeHref({ ...r, open: other }) }), {
      full: t(c.lang, 'openFull'),
      fullHref: tableHref(c, id),
      close: t(c.lang, 'closeSheet'),
    });
  paint(tb.x ? null : withDetail(id, (d) => {
    if (sheet.id() === id) paint(d);
  }));
}

/** Moves to another page of the site. `replace` is for changes that should not add a Back step, like typing in a filter. */
function navigate(href: string, replace = false) {
  const url = new URL(href, location.href);
  const path = url.pathname + url.search;
  const prev = route;
  const before = route.name;
  if (replace) {
    history.replaceState(history.state, '', path);
  } else {
    history.replaceState({ ...(history.state ?? {}), y: window.scrollY }, '');
    history.pushState({ internal: true, y: 0 }, '', path);
  }
  route = currentRoute();
  render();
  if (replace) return;
  // only the sheet changed: the list stays where it is
  if (prev.name === 'catalog' && route.name === 'catalog' && routeHref({ ...prev, open: '' }) === routeHref({ ...route, open: '' })) return;
  if (before === 'catalog' && route.name === 'catalog') {
    // letter, page or filter changed: keep the start of the list in view
    const table = document.getElementById('ctable');
    const bar = document.getElementById('az');
    if (table) {
      const top = table.getBoundingClientRect().top + window.scrollY - (bar?.offsetHeight ?? 0) - 76;
      if (window.scrollY > top) window.scrollTo(0, Math.max(0, top));
    }
  } else {
    window.scrollTo(0, 0);
    view.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
  }
}

window.addEventListener('popstate', (e) => {
  route = currentRoute();
  render();
  const y = typeof e.state?.y === 'number' ? e.state.y : 0;
  requestAnimationFrame(() => window.scrollTo(0, y));
});

/* ---------- actions ---------- */

let toastTimer = 0;
function toast(msg: string) {
  const e = $('#toast');
  e.textContent = msg;
  e.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => e.classList.remove('on'), 2200);
}

function copy(text: string) {
  const lang = route.lang;
  const done = (ok: boolean) => toast(t(lang, ok ? 'copied' : 'copyFail'));
  const fallback = () => {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      done(ok);
    } catch {
      done(false);
    }
  };
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => done(true), fallback);
  else fallback();
}

function saveSelection() {
  if (!ctx) return;
  save(KEYS.selection, JSON.stringify(ctx.selection));
  updateCounts();
}

function toggleTheme() {
  const root = document.documentElement;
  const cur = root.getAttribute('data-theme');
  const dark = cur === 'dark' || (!cur && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const next = dark ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  save(KEYS.theme, next);
  paintThemeButton();
}

document.addEventListener('click', (e) => {
  const target = e.target as Element;
  // a click anywhere else closes the Filtros popover
  document.querySelectorAll<HTMLDetailsElement>('details.pop[open]').forEach((d) => {
    if (!d.contains(target)) d.open = false;
  });
  const a = target.closest<HTMLAnchorElement>('a[data-link]');
  if (a) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.dataset.open && route.name === 'catalog') {
      // a row opens its ficha over the list; Ctrl+click still opens the full page
      e.preventDefault();
      openSheet(a.dataset.open);
      return;
    }
    if (a.target === '_blank' || a.origin !== location.origin) return;
    e.preventDefault();
    if (a.hasAttribute('data-back') && history.state?.internal) history.back();
    else navigate(a.pathname + a.search);
    return;
  }
  const b = target.closest<HTMLElement>('[data-act]');
  if (!b) return;
  if (b.dataset.act === 'theme') return toggleTheme();
  if (!ctx) return;
  const c = ctx;
  const id = b.dataset.id ?? '';
  const v = b.dataset.v ?? '';
  switch (b.dataset.act) {
    case 'add': {
      const i = c.selection.indexOf(id);
      if (i >= 0) c.selection.splice(i, 1);
      else c.selection.push(id);
      saveSelection();
      updateAddButtons();
      break;
    }
    case 'rm':
      c.selection = c.selection.filter((x) => x !== id);
      saveSelection();
      render();
      break;
    case 'fmt':
      setFormat(v as Format);
      render();
      break;
    case 'clear':
      if (route.name === 'search') navigate(routeHref({ ...route, q: '' }), true);
      document.getElementById('q')?.focus();
      break;
    case 'copyname':
      copy(id);
      break;
    case 'copylist':
      copy(selectionText(c, route.name === 'selection' && route.shared ? sharedIds(c, route) : c.selection));
      break;
    case 'copylink':
      copy(location.origin + routeHref({ name: 'selection', lang: c.lang, shared: c.selection }));
      break;
    case 'copyview':
      if (route.name === 'catalog') copy(catalogTSV(c, runCatalog(c.entries, route, c.lang).all));
      break;
    case 'saveshared':
      if (route.name === 'selection') {
        for (const x of sharedIds(c, route)) if (!c.selection.includes(x)) c.selection.push(x);
        saveSelection();
        toast(t(c.lang, 'savedShared'));
        navigate(routeHref({ name: 'selection', lang: c.lang, shared: null }));
      }
      break;
  }
});

document.addEventListener('input', (e) => {
  const el = e.target as HTMLInputElement;
  if (el.id === 'cq' && route.name === 'catalog') navigate(routeHref({ ...route, q: el.value, page: 1 }), true);
  else if (el.id === 'q' && route.name === 'search') navigate(routeHref({ ...route, q: el.value }), true);
});

document.addEventListener('change', (e) => {
  const el = e.target as HTMLSelectElement;
  if (el.id === 'ccat' && route.name === 'catalog') {
    navigate(routeHref({ ...route, cat: el.value, page: 1 }));
  } else if (el.id === 'lang' && isLang(el.value)) {
    save(KEYS.lang, el.value);
    navigate(routeHref(withLang(route, el.value)), true);
  }
});

document.addEventListener('submit', (e) => {
  const form = e.target as HTMLFormElement;
  e.preventDefault();
  if (form.id === 'sform') {
    const first = view.querySelector<HTMLAnchorElement>('#rows .r-main');
    if (first) navigate(first.pathname);
  } else {
    // the list filters as you type; Enter only closes the phone keyboard
    (document.activeElement as HTMLElement | null)?.blur();
  }
});

document.addEventListener('keydown', (e) => {
  // the sheet handles its own keys
  if (sheet.isOpen()) return;
  const pop = document.querySelector<HTMLDetailsElement>('details.pop[open]');
  if (e.key === 'Escape' && pop) {
    e.preventDefault();
    pop.open = false;
    pop.querySelector<HTMLElement>('summary')?.focus();
    return;
  }
  const tag = (e.target as HTMLElement).tagName;
  const typing = tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';
  if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault();
    const box = document.querySelector<HTMLInputElement>('#cq, #q');
    if (box) box.focus();
    else {
      navigate(routeHref({ name: 'search', lang: route.lang, q: '', area: '' }));
      document.getElementById('q')?.focus();
    }
    return;
  }
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    const items = [...view.querySelectorAll<HTMLElement>('.r-main, .cmain')];
    if (!items.length) return;
    const el = e.target as HTMLElement;
    if ((el.id === 'q' || el.id === 'cq') && e.key === 'ArrowDown') {
      e.preventDefault();
      items[0].focus();
      return;
    }
    const i = items.indexOf(el);
    if (i < 0) return;
    e.preventDefault();
    if (e.key === 'ArrowDown') (items[i + 1] ?? items[i]).focus();
    else if (i === 0) document.querySelector<HTMLInputElement>('#q, #cq')?.focus();
    else items[i - 1].focus();
  }
});

// keep the selection in step when it changes in another tab
window.addEventListener('storage', (e) => {
  if (e.key !== KEYS.selection || !ctx) return;
  ctx.selection = readSelection(ctx.byId);
  updateCounts();
  if (route.name === 'selection') render();
  else updateAddButtons();
});

narrowScreen.addEventListener('change', paintLangOptions);

/* ---------- start ---------- */

$('#ic-sel-h').innerHTML = ic('sel', 18);
$('#ic-nav-c').innerHTML = ic('table', 22);
$('#ic-nav-s').innerHTML = ic('search', 22);
$('#ic-nav-l').innerHTML = ic('sel', 22);
history.scrollRestoration = 'manual';
if (!parseRoute(location.pathname, location.search)) history.replaceState(history.state, '', `/${detectLang()}/`);
route = currentRoute();
paintShell(route.lang);

// both files are requested at once; SAP's list is the larger one and is cached on its own
Promise.all([loadIndex(), loadSap()])
  .then(([data, rows]) => {
    const sap = sapSummaries(rows);
    const entries = [...buildEntries(data), ...sapEntries(sap, data.tables.length)].sort((a, b) => byName(a.t, b.t));
    const byId = new Map(entries.map((x) => [x.t.id, x.t]));
    ctx = {
      lang: route.lang,
      data,
      entries,
      byId,
      selection: readSelection(byId),
    };
    render();
  })
  .catch(() => {
    view.innerHTML = `<div class="panel empty notfound"><strong>${t(route.lang, 'loadError')}</strong></div>`;
  });
