// Same grouping as scripts/lib/content.mjs (tests/content.test.ts keeps them in step).
export function shardOf(id: string): string {
  return id.slice(0, 2).toUpperCase().replace(/[^A-Z0-9]/g, '_').padEnd(2, '_');
}
