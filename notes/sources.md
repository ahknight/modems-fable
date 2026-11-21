# How the sources were verified

## Technical values

Read directly from the ITU-T Recommendations, downloaded from itu.int on 2026-11-20
(editions listed in `DEVLOG.md`). The PDFs are ITU copyright and are not in this
repository; `research/specs/` is git-ignored. Where text extraction dropped signs,
superscripts or figures, the rendered page was read instead.

Two values were checked against other ITU documents during writing: the DTMF
frequencies (Q.23) and the North American dial and ringing tones (the E.180 national
tones list).

Bell System values are weaker. No AT&T document giving the Bell 103 frequencies in
hertz, and no Bell 212A technical reference, was found. See `fidelity.md`.

## History

Four research passes (origins; 1200–14 400; 28.8k–56k; epilogue and sidebars) were run
by assistant agents with these rules: every claim needs a source opened and read during
the pass; Wikipedia may be a lead but never a citation; quote a short supporting
excerpt; tag confidence; list disputes and gaps instead of filling them from memory.
Their fact sheets are `research/01`–`04-*.md` (about 3,000 lines, 330 claims, 60
quotations, with a "could not verify" list in each).

The prose was then written from those sheets, and each chapter was re-read against them.
Claims that appeared in a draft but not in the sheets were removed or hedged. Examples
of things cut for want of a source: "kitchen table" (every source says dining room);
"oil-field" in the Carterfone story; the first names of several engineers; Paul Baran's
role in packet switching; the expansion of "LPB/HPB"; "53.3k" as the U.S. cap (sources
say 53k or 54k); the reason for V.22's guard tone (kept, explicitly marked as untraced).

### Independent fact-check

After the chapters were written, a separate agent with no part in writing them compared
every cited sentence, quotation and caption against the fact sheets and reported 28
findings: no misattributed quotation and no missing citation key, but seven quotation
wordings to tighten, six wrong or unsupported specifics, three citations pointing at
the wrong source, and eleven over-claims. All were acted on. The most serious:

- The prologue told readers that the Bell 103's four frequencies "will still be on the
  line in 1998". They are not; the 56k handshake's 300 bit/s exchange uses V.21's.
- "In stores on February 24, 1997" for x2 modems; the source says shipped that day.
- "Three inventions, each about fifteen years old" at 9600; they date from 1965–66,
  1966 and 1976.
- Bell 212A behavior was stated as fact. It is now presented as an inference from
  V.22's note, and the chapter says Bell's specification was not found.
- "The first dial-up bulletin board", "invented to hide the modem", "how nearly every
  online game has worked since", and several lineage claims in the epilogue were
  stronger than the sources. They are now hedged or cut.

The checker also flagged dates it could not find in the fact sheets that come from
documents read directly for the synthesis (V.21: Geneva, 1964; V.25: Mar del Plata,
1968; the wording of V.22's 2225 Hz note). Those were re-confirmed against the ITU
texts and kept.

### Caveats that a careful reader should know

- **Most historical sources were not re-opened when the prose was written.** The
  research agents opened them and reported excerpts. Spot checks were made by fetching
  the Hayes technical reference (call waiting, the comma modifier), ITU Q.23 and E.180,
  and four patent titles. Everything else rests on the fact sheets.
- **Magazine quotations come from OCR text** of scans on archive.org. The agents
  repaired obvious OCR damage and flagged doubtful cases; quotations used large on the
  page should be checked against the page images before any print use.
- **Some sources were read from mirrors or the Wayback Machine** because the original
  blocked automated access. The source list says so for each.
- **Oral histories are recollections**, decades after the fact. Where a memory conflicts
  with a contemporary document, the document is preferred and the conflict is noted.
- **Prices** are list or advertised prices on the dates given, not inflation-adjusted.

## Disputes shown on the page

| Topic | What the page says |
| --- | --- |
| "Bell 101, 110 bit/s, 1958, from SAGE" | No primary source found; AT&T's own histories contradict it and each other |
| Year of the Bell 103 | "Early 1960s" per Bell Labs; 1962 only from later journalism |
| Inventor of the acoustic coupler | Weitbrecht (1964, TTY) best documented; Carterfone (1959, voice) and Livermore (c. 1965) complicate priority |
| When a registered modem could legally be plugged in | 1976, 1977 or 1978 depending on the milestone |
| Date of the Vadic VA3400 and Bell 212A | Announcement vs shipment vs redesign; September vs November 1976 |
| V.22 bis: 1982 or 1984 | Products to the draft in 1982; approval in 1984; fallback mode differed by maker |
| Trellis coding gain | Lucky "6 dB or so"; Forney 3 to 4; V.32's code about 3.6 |
| Capacity of a phone line | Estimates of about 35 and about 36 kbit/s; presented as estimates |
| Who invented 56k | Bell Labs (1992–93 work and patents) and Townshend (1994 application); litigated; no ruling found |
| U.S. 56k ceiling | FCC says 54k; vendors 53k; a proposed relaxation whose outcome was not found |
| FidoNet's peak size | One nodelist count of 35,787 (June 1995); other figures exist |
| CBBS's birthday | February 16, 1978 is the date its authors chose; the snow day was January 16 |
| DOCSIS 1.0's date | 1996 (CableLabs table), March 26, 1997 (the specification), 1999 (first certified modems); the page uses the specification date |

## Known gaps

Things the site would be better for and does not have, because no source was found:
the designer(s) of the Bell 103; a first-hand quotation from Thomas Carter or Dennis
Hayes (the Hayes quotations available are advertising copy); launch prices for the
first V.34 modems; a total count of U.S. dial-up subscribers at the peak; the text of
the FCC's Part 68 order; Bell's own handshake timing for the 103 and 212A.
