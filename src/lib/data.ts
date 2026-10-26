import type { DataIndex, SapRow, TableDetail } from '../types.ts';
import { shardOf } from './shard.ts';

export async function loadIndex(): Promise<DataIndex> {
  const mod = await import('../generated/index.json');
  return mod.default as unknown as DataIndex;
}

/** The tables known only from SAP's dictionary list: a file of its own, so it is cached apart from the index. */
export async function loadSap(): Promise<SapRow[]> {
  const mod = await import('../generated/sap.json');
  return mod.default as unknown as SapRow[];
}

// Each group of details becomes its own small file in the build, loaded only when a table is opened.
const groups = import.meta.glob<Record<string, TableDetail>>('../generated/details/*.json', { import: 'default' });

// the detail groups split by four characters, from the index (see shardOf)
let split: readonly string[] = [];
export const useSplit = (groups: readonly string[] = []) => {
  split = groups;
};

export async function loadDetail(id: string): Promise<TableDetail | null> {
  const loader = groups[`../generated/details/${shardOf(id, split)}.json`];
  if (!loader) return null;
  const group = await loader();
  return group[id] ?? null;
}
