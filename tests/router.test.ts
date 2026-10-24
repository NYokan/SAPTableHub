import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { catalogRoute, parseRoute, routeHref, withLang, type Route } from '../src/lib/router.ts';

const parse = (href: string) => {
  const u = new URL(href, 'https://example.org');
  return parseRoute(u.pathname, u.search);
};

describe('router', () => {
  it('leaves the language choice to the caller on "/"', () => {
    assert.equal(parse('/'), null);
  });
  it('opens the table list for a language', () => {
    assert.deepEqual(parse('/pt/'), catalogRoute('pt'));
  });
  it('reads the list filters from the address', () => {
    assert.deepEqual(parse('/es/?letter=v&page=2&cat=cluster&sort=desc&q=factura'), catalogRoute('es', { letter: 'V', page: 2, cat: 'CLUSTER', sort: 'desc', q: 'factura' }));
    assert.equal((parse('/es/?page=abc') as { page: number }).page, 1);
  });
  it('round-trips every kind of page', () => {
    const routes: Route[] = [
      catalogRoute('es'),
      catalogRoute('en', { letter: '/', area: 'fin', page: 3, q: 'pedido de venta' }),
      { name: 'search', lang: 'es', q: 'factura cliente', area: 'sales' },
      { name: 'table', lang: 'en', id: 'VBAK' },
      { name: 'table', lang: 'es', id: '/SAPAPO/MATKEY' },
      { name: 'selection', lang: 'pt', shared: null },
      { name: 'selection', lang: 'es', shared: ['VBAK', 'VBAP'] },
    ];
    for (const r of routes) assert.deepEqual(parse(routeHref(r)), r, routeHref(r));
  });
  it('remembers the table open in the side sheet', () => {
    assert.equal((parse('/es/?open=vbak') as { open: string }).open, 'VBAK');
    for (const r of [catalogRoute('es', { open: 'MARA' }), catalogRoute('pt', { area: 'sales', page: 2, q: 'pedido', open: '/SAPAPO/MATKEY' })]) {
      assert.deepEqual(parse(routeHref(r)), r, routeHref(r));
    }
  });
  it('keeps the page when switching language', () => {
    assert.equal(routeHref(withLang({ name: 'table', lang: 'es', id: 'MARA' }, 'pt')), '/pt/table/MARA');
  });
  it('reports unknown pages', () => {
    assert.equal(parse('/es/nope')?.name, 'notfound');
    assert.equal(parse('/fr/')?.name, 'notfound');
  });
});
