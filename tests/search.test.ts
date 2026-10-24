import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { search } from '../src/lib/search.ts';
import { norm, osa, tokenize } from '../src/lib/text.ts';
import { entries } from './helpers.ts';

const ids = (q: string, lang: 'es' | 'en' | 'pt' = 'es', area = '') => search(entries, q, lang, area).hits.map((h) => h.t.id);

describe('text helpers', () => {
  it('ignores case and accents', () => {
    assert.equal(norm('Facturación'), 'facturacion');
    assert.deepEqual(tokenize('Pedidos de venta (cabecera)'), ['pedidos', 'de', 'venta', 'cabecera']);
  });
  it('counts a swap of neighbouring letters as one edit', () => {
    assert.equal(osa('facutra', 'factura', 2), 1);
    assert.equal(osa('abc', 'abcdef', 1), 2);
  });
});

describe('search', () => {
  it('finds a table by its exact name first', () => {
    assert.equal(ids('vbak')[0], 'VBAK');
    assert.equal(ids('MARA')[0], 'MARA');
  });
  it('understands business words in the interface language', () => {
    // "factura" is first the customer invoice; its items come soon after, among the vendor invoices
    assert.equal(ids('factura')[0], 'VBRK');
    assert.ok(ids('factura').slice(0, 10).includes('VBRP'));
    assert.equal(ids('pedido de venta')[0], 'VBAK');
    assert.equal(ids('cliente')[0], 'KNA1');
    assert.equal(ids('stock')[0], 'MARD');
  });
  it('understands business words in the other languages too', () => {
    assert.equal(ids('invoice', 'es')[0], 'VBRK');
    assert.equal(ids('fornecedor', 'pt')[0], 'LFA1');
  });
  it('tolerates a typo', () => {
    assert.equal(ids('provedor')[0], 'LFA1');
  });
  it('sends a field name to its home table', () => {
    assert.equal(ids('MATNR')[0], 'MARA');
    const hit = search(entries, 'MATNR', 'es').hits.find((h) => h.t.id === 'VBAP');
    assert.deepEqual(hit?.via, { field: 'MATNR' });
  });
  it('says which synonym matched', () => {
    const hit = search(entries, 'cotización', 'es').hits[0];
    assert.equal(hit.t.id, 'VBAK');
    assert.deepEqual(hit.via, { syn: 'cotización' });
  });
  it('limits results to an area', () => {
    assert.ok(ids('', 'es', 'fin').every((id) => entries.find((x) => x.t.id === id)?.t.area === 'fin'));
  });
  it('returns nothing for nonsense and everything for an empty query', () => {
    assert.deepEqual(ids('xyzzy'), []);
    assert.equal(ids('').length, entries.length);
  });
  it('falls back to partial matches when no table has every word', () => {
    const res = search(entries, 'factura xyzzy', 'es');
    assert.equal(res.partial, true);
    assert.equal(res.hits[0].t.id, 'VBRK');
  });
});
