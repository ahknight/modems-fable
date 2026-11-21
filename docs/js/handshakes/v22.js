// 1200 and 2400 bit/s: ITU-T V.22 and V.22 bis.
//
// Sources: V.22 (1988) clauses 2, 5 and 6.3.1; V.22 bis (1988) clauses 2, 5
// and 6.3.1 with Table 1 and Figure 2; V.25 (1996) clause 4 for the answer
// sequence. The 2225 Hz "Bell" answer follows the note under V.22 6.3.1.1.

import { asyncText, scrambler, tone } from '../dsp/core.js';
import { AMP, ANSWERER, Burst, CALLER, Call } from './call.js';

const BAUD = 600;
const T = 1 / BAUD;
const LOW = 1200;
const HIGH = 2400;
const ALPHA = 0.75; // V.22 2.4: square root of raised cosine, 75% roll-off

/** Quadrant advance for each dibit (Table 1/V.22 bis): 00 +90, 01 0, 11 +270, 10 +180 degrees. */
const TURN = { '00': 1, '01': 0, 11: 3, 10: 2 };
/** Point within the first quadrant for the last two bits of a quadbit (Figure 2/V.22 bis). */
const INNER = { '00': [1, 1], '01': [3, 1], 10: [1, 3], 11: [3, 3] };

const rotate = ([x, y], quarterTurns) => {
  for (let i = 0; i < (quarterTurns & 3); i++) [x, y] = [-y, x];
  return [x, y];
};

export const V22_POINTS = [0, 1, 2, 3].map((q) => rotate(INNER['01'], q));
export const V22BIS_POINTS = [0, 1, 2, 3].flatMap((q) => Object.values(INNER).map((p) => rotate(p, q)));
const POWER = 10; // mean-square of both constellations

/** Differential encoder shared by both rates; remembers the current quadrant. */
export function v22Encoder() {
  let quadrant = 0;
  return {
    /** 1200 bit/s: one dibit per symbol, always the "01" point of the quadrant. */
    dibits(bits) {
      const out = [];
      for (let i = 0; i + 1 < bits.length; i += 2) {
        quadrant = (quadrant + TURN[`${bits[i]}${bits[i + 1]}`]) & 3;
        out.push(rotate(INNER['01'], quadrant));
      }
      return out;
    },
    /** 2400 bit/s: two bits turn the quadrant, two pick the point inside it. */
    quadbits(bits) {
      const out = [];
      for (let i = 0; i + 3 < bits.length; i += 4) {
        quadrant = (quadrant + TURN[`${bits[i]}${bits[i + 1]}`]) & 3;
        out.push(rotate(INNER[`${bits[i + 2]}${bits[i + 3]}`], quadrant));
      }
      return out;
    },
  };
}

const ones = (n) => new Array(n).fill(1);
const symbols = (seconds) => Math.round(seconds * BAUD);

/** One modem's transmitter: scrambler, encoder and the burst it writes to. */
function transmitter(call, who, carrier, t0) {
  const scramble = scrambler(14, 17);
  const enc = v22Encoder();
  const burst = new Burst(call, who, { symRate: BAUD, carrier, alpha: ALPHA, t0 });
  const section = (pts, label, fidelity, note, ideal) => burst.add(pts, { label, fidelity, note, power: POWER, ideal });
  return {
    burst,
    /** Unscrambled binary 1 at 1200 bit/s: every dibit is 11, a steady -90 degrees per symbol. */
    usb1: (n, note) => section(enc.dibits(ones(2 * n)), 'USB1', 'nominal', note, V22_POINTS),
    /** S1: unscrambled alternating dibits 00 and 11 (V.22 bis 6.3.1.1.1 b). */
    s1: () => section(enc.dibits(Array.from({ length: 60 }, (_, i) => (i % 2 ? [1, 1] : [0, 0])).flat()), 'S1', 'spec', 'V.22 bis: unscrambled double-dibit pattern 00, 11 at 1200 bit/s for 100 ± 3 ms.', V22_POINTS),
    sb1: (n, fidelity, note) => section(enc.dibits(ones(2 * n).map(scramble)), 'SB1 1200', fidelity, note, V22_POINTS),
    sb1Fast: (n) => section(enc.quadbits(ones(4 * n).map(scramble)), 'SB1 2400', 'spec', 'V.22 bis: scrambled binary 1 at 2400 bit/s for 200 ± 10 ms, on all sixteen points.', V22BIS_POINTS),
    data: (bits, fast, note) => section(fast ? enc.quadbits(bits.map(scramble)) : enc.dibits(bits.map(scramble)), `Data ${fast ? 2400 : 1200}`, 'spec', note, fast ? V22BIS_POINTS : V22_POINTS),
  };
}

