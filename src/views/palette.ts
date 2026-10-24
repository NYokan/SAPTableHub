import { ic, type IconName } from '../lib/icons.ts';
import { esc, tokenize } from '../lib/text.ts';

/** One line of the command palette. A command either runs or opens a page of more commands. */
export interface Cmd {
  id: string;
  label: string;
  /** Heading the command sits under on its page. */
  group?: string;
  /** The page it belongs to, shown before it when every page is searched at once ("Área ›"). */
  crumb?: string;
  /** Shortcut shown at the right. */
  kbd?: string;
  icon?: IconName;
  /** True for the option that is in effect now (the current area, the current language…). */
  on?: boolean;
  /** Opens this page of commands instead of running. */
  page?: string;
  run?: () => void;
  /** Extra words it answers to. */
  words?: string;
  /** Code-like label, set in the mono face. */
  code?: boolean;
  /** A quieter line after the label, such as a table's description. */
  note?: string;
}

export interface PaletteSource {
  /** Commands of a page; '' is the first page. */
  page(page: string): { title: string; cmds: Cmd[] };
  /** Everything that can be run from anywhere, for searching across pages. */
  leaves(): Cmd[];
  /** Tables that answer a query, shown first while typing. */
  tables(q: string): Cmd[];
  str(key: 'cmd' | 'cmdPh' | 'cmdNone' | 'kClose' | 'kMove' | 'kRun' | 'current', vars?: Record<string, string>): string;
}

/**
 * A command palette in the manner of Linear and Raycast: a modal dialog with one combobox,
 * pages of commands with a breadcrumb, and search across every page as soon as you type.
 * Backspace on an empty box goes back a page; Escape closes and returns focus.
 */
