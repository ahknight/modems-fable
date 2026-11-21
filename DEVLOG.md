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

### 18:00 — V.32, V.8, V.34, V.90 synthesis

- `v32.js`: ranging (AA/CC against AC/CA/AC with 64T turnarounds), S/S̄/TRN, rate and E
  words, Wei's 8-state trellis encoder, 32- and 128-point mappings. The encoder
  equations were derived from Figure 2/V.32 by tracing the diagram; the 128-point map
  was transcribed from Figure 2-1/V.32 bis and then checked by its rotational symmetry
  (rotation flips Y0 and permutes Y1Y2; uncoded bits unchanged). All 128 labels pass,
  which a misread would not.
- `v8.js`: ANSam, CM/JM/CJ with real octets; optional V.8 bis CRe.
- `v34.js`: INFO frames with CRC, Tone A/B ranging, L1/L2 probing, PP, TRN, J, MP, E.
  Phase 2 is written once in terms of V.34's "call" and "answer" roles so V.90 can
  reuse it with the roles swapped.
- `v90.js`: µ-law Sd/S̄d/TRN1d/Jd/Jd′/Ri from the Ucode table; the DIL with an invented
  descriptor; approximated Phase 4 and data.
- Decision: **V.34 and V.90 data modes are approximations and say so.** Implementing
  shell mapping, the 4D trellis code and precoding (and V.90's modulus encoder and
  spectral shaper) would be most of both standards for no audible or visible gain. The
  timeline shows these segments striped, and the page explains why.
- Found while testing: the 02/98 text of V.34 §10.1.2.1 gives the guard tone "at the
  nominal transmit power", which contradicts §10.1.2.3.1 (7 dB below) and would exceed
  the nominal total. Used −7 dB; recorded in `notes/fidelity.md`.
- Level budget: nominal level reduced from 0.2 to 0.15 RMS after the first V.90 build
  peaked at 2.2× full scale (the DIL exercises the loudest codewords while the other
  modem is sending scrambled ones). A test now asserts every call's mix stays below
  full scale.
- Tests: 21 passing. New ones decode V.32's printed TRN patterns from the audio,
  recover text from trellis-coded data, verify V.8 octets, V.34 probe tones, INFO CRC,
  J/J′ patterns and an MP frame, and V.90's PCM patterns.

### 19:30 — Player, build pipeline, design

- `player.js`: one reusable player. Spectrogram with one color per modem, labeled signal
  lanes with fidelity styling, a "First appeared" strata lane, two lens windows
  (bits / constellation / PCM ladder / waveform, chosen automatically from what each
  modem is sending), narration panel, per-modem mute, left/right split, guided mode.
- Narration and signal tables are rendered into the HTML at build time from the same
  builder output, so they are the no-JavaScript text alternative.
- Decision: the step list stays on screen permanently and the current step is
  highlighted, instead of captions that appear and vanish. That, plus "Pause after each
  step", is how the "text must stay long enough to read" requirement is met for
  segments that last 100 ms.
- Decision: no sound-producing object exists until a click. The test suite wraps
  `AudioContext` and asserts the count is zero after load and after all players have
  synthesized and drawn.
- Visual direction: warm paper, IBM Plex (self-hosted, OFL), huge monospaced speed
  numerals as chapter openers, dark instrument panels for every interactive.
- First real-browser run (Chromium) worked on the first try.

### 21:00 — Research in, chapters written

Four research fact sheets arrived (about 330 claims and 60 quotations, each with its
own disputed and could-not-verify lists). They corrected several things in my brief
and in common lore; the important ones are listed in `notes/sources.md`. The chapters
were written from the sheets and then each re-read against them; anything in a draft
that the sheets did not support was cut or hedged.

- 172 sources in `src/sources.json`; the build fails on an unknown key.
- Verified myself by fetching: Hayes technical reference (call waiting, comma), ITU
  Q.23 (DTMF), ITU E.180 tone list (U.S. dial and ringing tones), four patent titles.
