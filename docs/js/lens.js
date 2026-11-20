// The "lens": a close-up of what one modem is transmitting at the playhead.
// Depending on the signal it shows bits (FSK), a constellation (PSK/QAM),
// a ladder of voltage levels (V.90 PCM) or the raw waveform (tones).

const TAU = 2 * Math.PI;

/** Which track of `tracks` covers time `t` for lane `who`? */
function covering(tracks, who, t, length) {
  return tracks.find((track) => track.who === who && t >= track.t0 && t < track.t0 + length(track));
}

/**
 * Decide what the lens should show for one lane.
 * @returns {{mode: 'bits'|'points'|'levels'|'wave'|'idle', track?: object, caption: string}}
 */
export function lensMode(call, who, t) {
  const bits = covering(call.bitTracks, who, t, (b) => b.bits.length / b.baud);
  if (bits) return { mode: 'bits', track: bits, caption: `${bits.baud} bits per second, two tones` };
  const points = covering(call.symbolTracks, who, t, (s) => (s.points.length >> 1) / s.symRate);
  if (points) {
    const k = Math.floor((t - points.t0) * points.symRate);
    const section = points.sections.find((s) => k >= s.from && k < s.to);
    const lit = points.points[2 * k] !== 0 || points.points[2 * k + 1] !== 0;
    if (section && lit) {
      const count = section.ideal ? section.ideal.length >> 1 : 0;
      const what = count > 1 ? `${count.toLocaleString('en-US')} possible points` : 'carrier phase';
      return { mode: 'points', track: points, section, k, caption: `${Math.round(points.symRate).toLocaleString('en-US')} symbols per second · ${what}` };
    }
  }
  const levels = covering(call.pcmTracks, who, t, (p) => p.values.length / p.rate);
  if (levels) {
    const k = Math.floor((t - levels.t0) * levels.rate);
    const section = levels.sections.find((s) => k >= s.from && k < s.to);
    const count = section?.levels ? section.levels.length * 2 : 0;
    return { mode: 'levels', track: levels, section, k, caption: `8,000 samples per second${count ? ` · ${count} voltage levels in play` : ''}` };
  }
  const active = call.segments.some((s) => s.who === who && t >= s.t0 && t < s.t1 && !/^(Silence|Waiting|Detecting|Listening)/.test(s.label));
  return active ? { mode: 'wave', caption: 'Waveform, 12 milliseconds' } : { mode: 'idle', caption: 'Silent' };
}

function clear(g, w, h, theme) {
  g.clearRect(0, 0, w, h);
  g.fillStyle = theme.panel;
  g.fillRect(0, 0, w, h);
}

function drawBits(g, w, h, { track }, t, theme, color) {
  const { bits, baud, chars, t0, mark, space, wide } = track;
  const span = wide ? 44 : 32; // bits visible
  const now = (t - t0) * baud;
  const first = Math.floor(now - span / 2);
  const cell = w / span;
  const x = (bit) => (bit - (now - span / 2)) * cell;
  const top = h * 0.36;
  const bottom = h * 0.66;
  const font = `${Math.round(Math.min(13, h * 0.085))}px ${theme.mono}`;

  // Tone labels.
  g.font = font;
  g.fillStyle = theme.dim;
  g.textAlign = 'left';
  g.textBaseline = 'middle';
  g.fillText(`1 = ${mark} Hz`, 6, top - 12);
  g.fillText(`0 = ${space} Hz`, 6, bottom + 12);

  // Character frames: shade each ten-bit frame and name it.
  g.textAlign = 'center';
  for (const { bit, ch } of chars) {
    const width = (wide && (ch === 'ten ones' || ch === 'sync') ? 10 : wide && ch.startsWith('CJ') ? 30 : 10) * cell;
    if (x(bit) > w || x(bit) + width < 0) continue;
    g.fillStyle = theme.shade;
    g.fillRect(x(bit) + 1, top - 4, width - 2, bottom - top + 8);
    g.fillStyle = theme.text;
    const label = wide ? ch : ch === '\r' ? 'CR' : ch === '\n' ? 'LF' : ch === ' ' ? 'space' : `“${ch}”`;
    g.save();
    g.beginPath();
    g.rect(x(bit), 0, width, h);
    g.clip();
    g.fillText(label, x(bit) + width / 2, h * 0.14);
    g.restore();
  }

  // The square wave.
  g.strokeStyle = color;
  g.lineWidth = 2;
  g.beginPath();
  let previous = null;
  for (let b = Math.max(0, first - 1); b <= first + span + 1 && b < bits.length; b++) {
    const y = bits[b] ? top : bottom;
    if (previous === null) g.moveTo(x(b), y);
    else if (previous !== y) g.lineTo(x(b), y);
    g.lineTo(x(b + 1), y);
    previous = y;
  }
  g.stroke();

  // Bit values.
  g.fillStyle = theme.dim;
  if (cell > 8) {
    for (let b = Math.max(0, first); b <= first + span && b < bits.length; b++) g.fillText(String(bits[b]), x(b + 0.5), h * 0.86);
  }
  playhead(g, w / 2, h, theme);
}

function playhead(g, x, h, theme) {
  g.strokeStyle = theme.head;
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(x, 0);
  g.lineTo(x, h);
  g.stroke();
}

