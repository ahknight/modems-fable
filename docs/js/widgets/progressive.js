// "Waiting for a picture": one image arriving at modem speed, three ways.
//
// A simulation, and labelled as one. The picture is drawn by code (no photo is
// downloaded); the three loading styles imitate what browsers of the period
// showed, with illustrative byte budgets for each pass.

import { prng } from '../dsp/core.js';
import { duration, number, reducedMotion } from './util.js';

const W = 320;
const H = 240;
const BYTES = 60000;
const SPEEDS = [[14400, '14,400'], [28800, '28,800'], [33600, '33,600'], [46667, '56k (typical 46,667)']];
const MODES = [
  ['sequential', 'Top to bottom'],
  ['interlaced', 'Interlaced (GIF style)'],
  ['progressive', 'Progressive (JPEG style)'],
];
/** Share of the file received by the end of each progressive scan, and the detail it restores. */
const SCANS = [[0.1, 8], [0.25, 4], [0.5, 2], [1, 1]];

/** An original scene: dusk over hills and water, with enough fine detail to make blur visible. */
function scene() {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext('2d');
  const random = prng(1996);
  const sky = g.createLinearGradient(0, 0, 0, H * 0.62);
  sky.addColorStop(0, '#1b2a5c');
  sky.addColorStop(0.55, '#b0507a');
  sky.addColorStop(1, '#ffb45e');
  g.fillStyle = sky;
  g.fillRect(0, 0, W, H);
  for (let i = 0; i < 70; i++) {
    g.fillStyle = `rgba(255,255,255,${0.3 + 0.7 * random()})`;
    g.fillRect(random() * W, random() * H * 0.33, 1, 1);
  }
  g.fillStyle = '#ffe9b0';
  g.beginPath();
  g.arc(W * 0.68, H * 0.5, 22, 0, 2 * Math.PI);
  g.fill();
  for (let i = 0; i < 7; i++) {
    g.fillStyle = `rgba(255,220,200,${0.25 + 0.2 * random()})`;
    const cx = random() * W;
    const cy = H * (0.18 + 0.25 * random());
    for (let k = 0; k < 6; k++) g.fillRect(cx + k * 9 - 20 + random() * 6, cy + random() * 5, 26 + random() * 18, 3);
  }
  const hills = [['#5a2f5e', 0.56, 16], ['#3b2350', 0.62, 22], ['#22183a', 0.69, 12]];
  for (const [color, base, height] of hills) {
    const phase = random() * 10;
    g.fillStyle = color;
    g.beginPath();
    g.moveTo(0, H);
    for (let x = 0; x <= W; x += 2) g.lineTo(x, H * base - height * (Math.sin(x / 31 + phase) + 0.5 * Math.sin(x / 11 + phase * 2)));
    g.lineTo(W, H);
    g.fill();
  }
  g.fillStyle = '#16102a';
  for (let i = 0; i < 46; i++) {
    const x = random() * W;
    const y = H * (0.68 + 0.03 * random());
    const s = 4 + random() * 9;
    g.beginPath();
    g.moveTo(x, y - s * 1.8);
    g.lineTo(x - s * 0.5, y);
    g.lineTo(x + s * 0.5, y);
    g.fill();
  }
  const water = g.createLinearGradient(0, H * 0.74, 0, H);
  water.addColorStop(0, '#7a3f6c');
  water.addColorStop(1, '#141633');
  g.fillStyle = water;
  g.fillRect(0, H * 0.74, W, H * 0.26);
  for (let y = H * 0.75; y < H; y += 2) {
    g.fillStyle = `rgba(255,200,140,${0.5 * random() * (1 - (y - H * 0.74) / (H * 0.3))})`;
    const half = 6 + (y - H * 0.74) * 0.5 + random() * 8;
    g.fillRect(W * 0.68 - half, y, half * 2, 1);
  }
  return canvas;
}

/** The scene with detail finer than `block` pixels removed. */
function coarse(source, block) {
  if (block === 1) return source;
  const small = document.createElement('canvas');
  small.width = W / block;
  small.height = H / block;
  small.getContext('2d').drawImage(source, 0, 0, small.width, small.height);
  const out = document.createElement('canvas');
  out.width = W;
  out.height = H;
  const g = out.getContext('2d');
  g.imageSmoothingEnabled = block < 8; // the first scan of a JPEG is visibly blocky
  g.drawImage(small, 0, 0, W, H);
  return out;
}

