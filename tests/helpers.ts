import fs from 'node:fs';
import path from 'node:path';
import { buildEntries } from '../src/lib/search.ts';
import type { DataIndex } from '../src/types.ts';

// npm test runs the data build first, so the generated index is always current
const file = path.join(import.meta.dirname, '..', 'src', 'generated', 'index.json');
export const data = JSON.parse(fs.readFileSync(file, 'utf8')) as DataIndex;
export const entries = buildEntries(data);
