import assert from 'node:assert/strict';
import path from 'node:path';
import { describe, it } from 'node:test';
import { compile, loadContent, shardOf as buildShard, validate, type Content } from '../scripts/lib/content.mjs';
import { parseField } from '../src/lib/fields.ts';
import { shardOf as siteShard } from '../src/lib/shard.ts';
import en from '../src/i18n/en.json' with { type: 'json' };
import es from '../src/i18n/es.json' with { type: 'json' };
import pt from '../src/i18n/pt.json' with { type: 'json' };

const content = loadContent(path.join(import.meta.dirname, '..', 'content'));
const clone = (): Content => structuredClone(content);

describe('content', () => {
  it('has no problems', () => {
    assert.deepEqual(validate(content), []);
  });
  it('reports a missing translation', () => {
    const c = clone();
    delete c.tables[0].data.title.pt;
    assert.match(validate(c).join('\n'), /"title" necesita texto en es, en y pt/);
  });
  it('reports a field that is not in the dictionary', () => {
    const c = clone();
    const t = c.tables.find((x) => x.data.fields)!;
    t.data.fields.push({ name: 'NOPE' });
    assert.match(validate(c).join('\n'), /el campo NOPE no está en fields.json/);
  });
  it('reports a relation to a table that does not exist', () => {
    const c = clone();
    const t = c.tables.find((x) => x.data.relations)!;
    t.data.relations.push({ table: 'ZZZZ', type: 'rel', on: 'X' });
    assert.match(validate(c).join('\n'), /relación con una tabla que no existe: ZZZZ/);
  });
  it('reports an unknown area or category', () => {
    const c = clone();
    c.tables[0].data.area = 'hr';
    c.tables[1].data.category = 'VIEW';
    const errors = validate(c).join('\n');
    assert.match(errors, /área desconocida "hr"/);
    assert.match(errors, /categoría desconocida "VIEW"/);
  });
  it('keeps a field type that differs in one table, and reads it back in the site', () => {
    const c = clone();
    const t = c.tables.find((x) => x.data.fields)!;
    t.data.fields[t.data.fields.length - 1].type = 'CHAR 40';
    assert.deepEqual(validate(c), []);
    const entry = compile(c).index.tables.find((x) => x.id === t.data.id)!.f.at(-1)!;
    assert.deepEqual(parseField(entry), { name: t.data.fields.at(-1).name, key: false, type: 'CHAR 40' });
    t.data.fields[0].type = 'texto';
    assert.match(validate(c).join('\n'), /debe tener la forma "CHAR 40"/);
  });
  it('compiles every table into exactly one detail group', () => {
    const { index, details } = compile(content);
    const grouped = Object.values(details).flatMap((g) => Object.keys(g));
    assert.equal(new Set(grouped).size, grouped.length, 'no table twice');
    const set = new Set(grouped);
    assert.ok(index.tables.every((t) => set.has(t.id)), 'every explained table has its detail');
  });
  it('groups details the same way when building and in the site', () => {
    for (const id of ['VBAK', 'T001', 'A', '/SAPAPO/X', 'mara']) assert.equal(siteShard(id), buildShard(id), id);
  });
});

describe('interface text', () => {
  it('has the same keys in every language', () => {
    const keys = Object.keys(es).sort();
    assert.deepEqual(Object.keys(en).sort(), keys);
    assert.deepEqual(Object.keys(pt).sort(), keys);
  });
  it('has no empty strings', () => {
    for (const [lang, strings] of Object.entries({ es, en, pt })) {
      for (const [k, v] of Object.entries(strings)) {
        if (typeof v === 'string') assert.ok(v.trim(), `${lang}.${k} is empty`);
      }
    }
  });
});

describe('SAP\'s table list', () => {
  const withRow = (cols: string[]) => {
    const c = clone();
    c.sap.rows.push({ line: 99999, cols });
    return validate(c).join('\n');
  };
  it('reports a bad line', () => {
    assert.match(withRow(['ZTAB', 'VIEW', 'A', 'Something']), /línea 99999: ZTAB: categoría desconocida "VIEW"/);
    assert.match(withRow(['ZTAB', 'TRANSP', 'Q', 'Something']), /clase de entrega desconocida "Q"/);
    assert.match(withRow(['ZTAB', 'TRANSP', 'A']), /debe tener 4 columnas/);
    assert.match(withRow(['ZTAB', 'TRANSP', 'A', ' ']), /falta la descripción/);
    assert.match(withRow([content.sap.rows[0].cols[0], 'TRANSP', 'A', 'x']), /está repetida/);
  });
  it('leaves explained tables out of the list and gives them SAP\'s short description', () => {
    const { index, details, sap } = compile(content);
    const own = new Set(index.tables.map((t) => t.id));
    assert.ok(sap.length > 0 && sap.every(([id]) => !own.has(id)));
    assert.equal((details[buildShard('VBAK')].VBAK as { sd?: string }).sd, content.sap.rows.find((r) => r.cols[0] === 'VBAK')!.cols[3]);
  });
});

describe('SAP\'s fields', () => {
  const withField = (cols: string[]) => {
    const c = clone();
    c.sapFields.rows.push({ line: 99999, cols });
    return validate(c).join('\n');
  };
  const listed = () => content.sap.rows.find((r) => !content.tables.some((t) => t.data.id === r.cols[0]))!.cols[0];
  it('reports a bad line', () => {
    assert.match(withField(['NOPE_TABLE', 'X1', '', 'CHAR 4', 'x', '']), /NOPE_TABLE no está en sap-tables.tsv/);
    assert.match(withField([listed(), 'Z1', 'Y', 'CHAR 4', 'x', '']), /"key" debe ser X o quedar vacío/);
    assert.match(withField([listed(), 'Z1', '', 'texto', 'x', '']), /el tipo debe tener la forma "CHAR 40"/);
    assert.match(withField([listed(), 'Z1', '', 'CHAR 4']), /debe tener 6 columnas/);
    const c = clone();
    const row = { line: 99999, cols: [listed(), 'Z1', '', 'CHAR 4', 'x', ''] };
    c.sapFields.rows.push(row, { ...row, line: 100000 });
    assert.match(validate(c).join('\n'), /el campo Z1 está repetido/);
  });
  it('gives a table of SAP\'s list its fields and the listed tables that check them', () => {
    const c = clone();
    const [a, b] = content.sap.rows.filter((r) => !content.tables.some((t) => t.data.id === r.cols[0])).map((r) => r.cols[0]);
    c.sapFields.rows = [
      { line: 2, cols: [a, 'MANDT', 'X', 'CLNT 3', 'Client', 'T000'] },
      { line: 3, cols: [a, 'K1', 'X', 'CHAR 4', 'Key', b] },
      { line: 4, cols: [a, 'K2', '', 'CHAR 4', 'Other', b] },
      { line: 5, cols: [a, 'K3', '', 'CHAR 4', 'Elsewhere', 'NOT_LISTED_TABLE'] },
    ];
    assert.deepEqual(validate(c), []);
    const d = compile(c).details[buildShard(a)][a] as { sf: unknown[]; rel: unknown[] };
    assert.deepEqual(d.sf, [['MANDT', 1, 'CLNT 3', 'Client'], ['K1', 1, 'CHAR 4', 'Key'], ['K2', 0, 'CHAR 4', 'Other'], ['K3', 0, 'CHAR 4', 'Elsewhere']]);
    // one relation per check table, none to the client table or to a table the site does not list
    assert.deepEqual(d.rel, [{ table: b, type: 'check', on: 'K1' }]);
  });
});
