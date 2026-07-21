// Shared UI helpers for the ported ETHOS pages.
// s(): parse a CSS text string into a React style object, so the design's
// inline styles port over verbatim (incl. CSS custom properties).
// Yandex.Metrika counter id (kept here so goal calls stay in one place).
export const YM_ID = 110919394;

// Fire a Metrika goal (conversion). No-op during SSR or if the counter
// hasn't loaded yet, so it's always safe to call from a click handler.
export function ymGoal(name) {
  if (typeof window !== 'undefined' && typeof window.ym === 'function') {
    window.ym(YM_ID, 'reachGoal', name);
  }
}

export function s(css) {
  const style = {};
  if (!css) return style;
  String(css).split(';').forEach((decl) => {
    const i = decl.indexOf(':');
    if (i < 0) return;
    const prop = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (!prop || !val) return;
    const key = prop.slice(0, 2) === '--' ? prop : prop.replace(/-([a-zA-Z])/g, (_, c) => c.toUpperCase());
    style[key] = val;
  });
  return style;
}
