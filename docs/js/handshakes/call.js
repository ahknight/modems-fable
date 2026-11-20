// A "call" is the thing every handshake builder returns: three audio lanes
// (calling modem, answering modem, telephone network) plus the annotations
// that let the page say what is happening at every instant.
//
// All times are seconds as heard at the calling modem's end of the line.

import { Line, SR, mix, qam, tone } from '../dsp/core.js';

export const CALLER = 0;
export const ANSWERER = 1;
export const NETWORK = 2;

/**
 * Sine amplitude for the nominal transmit level: 0.15 RMS. Two modems talking
 * at once, plus the 6 dB boost of the V.34 probe and the loudest V.90 training
 * levels, must still sum to less than full scale (the test-suite checks).
 */
export const AMP = 0.15 * Math.SQRT2;

/**
 * How faithful a segment is. Shown as a badge on every timeline block.
 *  spec    - waveform follows the cited standard, including duration where the standard fixes it
 *  nominal - waveform follows the standard; its duration or start time depends on the modems
 *            and the line, so a representative value was chosen
 *  approx  - a labelled approximation; the note says what is simplified
 */
export const FIDELITY = ['spec', 'nominal', 'approx'];

export class Call {
  /** @param {{id: string, title: string, standard: string, lanes?: string[]}} meta */
  constructor({ id, title, standard, lanes = ['Calling modem', 'Answering modem', 'Telephone network'] }) {
    this.meta = { id, title, standard, lanes };
    this.lines = [new Line(), new Line(), new Line()];
    this.segments = [];
    this.steps = [];
    this.symbolTracks = [];
    this.bitTracks = [];
    this.pcmTracks = [];
    this.end = 0;
  }

  /** Record a lane block without adding audio. */
  mark(who, t0, t1, label, fidelity = 'spec', note = '') {
    this.segments.push({ who, t0, t1, label, fidelity, note });
    if (t1 > this.end) this.end = t1;
  }

  /** Mix audio into a lane and record its block. */
  put(who, t0, samples, label, fidelity, note) {
    this.lines[who].add(t0, samples);
    if (label) this.mark(who, t0, t0 + samples.length / SR, label, fidelity, note);
    return t0 + samples.length / SR;
  }

  /** A narration step begins at `t`; it lasts until the next one. */
  step(t, title, text, origin = '') {
    this.steps.push({ t, title, text, origin });
  }

  finish(tail = 0.25) {
    const duration = Math.ceil((this.end + tail) * 20) / 20;
    this.steps.sort((a, b) => a.t - b.t);
    this.segments.sort((a, b) => a.t0 - b.t0);
    return {
      ...this.meta,
      sampleRate: SR,
      duration,
      channels: this.lines.map((line) => line.render(duration)),
      segments: this.segments,
      steps: this.steps,
      symbolTracks: this.symbolTracks,
      bitTracks: this.bitTracks,
      pcmTracks: this.pcmTracks,
    };
  }
}

/**
 * One uninterrupted QAM transmission, assembled section by section and
 * modulated in a single pass so pulse shaping runs straight across the joins.
 */
export class Burst {
  constructor(call, who, { symRate, carrier, alpha, t0, span = 8, amp = AMP }) {
    Object.assign(this, { call, who, symRate, carrier, alpha, span, amp, t0 });
    this.points = [];
    this.sections = [];
  }

  get count() {
    return this.points.length >> 1;
  }

  /** Time at which the next symbol would start. */
  get time() {
    return this.t0 + this.count / this.symRate;
  }

  /**
   * Append symbols.
   * @param {number[][]} pts [re, im] pairs in the constellation's own units
   * @param {object} section
   * @param {number} section.power mean-square magnitude that should map to nominal level
   * @param {number[][]} [section.ideal] the full constellation, for the scope display
   */
  add(pts, { label, fidelity = 'spec', note = '', power, ideal = null, show = true }) {
    const scale = 1 / Math.sqrt(power);
    const from = this.count;
    for (const [re, im] of pts) this.points.push(re * scale, im * scale);
    this.sections.push({
      from,
      to: this.count,
      label,
      fidelity,
      note,
      scale,
      show,
      ideal: ideal && Float32Array.from(ideal.flatMap(([re, im]) => [re * scale, im * scale])),
    });
    return this;
  }

