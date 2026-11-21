// Small helpers shared by the widgets.

/** Size a canvas to its CSS box (capped at 2x density) and return [context, width, height] in CSS pixels. */
export function fit(canvas) {
  const box = canvas.getBoundingClientRect();
  const ratio = Math.min(2, devicePixelRatio || 1);
  const w = Math.max(1, Math.round(box.width * ratio));
  const h = Math.max(1, Math.round(box.height * ratio));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  const g = canvas.getContext('2d');
  g.setTransform(ratio, 0, 0, ratio, 0, 0);
  return [g, box.width, box.height];
}

/** Colors and fonts from the stylesheet's custom properties. */
export function theme(el) {
  const css = getComputedStyle(el);
  const v = (name) => css.getPropertyValue(name).trim();
  return {
    caller: v('--caller'), answerer: v('--answerer'), panel: v('--screen'), text: v('--screen-text'),
    dim: v('--screen-dim'), grid: v('--screen-grid'), warn: v('--f-approx'), ok: v('--f-spec'), mono: v('--mono'),
  };
}

/** Redraw when the element is resized. */
export function onResize(el, draw) {
  new ResizeObserver(() => draw()).observe(el);
}

/** "1 h 02 min 05 s", "3 min 20 s", "12 s", "0.4 s". */
export function duration(seconds) {
  if (seconds < 1) return `${seconds.toFixed(1)} s`;
  if (seconds < 60) return `${Math.round(seconds)} s`;
  const s = Math.round(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h) return `${h} h ${String(m).padStart(2, '0')} min`;
  return `${m} min ${String(s % 60).padStart(2, '0')} s`;
}

export const number = (n) => Math.round(n).toLocaleString('en-US');

export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
