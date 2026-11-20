// Signal-generation primitives shared by every handshake synthesizer.
// Pure functions over typed arrays: no DOM, no Web Audio, so the same code
// runs in the page's worker and under `node --test`.

export const SR = 48000; // 6 x 8000: a V.90 PCM sample is exactly six output samples
export const TAU = 2 * Math.PI;

/** A growable mono signal that segments are mixed into at absolute times. */
export class Line {
  constructor(seconds = 8) {
    this.buf = new Float32Array(Math.ceil(seconds * SR));
    this.len = 0;
  }

  /** Mix `samples` in, starting at time `t` (seconds). */
  add(t, samples, gain = 1) {
    const start = Math.max(0, Math.round(t * SR));
    const end = start + samples.length;
    if (end > this.buf.length) {
      const grown = new Float32Array(Math.max(end, this.buf.length * 2));
      grown.set(this.buf);
      this.buf = grown;
    }
    for (let i = 0; i < samples.length; i++) this.buf[start + i] += samples[i] * gain;
    if (end > this.len) this.len = end;
    return this;
  }

  /** The signal, padded or trimmed to `seconds`. */
  render(seconds) {
    const out = new Float32Array(Math.ceil(seconds * SR));
    out.set(this.buf.subarray(0, Math.min(out.length, this.len)));
    return out;
  }
}

/** Raised-cosine fade in/out, so keyed tones do not click. */
function applyRamp(x, ramp) {
  const n = Math.min(Math.round(ramp * SR), x.length >> 1);
  for (let i = 0; i < n; i++) {
    const g = 0.5 - 0.5 * Math.cos((Math.PI * (i + 0.5)) / n);
    x[i] *= g;
    x[x.length - 1 - i] *= g;
  }
  return x;
}

/**
 * A sine tone.
 * @param {number} freq Hz
 * @param {number} dur seconds
 * @param {object} [o]
 * @param {number[]} [o.reversals] times (s, from tone start) of 180-degree phase reversals
 * @param {{freq:number, depth:number}} [o.am] sinusoidal amplitude modulation
 */
export function tone(freq, dur, { amp = 1, phase = 0, ramp = 0.002, reversals = [], am = null } = {}) {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  const flips = reversals.map((t) => Math.round(t * SR));
  let sign = 1;
  let next = 0;
  for (let i = 0; i < n; i++) {
    while (next < flips.length && i >= flips[next]) {
      sign = -sign;
      next++;
    }
    const env = am ? 1 + am.depth * Math.sin((TAU * am.freq * i) / SR) : 1;
    out[i] = amp * sign * env * Math.sin((TAU * freq * i) / SR + phase);
  }
  return applyRamp(out, ramp);
}

/** Sum of equal-length signals. */
export function mix(...signals) {
  const out = new Float32Array(Math.max(...signals.map((s) => s.length)));
  for (const s of signals) for (let i = 0; i < s.length; i++) out[i] += s[i];
  return out;
}

/**
 * Continuous-phase binary FSK.
 * @param {ArrayLike<number>} bits 1 = mark, 0 = space
 * @returns {Float32Array}
 */
export function fsk(bits, { baud, mark, space, amp = 1, ramp = 0.002 }) {
  const spb = SR / baud;
  const out = new Float32Array(Math.round(bits.length * spb));
  let phase = 0;
  for (let i = 0; i < out.length; i++) {
    const bit = bits[Math.min(bits.length - 1, Math.floor(i / spb))];
    phase += (TAU * (bit ? mark : space)) / SR;
    out[i] = amp * Math.sin(phase);
  }
  return applyRamp(out, ramp);
}

/** Asynchronous start-stop framing: start bit (0), data bits LSB first, stop bit(s) (1). */
export function asyncFrame(byte, { dataBits = 8, stopBits = 1 } = {}) {
  const bits = [0];
  for (let i = 0; i < dataBits; i++) bits.push((byte >> i) & 1);
  for (let i = 0; i < stopBits; i++) bits.push(1);
  return bits;
}