  /** Modulate, place on the line, and publish segments plus the symbol track. */
  emit() {
    if (!this.count) return this.t0;
    const points = Float32Array.from(this.points);
    const { samples, start, t0 } = qam(points, { ...this, t0: this.t0 });
    this.call.lines[this.who].add(start, samples);
    const at = (k) => t0 + k / this.symRate;
    for (const s of this.sections) {
      if (s.show && s.label) this.call.mark(this.who, at(s.from), at(s.to), s.label, s.fidelity, s.note);
    }
    this.call.symbolTracks.push({
      who: this.who,
      t0,
      symRate: this.symRate,
      points,
      sections: this.sections.map(({ from, to, label, ideal }) => ({ from, to, label, ideal })),
    });
    if (at(this.count) > this.call.end) this.call.end = at(this.count);
    return at(this.count);
  }
}

// --- The telephone network's own sounds --------------------------------------

/** DTMF frequency pairs, ITU-T Q.23. */
const DTMF_ROWS = [697, 770, 852, 941];
const DTMF_COLS = [1209, 1336, 1477, 1633];
const DTMF_KEYS = ['123A', '456B', '789C', '*0#D'];

export function dtmf(key, dur) {
  const row = DTMF_KEYS.findIndex((r) => r.includes(key));
  const col = DTMF_KEYS[row].indexOf(key);
  return mix(tone(DTMF_ROWS[row], dur, { amp: AMP * 0.6 }), tone(DTMF_COLS[col], dur, { amp: AMP * 0.75 }));
}

/**
 * Off-hook, dial tone, tone dialling, one ring, answer.
 * Tone frequencies follow the North American plan; durations are typical.
 * @returns {number} the time at which the far end answers
 */
export function dialPreamble(call, { digits = '5550142', t = 0.3 } = {}) {
  const dialTone = 1.1;
  call.step(t, 'Dial tone', 'The modem takes the phone off the hook, exactly as you would, and waits for the exchange to offer dial tone: 350 Hz and 440 Hz sounding together.', 'Telephone network');
  call.put(NETWORK, t, mix(tone(350, dialTone, { amp: AMP * 0.45 }), tone(440, dialTone, { amp: AMP * 0.45 })), 'Dial tone', 'nominal', '350 + 440 Hz (North American precise tone plan). Duration is however long the modem waits.');
  t += dialTone;
  call.step(t, 'Tone dialling', `Each digit of ${digits.slice(0, 3)}-${digits.slice(3)} is a pair of tones, one from a low group and one from a high group, so that speech is unlikely to imitate it. This is the same Touch-Tone signalling a telephone keypad sends.`, 'Touch-Tone, 1963');
  for (const key of digits) {
    call.put(CALLER, t, dtmf(key, 0.095), key, 'nominal', `DTMF "${key}" (ITU-T Q.23 frequency pair). Digit and gap lengths are modem settings; these are typical.`);
    t += 0.19;
  }
  t += 0.9;
  call.step(t, 'Ringing', 'The network rings the far end and plays ringback so the caller knows it is trying: 440 Hz and 480 Hz, two seconds on, four seconds off.', 'Telephone network');
  call.put(NETWORK, t, mix(tone(440, 2, { amp: AMP * 0.4, ramp: 0.01 }), tone(480, 2, { amp: AMP * 0.4, ramp: 0.01 })), 'Ringback', 'nominal', '440 + 480 Hz, 2 s on / 4 s off (North American). The answering modem picks up after however many rings it is set to wait.');
  return t + 2.9;
}