export default function mount(el) {
  el.querySelector('.w-panel').innerHTML = `
    <div class="w-row">
      <div role="radiogroup" aria-label="Loading style" style="margin:0">${MODES.map(([id, label], i) => `<button type="button" role="radio" aria-checked="${i === 2}" data-mode="${id}">${label}</button>`).join('')}</div>
      <label>Modem <select class="speed">${SPEEDS.map(([bps, label], i) => `<option value="${bps}"${i === 1 ? ' selected' : ''}>${label}</option>`).join('')}</select></label>
    </div>
    <canvas class="w-canvas" width="${W}" height="${H}" style="max-width:640px;aspect-ratio:4/3;image-rendering:auto" role="img" aria-label="A picture of a sunset over hills and water, shown partly loaded"></canvas>
    <input type="range" class="pos" min="0" max="1" step="0.001" value="0" aria-label="Position in download">
    <div class="w-row">
      <button type="button" class="play">▶ Start download</button>
      <button type="button" class="restart">⏮ Restart</button>
      <output class="readout"></output>
    </div>
    <p class="w-note">A simulation. The picture is drawn by a program and is assumed to be a ${number(BYTES / 1000)} kB file in every style so that the styles can be compared; real GIF and JPEG files of the same picture would differ in size. The share of the file each pass uses (for the progressive style: 10%, 15%, 25% and 50%) is illustrative, and stepped resolution stands in for a real JPEG’s refinement of detail. Timing assumes the modem holds its speed with error correction on.</p>`;
  const canvas = el.querySelector('canvas');
  const g = canvas.getContext('2d');
  const pos = el.querySelector('.pos');
  const playButton = el.querySelector('.play');
  const readout = el.querySelector('.readout');
  const speed = el.querySelector('.speed');
  const full = scene();
  const levels = new Map(SCANS.map(([, block]) => [block, coarse(full, block)]));
  let mode = 'progressive';
  let playing = false;
  let startedAt = 0;
  const total = () => (BYTES * 8 * 1.03) / Number(speed.value);

  function draw() {
    const f = Number(pos.value);
    g.fillStyle = '#c0c0c0';
    g.fillRect(0, 0, W, H);
    if (mode === 'sequential') {
      const rows = Math.floor(f * H);
      if (rows) g.drawImage(full, 0, 0, W, rows, 0, 0, W, rows);
    } else if (mode === 'interlaced') {
      // GIF's four passes: every 8th row, the rows between, every 4th, then all the odd rows.
      const passes = [[0, 8, 0.125], [4, 8, 0.25], [2, 4, 0.5], [1, 2, 1]];
      const known = new Uint8Array(H);
      let from = 0;
      for (const [first, step, until] of passes) {
        const share = Math.max(0, Math.min(1, (f - from) / (until - from)));
        const count = Math.floor((share * (H - first)) / step + 1e-9);
        for (let i = 0; i < count; i++) known[first + i * step] = 1;
        from = until;
      }
      let last = -1;
      for (let r = 0; r < H; r++) {
        if (known[r]) last = r;
        if (last >= 0) g.drawImage(full, 0, last, W, 1, 0, r, W, 1); // repeat the nearest row received
      }
    } else {
      let from = 0;
      let previous = null;
      for (const [until, block] of SCANS) {
        const share = Math.max(0, Math.min(1, (f - from) / (until - from)));
        const rows = Math.floor(share * H);
        if (rows) g.drawImage(levels.get(block), 0, 0, W, rows, 0, 0, W, rows);
        else if (!previous && share === 0) break;
        previous = block;
        from = until;
        if (share < 1) break;
      }
    }
    const t = f * total();
    readout.textContent = `${duration(t)} of ${duration(total())} · ${number((f * BYTES) / 1000)} of ${number(BYTES / 1000)} kB`;
  }

  function tick() {
    if (!playing) return;
    const f = Math.min(1, (performance.now() - startedAt) / 1000 / total());
    pos.value = String(f);
    draw();
    if (f >= 1) {
      playing = false;
      playButton.textContent = '▶ Start download';
      return;
    }
    if (reducedMotion.matches) setTimeout(tick, 250);
    else requestAnimationFrame(tick);
  }
  function play() {
    if (Number(pos.value) >= 1) pos.value = '0';
    startedAt = performance.now() - Number(pos.value) * total() * 1000;
    playing = true;
    playButton.textContent = '❚❚ Pause';
    tick();
  }
  function pause() {
    playing = false;
    playButton.textContent = '▶ Continue';
  }
  playButton.addEventListener('click', () => (playing ? pause() : play()));
  el.querySelector('.restart').addEventListener('click', () => {
    pos.value = '0';
    if (playing) play();
    else draw();
  });
  pos.addEventListener('input', () => {
    if (playing) startedAt = performance.now() - Number(pos.value) * total() * 1000;
    draw();
  });
  speed.addEventListener('change', () => {
    if (playing) startedAt = performance.now() - Number(pos.value) * total() * 1000;
    draw();
  });
  el.querySelector('[role="radiogroup"]').addEventListener('click', (e) => {
    const button = e.target.closest('[data-mode]');
    if (!button) return;
    for (const b of button.parentElement.children) b.setAttribute('aria-checked', String(b === button));
    mode = button.dataset.mode;
    draw();
  });
  draw();
}
