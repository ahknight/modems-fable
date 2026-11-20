# 01 — Origins and the first home modems (300 bps): fact sheet

Research date: 2026-11-20. Every source below was opened and read during this task (web page, PDF text layer, OCR'd scan, or page image). Nothing here is filled in from memory; where I could not find a source, it is listed under "Could not verify".

**How to read this file**

- **Confidence tags.** HIGH = primary or authoritative source read directly (court/FCC text, AT&T or Bell Labs publication, the inventor's own words, a contemporaneous magazine or ad, a patent). MEDIUM = reputable secondary source. LOW = could not fully verify (reason given).
- **Excerpts** are verbatim and 40 words or fewer. Many sources are OCR text of scans; I repaired line-break hyphenation and obvious OCR glyph errors only where I say so. Check the page image before printing any quote large.
- **Page numbers** are given only where I saw them in the source. "approx." means inferred from nearby page markers.
- Section numbers match the topic list in the brief. Disputes are collected in the "Disputed / uncertain" section and cross-referenced as (D1), (D2), and so on.

---

## 1. Pre-history: SAGE, Bell data sets, "Data-Phone", the 103

**1.1 — The modem predates Bell's commercial service: an Air Force lab built one in 1949 for radar data; it was adapted for SAGE in 1953; Bell commercialized it in 1958.**
- Source: Computer History Museum, "Timeline of Computer History — Networking & The Web," entry "Birth of the Modem" (filed under 1949). https://www.computerhistory.org/timeline/networking-the-web/
- Excerpt: "Developed in 1949 for transmitting radar signals by Jack Harrington's group at the Air Force Cambridge Research Center (AFCRC) near Boston... Modems will be adapted to computers in 1953 for the upcoming SAGE system, and commercialized by Bell Telephone in 1958."
- Confidence: MEDIUM (museum timeline, no footnotes).

**1.2 — AT&T's own history says the need for faster-than-telegraph data arose about 1950, and that by the mid-1950s Bell was supplying SAGE with 1600 bps data links.** (D1)
- Source: E. F. O'Neill (ed.), *A History of Engineering and Science in the Bell System: Transmission Technology (1925–1975)*, AT&T Bell Laboratories, 1985, section "3.4 Data Transmission," approx. pp. 739–740. https://archive.org/details/bell-system-science-history (file "7 - Transmission Technology")
- Excerpt: "By the mid-1950s, the Bell System was providing data links at 1600 bits per second for use in the SAGE system, an early-warning complex for the Strategic Air Command."
- Confidence: HIGH (official Bell Labs history).

**1.3 — A second Bell Labs history volume describes the SAGE modem as vestigial-sideband AM at 2000 bps (not FSK, not 110 bps).** (D1)
- Source: S. Millman (ed.), *A History of Engineering and Science in the Bell System: Communications Sciences (1925–1980)*, AT&T Bell Laboratories, 1984, ch. 10 "Digital Communications," approx. pp. 427–429. https://archive.org/details/bell-system-science-history (file "5 - Communications Sciences")
- Excerpt: "The SAGE modem used vestigial-sideband (VSB) AM to transmit data at 2000 bits per second."
- Confidence: HIGH (official Bell Labs history; note it disagrees with 1.2 on the speed).

**1.4 — "Dataphone" service was first offered on a limited trial basis in February 1958, in three Bell areas (Illinois Bell, Michigan Bell, New York Telephone).** (D3)
- Source: "Dataphone Service in Three Bell System Areas," *Bell Laboratories Record*, April 1958, pp. 147–148 (unsigned news item). https://www.worldradiohistory.com/Archive-Bell-Laboratories-Record/50s/Bell-Laboratories-Record-1958-04.pdf
- Excerpt: "During February, the new service—called \"Dataphone\"—was offered on a limited basis in three Bell System areas: Illinois Bell, Michigan Bell and the New York Company."
- Confidence: HIGH (contemporaneous Bell Labs house journal; OCR punctuation repaired).

**1.5 — The 1958 Dataphone service was pitched at "about 800 words a minute," billed like an ordinary call, and used two kinds of "subsets": a Digital Subset (data to audible tones) and a Recorded Carrier Subset (tape store-and-forward at 8x speed). Subsets were made by Western Electric.** (D1)
- Source: same item, *Bell Laboratories Record*, April 1958, pp. 147–148.
- Excerpt: "The Digital Subset converts electrical pulses of data received from originating equipment (computers or tabulators, for example) to audible tones for immediate transmission over telephone lines."
- Confidence: HIGH.

**1.6 — Bell's official history describes the 1958 limited offering as a data set sending 1000 bps by FSK.** (D1)
- Source: O'Neill (ed.), *Transmission Technology (1925–1975)*, 1985, approx. p. 740. https://archive.org/details/bell-system-science-history
- Excerpt: "In 1958, a commercial service based on these concepts, using a data set transmitting at 1000 bits per second by means of frequency-shift keying (FSK), was offered on a limited basis"
- Confidence: HIGH.

**1.7 — By 1960 Bell Labs was spelling the brand "Data-Phone" and describing it as integrated into ordinary voice-band channels.** (D3)
- Source: J. M. Wier, "Telephone Circuits: A New Link in Data Communications," *Bell Laboratories Record*, October 1960, pp. 368–372. https://www.worldradiohistory.com/Archive-Bell-Laboratories-Record/60s/Bell-Laboratories-Record-1960-10.pdf
- Excerpt: "By properly utilizing the various properties of the telephone network, the Data-Phone service has been integrated into voice-band communication channels."
- Confidence: HIGH.

**1.8 — In 1960 Bell called an insurance group's 33-site installation the nation's largest Data-Phone network.**
- Source: "Nation's Largest Data-Phone Network Installed," *Bell Laboratories Record*, December 1960, p. 473 (news item). https://www.worldradiohistory.com/Archive-Bell-Laboratories-Record/60s/Bell-Laboratories-Record-1960-12.pdf
- Excerpt: "Utilizing the Data-Phone, which permits business machines to \"talk\" to each other, the nation's largest mutual property-casualty insurance group is linking its headquarters in Stevens Point, Wisconsin, with 32 branch offices"
- Confidence: HIGH.

**1.9 — A Bell System sales brochure printed October 1962 sold "DATA-PHONE data sets" for the dial network, listing serial sets from 75 to 2000 bps.**
- Source: Bell Telephone System, "DATA-phone Service" brochure, imprint "Printed in U.S.A. 10/62". https://archive.org/details/TNM_DATA-phone_Service_business_data_over_phone_l_20171103_0046
- Excerpt: "With DATA-PHONE data sets at separate locations, you simply dial into the Bell System's nationwide network and call the set you want."
- Confidence: HIGH (primary; read from OCR text, not the page image).

**1.10 — Bell Labs' own history dates the 103 only to "the early 1960s," naming the 103, 202 and 201 as its first commercial modems at 300, 1200 and 2400 bps, with the 103 using full-duplex FM (that is, FSK).** (D2)
- Source: Millman (ed.), *Communications Sciences (1925–1980)*, 1984, approx. pp. 427–429. https://archive.org/details/bell-system-science-history
- Excerpt: "The first commercial modems developed at Bell Laboratories in the early 1960s were the 103, 202, and 201 modems transmitting respectively at 300, 1200, and 2400 bits per second using full-duplex FM, FM, and phase-shift keyed (PSK) methods"
- Confidence: HIGH.

**1.11 — The specific year 1962 for the Bell 103 rests on secondary sources.** (D2)
- Source: Benj Edwards, "Modems: 60 Years of Hooking Up," *PCWorld*, Jan 31, 2011. https://www.pcworld.com/article/494459/modems_through_the_years.html
- Excerpt: "In 1962, AT&T introduced the Bell 103 Data Phone (seen here), which set the standard for 300-baud (approximately 300-bps) full-duplex modems."
- Confidence: MEDIUM (reputable journalist, no citation; I found no primary document dated 1962 for the 103).

**1.12 — AT&T's 1967 interface specification for the 103A: up to 300 baud in either or both directions at once in DATA-PHONE service; a second variant (103A1) ran at 150 baud for TWX; the set was a gray plastic cabinet weighing about 18 pounds.**
- Source: American Telephone and Telegraph Company, *Data Set 103A Interface Specification*, Bell System Data Communications Technical Reference, February 1967, pp. 1–4. http://bitsavers.org/communications/westernElectric/modems/103A_Interface_Specification_Feb67.pdf
- Excerpt: "In DATA-PHONE service, the sets permit transmission rates up to 300 bauds (300 bits/second maximum) in either or both directions, simultaneously if desired."
- Confidence: HIGH (AT&T primary document).

**1.13 — How the 103 achieved full duplex: two frequency bands, one per direction; the calling set transmits on the low band (F1) and the called set on the high band (F2). A set sits in originate mode and flips to answer mode when it rings.**
- Source: AT&T, *Data Set 103A Interface Specification*, Feb 1967, section 6.1 "Frequency Assignment."
- Excerpt: "Each set is normally in the originating mode. When a ringing signal indicates the arrival of an incoming call, the set switches to the answering mode and remains in it for the duration of the call."
- Confidence: HIGH.

**1.14 — The numeric tone pairs: originate transmits 1070 Hz (space) / 1270 Hz (mark); answer transmits 2025 Hz (space) / 2225 Hz (mark).**
- Source A: M&R Enterprises advertisement, "The Incredible 'Pennywhistle 103'," *BYTE*, September 1977 (scan leaf n179). https://archive.org/details/byte-magazine-1977-09/page/n179/mode/1up
- Excerpt A: "Transmit Channel Frequencies . . Switch selectable: Low (normal) = 1070 space. 1270 mark; High = 2025 space. 2225 mark."
- Source B: Lee Felsenstein, "Build 'Pennywhistle' — The Hobbyist's Modem," *Popular Electronics*, March 1976, p. 43. https://www.worldradiohistory.com/Archive-Poptronics/70s/1976/Poptronics-1976-03.pdf
- Excerpt B: "The 1070-to-1270-Hz low band is used for transmission from a terminal to a central system, while the 2025-to-2225-Hz high band is for transmission in the opposite direction."
- Source C (cross-check): Hayes Microcomputer Products, *Smartmodem 300 Hardware Reference Manual* (1983), carrier-frequency table and radio appendix ("Commands to transmit 1270 Hz Mark, 1070Hz space"). https://archive.org/details/Hayes_Smartmodem_300_Hardware_Reference_Manual_1983
- Confidence: HIGH for the numbers as used by Bell-103-compatible modems. Note: the AT&T 1967 spec I read names the tones only symbolically (F1M, F1S, F2M, F2S) and does not print the numbers.

**1.15 — By the early 1960s Bell had a full data-set line: 100-series narrow-band sets (teletypewriter rates, all FSK), 200-series voice-band sets (typically 1200 bps), 300-series wideband sets.**
- Source: O'Neill (ed.), *Transmission Technology (1925–1975)*, 1985, approx. pp. 741–742. https://archive.org/details/bell-system-science-history
- Excerpt: "By the early 1960s, an extensive line of data sets had been developed, ranging from narrow band sets (100 series) for transmission at the teletypewriter rate of 150 bits per second through several sets for voice-band data (200 series)"
- Confidence: HIGH.

**1.16 — Names attached to the early Bell work in sources I read (none is credited as "the inventor" of the 101 or 103):** V. N. Vaughan, Jr. of AT&T demonstrated the Dataphone subsets at the 1958 press showing; J. M. Wier wrote the 1960 Bell Labs overview.
- Source: *Bell Laboratories Record*, April 1958, p. 148 (photo caption); October 1960, p. 368 (byline).
- Excerpt: "V. N. Vaughan, Jr., of the A.T.&T. Co. demonstrating Dataphone subset equipment during press showing of the new systems for transmitting data over telephone lines."
- Confidence: HIGH for the facts stated; see "Could not verify" for individual credit on the 103.

---

## 2. Why acoustic couplers existed: tariffs, Hush-A-Phone, Carterfone, Part 68, and who invented the coupler

**2.1 — The AT&T tariff language that made a customer's own modem illegal to attach (tariff FCC No. 132, as quoted by the FCC).**
- Source: FCC, *In the Matter of Use of the Carterfone Device in Message Toll Telephone Service*, 13 F.C.C.2d 420 (1968), FCC 68-661, adopted June 26, 1968, at 421. https://web.archive.org/web/20150120021035/http://www.uiowa.edu/~cyberlaw/FCCOps/1968/13F2-420.html
- Excerpt: "No equipment, apparatus, circuit or device not furnished by the telephone company shall be attached to or connected with the facilities furnished by the telephone company, whether physically, by induction or otherwise."
- Confidence: HIGH (FCC decision text; archived transcription).

**2.2 — Hush-A-Phone: a snap-on cup sold since 1921, with more than 125,000 in use; phone companies told vendors and users it violated the "foreign attachment" tariff and claimed the right to cut off service.** (D4)
- Source: *Hush-A-Phone Corp. v. United States*, 238 F.2d 266 (D.C. Cir. 1956), paras. 2–3. https://law.resource.org/pub/us/case/reporter/F2/238/238.F2d.266.13175.html
- Excerpt: "Since 1921, Hush-A-Phone has manufactured and sold a cup-like device of the same name, which snaps on to a telephone instrument... Over the years, more than 125,000 Hush-A-Phones have gone into use."
- Confidence: HIGH (court opinion).

**2.3 — Hush-A-Phone timeline: complaint to the FCC Dec 22, 1948; hearings January 1950; FCC dismissed the complaint Dec 21, 1955; the D.C. Circuit (Judge Bazelon writing, with Edgerton and Miller) reversed on Nov 8, 1956.** (D4)
- Source: *Hush-A-Phone Corp. v. United States*, 238 F.2d 266, caption and para. 4.
- Excerpt: "Argued Oct. 4, 1956. Decided Nov. 8, 1956." / "On December 22, 1948, petitioners filed a complaint with the Commission against the intervenors"
- Confidence: HIGH.

**2.4 — The Hush-A-Phone holding: the tariff was an unwarranted interference with a subscriber's right to use the phone in ways "privately beneficial without being publicly detrimental."**
- Source: *Hush-A-Phone*, 238 F.2d 266, para. 8.
- Excerpt: "The intervenors' tariffs, under the Commission's decision, are in unwarranted interference with the telephone subscriber's right reasonably to use his telephone in ways which are privately beneficial without being publicly detrimental."
- Confidence: HIGH.

**2.5 — Hush-A-Phone did not open the network: the FCC told AT&T (Feb 6, 1957) to stop banning harmless devices, but AT&T's rewritten tariff still barred interconnecting devices, and that rewritten clause is what Carterfone attacked.**
- Source: FCC, *Carterfone*, 13 F.C.C.2d 420, footnote 2.
- Excerpt: "The modification of the offending tariff provision filed by A.T. & T., and designated paragraph B24 of tariff FCC No. 132, is at issue here."
- Confidence: HIGH.

**2.6 — The Carterfone: invented by Thomas F. Carter (Carter Electronics Corp., Dallas), sold from 1959; about 4,500 made and 3,500 sold by 1966. It linked a two-way radio to a phone by putting the handset in a cradle, using acoustic and inductive coupling.** (D8)
- Source: FCC, *Carterfone*, 13 F.C.C.2d 420, at 420–421 and footnote 3.
- Excerpt: "From 1959 through 1966 approximately 4,500 Carterfones were produced and 3,500 sold to dealers and distributors throughout the United States and in foreign countries."
- Confidence: HIGH.

**2.7 — Carter sued AT&T (a private antitrust action); the court sent the tariff question to the FCC; the Fifth Circuit affirmed Aug 17, 1966; the FCC ordered a hearing Oct 20, 1966.** (D5)
- Source: FCC, *Carterfone*, 13 F.C.C.2d 420, at 421.
- Excerpt: "A private antitrust action was brought by Carter against American Telephone and Telegraph Co. and General Telephone Co. of the Southwest."
- Confidence: HIGH.

**2.8 — The FCC's Carterfone decision (adopted June 26, 1968, written by Commissioner Johnson) held the tariff unreasonable, discriminatory and unlawful since its inception, and struck the ban on customer-provided interconnecting devices.**
- Source: FCC, *Carterfone*, 13 F.C.C.2d 420, at 423.
- Excerpt: "we also conclude that the tariff has been unreasonable, discriminatory, and unlawful in the past, and that the provisions prohibiting the use of customer-provided interconnecting devices should accordingly be striken."
- Confidence: HIGH ("striken" is the spelling in the transcription).

**2.9 — Carterfone left the phone companies free to block harmful devices and to set reasonable technical standards.** (D6)
- Source: FCC, *Carterfone*, 13 F.C.C.2d 420, at 424.
- Excerpt: "We are not holding that the telephone companies may not prevent the use of devices which actually cause harm, or that they may not set up reasonable standards to be met by interconnection devices."
- Confidence: HIGH.

**2.10 — What actually followed Carterfone: the decision took effect Nov 1, 1968; in late October 1968 AT&T filed a tariff requiring a phone-company "protective connecting arrangement" (PCA) between any customer equipment and the line; the FCC let it take effect in late December 1968.** (D6)
- Source: *Litton Systems, Inc. v. American Telephone & Telegraph Co.*, 700 F.2d 785 (2d Cir. 1983), regulatory-history section. https://law.resource.org/pub/us/case/reporter/F2/700/700.F2d.785.81-7598.1323-26.1344.7766.7776.html
- Excerpt: "Thus, in late October of 1968, AT & T filed a tariff requiring the use of a PCA to interconnect terminal equipment."
- Confidence: HIGH (appellate opinion recounting the record).

**2.11 — Bell's own summary of the modem rules: illegal before 1968; 1968–1975 allowed only through a Bell-furnished protective coupler; from 1976 any FCC-registered data set could connect directly.** (D7)
- Source: O'Neill (ed.), *Transmission Technology (1925–1975)*, 1985, approx. pp. 742–743. https://archive.org/details/bell-system-science-history
- Excerpt: "From 1968 to 1975, it was permissible to connect non-Bell modems to the switched telephone network as long as power limitations specified in the tariff were observed and provided a Bell-furnished protective coupler was used"
- Confidence: HIGH for Bell's account; the exact dates are disputed (D7).

**2.12 — What the protective coupler (DAA) cost a hobbyist in 1978: Southern Bell in Georgia charged $5.20 a month plus $11.60 installation, on top of the line.**
- Source: D.C. Hayes Associates, Inc., *80-103A Data Communications Adapter* owner's manual, Fourth Edition, August 1978, section 3.3 "What to order from the phone company." https://www.wa4dsy.com/heatherington/hayes/80103a.pdf
- Excerpt: "In Georgia, Southern Bell charges $5.20 per month and $11.60 installation for the DAA (this in addition to the normal charge for the line)."
- Confidence: HIGH (primary; scan has no text layer, I OCR'd it and checked the page image).

**2.13 — The FCC replaced the coupler requirement with equipment registration (47 CFR Part 68): First Report and Order in Docket 19528, 56 F.C.C.2d 593, adopted November 1975; Second Report and Order 1976; upheld by the Fourth Circuit on March 22, 1977; Supreme Court review denied in October 1977; a Third Report and Order followed in April 1978.** (D7)
- Source A: *Litton Systems v. AT&T*, 700 F.2d 785 (2d Cir. 1983). URL as in 2.10.
- Excerpt A: "It was not until November of 1975, AT & T points out, that the FCC adopted regulations establishing certification standards."
- Source B: *North Carolina Utilities Commission v. FCC*, 552 F.2d 1036 (4th Cir. 1977), caption and Part I. https://law.resource.org/pub/us/case/reporter/F2/552/552.F2d.1036.76-1467.76-1502.76-1443.76-1415.76-1152.html
- Excerpt B: "The proposed FCC program would permit customers to attach any registered terminal equipment to the network without being forced to use the carrier-supplied intermediary devices."
- Confidence: HIGH.

**2.14 — Data modems were in the first wave of registration; telephones, key systems and PBXs came later.** (D7)
- Source A: Administrative Council for Terminal Attachments (ACTA), "ACTA and Part 68: Past, Present, and Future," December 2021, slide "Steps of the CarterPhone Decision." https://part68.org/wp-content/uploads/ACTA-Part-68-Past-Present-and-Future.pdf
- Excerpt A: "1975 – Report and Order in Docket 19528 is released which leads to the interconnection of answering machines, toll restrictors, and data modems."
- Confidence A: MEDIUM (the body that now administers Part 68; a slide deck).
- Source B: Barr Tell, "History of Telecom" (archived 2024). https://web.archive.org/web/2024/https://barrtell.com/info-resources/history-of-telecom/
- Excerpt B: "A court stay was lifted on June 16, 1976 to permit the registration program to go into effect for toll restrictors, answering machines and data modems."
- Confidence B: LOW (a telephone company's unsourced timeline page; the June 16, 1976 and October 17, 1977 dates it gives fit the court record in 2.13 but I could not confirm them in an FCC document).

**2.15 — The practical reason hobbyists used acoustic couplers in 1976, in a contemporaneous source: they avoided the phone company's installation and rental charges for the required direct-connect device, at the cost of more distortion.**
- Source: Lee Felsenstein, "Build 'Pennywhistle' — The Hobbyist's Modem," *Popular Electronics*, March 1976, p. 45. https://www.worldradiohistory.com/Archive-Poptronics/70s/1976/Poptronics-1976-03.pdf
- Excerpt: "Acoustic couplers obviate the need for the user to pay installation and rental charges for the devices the telephone company requires for direct-line hookups."
- Confidence: HIGH (checked against the page image).

**2.16 — Robert H. Weitbrecht (1920–1983), a deaf physicist, designed an acoustic coupler so deaf people could use surplus teletypewriters over ordinary phone lines; he and James C. Marsters made the first long-distance TTY call between deaf people in 1964. The device was marketed as the "Phonetype" by Applied Communications (APCOM), founded with Andrew Saks.** (D8)
- Source: Gallaudet University Archives, finding aid for "The Harry G. Lang Collection on Early TTY History," MSS 201. https://gaarchives.gallaudet.edu/repositories/2/resources/211
- Excerpt: "Weitbrecht was able to design an \"acoustic coupler,\" later known as a modem, and in 1964 Weitbrecht and Marsters made the first successful long-distance telephone call between deaf people using TTYs."
- Confidence: MEDIUM (archival finding aid summarizing Lang's book *A Phone of Our Own*, which I did not read).

**2.17 — Weitbrecht worked at Stanford Research Institute (SRI) while he did this; SRI filed his patent in August 1966.**
- Source A: SRI International, *A Heritage of Innovation*, ch. 3 "Advances in Communications," pp. 3-14 to 3-18 (author not named in the chapter PDF). https://www.sri.com/wp-content/uploads/2022/08/A-heritage-of-innovation-Advances-in-Communications.pdf
- Excerpt A: "Weitbrecht, the deaf engineer mentioned in this section, was probably the first person to conceive of an acoustic modem, and SRI filed his patent in August 1966."
- Source B: U.S. Patent 3,507,997, "Frequency-shift teletypewriter," Robert H. Weitbrecht, filed Aug 22, 1966, issued Apr 21, 1970. https://patents.google.com/patent/US3507997
- Excerpt B: "Each of the telephone couplers TC1 and TC2 includes a miniature loudspeaker LS1 and LS2 for feeding sounds into the corresponding microphone MK1 and MK2 and also includes a pick-up coil PW1 and PW2 inductively coupled to the corresponding earphone"
- Confidence: HIGH for the patent dates and the SRI statement. (In excerpt B I corrected OCR "TCI/LSZ/PWZ/EPI" to "TC1/LS2/PW2"; verify against the patent PDF.) Note the patented coupler is acoustic on transmit and inductive on receive.

**2.18 — With a Weitbrecht modem and a free surplus teletype, a deaf person could get connected for about $300.**
- Source: SRI International, *A Heritage of Innovation*, ch. 3, p. 3-15. URL as in 2.17.
- Excerpt: "Using Weitbrecht's modem along with the widely available free teletypes, a deaf person could be in communication for about $300."
- Confidence: MEDIUM (institutional history, no footnote for the figure).

**2.19 — John Van Geen of SRI independently designed an acoustically coupled modem for the Bell 103 / 300-baud computer-terminal world; SRI filed his patent about six months after Weitbrecht's (so early 1967). SRI says the design gave error-free connections over very long distances.** (D8)
- Source: SRI International, *A Heritage of Innovation*, ch. 3, box "SRI's Role in the Development of Acoustic Modems," p. 3-18. URL as in 2.17.
- Excerpt: "Only 6 months later, with almost no interaction with Weitbrecht, SRI's John Van Geen also filed a patent for a Teletype Communication System. Both patents were first issued in 1970."
- Confidence: HIGH for SRI's own account (I did not open Van Geen's patent).

**2.20 — Why Van Geen's coupler mattered, per SRI: earlier modems lived inside a permanently wired terminal, and only the phone company could connect anything to the line; an acoustic coupler let you use any phone.**
- Source: SRI International, *A Heritage of Innovation*, ch. 3, p. 3-18.
- Excerpt: "More important, at that time it was illegal for anyone but the telephone companies to directly connect anything to their lines."
- Confidence: HIGH (institutional history).

**2.21 — Anderson-Jacobson was formed in January 1967 by J. Reid Anderson (ex-Bell Labs, ex-SRI) and accountant Ray Jacobson to build acoustically coupled modems to Van Geen's design; Van Geen got stock, and he and SRI got 1% and 3% royalties.**
- Source: SRI International, *A Heritage of Innovation*, ch. 3, p. 3-18.
- Excerpt: "Anderson, with an accountant named Ray Jacobson, formed Anderson-Jacobson in January 1967. The new company's mission, approved by SRI, was to build acoustically coupled modems following Van Geen's design."
- Confidence: HIGH (institutional history).

**2.22 — Livermore Data Systems was building acoustic couplers by about 1965: the Computer History Museum holds a Model B, serial number 377, dated "Circa 1965."** (D8)
- Source: Computer History Museum catalog, "Livermore Data Systems Model B Acoustic Coupler," catalogue number 102630200. https://www.computerhistory.org/collections/catalog/102630200
- Excerpt: "Date Circa 1965 (Made)... 377 (SERIAL NUMBER) B (MODEL NUMBER)... Organization Livermore Data Systems (Manufacturer) Category Modem"
- Confidence: HIGH that the record says this; the date itself is the museum's "circa." A hobbyist teardown of a later unit found transistor date codes from week 37 of 1969 (Hackaday, "Teardown Of A 50 Year Old Modem," Mar 29, 2019, https://hackaday.com/2019/03/29/teardown-of-a-50-year-old-modem/ — MEDIUM/LOW, enthusiast source).

---

## 3. The Pennywhistle 103

**3.1 — Lee Felsenstein designed the modem in 1973 for Resource One / Community Memory, and the first prototype was used in its public terminal installations.**
- Source: "Oral History of Lee Felsenstein," interviewed by Kip Crosby, recorded May 7, 2008, Computer History Museum, CHM Reference X4653.2008. http://archive.computerhistory.org/resources/access/text/2012/10/102702231-05-01-acc.pdf
- Excerpt: "My first design for the personal computer area actually was done in 1973, the Pennywhistle 103 modem. And this was done to fill a need that we had at Resource One."
- Confidence: HIGH (inventor's own words).

**3.2 — The modem it replaced: an "Omnitech" (his spelling, hedged) that cost $300 and managed 300 baud only in the best conditions. Community Memory dialed one call per day from the Berkeley record store to the XDS 940 in San Francisco.**
- Source: Kip Crosby, "Convivial Cybernetic Devices... An Interview with Lee Felsenstein (Part 1)," *The Analytical Engine* (Computer History Association of California), vol. 3.1, November 1995, pp. 8–9. https://archive.org/details/bitsavers_chacCHACAnvember1995_7154537
- Excerpt: "We were using an Omnitech modem, or something like that, which was good for 300 baud under the most favorable circumstances. I remember that the modem cost $300"
- Confidence: HIGH (inventor's own words; he hedges the brand name).

**3.3 — The design idea: a phase-locked-loop receiver whose decision threshold is a floating reference, reset every time the line returns to "mark" between characters, so no precision trimming is needed. He dropped the usual requirement that a modem work down to zero baud.**
- Source A: Felsenstein in *The Analytical Engine* 3.1, Nov 1995, p. 9. URL as in 3.2.
- Excerpt A: "I set up a floating reference, such that the \"one\" condition would always re-set the reference, and whatever voltage that \"one\" wanted to be was fine for the circuit"
- Source B: Felsenstein, *Popular Electronics*, March 1976, p. 45. URL as in 2.15.
- Excerpt B: "This circuit takes advantage of the fact that in asynchronous data transmission, the serial data signal returns to the \"mark\" condition between every character sent."
- Confidence: HIGH.

**3.4 — A design goal was to work from an ordinary cassette recorder despite speed and pitch variation; Community Memory meant to run a tape loop at the terminal but never used it that way.**
- Source A: *The Analytical Engine* 3.1, Nov 1995, p. 9.
- Excerpt A: "My goal was to run it off a cassette tape recorder, because that was a popular and inexpensive storage standard of the day"
- Source B: CHM oral history, 2008. URL as in 3.1.
- Excerpt B: "because it was designed essentially to adjust itself, it could run from cassette tape... We never used it that way, but the design was done with that in mind."
- Confidence: HIGH.

**3.5 — Publication: cover story of *Popular Electronics*, March 1976 ("EXCLUSIVE Build the PENNYWHISTLE MODEM"), article "Build 'Pennywhistle' — The Hobbyist's Modem" by Lee Felsenstein, pp. 43–50, subtitled as an under-$100 interface for telephone or cassette tape.**
- Source: *Popular Electronics*, March 1976, cover and p. 43. https://www.worldradiohistory.com/Archive-Poptronics/70s/1976/Poptronics-1976-03.pdf
- Excerpt: "Under-$100 interface for digital data transmission/reception over channels such as telephone or cassette tape."
- Confidence: HIGH (cover and page images checked).

**3.6 — The kit price printed in the article: $97.50 for all parts including cabinet, from M&R Enterprises, Sunnyvale, California.** (D9)
- Source: *Popular Electronics*, March 1976, p. 45, Parts List note.
- Excerpt: "A complete kit of all Pennywhistle modem parts, including cabinet, is available for $97.50 from M&R Enterprises, P.O. Box 1011, Sunnyvale, CA 94088."
- Confidence: HIGH (page image checked).

**3.7 — Capabilities in the article: half or full duplex at the flip of a switch; 300 baud; both RS-232 (EIA) and 20 mA current-loop interfaces; built around a 565 PLL and a 555 timer; acoustic coupling by default, with a diagram for connection through a phone-company DAA.**
- Source: *Popular Electronics*, March 1976, pp. 43–46 (text, Parts List, Fig. 2).
- Excerpt: "Modems can operate in one direction only (half duplex) or in both directions (full duplex). The under-$100 Pennywhistle modem project presented here offers the user both modes with the flip of a switch."
- Confidence: HIGH.

**3.8 — The article documents recording data to tape and playing it back, tracking tape-speed variation.**
- Source: *Popular Electronics*, March 1976, pp. 49–50, "Tape Recorder Connections."
- Excerpt: "To play data back to a local terminal, plug the recorder's speaker output into J3. Then play the tape. The modem will track with any desired speed variations from the tape."
- Confidence: HIGH (OCR "witn" corrected to "with").

**3.9 — By September 1977 M&R Enterprises advertised the "Pennywhistle 103" kit at $129.95 plus $3.50 postage, claiming it was the first professional-quality modem in kit form, usable acoustically or wired directly, and able to record to audio tape.** (D9)
- Source: M&R Enterprises advertisement, *BYTE*, September 1977 (scan leaf n179). https://archive.org/details/byte-magazine-1977-09/page/n179/mode/1up
- Excerpt: "The Pennywhistle 103 Acoustic Coupler is the first professional quality modem available in kit form."
- Confidence: HIGH (price read from the page image; the OCR text drops it).

**3.10 — Commercialization, in Felsenstein's words: the design came "out of storage" when Marty Spergel asked for something to sell; it went on the market in "'76 or '77" and, he says, cut modem prices from $350 to $100.** (D9)
- Source: CHM oral history, 2008. URL as in 3.1.
- Excerpt: "That design was brought out of storage for Marty Spergel when he asked me for something to sell... And it finally went on the market in '76 or '77, and it knocked modem prices down from $350 to $100."
- Confidence: HIGH that he said it; the price-drop claim is his own characterization, not independently verified.

**3.11 — The prototype in service: in January 1974 Community Memory moved its terminal to the Whole Earth Access store and connected a leased Hazeltine 1500 CRT at 300 baud through the Pennywhistle prototype.**
- Source: *The Analytical Engine* 3.1, Nov 1995, p. 9.
- Excerpt: "We connected it to the Pennywhistle prototype, which I don't think was called that yet, it was just \"the modem.\""
- Confidence: HIGH.

---

## 4. Hayes, the Smartmodem, the AT command set; Novation CAT

**4.1 — Dennis C. Hayes and Dale Heatherington met as employees of National Data Corporation in Atlanta, building communications interfaces.**
- Source: Al Tommervik, "Exec Hayes Microcomputer Products," *Softalk*, September 1981, approx. pp. 16–20. https://archive.org/details/softalkv2n01sep1981
- Excerpt: "Hayes subsequently joined National Data Corporation, a mainframe service bureau for large data processing users. It was there that he met Heatherington"
- Confidence: HIGH (contemporaneous profile based on interviews with both).

**4.2 — Heatherington's own account: the two pooled funds to buy an IMSAI 8080 kit and then designed a modem for it.**
- Source: Dale Heatherington, "A Brief Technical History of Dale," posted Dec 23, 2007 (archived Oct 14, 2024). https://web.archive.org/web/20241014013409/https://www.wa4dsy.com/robot/home/about
- Excerpt: "Dale and Dennis pooled their funds and bought an IMSAI 8080 computer kit. After they got it working they designed a modem for it."
- Confidence: HIGH (co-founder's own words).

**4.3 — The first product, the 80-103 (80-103A), was first delivered in April 1977.** (D10)
- Source: Tommervik, *Softalk*, September 1981.
- Excerpt: "What they designed was the 80-103, a communications adaptor for S-100 bus computers. The first models were delivered in April 1977."
- Confidence: HIGH (1981 profile; consistent with BYTE's August 1977 new-product notice in 4.4).

**4.4 — BYTE announced the 80-103A in August 1977: an S-100 board with programmable automatic dial and answer, 110 and 300 bps; $279.95 assembled and tested, $49.95 bare board with manual, $7.50 manual alone.**
- Source: "Do You Have Some Data to Communicate?" (What's New? item), *BYTE*, August 1977. https://archive.org/details/byte-magazine-1977-08
- Excerpt: "fully assembled and tested at a retail price of $279.95, as a bare board (sans electronic components) with manual for $49.95, and as the manual alone for $7.50."
- Confidence: HIGH.

**4.5 — The first sales flyer (reproduced by Heatherington) carries the same prices and pitches the board as a serial interface plus modem plus telco interface in one.**
- Source: DC Hayes Associates, "Waiting for the Mail? 80-103A Data Communications Adapter" flyer, 1977 (board photo shows "© DCHayes 1977"). https://www.wa4dsy.com/heatherington/hayes/flyer-80-103.html
- Excerpt: "PRICES: Assembled 80-103A with 48 hour burn in and 90 day warranty is $279.95 / Bare Board with manual is $49.95"
- Confidence: HIGH (read from the image).

**4.6 — The 80-103A was not acoustic, but it was not a legal plug-in either: it had to connect through a phone-company data access arrangement (a "CBT coupler").**
- Source A: DC Hayes Assoc. advertisement, *BYTE*, December 1977, p. 181. https://archive.org/details/byte-magazine-1977-12
- Excerpt A: "Designed for use on the dial telephone or TWX networks, or 2-wire dedicated lines, meets all FCC regulations when used with a CBT coupler."
- Source B: D.C. Hayes Associates, *80-103A* manual, 4th ed., Aug 1978, section 3.5 "Direct Connect." https://www.wa4dsy.com/heatherington/hayes/80103a.pdf
- Excerpt B: "NOTE: Use this type of installation only after determining that it is in agreement with local and federal regulations in your area. We cannot be responsible for anyone who misuses this information."
- Confidence: HIGH.

**4.7 — The founding story: boards were assembled on Hayes's dining room table (and in a bedroom); Heatherington tested each on his IMSAI and returned the good ones for shipping.** (D10)
- Source A: Tommervik, *Softalk*, September 1981.
- Excerpt A: "Hayes used a bedroom and the dining room table at home as his assembly line."
- Source B: Heatherington, "A Brief Technical History of Dale," 2007. URL as in 4.2.
- Excerpt B: "A couple of assemblers were hired and fully assembled units were built on Dennis' dinning room table. Dale would drop by after work at National Data and pick up modems to take home and test that night."
- Source C: Matt Kempner, "Modem moguls' paths diverge," *The Atlanta Journal-Constitution*, Nov 23, 2003 (copy hosted by Heatherington). https://www.wa4dsy.com/heatherington/hayes/ajc/23hayes.html
- Excerpt C: "Hayes and a couple of other guys would assemble boards for the modems on the dining room table in his house near Oglethorpe University in north DeKalb County."
- Confidence: HIGH (three independent tellings, two from the principals' era or own hand).

**4.8 — Seed money: Heatherington put in about $5,000; a 1999 newspaper column says the company was founded with a $5,000 investment in January 1978. They advertised in BYTE and shipped in what looked like pizza boxes.** (D10)
- Source A: Kempner, *Atlanta Journal-Constitution*, Nov 23, 2003. URL as in 4.7.
- Excerpt A: "Heatherington sank all the money he had -- about $5,000 -- into the venture. They placed ads in Byte magazine, and the orders flowed."
- Source B: Victoria Shannon, "The Rise and Fall of the Modem King," *International Herald Tribune* / *New York Times*, Jan 7, 1999. https://www.nytimes.com/1999/01/07/news/the-rise-and-fall-of-the-modem-king.html (NYT blocked my fetch; I read the full text as reproduced at http://timeline.textfiles.com/1977/ and matched two sentences against the NYT search listing.)
- Excerpt B: "HAYES MICROCOMPUTER Products Inc. was founded with a $5,000 investment in January 1978"
- Confidence: MEDIUM (journalism decades later; A draws on interviews with both founders).

**4.9 — Company name: "D C Hayes" / "DC Hayes Associates" in 1977 ads; "D.C. Hayes Associates, Inc." on the 1978 manual and through at least May 1980; "Hayes Microcomputer Products, Inc." by 1981.**
- Source A: *80-103A* manual, 4th ed., Aug 1978, title page. URL as in 4.6.
- Excerpt A: "COPYRIGHT © 1977, 1978 D.C. Hayes Associates, Inc. ALL RIGHTS RESERVED FOURTH EDITION AUGUST 1978"
- Source B: Tommervik, *Softalk*, September 1981.
- Excerpt B: "Hayes and Heatherington founded a firm originally known as D. C. Hayes Associates. Sirkis talked his way into the firm shortly after its founding."
- Confidence: HIGH for the names as printed; the exact date of the rename was not found.

**4.10 — Micromodem II (Apple II): the company chose the Apple over the TRS-80 and PET; it sent photos and fact sheets to selected dealers in September 1978, got its first thirty orders, and a call from Steve Jobs.** (D11)
- Source: Tommervik, *Softalk*, September 1981.
- Excerpt: "In September 1978, the company sent out photos and fact sheets on the Micromodem to selected dealers. They received their first thirty orders and a call from Apple founder Steve Jobs"
- Confidence: HIGH that Softalk reported it in 1981; first-ship date not established (D11).

**4.11 — Why the Micromodem came in two pieces: Heatherington put the phone-line interface in a separate "Microcoupler" so that FCC approval of that one box would cover future products.**
- Source: Tommervik, *Softalk*, September 1981.
- Excerpt: "Because it's the microcoupler that physically connects to the telephone system, FCC approval of that device would allow the company to hook other products up to common carrier lines without additional approval."
- Confidence: HIGH (contemporaneous profile).

**4.12 — Hayes's own 1979 description: Micromodem II for the Apple II and Micromodem 100 for S-100 machines, each shipped with the FCC-registered Microcoupler, 110 or 300 baud, Bell 103 compatible, automatic dial and answer.**
- Source: D.C. Hayes Associates advertisement, "We'd like to share a few words with you...," *BYTE*, October 1979, approx. p. 187. https://archive.org/details/byte-magazine-1979-10
- Excerpt: "The Micromodem II comes with the FCC registered Microcoupler, operates at 110 or 300 baud (Bell 103 compatible), and can automatically dial or answer the phone and transfer data."
- Confidence: HIGH (primary ad; OCR spacing repaired).

**4.13 — Micromodem II street listing in September 1979: "NEW," $379.** (D11)
- Source: dealer advertisement listing "NEW D. C. Hayes MICROMODEM II," *BYTE*, September 1979. https://archive.org/details/byte-magazine-1979-09
- Excerpt: "Plugs directly into Apple slot and modular telephone jack... Auto dial/receiver • FCC approved Only $379"
- Confidence: HIGH that the ad says so (dealer ad; excerpt cleaned of OCR noise and not checked against the image).

**4.14 — The Micromodem 100 replaced the 80-103 for S-100 machines; the Smartmodem was announced in spring 1981 as the first "Hayes Stack" product.** (D12)
- Source: Tommervik, *Softalk*, September 1981.
- Excerpt: "Hayes has replaced the 80-103 with the Micromodem 100 for computers with the S-100 bus structure, and this spring it announced the Smartmodem, a modem using the RS-232 interface."
- Confidence: HIGH.

**4.15 — The Smartmodem as launched (ad running by May 1981): 300 baud originate/answer, any RS-232C computer or terminal, Touch-Tone and pulse dialing, auto-answer/dial/repeat, "over 30 different commands," internal speaker, seven LEDs, FCC registered for direct connection, suggested retail $279.**
- Source: Hayes Microcomputer Products advertisement, *BYTE*, May 1981, approx. p. 95. https://archive.org/details/byte-magazine-1981-05
- Excerpt: "A full two-year limited warranty. A suggested retail price of only $279."
- Confidence: HIGH (primary ad, OCR text).

**4.16 — Inside the Smartmodem 300: a Z8 microprocessor with a 2K-byte control program; Bell 103 compatible; FCC registered for direct connection through modular jacks.**
- Source: Hayes Microcomputer Products, *Smartmodem 300 Hardware Reference Manual* (1983 edition), specifications. https://archive.org/details/Hayes_Smartmodem_300_Hardware_Reference_Manual_1983
- Excerpt: "Z8 microprocessor with 2K byte control program."
- Confidence: HIGH (the OCR renders "103" as "183" in the adjacent compatibility line; check the page).

**4.17 — The AT prefix: every command line begins with "AT," the attention code, and the modem measures the caller's speed from the "A" and its word length and parity from the "T."**
- Source: *Smartmodem 300 Hardware Reference Manual* (1983).
- Excerpt: "All command lines must begin with AT which is the attention code. The terminal's baud rate is determined from the A and the word length and parity are determined from the T."
- Confidence: HIGH (this is the 1983 manual, not the 1981 first edition).

**4.18 — The escape code: a guard time (default 1 second) around an escape character (default "+") entered three times, giving "+++". Both are changeable through S-registers.**
- Source: *Smartmodem 300 Hardware Reference Manual* (1983), "Escape Code."
- Excerpt: "The default guard time is 1 second and the default escape character is \"+.\" The escape character must be entered three consecutive times."
- Confidence: HIGH.

**4.19 — The "Heatherington '302" patent: U.S. 4,549,302, "Modem with improved escape sequence mechanism to prevent escape in response to random occurrence of escape character in transmitted data"; inventor Dale A. Heatherington; original assignee Hayes Microcomputer Products, Inc.; filed Oct 11, 1983; priority date June 15, 1981; granted Oct 22, 1985.**
- Source: U.S. Patent 4,549,302 (Google Patents record and full text). https://patents.google.com/patent/US4549302A/en
- Excerpt: "the preferred embodiment of the present invention must experience one full second of no data being provided as input to data port 50, followed by the predetermined escape command, followed by a second full second of no data"
- Confidence: HIGH. Note: I did not find the literal string "+++" in the patent text; the patent claims the timing ("if and only if said escape character is preceded by... and followed by" a silent period), and names a Zilog Z-8 as the preferred processor.

**4.20 — Enforcement: after the patent issued in 1985 Hayes wrote to roughly 170 modem makers asking them to license it; years of suits followed, including a February 1991 jury award of $3.5 million against Everex, Ven-Tel and OmniTel.**
- Source: "Hayes Corporation History," FundingUniverse (reprint of a business-reference company history). https://www.fundinguniverse.com/company-histories/hayes-corporation-history/
- Excerpt: "sent letters to approximately 170 modem makers allegedly using the technology, asking that they license it."
- Confidence: MEDIUM (secondary; the same page contains at least one error, see D10).

**4.21 — Heatherington says he designed every early Hayes modem (80-103A, Micromodem 100, Micromodem II, Smartmodem 300 and 1200), spent seven years at Hayes, and decided to leave in 1984; the AJC says he retired at 36 with a payout approaching $20 million over ten years.**
- Source A: Heatherington, "A Brief Technical History of Dale," 2007. URL as in 4.2.
- Excerpt A: "Dale spent 7 years with Hayes. He designed the 80-103A, Micromodem-100, Micromodem-II for the Apple ][ and the Smartmodem 300 and 1200."
- Source B: Kempner, *Atlanta Journal-Constitution*, Nov 23, 2003. URL as in 4.7.
- Excerpt B: "Heatherington walked away with a deal that would pay him something approaching $20 million over 10 years."
- Confidence: HIGH (A), MEDIUM (B).

**4.22 — Novation CAT: an acoustically coupled, 0–300 baud, Bell 103, answer/originate modem aimed at small-computer users, new in 1979. Dealer prices in BYTE: $199 and $198 (June 1979); list $199.95, sale $179 (April 1980); list $189.95, sale $179 (May 1980).**
- Source A: Hamilton/Avnet advertisement, *BYTE*, September 1979, approx. p. 85. https://archive.org/details/byte-magazine-1979-09
- Excerpt A: "Cat is Novation's new acoustically coupled modem designed especially for the small computer user."
- Source B: dealer advertisements, *BYTE*, June 1979. https://archive.org/details/byte-magazine-1979-06
- Excerpt B: "ACOUSTIC MODEM NOVATION CAT 0-300 Baud Bell 103 Answer, Originate $198.00"
- Source C: dealer advertisements, *BYTE*, April 1980 ("Novation CAT Modem $199.95 $179.00") and May 1980 ("Novation CAT Modem ($189.95) $179"). https://archive.org/details/byte-magazine-1980-04 and https://archive.org/details/byte-magazine-1980-05
- Confidence: HIGH that these ads say so (OCR text of dealer ads; not checked against images). I did not find Novation's own launch announcement or an official list price at introduction.

**4.23 — How Hayes sold against the acoustic coupler in 1979 and 1981.**
- Source A: D.C. Hayes Associates advertisement, *BYTE*, October 1979. URL as in 4.12.
- Excerpt A: "A modem that works through the standard telephone handset, transmitting data through the regular earphone and microphone. It can be affected by room noise and suffers from the distortion inherent in the carbon microphone."
- Source B: Hayes advertisement, *BYTE*, May 1981. URL as in 4.15.
- Excerpt B: "Smartmodem is FCC registered for direct connection to any modular phone jack—there's no acoustic coupler to cause signal loss and distortion."
- Confidence: HIGH.

---

## 5. Ward Christensen, Randy Suess and CBBS (brief)

**5.1 — CBBS was conceived on January 16, 1978 and on the air about 30 days later (February 16, 1978), built by Ward Christensen (software) and Randy Suess (hardware) for their Chicago club, CACHE.**
- Source: Ward Christensen and Randy Suess, "Hobbyist Computerized Bulletin Board," *BYTE*, November 1978, p. 150. https://archive.org/details/byte-magazine-1978-11
- Excerpt: "It was conceived, designed, built, programmed, tested, and installed in a 30 day period (January 16 1978 to February 16 1978) by the two of us."
- Confidence: HIGH (the builders' own article).

**5.2 — It ran on an S-100 system with Suess's D C Hayes modem board, on a new phone line in Suess's basement; they told Dennis Hayes about it and he called in.**
- Source: Christensen and Suess, *BYTE*, November 1978, pp. 150–151.
- Excerpt: "Randy donated his D C Hayes modem board, PolyMorphics VTI, SwTPC keyboard, power supply, chassis, IMSAI 8080 processor card and Vector memory board."
- Confidence: HIGH.

---

## Disputed / uncertain

**D1 — Was the SAGE modem / "Bell 101" a 110 bps device from 1958–59?**
- Popular version: AT&T's late-1950s "digital subset" for SAGE ran at 110 bps (PCWorld 2011: "It communicated at 110 bits per second."). Wikipedia and its mirrors add that this was sold commercially as the Bell 101 in 1958 or 1959 (seen in search results only; not used as a source).
- AT&T's own histories say otherwise: SAGE data links were 1600 bps (Transmission Technology volume, claim 1.2) or 2000 bps vestigial-sideband AM (Communications Sciences volume, claim 1.3), and the 1958 commercial offering was a 1000 bps FSK data set (claim 1.6). The April 1958 Bell Labs Record describes "about 800 words a minute" (claim 1.5).
- The two Bell volumes also disagree with each other (1600 vs 2000 bps).
- I found no primary document for a "Bell 101" at 110 bps in 1958–59. The Bell Laboratories Record index for 1962 lists "TWX Goes Dial" (E. J. Tyberghein, pp. 232–36), the likely primary source for the 101 data set, but the issue itself is not online where I looked. Treat "SAGE modem = Bell 101 = 110 bps, 1958" as unverified lore.

**D2 — Year of the Bell 103.**
- 1962: PCWorld (claim 1.11) and most popular accounts.
- "Early 1960s": Bell Labs' own history (claim 1.10).
- 1963: a Wikipedia mirror's "Bell 103 modem" article (search result only).
- Earliest AT&T documents I found for the 103 family: *Data Set 103F Interface Specification*, May 1964 (http://bitsavers.org/communications/westernElectric/modems/103F_Interface_Specification_May64.pdf, opened and searched); the 103A specification I read is dated February 1967.

**D3 — When did "Data-Phone" become the name?**
- A widely copied claim (Wikipedia mirrors, search results only) says the name was introduced in summer 1960 to replace "digital subset."
- Bell Labs Record shows the service already named "Dataphone" in February–April 1958 (claim 1.4), with "Digital Subset" as the name of one device within it. The hyphenated "Data-Phone" appears in the Record by October 1960 (claim 1.7); AT&T documents from 1962 on use "DATA-PHONE."

**D4 — Hush-A-Phone details.**
- On sale since 1921 (court opinion, claim 2.2) vs "Available since 1929" (History of Computer Communications site, section 3.2: https://historyofcomputercommunications.info/section/3.2/Carterfone,-ATT-and-the-FCC-1948-1967/).
- Court decision Nov 8, 1956 (opinion caption) vs "On December 21, 1955, the Court ruled in favor of HAPC" (same site). December 21, 1955 is the date of the FCC order the court reversed.
- That site also calls the 1948 filing an "antitrust suit"; the opinion describes a complaint to the FCC under section 208.

**D5 — Who sued whom in Carterfone, and when.**
- FCC text: Carter brought a private antitrust action against AT&T and General Telephone; Fifth Circuit affirmed the referral on Aug 17, 1966 (claim 2.7). The History of Computer Communications site gives the filing date as Nov 29, 1965.
- CHM timeline: "Telephone companies sue in 1966." ACTA slide: "1966 – AT&T is sued." ACTA also says "1968 – Court orders AT&T to establish tariffs"; it was the FCC, not a court.

**D6 — Did Carterfone legalize plugging a modem into the line?**
- Often stated that way (SRI's 2021 article; Hackaday). The decision struck the blanket ban but AT&T's replacement tariff required a phone-company protective coupler for electrical connection (claims 2.9–2.11). Acoustic couplers needed no coupler, which is why they stayed common until registration.

**D7 — When could a registered modem legally connect directly?**
- November 1975: FCC adopts the registration rules (Litton, claim 2.13).
- "Starting in 1976": Bell's history (claim 2.11).
- June 16, 1976 for data modems, after a court stay was lifted; October 17, 1977 for the full program: Barr Tell timeline (claim 2.14, LOW).
- 1977: ACTA ("Part 68 Registration Program of telephones and other interconnected devices begins"); SRI history ("Modems, directly connectable after 1977").
- October 1977: Litton ("as of October 1977, after certiorari was denied by the Supreme Court, interconnection of non-AT & T equipment employing protective circuitry became a possibility," said of PBX and key systems).
- 1978: Hackaday ("it wasn't until 1978 that the tariffs, specifications, and certifications were worked out").
- I did not read the FCC's First Report and Order itself, so the exact adoption, release and effective dates for data equipment remain unconfirmed.

**D8 — Who invented the acoustic coupler, and when.**
- Weitbrecht, 1964: Gallaudet finding aid (Marsters approached him in 1963; first call 1964); Bancroft Library finding aid ("In 1964, he developed the acoustic coupler," https://oac.cdlib.org/findaid/ark:/13030/hb1z09p13q/); SRI history (Marsters "shipped a teletype to Weitbrecht" in 1964; Weitbrecht "probably the first person to conceive of an acoustic modem"). Note 1963 vs 1964 for the approach.
- But acoustic/inductive handset coupling was already in commercial use: the Carterfone, sold from 1959, coupled a radio to a handset "by means of acoustic and inductive coupling" (FCC, claim 2.6). It carried voice, not data.
- Livermore Data Systems had a data coupler by about 1965 (CHM catalog, "Circa 1965," serial 377 on a Model B, claim 2.22). Hackaday dates the product to "1965 or thereabouts"; a "circa 1964" date for a Model A appears in search results (Gizmodo) that I did not open. This overlaps Weitbrecht's work and predates Van Geen's.
- Van Geen, "1966": SRI's 2021 web article says "in 1966, SRI patented two acoustical couplers" (https://www.sri.com/press/story/75-years-of-innovation-acoustic-modem/). SRI's own history says the patents were *filed* August 1966 (Weitbrecht) and about six months later (Van Geen), and *issued* in 1970. The same 2021 article implies SRI developed the coupler after the 1968 Carterfone decision; SRI's history has Anderson-Jacobson formed in January 1967.
- Weitbrecht's start date at SRI: 1957 (Bancroft finding aid) vs 1958 (SRI history).

**D9 — Pennywhistle price and dates.**
- $97.50 kit: *Popular Electronics*, March 1976 (claim 3.6).
- $129.95 kit plus $3.50 postage: M&R ad, *BYTE*, September 1977 (claim 3.9). Wikipedia cites $129.95 kit / $225 assembled (search result only; I did not find the $225 figure in a source I opened).
- "$100" and market date "'76 or '77": Felsenstein's 2008 recollection (claim 3.10). In 1995 he said the commercial kit appeared in 1976.
- The competing modem cost "$300" (1995 interview) or prices fell from "$350" (2008 oral history).

**D10 — Hayes founding details.**
- Table: every source I opened that describes the scene says *dining room* table (Softalk 1981, Heatherington 2007, AJC 2003, IHT 1999). "Kitchen table" appears only in a rival's jibe quoted by FundingUniverse (Multi-Tech's Raghu Sharma: "fiddling around with 300-baud modem chips at his kitchen table") and in a Wikipedia quotation (search result only).
- Place: Hayes's house in north DeKalb County, Georgia (AJC) vs "Hayes's dining room table in Spartanburg, South Carolina" (FundingUniverse). Hayes's 1977 ads give an Atlanta P.O. box; the Spartanburg statement looks like an error.
- Date: first deliveries April 1977 (Softalk; FundingUniverse); BYTE notice August 1977; "founded with a $5,000 investment in January 1978" (IHT). Probably product first, incorporation later, but I found no incorporation record.
- Product name: "80-103" (Softalk) vs "80-103A" (BYTE, flyer, manual, Heatherington).
- FundingUniverse also says Hayes "left Georgia Tech after five years to start" the company; Softalk and the IHT have him working at Financial Data Sciences and National Data Corp. in between.

**D11 — Micromodem II date and "firsts."**
- Brief says 1979. Softalk: fact sheets to dealers September 1978. FundingUniverse: "A second product shipped in 1978." BYTE: dealer ads call it "NEW" in September 1979; Hayes's own BYTE ad appears October 1979; the Micromodem 100 appears in the same ad. I found no dated first-shipment record.
- FundingUniverse calls the Micromodem II "the first modem to directly connect into the telephone network." Not supportable as written: Bell's data sets were direct-connect from the start, and Hayes's own 80-103A connected directly through a DAA in 1977. A narrower claim (an FCC-registered direct-connect modem for a personal computer, no phone-company DAA) matches Hayes's 1979 ad copy but I did not verify priority.

**D12 — Smartmodem / AT command set date.**
- "this spring it announced the Smartmodem" (Softalk, Sept 1981); ad in *BYTE* May 1981 (claim 4.15); "they created the Hayes AT command set in June 1981" (FundingUniverse); patent priority date June 15, 1981 (claim 4.19). Consistent with a spring 1981 announcement and mid-1981 availability; first-ship date not found. PCWorld attributes the 1981 Smartmodem to "D.C. Hayes Associates"; the May 1981 ad and Softalk use "Hayes" / "Hayes Microcomputer Products."

---

## Quotes

All verbatim from sources I opened. OCR repairs are noted. Check the page image before using any of these as a pull quote.

1. **Judge David Bazelon, U.S. Court of Appeals, D.C. Circuit**, *Hush-A-Phone Corp. v. United States*, 238 F.2d 266, decided Nov 8, 1956.
   > "To say that a telephone subscriber may produce the result in question by cupping his hand and speaking into it, but may not do so by using a device which leaves his hand free to write or do whatever else he wishes, is neither just nor reasonable."
   https://law.resource.org/pub/us/case/reporter/F2/238/238.F2d.266.13175.html (The opinion gives the author as "BAZELON, Circuit Judge"; the first name is from the History of Computer Communications site, section 3.2.)

2. **Federal Communications Commission (Commissioner Johnson for the Commission)**, *Carterfone*, 13 F.C.C.2d 420, 424, adopted June 26, 1968.
   > "No one entity need provide all interconnection equipment for our telephone system any more than a single source is needed to supply the parts for a space probe."
   https://web.archive.org/web/20150120021035/http://www.uiowa.edu/~cyberlaw/FCCOps/1968/13F2-420.html

3. **AT&T tariff FCC No. 132** (the "foreign attachment" rule), as quoted in *Carterfone*, 13 F.C.C.2d 420, 421 (1968).
   > "No equipment, apparatus, circuit or device not furnished by the telephone company shall be attached to or connected with the facilities furnished by the telephone company, whether physically, by induction or otherwise."
   Same URL as quote 2.

4. **Bell Laboratories Record** (unsigned), "Dataphone Service in Three Bell System Areas," April 1958, p. 147.
   > "Dataphone, which could be one of the most significant business developments of our times, is a high-speed transmission service for sending and receiving data over regular telephone lines"
   https://www.worldradiohistory.com/Archive-Bell-Laboratories-Record/50s/Bell-Laboratories-Record-1958-04.pdf (OCR hyphen spacing repaired.)

5. **J. M. Wier, Bell Laboratories**, "Telephone Circuits: A New Link in Data Communications," *Bell Laboratories Record*, October 1960, p. 372.
   > "Now as well as connecting man to man, these circuits link man to machine, and machine to machine."
   https://www.worldradiohistory.com/Archive-Bell-Laboratories-Record/60s/Bell-Laboratories-Record-1960-10.pdf (OCR has a period after the first "man"; I read it as a comma. Check the image.)

6. **Lee Felsenstein**, on why networks were out of reach around 1970–71, "Resource One / Community Memory – 1972 – 1973," his own website (archived Mar 26, 2016).
   > "the PYRAMID project had a 9600 baud modem that was the size of a child's coffin – property of the phone company and available only at a monthly fee that was prohibitive for any entity but a corporation with high cash flow."
   https://web.archive.org/web/20160326050158/http://www.leefelsenstein.com/?page_id=44

7. **Lee Felsenstein**, CHM oral history, interviewed by Kip Crosby, May 7, 2008.
   > "It was designed not only to be buildable as a kit, which was something you weren't supposed to be able to do with modems because of all the critical adjustments."
   and
   > "And it finally went on the market in '76 or '77, and it knocked modem prices down from $350 to $100."
   http://archive.computerhistory.org/resources/access/text/2012/10/102702231-05-01-acc.pdf

8. **Lee Felsenstein**, on being encouraged to build a modem, interview with Kip Crosby, *The Analytical Engine* 3.1, November 1995, p. 8.
   > "These were MIT guys, who gave me that word \"essentially,\" which really meant \"and someone else will do all the hard work,\" like the MPD engineers. But I didn't know that; I just went ahead, tried it out, and hit upon something."
   https://archive.org/details/bitsavers_chacCHACAnvember1995_7154537 (Line-break hyphen in "engineers" repaired.)

9. **DC Hayes Associates**, first sales flyer for the 80-103A, 1977.
   > "WAITING FOR THE MAIL?" ... "WHILE OTHERS ARE WAITING FOR THE MAILMAN TO DELIVER, YOUR SYSTEM IS WAY AHEAD."
   https://www.wa4dsy.com/heatherington/hayes/flyer-80-103.html (Headline and last sentence of the opening paragraph; read from the image.)

10. **D.C. Hayes Associates, Inc.**, advertisement defining "acoustic coupler," *BYTE*, October 1979.
    > "A modem that works through the standard telephone handset, transmitting data through the regular earphone and microphone. It can be affected by room noise and suffers from the distortion inherent in the carbon microphone."
    https://archive.org/details/byte-magazine-1979-10

11. **Dennis C. Hayes**, on hiring Glenn Sirkis, quoted in Al Tommervik, "Exec Hayes Microcomputer Products," *Softalk*, September 1981.
    > "The first task we assigned him was to figure out how to pay himself ... his first official action was to cut my pay."
    and, on growth:
    > "Growth as fast as Apple grew is a little scary."
    https://archive.org/details/softalkv2n01sep1981 (OCR reads "fig^e" for "figure".)

12. **Dale Heatherington**, quoted in Matt Kempner, "Modem moguls' paths diverge," *The Atlanta Journal-Constitution*, Nov 23, 2003.
    > "Competition was heating up. Technology was moving faster. I just wanted out of the rat race," Heatherington says. "Apparently Dennis enjoyed the rat race, so he stayed."
    https://www.wa4dsy.com/heatherington/hayes/ajc/23hayes.html

13. **Ward Christensen**, "Hobbyist Computerized Bulletin Board," *BYTE*, November 1978, pp. 150–151, on announcing CBBS at the February 1978 CACHE meeting.
    > "A poll was taken to see how many people could call. We expected perhaps five or ten, but 25 hands were raised!"
    https://archive.org/details/byte-magazine-1978-11

14. **Hayes Microcomputer Products**, Smartmodem launch advertisement, *BYTE*, May 1981.
    > "Smartmodem is FCC registered for direct connection to any modular phone jack—there's no acoustic coupler to cause signal loss and distortion."
    https://archive.org/details/byte-magazine-1981-05 (OCR line-break hyphens repaired.)

15. (Secondary, use with care) **Raghu Sharma, president of Multi-Tech Systems**, on the Heatherington patent, as quoted without date or original citation in "Hayes Corporation History," FundingUniverse.
    > "We were making Bell 212 modems back in 1978 ... when Dennis Hayes was fiddling around with 300-baud modem chips at his kitchen table."
    https://www.fundinguniverse.com/company-histories/hayes-corporation-history/

---

## Could not verify

- **Bell 101 data set, 1958/59, 110 bps, derived from SAGE.** No primary source found; AT&T's own histories contradict the speed and do not mention a "101" in this period (D1). Lead: "TWX Goes Dial," E. J. Tyberghein, *Bell Laboratories Record*, 1962, pp. 232–36 (seen in the index only).
- **Bell 103 introduced in 1962 specifically.** Only secondary sources; Bell's history says "early 1960s" (D2).
- **Who at Bell Labs designed the 103.** No individual is credited in anything I read. Leads seen only as citations inside the Bell histories, not opened: S. T. Meyers, "An FM Data Set for Voiceband Data Transmission," *Bell Lab. Rec.* 41 (Jan 1963), pp. 2–7 (that is the 202); R. O. Soffel and E. G. Spack, "SAGE Data Terminals," *Trans. AIEE* 77 (Jan 1959), pp. 872–879.
- **The numeric tone frequencies in an AT&T document.** The 1967 103A spec uses symbols only. The numbers above come from 1976–1983 third-party and Hayes documents.
- **The FCC's First Report and Order in Docket 19528 (56 F.C.C.2d 593) itself**, and therefore the exact adoption, release and effective dates for data equipment under Part 68. Not read; dates above come from court opinions, Bell's history, ACTA, and one LOW source (D7).
- **A direct quotation from Thomas Carter.** None found in a source I could open. The FCC decision and the History of Computer Communications site describe him but do not quote him.
- **Bell System advertising copy from a dated magazine ad.** I found only the October 1962 brochure text (claim 1.9). The 1962 *Time* ad seen in search results was not opened.
- **John Van Geen's patent** (number, filing date, title as issued) and the specific receiver improvement. Only SRI's descriptions were read.
- **Livermore Data Systems' founding, first product date, and prices.** Only the CHM catalog record ("Circa 1965") and an enthusiast teardown were read. The "Model A, circa 1964" dating comes from a hobbyist video I did not view.
- **Anderson Jacobson product models and prices.** Not searched beyond SRI's account. (A BYTE June 1979 dealer ad lists surplus "AJ MODEL A30" acoustic couplers at $29.95, which says nothing about the original price.)
- **Lee Felsenstein's dedicated Pennywhistle page on leefelsenstein.com.** The site did not resolve; the Wayback Machine copies I could load (page_id 44, 53, 56) mention the modem only in passing. Wikipedia's "$109" Spergel build cost and "$225 assembled" price were not found in anything I opened.
- **Felsenstein's claim that the Pennywhistle cut modem prices from $350 to $100.** His own statement; no independent price survey found.
- **Pennywhistle sales volume.** Not found.
- **Hayes: incorporation date of D.C. Hayes Associates, Inc., and the date it became Hayes Microcomputer Products.** The names appear in dated documents (claim 4.9) but no filing was found.
- **First-ship dates and launch list prices for the Micromodem 100 and Micromodem II**, beyond the September 1979 "$379" dealer listing. InfoWorld was not searched.
- **Smartmodem first-ship date and the 1981 first-edition manual.** The command-set and escape-code text above is from the 1983 manual.
- **The 1977 80-103A sales figures** ("$125,000 their first year," "20 competitors") appear only in FundingUniverse; not corroborated.
- **Novation CAT launch date and introductory list price from Novation itself.** Only distributor and dealer ads from May 1979 onward were found.
- **CBBS and the Chicago blizzard, and the phone number or call volume.** Not in the 1978 BYTE article pages I read; left to the BBS researcher.
- **Gallaudet museum exhibit page and the New York Times copy of the 1999 Hayes article** both refused my fetches (HTTP 403 / blocked). I used the Gallaudet Archives finding aid and a mirror of the IHT text instead.
- **Unread leads worth a look:** AT&T, *Data Access Arrangement Preliminary Technical Reference*, November 1968, and *Bell Modem Types*, October 1969 (both at http://bitsavers.org/communications/westernElectric/modems/, image-only scans I did not OCR); Harry G. Lang, *A Phone of Our Own* (Gallaudet University Press, 2000); the Springer chapter "The Modem that Still Connects Us" (paywalled, not read).