/**
 * A V.22 (1200) or V.22 bis (2400) call from answer to first data.
 * @param {object} [o]
 * @param {1200|2400} [o.rate]
 * @param {'v25'|'bell'} [o.answer] 2100 Hz CCITT answer sequence, or the 2225 Hz Bell 212A answer
 * @param {boolean} [o.guard] add the 1800 Hz guard tone some administrations required
 * @param {number} [o.delay] one-way propagation delay, seconds
 */
export function v22({ rate = 1200, answer = 'v25', guard = false, delay = 0.004 } = {}) {
  const fast = rate === 2400;
  const bell = answer === 'bell';
  const name = fast ? 'V.22 bis' : bell ? 'Bell 212A' : 'V.22';
  const origin = fast ? 'V.22 bis, 1984' : bell ? 'Bell 212A, 1976' : 'V.22, 1980';
  const call = new Call({ id: `v22-${rate}-${answer}`, title: `${name}, ${rate} bit/s`, standard: name });
  const rt = 2 * delay;

  // -- Answer sequence ---------------------------------------------------------
  const silence = 2.15;
  call.step(0, 'The line connects', 'The answering modem picks up and stays silent for about two seconds.', 'V.25, 1968');
  call.mark(ANSWERER, 0, silence, 'Silence', 'spec', 'V.25 4.3: 1.8 to 2.5 s of silence after going off-hook.');
  let usb1At = silence;
  if (bell) {
    call.step(silence, 'Answer tone: 2225 Hz', 'V.22 notes that some modems answer with a 2225 Hz tone here, the whistle of the 300 bit/s Bell 103; the Bell 212A, which had a 103 built in, is the obvious case. An old 300-baud caller hears a familiar friend and connects the old way; a 1200 caller accepts it too, because it sits almost exactly where the new standard’s idle signal does.', 'Bell 103, c. 1962');
  } else {
    const ans = 3.3;
    call.step(silence, 'Answer tone: 2100 Hz', 'The international answer tone, unchanged from 300 baud. It announces a modem and switches off the telephone network’s echo suppressors.', 'V.25, 1968');
    call.put(ANSWERER, silence, tone(2100, ans, { amp: AMP }), 'ANS 2100 Hz', 'spec', 'V.25: 2100 ± 15 Hz for 3.3 ± 0.7 s, then 75 ± 20 ms of silence.');
    usb1At = silence + ans + 0.075;
  }

  // -- Event times (V.22 6.3.1 / V.22 bis 6.3.1.1) ------------------------------
  const callerStart = usb1At + 0.155 + 0.456; // detect USB1 for 155 ms, wait 456 ms
  let answererScrambled; // answerer begins scrambled ones at 1200
  let answererS1 = null;
  let callerFastAt = null;
  let answererFastAt = null;
  let callerData;
  let answererData;
  if (fast) {
    const callerS1End = callerStart + 0.1;
    answererS1 = callerS1End + rt; // "at the end of receipt of this signal"
    answererScrambled = answererS1 + 0.1;
    answererFastAt = answererS1 + 0.6; // 600 ms after circuit 112 goes ON
    callerFastAt = answererS1 + 0.1 + 0.6;
    answererData = answererFastAt + 0.2;
    callerData = callerFastAt + 0.2;
  } else {
    answererScrambled = callerStart + rt + 0.27; // detect scrambled ones for 270 ms
    answererData = answererScrambled + 0.765;
    callerData = answererScrambled + 0.27 + 0.765;
  }
  const dataSeconds = 1.6;
  const end = Math.max(callerData, answererData) + dataSeconds;

  // -- Answering modem's transmission -------------------------------------------
  const ansTx = transmitter(call, ANSWERER, HIGH, usb1At);
  const usbNote = 'V.22 6.3.1.2: unscrambled binary 1 at 1200 bit/s. It lasts until the caller’s reply has been detected, so its length depends on the caller.';
  if (bell) {
    const bellNote = 'Bell 212A answer tone, 2225 Hz, as noted under V.22 6.3.1.1. Its length here follows the V.22 timers.';
    call.put(ANSWERER, usb1At, tone(2225, (fast ? answererS1 : answererScrambled) - usb1At, { amp: AMP }), '2225 Hz', 'nominal', bellNote);
    ansTx.burst.t0 = fast ? answererS1 : answererScrambled;
  } else {
    ansTx.usb1(symbols((fast ? answererS1 : answererScrambled) - usb1At), usbNote);
  }
  if (fast) {
    ansTx.s1();
    ansTx.sb1(symbols(answererFastAt - answererScrambled), 'spec', 'V.22 bis: scrambled binary 1 at 1200 bit/s until 600 ms after the rate decision.');
    ansTx.sb1Fast(symbols(0.2));
  } else {
    ansTx.sb1(symbols(0.765), 'spec', 'V.22: scrambled binary 1 for 765 ± 10 ms before data.');
  }
  const banner = '\r\nWELCOME TO THE SYSTEM\r\nLOGIN: ';
  const bitsPerSym = fast ? 4 : 2;
  const pad = (bits, seconds) => bits.concat(ones(Math.max(0, symbols(seconds) * bitsPerSym - bits.length)));
  const dataNote = `Scrambled data, ${bitsPerSym} bits per symbol at 600 symbols per second. The text is our example.`;
  ansTx.data(pad(asyncText(banner), end - answererData), fast, dataNote);
  ansTx.burst.emit();
  if (guard) {
    // V.22 2.1: optional 1800 Hz guard tone, 6 dB below the data, sent only by the answering modem.
    call.lines[ANSWERER].add(ansTx.burst.t0, tone(1800, end - ansTx.burst.t0, { amp: AMP / 2 }));
  }

  // -- Calling modem's transmission ---------------------------------------------
  const callTx = transmitter(call, CALLER, LOW, callerStart);
  if (fast) {
    callTx.s1();
    callTx.sb1(symbols(callerFastAt - callerStart - 0.1), 'spec', 'V.22 bis: scrambled binary 1 at 1200 bit/s until 600 ms after the rate decision.');
    callTx.sb1Fast(symbols(0.2));
  } else {
    callTx.sb1(symbols(callerData - callerStart), 'spec', 'V.22: scrambled binary 1 until 765 ms after the answerer’s scrambled signal is detected.');
  }
  callTx.data(pad(ones(symbols(0.7) * bitsPerSym).concat(asyncText('GUEST\r')), end - callerData), fast, dataNote);
  callTx.burst.emit();
  call.mark(CALLER, usb1At, callerStart, 'Listening', 'spec', 'V.22 6.3.1.1: detect unscrambled ones for 155 ms, then stay silent a further 456 ms.');

  // -- Narration ---------------------------------------------------------------
  if (!bell) {
    call.step(usb1At, 'The answerer’s idle signal', 'After a 75 ms breath, the answering modem starts its real carrier at 2400 Hz and sends an endless string of ones. Because each pair of ones turns the carrier’s phase by the same quarter-turn 600 times a second, it sounds like a pure tone near 2250 Hz.', origin);
  }
  if (fast) {
    call.step(callerStart, 'The secret knock: S1', 'For a tenth of a second the caller sends a special rattling pattern called S1. An older 1200 bit/s modem ignores it. A 2400 bit/s modem recognizes it and sends the same knock back. That one exchange is how the two modems discover that they can both go faster.', 'V.22 bis, 1984');
    call.step(answererScrambled, 'Scrambled ones at 1200', 'Both modems now send scrambled ones at the old speed, and both sound like a rushing hiss in their own halves of the band: the caller centered on 1200 Hz, the answerer on 2400 Hz. They are giving each other something busy to lock on to.', 'V.22, 1980');
    call.step(answererFastAt, 'Shift up to 2400', 'Exactly 600 ms after the knock, each modem shifts up. The symbol rate and the pitch do not change, so you can barely hear it. What changes is that each symbol now lands on one of sixteen points instead of four, carrying four bits instead of two.', 'V.22 bis, 1984');
  } else {
    call.step(callerStart, 'The caller’s scrambled reply', 'The caller answers on 1200 Hz, and it does not sound like a tone at all. A scrambler has stirred its string of ones into a pseudo-random pattern, so the phase jumps unpredictably and the energy spreads into a rough hiss. That is deliberate: a busy signal is easier for the far end to lock on to than a pure tone.', origin);
    call.step(answererScrambled, 'Both ends scrambled', 'The answerer has recognized the caller and switches its own ones to scrambled. Now there are two bands of hiss, low and high. Each modem counts off 765 ms to let the other settle.', origin);
  }
  call.step(Math.min(callerData, answererData), 'Data', `Connected at ${rate} bit/s. The sound does not change when real data starts flowing, and that is the point: the scrambler makes a login prompt sound exactly like idle. From here on, a modem’s song is noise to human ears.`, origin);
  call.end = end;
  return call.finish();
}