export function createPalette(src: PaletteSource) {
  const root = document.createElement('div');
  root.className = 'pal';
  root.hidden = true;
  root.innerHTML = `
    <div class="pal-veil" data-pal-close></div>
    <div class="pal-box" role="dialog" aria-modal="true" aria-labelledby="pal-title">
      <h2 class="vh" id="pal-title"></h2>
      <div class="pal-top">
        <span class="pal-crumb" id="pal-crumb"></span>
        <input id="pal-q" type="text" role="combobox" aria-expanded="true" aria-controls="pal-list" aria-autocomplete="list" autocomplete="off" autocapitalize="none" spellcheck="false" enterkeyhint="go">
        <button type="button" class="pal-x" data-pal-close><kbd>Esc</kbd><span class="vh" id="pal-xl"></span></button>
      </div>
      <ul class="pal-list" id="pal-list" role="listbox"></ul>
      <div class="pal-foot" aria-hidden="true" id="pal-foot"></div>
    </div>`;
  document.body.appendChild(root);
  const input = root.querySelector<HTMLInputElement>('#pal-q')!;
  const list = root.querySelector<HTMLUListElement>('#pal-list')!;
  let stack: string[] = [];
  let shown: Cmd[] = [];
  let active = 0;
  let returnTo: HTMLElement | null = null;

  const page = () => stack[stack.length - 1] ?? '';

  function matches(q: string): Cmd[] {
    const words = tokenize(q);
    const hit = (x: Cmd) => {
      const hay = tokenize(`${x.label} ${x.crumb ?? ''} ${x.words ?? ''}`).join(' ');
      return words.every((w) => hay.includes(w));
    };
    const pool = page() ? src.page(page()).cmds : src.leaves();
    const found = pool.filter((x) => !x.page && hit(x));
    return page() ? found : [...src.tables(q), ...found];
  }

  function paint() {
    const q = input.value.trim();
    const p = src.page(page());
    root.querySelector('#pal-title')!.textContent = p.title || src.str('cmd');
    const crumb = root.querySelector<HTMLElement>('#pal-crumb')!;
    crumb.textContent = page() ? p.title : '';
    crumb.hidden = !page();
    shown = q ? matches(q) : p.cmds;
    active = Math.min(active, Math.max(0, shown.length - 1));
    if (!shown.length) {
      list.innerHTML = `<li class="pal-none" role="presentation">${esc(src.str('cmdNone', { q }))}</li>`;
      input.removeAttribute('aria-activedescendant');
      return;
    }
    let group = '';
    list.innerHTML = shown
      .map((x, i) => {
        const g = x.group ?? '';
        const head = g && g !== group ? `<li class="pal-g" role="presentation">${esc(g)}</li>` : '';
        if (g) group = g;
        const crumbTxt = q && x.crumb ? `<span class="pal-c">${esc(x.crumb)} ›</span>` : '';
        const on = x.on ? `<span class="pal-on">${ic('check', 16)}<span class="vh">(${esc(src.str('current'))})</span></span>` : '';
        const tail = x.page ? ic('chev', 16) : x.kbd ? `<kbd>${esc(x.kbd)}</kbd>` : '';
        return `${head}<li class="pal-o" role="option" id="pal-o-${i}" data-i="${i}" aria-selected="${i === active}">
          <span class="pal-i">${x.icon ? ic(x.icon, 18) : ''}</span>${crumbTxt}<span class="pal-l${x.code ? ' code' : ''}">${esc(x.label)}</span>${x.note ? `<span class="pal-n">${esc(x.note)}</span>` : ''}${on}<span class="pal-k">${tail}</span></li>`;
      })
      .join('');
    input.setAttribute('aria-activedescendant', `pal-o-${active}`);
  }

  function move(to: number) {
    if (!shown.length) return;
    active = (to + shown.length) % shown.length;
    list.querySelectorAll('[role="option"]').forEach((o, i) => o.setAttribute('aria-selected', String(i === active)));
    list.querySelector<HTMLElement>(`#pal-o-${active}`)?.scrollIntoView({ block: 'nearest' });
    input.setAttribute('aria-activedescendant', `pal-o-${active}`);
  }

  function choose(i: number) {
    const x = shown[i];
    if (!x) return;
    if (x.page) {
      stack.push(x.page);
      input.value = '';
      active = 0;
      paint();
      input.focus();
      return;
    }
    close(false);
    x.run?.();
  }

  function open(start = '', q = '') {
    if (!root.hidden) {
      if (start && page() !== start) {
        stack = [start];
        input.value = '';
        active = 0;
        paint();
      }
      return;
    }
    returnTo = document.activeElement as HTMLElement | null;
    stack = start ? [start] : [];
    input.value = q;
    input.placeholder = src.str('cmdPh');
    input.setAttribute('aria-label', src.str('cmd'));
    root.querySelector('#pal-xl')!.textContent = src.str('kClose');
    root.querySelector('#pal-foot')!.innerHTML = `<span><kbd>↑</kbd><kbd>↓</kbd> ${esc(src.str('kMove'))}</span><span><kbd>↵</kbd> ${esc(src.str('kRun'))}</span><span><kbd>Esc</kbd> ${esc(src.str('kClose'))}</span>`;
    active = 0;
    root.hidden = false;
    document.documentElement.classList.add('pal-open');
    paint();
    input.focus();
  }

  function close(restore = true) {
    if (root.hidden) return;
    root.hidden = true;
    document.documentElement.classList.remove('pal-open');
    if (restore && returnTo?.isConnected) returnTo.focus();
  }

  input.addEventListener('input', () => {
    active = 0;
    paint();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      move(active + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      move(active - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(active);
    } else if (e.key === 'Backspace' && !input.value && stack.length) {
      e.preventDefault();
      stack.pop();
      active = 0;
      paint();
    }
  });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (input.value) {
        input.value = '';
        paint();
      } else close();
    } else if (e.key === 'Tab') {
      // focus stays inside the dialog: the box and the close button
      const x = root.querySelector<HTMLElement>('.pal-x')!;
      e.preventDefault();
      (document.activeElement === input ? x : input).focus();
    }
  });
  root.addEventListener('click', (e) => {
    const t = e.target as Element;
    if (t.closest('[data-pal-close]')) return close();
    const o = t.closest<HTMLElement>('.pal-o');
    if (o) choose(Number(o.dataset.i));
  });
  list.addEventListener('mousemove', (e) => {
    const o = (e.target as Element).closest<HTMLElement>('.pal-o');
    if (o && Number(o.dataset.i) !== active) move(Number(o.dataset.i));
  });

  return { open, close, isOpen: () => !root.hidden, refresh: () => !root.hidden && paint() };
}
