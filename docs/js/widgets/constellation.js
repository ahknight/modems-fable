// "Why more dots need a cleaner line": constellations under adjustable noise.

import { prng } from '../dsp/core.js';
import { V22BIS_POINTS, V22_POINTS } from '../handshakes/v22.js';
import { V32BIS_TCM, V32_TCM } from '../handshakes/v32.js';
import { constellation } from '../handshakes/v34.js';
import { fit, number, onResize, theme } from './util.js';

const SETS = [
  { label: '1,200', points: V22_POINTS, baud: 600, bits: 2, name: 'V.22: 4 points' },
  { label: '2,400', points: V22BIS_POINTS, baud: 600, bits: 4, name: 'V.22 bis: 16 points' },
  { label: '9,600', points: V32_TCM, baud: 2400, bits: 4, coded: true, name: 'V.32: 32 points' },
  { label: '14,400', points: V32BIS_TCM, baud: 2400, bits: 6, coded: true, name: 'V.32 bis: 128 points' },
  { label: '28,800', points: constellation(896), baud: 3200, bits: 9, coded: true, name: 'V.34: 896 points' },
];
const SAMPLES = 3000;

export default function mount(el) {
  const colors = theme(el);
  el.querySelector('.w-panel').innerHTML = `
    <div role="radiogroup" aria-label="Modem speed">${SETS.map((s, i) => `<button type="button" role="radio" aria-checked="${i === 1}" data-set="${i}">${s.label}</button>`).join('')}</div>
    <div class="w-split">
      <canvas class="w-canvas" style="aspect-ratio:1" role="img" aria-label="Constellation diagram with received symbols scattered by noise"></canvas>
      <div class="w-panel-side">
        <label class="w-field"><span>Signal-to-noise ratio: <output class="snr-out"></output></span><input type="range" class="snr" min="8" max="44" step="1" value="26"></label>
        <p class="w-out"></p>
        <p class="w-note">Each faint dot is where one of ${number(SAMPLES)} simulated symbols landed after noise was added. A symbol is “misread” when it lands nearer to some other point than the one that was sent. This counts raw mistakes before any error-correcting code: the trellis codes used at 9,600 and above let a modem work with roughly 3 to 4 dB more noise than the count here suggests.</p>
      </div>
    </div>`;
  const canvas = el.querySelector('canvas');
  const snr = el.querySelector('.snr');
  const out = el.querySelector('.w-out');
  const snrOut = el.querySelector('.snr-out');
  let current = SETS[1];

  function draw() {
    const [g, w, h] = fit(canvas);
    const pts = current.points;
    const power = pts.reduce((s, [x, y]) => s + x * x + y * y, 0) / pts.length;
    const sigma = Math.sqrt(power / 10 ** (Number(snr.value) / 10) / 2); // per axis
    const reach = Math.max(...pts.map(([x, y]) => Math.max(Math.abs(x), Math.abs(y)))) + 3 * sigma;
    const scale = (Math.min(w, h) / 2 - 4) / reach;
    const px = (x) => w / 2 + x * scale;
    const py = (y) => h / 2 - y * scale;
    g.fillStyle = colors.panel;
    g.fillRect(0, 0, w, h);
    g.strokeStyle = colors.grid;
    g.beginPath();
    g.moveTo(0, h / 2);
    g.lineTo(w, h / 2);
    g.moveTo(w / 2, 0);
    g.lineTo(w / 2, h);
    g.stroke();

    // Simulate: send random points, add Gaussian noise, decide by nearest point.
    const random = prng(7);
    const gauss = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
    let wrong = 0;
    g.fillStyle = colors.caller;
    g.globalAlpha = 0.5;
    for (let n = 0; n < SAMPLES; n++) {
      const sent = Math.floor(random() * pts.length);
      const x = pts[sent][0] + sigma * gauss();
      const y = pts[sent][1] + sigma * gauss();
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i < pts.length; i++) {
        const d = (x - pts[i][0]) ** 2 + (y - pts[i][1]) ** 2;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      if (best !== sent) wrong++;
      g.fillRect(px(x) - 0.75, py(y) - 0.75, 1.5, 1.5);
    }
    g.globalAlpha = 1;
    g.fillStyle = colors.text;
    const r = pts.length > 200 ? 1 : pts.length > 40 ? 1.8 : 3;
    for (const [x, y] of pts) {
      g.beginPath();
      g.arc(px(x), py(y), r, 0, 2 * Math.PI);
      g.fill();
    }

    const rate = wrong / SAMPLES;
    snrOut.textContent = `${snr.value} dB (signal ${number(10 ** (Number(snr.value) / 10))}× the noise power)`;
    const verdict = rate === 0 ? 'none misread. The clouds stay apart.' : rate < 0.01 ? `<b>${wrong}</b> misread (${(100 * rate).toFixed(1)}%). The clouds are starting to touch.` : `<b>${number(wrong)}</b> misread (${(100 * rate).toFixed(0)}%). The clouds overlap; this speed is not usable on this line.`;
    out.innerHTML = `<b>${current.name}</b>, ${current.baud.toLocaleString('en-US')} symbols per second × ${current.bits} data bits${current.coded ? ' (plus coding)' : ''} = ${(current.baud * current.bits).toLocaleString('en-US')} bit/s. Of ${number(SAMPLES)} symbols: ${verdict}`;
  }

  el.querySelector('[role="radiogroup"]').addEventListener('click', (e) => {
    const button = e.target.closest('[data-set]');
    if (!button) return;
    for (const b of button.parentElement.children) b.setAttribute('aria-checked', String(b === button));
    current = SETS[Number(button.dataset.set)];
    draw();
  });
  snr.addEventListener('input', draw);
  onResize(canvas, draw);
}