- Decision: the site does not describe the "bong/boing" many people remember from 56k
  handshakes. I could not attribute it to a clause with confidence, and the brief is
  explicit about not presenting guesses as protocol behavior.
- American English throughout user-facing text (the ITU's "analogue", "signalling"
  appear only in titles of cited documents).

### 22:00 — Widgets and browser tests

- Six widgets: type-to-FSK, constellation under noise, download-time calculator,
  image-loading simulator (three styles, with play/pause/restart/seek), Shannon
  capacity explorer, PCM level ladder. Each states its modeling assumptions in place.
- `tests/browser.mjs` passes in Chromium 159, Firefox 159 and WebKit 27.2 (Playwright
  1.65.1, headless). Two failures on the way were both test bugs: a bounding box read
  during a smooth scroll, and my own arithmetic for the expected download time.

### 23:00 — Media

- Media research returned 28 license-verified images (12 public domain, 5 CC0,
  11 CC BY; no ShareAlike on disk) with a manifest; 14 are used, including two I
  fetched after checking their metadata with `tools/commons.mjs`.
- Processed to ≤1280 px progressive JPEG; 1.4 MB total. One crop, to remove a video
  game visible at the edge of a photograph.
- Decision: no ShareAlike images, even though that costs us photographs of a Hayes
  Smartmodem and a Bell data set. The brief allows SA in collections; avoiding it
  keeps the license story simple.
- Decision: no third-party audio. See `notes/media.md`.

### Status at end of session 1

Done: all eight milestones plus prologue and epilogue; eight sidebars; ten players;
six widgets; 172 citations; 14 credited images; signal tests; three-engine browser
tests; documentation in `notes/`.

Unresolved (also in `notes/testing.md` and `notes/fidelity.md`):

1. Nobody has listened to the audio.
2. Nothing has been checked against a real modem, an independent implementation, or
   a recording.
3. Bell 103 and 212A behavior rests on secondary sources and on V.22's note.
4. V.34/V.90 data and V.90 Phase 4 downstream are approximations.
5. Handshakes are shorter than real ones (minimum training lengths, short detection
   times).
6. The spectrogram cannot be zoomed; dense stretches of the 56k call are cramped.
7. Not tested: shipping Safari/Firefox/Chrome applications, mobile, screen readers,
   the deployed GitHub Pages URL.

### 18:15 CST — Correction: the times in this journal

The section headings above carry clock times that I wrote without checking the
clock. Most are wrong, and the header says "US Pacific" when this machine is on US
Central time. Because this file is append-only I am correcting the record here
instead of editing the headings. The order of the entries is right; the times are not.

What the clock and `git log` actually say for 2026-11-20 (CST):

| Time | Event |
| --- | --- |
| about 16:00 | Session start; research agents launched; ITU specifications downloaded |
| 17:16 | Commit `b788acf`: DSP core, 300/1200/2400 synthesis, first signal tests |
| 17:30 | Commit `385a627`: V.32, V.8, V.34, V.90 synthesis; four research sheets in |
| 17:39 | Commit `daafd62`: player, lens, build pipeline, stylesheet |
| 18:03 | Commit `d714fb2`: all chapters, citations, widgets, three-engine browser tests |
| 18:12 | Commit `f889ead`: images, notes, README, LICENSE |

So the whole of "session 1" took a little over two hours, not the seven the headings
imply. Future entries will take their time from `date`.

### 18:16 CST — Zoom, and cheaper playback

- Added a 4× zoom to every player. The timeline scrolls sideways and follows the
  playhead; lane names and axis labels stay fixed. At 4× the 56k call's Phase 3 is
  legible: the DIL's stepped levels show as a staircase.
- Playback no longer repaints the spectrogram canvas. The dimming of the unplayed part
  is now an overlay element, so a frame costs two style updates plus the lens.
- Fixed: hovering a selected variant or the pressed zoom button made its label
  unreadable (hover background with selected text color).
- Browser suite re-run, with a new zoom check: Chromium, Firefox, WebKit all pass.
- An independent fact-check of the prose against the research sheets is running.
