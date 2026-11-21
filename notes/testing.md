# Tests performed, and tests not performed

## Performed

### Signal tests — `npm test` (Node 26, `node --test`), 21 tests

These import the same modules the browser runs, synthesize the audio, and analyze it.

| Area | What is checked | Independent of our transmitter? |
| --- | --- | --- |
| Scramblers | Output for an all-ones input equals the bit patterns printed in V.32 §5.2.3 for both polynomials | **Yes**: a vector printed in the standard |
| V.32 TRN | The first 15 symbols *demodulated from the audio* spell `CCCCCCCCCAAACCC` (call) and `CCCAACCCAACCACC` (answer), as printed in V.32 §5.2.3 | **Yes** |
| µ-law table | `ucodeLinear` equals seven rows of Table 1/V.90 | **Yes** |
| V.34 constellation numbering | Generated labels equal two rows of Figure 5/V.34 | **Yes** |
| V.32 / V.32 bis mappings | Every label obeys the figures' 90° rotation property | Partly: an internal consistency property of the published figure |
| Bell 103, V.21 | Carrier frequencies by Goertzel; whole bit stream and text recovered by an FSK slicer | No: our receiver |
| V.25 | 2100 Hz, 3.3 s, after 1.8–2.5 s of silence, and silent before | Timing against the standard's numbers |
| V.22 | 155 + 456 ms, 765 ms; unscrambled ones appear at 2250 Hz; SB1 demodulates, differentially decodes and descrambles to ones; typed text recovered | Timers yes; decode uses our receiver |
| V.22 bis | 100 ms S1, reply after it ends, 600 ms, 200 ms; all 16 points used | Timers yes |
| V.32, V.32 bis data | Audio sliced to the 32/128-point tables, Table 2 undone, descrambled; text recovered | No |
| V.8 | ANSam carrier and 15 Hz sideband ratio (0.1 for 20% AM); CM/JM bits; preamble, sync and call-function octet per Tables 1 and 3; CJ | Octet values against the standard |
| V.34 | 21 probe tones present at equal level, four omitted tones absent, L1 6 dB hotter and 160 ms; INFO0c demodulated, frame sync and CRC verified; TRN descrambles to ones; J and J′ equal Tables 18 and 19; MP frame and CRC recovered; E is twenty ones | Patterns against the standard; decode uses our receiver |
| V.90 | Roles swapped in Phase 2 (tone powers at 2400/1200 Hz in the right lanes); Sd and S̄d sample patterns; TRN1d signs are GPC-scrambled ones on one level; Sd's 1333 Hz fundamental in the audio; DIL covers requested codewords | Partly |
| Power limit | Example PCM constellations stay within −12 dBm0; spacing shrinks as speed rises | Arithmetic |
| Every call (13 variants) | Mixed peak below full scale; lanes never overlap; every segment has a valid fidelity label, a note, and lies inside the call; every `approx` note says so; narration present | — |

### Browser tests — `node tests/browser.mjs`, Playwright 1.65.1

Run on macOS 27.2 (arm64) on 2026-11-20 against:

- Chromium 159.0.8154.6 (headless)
- Firefox 159.0 (headless)
- WebKit 27.2 (headless; Playwright's build, the engine Safari uses)

All three pass. Per engine the script verifies: no console errors, failed requests or
off-site requests; no `AudioContext` before a click; all ten players synthesize and
draw; play, pause, restart, next step, seek by keyboard (Home/End on the slider, Enter
on buttons) and by clicking the picture; the playhead tracks the audio clock (1.5 s
after 1.6 s of play); guided mode stops at the step boundary; variants re-synthesize
and re-render the text; starting one player stops another; zoom stretches the
timeline four times and centers the playhead; all six widgets render and
respond with the expected computed values; playback under `prefers-reduced-motion`;
and, with JavaScript disabled, the presence of the step text, signal tables and sources.

### Looked at by eye

Screenshots from Chromium and WebKit of the masthead, chapter headers, players at
several playhead positions, and widgets, in light mode at 1280 px.

## Not performed

- **No listening test by a human.** The audio has been analyzed numerically and decoded
  by software, but nobody has listened to it during development. Level balance, the
  subjective character of each sound, and any click or artifact a spectrum check would
  miss are unverified.
- **No test against a real modem or an independent modem implementation.** Nothing here
  shows that hardware would train on these signals. Where a test says "decodes", it
  means our own receiver, written from the same reading of the standard.
- **No comparison against recordings** of real handshakes.
- **Real Safari, Firefox and Chrome applications** were not driven; the engines were,
  through Playwright's builds, headless. Differences in audio output devices, autoplay
  policy UI, and font rendering in the shipping browsers are untested.
- **No mobile browsers, no Windows or Linux, no touch input.** The layout has responsive
  rules that were not exercised on a device.
- **No screen-reader test.** Controls are native elements with labels, and the text
  alternatives exist, but no assistive technology was run. The brief excludes a full
  accessibility audit; this is not one.
- **Dark color scheme and narrow widths** have styles but were not systematically reviewed.
- **Performance on slow machines** was not measured. On the development machine the
  longest call synthesizes in about 0.15 s.
- **GitHub Pages itself.** The site was served locally from `docs/`; the deployed URL
  was not loaded.
