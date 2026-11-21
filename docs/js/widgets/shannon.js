// "Shannon's two levers": capacity = bandwidth x log2(1 + signal/noise).

import { fit, number, onResize, theme } from './util.js';

const capacity = (hz, db) => hz * Math.log2(1 + 10 ** (db / 10));
/** What the digital telephone network gives an analog modem (Ayanoglu et al., 1998). */
const PHONE = { hz: [3000, 3500], db: [33, 39] };
const MARKS = [[14400, '14,400'], [28800, '28,800'], [33600, '33,600'], [56000, '56,000']];

export default function mount(el) {
  const colors = theme(el);
  el.querySelector('.w-panel').innerHTML = `
    <div class="w-grid">
      <label class="w-field"><span>Bandwidth: <output class="hz-out"></output></span><input type="range" class="hz" min="2000" max="4000" step="50" value="3100"></label>
      <label class="w-field"><span>Signal-to-noise ratio: <output class="db-out"></output></span><input type="range" class="db" min="10" max="48" step="0.5" value="35"></label>
    </div>
    <canvas class="w-canvas" style="height:260px" role="img" aria-label="Chart of channel capacity against signal-to-noise ratio"></canvas>
    <p class="w-out"></p>
    <p class="w-note">The curve is Shannon’s formula for the bandwidth you have chosen. The shaded band is the range of conditions Bell Labs engineers gave for an ordinary telephone connection, 3 to 3.5 kHz and 33 to 39 dB; it is a description of typical lines, not a specification. The 56,000 line sits above the curve there, and that is correct: a 56k modem does not beat this channel. Downstream, it avoids the noise that defines it.</p>`;
  const canvas = el.querySelector('canvas');
  const hz = el.querySelector('.hz');
  const db = el.querySelector('.db');
  const out = el.querySelector('.w-out');

  function draw() {
    const [g, w, h] = fit(canvas);
    const B = Number(hz.value);
    const S = Number(db.value);
    const pad = { l: 52, r: 12, t: 10, b: 26 };
    const x = (d) => pad.l + ((d - 10) / 38) * (w - pad.l - pad.r);
    const y = (c) => h - pad.b - (c / 64000) * (h - pad.t - pad.b);
    g.fillStyle = colors.panel;
    g.fillRect(0, 0, w, h);
    g.font = `11px ${colors.mono}`;

    // Typical phone-line conditions.
    g.fillStyle = colors.answerer;
    g.globalAlpha = 0.16;
    g.fillRect(x(PHONE.db[0]), pad.t, x(PHONE.db[1]) - x(PHONE.db[0]), h - pad.t - pad.b);
    g.globalAlpha = 1;

    // Modem speeds.
    g.textBaseline = 'middle';
    for (const [bps, label] of MARKS) {
      g.strokeStyle = colors.grid;
      g.setLineDash([3, 4]);
      g.beginPath();
      g.moveTo(pad.l, y(bps));
      g.lineTo(w - pad.r, y(bps));
      g.stroke();
      g.setLineDash([]);
      g.fillStyle = colors.dim;
      g.textAlign = 'right';
      g.fillText(label, pad.l - 6, y(bps));
    }
    g.textAlign = 'center';
    g.textBaseline = 'top';
    for (let d = 10; d <= 45; d += 5) g.fillText(`${d} dB`, x(d), h - pad.b + 6);

    // The capacity curve for this bandwidth.
    g.strokeStyle = colors.caller;
    g.lineWidth = 2;
    g.beginPath();
    for (let d = 10; d <= 48; d += 0.5) {
      if (d === 10) g.moveTo(x(d), y(capacity(B, d)));
      else g.lineTo(x(d), y(capacity(B, d)));
    }
    g.stroke();
    const c = capacity(B, S);
    g.fillStyle = colors.text;
    g.beginPath();
    g.arc(x(S), y(Math.min(c, 64000)), 5, 0, 2 * Math.PI);
    g.fill();

    el.querySelector('.hz-out').textContent = `${number(B)} Hz`;
    el.querySelector('.db-out').textContent = `${S} dB (signal ${number(10 ** (S / 10))}× the noise power)`;
    const inBand = B >= PHONE.hz[0] && B <= PHONE.hz[1] && S >= PHONE.db[0] && S <= PHONE.db[1];
    const beats = MARKS.filter(([bps]) => bps <= c).map(([, label]) => label);
    out.innerHTML = `Capacity: <b>${number(c)} bit/s</b>. ${beats.length ? `Enough, in principle, for ${beats.at(-1)} bit/s.` : 'Not enough for any of the speeds marked.'}${inBand ? ' This is within the range of an ordinary phone connection.' : ''}`;
  }
  hz.addEventListener('input', draw);
  db.addEventListener('input', draw);
  onResize(canvas, draw);
}
