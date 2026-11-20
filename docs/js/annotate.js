// Turns a call's annotations into HTML. Used twice: by the build script, so the
// step-by-step text is in the page without JavaScript, and by the player, when
// a visitor switches to a variant that was not pre-rendered.

export const LANES = ['Calling modem', 'Answering modem', 'Telephone network'];

export const FIDELITY_NAMES = {
  spec: 'Per the standard',
  nominal: 'Per the standard, timing typical',
  approx: 'Approximation',
};

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
export const escapeHtml = (text) => String(text).replace(/[&<>"]/g, (ch) => ESCAPES[ch]);

/** 83.26 -> "1:23.3" */
export function clock(seconds) {
  const tenths = Math.round(seconds * 10);
  return `${Math.floor(tenths / 600)}:${String(Math.floor(tenths / 10) % 60).padStart(2, '0')}.${tenths % 10}`;
}

/**
 * The "geological layer" a signal belongs to, from the year in its origin tag.
 * Returns a CSS class suffix; colours live in the stylesheet.
 */
export function era(origin) {
  const year = Number(/\b(19\d\d)\b/.exec(origin)?.[1]);
  if (!year) return 'net';
  if (year < 1970) return '1960';
  if (year < 1984) return '1976';
  if (year < 1990) return '1984';
  if (year < 1994) return '1991';
  if (year < 1998) return '1994';
  return '1998';
}

/** The narration, one list item per step. */
export function stepsHtml(call) {
  return call.steps.map((step, i) => `
      <li data-t="${step.t.toFixed(3)}">
        <div class="step-head">
          <button type="button" class="step-go" data-step="${i}" title="Play from here"><span class="step-time">${clock(step.t)}</span> <span class="step-title">${escapeHtml(step.title)}</span></button>
          ${step.origin ? `<span class="origin era-${era(step.origin)}">${escapeHtml(step.origin)}</span>` : ''}
        </div>
        <p>${escapeHtml(step.text)}</p>
      </li>`).join('');
}

/** Every signal in the call as table rows: the text alternative to the timeline. */
export function segmentsHtml(call) {
  const lanes = call.lanes || LANES;
  const rows = call.segments.map((s) => `
        <tr class="f-${s.fidelity}">
          <td>${clock(s.t0)}</td>
          <td>${((s.t1 - s.t0) * 1000).toFixed(0)} ms</td>
          <td>${escapeHtml(lanes[s.who])}</td>
          <th scope="row">${escapeHtml(s.label)}</th>
          <td><span class="badge f-${s.fidelity}">${FIDELITY_NAMES[s.fidelity]}</span></td>
          <td>${escapeHtml(s.note)}</td>
        </tr>`).join('');
  return `
      <table>
        <thead><tr><th scope="col">Starts</th><th scope="col">Lasts</th><th scope="col">Sent by</th><th scope="col">Signal</th><th scope="col">Fidelity</th><th scope="col">Basis</th></tr></thead>
        <tbody>${rows}
        </tbody>
      </table>`;
}

/** One-line tally of how much of a call is faithful, by duration of signal. */
export function fidelitySummary(call) {
  const total = { spec: 0, nominal: 0, approx: 0 };
  for (const s of call.segments) if (!/^(Silence|Waiting|Detecting|Listening)/.test(s.label)) total[s.fidelity] += s.t1 - s.t0;
  const sum = total.spec + total.nominal + total.approx || 1;
  const pct = (v) => Math.round((100 * v) / sum);
  return { spec: pct(total.spec), nominal: pct(total.nominal), approx: 100 - pct(total.spec) - pct(total.nominal) };
}
