# Development journal

Append-only. Newest entries at the bottom. Times are local (US Pacific) on the date given.

## 2026-11-20 — Session 1

### 16:00 — Brief read; plan

The brief: a static, GitHub Pages–hosted documentary site that takes the dial-up
handshake apart generation by generation (300 → 56k), with *synthesized, spec-faithful*
audio at each step, honest labelling of anything approximated, cited history, and
legally clean media. Original content is CC BY-NC 4.0.

Decisions made up front:

- **No framework, no runtime dependencies.** Plain ES modules, one stylesheet, one
  HTML page. A dependency-free Node script (`tools/build.mjs`) assembles `docs/index.html`
  from chapter partials and a source registry so citations are numbered consistently
  and broken citation keys fail the build. The built file is committed, so Pages needs
  no CI. Site root is `docs/` (Pages: branch `main`, folder `/docs`).
- **Audio is generated in the browser from the standards**, never shipped as files.
  This keeps the site small and makes "where exactly is this tone defined?" answerable
  in code. Generation runs in a module Web Worker; nothing plays until the user presses play.
- **One DSP library, shared by the page and the tests.** `docs/js/dsp/` is pure
  typed-array code with no DOM dependency, so `node --test` can demodulate the same
  audio the visitor hears and check it against the standard.
- **Every stretch of audio carries a fidelity label**: `spec` (waveform and duration
  per the cited clause), `nominal` (waveform per spec; duration depends on the modems or
  the line, representative value chosen), `approx` (a named simplification). The label
  is data on each timeline segment and is shown in the UI, so an approximation cannot
  be presented as protocol behaviour by accident.
- **Narration lives next to the signal that it describes** (in the handshake builders)
  and is rendered to static HTML at build time, so the step-by-step text is readable
  with JavaScript off and is the text alternative for the audio/visuals.

### 16:10 — Research fan-out

History, people, quotes and media licensing are independent of the DSP work, so five
background research agents were briefed to produce fact sheets (claim → source URL →
verbatim excerpt → confidence), a disputed-claims list, and a media manifest with
licence metadata pulled from the Wikimedia Commons API. Rule given to all of them:
Wikipedia is a lead, never a citation; nothing from memory; say "could not verify"
instead of filling a gap. Their output lands in `research/*.md`. I will spot-check the
load-bearing claims myself before they are cited.

### 16:15 — Primary technical sources

Downloaded the ITU-T Recommendations directly from itu.int (free PDFs) and read the
relevant clauses myself rather than relying on secondary descriptions:

| Rec. | Edition | Used for |
| --- | --- | --- |
| V.21 | 11/1988 | 300 bit/s FSK frequencies and channel assignment |
| V.25 | 10/1996 | 2100 Hz answer tone, silences, phase reversals |
| V.22 | 11/1988 | 1200 bit/s DPSK, scrambler, handshake timers |
| V.22 bis | 11/1988 | 16-point constellation, S1 exchange, 600 ms shift |
| V.32 | 03/1993 | AA/AC/CA/CC ranging, S/TRN/R/E, trellis encoder, mappings |
| V.32 bis | 02/1991 | rate signals, 128-point constellation |
| V.8 | 11/2000 | ANSam, CI/CM/JM/CJ coding |
| V.8 bis | 11/2000 | CRe/MRe dual-tone signals |
| V.34 | 02/1998 | INFO sequences, Tones A/B, L1/L2 probing, PP/TRN/J/MP, symbol rates |
| V.90 | 09/1998 | Ucodes, Sd/TRN1d/Jd/DIL, phases 3–4 |
| V.92 | 11/2000 | (prose only) |

The PDFs are copyrighted by ITU and are *not* committed (`research/specs/` is
git-ignored). Tables whose signs or figures did not survive text extraction (V.32
Tables 1–3, V.22 bis Figure 2, V.32 Figure 2, V.32 bis Figures 1 and 2-1) were read
from the rendered PDF pages.

Things the specs settled that I had wrong or fuzzy from memory:

- V.22's "unscrambled binary 1" is a constant −90° per symbol, i.e. a pure tone at
  2400 − 150 = 2250 Hz. That is why Bell 212A's 2225 Hz answer tone interoperates;
  V.22 §6.3.1.1 has a note acknowledging modems "which emit an answering tone of 2225 Hz".
- In V.90 Phase 2 the *analogue* (calling, client) modem plays the V.34 **answer** role
  (Tone A at 2400 Hz, INFO at 2400 Hz, answer-mode scrambler) and the digital (server)
  modem plays the V.34 **call** role, even though the server answered the phone.
- V.8 bis CRe is 1375 + 2002 Hz for 400 ms then 400 Hz for 100 ms, 12–15 dB down.

### 17:30 — DSP core and first three generations

- `docs/js/dsp/core.js`: tones (phase reversals, AM), continuous-phase FSK, async framing,
  self-synchronizing scramblers, root-raised-cosine QAM modulator that handles
  non-integer samples per symbol (needed for V.34's 2743 and 2800 symbol rates),
  µ-law Ucode table and 8 kHz→48 kHz PCM reconstruction, CRC-16.
- `docs/js/dsp/analysis.js`: FFT/spectrogram for the players; Goertzel, FSK and
  matched-filter QAM receivers for the tests.
- `docs/js/handshakes/`: `fsk300.js` (Bell 103 and V.21), `v22.js` (V.22, V.22 bis,
  and the Bell 212A-style 2225 Hz answer).
- Sample rate 48 kHz: exactly 6× the 8 kHz PCM clock (V.90) and an integer number of
  samples per symbol for 300, 600, 2400, 3000, 3200 and 3429 baud.
- Timeline convention: all times are "as heard at the calling modem's line terminals";
  the answering modem's reactions include a configurable round-trip delay.

**Tests performed** (`node --test`, 12 passing):

- Scrambler output equals the opening bit patterns printed in V.32 §5.2.3 for both
  generating polynomials (a spec-provided test vector).
- QAM modulator → matched-filter receiver round trip at 600, 2400, 3429 and 2743 baud.
- Bell 103 and V.21 audio demodulated by Goertzel bit-slicer back to the exact bit
  stream and text.
- V.22: 155 + 456 ms caller delay, 765 ms scrambled-ones period, USB1 energy at 2250 Hz,
  SB1 demodulated → differentially decoded → descrambled to all ones, typed text recovered.
- V.22 bis: 100 ms S1, 600 ms to shift, 200 ms at 2400, all 16 points used.

Caveat recorded now so it is not forgotten: these receivers are mine. The tests prove
the audio is self-consistent with my reading of the standards, not that a 1985 modem
would train on it. No hardware or third-party soft-modem was available to check against.