function drawPoints(g, w, h, { track, section, k }, theme, color) {
  const { points, symRate } = track;
  const ideal = section.ideal;
  let reach = 1.2;
  if (ideal) for (let i = 0; i < ideal.length; i++) reach = Math.max(reach, Math.abs(ideal[i]) * 1.12);
  const size = Math.min(w, h);
  const cx = w / 2;
  const cy = h / 2;
  const scale = (size / 2 - 6) / reach;
  const px = (re) => cx + re * scale;
  const py = (im) => cy - im * scale;

  g.strokeStyle = theme.grid;
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(px(-reach), cy);
  g.lineTo(px(reach), cy);
  g.moveTo(cx, py(-reach));
  g.lineTo(cx, py(reach));
  g.stroke();

  if (ideal) {
    const count = ideal.length >> 1;
    const r = count > 400 ? 0.9 : count > 64 ? 1.4 : 2.2;
    g.fillStyle = theme.dim;
    for (let i = 0; i < ideal.length; i += 2) {
      g.beginPath();
      g.arc(px(ideal[i]), py(ideal[i + 1]), r, 0, TAU);
      g.fill();
    }
  } else {
    g.strokeStyle = theme.grid;
    g.beginPath();
    g.arc(cx, cy, scale, 0, TAU);
    g.stroke();
  }

  // The last 50 ms of symbols, newest brightest. Slow modems also get the path between them.
  const trail = Math.max(8, Math.min(240, Math.round(symRate * 0.05)));
  const from = Math.max(section.from, k - trail);
  if (symRate <= 700) {
    g.strokeStyle = color;
    g.globalAlpha = 0.35;
    g.lineWidth = 1.5;
    g.beginPath();
    for (let i = from; i <= k; i++) {
      if (i === from) g.moveTo(px(points[2 * i]), py(points[2 * i + 1]));
      else g.lineTo(px(points[2 * i]), py(points[2 * i + 1]));
    }
    g.stroke();
  }
  g.fillStyle = color;
  for (let i = from; i <= k; i++) {
    g.globalAlpha = 0.15 + (0.85 * (i - from + 1)) / (k - from + 1);
    g.beginPath();
    g.arc(px(points[2 * i]), py(points[2 * i + 1]), i === k ? 5 : 2.6, 0, TAU);
    g.fill();
  }
  g.globalAlpha = 1;
  g.strokeStyle = theme.text;
  g.lineWidth = 1.5;
  g.beginPath();
  g.arc(px(points[2 * k]), py(points[2 * k + 1]), 7, 0, TAU);
  g.stroke();
}

function drawLevels(g, w, h, { track, section, k }, theme, color) {
  const { values } = track;
  const show = 72; // 9 ms
  let reach = 0.05;
  const from = Math.max(section ? section.from : 0, k - show + 1);
  for (let i = from; i <= k; i++) reach = Math.max(reach, Math.abs(values[i]));
  if (section?.levels) for (const v of section.levels) reach = Math.max(reach, v);
  reach *= 1.1;
  const cy = h / 2;
  const y = (v) => cy - (v / reach) * (h / 2 - 6);
  const ladder = w * 0.82;

  // The rungs: every level the transmitter may use in this signal.
  g.strokeStyle = theme.grid;
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(0, cy);
  g.lineTo(w, cy);
  g.stroke();
  if (section?.levels) {
    g.strokeStyle = theme.dim;
    g.globalAlpha = section.levels.length > 40 ? 0.45 : 0.8;
    g.beginPath();
    for (const v of section.levels) {
      for (const s of [1, -1]) {
        g.moveTo(ladder, y(s * v));
        g.lineTo(w - 4, y(s * v));
      }
    }
    g.stroke();
    g.globalAlpha = 1;
  }

  // The samples as stems, newest at the right.
  const step = (ladder - 8) / show;
  g.strokeStyle = color;
  g.fillStyle = color;
  for (let i = from; i <= k; i++) {
    const x = ladder - 6 - (k - i) * step;
    g.globalAlpha = 0.25 + (0.75 * (i - from + 1)) / (k - from + 1);
    g.beginPath();
    g.moveTo(x, cy);
    g.lineTo(x, y(values[i]));
    g.stroke();
    g.beginPath();
    g.arc(x, y(values[i]), 2, 0, TAU);
    g.fill();
  }
  g.globalAlpha = 1;
  g.beginPath();
  g.arc(ladder + (w - 4 - ladder) / 2, y(values[k]), 4, 0, TAU);
  g.fill();
}

function drawWave(g, w, h, samples, sampleRate, t, theme, color) {
  const half = Math.round(0.006 * sampleRate);
  const centre = Math.round(t * sampleRate);
  g.strokeStyle = theme.grid;
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(0, h / 2);
  g.lineTo(w, h / 2);
  g.stroke();
  if (!samples) return;
  g.strokeStyle = color;
  g.lineWidth = 1.5;
  g.beginPath();
  for (let i = -half; i <= half; i++) {
    const v = samples[centre + i] || 0;
    const x = ((i + half) / (2 * half)) * w;
    const y = h / 2 - v * h * 0.9;
    if (i === -half) g.moveTo(x, y);
    else g.lineTo(x, y);
  }
  g.stroke();
}

/**
 * Draw one lane's lens.
 * @param {CanvasRenderingContext2D} g
 * @param {object} state from `lensMode`
 * @param {Float32Array|null} samples the lane's audio, if still in memory
 */
export function drawLens(g, w, h, state, samples, sampleRate, t, theme, color) {
  clear(g, w, h, theme);
  if (state.mode === 'bits') drawBits(g, w, h, state, t, theme, color);
  else if (state.mode === 'points') drawPoints(g, w, h, state, theme, color);
  else if (state.mode === 'levels') drawLevels(g, w, h, state, theme, color);
  else if (state.mode === 'wave') drawWave(g, w, h, samples, sampleRate, t, theme, color);
  else {
    g.fillStyle = theme.dim;
    g.font = `13px ${theme.mono}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('· silent ·', w / 2, h / 2);
  }
}
