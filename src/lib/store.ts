// Browser storage can be missing or blocked (private windows, strict settings); the site works without it.
export function load(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function save(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* not available: the preference just isn't remembered */
  }
}

export const KEYS = {
  lang: 'sth-lang',
  mode: 'sth-mode',
  theme: 'sth-theme',
  selection: 'sth-list',
} as const;