/** Bits for a text string sent as back-to-back async characters. */
export function asyncText(text, opts) {
  return [...text].flatMap((ch) => asyncFrame(ch.charCodeAt(0) & 0xff, opts));
}

/**
 * Self-synchronizing scrambler: out = in XOR out[n-a] XOR out[n-b].
 * This is "dividing by the generating polynomial 1 + x^-a + x^-b" in the
 * wording of V.22 (a=14, b=17), V.32 and V.34 (call: 18, 23; answer: 5, 23).
 */
export function scrambler(a, b) {
  let reg = 0; // bit k holds out[n-1-k]
  return (bit) => {
    const out = bit ^ ((reg >>> (a - 1)) & 1) ^ ((reg >>> (b - 1)) & 1);
    reg = ((reg << 1) | out) >>> 0;
    return out;
  };
}

/** The matching descrambler (used by tests to prove a signal decodes). */
export function descrambler(a, b) {
  let reg = 0;
  return (bit) => {
    const out = bit ^ ((reg >>> (a - 1)) & 1) ^ ((reg >>> (b - 1)) & 1);
    reg = ((reg << 1) | bit) >>> 0;
    return out;
  };
}

/** Root-raised-cosine impulse response, symbol period 1, unit energy. */
export function rrc(t, alpha) {
  if (Math.abs(t) < 1e-9) return 1 - alpha + (4 * alpha) / Math.PI;
  const edge = 1 / (4 * alpha);
  if (alpha > 0 && Math.abs(Math.abs(t) - edge) < 1e-9) {
    return (
      (alpha / Math.SQRT2) *
      ((1 + 2 / Math.PI) * Math.sin(Math.PI * edge) + (1 - 2 / Math.PI) * Math.cos(Math.PI * edge))
    );
  }
  const num = Math.sin(Math.PI * t * (1 - alpha)) + 4 * alpha * t * Math.cos(Math.PI * t * (1 + alpha));
  return num / (Math.PI * t * (1 - (4 * alpha * t) ** 2));
}

const PULSE_OS = 64; // table points per symbol period
const pulseCache = new Map();

function pulseTable(alpha, span) {
  const key = `${alpha}/${span}`;
  if (!pulseCache.has(key)) {
    const n = 2 * span * PULSE_OS + 1;
    const table = new Float32Array(n + 1);
    for (let i = 0; i < n; i++) {
      const t = i / PULSE_OS - span;
      const window = 0.5 + 0.5 * Math.cos((Math.PI * t) / span); // Hann, tames truncation
      table[i] = rrc(t, alpha) * window;
    }
    pulseCache.set(key, table);
  }
  return pulseCache.get(key);
}

/**
 * Quadrature amplitude modulation of a run of symbols.
 *
 * The pulse tails extend before the first symbol, so the buffer begins at
 * `start` (snapped to a whole sample) and symbol k is centred at `t0 + k/symRate`,
 * where the returned `t0` is the requested one moved by less than a sample.
 * Carrier phase is a function of absolute time, so separate bursts stay coherent.
 *
 * @param {Float32Array} sym interleaved [re, im, re, im, ...]
 * @param {object} o
 * @param {number} o.symRate symbols per second (need not divide the sample rate)
 * @param {number} o.carrier Hz
 * @param {number} o.alpha root-raised-cosine roll-off
 * @param {number} [o.t0] requested time of the first symbol
 * @returns {{samples: Float32Array, start: number, t0: number}}
 */
