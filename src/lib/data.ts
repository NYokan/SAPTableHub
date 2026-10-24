import type { DataIndex, TableDetail } from '../types.ts';
import { shardOf } from './shard.ts';

export async function loadIndex(): Promise<DataIndex> {
  const mod = await import('../generated/index.json');
  return mod.default as unknown as DataIndex;
}

// Each group of details becomes its own small file in the build, loaded only when a table is opened.
const groups = import.meta.glob<Record<string, TableDetail>>('../generated/details/*.json', { import: 'default' });

export async function loadDetail(id: string): Promise<TableDetail | null> {
  const loader = groups[`../generated/details/${shardOf(id)}.json`];
  if (!loader) return null;
  const group = await loader();
  return group[id] ?? null;
}
