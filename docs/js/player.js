// The handshake player: synchronized audio, spectrogram, signal lanes,
// narration and lens for one synthesized call.
//
// Nothing here makes a sound until the visitor presses a play control.

import { FIDELITY_NAMES, LANES, clock, era, escapeHtml, fidelitySummary, segmentsHtml, stepsHtml } from './annotate.js';
import { drawLens, lensMode } from './lens.js';
import { generate } from './synth.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const players = new Set();
let audio = null; // one AudioContext for the page, created on first play
let volume = 0.7;

function context() {
  if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
  return audio;
}

function themeFrom(el) {
  const css = getComputedStyle(el);
  const v = (name) => css.getPropertyValue(name).trim();
  return {
    lanes: [v('--caller'), v('--answerer'), v('--network')],
    panel: v('--screen'),
    text: v('--screen-text'),
    dim: v('--screen-dim'),
    grid: v('--screen-grid'),
    shade: v('--screen-shade'),
    head: v('--playhead'),
    mono: v('--mono'),
  };
}

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

export class Player {
  /** @param {HTMLElement} figure a `figure.player` produced by the build */
  constructor(figure) {
    this.figure = figure;
    this.name = figure.dataset.call;
    this.variants = JSON.parse(figure.dataset.variants || '[]');
    this.options = this.variants[0]?.options ?? JSON.parse(figure.dataset.options || '{}');
    this.t = 0;
    this.playing = false;
    this.loaded = false;
    this.muted = [false, false, false];
    this.split = false;
    this.guided = false;
    this.theme = themeFrom(figure);
    this.build();
    players.add(this);
    new IntersectionObserver((entries, observer) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        this.load();
      }
    }, { rootMargin: '700px' }).observe(figure);
    new ResizeObserver(() => this.loaded && this.paint()).observe(this.screen);
  }

  // --- Construction ----------------------------------------------------------

  build() {
    const mount = this.figure.querySelector('.p-mount');
    const variantButtons = this.variants.map((v, i) => `<button type="button" role="radio" aria-checked="${i === 0}" data-variant="${i}">${escapeHtml(v.label)}</button>`).join('');
    mount.innerHTML = `
      ${this.variants.length ? `<div class="p-variants" role="radiogroup" aria-label="Variant">${variantButtons}</div>` : ''}
      <div class="p-stage">
        <div class="p-screen">
          <canvas class="p-spectro" aria-hidden="true"></canvas>
          <div class="p-axis" aria-hidden="true"><span style="bottom:25%">1 kHz</span><span style="bottom:50%">2 kHz</span><span style="bottom:75%">3 kHz</span></div>
          <div class="p-status" role="status">Synthesizing from the standard…</div>
        </div>
        <div class="p-lanes" aria-hidden="true"></div>
        <div class="p-head-line" aria-hidden="true"></div>
      </div>
      <input class="p-seek" type="range" min="0" max="1" step="0.01" value="0" aria-label="Position in recording" disabled>
      <div class="p-transport">
        <button type="button" class="p-play" disabled><span class="icon" aria-hidden="true">▶</span> <span class="label">Play</span></button>
        <button type="button" class="p-restart" disabled title="Back to the start"><span aria-hidden="true">⏮</span><span class="sr">Restart</span></button>
        <button type="button" class="p-prev" disabled title="Previous step"><span aria-hidden="true">◀◀</span><span class="sr">Previous step</span></button>
        <button type="button" class="p-next" disabled title="Next step"><span aria-hidden="true">▶▶</span><span class="sr">Next step</span></button>
        <output class="p-time">0:00.0</output>
        <span class="p-spacer"></span>
        <span class="p-mix" role="group" aria-label="What to hear and see"></span>
        <label class="p-check"><input type="checkbox" class="p-split"> Split left/right</label>
        <label class="p-check" title="Stop at the end of each step so you can read"><input type="checkbox" class="p-guided"> Pause after each step</label>
        <label class="p-volume">Volume <input type="range" class="p-vol" min="0" max="1" step="0.05" value="${volume}"></label>
      </div>
      <div class="p-now">
        <div class="p-lenses"></div>
        <div class="p-caption">
          <p class="p-kicker"><span class="p-stepno"></span> <span class="p-origin"></span></p>
          <h4 class="p-step-title">Press play</h4>
          <p class="p-step-text">The picture above is a spectrogram: time runs left to right, pitch runs bottom (low) to top (high), and brightness is loudness. Each modem has its own color. The bars beneath it name every signal.</p>
        </div>
      </div>
      <p class="p-legend"><span class="key f-spec">${FIDELITY_NAMES.spec}</span> <span class="key f-nominal">${FIDELITY_NAMES.nominal}</span> <span class="key f-approx">${FIDELITY_NAMES.approx}</span> <span class="p-tally"></span></p>`;
    const q = (sel) => mount.querySelector(sel);
    Object.assign(this, {
      stage: q('.p-stage'), screen: q('.p-screen'), canvas: q('.p-spectro'), status: q('.p-status'), lanesEl: q('.p-lanes'), headLine: q('.p-head-line'),
      seek: q('.p-seek'), playButton: q('.p-play'), time: q('.p-time'), mixEl: q('.p-mix'), lensesEl: q('.p-lenses'),
      stepNo: q('.p-stepno'), originEl: q('.p-origin'), stepTitle: q('.p-step-title'), stepText: q('.p-step-text'), tally: q('.p-tally'),
    });
    this.stepsEl = this.figure.querySelector('.steps');
    this.segmentsEl = this.figure.querySelector('.seglist-body');

    this.playButton.addEventListener('click', () => (this.playing ? this.pause() : this.play()));
    q('.p-restart').addEventListener('click', () => this.seekTo(0));
    q('.p-prev').addEventListener('click', () => this.jump(-1));
    q('.p-next').addEventListener('click', () => this.jump(1));
    this.seek.addEventListener('input', () => this.seekTo(Number(this.seek.value)));
    q('.p-split').addEventListener('change', (e) => { this.split = e.target.checked; this.route(); });
    q('.p-guided').addEventListener('change', (e) => { this.guided = e.target.checked; if (this.playing) this.play(); });
    q('.p-vol').addEventListener('input', (e) => {
      volume = Number(e.target.value);
      for (const p of players) {
        p.figure.querySelector('.p-vol').value = volume;
        p.route();
      }
    });
    mount.querySelector('.p-variants')?.addEventListener('click', (e) => {
      const button = e.target.closest('[data-variant]');
      if (!button) return;
      for (const b of button.parentElement.children) b.setAttribute('aria-checked', String(b === button));
      this.options = this.variants[Number(button.dataset.variant)].options;
      this.pause();
      this.t = 0;
      this.load();
    });
    // Click or drag anywhere on the picture or the lanes to move the playhead.
    const scrub = (e) => {
      const box = this.stage.getBoundingClientRect();
      this.seekTo(Math.max(0, Math.min(1, (e.clientX - box.left) / box.width)) * this.duration);
    };
    this.stage.addEventListener('pointerdown', (e) => {
      if (!this.loaded || e.button !== 0) return;
      this.stage.setPointerCapture(e.pointerId);
      scrub(e);
      this.stage.addEventListener('pointermove', scrub);
      this.stage.addEventListener('pointerup', () => this.stage.removeEventListener('pointermove', scrub), { once: true });
    });
    this.figure.addEventListener('click', (e) => {
      const go = e.target.closest('.step-go');
      if (go && this.loaded) this.play(this.call.steps[Number(go.dataset.step)].t + 0.001);
    });
  }

  // --- Loading -----------------------------------------------------------------

  async load() {
    const ticket = (this.ticket = (this.ticket || 0) + 1);
    this.status.hidden = false;
    this.status.textContent = 'Synthesizing from the standard…';
    try {
      const { call, spectra } = await generate(this.name, this.options);
      if (ticket !== this.ticket) return;
      this.call = call;
      this.spectra = spectra;
      this.duration = call.duration;
      this.buffer = null;
      this.used = [0, 1, 2].filter((who) => call.segments.some((s) => s.who === who));
      this.renderStatic();
      this.loaded = true;
      this.status.hidden = true;
      for (const el of this.figure.querySelectorAll('.p-transport button, .p-seek')) el.disabled = false;
      this.seek.max = String(this.duration);
      this.paint();
      this.update();
      this.figure.dispatchEvent(new CustomEvent('player-ready', { bubbles: true }));
    } catch (error) {
      console.error(error);
      this.status.textContent = 'This browser could not synthesize the audio. The step-by-step description below still applies.';
    }
  }

  /** Everything that depends on the call but not on the playhead. */
  renderStatic() {
    const { call } = this;
    const lanes = call.lanes || LANES;
    this.mixEl.innerHTML = this.used.map((who) => `<label class="p-check lane-${who}"><input type="checkbox" data-lane="${who}" ${this.muted[who] ? '' : 'checked'}> ${escapeHtml(lanes[who])}</label>`).join('');
    for (const box of this.mixEl.querySelectorAll('input')) {
      box.addEventListener('change', () => {
        this.muted[Number(box.dataset.lane)] = !box.checked;
        this.image = null;
        this.route();
        this.paint();
      });
    }
    const pct = (t) => `${((100 * t) / this.duration).toFixed(3)}%`;
    const rows = this.used.map((who) => {
      const blocks = call.segments.filter((s) => s.who === who).map((s) => `<i class="seg f-${s.fidelity}" style="left:${pct(s.t0)};width:${pct(s.t1 - s.t0)}" title="${escapeHtml(`${s.label} — ${FIDELITY_NAMES[s.fidelity]}. ${s.note}`)}"><b>${escapeHtml(s.label)}</b></i>`).join('');
      return `<div class="lane lane-${who}"><span class="lane-name">${escapeHtml(lanes[who])}</span>${blocks}</div>`;
    });
    const strata = call.steps.map((s, i) => {
      const end = call.steps[i + 1]?.t ?? this.duration;
      return `<i class="seg era-${era(s.origin)}" style="left:${pct(s.t)};width:${pct(end - s.t)}" title="${escapeHtml(`${s.title} (${s.origin})`)}"><b>${escapeHtml(s.origin)}</b></i>`;
    }).join('');
    this.lanesEl.innerHTML = `${rows.join('')}<div class="lane lane-strata"><span class="lane-name">First appeared</span>${strata}</div>`;

    this.lensesEl.innerHTML = this.used.filter((who) => who < 2).map((who) => `<figure class="p-lens lane-${who}"><canvas width="10" height="10" aria-hidden="true"></canvas><figcaption><b>${escapeHtml(lanes[who])}</b> <span class="p-signal"></span><br><span class="p-lens-caption"></span></figcaption></figure>`).join('');
    this.lenses = [...this.lensesEl.querySelectorAll('.p-lens')].map((el) => ({
      who: Number(/lane-(\d)/.exec(el.className)[1]),
      canvas: el.querySelector('canvas'),
      signal: el.querySelector('.p-signal'),
      caption: el.querySelector('.p-lens-caption'),
    }));
    if (this.stepsEl) this.stepsEl.innerHTML = stepsHtml(call);
    if (this.segmentsEl) this.segmentsEl.innerHTML = segmentsHtml(call);
    const share = fidelitySummary(call);
    this.tally.textContent = `By duration of signal: ${share.spec + share.nominal}% per the standard, ${share.approx}% approximated.`;
    this.image = null;
    this.stepIndex = -2;
  }

  /** Combine the lanes' spectrograms into one picture, each in its own color. */
  spectrogramImage() {
    if (this.image) return this.image;
    const { cols, rows } = this.spectra[0];
    const image = new ImageData(cols, rows);
    const px = image.data;
    const tints = this.theme.lanes.map(rgb);
    const gain = new Float32Array(256);
    for (let v = 0; v < 256; v++) gain[v] = (v / 255) ** 1.7;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        let red = 0;
        let green = 0;
        let blue = 0;
        for (const who of this.used) {
          if (this.muted[who]) continue;
          const a = gain[this.spectra[who].data[c * rows + r]];
          red += tints[who][0] * a;
          green += tints[who][1] * a;
          blue += tints[who][2] * a;
        }
        const at = ((rows - 1 - r) * cols + c) * 4;
        px[at] = Math.min(255, red);
        px[at + 1] = Math.min(255, green);
        px[at + 2] = Math.min(255, blue);
        px[at + 3] = 255;
      }
    }
    const off = document.createElement('canvas');
    off.width = cols;
    off.height = rows;
    off.getContext('2d').putImageData(image, 0, 0);
    this.image = off;
    return off;
  }

  // --- Drawing -----------------------------------------------------------------

  /** Size a canvas for the display and return its context in CSS pixels. */
  fit(canvas) {
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

  /** Redraw the spectrogram: everything dim, the part already played at full brightness. */
  paint() {
    if (!this.loaded) return;
    const [g, w, h] = this.fit(this.canvas);
    const image = this.spectrogramImage();
    const x = (this.now() / this.duration) * w;
    g.fillStyle = this.theme.panel;
    g.fillRect(0, 0, w, h);
    g.imageSmoothingEnabled = true;
    g.globalAlpha = 0.42;
    g.drawImage(image, 0, 0, w, h);
    g.globalAlpha = 1;
    if (x > 0) {
      g.save();
      g.beginPath();
      g.rect(0, 0, x, h);
      g.clip();
      g.fillRect(0, 0, w, h);
      g.drawImage(image, 0, 0, w, h);
      g.restore();
    }
    g.strokeStyle = this.theme.grid;
    g.lineWidth = 1;
    g.beginPath();
    for (const f of [0.25, 0.5, 0.75]) {
      g.moveTo(0, Math.round(h * f) + 0.5);
      g.lineTo(w, Math.round(h * f) + 0.5);
    }
    g.stroke();
  }

  /** Bring every playhead-dependent part of the UI up to date. */
  update() {
    if (!this.loaded) return;
    const t = this.now();
    const { call } = this;
    this.paint();
    this.headLine.style.left = `${(100 * t) / this.duration}%`;
    if (document.activeElement !== this.seek || this.playing) this.seek.value = String(t);
    this.seek.setAttribute('aria-valuetext', `${clock(t)} of ${clock(this.duration)}`);
    this.time.textContent = `${clock(t)} / ${clock(this.duration)}`;

    let index = -1;
    while (index + 1 < call.steps.length && call.steps[index + 1].t <= t + 1e-6) index++;
    if (index !== this.stepIndex) {
      this.stepIndex = index;
      const step = call.steps[index];
      if (step) {
        this.stepNo.textContent = `Step ${index + 1} of ${call.steps.length}`;
        this.originEl.textContent = step.origin;
        this.originEl.className = `p-origin origin era-${era(step.origin)}`;
        this.stepTitle.textContent = step.title;
        this.stepText.textContent = step.text;
      }
      this.stepsEl?.querySelectorAll('li').forEach((li, i) => li.classList.toggle('is-current', i === index));
    }
    for (const lens of this.lenses) {
      const state = lensMode(call, lens.who, t);
      const [g, w, h] = this.fit(lens.canvas);
      drawLens(g, w, h, state, call.channels[lens.who], call.sampleRate, t, this.theme, this.theme.lanes[lens.who]);
      const seg = call.segments.find((s) => s.who === lens.who && t >= s.t0 && t < s.t1);
      const signal = seg ? `${seg.label} · ${FIDELITY_NAMES[seg.fidelity]}` : '';
      if (lens.signal.textContent !== signal) {
        lens.signal.textContent = signal;
        lens.signal.className = `p-signal ${seg ? `f-${seg.fidelity}` : ''}`;
        lens.signal.title = seg?.note ?? '';
      }
      if (lens.caption.textContent !== state.caption) lens.caption.textContent = state.caption;
    }
  }

  // --- Transport ---------------------------------------------------------------

  /** Playhead position in seconds. While playing, it follows the audio clock. */
  now() {
    if (!this.playing) return this.t;
    const heard = audio.currentTime - this.startedAt - (audio.outputLatency || 0);
    return Math.max(this.from, Math.min(this.until, heard));
  }

  audioBuffer() {
    if (!this.buffer) {
      const { channels, sampleRate } = this.call;
      this.buffer = context().createBuffer(3, channels[0].length, sampleRate);
      channels.forEach((samples, who) => this.buffer.copyToChannel(samples, who));
    }
    return this.buffer;
  }

  /** (Re)build the lane mixer and apply mute, split and volume settings. */
  route() {
    if (!audio) return;
    if (!this.graph) {
      const splitter = audio.createChannelSplitter(3);
      const merger = audio.createChannelMerger(2);
      const master = audio.createGain();
      const gains = [0, 1, 2].map((who) => [0, 1].map((ear) => {
        const gain = audio.createGain();
        splitter.connect(gain, who);
        gain.connect(merger, 0, ear);
        return gain;
      }));
      merger.connect(master).connect(audio.destination);
      this.graph = { splitter, gains, master };
    }
    const pan = [[1, 0.15], [0.15, 1], [0.6, 0.6]];
    this.graph.gains.forEach((pair, who) => pair.forEach((gain, ear) => {
      const level = this.muted[who] ? 0 : this.split ? pan[who][ear] : 0.75;
      gain.gain.setTargetAtTime(level, audio.currentTime, 0.01);
    }));
    this.graph.master.gain.setTargetAtTime(volume, audio.currentTime, 0.01);
  }

  /** Start playback at `from`. Always the result of a user action. */
  async play(from = this.t) {
    if (!this.loaded) return;
    const ctx = context();
    if (ctx.state !== 'running') await ctx.resume();
    for (const other of players) {
      if (other === this) continue;
      other.pause();
      other.buffer = null; // one decoded copy of the audio at a time is plenty
    }
    this.stopSource();
    if (from >= this.duration - 0.02) from = 0;
    let until = this.duration;
    if (this.guided) until = this.call.steps.find((s) => s.t > from + 0.02)?.t ?? this.duration;
    this.route();
    const source = ctx.createBufferSource();
    source.buffer = this.audioBuffer();
    source.connect(this.graph.splitter);
    source.onended = () => {
      if (this.source !== source) return;
      this.source = null;
      this.playing = false;
      this.t = until;
      this.setPlayLabel();
      this.update();
    };
    const when = ctx.currentTime + 0.03;
    source.start(when, from, until - from);
    Object.assign(this, { source, from, until, startedAt: when - from, playing: true });
    this.setPlayLabel();
    this.tick();
  }

  stopSource() {
    if (!this.source) return;
    this.source.onended = null;
    try {
      this.source.stop();
    } catch { /* never started */ }
    this.source.disconnect();
    this.source = null;
  }

  pause() {
    if (!this.playing) return;
    this.t = this.now();
    this.playing = false;
    this.stopSource();
    this.setPlayLabel();
    this.update();
  }

  seekTo(t) {
    if (!this.loaded) return;
    this.t = Math.max(0, Math.min(this.duration, t));
    if (this.playing) this.play(this.t);
    else this.update();
  }

  /** Move to the previous or next narration step. */
  jump(direction) {
    const { steps } = this.call;
    const t = this.now();
    const target = direction > 0 ? steps.find((s) => s.t > t + 0.05)?.t : [...steps].reverse().find((s) => s.t < t - 0.6)?.t ?? 0;
    if (target !== undefined) this.seekTo(target + 0.001);
  }

  setPlayLabel() {
    const atStepEnd = !this.playing && this.guided && this.t > 0.05 && this.t < this.duration - 0.05;
    this.playButton.querySelector('.icon').textContent = this.playing ? '❚❚' : '▶';
    this.playButton.querySelector('.label').textContent = this.playing ? 'Pause' : atStepEnd ? 'Continue' : 'Play';
    this.figure.classList.toggle('is-playing', this.playing);
  }

  tick() {
    if (!this.playing) return;
    this.update();
    // Under "reduce motion", follow the audio in coarse steps rather than a smooth sweep.
    if (reducedMotion.matches) setTimeout(() => this.tick(), 250);
    else requestAnimationFrame(() => this.tick());
  }
}

/** Enhance every player on the page. */
export function mountPlayers(root = document) {
  return [...root.querySelectorAll('figure.player')].map((figure) => new Player(figure));
}

// Free the page's audio when the tab is hidden: nothing should keep sounding unattended.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) for (const p of players) p.pause();
});
