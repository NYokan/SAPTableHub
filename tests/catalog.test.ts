import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { letterOf, PAGE_SIZE, pageList, requestLine, runCatalog, type CatalogQuery } from '../src/lib/catalog.ts';
import { data, entries, sapRows } from './helpers.ts';

const q = (over: Partial<CatalogQuery> = {}): CatalogQuery => ({ q: '', area: '', cat: '', letter: '', sort: 'name', exp: false, page: 1, ...over });

describe('table list', () => {
  it('lists every table alphabetically by name, namespaced ones last', () => {
    const res = runCatalog(entries, q(), 'es');
    assert.equal(res.total, entries.length);
    const names = res.all.map((t) => t.id);
    const ns = (id: string) => (id.startsWith('/') ? 1 : 0);
    assert.deepEqual(names, [...names].sort((a, b) => ns(a) - ns(b) || a.localeCompare(b)));
  });
  it('pages the list', () => {
    const one = runCatalog(entries, q(), 'es');
    assert.equal(one.rows.length, Math.min(PAGE_SIZE, entries.length));
    assert.equal(one.pages, Math.ceil(entries.length / PAGE_SIZE));
    const last = runCatalog(entries, q({ page: 999 }), 'es');
    assert.equal(last.page, last.pages, 'a page past the end shows the last page');
  });
  it('filters by letter and counts every letter', () => {
    const res = runCatalog(entries, q({ letter: 'V' }), 'es');
    assert.ok(res.all.length > 0 && res.all.every((t) => t.id.startsWith('V')));
    assert.equal(res.letterCounts.V, res.total);
    assert.equal(res.letterCounts.Z, undefined);
  });
  it('filters by category, area and text', () => {
    assert.deepEqual(runCatalog(entries, q({ cat: 'CLUSTER', exp: true }), 'es').all.map((t) => t.id), ['BSEC', 'BSED', 'BSEG', 'BSET', 'CDPOS', 'KONV', 'REGUP']);
    assert.deepEqual(runCatalog(entries, q({ cat: 'POOL', exp: true }), 'es').all.map((t) => t.id), ['A004', 'A005']);
    assert.ok(runCatalog(entries, q({ area: 'purch' }), 'es').all.every((t) => t.area === 'purch'));
    // the text filter keeps exactly the tables whose name, title, area, contents or synonyms contain the words
    const hay = new Map(entries.map((x) => [x.t.id, x.hay.es]));
    for (const [word, expected] of [['factura', ['VBRK', 'VBRP']], ['historial', ['CDHDR', 'CDPOS', 'EKBE']]] as const) {
      const found = runCatalog(entries, q({ q: word }), 'es').all.map((t) => t.id);
      for (const id of expected) assert.ok(found.includes(id), `${word} → ${id}`);
      assert.ok(found.every((id) => hay.get(id)!.includes(word)), `${word}: only tables that contain it`);
      assert.equal(found.length, entries.filter((x) => x.hay.es.includes(word)).length, `${word}: every table that contains it`);
    }
  });
  it('sorts by description in the chosen language', () => {
    const titles = runCatalog(entries, q({ sort: 'desc' }), 'pt').all.map((t) => t.title.pt);
    assert.deepEqual(titles, [...titles].sort((a, b) => a.localeCompare(b, 'pt')));
  });
  it('lists namespaced tables after Z when sorting by name', () => {
    const names = runCatalog(entries, q(), 'es').all.map((t) => t.id);
    const first = names.findIndex((id) => id.startsWith('/'));
    assert.ok(first > 0, 'the list does not start with a namespaced table');
    assert.ok(names.slice(first).every((id) => id.startsWith('/')), 'every namespaced table comes after the rest');
    assert.deepEqual(names.slice(0, first), [...names.slice(0, first)].sort((a, b) => a.localeCompare(b)));
  });
  it('puts namespaced tables under "/"', () => {
    assert.equal(letterOf('/SAPAPO/MATKEY'), '/');
    assert.equal(letterOf('t001'), 'T');
    assert.equal(letterOf('1ABC'), '#');
  });
});

describe('page numbers', () => {
  it('shows all pages when there are few', () => {
    assert.deepEqual(pageList(2, 3), [1, 2, 3]);
  });
  it('shortens long ranges around the current page', () => {
    assert.deepEqual(pageList(10, 40), [1, '…', 9, 10, 11, '…', 40]);
    assert.deepEqual(pageList(1, 40), [1, 2, '…', 40]);
  });
});

describe('request line', () => {
  it('puts the name, the description and the SAP module together', () => {
    assert.equal(requestLine('A004', 'Registros de condición: precio por material', 'SD-MD-CM'), 'A004 – Registros de condición: precio por material – SD-MD-CM');
  });
  it('leaves out what a table does not have', () => {
    assert.equal(requestLine('ZTAB', 'Tabla propia'), 'ZTAB – Tabla propia');
    assert.equal(requestLine('ZTAB', '', 'SD'), 'ZTAB – SD');
  });
  it('has a module for every explained table', () => {
    assert.deepEqual(entries.filter((e) => !e.sap && !e.t.comp).map((e) => e.t.id), []);
  });
  it('gives a table of SAP\'s list its name and SAP\'s description', () => {
    const t = entries.find((e) => e.t.id === 'J_1BNFDOC')!.t;
    assert.equal(requestLine(t.id, t.title.es, t.comp), 'J_1BNFDOC – Nota Fiscal Header');
  });
});

describe('tables known only from SAP\'s list', () => {
  it('are listed with the explained ones, and left out with "explained only"', () => {
    const all = runCatalog(entries, q(), 'es');
    const exp = runCatalog(entries, q({ exp: true }), 'es');
    assert.equal(all.total, data.tables.length + sapRows.length);
    assert.equal(exp.total, data.tables.length);
    assert.ok(exp.all.every((t) => !t.x));
    assert.ok(all.all.some((t) => t.id === 'J_1BNFDOC' && t.x));
  });
  it('never repeat an explained table', () => {
    const own = new Set(data.tables.map((t) => t.id));
    assert.deepEqual(sapRows.filter(([id]) => own.has(id)), []);
    assert.equal(new Set(entries.map((e) => e.t.id)).size, entries.length);
  });
  it('have no area, so an area filter keeps only explained tables', () => {
    assert.ok(runCatalog(entries, q({ area: 'sales' }), 'es').all.every((t) => !t.x && t.area === 'sales'));
  });
  it('are filtered by the words of SAP\'s description', () => {
    const found = runCatalog(entries, q({ q: 'nota fiscal' }), 'pt').all.map((t) => t.id);
    assert.ok(found.includes('J_1BNFDOC'));
  });
});
