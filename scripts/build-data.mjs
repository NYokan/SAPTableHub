// Checks content/ and writes src/generated/, which the site imports. Runs before dev, build and test.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile, loadContent, validate } from './lib/content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const content = loadContent(path.join(root, 'content'));
const errors = validate(content);
if (errors.length) {
  console.error(`El contenido tiene ${errors.length} problema(s):\n` + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}

const { index, details, sap } = compile(content);
const out = path.join(root, 'src', 'generated');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'details'), { recursive: true });
fs.writeFileSync(path.join(out, 'index.json'), JSON.stringify(index));
fs.writeFileSync(path.join(out, 'sap.json'), JSON.stringify(sap));
for (const [shard, group] of Object.entries(details)) {
  fs.writeFileSync(path.join(out, 'details', shard + '.json'), JSON.stringify(group));
}
console.log(`Datos listos: ${index.tables.length} tablas explicadas, ${sap.length} más del diccionario de SAP, ${Object.keys(details).length} archivos de detalle.`);