export function qam(sym, { symRate, carrier, alpha, span = 8, amp = 1, t0 = 0 }) {
  const count = sym.length >> 1;
  const sps = SR / symRate;
  const half = span * sps;
  const startSample = Math.round(t0 * SR - half);
  const n = Math.ceil((count - 1) * sps + 2 * half) + 2;
  const re = new Float32Array(n);
  const im = new Float32Array(n);
  const table = pulseTable(alpha, span);
  for (let k = 0; k < count; k++) {
    const a = sym[2 * k];
    const b = sym[2 * k + 1];
    if (a === 0 && b === 0) continue;
    const centre = half + k * sps;
    const first = Math.max(0, Math.ceil(centre - half));
    const last = Math.min(n - 1, Math.floor(centre + half));
    for (let i = first; i <= last; i++) {
      const pos = ((i - centre) / sps + span) * PULSE_OS;
      const j = pos | 0;
      const h = table[j] + (table[j + 1] - table[j]) * (pos - j);
      re[i] += a * h;
      im[i] += b * h;
    }
  }
  const out = new Float32Array(n);
  const w = (TAU * carrier) / SR;
  for (let i = 0; i < n; i++) {
    const ph = w * (startSample + i);
    out[i] = amp * (re[i] * Math.cos(ph) - im[i] * Math.sin(ph));
  }
  return { samples: out, start: startSample / SR, t0: (startSample + half) / SR };
}

/** Scale a symbol array (in place) to unit average power; returns the scale used. */
export function normalize(sym, scale) {
  if (scale === undefined) {
    let power = 0;
    for (let i = 0; i < sym.length; i++) power += sym[i] * sym[i];
    scale = 1 / Math.sqrt(power / (sym.length >> 1) || 1);
  }
  for (let i = 0; i < sym.length; i++) sym[i] *= scale;
  return scale;
}

// --- G.711 mu-law PCM, as indexed by V.90's "Ucodes" -------------------------

/**
 * Linear value of the mu-law codeword with V.90 Ucode `u` (0..127), in the
 * 16-bit-style scale of Table 1/V.90 (Ucode 127 = 32124).
 */
export function ucodeLinear(u) {
  const chord = u >> 4;
  const step = u & 15;
  return 4 * (((2 * step + 33) << chord) - 33);
}

export const PCM_RATE = 8000;
const UP = SR / PCM_RATE;
let reconstruction = null;

/** Windowed-sinc low-pass standing in for the line card's reconstruction filter. */
function reconstructionFilter() {
  if (!reconstruction) {
    const taps = 24 * UP + 1;
    const cutoff = 3700 / SR;
    reconstruction = new Float32Array(taps);
    const mid = (taps - 1) / 2;
    for (let i = 0; i < taps; i++) {
      const x = i - mid;
      const sinc = x === 0 ? 2 * cutoff : Math.sin(TAU * cutoff * x) / (Math.PI * x);
      const blackman = 0.42 - 0.5 * Math.cos((TAU * i) / (taps - 1)) + 0.08 * Math.cos((2 * TAU * i) / (taps - 1));
      reconstruction[i] = sinc * blackman * UP;
    }
  }
  return reconstruction;
}

/**
 * Turn a sequence of 8 kHz PCM sample values into line audio: what the
 * telephone company's digital-to-analogue converter would put on the wire.
 * Sample k lands at `t0 + k/8000`; the buffer begins at the returned `start`.
 * @returns {{samples: Float32Array, start: number}}
 */
export function pcm(values, { amp = 1, t0 = 0 } = {}) {
  const h = reconstructionFilter();
  const mid = (h.length - 1) / 2;
  const out = new Float32Array(values.length * UP + h.length);
  for (let k = 0; k < values.length; k++) {
    const v = values[k] * amp;
    if (v === 0) continue;
    const base = k * UP;
    for (let j = 0; j < h.length; j++) out[base + j] += v * h[j];
  }
  return { samples: out, start: t0 - mid / SR };
}

/** CRC used by V.34/V.90 INFO and MP frames: x^16 + x^12 + x^5 + 1, preset to ones, sent LSB first. */
export function crc16(bits) {
  let reg = 0xffff;
  for (const bit of bits) {
    const feedback = (reg ^ bit) & 1;
    reg >>>= 1;
    if (feedback) reg ^= 0x8408;
  }
  return Array.from({ length: 16 }, (_, i) => (reg >> i) & 1);
}

/** Small deterministic PRNG (mulberry32) so every visitor hears the same "random" data. */
export function prng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** `value` as `width` bits, least significant first. */
export function bitsLE(value, width) {
  return Array.from({ length: width }, (_, i) => (value >> i) & 1);
}
