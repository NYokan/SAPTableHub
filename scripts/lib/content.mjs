// Reads the editable content in content/, checks it and compiles what the site loads.
// Messages are in Spanish because they are meant for whoever edits the content files.
import fs from 'node:fs';
import path from 'node:path';

export const LANGS = ['es', 'en', 'pt'];
const NAME_RE = /^[A-Z0-9_/]+$/;
const TYPE_RE = /^[A-Z0-9]+ \d+(,\d+)?$/;
const COMP_RE = /^[A-Z][A-Z0-9]*(-[A-Z0-9]+)*$/;

/** Detail files are grouped by the first two characters of the table name, so the site never needs one file per table. */
export function shardOf(id) {
  return id.slice(0, 2).toUpperCase().replace(/[^A-Z0-9]/g, '_').padEnd(2, '_');
}

/** File name for a table id: namespaced tables such as /ABC/TABLE are stored as _ABC_TABLE.json. */
export const fileNameOf = (id) => id.replace(/\//g, '_') + '.json';

/**
 * The tables taken from SAP's dictionary as listed by SAP Datasheet: one per line, tab-separated, with a header.
 * Tables that also have a file in tables/ keep that file; their line only adds SAP's short description.
 */
export const SAP_FILE = 'sap-tables.tsv';
export const SAP_HEAD = ['id', 'category', 'deliveryClass', 'description'];

function readSap(file) {
  if (!fs.existsSync(file)) return { head: SAP_HEAD.slice(), rows: [] };
  const [head = '', ...lines] = fs.readFileSync(file, 'utf8').split('\n').map((l) => l.replace(/\r$/, ''));
  return {
    head: head.split('\t'),
    rows: lines.map((l, i) => ({ line: i + 2, cols: l.split('\t') })).filter((r) => r.cols.join('') !== ''),
  };
}

export function loadContent(dir) {
  const read = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const tablesDir = path.join(dir, 'tables');
  const tables = fs
    .readdirSync(tablesDir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => {
      const file = 'tables/' + f;
      try {
        return { file, data: JSON.parse(fs.readFileSync(path.join(tablesDir, f), 'utf8')) };
      } catch (e) {
        return { file, data: null, parseError: e.message };
      }
    });
  return { taxonomy: read('taxonomy.json'), fields: read('fields.json'), glossary: read('glossary.json'), tables, sap: readSap(path.join(dir, SAP_FILE)) };
}

const isText = (v) => typeof v === 'string' && v.trim() !== '';
const isL10n = (o) => !!o && typeof o === 'object' && LANGS.every((l) => isText(o[l]));

/** Returns a list of problems; an empty list means the content is ready to build. */
export function validate(c) {
  const errors = [];
  const err = (where, msg) => errors.push(`${where}: ${msg}`);

  for (const [group, entries] of Object.entries(c.taxonomy)) {
    for (const [k, v] of Object.entries(entries)) {
      const named = group === 'categories' || group === 'deliveryClasses';
      if (named ? !(isL10n(v.name) && isL10n(v.help)) : !isL10n(v)) {
        err(`taxonomy.json ${group}.${k}`, 'falta texto en es, en o pt');
      }
    }
  }
  for (const [k, v] of Object.entries(c.fields)) {
    if (!NAME_RE.test(k)) err(`fields.json ${k}`, 'el nombre del campo solo admite mayúsculas, dígitos, _ y /');
    if (!isText(v.type)) err(`fields.json ${k}`, 'falta "type" (por ejemplo "CHAR 10")');
    if (!isL10n(v.label)) err(`fields.json ${k}`, '"label" necesita texto en es, en y pt');
  }
  c.glossary.forEach((g, i) => {
    if (!isL10n(g.term) || !isL10n(g.definition)) err(`glossary.json entrada ${i + 1}`, '"term" y "definition" necesitan es, en y pt');
  });

  const ids = new Set();
  for (const { file, data: t, parseError } of c.tables) {
    if (parseError) { err(file, `no es JSON válido (${parseError})`); continue; }
    if (!t || !isText(t.id) || !NAME_RE.test(t.id)) { err(file, '"id" solo admite mayúsculas, dígitos, _ y /'); continue; }
    if (file !== 'tables/' + fileNameOf(t.id)) err(file, `el archivo debe llamarse ${fileNameOf(t.id)}`);
    if (ids.has(t.id)) err(file, `la tabla ${t.id} está repetida`);
    ids.add(t.id);
    if (!c.taxonomy.areas[t.area]) err(file, `área desconocida "${t.area}" (ver taxonomy.json)`);
    if (!c.taxonomy.contents[t.contents]) err(file, `contenido desconocido "${t.contents}" (ver taxonomy.json)`);
    // category and delivery class are optional: left out when not known for sure (see docs/pendientes.md)
    if (t.category !== undefined && !c.taxonomy.categories[t.category]) err(file, `categoría desconocida "${t.category}"`);
    if (t.deliveryClass !== undefined && !c.taxonomy.deliveryClasses[t.deliveryClass]) err(file, `clase de entrega desconocida "${t.deliveryClass}"`);
    if (t.component !== undefined && !COMP_RE.test(t.component)) err(file, '"component" debe ser un componente de aplicación como SD-SLS');
    if (t.componentInferred !== undefined && (typeof t.componentInferred !== 'boolean' || !t.component)) err(file, '"componentInferred" debe ser true o false y acompañar a "component"');
    if (t.s4only !== undefined && typeof t.s4only !== 'boolean') err(file, '"s4only" debe ser true o false');
    if (!isL10n(t.title)) err(file, '"title" necesita texto en es, en y pt');
    if (t.purpose !== undefined && !isL10n(t.purpose)) err(file, '"purpose" necesita texto en es, en y pt');
    if (t.synonyms !== undefined) {
      for (const l of LANGS) {
        const list = t.synonyms[l];
        if (!Array.isArray(list) || list.some((s) => !isText(s))) err(file, `"synonyms.${l}" debe ser una lista de palabras`);
      }
    }
    const seen = new Set();
    for (const f of t.fields ?? []) {
      if (!c.fields[f.name]) err(file, `el campo ${f.name} no está en fields.json`);
      if (f.label !== undefined && !isL10n(f.label)) err(file, `la etiqueta propia de ${f.name} necesita es, en y pt`);
      if (f.type !== undefined && !TYPE_RE.test(f.type)) err(file, `el tipo de ${f.name} debe tener la forma "CHAR 40"`);
      if (seen.has(f.name)) err(file, `el campo ${f.name} está repetido`);
      seen.add(f.name);
    }
    if ((t.fields ?? []).length && !t.fields.some((f) => f.key)) err(file, 'al menos un campo debe tener "key": true');
  }
  for (const { file, data: t } of c.tables) {
    if (!t || !isText(t.id)) continue;
    for (const r of t.relations ?? []) {
      if (!ids.has(r.table)) err(file, `relación con una tabla que no existe: ${r.table}`);
      if (!c.taxonomy.relationTypes[r.type]) err(file, `tipo de relación desconocido "${r.type}"`);
      if (!isText(r.on)) err(file, `la relación con ${r.table} necesita "on"`);
    }
  }

  if (c.sap.head.join('\t') !== SAP_HEAD.join('\t')) err(SAP_FILE, `la primera línea debe ser: ${SAP_HEAD.join(' ⇥ ')}`);
  const sapIds = new Set();
  for (const { line, cols } of c.sap.rows) {
    const where = `${SAP_FILE} línea ${line}`;
    if (cols.length !== SAP_HEAD.length) { err(where, `debe tener ${SAP_HEAD.length} columnas separadas por tabuladores`); continue; }
    const [id, cat, dcl, desc] = cols;
    if (!NAME_RE.test(id)) { err(where, `"${id}": el nombre solo admite mayúsculas, dígitos, _ y /`); continue; }
    if (sapIds.has(id)) err(where, `la tabla ${id} está repetida`);
    sapIds.add(id);
    if (!c.taxonomy.categories[cat]) err(where, `${id}: categoría desconocida "${cat}"`);
    if (!c.taxonomy.deliveryClasses[dcl]) err(where, `${id}: clase de entrega desconocida "${dcl}"`);
    if (!isText(desc)) err(where, `${id}: falta la descripción`);
  }
  return errors;
}

/**
 * Builds the small index the site loads first, the detail groups it loads on demand, and the list of tables
 * that only SAP's dictionary describes (no file in tables/), loaded alongside the index.
 */
export function compile(c) {
  const tables = c.tables.map((x) => x.data).sort((a, b) => a.id.localeCompare(b.id));
  const own = new Set(tables.map((t) => t.id));
  const official = new Map(c.sap.rows.map(({ cols }) => [cols[0], cols[3]]));
  // name, SAP's short description, category and delivery class; sorted by name as the list shows them
  const sap = c.sap.rows
    .map(({ cols: [id, cat, dcl, desc] }) => [id, desc, cat, dcl])
    .filter(([id]) => !own.has(id))
    .sort((a, b) => a[0].localeCompare(b[0]));
  const empty = { es: [], en: [], pt: [] };
  // how many other tables point to each one: the central tables of an area are the most referenced
  const refs = {};
  for (const t of tables) for (const id of new Set((t.relations ?? []).map((r) => r.table))) refs[id] = (refs[id] ?? 0) + 1;
  const index = {
    tables: tables.map((t) => ({
      id: t.id,
      area: t.area,
      kind: t.contents,
      cat: t.category ?? '',
      dcl: t.deliveryClass ?? '',
      ...(t.component ? { comp: t.component } : {}),
      // a component the project assigned, not one taken from SAP's official list
      ...(t.componentInferred ? { ci: 1 } : {}),
      ...(t.s4only ? { s4: 1 } : {}),
      title: t.title,
      syn: t.synonyms ?? empty,
      // a field whose type in this table differs from the dictionary carries it after a colon: "*VTEXT:CHAR 40"
      f: (t.fields ?? []).map((f) => (f.key ? '*' : '') + f.name + (f.type ? ':' + f.type : '')),
      p: t.purpose ? 1 : 0,
      ...(refs[t.id] ? { r: refs[t.id] } : {}),
    })),
    fields: c.fields,
    taxonomy: c.taxonomy,
    glossary: c.glossary,
  };
  const details = {};
  for (const t of tables) {
    // a field that means something narrower in this table (AUART is an order type here, not a sales document type)
    const lab = Object.fromEntries((t.fields ?? []).filter((f) => f.label).map((f) => [f.name, f.label]));
    const sd = official.get(t.id);
    (details[shardOf(t.id)] ??= {})[t.id] = { purpose: t.purpose ?? null, rel: t.relations ?? [], ...(Object.keys(lab).length ? { lab } : {}), ...(sd ? { sd } : {}) };
  }
  return { index, details, sap };
}
