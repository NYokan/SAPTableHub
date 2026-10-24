import { ic } from '../lib/icons.ts';
import { esc } from '../lib/text.ts';

const FOCUSABLE = 'a[href], button:not([disabled]), select, input, summary, [tabindex]:not([tabindex="-1"])';

/**
 * The side sheet that shows a table's ficha over the list: a modal dialog sliding in from the right
 * (full screen on phones). While it is open the page behind is inert, Tab stays inside it, and Escape,
 * the close button or a click on the veil asks to close it through `onClose`.
 */
export function createSheet(onClose: () => void) {
  const root = document.createElement('div');
  root.className = 'sheet';
  root.hidden = true;
  root.innerHTML = `
    <div class="sheet-veil" data-sheet-close></div>
    <div class="sheet-box" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
      <div class="sheet-bar"><a class="sheet-full" data-link></a><button type="button" class="sheet-x" data-sheet-close>${ic('x', 20)}</button></div>
      <div class="sheet-body" id="sheet-body"></div>
    </div>`;
  document.body.appendChild(root);
  const box = root.querySelector<HTMLElement>('.sheet-box')!;
  const body = root.querySelector<HTMLElement>('#sheet-body')!;
  const full = root.querySelector<HTMLAnchorElement>('.sheet-full')!;
  const x = root.querySelector<HTMLButtonElement>('.sheet-x')!;
  const app = document.querySelector<HTMLElement>('.app');
  let shownId = '';

  /** Puts a table in the sheet; opens it if needed. Keeps the focused control when only its content changes. */
  function show(id: string, html: string, labels: { full: string; fullHref: string; close: string }) {
    const focusK = box.contains(document.activeElement) ? (document.activeElement as HTMLElement).dataset.k : undefined;
    full.href = labels.fullHref;
    full.innerHTML = `${ic('expand', 18)}<span>${esc(labels.full)}</span>`;
    x.setAttribute('aria-label', labels.close);
    body.innerHTML = html;
    const fresh = id !== shownId;
    shownId = id;
    if (root.hidden) {
      root.hidden = false;
      app?.setAttribute('inert', '');
      document.documentElement.classList.add('sheet-open');
      body.scrollTop = 0;
      x.focus();
      return;
    }
    if (fresh) {
      body.scrollTop = 0;
      x.focus();
    } else if (focusK) body.querySelector<HTMLElement>(`[data-k="${focusK}"]`)?.focus();
  }

  function hide() {
    if (root.hidden) return;
    root.hidden = true;
    shownId = '';
    app?.removeAttribute('inert');
    document.documentElement.classList.remove('sheet-open');
  }

  root.addEventListener('click', (e) => {
    if ((e.target as Element).closest('[data-sheet-close]')) onClose();
  });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Tab') {
      const items = [...box.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !box.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  return { show, hide, isOpen: () => !root.hidden, id: () => shownId };
}
