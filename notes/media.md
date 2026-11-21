# Third-party media and license obligations

All third-party media is stored in `docs/media/` and served from this site; nothing is
hot-linked. Every item came from Wikimedia Commons. License and author were read from
the Commons API (`extmetadata`) on 2026-11-20, not from search results; the full record
of that check, including candidates that were rejected, is
`research/media/MANIFEST.md`. The registry the site is built from is `src/media.json`,
which also generates the on-page credit beside each image and the credits list.

**Policy applied.** Only public-domain, CC0 and CC BY material is used. No ShareAlike
or NoDerivatives work is included, although ShareAlike photographs exist for several
subjects we would have liked to show (Hayes Smartmodem, Bell data sets, Telebit,
USRobotics Courier, Carterfone). None of these images is covered by the site's
CC BY-NC 4.0 license; each keeps the terms below.

| File in `docs/media/` | Subject | Author as credited | License | Changes made | Obligation |
| --- | --- | --- | --- | --- | --- |
| `sage-console.jpg` | SAGE console at the Computer History Museum | Tomwsulcer | CC0 | Resized | None; credited anyway |
| `teletype-33.jpg` | Teletype Model 33 ASR | PantheraLeo1359531 | CC BY 4.0 | Resized | Credit, link to license, note changes: done on page |
| `novation-cat.jpg` | Novation CAT acoustic coupler | G. Edward Johnson | Public domain (PD-self) | Resized | None; credited anyway |
| `pennywhistle.jpg` | Pennywhistle 103, 1976 kit documentation | M&R Electronics, Inc. | Public domain in the U.S. (no notice) | Resized | None; see caveat 1 |
| `felsenstein.jpg` | Lee Felsenstein, 2007 | Marcin Wichary; cropped by Gorinin | CC BY 2.0 | Resized | Credit, license link, note changes: done |
| `atari-coupler.jpg` | Atari 800XL with acoustic modem | Wolfgang Stief | CC0 | Cropped at top, resized | None; see caveat 2 |
| `bbs-login.png` | OpenTelegard BBS login screen, 2010 | Chris Tusa | Public domain (PD-self) | None | None; credited anyway |
| `baudot.jpg` | Émile Baudot, engraving | A. Delzers (d. 1943) | Public domain (age) | Recompressed | None |
| `modem-stack.jpg` | Stack of early-1990s modems | Szumyk (author "assumed" by Commons) | Public domain (PD-self) | Recompressed | None; see caveat 3 |
| `sportster-336.jpg` | USRobotics Sportster Voice 33.6 | Xiaowei | CC BY 3.0 | Resized | Credit, license link, note changes: done |
| `shannon.jpg` | Claude Shannon, c. 1956 | Bell Telephone Laboratories; scan by Tekniska museet | Public domain in the U.S. (no notice); scan CC BY 2.0 | Resized | Credit the museum for the scan: done; see caveat 1 |
| `sportster-56k.jpg` | USRobotics Sportster Voice 56K | Xiaowei | CC BY 3.0 | Resized | Credit, license link, note changes: done |
| `adsl-modem.jpg` | Deutsche Telekom Teledat 431 DSL modem | Tors | CC0 | Resized | None; credited anyway |
| `cable-modem.jpg` | Motorola SurfBoard SBV6120E | Larocomp | Public domain (PD-self) | Resized | None; credited anyway |

All images were also stripped of metadata and re-encoded as progressive JPEG at
quality 80 (the PNG was copied unchanged).

## Caveats worth a human look before any commercial or print reuse

1. **"No notice" public-domain claims** (`pennywhistle.jpg`, `shannon.jpg`) rest on the
   Commons uploader's statement that the original U.S. publication carried no copyright
   notice. That is a U.S. rule and was not independently checked against the printed
   originals.
2. **`atari-coupler.jpg`** originally showed part of a video game on a monitor at the
   top edge. The crop removes it.
3. **`modem-stack.jpg`** has no machine-readable author on Commons; the uploader's
   public-domain release is taken at face value.
4. **Trademarks.** Several photographs show product logos (USRobotics, Teletype, Atari,
   Deutsche Telekom, Motorola). The photographs' licenses do not extend to those marks.
   They appear here descriptively.
5. **People.** The portrait of Lee Felsenstein shows a living person.

## Fonts

IBM Plex Serif and IBM Plex Mono, © IBM Corp., SIL Open Font License 1.1. Five WOFF2
files (Latin subsets) from the `@fontsource` packages, with the license text at
`docs/fonts/OFL.txt`. The OFL permits bundling and redistribution with a web site.

## Audio

No third-party audio is used. For the record, Commons has freely licensed dial-up
recordings: `Dial up connection.ogg` (public domain, from pdsounds.org) and a CC0
excerpt of it, neither identified by modem standard; recordings labeled V.34, V.90 and
V.92 are CC BY-SA 4.0. A side-by-side "synthesis versus a real recording" comparison
would be a worthwhile addition and the public-domain file would permit it, but it was
not built: without knowing which standard a recording shows, the comparison could not
be labeled honestly.

## Quotations

Short quotations from interviews, court and agency decisions, standards and periodicals
are used with attribution and citation for the purpose of commentary and history. U.S.
government works (court opinions, FCC decisions) are in the public domain. The rest are
quoted briefly, each well under a hundred words, and none is the heart of the work
quoted.

## Not included on purpose

- The ITU-T Recommendations (ITU copyright). The synthesizers implement them; the
  documents are fetched from itu.int and are not redistributed.
- Any manufacturer photography, period advertisements other than as short quoted text,
  or magazine scans.
