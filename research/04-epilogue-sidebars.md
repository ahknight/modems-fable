# 04 — Epilogue and Sidebars: Verified Fact Sheet

Research date: 2026-11-20. Every source below was opened and read during this task (fetched text, PDF-to-text, or OCR). Excerpts are verbatim and at most 40 words. Spelling errors inside excerpts are the source's own.

Confidence tags:

- **HIGH** — primary or authoritative source read directly (standard text, RFC, creator's own account, agency data, company notice).
- **MEDIUM** — reputable secondary source (press, trade press, vendor white paper, textbook).
- **LOW** — could not fully verify; the reason is stated.

Retrieval notes that apply throughout:

- ITU-T Recommendations: the landing page URL is cited; the free PDF linked from that page is what was read.
- "Wayback" means the page was read from a web.archive.org snapshot because the live page did not render to plain text or returned an error.
- Corrections to the research brief are collected in [Corrections to the brief](#corrections-to-the-brief). Read that section first.

---

## Corrections to the brief

These points in the brief did not survive checking. Details and sources are in the numbered claims.

1. **DOOM did not have modem play in December 1993.** v1.0 (10 Dec 1993) and v1.1 were IPX-network only. Modem and serial play arrived with v1.2 on 17 Feb 1994. (E-1, E-2)
2. **CBBS: 16 Feb 1978 is the declared birthday, not the blizzard day.** Christensen dates the snow day to January 1978 and says the February date was chosen after the fact. (B-1, B-2)
3. **1000BASE-T uses an 8-state 4D trellis code, not Wei's 16-state code.** Wei's 16-state 4D code is the one shared by V.34 and ADSL. (4-3, 4-4, 4-5)
4. **Trellis coding and echo cancellation are optional in G.992.1**, not mandatory. (4-4, 4-7)
5. **G.fast does not use echo cancellation.** G.9701 separates directions with time-division duplexing. (2-14, 4-8)
6. **QuakeWorld was announced 2 Aug 1996 and went live 17 Dec 1996.** The client-side prediction quote is from the August entry. (E-5, E-6)
7. **DOCSIS 1.0 has three defensible dates** (1996, 26 Mar 1997, Mar 1999). (3-3, Disputed X-1)
8. **G.992.1, G.992.2 and G.994.1 carry "(06/99)" on the document cover**, while the ITU catalogue lists them as "(07/99)" with approval on 1–2 July 1999. (2-9, Disputed X-2)

---

# EPILOGUE

## 1. ISDN

**1-1. Basic rate ISDN is 2B+D: two B channels plus one 16 kbit/s D channel.**
Source: ITU-T (CCITT) Recommendation I.412, "ISDN user-network interfaces – Interface structures and access capabilities", approved 1988-11-25. https://www.itu.int/rec/T-REC-I.412-198811-I/en
Excerpt: "The basic interface structure is composed of two B-channels and one D-channel, 2 B + D. The bit rate of the D-channel in this interface structure is 16 kbit/s."
Confidence: HIGH

**1-2. A B channel is 64 kbit/s.**
Source: ITU-T I.412 (11/88), clause 3.1.1. https://www.itu.int/rec/T-REC-I.412-198811-I/en
Excerpt: "The B-channel is a 64 kbit/s channel accompanied by timing."
Confidence: HIGH

**1-3. Primary rate is 23B+D at 1544 kbit/s (North America/Japan) and 30B+D at 2048 kbit/s, with a 64 kbit/s D channel.**
Source: ITU-T I.412 (11/88), clause 4.1.2. https://www.itu.int/rec/T-REC-I.412-198811-I/en
Excerpt: "At the 1544 kbit/s primary rate the interface structure is 23 B + D." / "At the 2048 kbit/s primary rate the interface structure is 30 B + D."
Confidence: HIGH

**1-4. The US two-wire ISDN loop standard is ANSI T1.601 (first issue 1988, revised 1992). It uses a four-level quaternary line code and echo cancellation.**
Source: ANSI T1.601-1992, "ISDN – Basic Access Interface for Use on Metallic Loops for Application on the Network Side of the NT (Layer 1 Specification)", Exchange Carriers Standards Association, approved 21 Feb 1992 ("Revision of ANSI T1.601-1988"). Scan on Bitsavers. https://www.bitsavers.org/components/motorola/ISDN/T1.601.pdf
Excerpt: "The transmission system uses the echo canceler with hybrid (ECH) principle to provide full duplex operation over a two-wire subscriber loop."
Confidence: HIGH for the standard's existence, dates and echo cancellation. The scan's OCR renders "2B1Q" as "281 Q", so the name of the line code is taken from 1-5.

**1-5. The line code is 2B1Q: two binary digits map to one four-level symbol.**
Source: ITU-T Recommendation G.961 (03/93), "Digital transmission system on metallic local lines for ISDN basic rate access", Appendix II. https://www.itu.int/rec/T-REC-G.961/en
Excerpt: "The line code shall be 2B1Q (2 binary, 1 quaternary). This is a 4-level code and is used without redundancy."
Confidence: HIGH

**1-6. G.961 allows two duplexing methods: echo cancellation or time compression multiplex (TCM, the "ping-pong" method).**
Source: ITU-T G.961 (03/93), clause 5. https://www.itu.int/rec/T-REC-G.961/en
Excerpt: "Duplex transmission shall be achieved through the use of Echo Cancellation (ECH) or Time Compression Multiplex (TCM)."
Confidence: HIGH. Note: later ADSL Recommendations refer to "TCM-ISDN (G.961 Appendix III)" as a distinct noise environment (see G.992.1 and G.992.2 summaries); the text read does not itself say which country uses TCM.

**1-7. The term "digital subscriber line" was already the name for the ISDN basic-access loop in the ANSI ISDN standard.**
Source: ANSI T1.601-1992, Foreword. https://www.bitsavers.org/components/motorola/ISDN/T1.601.pdf
Excerpt: "The digital subscriber line that provides this link, using a single pair, is specified in this standard in terms of the interface on the network side of the customer-end termination."
Confidence: HIGH

**1-8. The "It Still Does Nothing" joke: citable contemporary use, April 1996.**
Source: "ISDN supporters lodge complaints", CNET News staff, 15 Apr 1996. https://www.cnet.com/tech/services-and-software/isdn-supporters-lodge-complaints/ (read via Wayback 2024 snapshot; the live URL returned 404 to a script).
Excerpt: "The joke used to be that ISDN stood for "It Still Does Nothing." Now the joke may be that ISDN can do a lot ... but the telephone companies aren't acting as if they really want to sell it to you."
Confidence: MEDIUM (contemporary press). The ellipsis marks words omitted to stay within 40 words.

**1-9. Second contemporary use, December 1996, with the 128 kbit/s figure and the "specification hammered out in 1984" dating.**
Source: "ISDN: It still does something", CNET News staff, 4 Dec 1996. https://www.cnet.com/tech/services-and-software/isdn-it-still-does-something/
Excerpt: "The ISDN specification was hammered out in 1984 to allow for wide-bandwidth digital transmission using the public switched telephone network."
Confidence: MEDIUM. This is the only source read for the 1984 date; see Could not verify V-1.

**1-10. Why it fizzled in US homes: users and vendors blamed Bell pricing and foot-dragging, and ADSL and cable modems were already in trials by spring 1996.**
Source: "ISDN supporters lodge complaints", CNET, 15 Apr 1996 (as 1-8).
Excerpt: "both consumers and computer vendors claim that the Baby Bells, from whom most home and small-business users get their ISDN services, are charging far above cost and dragging their feet in expanding the market."
Confidence: MEDIUM. Same article: "the window of opportunity for widespread ISDN acceptance may have already closed", and the Bells' reply that "it's a chicken-and-egg problem: there's not enough demand yet to justify volume pricing or a wider infrastructure". It also gives the speed pitch: "128 kbps--more than four times the speed of the 28.8-kbps modem now commonly used". The December 1996 article (1-9) adds "an ongoing dispute over a pricing rate hike in California proposed by Pacific Bell".

**1-11. Germany had the highest ISDN penetration in the world in 1998.**
Source: "ISDN penetration is highest in Germany", Telecompaper, 14 Jul 1998 (citing Develcon and Alcatel). https://www.telecompaper.com/news/isdn-penetration-is-highest-in-germany--143582
Excerpt: "ISDN penetration is highest in Germany, where B-channels make up 16.5% of all main lines, ahead of Norway with an 11.6% penetration rate"
Confidence: MEDIUM. Same item gives UK 8.6%, Japan 8%, France 7.5%, US 4.6%.

**1-12. Germany and Japan led in 2000–2001.**
Source: "Germany has highest penetration of ISDN lines", Telecompaper, 19 Nov 2001 (citing BITKOM). https://www.telecompaper.com/news/germany-has-highest-penetration-of-isdn-lines--285637
Excerpt: "Germany will have 23 ISDN lines per 100 people in 2001, up from 15 lines in 2000; followed by Japan with 11 lines, vs 8 lines"
Confidence: MEDIUM. Same item gives the US 5 lines per 100 in 2001.

**1-13. ISDN's relationship to 56k: V.90 is an asymmetric pair of a "digital modem" and an "analogue modem". The digital modem attaches to a digital switched network.**
Source: ITU-T Recommendation V.90 (09/98), approved 1998-09-01, clause 1. https://www.itu.int/rec/T-REC-V.90-199809-I/en
Excerpt: "The network interface of the digital modem and the signalling rate that is used to connect the digital modem locally to a digital switched network are considered to be national matters and are hence not specified herein."
Confidence: HIGH for "the ISP side is digital". V.90 does not name T1 or ISDN PRI; see Could not verify V-2.

**1-14. Consumer-facing statement of the same requirement: only one analog/digital conversion is allowed in the path.**
Source: U.S. Robotics, "56K Faxmodem User's Guide and Reference" (troubleshooting chapter). https://support.usr.com/support/2884c/2884c-ug/five.html
Excerpt: "The 56K signal from your ISP begins as a digital signal." / "If more than one analog-to-digital conversion occurs, your connect speeds will default to V.34+ (33.6 Kbps)."
Confidence: HIGH (manufacturer documentation)

**1-15. V.90 rates are 56 000 bit/s downstream and 33 600 bit/s upstream.**
Source: ITU-T V.90 (09/98), clause 1. https://www.itu.int/rec/T-REC-V.90-199809-I/en
Excerpt: "at data signalling rates of up to 56 000 bit/s in the downstream direction and up to 33 600 bit/s in the upstream direction."
Confidence: HIGH

---

## 2. DSL

**2-1. Joseph Lechleider of Bellcore supplied the asymmetry idea in the late 1980s: make download much faster than upload and crosstalk drops.**
Source: "Joseph Lechleider, a Father of the DSL Internet Technology, Dies at 82", The New York Times, 4 May 2015; read in the NYU Tandon reprint (posted 14 May 2015, marked "Originally published in The New York Times"). https://engineering.nyu.edu/news/joseph-lechleider-father-dsl-internet-technology-dies-82 (original: https://www.nytimes.com/2015/05/04/technology/joseph-lechleider-a-father-of-the-dsl-internet-technology-dies-at-82.html)
Excerpt: "Mr. Lechleider figured out that such meddlesome interference -- known as electrical crosstalk -- could be substantially reduced if the download speeds were far faster than the upload speeds."
Confidence: MEDIUM (newspaper of record). The reprint shows no byline; take the reporter's name from the NYT page before crediting one. The obituary dates the idea to "the late 1980s" and says the insight "came when he was 55".

**2-2. The phone companies' original motive was video, not Internet access.**
Source: NYT obituary (as 2-1).
Excerpt: "the phone companies wanted to figure out a way to send signals at high speed across ordinary copper wire into homes, mainly to compete with cable television companies and offer interactive video services."
Confidence: MEDIUM

**2-3. Dial-up delayed DSL: second phone lines were good business.**
Source: NYT obituary (as 2-1).
Excerpt: "most consumers went online using dial-up modems, which increased the demand for second phone lines in homes. That was a good business for the phone companies, and a familiar one. Why opt for this new DSL technology?"
Confidence: MEDIUM

**2-4. Lechleider contributed the idea; younger engineers such as Cioffi built the modems.**
Source: NYT obituary (as 2-1).
Excerpt: "Mr. Lechleider contributed a key idea. But it was younger engineers like Mr. Cioffi who developed DSL modem technology."
Confidence: MEDIUM

**2-5. HDSL: Lechleider published the review paper on it in 1991, and the ITU HDSL Recommendation is G.991.1 (1998).**
Sources: (a) bibliographic record for J. W. Lechleider, "High Bit Rate Digital Subscriber Lines: A Review of HDSL Progress", IEEE Journal on Selected Areas in Communications, 1991 (record only; abstract withheld by publisher). https://www.semanticscholar.org/paper/High-Bit-Rate-Digital-Subscriber-Lines:-A-Review-of-Lechleider/851f3b0fa21b4afb3de56edad16a324f0307caa9 (DOI https://doi.org/10.1109/49.93088) (b) ITU-T G.991.1, "High bit rate digital subscriber line (HDSL) transceivers", approved 1998-10-13. https://www.itu.int/rec/T-REC-G.991.1-199810-I/en
Excerpt: (ITU catalogue) "G.991.1 : High bit rate digital subscriber line (HDSL) transceivers"
Confidence: HIGH for G.991.1's title and date. LOW for any statement about what the 1991 paper says, because only its title, venue, year and author were read.

**2-6. In 1990 HDSL was already named as a target for multicarrier modulation, in a paper written from Telebit.**
Source: John A. C. Bingham, "Multicarrier Modulation for Data Transmission: An Idea Whose Time Has Come", IEEE Communications Magazine, May 1990 (scanned copy, read by OCR). https://www.cs.yale.edu/homes/yry/readings/wireless/wireless_readings/ofdm_bingham.pdf
Excerpt: "In addition, high-speed data is being considered for transmission on the High-rate Digital Subscriber Line (HDSL)."
Confidence: HIGH (the paper itself; OCR text, checked against page image layout)

**2-7. John Cioffi's Stanford group named the technique "Discrete Multitone" (DMT) and competed against single-carrier designs in the 1993 Bellcore tests, which Cioffi calls the "Bellcore Transmission Olympics".**
Source: John M. Cioffi, "Multi-Channel Modulation", chapter 4 of his Stanford course text (PDF, undated; current on the Cioffi group site). https://cioffi-group.stanford.edu/doc/book/chap4.pdf
Excerpt: "the "academic" Stanford group was grudgingly allowed to compete with traditional equalized systems designed by three independent sets of recognized experts"
Confidence: HIGH as Cioffi's own account. It is a participant's account and is not neutral.

**2-8. Cioffi's claimed margin of victory, and the moment of the standards decision: 10 March 1993.**
Source: Cioffi, chap. 4 (as 2-7).
Excerpt: "with measured 10-30 dB improvements (and data rates 4-5 times faster) over the best of the equalized systems on actual transmission lines, the gold-medalist DMT system resurrected MT at 4:10 pm on March 10, 1993"
Confidence: HIGH as Cioffi's account; MEDIUM as fact (self-reported figures).

**2-9. Amati was founded by Cioffi in 1991. ANSI T1E1.4 chose DMT as the ADSL line code in March 1993 over CAP and QAM.**
Source: "Milestones: Asymmetric Digital Subscriber Line (ADSL) Enabling Broadband Internet, 1993-1997", Engineering and Technology History Wiki (IEEE Milestone proposal page). https://ethw.org/Milestones:Asymmetric_Digital_Subscriber_Line_(ADSL)_Enabling_Broadband_Internet,_1993-1997
Excerpt: "the Discrete Multi-Tone (DMT) prototype of Amati (founded in 1991 by Prof. John Cioffi) showed its superiority over the single-carrier (CAP and QAM) technologies. This resulted in the selection of DMT as line code for ADSL"
Confidence: MEDIUM (IEEE history wiki; the milestone text is written from the Alcatel team's side)

**2-10. ANSI T1.413, the first ADSL standard, dates from August 1995. Issue 2 was approved November 1998.**
Source: ETHW ADSL Milestone page (as 2-9).
Excerpt: "DMT only got selected as line code for ADSL in March 1993 and the very first ADSL standard (ANSI T1.413) dates from August 1995."
Confidence: MEDIUM. The brief's "T1.413 (1995)" is supported; the standard text itself was not read.

**2-11. The CAP-versus-DMT fight was still running in 1997 and was described at the time as a holy war.**
Source: Andrew W. Davis, "Modulation Schemes: Moving Digital Data With Analog Signals", EE Times, 4 Oct 1997 (read via Wayback). https://www.eetimes.com/modulation-schemes-moving-digital-data-with-analog-signals/
Excerpt: "The CAP vs. DMT debate has taken on the nature of a religious holy war within the ADSL community and has stolen much attention and, perhaps, momentum."
Confidence: MEDIUM

**2-12. Second 1997 source: DMT was the ANSI standard but CAP products shipped first.**
Source: student survey "Digital Subscriber Lines and Cable Modems", Raj Jain's CIS 788 course, Ohio State / WUSTL, 1997. https://www.cse.wustl.edu/~jain/cis788-97/ftp/rbb/index.html
Excerpt: "DMT has been standardized by ANSI, but currently products using CAP have been released by various companies."
Confidence: MEDIUM (student paper, but contemporary; it also says "CAP technologies have been quicker to get to market")

**2-13. ITU ADSL family, with dates from the ITU catalogue and rates from each Recommendation's own summary:**

| Recommendation | Name | ITU approval date | Headline figure in the text read | URL |
|---|---|---|---|---|
| G.992.1 | ADSL ("G.dmt") | 1999-07-02 | "approximately 6 Mbit/s downstream and approximately 640 kbit/s upstream" | https://www.itu.int/rec/T-REC-G.992.1-199907-I/en |
| G.992.2 | Splitterless ADSL ("G.lite") | 1999-07-01 | bearer channels up to "1.536 Mbit/s" down and "512 kbit/s" up | https://www.itu.int/rec/T-REC-G.992.2-199907-I/en |
| G.994.1 | Handshake ("G.hs") | 1999-07-02 | — | https://www.itu.int/rec/T-REC-G.994.1-199907-S/en |
| G.992.3 | ADSL2 | 2002-07-29 | (not read) | https://www.itu.int/rec/T-REC-G.992.3-200207-S/en |
| G.992.5 | ADSL2plus | 2003-05-22 | "a minimum of 16 Mbit/s downstream and 800 kbit/s upstream"; "double the downstream bandwidth" (2.208 MHz, 512 subcarriers) | https://www.itu.int/rec/T-REC-G.992.5-200305-S/en |
| G.993.2 | VDSL2 | 2006-02-17 | "a bidirectional net data rate up to 200 Mbit/s on twisted pairs using a bandwidth up to 30 MHz" | https://www.itu.int/rec/T-REC-G.993.2-200602-S/en |
| G.9701 | G.fast | 2014-12-05 | "aggregate net data rate up to 1 Gbit/s on twisted wire-pairs using spectrum up to 106 MHz" | https://www.itu.int/rec/T-REC-G.9701-201412-S/en |

Confidence: HIGH (ITU catalogue pages and Recommendation texts read). The "G.dmt" nickname is not in the texts read. The commonly quoted "24 Mbit/s" for ADSL2+ is not in G.992.5's summary, which states a 16 Mbit/s minimum capability.

**2-14. G.992.2 is the "splitterless" Recommendation: it is written so no splitter is needed at the customer premises.**
Source: ITU-T G.992.2, Summary (document cover "(06/99)"). https://www.itu.int/rec/T-REC-G.992.2-199907-I/en
Excerpt: "This Recommendation includes procedures to allow provisioning without the need for "splitters", typically installed at the ingress to the customer premises."
Confidence: HIGH

**2-15. G.fast approval was announced by the ITU on 5 Dec 2014, with a 1 Gbit/s target.**
Source: ITU press release, "G.fast broadband standard approved and on the market", Geneva, 5 Dec 2014. https://www.itu.int/net/pressoffice/press_releases/2014/70.aspx
Excerpt: "ITU members today achieved final approval of G.fast, the new ITU broadband standard designed to deliver access speeds of up to 1Gbit/s over existing telephone wires."
Confidence: HIGH

**2-16. G.fast in the standard's own words: DMT, time-division duplexing, trellis plus Reed-Solomon, vectoring.**
Source: ITU-T G.9701 (12/2014), scope. https://www.itu.int/rec/T-REC-G.9701-201412-S/en
Excerpt: "Discrete multitone (DMT) modulation (2 048/4 096 subcarriers with 51.75 kHz subcarrier spacing); Time-division duplexing (sharing time between upstream and downstream transmission)"
Confidence: HIGH

**2-17. G.994.1 ("G.hs") is the common start-up handshake for G.992.1 and G.992.2: capability exchange, then mode selection.**
Source: ITU-T G.994.1, Summary (document cover "(06/99)"). https://www.itu.int/rec/T-REC-G.994.1-199907-S/en
Excerpt: "This Recommendation provides a flexible mechanism for Digital Subscriber Line (DSL) transceivers to exchange capabilities and to select a common mode of operation."
Confidence: HIGH

**2-18. G.hs lineage from V.8bis: a 1998 Ericsson Review article states the similarity outright.**
Source: Albin Johansson, "ADSL Lite—The broadband enabler for the mass market", Ericsson Review No. 4, 1998 (PDF mirror). http://adslproject.free.fr/Docs/ADSL/1998042.pdf
Excerpt: "G.994.1 (handshake) for capability exchange between the modem and line card before initialization. The scheme is similar to V.8bis and includes an escape mechanism for falling back to the tone-based startup specified by ANSI T1.413"
Confidence: MEDIUM (vendor technical journal; hyphenation from the two-column layout removed)

**2-19. G.994.1 itself carries V.8 and V.8bis code points: a DSL modem can use G.hs to request a fallback to a voiceband handshake.**
Source: ITU-T G.994.1 (06/99), Table 10, Note 1. https://www.itu.int/rec/T-REC-G.994.1-199907-S/en
Excerpt: "Setting this bit to binary ONE in an MS message initiates the G.994.1 session cleardown procedure ... and requests a V.8 or V.8 bis handshake in the voiceband"
Confidence: HIGH. Note the shared message vocabulary: G.994.1 uses CL (Capabilities List), CLR (Capabilities List Request) and MS (Mode Select) messages. V.8bis's use of the same names was not checked in the V.8bis text; see Could not verify V-3.

**2-20. Dates of the voiceband ancestors: V.8 approved 1994-09-20; V.8bis approved 1996-08-16.**
Source: ITU-T catalogue pages. https://www.itu.int/rec/T-REC-V.8-199409-S/en and https://www.itu.int/rec/T-REC-V.8bis-199608-S/en
Excerpt: "V.8 : Procedures for starting sessions of data transmission over the general switched telephone network" / "Approved in 1994-09-20"
Confidence: HIGH

---

## 3. Cable

**3-1. Rouzbeh Yassini built LANcity (Andover, Massachusetts) from the remains of Applitek with a thirteen-person team; the first-generation cable modem was enormous.**
Source: "Dr. Rouzbeh Yassini", Hauser Oral History Project, The Cable Center (now Syndeo Institute), interviewed by Stewart Schley, 22 Apr 2014. https://syndeoinstitute.org/the-hauser-oral-history-project/w-z-listings/dr-rouzbeh-yassini/
Excerpt: "The first generation of the modem was half the size of refrigerators. They consisted of eight boards. Each board was about fifteen inches by fifteen inches"
Confidence: HIGH (oral history, first person). Same transcript: "LANcity Corporation was built based on the remnants of the earlier company, called Applitek" and "my original thirteen-member team". The transcript read does not state a founding year in so many words; he speaks of financing trials "in 1990-91-92-93". The "founded 1990" date was seen only in search snippets (a Syndeo blog post and Wikipedia), so treat the year as MEDIUM.

**3-2. LANcity was sold to Bay Networks; Yassini then worked with CableLabs from 1996 on what became DOCSIS.**
Source: Yassini oral history (as 3-1).
Excerpt: "I was able to help crystallize what I used to call the LANcity cable modem to the essence of DOCSIS. So DOCSIS was born in March, 1999, but from 1996 to 1999 we worked to really make that happen"
Confidence: HIGH as his account. The sale price ($59 million per Inc. and Wikipedia; $56 million per Light Reading) was seen only in search snippets and is not verified here.

**3-3. The DOCSIS 1.0 radio-frequency specification is dated 26 March 1997. It was written by Arthur D. Little under contract to MCNS Holdings.**
Source: "Data-Over-Cable Interface Specifications: Radio Frequency Interface Specification", SP-RFI-I01-970326, Interim Specification, MCNS Holdings, L.P., 26 Mar 1997 (Wayback copy of the CableLabs PDF). https://web.archive.org/web/20110525094347/http://www.cablelabs.com/specifications/SP-RFI-I01-970326.pdf
Excerpt: "This document was prepared by Arthur D. Little, Inc., under contract to MCNS Holdings, L.P."
Confidence: HIGH. See Disputed X-1 for the other dates in circulation.

**3-4. DOCSIS 1.0 downstream is 64-QAM and 256-QAM in a 6 MHz channel, built on the North American digital video standard (ITU-T J.83 Annex B).**
Source: SP-RFI-I01-970326 (as 3-3).
Excerpt: "The PMD sublayer in the downstream direction is based on North American digital video transmission specifications (i.e., ITU-T Recommendation J.83 Annex B ...) and includes these features: 64-level and 256-level Quadrature Amplitude Modulation (64QAM and 256QAM)"
Confidence: HIGH

**3-5. DOCSIS 1.0 upstream is QPSK and 16-QAM.**
Source: ITU-T J.112 (03/98), Annex B. https://www.itu.int/rec/T-REC-J.112-199803-I/en
Excerpt: "The upstream modulator MUST provide both QPSK and 16 QAM modulation formats."
Confidence: HIGH

**3-6. DOCSIS became an ITU Recommendation as Annex B of J.112, approved 18 March 1998.**
Source: ITU-T J.112, "Transmission systems for interactive cable television services", approved 1998-03-18. https://www.itu.int/rec/T-REC-J.112-199803-I/en
Excerpt: "Annex B is based on work done in North America and should provide a suitable basis for future developments."
Confidence: HIGH. Annex B's reference list cites the MCNS "Data-Over-Cable Service Interface Specifications" documents by number.

**3-7. DOCSIS versions, dates and headline rates, from CableLabs' own comparison table:**

| Version | First specification issue date | Downstream capacity | Upstream capacity | CableLabs "highlights" |
|---|---|---|---|---|
| DOCSIS 1.0 | 1996 | 40 Mbps | 10 Mbps | "Initial cable broadband technology, high speed internet access" |
| DOCSIS 1.1 | 1999 | 40 Mbps | 10 Mbps | "Added voice over IP service, gaming, streaming" |
| DOCSIS 2.0 | 2001 | 40 Mbps | 30 Mbps | "Higher upstream speed, capacity for symmetric services" |
| DOCSIS 3.0 | 2006 | 1 Gbps | 200 Mbps | "Greatly enhances capacity, channel bonding, IPv6" |
| DOCSIS 3.1 | 2013 | 10 Gbps | 1-2 Gbps | "Capacity and efficiency progression, OFDM, wideband channel" |
| DOCSIS 4.0 | 2019 | 10 Gbps | 6 Gbps | "Symmetrical streaming and increased upload speeds" |

Source: "DOCSIS 4.0 Technology", CableLabs (table "The Evolution of DOCSIS"). https://www.cablelabs.com/technologies/docsis-4-0-technology
Excerpt: "The performance numbers above are based on specifications; deployed network performance will vary across implementations."
Confidence: HIGH (CableLabs). These are specification ceilings, not service tiers.

**3-8. Month-level timeline from trade press: DOCSIS introduced Dec 1996; first 1.0 modem certifications Mar 1999; 1.1 released Apr 1999; 2.0 started Aug 2001; 3.0 specs issued summer 2006; 3.1 specs fall 2013.**
Source: Jeff Baumgartner, "The Road to DOCSIS 4.0", Light Reading, 26 Jun 2019. https://www.lightreading.com/cable-technology/the-road-to-docsis-4-0
Excerpt: "Thomson (now Technicolor) and Toshiba were the first to nab D1.0 certifications for cable modems in March 1999, while Cisco Systems was first with a 1.0-qualified CMTS."
Confidence: MEDIUM (trade press; byline "Jeff Baumgartner, Senior Editor, Light Reading" confirmed on the page).

**3-9. Full Duplex DOCSIS was moved from 3.1 into 4.0 in August 2019.**
Source: CableLabs, "DOCSIS 4.0 Technology" FAQ (as 3-7).
Excerpt: "CableLabs moved FDX requirements from DOCSIS 3.1 to DOCSIS 4.0 specifications in August 2019."
Confidence: HIGH

**3-10. Cioffi claims the 1993 Amati DMT modem also ran as a cable modem prototype that year.**
Source: Cioffi, chap. 4 (as 2-7).
Excerpt: "the same Olympic modem with minor modifications implemented the world's first "cablemodem" at the December 1993 Anaheim, CA cable show."
Confidence: LOW as fact. It is a single first-person claim and conflicts with LANcity's earlier products (3-1). Use only as an attributed claim.

---

## 4. What dial-up modems handed on

**4-1. QAM. Cioffi describes multitone as a row of narrow QAM signals, each loaded according to the channel.**
Source: Cioffi, chap. 4 (as 2-7).
Excerpt: "The basis functions are essentially a set of non-overlapping narrow QAM signals (i.e., "tones")."
Confidence: HIGH (textbook by the principal). Cable's use of 64/256-QAM is at 3-4.

**4-2. Per-tone bit loading in ADSL: each tone carries its own constellation, 2 to 15 bits.**
Source: ITU-T G.992.1, clause 7.8. https://www.itu.int/rec/T-REC-G.992.1-199907-I/en
Excerpt: "specifies the number of coded bits per tone, which can be any integer from 2 to 15."
Confidence: HIGH

**4-3. Trellis coding, the direct hand-off: V.34 adopted Wei's 16-state four-dimensional trellis code.**
Source: G. D. Forney Jr., L. Brown, M. V. Eyuboglu, J. L. Moran III, "The V.34 High-Speed Modem Standard", IEEE Communications Magazine, Dec 1996 (PDF mirror). https://www.audentia-gestion.fr/research.microsoft/v34.pdf (IEEE record: https://ieeexplore.ieee.org/document/556483/)
Excerpt: "the 16-state 4-D trellis code of Wei [4] has an effective coding gain of about 4.2 dB, or 0.6 dB better than the V.32 code ... and was eventually adopted for V.34."
Confidence: HIGH (authors were the V.34 designers)

**4-4. ADSL uses the same code: Wei's 16-state 4-dimensional trellis code, as an option.**
Source: ITU-T G.992.1, clause 7.8. https://www.itu.int/rec/T-REC-G.992.1-199907-I/en
Excerpt: "Block processing of Wei's 16-state 4-dimensional trellis code is optional to improve system performance."
Confidence: HIGH. Cioffi's chapter confirms it for DSL generally: "The inner code is Chapter 9's 4D Wei 16-state Trellis code".

**4-5. 1000BASE-T: five-level PAM, an 8-state 4D trellis code across the four pairs, and full-duplex echo-cancelled transmission.**
Source: "IEEE 802 10GBASE-T Tutorial", IEEE 802.3 10GBASE-T Study Group (Booth, Flatman, Zimmerman, Rao et al.), Albuquerque, 10 Nov 2003, slide "Comparison with 1000BASE-T". https://www.ieee802.org/3/10GBT/public/nov03/10GBASE-T_tutorial.pdf
Excerpt: "5-level coded PAM signaling (2 information bits/symbol) / 8-state 4D Trellis code across pairs / Full duplex echo-cancelled transmission / 125 Mbaud, ~80 MHz used bandwidth" (1000BASE-T column; slashes mark line breaks)
Confidence: HIGH (IEEE 802.3 working material). The IEEE 802.3ab standard text itself was not read.

**4-6. Echo cancellation in the dial-up line: V.34 separates the two directions by echo cancellation.**
Source: ITU-T Recommendation V.34 (02/98), clause 1. https://www.itu.int/rec/T-REC-V.34-199802-I/en
Excerpt: "channel separation by echo cancellation techniques;"
Confidence: HIGH. V.34's start-up Phase 3 is titled "Equalizer and echo canceller training", which also covers adaptive equalization.

**4-7. Echo cancellation in ADSL is an option, listed beside trellis coding.**
Source: ITU-T G.992.1, Summary. https://www.itu.int/rec/T-REC-G.992.1-199907-I/en
Excerpt: "This Recommendation defines several optional capabilities and features: echo cancellation; trellis coded modulation; dual latency;"
Confidence: HIGH (bullets joined with semicolons)

**4-8. Echo cancellation in G.fast: not used. G.9701 uses time-division duplexing.**
Source: ITU-T G.9701 (12/2014), scope (as 2-16).
Excerpt: "Time-division duplexing (sharing time between upstream and downstream transmission);"
Confidence: HIGH. This answers the brief's "G.fast?" with "no".

**4-9. Tomlinson–Harashima precoding: invented for uncoded transmission, taken up and refined for V.34.**
Source: Forney et al., "The V.34 High-Speed Modem Standard", 1996 (as 4-3).
Excerpt: "Techniques of this type, which were devised many years ago for uncoded transmission by Tomlinson and Harashima [14-16], are called "equalization via precoding" or simply "precoding.""
Confidence: HIGH

**4-10. The 1971 origin: Tomlinson's paper is "New Automatic Equalizer Employing Modulo Arithmetic", Electronics Letters, March 1971.**
Source: reference [14] in Forney et al. 1996 (as 4-3).
Excerpt: "M. Tomlinson, "New Automatic Equalizer Employing Modulo Arithmetic," Elect. Lett., vol. 7, Mar 1971, pp 138-39"
Confidence: HIGH for the citation as given by Forney et al. The 1971 paper itself was not read. An IEEE 802.3an slide (4-12) gives the pair of dates "M. Tomlinson March 1971, H. Harashima & H. Miyakawa August 1972".

**4-11. V.34's definition of precoding.**
Source: ITU-T V.34 (02/98), clause 3.8. https://www.itu.int/rec/T-REC-V.34-199802-I/en
Excerpt: "precoding: A non-linear equalization method for reducing equalizer noise enhancement caused by amplitude distortion. Equalization is performed at the transmitter using precoding coefficients provided by the remote modem."
Confidence: HIGH

**4-12. 10GBASE-T adopted Tomlinson–Harashima precoding, and the proposal cited V.34 as prior art for precoder start-up.**
Source: Scott Powell (Broadcom, presenter) et al., "Multi-Vendor Agreement on Precoder Proposal: A Channel Equalization Approach for 10GBASE-T", IEEE P802.3an Interim, May 2004. https://www.ieee802.org/3/an/public/may04/powell_1_0504.pdf
Excerpt: "Interoperability and startup issues already solved in multiple standards – V.34, G.SHDSL, HDSL2, 802.3ah (EFM)"
Confidence: HIGH (IEEE 802.3an task force document). This is the cleanest single citation for "V.34 → 10GBASE-T".

**4-13. 10GBASE-T as standardized: PAM-16, LDPC, and a THP whose coefficients are exchanged at start-up.**
Source: "10GBASE-T: 10 Gigabit Ethernet over Twisted-pair Copper", Ethernet Alliance white paper, Version 1.0, Aug 2007. http://www.ethernetalliance.org/wp-content/uploads/2011/10/static_page_files_127_10GBASE_T2.pdf
Excerpt: "The Tomlinson-Harashima precoder coefficients must be exchanged between the two link partners during startup."
Confidence: MEDIUM (industry consortium white paper)

**4-14. Line probing in V.34: the modems measure the channel with tones before choosing symbol rate and carrier.**
Source: Forney et al. 1996 (as 4-3).
Excerpt: "The transmitter sends a "line probing" sequence that generates a set of tones across the maximum possible band so that the signal-to-noise ratio can be measured as a function of frequency."
Confidence: HIGH. V.34's own definition (clause 3.5): "line probing: A method for determining channel characteristics by sending periodic signals, which are analysed by the modem and used to determine data mode modulation parameters."

**4-15. Telebit to DMT: the 1990 multicarrier survey was written by a Telebit scientist and uses the Trailblazer as its worked example.**
Source: Bingham, IEEE Communications Magazine, May 1990 (as 2-6).
Excerpt: "This is one of the carrier separations used in Telebit's "Trailblazer" modem; the reason for such a choice (62.5 = 8,000/128) will become clear later."
Confidence: HIGH. Author note in the same paper: "He is now a Senior Scientist at Telebit Corporation, Sunnyvale, CA".

**4-16. The same person links Telebit to Amati: Cioffi thanks John Bingham among the "former Stanford students and Amati employees" behind DMT.**
Source: Cioffi, chap. 4, footnote 1 (as 2-7).
Excerpt: "Special thanks to former Stanford students and Amati employees Jim Aslanis, John Bingham, Jacky Chow, Peter Chow, Toni Gooch, Ron Hunt, Kim Maxwell, Van Whitis"
Confidence: HIGH for both facts separately. The sentence "ADSL bit loading descends from Telebit PEP" is an inference from them; no source read states it in those words, and the name "PEP" does not appear in the sources read.

**4-17. Handshake and capability negotiation in Ethernet: auto-negotiation exchanges capabilities and picks the highest common speed, and 10GBASE-T start-up begins with it.**
Source: Ethernet Alliance white paper, 2007 (as 4-13).
Excerpt: "The startup sequence initiates with the standard twisted-pair Ethernet auto-negotiation protocol. Transceivers exchange capabilities and agree on the highest speed that both can support."
Confidence: MEDIUM. Same paper: "Clause 28 auto-negotiation is the same that is used in 10/100/1000 Mb/s Ethernet". No source read ties auto-negotiation historically to modem handshakes; that link is an analogy, not a documented lineage.

**4-18. PPP to PPPoE: RFC 2516 (Feb 1999) exists to keep the dial-up PPP model on broadband.**
Source: L. Mamakos et al., "A Method for Transmitting PPP Over Ethernet (PPPoE)", RFC 2516, Feb 1999. https://www.rfc-editor.org/rfc/rfc2516.txt
Excerpt: "It is also a goal to provide access control and billing functionality in a manner similar to dial-up services using PPP."
Confidence: HIGH. Also: "It is intended to be used with broadband remote access technologies that provide a bridged Ethernet topology, when access providers wish to maintain the session abstraction associated with PPP."

**4-19. PPP on ADSL was specified by the ADSL Forum (PPP over ATM, TR-012).**
Source: Johansson, Ericsson Review 1998 (as 2-18).
Excerpt: "the point-to-point protocol (PPP) is carried over ATM, which in turn, is carried over the ADSL protocol across the twisted pair or U-interface (ADSL Forum TR-012)."
Confidence: MEDIUM

**4-20. AT commands live on in cellular modems: 3GPP TS 27.007 is a profile of AT commands built on ITU-T V.250.**
Source: 3GPP TS 27.007 V13.5.0 (2016-06), "AT command set for User Equipment (UE)", clause 1 Scope (ARIB-hosted copy). https://www.arib.or.jp/english/html/overview/doc/STD-T63V12_30/5_Appendix/Rel13/27/27007-d50.pdf
Excerpt: "The present document specifies a profile of AT commands ... The command prefix +C is reserved for Digital Cellular in ITU-T Recommendation V.250"
Confidence: HIGH

**4-21. V.250 is the ITU's codification of the existing AT command practice.**
Source: ITU-T Recommendation V.250 (07/2003), "Serial asynchronous automatic dialling and control", Summary. https://www.itu.int/rec/T-REC-V.250-200307-I/en
Excerpt: "codifies existing practice in common GSTN-DCE that use the ATtention (AT) command set;"
Confidence: HIGH. The word "Hayes" does not appear in the passages read.

**4-22. A relic inside the cellular spec: the speaker commands L and M are still mandatory, and are ignored.**
Source: 3GPP TS 27.007 V13.5.0, table of V.250 call control commands (as 4-20).
Excerpt: "L[<value>] 6.3.13 mand. ignored (monitor speaker loudness)" / "M[<value>] 6.3.14 mand. ignored (monitor speaker mode)"
Confidence: HIGH. The same table keeps D, A, H, O, S0, S7, E, V and Z as mandatory.

---

## 5. The long tail

**5-1. Pew time series, percent of US adults with dial-up vs broadband at home.**

| Survey | Dial-up | Broadband |
|---|---|---|
| Jun 2000 | 34 | 3 |
| Apr 2001 | 41 | 6 |
| Mar 2002 | 38 | 11 |
| Mar 2003 | 37 | 16 |
| Apr 2004 | 30 | 24 |
| Mar 2005 | 28 | 33 |
| Mar 2006 | 23 | 42 |
| Mar 2007 | 15 | 47 |
| Apr 2008 | 10 | 55 |
| Apr 2009 | 7 | 62 |
| May 2010 | 5 | 64 |
| Aug 2011 | 3 | 62 |
| Apr 2012 | 3 | 66 |
| Dec 2012 | 3 | 65 |
| May 2013 | 3 | 70 |
| Sep 2013 | 2 | 70 |
| Jul 2015 | 3 | 67 |

Source: "Broadband vs. Dial-up Adoption Over Time", Pew Research Center chart page. https://www.pewresearch.org/chart/broadband-vs-dial-up-adoption-over-time/
Excerpt: "Dial-up Broadband 6/2000 34 3 4/2001 41 6 3/2002 38 11 3/2003 37 16 4/2004 30 24 3/2005 28 33"
Confidence: HIGH. Reading: dial-up peaks in the April 2001 survey (41%); broadband passes dial-up between the April 2004 and March 2005 surveys. The chart page read does not label the unit; Pew's related reports describe the series as percent of American adults.

**5-2. Pew, 2013: 3% of Americans still on dial-up at home.**
Source: Joanna Brenner, "3% of Americans use dial-up at home", Pew Research Center, 21 Aug 2013. https://www.pewresearch.org/short-reads/2013/08/21/3-of-americans-use-dial-up-at-home/
Excerpt: "In June 2000, when about half of adults were online, only 3% of American households had broadband access. Now, as of December 2012, the tables have turned: 3% of Americans connect to the internet at home via dial-up."
Confidence: HIGH

**5-3. In September 2001 about 45 million US households were on dial-up and about 10 million on broadband.**
Source: Shane Greenstein and Ryan C. McDevitt, "The Broadband Bonus: Accounting for Broadband Internet's Impact on U.S. GDP", NBER Working Paper 14758, Feb 2009. https://www.nber.org/system/files/working_papers/w14758/w14758.pdf
Excerpt: "In September 2001, approximately 45 million US households accessed the Internet through a dial-up connection, while only 10 million used a broadband connection."
Confidence: MEDIUM (academic working paper; title, authors and date confirmed on its cover page)

**5-4. Census ACS: households whose only Internet subscription is dial-up (table B28002, 1-year estimates, United States).**

| ACS year | Total households | Dial-up only (estimate) | Margin of error | Share (computed) |
|---|---|---|---|---|
| 2013 | 116,291,033 | 1,196,955 | ±15,540 | 1.03% |
| 2014 | 117,259,427 | 853,190 | ±11,759 | 0.73% |
| 2015 | 118,208,250 | 667,676 | ±12,579 | 0.56% |
| 2016 | 118,860,065 | 510,666 | ±9,665 | 0.43% |
| 2017 | 120,062,818 | 377,157 | ±9,058 | 0.31% |
| 2018 | 121,520,180 | 325,497 | ±8,497 | 0.27% |
| 2019 | 122,802,852 | 265,331 | ±7,387 | 0.22% |
| 2021 | 127,544,730 | 205,873 | ±7,529 | 0.16% |
| 2022 | 129,870,928 | 175,522 | ±6,969 | 0.14% |
| 2023 | 131,332,360 | 163,401 | ±5,874 | 0.12% |
| 2024 | 132,737,146 | 127,668 | ±5,526 | 0.10% |
| 2025 | 134,063,422 | 111,016 | ±6,090 | 0.08% |

Source: U.S. Census Bureau, American Community Survey 1-year estimates, table B28002 "Presence and Types of Internet Subscriptions in Household", variable B28002_003E. Table page: https://data.census.gov/table/ACSDT1Y2025.B28002?g=010XX00US (change the year in the ID for other years). Values were read from the JSON behind that page: https://data.census.gov/api/access/data/table?id=ACSDT1Y2025.B28002&g=010XX00US
Excerpt (variable label, 2024 metadata): "Estimate!!Total:!!With an Internet subscription!!Dial-up with no other type of Internet subscription"
Confidence: HIGH for the estimates. The "Share" column is my arithmetic. Notes: the 2013 label was "Dial-up alone"; 2020 was not queried; the latest release read is ACS 2025 (111,016 households).

**5-5. AOL ended dial-up on 30 September 2025, along with the AOL Dialer and AOL Shield browser.**
Source: AOL Help, "Dial-up Internet to be discontinued" (Wayback snapshot of 15 Aug 2025; the live page needs JavaScript). https://help.aol.com/articles/dial-up-internet-to-be-discontinued (snapshot: http://web.archive.org/web/20250815173122/https://help.aol.com/articles/dial-up-internet-to-be-discontinued)
Excerpt: "on September 30, 2025 this service and the associated software, the AOL Dialer software and AOL Shield browser, which are optimized for older operating systems and dial-up internet connections, will be discontinued."
Confidence: HIGH (company notice). The page carries US and Canada phone numbers and "© 2025 Yahoo".

**5-6. Reputable coverage of the AOL notice.**
Sources: (a) "AOL will stop offering dial-up internet service after more than 30 years in business", CNN Business, 11 Aug 2025. https://www.cnn.com/2025/08/11/tech/aol-dial-up-internet-discontinue (b) "AOL ends dial-up internet service after more than 30 years", BBC News, Aug 2025. https://www.bbc.com/news/articles/cj0yy3e6z4zo
Excerpt (BBC): ""AOL routinely evaluates its products and services and has decided to discontinue Dial-up Internet, " the company said in a notice to subscribers in the US and Canada on Friday."
Confidence: MEDIUM. BBC also quotes Steve Case: "Thanks for the memories RIP". Both outlets misstate the Census figure as people rather than households; see Disputed X-6.

**5-7. Another notable shutdown: BT closed its dial-up service on 1 September 2013.**
Source: "BT turns off dial-up internet access service", BBC News, 1 Sep 2013. https://www.bbc.co.uk/news/technology-23877364
Excerpt: "Telecoms giant BT is turning off its dial-up internet access service today. The company said it was taking the step because only a "tiny number" of its customers still went online using a dial-up modem."
Confidence: MEDIUM. Same article: "About 800,000 people still used dial-up in 2010, the last year for which figures were available, said an Ofcom spokesman." BT said remaining users could move to its Plusnet subsidiary.

**5-8. The FCC attributed the post-2000 fall in phone lines partly to households dropping second lines when they left dial-up.**
Source: FCC, "Trends in Telephone Service", Industry Analysis and Technology Division, Wireline Competition Bureau, Aug 2008. https://docs.fcc.gov/public/attachments/DOC-284932A1.pdf
Excerpt: "some households eliminating second lines when they move from dial-up Internet service to broadband service."
Confidence: HIGH. The numbers are at F-4.

---

# SIDEBARS

## A. AT command set primer

All Hayes items are from one document: Hayes Microcomputer Products, "Technical Reference for Hayes Modem Users", Version 1.0, 2 Nov 1990, as archived on textfiles.com. http://www.textfiles.com/computers/hayes.txt

**A-1. "AT" is the attention prefix; its speed and format tell the modem how to talk back.**
Excerpt: "Modem commands begin with an AT prefix that gets the modem's attention. The speed and character format at which the DTE sends this prefix tells the modem the speed and format for responding to commands"
Confidence: HIGH

**A-2. ATD dials; the T and P modifiers pick tone or pulse (ATDT, ATDP). Pulse was the factory default.**
Excerpt: "The P dial modifier selects the pulse method of dialing. ... The factory-set method is pulse."
Confidence: HIGH. Also: "The D command places the modem in originate mode; it then functions as an auto-dialer."

**A-3. ATA answers; if no carrier arrives within the S7 time, the modem hangs up with NO CARRIER.**
Excerpt: "If no carrier signal is received within the time specified in Register S7, the modem hangs up, returns the NO CARRIER result code, and enters the command state."
Confidence: HIGH

**A-4. ATH hangs up (H0) or goes off hook (H1); ATZ resets to a stored profile.**
Excerpt: "The modem can be reset by issuing the Z. The command tells the modem to go on hook and restore the selected stored profile."
Confidence: HIGH. For H: "H0 Execute the Hangup process" / "H1 Go off hook; do not execute the Handshake Process".

**A-5. Why you heard the handshake: the speaker default is M1, on until carrier is detected.**
Excerpt: "M0 Speaker always off. / M1 Speaker on until carrier detected. / M2 Speaker always on; stays on after carrier is detected."
Confidence: HIGH. The factory profile printed in the same manual reads "B0 B41 B60 E1 L2 M1 N1 P Q0 V1 W0 X4 Y0", so the defaults are M1 (speaker until carrier), L2 (medium volume), E1 (echo on), V1 (verbose results). L options: "L0 Low speaker volume / L1 Low speaker volume / L2 Medium speaker volume / L3 High speaker volume".

**A-6. S-registers: S0 sets auto-answer ring count (0 = off, the default); S7 is the wait-for-carrier time; S11 is touch-tone duration.**
Excerpt: "S0=0, the factory setting, disables auto-answer." / "S11 - Multi-Frequency Tone Duration: This register determines the duration and spacing of tones in multi-frequency tone dialing."
Confidence: HIGH. The factory profile in the manual shows S07:030 and S11:070 for one model family and S07:050, S11:095 for others; quote a specific value only with the model.

**A-7. "+++" with guard time: one second of silence before and after, set by S12; the escape character is in S2.**
Excerpt: "The escape sequence is issued by typing the plus key three times (+++) in succession. A pause of at least a second should precede and follow the three characters."
Confidence: HIGH. Also: "A one-second "guard time" interval prevents the modem from mistaking a random occurrence of the same three characters as the escape sequence."

**A-8. Result codes, numeric and verbal.**
Excerpt: "0 - OK / 1 - CONNECT / 2 - RING / 3 - NO CARRIER / 4 - ERROR / 5 - CONNECT 1200 / 6 - NO DIALTONE / 7 - BUSY / 8 - NO ANSWER / 10 - CONNECT 2400"
Confidence: HIGH

**A-9. The command set outlived the product: it is an ITU Recommendation (V.250) and a 3GPP profile.**
See 4-20, 4-21, 4-22.

Quote for this sidebar: A-7's "A one-second "guard time" interval prevents the modem from mistaking a random occurrence of the same three characters as the escape sequence."

---

## B. The world of BBSes

**B-1. CBBS was conceived on a snow day in January 1978 by Ward Christensen and Randy Suess of the Chicago hobbyist club CACHE.**
Source: Ward Christensen and Randy Suess, "The Birth of the BBS" (dated "By Ward and Randy - 1989"), hosted on Chinet, Suess's system. http://www.chinet.com/html/cbbs.html
Excerpt: "January 16, 1978 was a very snowy day. Couldn't get dug out, so called Randy. I had the CACHE message recorder phone line in my house, and Hayes had "invented" the hobbyist modem."
Confidence: HIGH as the creators' account. See Disputed X-3 on the date.

**B-2. 16 February 1978 is the birthday they chose to declare, not the day it first ran.**
Source: "The Birth of the BBS" (as B-1).
Excerpt: "Very early in Feb, started testing. No one believed it could be written in 2 weeks of spare time so we called it "one month" and to this day declare Feb 16 as the birthday."
Confidence: HIGH

**B-3. Suess insisted it run from his house in the city, and not as a club project.**
Source: "The Birth of the BBS" (as B-1).
Excerpt: "Randy said "no" - "you're in the burbs, I'm in the city - we'll put it in my house - and forget the club, a committee project will never be"
Confidence: HIGH (the sentence continues past the portion read)

**B-4. The original CBBS hardware: S-100 system, 8-inch floppy, Hayes 300 baud modem card.**
Source: "The Birth of the BBS", "(randy's narrative)" (as B-1).
Excerpt: "On the motherboard was some 8080 cpu (upgraded to a Z80) a Hayes 300 baud modem card, a 3P+S board with the parallel port used for control signals"
Confidence: HIGH. See Disputed X-4 for Wired's different hardware description.

**B-5. XMODEM grew out of Christensen's MODEM.ASM (late summer 1977); Keith Petersen's stripped-down version gave it the name.**
Source: "The Birth of the BBS" (as B-1).
Excerpt: "so he stripped MODEM down and called it XMODEM. Since that was a more "recognizable" name, that stuck as the protocol name."
Confidence: HIGH. Also: "so on late summer '77 wrote MODEM.ASM and tossed it into the CP/M users group." and "Used 128 byte blocks and a checksum - the bare essentials for XMODEM".

**B-6. YMODEM was named by Christensen; ZMODEM was Chuck Forsberg's streaming protocol.**
Source: "The Birth of the BBS" (as B-1).
Excerpt: "Chuck's 1K protocol as implemented in rb/sb needed a name, so I suggested he call it "Ymodem" which he did. He later wrote Zmodem, a protocol to send continuous blocks with asynch ACKs"
Confidence: HIGH

**B-7. ZMODEM dates from 1986 and was funded by Telenet for the public domain.**
Source: Chuck Forsberg, "The ZMODEM Inter Application File Transfer Protocol", Omen Technology Inc (revision typeset 14 Oct 1988). http://gallium.inria.fr/~doligez/zmodem/zmodem.txt
Excerpt: "In early 1986, Telenet funded a project to develop an improved public domain application to application file transfer protocol."
Confidence: HIGH. Also: "ZMODEM was developed for the public domain under a Telenet contract." Forsberg posted the protocol description to Usenet comp.sources.unix on 20 May 1986 (document marked "rev051486"): https://www.tuhs.org/Usenet/comp.sources.unix/1986-May/004372.html

**B-8. Size of the BBS world, mid-1992: nearly 60,000 public boards and about 10 million regular callers (Boardwatch figures via the NYT).**
Source: Judith Berck, "All About/Electronic Bulletin Boards; It's No Longer Just Techno-Hobbyists Who Meet by Modem", The New York Times, 19 Jul 1992 (text mirror). https://www.krsaborio.net/internet/research/1992/0719-a.htm (original: https://www.nytimes.com/1992/07/19/business/all-about-electronic-bulletin-boards-it-s-no-longer-just-techno-hobbyists-who.html)
Excerpt: "Mr. Rickard, who estimates the bulletin board industry at nearly $500 million, said there are nearly 60,000 public access bulletin boards in the United States, up from 3,500 five years ago."
Confidence: MEDIUM. See Disputed X-5: Rickard's own figure nine months later is lower.

**B-9. Size of the BBS world, end of 1992, in Jack Rickard's own words: 45,000 boards, over 12 million callers, heading for 60,000.**
Source: Jack Rickard (editor of Boardwatch), "Home-grown BB$", Wired, 1 Apr 1993. https://www.wired.com/1993/04/bbs/
Excerpt: "Those 45,000 publicly accessible dial-up bulletin boards (in the United States alone) operate over 100,000 access lines, and approximately 12.2 million callers dial into them on a regular basis."
Confidence: MEDIUM-HIGH (the Boardwatch editor writing under his own name; the figures are his estimates, not a census)

**B-10. Churn was enormous: Rickard expected more than half of 1992's boards to be gone within a year.**
Source: Rickard, Wired, Apr 1993 (as B-9).
Excerpt: "Of the 45,000 bulletin boards in operation at the end of 1992, over half will not be in operation at the end of 1993 - but most likely an additional 30,000 systems will have gone online"
Confidence: MEDIUM-HIGH

**B-11. Door games: Legend of the Red Dragon (Seth Robinson, first release 1989) and TradeWars 2002 (Gary Martin, 1991).**
Source: Benj Edwards, "The Forgotten World of BBS Door Games", PCMag, 14 Jan 2016. https://www.pcmag.com/news/the-forgotten-world-of-bbs-door-games
Excerpt: "The present incarnation of the game, TradeWars 2002, launched in 1991 and has seen continued improvement over the decades while retaining its text-based format."
Confidence: MEDIUM. The article lists "Legend of the Red Dragon / First Release: 1989 / Author: Seth Robinson" and "TradeWars 2002 / First Release: 1991 / Creator: Gary Martin".

**B-12. LORD was written to attract callers to its author's own BBS, with Trade Wars as the inspiration.**
Source: "BBS Door History / Seth Robinson Interview", GameBanshee, 31 Aug 2014. https://www.gamebanshee.com/interviews/113970-bbs-door-history-seth-robinson-interview/all-pages.html
Excerpt: "I knew I needed an interesting BBS game to attract more callers. ... Trade Wars was a huge inspiration, my friends and I played for hours daily."
Confidence: HIGH (creator interview). He also says: "I sold maybe around 30k registrations of my various DOS doors".

**B-13. Jason Scott's "BBS: The Documentary" was released in 2005; his textfiles.com archive hosts several primary texts cited here.**
Source: bbsdocumentary.com home page. http://www.bbsdocumentary.com/
Excerpt: "IN 2005, THE BBS DOCUMENTARY WAS RELEASED."
Confidence: HIGH for the release year. Jason Scott's name is not in the lines read from that page ("THE DIRECTOR" is a link); attribute by common knowledge or check the linked page.

Quote for this sidebar: B-1's snow-day line, or Christensen's "CBBS was born of the conditions "all the pieces are there, it is snowing like @#$%, lets hack"." (same source).

---

## C. FidoNet

**C-1. FidoNet began in 1984 with two nodes: Tom Jennings in San Francisco and John Madill in Baltimore.**
Source: Tom Jennings, "FidoNet History and Operation", 8 Feb 1985, in the Tom Jennings Collection on textfiles.com. http://www.textfiles.com/bbs/FIDONET/JENNINGS/HISTORY/fidohist.1.txt
Excerpt: "When FidoNet was first tested, there were two nodes: myself here at Fido #1 in San Francisco, and John Madill at Fido #2 in Baltimore."
Confidence: HIGH (founder, written eight months after the fact)

**C-2. Its purpose was to see if it could be done.**
Source: Jennings 1985 (as C-1).
Excerpt: "Its purpose: to see if it could be done, merely for the fun of it, like ham radio. It quickly became useful"
Confidence: HIGH

**C-3. Early growth: about 30 nodes by August 1984, about 50 by September, 160+ by early 1985.**
Source: Jennings 1985 (as C-1).
Excerpt: "FidoNet went from about 50 nodes in Sept 84 or so, to the current 160+ in Jan/Feb of 85."
Confidence: HIGH

**C-4. Store-and-forward at night because rates were low: the mail hour.**
Source: Randy Bush, "FidoNet: Technology, Use, Tools, and History" (draft of his Communications of the ACM paper, e-mailed to Jennings 4 Apr 1993), on textfiles.com. http://www.textfiles.com/bbs/FIDONET/JENNINGS/HISTORY/bush-cacm-paper.txt
Excerpt: "As US telephone rates are much lower in the middle of the night, he wrote a separate external program to run this email transfer for one designated hour to exchange mail with the other node."
Confidence: HIGH (FidoNet insider; CACM draft)

**C-5. That hour became "national mail hour", later renamed Zone Mail Hour (ZMH).**
Source: FidoNet Policy Document, Version 4.07, 9 Jun 1989, clause 1.3.3. https://www.fidonet.org/policy4.txt
Excerpt: "Zone Mail Hour has previously been referred to as National Mail Hour and Network Mail hour. The term Zone Mail Hour is more accurate."
Confidence: HIGH. Definition in the same clause: "Zone Mail Hour (ZMH) is a defined time during which all nodes in a zone are required to be able to accept netmail."

**C-6. In North America (Zone 1), ZMH is 0900–1000 UTC: 4 to 5 AM Eastern, 1 to 2 AM Pacific.**
Source: FidoNet Policy 4.07, clause 10.2 (as C-5).
Excerpt: "In FidoNet Zone 1, Zone Mail Hour is observed from 0900 to 1000 UTC." / "Eastern Standard Time 4 AM to 5 AM"
Confidence: HIGH

**C-7. Routing through city hubs came from the same phone-bill logic: one inter-city call per night.**
Source: Bush 1993 (as C-4).
Excerpt: "As calls within a city of the US are generally free, but calls between cities are not, it seemed obvious to concentrate the intercity traffic into one call per night."
Confidence: HIGH

**C-8. Echomail, FidoNet's public conferences, was developed by Jeff Rush in February 1986.**
Source: Bush 1993 (as C-4).
Excerpt: "In February 1986, Jeff Rush developed FidoNet's form of enews called echomail. As very few FidoNetters were familiar with the Usenet, they were quite surprised at the popularity and rate of growth of echomail."
Confidence: HIGH

**C-9. Nodelist growth to 1993 (Bush's table): 4,000 in 1988; 9,000 in 1990; 11,000 in 1991; 16,000 in 1992; 20,000 by April 1993.**
Source: Bush 1993 (as C-4).
Excerpt: "The public FidoNet has approximately 20,000 nodes worldwide."
Confidence: HIGH. Bush also estimates "on the order of 2,000,000 FidoNet users read or write enews".

**C-10. Peak nodelist size: 35,787 nodes in the nodelist of 9 June 1995, per a count from archived nodelists.**
Source: Frank Robbins, "FidoNet History Timeline", The FidoNet Showcase Project, copyright 1999–2001 (header: "THIS DOCUMENT IS UNDER REVISION & VERIFICATION OF COLLECTED DATA"). https://elsmar.com/pdf_files/fidonet-info.txt
Excerpt: "09-Jun-1995 Active Nodes in Current Nodelist = 35787 Fido reaches its high peak of recorded Nodes."
Confidence: MEDIUM (hobbyist compilation from primary nodelists, self-described as unverified; he notes "Only nodelist.006 & .363 in archive for 1995 reference", so the June figure's provenance is unclear). See Disputed X-7 for 38,000 and other figures.

**C-11. Jennings's own retrospective numbers.**
Source: Tom Jennings, "Fido and FidoNet" (personal archive page, "updated 28 feb 2020"). https://www.sensitiveresearch.com/Archive/FidoNet/index.html
Excerpt: "FidoNet grew at an insane rate; two computers in spring 1984, 160 that fall, 32,000 by the early 1990's."
Confidence: HIGH as his recollection. He says FidoNews went to "up to 35,000 copies per week". Note his "160 that fall" differs from his own 1985 text (C-3), which puts 160 in Jan/Feb 1985.

Quote for this sidebar: the wrong-number story from Jennings 1985: "imagine you are a poor old lady, who every single night is getting phone calls EVERY TWO MINUTES AT 4:00AM, no one says anything, then hangs up."

---

## D. SLIP and PPP

**D-1. SLIP was documented in RFC 1055 (June 1988) and was explicitly not a standard.**
Source: J. Romkey, "A Nonstandard for Transmission of IP Datagrams over Serial Lines: SLIP", RFC 1055, June 1988. https://www.rfc-editor.org/rfc/rfc1055.txt
Excerpt: "SLIP, Serial Line IP, is a currently a de facto standard, commonly used for point-to-point serial connections running TCP/IP. It is not an Internet standard."
Confidence: HIGH

**D-2. SLIP's origins: 3COM UNET in the early 1980s; Rick Adams's 1984 implementation for Berkeley Unix spread it.**
Source: RFC 1055 (as D-1).
Excerpt: "Around 1984, Rick Adams implemented SLIP for 4.2 Berkeley Unix and Sun Microsystems workstations and released it to the world."
Confidence: HIGH

**D-3. What SLIP lacks, by its own admission: addressing, type identification, error detection, compression.**
Source: RFC 1055 (as D-1).
Excerpt: "It is merely a packet framing protocol ... It provides no addressing, packet type identification, error detection/correction or compression mechanisms."
Confidence: HIGH

**D-4. PPP's RFC lineage: RFC 1134 (Nov 1989, D. Perkins, CMU) → RFC 1171 (Jul 1990) → RFC 1331 (May 1992, W. Simpson) → RFC 1548 (Dec 1993) → RFC 1661 (Jul 1994, STD 51).**
Source: headers of each RFC at rfc-editor.org, e.g. https://www.rfc-editor.org/rfc/rfc1134.txt and https://www.rfc-editor.org/rfc/rfc1661.txt
Excerpt (RFC 1661 header): "Request for Comments: 1661 ... STD: 51 July 1994 Obsoletes: 1548"
Confidence: HIGH

**D-5. PPP's three parts: encapsulation, LCP, and a family of NCPs.**
Source: W. Simpson (ed.), "The Point-to-Point Protocol (PPP)", RFC 1661, July 1994. https://www.rfc-editor.org/rfc/rfc1661.txt
Excerpt: "A Link Control Protocol (LCP) for establishing, configuring, and testing the data-link connection." / "A family of Network Control Protocols (NCPs) for establishing and configuring different network-layer protocols."
Confidence: HIGH

**D-6. Why PPP was needed: no standard encapsulation existed for serial links.**
Source: D. Perkins, "The Point-to-Point Protocol: A Proposal for Multi-Protocol Transmission of Datagrams Over Point-to-Point Links", RFC 1134, Nov 1989. https://www.rfc-editor.org/rfc/rfc1134.txt
Excerpt: "One reason for the small number of point-to-point IP links is the lack of a standard encapsulation protocol."
Confidence: HIGH

**D-7. IPCP (RFC 1332, May 1992) is the NCP for IP, and it negotiates Van Jacobson compression.**
Source: G. McGregor, "The PPP Internet Protocol Control Protocol (IPCP)", RFC 1332, May 1992. https://www.rfc-editor.org/rfc/rfc1332.txt
Excerpt: "This document defines the NCP for establishing and configuring the Internet Protocol [2] over PPP, and a method to negotiate and use Van Jacobson TCP/IP header compression [3] with PPP."
Confidence: HIGH

**D-8. PAP sends the password in the clear.**
Source: B. Lloyd and W. Simpson, "PPP Authentication Protocols", RFC 1334, Oct 1992. https://www.rfc-editor.org/rfc/rfc1334.txt
Excerpt: "PAP is not a strong authentication method. Passwords are sent over the circuit "in the clear", and there is no protection from playback"
Confidence: HIGH

**D-9. CHAP uses a three-way challenge handshake and can repeat it during the session.**
Source: W. Simpson, "PPP Challenge Handshake Authentication Protocol (CHAP)", RFC 1994, Aug 1996 (obsoletes RFC 1334). https://www.rfc-editor.org/rfc/rfc1994.txt
Excerpt: "The Challenge-Handshake Authentication Protocol (CHAP) is used to periodically verify the identity of the peer using a 3-way handshake."
Confidence: HIGH

**D-10. Van Jacobson header compression (RFC 1144, Feb 1990): a 40-byte TCP/IP header shrinks to about 3 bytes on average.**
Source: V. Jacobson, "Compressing TCP/IP Headers for Low-Speed Serial Links", RFC 1144, Feb 1990. https://www.rfc-editor.org/rfc/rfc1144.txt
Excerpt: "The header size is 40 bytes: 20 bytes of IP and 20 of TCP." / "the average compressed header is 3 bytes compared to 13 in Thinwire-II"
Confidence: HIGH. The RFC targets "low speed (300 to 19,200 bps) serial links".

**D-11. Trumpet Winsock was written by Peter Tattam in Tasmania; version 1.0A was released 1 February 1994 as shareware with a 30-day evaluation.**
Source: Trumpet Software Pty Ltd v OzEmail Pty Ltd, Federal Court of Australia, Tasmania District Registry, No. TG 21 of 1995, Heerey J, 10 Jul 1996 (text mirror, read via Wayback). http://web.archive.org/web/20240327135253/https://www.isc.meiji.ac.jp/~sumwel_h/doc/cases/Trumpet_1996_AU_DC_Tasmania.htm
Excerpt: "For ten years prior to September 1994 Mr Tattam was employed in the Psychology Department of the University of Tasmania. During this period, and independently of his employment with the University, Mr Tattam developed the Trumpet Winsock program."
Confidence: HIGH (court findings of fact). Also: "Since Trumpet Winsock was released in version 1.0A on 1 February 1994 it has achieved remarkable success within Australia and overseas."

**D-12. Windows 95 built PPP dial-up into the operating system; SLIP was an extra on the CD-ROM.**
Source: Microsoft Knowledge Base Q138789, "How to Connect to the Internet in Windows 95/98" (archive mirror). https://helparchive.huntertur.net/document/105853
Excerpt: "Windows 95/98 has built-in support for connecting to an Internet provider using a PPP (Point-to-Point Protocol) or SLIP (Serial Line Internet Protocol) account."
Confidence: HIGH (Microsoft KB text; third-party mirror). Also: "SLIP is included in the Admin\Apptools\Dscript folder on the Windows 95 CD-ROM."

Quote for this sidebar: the RFC 1055 title itself, "A NONSTANDARD FOR TRANSMISSION OF IP DATAGRAMS OVER SERIAL LINES: SLIP".

---

## E. Multiplayer gaming over modems

**E-1. DOOM shipped 10 Dec 1993 without modem play. v1.2 (17 Feb 1994) added it.**
Source: Hank Leukart, "The 'Official' DOOM FAQ" (Anniversary Edition, 10 Dec 1994), section 5, hosted at gamers.org. https://www.gamers.org/docs/FAQ/doomfaq/sect1.html
Excerpt: "Version 1.2, released on February 17th, added modem play, Nightmare mode"
Confidence: HIGH (the contemporary community FAQ; not an id document, but id's own v1.9 README tells users to "read the DOOM FAQ v6.666"). Also: "On December 10th, 1993, v1.0 was released. On December 16th, 1993, v1.1 was released."

**E-2. Explicit statement that 1.0 and 1.1 lacked it.**
Source: Leukart, DOOM FAQ, section 8-4 (as E-1).
Excerpt: "Shareware versions 1.0 and 1.1 do NOT support play by modem or serial link."
Confidence: HIGH

**E-3. Direct modem play was two players at 9600 bps or better, modem-to-modem or by null-modem cable; four players needed an IPX network.**
Source: Leukart, DOOM FAQ, sections 3-7 and 8-4 (as E-1).
Excerpt: "DOOM works in two player mode by modem or null modem. The minimum baud rate to play DOOM is 9600 bps."
Confidence: HIGH. Also: "Up to four players can play over a local network, or two players can play by modem or serial link."

**E-4. id's own documentation: SERSETUP.EXE is the serial driver, with -dial and -answer switches. DWANGO's client shipped in the box by v1.9.**
Source: id Software, README.TXT for DOOM v1.9 (mirror). https://people.salixos.org/timcowchip/dosprogs/DOOMS/README.TXT
Excerpt: "When you want to play a modem or null-modem game, you need to run SERSETUP.EXE which is the device driver for DOOM's serial communications mode."
Confidence: HIGH. Same file: "DWANGO.EXE, the client software for the NEW multiplayer gaming environment of the future".

**E-5. QuakeWorld was announced in Carmack's .plan of 2 Aug 1996 as an Internet-only rewrite, because he had designed Quake's netcode for the wrong latency.**
Source: John Carmack, .plan file, 2 Aug 1996, in the ESWAT john-carmack-plan-archive. https://github.com/ESWAT/john-carmack-plan-archive/blob/master/by_day/johnc_plan_19960802.txt
Excerpt: "My original design was targeted at <200ms connection latencies. ... Unfortunately, 99% of the world gets on with a slip or ppp connection over a modem, often through a crappy overcrowded ISP. This gives 300+ ms latencies, minimum."
Confidence: HIGH (primary). This is also the source for "typical modem ping": 300+ ms in Carmack's estimate.

**E-6. Client-side prediction, in Carmack's words.**
Source: Carmack .plan, 2 Aug 1996 (as E-5).
Excerpt: "I am now allowing the client to guess at the results of the users movement until the authoritative response from the server comes through. This is a biiiig architectural change."
Confidence: HIGH. Follow-on: "even playing over a 200+ ms latency link, the player movement feels exactly like you are playing a single player game".

**E-7. QuakeWorld went live on 17 Dec 1996 and the master server fell over.**
Source: Carmack .plan, 17 Dec 1996. https://github.com/ESWAT/john-carmack-plan-archive/blob/master/by_day/johnc_plan_19961217.txt
Excerpt: "QuakeWorld went up, got to around 4000 users, then the master server exploded."
Confidence: HIGH

**E-8. Bandwidth budgeting for modems: Carmack planned a cap of about 2000 bytes per second for dial-up links, and later shipped per-modem rate presets.**
Sources: Carmack .plan, 2 Aug 1996 (as E-5), and .plan of 26 Apr 1999. https://github.com/ESWAT/john-carmack-plan-archive/blob/master/by_day/johnc_plan_19990426.txt
Excerpt (1999): "We are fairly conservative with the values we set for the given modem speeds: 2500 for 28.8, 3000 for 33, and 3500 for 56k."
Confidence: HIGH. 1996 wording: "A dialup line can just say "never send more than 2000 bytes a second in datagrams"".

**E-9. "LPB" and "HPB" were common enough that Carmack used them unglossed in 1999.**
Source: Carmack .plan, 29 Dec 1999. https://github.com/ESWAT/john-carmack-plan-archive/blob/master/by_day/johnc_plan_19991229.txt
Excerpt: "a LPB may occasionally get into a HPB server if they happen to get a network hiccup at just the right time"
Confidence: HIGH for the usage. The expansions ("low ping bastard", "high ping bastard") and the claim that the terms arose in 1996 were seen only on wikis and are not verified; see Could not verify V-6.

**E-10. Kali: IPX-over-Internet for DOS games, first public release 26 April 1995, grown out of iDOOM (23 Sep 1994).**
Source: Jay Cotton, "History of Kali and iFrag" (mirror on doom2.net). https://www.doom2.net/history/history2.html
Excerpt: "On April 26, 1995 Kali 1.0wb is released to the public. Immediately everyone complains that it's too hard to setup"
Confidence: HIGH (creator's account). Also: "It wasn't until September 23, 1994 that we had our own working version of tcpsetup called iDOOM (v1.0)."

**E-11. DWANGO ran its own dial-up servers in many cities rather than using the Internet, and closed in October 1998.**
Source: "Dwango Dies", IGN, 22 Oct 1998 (URL date; text says it closed "last Friday"). https://www.ign.com/articles/1998/10/22/dwango-dies
Excerpt: "Dwango was unique in that it operated dial-up servers in many cities across the country, in contrast to the other gaming services, which are accessible via the Internet."
Confidence: MEDIUM. The 1994 founding in Houston by Bob Huntley and Kee Kimbrell, and the pricing ($1.95 an hour, later $8.95 a month), were seen only on Wikipedia and derivative sites; see Could not verify V-5.

Quote for this sidebar: Carmack, 2 Aug 1996: "Client. User's modem. ISP's modem. Server. ISP's modem. User's modem. Client. God, that sucks."

---

## F. Living with one home phone line

**F-1. Call waiting drops modem connections because its click interrupts the carrier.**
Source: Hayes, "Technical Reference for Hayes Modem Users", 1990, section B.2.2.2 (as sidebar A). http://www.textfiles.com/computers/hayes.txt
Excerpt: "The call waiting feature available on some dial-up lines momentarily interrupts a call, causing a click, to inform voice call users that another call is coming through. This process effectively interrupts the carrier signal and may cause some modems to drop the connection."
Confidence: HIGH

**F-2. Hayes's two remedies: raise S10 (carrier-loss tolerance), or dial a disabling prefix.**
Source: Hayes Technical Reference (as F-1).
Excerpt: "When originating the call, a special prefix can be issued as part of the dialing string to disable call waiting for the duration of the call. The exact procedure varies from area to area"
Confidence: HIGH

**F-3. The prefix was usually *70 (or 70# or 1170), and Windows offered it as a dialing option.**
Source: Microsoft Knowledge Base 275578, "How to Disable the Call Waiting Feature in Windows", revision 1.4, 29 Jan 2007 (Wayback). http://web.archive.org/web/20110420072824/http://support.microsoft.com:80/kb/275578
Excerpt: "In the To disable call waiting, dial box, click the appropriate code to disable the Call Waiting feature, for example: *70, 70#, or 1170."
Confidence: HIGH

**F-4. Second lines: non-primary residential lines rose from 2.3 million (1988) to a peak of 26.3 million (2001), then fell to 10.5 million (2006).**

| Year | Non-primary residential lines (millions) | Households with telephone service (millions) |
|---|---|---|
| 1988 | 2.3 | 85.4 |
| 1990 | 3.9 | 88.4 |
| 1992 | 8.3 | 91.0 |
| 1994 | 11.4 | 93.7 |
| 1996 | 16.0 | 95.1 |
| 1998 | 19.1 | 98.0 |
| 1999 | 23.6 | 99.1 |
| 2000 | 26.2 | 100.2 |
| 2001 | 26.3 | 102.2 |
| 2002 | 18.4 | 104.0 |
| 2003 | 16.0 | 107.1 |
| 2004 | 13.8 | 106.4 |
| 2005 | 12.1 | 107.0 |
| 2006 | 10.5 | 108.8 |

Source: FCC, "Trends in Telephone Service", Aug 2008, Table 7.4 "Additional Residential Lines For Households with Telephone Service (End-of-Year Data in Millions)". https://docs.fcc.gov/public/attachments/DOC-284932A1.pdf
Excerpt: "2000 126.4 65.8 192.2 100.2 100.2 26.2 / 2001 127.3 62.8 190.1 102.2 1.2 101.0 26.3 / 2002 120.5 64.6 185.1 104.0 1.8 102.2 18.4"
Confidence: HIGH. Units are millions of lines, not percent of households. The table's footnote says the method for splitting primary and non-primary lines changed from 2002, so part of the 2001→2002 drop may be definitional.

**F-5. BBS callers alone had installed millions of extra lines by 1993, in Rickard's estimate.**
Source: Rickard, Wired, Apr 1993 (as B-9).
Excerpt: "Those callers installed nearly 4.7 million additional telephone lines just to call bulletin boards - representing nearly $850 million in annual income to telephone companies, who are only vaguely aware of their existence."
Confidence: MEDIUM (an industry editor's estimate; compare the FCC's 8.3 million non-primary lines for 1992)

**F-6. CompuServe by the hour, 1987: $6 at 300 baud, $12.50 at 1200 and 2400.**
Source: "CompuServe sees the daylight – trims morning on-line rates", Chicago Tribune, 31 May 1987. https://www.chicagotribune.com/1987/05/31/compuserve-sees-the-daylight-trims-morning-on-line-rates/
Excerpt: "On-line rates are now $6 an hour for users whose modems transmit data at speeds between 110 and 450 bits-per-second, and $12.50 an hour for callers at 1,200 and 2,400 b.p.s."
Confidence: MEDIUM (contemporary newspaper column)

**F-7. AOL before December 1996: $9.95 for five hours a month, then $2.95 for each additional hour (or $19.95 for 20 hours).**
Source: David Einstein, "AOL to Offer Unlimited Access", San Francisco Chronicle / SFGate, 30 Oct 1996. https://www.sfgate.com/business/article/AOL-to-Offer-Unlimited-Access-3596892.php
Excerpt: "AOL currently has a two-tiered pricing scheme that offers five hours of free connect time per month for $9.95, or 20 hours for $19.95. In both cases, users pay $2.95 an hour"
Confidence: MEDIUM. Corroborated by CNET, 8 Nov 1996: "the existing plan, which charges $9.95 for five hours plus $2.95 for every additional hour". https://www.cnet.com/tech/services-and-software/aol-users-in-for-sticker-shock/

**F-8. AOL went flat-rate ($19.95 unlimited) on 1 December 1996.**
Source: SFGate, 30 Oct 1996 (as F-7).
Excerpt: "On December 1, AOL will begin converting all of its nearly 7 million customers to the new pricing, unless they choose one of two other new options."
Confidence: MEDIUM. Reuters via NYT Cybertimes, 6 Dec 1996: "Last month, AOL, the world's largest online service announced a new pricing plan of unlimited access for $19.95 a month." https://archive.nytimes.com/www.nytimes.com/library/cyber/week/1206aol.html

**F-9. Flat rate produced the great busy signal of January 1997.**
Source: Associated Press, "Customers Say AOL Out Of Line: Flat-Rate Pricing Leads To Busy Signals, Lawsuits", The Spokesman-Review, 18 Jan 1997. https://www.spokesman.com/stories/1997/jan/18/customers-say-aol-out-of-line-flat-rate-pricing/
Excerpt: "so many people are going online - and staying online, because the flat price is so much more affordable than the old hourly rates - that many users trying to log in get busy signals for hours on end."
Confidence: MEDIUM. Same story: "AOL's usage has doubled since the flat-rate price was introduced in December, Pittman said."

**F-10. Long-distance costs shaped BBS networking: FidoNet batched inter-city mail into one night-time call.**
See C-4 and C-7.

Quote for this sidebar: AOL's Bob Pittman, AP, 18 Jan 1997: "The reality is no one's ever built a dial-up network of this size".

## G. 56k standards war

Skipped as instructed. Facts 1-13 to 1-15 touch V.90 only for its ISDN/digital-network relationship.

---

# Disputed / uncertain

Items here are numbered X-1 to X-10 so they do not collide with sidebar D's claim numbers.

**X-1. When was DOCSIS 1.0 "released"?**
- 1996: CableLabs' own comparison table gives "First Specification Issue Date ... DOCSIS 1.0 1996" (https://www.cablelabs.com/technologies/docsis-4-0-technology). Light Reading says "December 1996 ... CableLabs and the industry introduced DOCSIS" (https://www.lightreading.com/cable-technology/the-road-to-docsis-4-0). J.112's reference list shows other MCNS interface specs numbered "I01-960702" (July 1996).
- 26 March 1997: the date printed on the RF interface spec SP-RFI-I01-970326 (Wayback copy of the CableLabs PDF). This is the "March 1997" in the brief and on Wikipedia.
- March 1999: first certified modems (Light Reading), and Yassini's own phrase "DOCSIS was born in March, 1999" (Cable Center oral history).
- Suggested wording: "the MCNS partners began issuing the specifications in 1996; the core radio-frequency spec is dated 26 March 1997; the first certified modems arrived in March 1999."

**X-2. June or July 1999 for G.992.1, G.992.2 and G.994.1?**
- The document covers read say "(06/99)". The ETHW milestone page also writes "G.992.1 (06/99)". A patent text read (US20040068686) says G.994.1 was "published in June 1999".
- The ITU catalogue lists the same editions as "(07/99)", "Approved in 1999-07-02" (G.992.1, G.994.1) and "1999-07-01" (G.992.2).
- Both are ITU-sourced. "1999" is safe; "approved 2 July 1999 (documents dated June 1999)" is exact.

**X-3. What day was the CBBS snowstorm, and when did CBBS start?**
- Christensen's 1989 text: "January 16, 1978 was a very snowy day" (http://www.chinet.com/html/cbbs.html). Wired (Rickard, 1993) also says the software came together "in January 1978".
- The brief says "Feb 16 1978, during the blizzard". Christensen's text says February 16 is a declared birthday: testing began "Very early in Feb" and "we called it "one month"".
- No weather or newspaper source was opened in this task, so the storm's actual date is not established here. Check it before printing a day of the month; "a snowbound day in January 1978" is all the creators' text supports with certainty.

**X-4. What hardware did the first CBBS run on?**
- Suess's narrative (same Chinet page): an S-100 motherboard on a BUD chassis, 8080 CPU (later Z80), "a Hayes 300 baud modem card"; moved to "a NorthStar Horizon cabinet" about a year later.
- Wired, Apr 1993 (Rickard): "a Northstar Horizon CP/M personal computer built by his friend, Randy Suess, to answer the telephone using a 110-bps modem."
- Prefer the creators' account.

**X-5. How many BBSes were there at the peak?**
- NYT, 19 Jul 1992, citing Rickard: "nearly 60,000 public access bulletin boards in the United States, up from 3,500 five years ago", about 10 million regular callers.
- Wired, Apr 1993, by Rickard himself: 45,000 at the end of 1992, 12.2 million callers, projecting "close to 60,000 systems in the US" by the end of 1993.
- The two Rickard-sourced figures for 1992 differ by a third. The often-repeated "60,000 BBSes serving 17 million users in 1994 (InfoWorld)" was seen only on Wikipedia mirrors and was not verified.

**X-6. How many Americans were still on dial-up when AOL quit?**
- Census ACS 2023 (read directly): 163,401 households with dial-up only; ACS 2025: 111,016 households.
- CNN, 11 Aug 2025: "about 160,000 people connect to the internet through their landline telephone service, data from the 2023 US Census shows."
- BBC, Aug 2025: "Fewer than 300,000 people in the US reported having only a dial-up internet connection ... according to 2023 government estimates."
- The Census unit is households, not people. AOL did not publish its own subscriber count in the notice read.

**X-7. FidoNet's peak size.**
- 35,787 nodes on 9 Jun 1995 (Robbins timeline, counted from nodelists; document self-described as under verification).
- "38K nodes in 1996" (The Jargon File, entry "FidoNet": http://www.catb.org/~esr/jargon/html/F/FidoNet.html — "FidoNet's site count has dropped from 38K nodes in 1996 through 15K nodes in 2001 to 10K nodes in late 2003").
- "32,000 by the early 1990's" and FidoNews at "up to 35,000 copies per week" (Jennings's own page).
- "approximately 39,000" and "almost 40,000" (Wikipedia and derivatives; seen in search results only, not used).
- Bush's 1993 paper has only 20,000 as of April 1993, which makes "32,000 by the early 1990s" too early unless "early" stretches to 1994–95.

**X-8. Who is "the father of DSL"?**
- NYT headline calls Lechleider "a Father of the DSL Internet Technology" and says younger engineers "like Mr. Cioffi" built the modems.
- Cioffi's own chapter credits "Stanford University" and the Amati team for DMT and does not mention Lechleider in the passages read.
- These are compatible (asymmetry concept vs working DMT modem) but the title is contested in popular sources.

**X-9. Is CAP vs DMT settled history, and who was ahead in deployment?**
- ETHW/Cioffi: DMT "showed its superiority" in early 1993 and ANSI chose it that March.
- 1997 sources (EE Times; WUSTL survey) show the fight continuing four years later, with CAP "quicker to get to market".
- A claim that CAP held "nearly 97 percent of all ADSL line deployments ... through 1996" (Paradyne's DSL Sourcebook) was seen only in a search snippet; the host did not resolve, so it is not verified.

**X-10. LANcity's sale price.** $59 million (Inc. excerpt of Yassini's 2025 book; Wikipedia) vs $56 million (Light Reading). Both seen in search results only.

---

# Quotes

All verbatim from source text read in this task.

1. "Unfortunately, 99% of the world gets on with a slip or ppp connection over a modem, often through a crappy overcrowded ISP. This gives 300+ ms latencies, minimum. Client. User's modem. ISP's modem. Server. ISP's modem. User's modem. Client. God, that sucks."
   — John Carmack, .plan file, 2 Aug 1996. https://github.com/ESWAT/john-carmack-plan-archive/blob/master/by_day/johnc_plan_19960802.txt

2. "Ok, I made a bad call. I have a T1 to my house, so I just wasn't familliar with PPP life. I'm adressing it now."
   — John Carmack, .plan file, 2 Aug 1996 (same URL). Spelling as in the original.

3. "I am sad to see the elegent client-as-terminal setup go away, but I am practical above idealistic."
   — John Carmack, .plan file, 2 Aug 1996 (same URL), on adding client-side prediction.

4. "CBBS was born of the conditions "all the pieces are there, it is snowing like @#$%, lets hack"."
   — Ward Christensen, "The Birth of the BBS", 1989. http://www.chinet.com/html/cbbs.html

5. "imagine you are a poor old lady, who every single night is getting phone calls EVERY TWO MINUTES AT 4:00AM, no one says anything, then hangs up."
   — Tom Jennings, "FidoNet History and Operation", 8 Feb 1985, on wrong numbers in the nodelist. http://www.textfiles.com/bbs/FIDONET/JENNINGS/HISTORY/fidohist.1.txt

6. "There was considerable skepticism ... There were people who didn't want to deploy it. There were people who didn't think it would work. Many of them weren't sure there was a market for it."
   — Joseph Lechleider on DSL, 2003 Wall Street Journal interview as quoted in The New York Times, 4 May 2015 (ellipsis replaces the NYT's attribution clause). https://engineering.nyu.edu/news/joseph-lechleider-father-dsl-internet-technology-dies-82

7. "DSL allowed the phone companies to milk another two decades out of their copper infrastructure"
   — Craig Moffett, telecommunications analyst, The New York Times, 4 May 2015 (same URL).

8. "In dramatic reversal of fortune ... the gold-medalist DMT system resurrected MT at 4:10 pm on March 10, 1993"
   — John M. Cioffi, "Multi-Channel Modulation" (course text, chap. 4). https://cioffi-group.stanford.edu/doc/book/chap4.pdf

9. "The first generation of the modem was half the size of refrigerators."
   — Rouzbeh Yassini, Cable Center oral history, 22 Apr 2014. https://syndeoinstitute.org/the-hauser-oral-history-project/w-z-listings/dr-rouzbeh-yassini/

10. "The CAP vs. DMT debate has taken on the nature of a religious holy war within the ADSL community"
    — Andrew W. Davis, EE Times, 4 Oct 1997. https://www.eetimes.com/modulation-schemes-moving-digital-data-with-analog-signals/

11. "The reality is no one's ever built a dial-up network of this size"
    — Bob Pittman of AOL, Associated Press in The Spokesman-Review, 18 Jan 1997. https://www.spokesman.com/stories/1997/jan/18/customers-say-aol-out-of-line-flat-rate-pricing/

12. "We built it, and they didn't come"
    — Robert Huntley, DWANGO co-founder, to the Houston Chronicle, as quoted by IGN, Oct 1998. https://www.ign.com/articles/1998/10/22/dwango-dies

13. "AOL routinely evaluates its products and services and has decided to discontinue Dial-up Internet."
    — AOL Help notice, Aug 2025. https://help.aol.com/articles/dial-up-internet-to-be-discontinued

14. "The joke used to be that ISDN stood for "It Still Does Nothing.""
    — CNET News staff, 15 Apr 1996. https://www.cnet.com/tech/services-and-software/isdn-supporters-lodge-complaints/

---

# Could not verify

Nothing in this section should be stated as fact without another source. Gaps were not filled from memory.

**V-1. CCITT Red Book (1984) and Blue Book (1988) as the ISDN I-series milestones.** The ITU catalogue pages read list I.120 and I.430 editions from 11/88 onward and I.412 as approved 1988-11-25 (the Blue Book cycle). No ITU page read shows a 1984 edition or uses the words "Red Book". The only source read for 1984 is CNET (1-9): "The ISDN specification was hammered out in 1984". Confidence for "1984 Red Book": LOW.

**V-2. That the ISP side of V.90 was specifically ISDN PRI or channelized T1.** V.90 says only "a digital switched network" and calls the interface a national matter; USR says the ISP's signal "begins as a digital signal". No vendor or carrier document naming PRI/T1 was opened (a Cisco search returned nothing usable). The statement is very likely true but is unsourced here.

**V-3. That G.994.1's message names (CL, CLR, MS, ACK) were taken from V.8bis.** The V.8bis text was not downloaded. A sentence seen in a search snippet — "Several of the features of G.994.1 came from the voiceband handshake Recommendations V.8 and V.8bis" — appeared in a blog comment quoting an unnamed paper and could not be traced. A patent's citation of a Matsushita contribution titled "Proposed Working Text for G.hs Based on V.8bis" (ITU, Nice, May 1998) was also seen only in a snippet. Use 2-18 and 2-19 instead.

**V-4. Japan as a place where ISDN "thrived", in absolute terms, and why.** Only penetration rankings were read (1-11, 1-12). NTT's INS-Net launch date (April 1988) and subscriber peaks were seen only on Wikipedia. Deutsche Telekom's "2000: Statistics" investor page was fetched but its ISDN figures did not come through in the text.

**V-5. DWANGO's founding details.** "Created in 1994 by Bob Huntley and Kee Kimbrell in Houston", long-distance dialing to Houston, $1.95/hour then $8.95/month, 22 servers: all from Wikipedia and copies (which cite Kushner's Masters of Doom and PC Magazine, neither read). Verified here: the DWANGO client shipped with DOOM v1.9 (E-4); it ran its own dial-up servers; Huntley was co-founder and CEO; it closed in Oct 1998 (E-11).

**V-6. "HPB/LPB" expansions and origin date.** Carmack's use of the abbreviations in 1999 is verified (E-9). The expansions and a 1996 origin were seen only on wikis. Typical ping numbers for LPBs were not sourced.

**V-7. MUDs.** No source on MUDs over dial-up was opened.

**V-8. "Someone picked up the extension."** No source read describes this failure directly. The Hayes reference explains the mechanism only in general (carrier loss longer than S10 causes a hang-up).

**V-9. CompuServe's 1990s pricing ($8.95/month basic, $4.80–$9.60/hour extended) and long-distance BBS phone bills as dollar figures.** Seen only in a search snippet of an academic paper; not opened. Verified CompuServe figures are for 1987 only (F-6); a 1989 LA Times piece seen in results repeats $12.50 but its text was not read closely enough to quote.

**V-10. The Great Blizzard's date and its link to CBBS.** See Disputed X-3. No weather or newspaper source was opened.

**V-11. AOL's dial-up subscriber numbers near the end.** A New York Times article (11 Aug 2025) seen in search results gives "more than two million" dial-up users in 2015 and 163,000 dial-up-only households in 2023; the NYT page was not opened (the 163,000 figure matches the Census table read directly).

**V-12. Other dial-up shutdowns** beyond BT (2013) and AOL (2025). NetZero, Juno, EarthLink, MSN and others were not researched.

**V-13. HDSL technical specifics** (two pairs, 784 kbit/s per pair, 2B1Q or CAP). Not read in G.991.1 or elsewhere. A 1997 student survey says HDSL "provides a symmetric data pathway at 1.544 Mb/s which matches the speed of today's T-1's"; nothing stronger was read.

**V-14. Trellis-coded modulation, adaptive equalization and QAM as explicitly "inherited from dial-up" in a single authoritative sentence.** The individual facts are sourced (4-1 to 4-14), and 4-12 is an explicit IEEE citation of V.34 as prior art for precoding. No source read makes the general "DSL and Ethernet inherited X from voiceband modems" claim in so many words for QAM or equalization.

**V-15. The BYTE November 1978 article "Hobbyist Computerized Bulletin Board"** by Christensen and Suess. Mentioned in their 1989 text; not opened.

**V-16. Pew's exact unit for the chart at 5-1.** The chart page text has no caption. Pew's 2013 short read says "3% of Americans" and a 2012 Pew report seen in results describes the series as "% of American adults"; the 2012 report was not opened.

---

## TLDR

- Epilogue facts for ISDN, DSL, cable, carried-forward techniques and the long tail are sourced to ITU texts, RFCs, CableLabs, FCC, Census, Pew and creators' own accounts; most are HIGH.
- Eight points in the brief needed correcting, chiefly DOOM's modem support (Feb 1994, not Dec 1993), the CBBS date, 1000BASE-T's trellis code, and G.fast using TDD.
- Best lineage citations: Wei's 16-state 4D code in both V.34 and G.992.1; IEEE 802.3an citing V.34 for precoder start-up; G.994.1 carrying V.8/V.8bis code points; 3GPP TS 27.007 still listing the speaker commands as "ignored".
- Latest dial-up-only count: 111,016 US households (ACS 2025).
- Sixteen items could not be verified and are listed, not guessed.
