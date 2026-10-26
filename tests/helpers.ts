import fs from 'node:fs';
import path from 'node:path';
import { byName } from '../src/lib/catalog.ts';
import { sapSummaries } from '../src/lib/sap.ts';
import { buildEntries, sapEntries } from '../src/lib/search.ts';
import type { DataIndex, SapRow } from '../src/types.ts';

// npm test runs the data build first, so the generated files are always current
const generated = (f: string) => JSON.parse(fs.readFileSync(path.join(import.meta.dirname, '..', 'src', 'generated', f), 'utf8'));
export const data = generated('index.json') as DataIndex;
export const sapRows = generated('sap.json') as SapRow[];
/** Every table the site lists, as main.ts builds them: the explained ones and SAP's list, sorted by name. */
export const entries = [...buildEntries(data), ...sapEntries(sapSummaries(sapRows), data.tables.length)].sort((a, b) => byName(a.t, b.t));
