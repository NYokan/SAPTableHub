// Same grouping as scripts/lib/content.mjs (tests/content.test.ts keeps them in step): by the first two characters,
// or by four for the groups the data build split because they were too large to load for one table.
export function shardOf(id: string, split: readonly string[] = []): string {
  const key = (n: number) => id.slice(0, n).toUpperCase().replace(/[^A-Z0-9]/g, '_').padEnd(n, '_');
  return split.includes(key(2)) ? key(4) : key(2);
}
