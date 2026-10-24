import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { letterOf, PAGE_SIZE, pageList, runCatalog, type CatalogQuery } from '../src/lib/catalog.ts';
import { entries } from './helpers.ts';

const q = (over: Partial<CatalogQuery> = {}): CatalogQuery => ({ q: '', area: '', cat: '', letter: '', sort: 'name', page: 1, ...over });

describe('table list', () => {
  it('lists every table alphabetically by name', () => {
    const res = runCatalog(entries, q(), 'es');
    assert.equal(res.total, entries.length);
    const names = res.all.map((t) => t.id);
    assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b)));
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
    assert.deepEqual(runCatalog(entries, q({ cat: 'CLUSTER' }), 'es').all.map((t) => t.id), ['BSEG', 'BSET', 'CDPOS', 'KONV']);
    assert.ok(runCatalog(entries, q({ area: 'purch' }), 'es').all.every((t) => t.area === 'purch'));
    assert.deepEqual(runCatalog(entries, q({ q: 'factura' }), 'es').all.map((t) => t.id), ['VBRK', 'VBRP']);
    assert.deepEqual(runCatalog(entries, q({ q: 'historial' }), 'es').all.map((t) => t.id), ['CDHDR', 'CDPOS', 'EKBE']);
  });
  it('sorts by description in the chosen language', () => {
    const titles = runCatalog(entries, q({ sort: 'desc' }), 'pt').all.map((t) => t.title.pt);
    assert.deepEqual(titles, [...titles].sort((a, b) => a.localeCompare(b, 'pt')));
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
