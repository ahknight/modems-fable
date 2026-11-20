// Analysis helpers: the spectrogram the players draw, and the small
// receivers the test-suite uses to prove that synthesized signals decode.

import { SR, TAU, rrc } from './core.js';

/** In-place radix-2 FFT. */
export function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let size = 2; size <= n; size <<= 1) {
    const half = size >> 1;
    const step = -TAU / size;
    for (let start = 0; start < n; start += size) {
      for (let k = 0; k < half; k++) {
        const c = Math.cos(step * k);
        const s = Math.sin(step * k);
        const a = start + k;
        const b = a + half;
        const tr = re[b] * c - im[b] * s;
        const ti = re[b] * s + im[b] * c;
        re[b] = re[a] - tr;
        im[b] = im[a] - ti;
        re[a] += tr;
        im[a] += ti;
      }
    }
  }
}

export const SPECTRO = {
  decimate: 4, // 48 kHz -> 12 kHz: everything of interest is below 4 kHz
  window: 256, // 21 ms at 12 kHz
  hop: 64, // 5.3 ms per column
  size: 1024, // zero-padded: 11.7 Hz per row
  maxHz: 4000,
  floorDb: -62,
};

/**
 * Short-time spectrum of a signal, quantized to bytes.
 * Each column is one instant; each row one pitch (row 0 = 0 Hz).
 * @returns {{data: Uint8Array, cols: number, rows: number, secondsPerCol: number, hzPerRow: number}}
 */
export function spectrogram(signal) {
  const { decimate, window, hop, size, maxHz, floorDb } = SPECTRO;
  const rate = SR / decimate;
  const n = Math.floor(signal.length / decimate);
  const low = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < decimate; j++) sum += signal[i * decimate + j];
    low[i] = sum / decimate;
  }
  const rows = Math.round((maxHz / rate) * size);
  const cols = Math.max(1, Math.ceil(n / hop));
  const data = new Uint8Array(cols * rows);
  const hann = Float32Array.from({ length: window }, (_, i) => 0.5 - 0.5 * Math.cos((TAU * i) / (window - 1)));
  const re = new Float32Array(size);
  const im = new Float32Array(size);
  const norm = 4 / window; // a full-scale sine reads 0 dB
  for (let c = 0; c < cols; c++) {
    re.fill(0);
    im.fill(0);
    const start = c * hop - (window >> 1);
    let energy = 0;
    for (let i = 0; i < window; i++) {
      const v = low[start + i] || 0;
      re[i] = v * hann[i];
      energy += v * v;
    }
    if (energy < 1e-9) continue;
    fft(re, im);
    for (let r = 0; r < rows; r++) {
      const db = 10 * Math.log10((re[r] * re[r] + im[r] * im[r]) * norm * norm + 1e-12);
      data[c * rows + r] = Math.max(0, Math.min(255, Math.round((1 - db / floorDb) * 255)));
    }
  }
  return { data, cols, rows, secondsPerCol: hop / rate, hzPerRow: rate / size };
}

/** Power of `signal[from..to)` at `freq`, relative to a full-scale sine (Goertzel). */
export function tonePower(signal, freq, from = 0, to = signal.length) {
  const w = (TAU * freq) / SR;
  const coeff = 2 * Math.cos(w);
  let s1 = 0;
  let s2 = 0;
  for (let i = from; i < to; i++) {
    const s0 = signal[i] + coeff * s1 - s2;
    s2 = s1;
    s1 = s0;
  }
  const n = to - from;
  return (s1 * s1 + s2 * s2 - coeff * s1 * s2) / ((n * n) / 4);
}

/** Demodulate binary FSK by comparing tone power in each bit period. */
export function demodFsk(signal, { baud, mark, space, t0, count }) {
  const spb = SR / baud;
  const bits = [];
  for (let k = 0; k < count; k++) {
    const from = Math.round(t0 * SR + k * spb);
    const to = Math.round(t0 * SR + (k + 1) * spb);
    bits.push(tonePower(signal, mark, from, to) > tonePower(signal, space, from, to) ? 1 : 0);
  }
  return bits;
}

/**
 * Coherent matched-filter QAM receiver for a signal made by `qam()`.
 * Returns the complex value at each symbol instant, interleaved [re, im, ...].
 */
export function demodQam(signal, { symRate, carrier, alpha, t0, count, span = 8 }) {
  const sps = SR / symRate;
  const out = new Float32Array(count * 2);
  const reach = Math.ceil(span * sps);
  for (let k = 0; k < count; k++) {
    const centre = t0 * SR + k * sps;
    let re = 0;
    let im = 0;
    for (let i = Math.ceil(centre - reach); i <= centre + reach; i++) {
      const v = signal[i];
      if (!v) continue;
      const h = rrc((i - centre) / sps, alpha);
      const ph = (TAU * carrier * i) / SR;
      re += v * h * Math.cos(ph);
      im -= v * h * Math.sin(ph);
    }
    out[2 * k] = (2 * re) / sps;
    out[2 * k + 1] = (2 * im) / sps;
  }
  return out;
}
