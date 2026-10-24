import type { Lang } from '../types.ts';
import en from './en.json';
import es from './es.json';
import pt from './pt.json';

const STRINGS = { es, en, pt };

export type StrKey = Exclude<keyof typeof es, 'examples'>;
export type Vars = Record<string, string | number>;

export function t(lang: Lang, key: StrKey, vars?: Vars): string {
  let s: string = STRINGS[lang][key] ?? STRINGS.es[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  return s;
}

/** Example searches shown under the search box. */
export const examples = (lang: Lang): string[] => STRINGS[lang].examples;
