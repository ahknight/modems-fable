// "Which rungs can you use?": the telephone network's voltage levels as a 56k alphabet.

import { ucodeLinear } from '../dsp/core.js';
import { pcmConstellation, pcmRate } from '../handshakes/v90.js';
import { fit, number, onResize, theme } from './util.js';

const RATES = [28000, 33333, 40000, 45333, 49333, 53333, 56000];
const ALL = Array.from({ length: 128 }, (_, u) => ucodeLinear(u));

export default function mount(el) {
  const colors = theme(el);
  el.querySelector('.w-panel').innerHTML = `
    <div role="radiogroup" aria-label="Downstream speed">${RATES.map((r, i) => `<button type="button" role="radio" aria-checked="${r === 49333}" data-rate="${i}">${number(r)}</button>`).join('')}</div>
    <label class="w-field"><span>Noise on your line: <output class="noise-out"></output></span><input type="range" class="noise" min="0" max="120" step="2" value="16"></label>
    <canvas class="w-canvas" style="height:170px" role="img" aria-label="The telephone network's voltage levels, with the ones a modem would use at this speed highlighted"></canvas>
    <p class="w-out"></p>
    <p class="w-note">Gray ticks: all 128 positive mu-law levels, from zero at the left, in the units of Table 1 of V.90 (the largest is 32,124, off the right edge). Bright ticks: one possible choice of levels for this speed, spaced as widely as the power limit allows. Real modems chose a set for each of six sample positions from what the learning sequence revealed; ours is a single illustrative set chosen by a simple rule. The shaded width around each bright tick is where 95% of received samples would fall with the noise you have set.</p>`;
  const canvas = el.querySelector('canvas');
  const noise = el.querySelector('.noise');
  const out = el.querySelector('.w-out');
  let rate = 49333;

  function draw() {
    const [g, w, h] = fit(canvas);
    const perFrame = Math.round((rate * 6) / 8000);
    const count = Math.round(2 ** (perFrame / 6 - 1));
    const used = pcmConstellation(count).map(ucodeLinear);
    const sigma = Number(noise.value);
    const top = Math.max(9000, used.at(-1) * 1.08);
    const x = (v) => 8 + (v / top) * (w - 16);
    g.fillStyle = colors.panel;
    g.fillRect(0, 0, w, h);
    g.strokeStyle = colors.dim;
    g.globalAlpha = 0.55;
    g.beginPath();
    for (const v of ALL) {
      if (v > top) break;
      g.moveTo(x(v), h * 0.62);
      g.lineTo(x(v), h * 0.9);
    }
    g.stroke();
    g.globalAlpha = 0.3;
    g.fillStyle = colors.answerer;
    for (const v of used) g.fillRect(x(v - 2 * sigma), h * 0.12, Math.max(1, x(v + 2 * sigma) - x(v - 2 * sigma)), h * 0.46);
    g.globalAlpha = 1;
    g.strokeStyle = colors.answerer;
    g.lineWidth = 1.5;
    g.beginPath();
    for (const v of used) {
      g.moveTo(x(v), h * 0.12);
      g.lineTo(x(v), h * 0.9);
    }
    g.stroke();
    g.lineWidth = 1;

    const gaps = used.slice(1).map((v, i) => v - used[i]);
    const tightest = Math.min(...gaps, 2 * used[0]);
    const overlapping = [used[0] * 2, ...gaps].filter((gap) => gap < 4 * sigma).length;
    el.querySelector('.noise-out').textContent = sigma ? `${sigma} units RMS` : 'none';
    out.innerHTML = `<b>${number(pcmRate(perFrame))} bit/s</b> needs ${perFrame} bits in every six samples: one sign bit and about ${(perFrame / 6 - 1).toFixed(1)} more per sample, so about <b>${count} levels</b> of each sign. The closest two are <b>${number(tightest)}</b> units apart. ${overlapping === 0 ? 'With this much noise they can all be told apart.' : `With this much noise, <b>${overlapping}</b> of them blur into a neighbor. A real modem would notice during training and settle for a lower speed.`}`;
  }
  el.querySelector('[role="radiogroup"]').addEventListener('click', (e) => {
    const button = e.target.closest('[data-rate]');
    if (!button) return;
    for (const b of button.parentElement.children) b.setAttribute('aria-checked', String(b === button));
    rate = RATES[Number(button.dataset.rate)];
    draw();
  });
  noise.addEventListener('input', draw);
  onResize(canvas, draw);
}
