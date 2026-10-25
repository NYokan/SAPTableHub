/** Reads one entry of a table's field list: "*VBELN" or "VTEXT:CHAR 40". */
export function parseField(f: string): { name: string; key: boolean; type?: string } {
  const key = f.startsWith('*');
  const [name, type] = (key ? f.slice(1) : f).split(':');
  return type ? { name, key, type } : { name, key };
}
