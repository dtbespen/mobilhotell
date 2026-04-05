# Mobilhotell – Hardware-oppsett

Et fysisk **mobilhotell** med **én åpen toppflate** – som når du legger telefonen i Tesla-konsollen. Du setter den rett på en myk, sammenhengende overflate (skum + kunstlær), uten skillevegger og uten lommer. Fem navngitte plasser (Mamma, Pappa, Nova, Emil, Anna) er markert på fremsiden med vinyl-klistremerker, én LED + én IR-sensor per plass. OLED på front. ESP32 med WiFi/WebSocket til appen. USB-hub og korte kabler for lading.

**CAD-modell:** `hardware/cad/mobilhotell.kcl`

**Verktøy som trengs:** Sag (kapp/stikksag), bor, skrutrekker, sandpapir, pensel/rull.

---

## Innkjøpsliste – komplett

### Elektronikk

| # | Hva | Antall | Kjøp her | Ca. pris |
|---|-----|--------|----------|----------|
| 1 | ESP32 NodeMCU (CH9102X) | 1 | [elkim.no – ESP32](https://elkim.no/produkt/esp32-ch9102x/) | ~95 kr |
| 2 | IR hindringssensor FC-51 | 5 | [elkim.no – IR-sensor](https://elkim.no/produkt/ir-infrared-obstacle-sensor-infrarod-hindringsdeteksjonsmodul/) | ~150 kr |
| 3 | Grønn LED 5 mm | 5 | [elkim.no – LED](https://elkim.no/produktkategori/komponenter/led-komponenter/) | ~20 kr |
| 4 | Motstand 220 Ω | 5 | [elkim.no – motstander](https://elkim.no/produktkategori/komponenter/led-komponenter/) | ~10 kr |
| 5 | Breadboard 830 hull | 1 | [elkim.no – breadboard](https://elkim.no/produkt/koblingsbrett-breadboard/) | ~49 kr |
| 6 | Jumperkabel 40×10 cm HAN/HUN | 1 pk | [elkim.no – jumper](https://elkim.no/produkt/jumper-kabel-40x10-cm-flere-variasjoner/) | ~59 kr |
| 7 | OLED 0,96" 128×64 I2C | 1 | [elkim.no – OLED](https://elkim.no/produkt/0-96-i2c-iic-serial-12864-oled-lcd-screen-display-module-for-arduino-raspberry-osv/) | ~89 kr |
| 8 | Micro-USB-kabel **med data** | 1 | [Kjell & Company – USB-kabler](https://www.kjell.com/no/produkter/kabler-og-adaptere/usb-kabler/) | ~50 kr |

### Lading

| # | Hva | Antall | Kjøp her | Ca. pris |
|---|-----|--------|----------|----------|
| 9 | USB-hub 5-porters med strømforsyning | 1 | [Kjell & Company – USB-hub](https://www.kjell.com/no/produkter/data-og-tilbehor/usb-og-thunderbolt/usb-huber/) | ~149 kr |
| 10 | Korte USB-kabler 20 cm (A→C / A→Lightning) | 5 | [Kjell – USB-kabler](https://www.kjell.com/no/produkter/kabler-og-adaptere/usb-kabler/) | ~100 kr |

### Kabinett – MDF og tre

| # | Hva | Antall | Kjøp her | Ca. pris |
|---|-----|--------|----------|----------|
| 11 | MDF-plate **6 mm** (minst 600×400 mm) | 1 | [Byggmax – MDF-plater](https://www.byggmax.no/hus-og-bygg/platematerial-og-byggeplater/mdf-plater) | ~89 kr |
| 12 | Trelister **15×15 mm**, 2 m (hjørnelister) | 1 | [Biltema – Firkantstav 15×15×2000 mm](https://www.biltema.no/bygg/beslag/listverk/firkantstav-15-x-15-x-2000-mm-2000065034) | ~29 kr |
| 13 | Trelister **10×10 mm**, 2 m (støttelister) | 1 | [Biltema – Listverk](https://www.biltema.no/bygg/beslag/listverk/) (søk «firkantstav 10») | ~25 kr |
| 14 | Trelim PVA (vanntett) | 1 | [Biltema – trelim](https://www.biltema.no/bygg/lim/trelim/) | ~49 kr |
| 15 | Treskruer 3×15 mm (200 stk) | 1 pk | [Biltema – Treskrue 3×15](https://www.biltema.no/bygg/festeelementer/treskruer/treskrue-3-x-15-200-stk-2000058078) | ~29 kr |

### Telefonflate

| # | Hva | Antall | Kjøp her | Ca. pris |
|---|-----|--------|----------|----------|
| 16 | Polyeterskum **10 mm** (1 cm), 120×100 cm | 1 stk | [Industrisøm – 1 cm Polyeterskum 30P](https://industrisom.no/produkt/1cm-polyeterskum-30kg-120cm-bredde-pr-lengdemeter/) | 149 kr |
| 17 | Kunstlær svart, metervare 140 cm bred | 0,5 m | [Lillestrøm Sysenter – Skai svart](https://www.lillesy.no/produkt/stoffer/mobelstoffer-1/skai-stagger-kunst-laer/svart) (298 kr/m) eller lokal stoff-butikk | ~149 kr |
| 18 | Kontaktlim (for skum til MDF) | 1 | [Biltema – kontaktlim](https://www.biltema.no/bygg/lim/kontaktlim/) | ~69 kr |

### Diffuser og finish

| # | Hva | Antall | Kjøp her | Ca. pris |
|---|-----|--------|----------|----------|
| 19 | Akrylplate **opalhvit** 4 mm (restbit) | 1 | [Biltema – opalhvit akryl](https://www.biltema.no/bygg/platematerialer/pleksiglass/akrylplast-opalhvit-1200-x-800-x-4-mm-2000034953) | ~49 kr |
| 20 | Tresparkel | 1 | [Biltema – Sparkel](https://www.biltema.no/bygg/maling/sparkling/sparkel/) | ~49 kr |
| 21 | Slipepapir sett (180 + 240 grit) | 1 | [Biltema – Slipepapir](https://www.biltema.no/verktoy/sliping/slipepapir/) | ~39 kr |
| 22 | Primer spray hvit | 1 | [Biltema – Primer (spraymaling)](https://www.biltema.no/bygg/maling/spraymaling/primer/) | ~79 kr |
| 23 | Spraymaling hvit matt | 2 | [Biltema – Matt spraymaling](https://www.biltema.no/bygg/maling/spraymaling/matt-spraymaling/) | ~158 kr |
| 24 | Vinyl-klistremerker med navn (5 stk) | 1 sett | [StickerApp – Vinylklistremerker](https://stickerapp.no/materiale/vinylklistremerker) eller [Signlabs](https://signlabs.no/klistremerker) | ~50 kr |

**Prisoverslag totalt:** ~1800–2000 kr

---

## Ytre mål og kassedimensjoner

**Ytre mål (fra CAD):** **424 × 182 × ~106 mm** (B × D × H).

| Mål | Verdi | Beregning |
|-----|-------|-----------|
| Ytre bredde | 424 mm | 408 dekk + 2×2 inset + 2×6 vegg |
| Ytre dybde | 182 mm | 170 dekk + 2×6 vegg |
| Ytre høyde | ~106 mm | stackTop = tiltDeckTopZ + 2mm klaring |
| Front høyde | ~74 mm | frontTopZ = tiltDeckFrontTopZ + 2mm klaring |
| Innvendig bredde | 412 mm | totalWidth − 2×vegg |
| Innvendig dybde | 170 mm | totalDepth − 2×vegg |
| Telefonflate MDF | 408 × 170 mm | 5 soner à 80mm + 4×2mm gap |
| Basehøyde | 38 mm | Plass til hub + kabler |
| Frontpanel | ~74 mm | frontTopZ – i flukt med sidevegger foran |
| Veggtykkelse | 6 mm | MDF |

### iPhone-mål (referanse)

| Modell | Høyde × bredde × dybde (mm) |
|--------|------------------------------|
| iPhone 16 Pro Max | 163,0 × 77,6 × 8,25 |
| iPhone 16 Plus | 160,9 × 77,8 × 7,8 |
| iPhone 16 / 15 | 147,6 × 71,6 × 7,8 |

Kilde: [Apple – sammenlign modeller](https://www.apple.com/iphone/compare/)

**Orientering:** Telefonene ligger **ved siden av hverandre** langs X (smalside mot deg). Langside peker mot bakvegg (+Y). Per plass: 80 mm (78 mm bredeste + 2 mm deksel), pluss 2 mm gap til nabo.

---

## Telefonflate – oppbygning

Målet er en myk, premium overflate uten synlige skjøter. Telefonen «synker» litt ned.

### Lagoppbygning (nedenfra og opp)

```
+------------------------------------------+
|  Kunstlær ~1-2mm (svart)                |  ← topp, bruker berører
+------------------------------------------+
|  Polyeterskum 10mm                       |  ← demping
+------------------------------------------+
|  MDF 6mm                                 |  ← bærestruktur
+------------------------------------------+
     Totalt: 18mm
```

- **MDF 6mm** (rad 11): Bæreplate med 5× IR-hull Ø12 mm.
- **Polyeterskum 10mm** (rad 16): Limes til MDF med kontaktlim (rad 18). Kuttes til 408 × 170 mm. **5× matchende IR-hull Ø12 mm** kuttes over MDF-hullene. Legg en liten bit klar tynn plast (OHP-film) over hvert skumhull for å bevare overflaten.
- **Kunstlær ~1–2mm** (rad 17): Kuttes til 430 × 190 mm (11 mm ekstra på hver side). Limes til skum, folders ned og limes rundt MDF-kantene. Faktisk tykkelse varierer med materiale (typisk 0,8–1,5 mm for møbelkunstlær). IR-strålen passerer gjennom tynt kunstlær ved riktig justert følsomhet.

### Kantavslutning

```
Tverrsnitt (sidevegg + dekk):

    |<-- kunstlær folder ned over kant
    |   +==================+  <-- kunstlær (2mm)
    |   |##################|  <-- skum (10mm)
    |   |##################|
    |   +------------------+  <-- MDF dekk (6mm)
    |          |
    +---[######]  <-- støttelist 10x10mm limt til vegg
    |
    | sidevegg 6mm
```

### Helling (11°)

Telefonflaten har 11° helling (bakre kant opp, fremre kant lav) – som Tesla-konsollen. I CAD: rotasjon rundt global X-akse med pivot på fremkanten av dekket.

---

## Konstruksjon

### Skjøter og forsterkning

Alle vegger er **6 mm MDF** med **butt-joints** (stumskjøter) forsterket med innvendige trelister:

- **Hjørnelister 15×15 mm** (rad 12): Limes i alle fire vertikale hjørner innvendig. Gir stor limflate og selvjustering.
- **Støttelister 10×10 mm** (rad 13): Limes langs sidevegger og bakvegg, 44 mm fra bunn. Dekket hviler på disse.

```
Tverrsnitt hjørne (sett ovenfra):

         vegg A (6mm)
            │
            │
    ┌───────┼───────┐
    │  █████│       │
    │  █████│       │  ← vegg B (6mm)
    │  █████│       │
    └───────┴───────┘
         │
         └── hjørnelist 15x15mm (limt)
```

### Sideveggens profil

Forenklet design med én rett diagonal topp (ingen hakk):

```
       ~106mm
    +--+
    |   \
    |    \   ← rett diagonal (følger dekkets 11° helling)
    |     \
    |      \
    |       + ~74mm
    |       |
    |       |
    +-------+
       182mm (dybde)
```

Kutt: Sag 182 mm bred plate, merk **106 mm** bak og **74 mm** foran, sag diagonalen.

### Frontpanel

**Ett stykke** MDF: **412 × 74 mm** (mellom sidevegger, i flukt med sideveggenes fronthøyde). Dekket sitter nedfelt bak dette panelet – kun telefonflaten er synlig ovenfra. To hull sages ut med stikksag:

1. **OLED-hull** (27×19 mm): Sentrert horisontalt, senter ca. 25 mm fra bunn.
2. **LED-diffuser-hull** (380×6 mm): Sentrert horisontalt, senter ca. 50 mm fra bunn. Akrylplaten limes bak hullet fra innsiden.

**Navn:** Vinyl-klistremerker (rad 24) klistres mellom OLED og LED-hull etter maling.

### Bakvegg

412 × 106 mm (mellom sidevegger). 2× ventilasjonshull Ø12 mm, plassert 40 mm fra hver side, ~21 mm fra bunn.

---

## Kuttliste

### MDF 6 mm

| Del | Antall | Bredde (mm) | Høyde (mm) | Merknader |
|-----|--------|-------------|------------|-----------|
| Bunnplate | 1 | 424 | 182 | — |
| Venstre sidevegg | 1 | 182 | profil | Skrå topp: **106→74 mm** |
| Høyre sidevegg | 1 | 182 | profil | Skrå topp: **106→74 mm** |
| Frontpanel | 1 | 412 | 74 | Mellom sidevegger. Hull: OLED 27×19mm + diffuser 380×6mm |
| Bakvegg | 1 | 412 | 106 | 2× ventilasjonshull Ø12 mm |
| Hylle | 1 | 412 | 170 | 5× kabelhull Ø15 mm |
| Dekk (telefonflate) | 1 | 408 | 170 | 5× IR-hull Ø12 mm |

### Trelister

| Del | Antall | Lengde (mm) | Dimensjon |
|-----|--------|-------------|-----------|
| Hjørnelist front-venstre | 1 | 68 | 15×15 mm |
| Hjørnelist front-høyre | 1 | 68 | 15×15 mm |
| Hjørnelist bak-venstre | 1 | 96 | 15×15 mm |
| Hjørnelist bak-høyre | 1 | 96 | 15×15 mm |
| Støttelist venstre | 1 | 170 | 10×10 mm |
| Støttelist høyre | 1 | 170 | 10×10 mm |
| Støttelist bak | 1 | 408 | 10×10 mm |

### Akryl (opalhvit 4 mm)

| Del | Antall | Mål (mm) |
|-----|--------|----------|
| LED-diffuser | 1 | 380 × 6 |

### Telefonflate

| Del | Antall | Mål (mm) | Materiale |
|-----|--------|----------|-----------|
| Skum | 1 | 408 × 170 | Polyeter 10 mm |
| Kunstlær | 1 | 430 × 190 | Kunstlær 2 mm |

---

## Monteringsanvisning

### Fase 1: Forberedelse

1. Kutt alle MDF-deler ifølge kuttliste.
2. Kutt alle trelister ifølge liste.
3. Sag ut OLED-hull i frontpanel (27×19 mm, sentrert horisontalt, senter 25 mm fra bunn).
4. Sag ut LED-diffuser-hull i frontpanel (380×6 mm, sentrert horisontalt, senter 50 mm fra bunn).
5. Bor ventilasjonshull i bakvegg (2× Ø12 mm, 40 mm fra hver side, ~21 mm fra bunn).
6. Bor kabelhull i hylle (5× Ø15 mm, jevnt fordelt med 82 mm mellomrom, sentrert langs dybden).
7. Bor IR-hull i dekk-MDF (5× Ø12 mm, samme X-posisjon som kabelhullene, plassert i bakre del av hver sone).
8. Slip alle kanter med 180-grit sandpapir.

### Fase 2: Montering av kasse

1. Lim hjørnelister (15×15 mm) til innsiden av sidevegger i alle fire hjørner.
2. La tørre 30 min.
3. Lim bunnplate til sidevegger (butt-joint, hjørnelister gir styrke og justering).
4. Lim frontpanel (412×74 mm) mellom sidevegger, flukt med sideveggenes fronthøyde.
5. Lim bakvegg (412×106 mm) mellom sidevegger.
6. Klem med klemmer eller maskeringstape. La tørre over natten.
7. Lim støttelister (10×10 mm) langs innsiden av sidevegger og bakvegg, overkant 54 mm fra bunn (= deckZStart). Dekket skal hvile på toppen av disse.

### Fase 3: Overflatebehandling

1. Sparkel alle synlige fuger og ujevnheter med tresparkel (rad 20).
2. La tørre 2 timer.
3. Slip med 180-grit.
4. Spray primer (1 strøk, rad 22).
5. La tørre 1 time, slip lett med 240-grit.
6. Spray hvit matt toppstrøk (1. strøk, rad 23).
7. La tørre 1 time.
8. Spray hvit matt toppstrøk (2. strøk).
9. La tørre over natten.

### Fase 4: Elektronikk

1. Monter ESP32 på breadboard.
2. Koble IR-sensorer (se GPIO-tabell under).
3. Koble LED-er med motstander.
4. Koble OLED.
5. **Test alt før du monterer i kassen.**
6. Plasser breadboard og USB-hub i bunnseksjonen.
7. Før kabler gjennom kabelhullene i hyllen.
8. Fest IR-sensorer under hyllen (peker opp gjennom hull).
9. Lim OLED i hull fra innsiden av frontpanelet.
10. Legg hyllen på plass (hviler i kassen).

### Fase 5: LED og diffuser

1. Kutt akrylplate til 380 × 6 mm (bruk finntannet baufil, maskeringstape over kuttet for å unngå sprekker).
2. Monter LED-er bak akryl (~10 mm avstand fra platen).
3. Lim akrylplaten bak LED-diffuser-hullet i frontpanelet fra innsiden.

### Fase 6: Telefonflate

1. Kutt polyeterskum til 408 × 170 mm.
2. Kutt 5× IR-hull Ø12 mm i skummet (plasser skum oppå MDF-dekket og marker hullposisjonene). Legg en liten bit klar tynn plast (OHP-film) over hvert skumhull.
3. Kutt kunstlær til 430 × 190 mm (11 mm ekstra rundt alle kanter).
4. Lim skum til MDF-dekk med kontaktlim – påfør lim på begge flater, la tørke 5 min, press sammen.
5. Lim kunstlær til skum, stram over kantene, fold ned og lim rundt MDF-kantene. Kunstlæret dekker hele overflaten inkl. kanter.
6. Legg ferdig dekk i kassen (hviler på støttelistene, kunstlær fyller gap til vegger).

### Fase 7: Finish

1. Klistre på vinyl-navn (rad 24) på fronten.
2. Test at alt fungerer.
3. Ferdig!

---

## CAD-modell og fargekoder

Fil: `hardware/cad/mobilhotell.kcl`

| Farge (hex) | Representerer | Innkjøp (rad / leverandør) |
|-------------|---------------|-----------------------------|
| `#c8b8a8`, `#d7c4b2`, `#a89888`, `#f2ebe4` | MDF 6 mm | Rad 11 – [Byggmax](https://www.byggmax.no/hus-og-bygg/platematerial-og-byggeplater/mdf-plater) |
| `#deb887` | Trelister (15×15 hjørne, 10×10 støtte) | Rad 12–13 – [Biltema](https://www.biltema.no/bygg/beslag/listverk/) |
| `#3d3d3d` | Dekk (kunstlær wrapper MDF+skum) | Rad 11, 16, 17 – enhetlig telefonflate |
| `#eef6fc` | Opalhvit akryl 4 mm (diffuser) | Rad 19 – [Biltema](https://www.biltema.no/bygg/platematerialer/pleksiglass/akrylplast-opalhvit-1200-x-800-x-4-mm-2000034953) |
| `#00c853` | Grønn LED 5 mm | Rad 3 – [elkim](https://elkim.no/produktkategori/komponenter/led-komponenter/) |
| `#2a2a2a` | IR-modul FC-51 | Rad 2 – [elkim](https://elkim.no/produkt/ir-infrared-obstacle-sensor-infrarod-hindringsdeteksjonsmodul/) |
| `#bea878` | Motstand 220 Ω | Rad 4 – [elkim](https://elkim.no/produktkategori/komponenter/led-komponenter/) |
| `#f5f5f0` | Breadboard 830 | Rad 5 – [elkim](https://elkim.no/produkt/koblingsbrett-breadboard/) |
| `#1e4d8b` | ESP32 NodeMCU CH9102X | Rad 1 – [elkim](https://elkim.no/produkt/esp32-ch9102x/) |
| `#2f2f2f` | USB-hub | Rad 9 – [Kjell](https://www.kjell.com/no/produkter/data-og-tilbehor/usb-og-thunderbolt/usb-huber/) – **mål egen modell** |
| `#121820` | OLED 0,96" modul | Rad 7 – [elkim](https://elkim.no/produkt/0-96-i2c-iic-serial-12864-oled-lcd-screen-display-module-for-arduino-raspberry-osv/) |

---

## Verifiserte komponentmål

| Komponent | Mål (L × B × H) | Kilde |
|-----------|-----------------|-------|
| ESP32 NodeMCU 30-pin | 54 × 25,5 × 12 mm | [Datasheet](https://mischianti.org/esp32-nodemcu-32s-esp-32s-kit-high-resolution-pinout-datasheet-and-specs) |
| Breadboard 830 hull | 165 × 54 × 10 mm | Produsent-data |
| IR-sensor FC-51 | 32 × 14 × 8 mm | [Datasheet](https://elkim.no/produkt/ir-infrared-obstacle-sensor-infrarod-hindringsdeteksjonsmodul/) |
| OLED 0,96" display | 27 × 27 × 4 mm (aktivt vindu) | [elkim](https://elkim.no/produkt/0-96-i2c-iic-serial-12864-oled-lcd-screen-display-module-for-arduino-raspberry-osv/) – **mål mottatt modul** |
| LED 5 mm | Ø5 × 8 mm | Standard |

---

## GPIO Pin-tilordning

```
Slot 1 (Mamma)  – IR sensor  →  GPIO 13
Slot 1 (Mamma)  – Status-LED →  GPIO 16

Slot 2 (Pappa)  – IR sensor  →  GPIO 14
Slot 2 (Pappa)  – Status-LED →  GPIO 17

Slot 3 (Nova)   – IR sensor  →  GPIO 27
Slot 3 (Nova)   – Status-LED →  GPIO 18

Slot 4 (Emil)   – IR sensor  →  GPIO 26
Slot 4 (Emil)   – Status-LED →  GPIO 19

Slot 5 (Anna)   – IR sensor  →  GPIO 25
Slot 5 (Anna)   – Status-LED →  GPIO 21

OLED Display – SDA  →  GPIO 32
OLED Display – SCL  →  GPIO 33
```

> GPIO 21 er ESP32s standard I2C SDA-pin, men den er brukt til LED slot 5. Derfor brukes GPIO 32 (SDA) og GPIO 33 (SCL) for OLED via `Wire.begin(32, 33)`.

---

## Koblingsskjema

### Strøm

```
ESP32 pin 3V3  →  (+) rød skinne på breadboard
ESP32 pin GND  →  (−) blå skinne på breadboard
```

### IR-sensorer (samme mønster for alle 5)

```
Sensor VCC  →  (+) rød skinne på breadboard
Sensor GND  →  (−) blå skinne på breadboard
Sensor OUT  →  GPIO-pin (se tabell over)
```

### Status-LEDs (samme mønster for alle 5)

```
GPIO-pin  →  220Ω motstand  →  LED (lang pinne, +)  →  GND (kort pinne, −)
```

### OLED-display

```
Display VCC  →  (+) rød skinne på breadboard
Display GND  →  (−) blå skinne på breadboard
Display SDA  →  GPIO 32
Display SCL  →  GPIO 33
```

### Fullstendig blokkdiagram

```
[USB-lader]
     │ Micro-USB
     ▼
[ESP32 DevKit 30-pin]
     │
     ├── 3V3 ──────────────────────── (+) breadboard-skinne ─────────────────────┐
     ├── GND ──────────────────────── (−) breadboard-skinne ─────────────────────┤
     │                                                                            │
     ├── GPIO 13 ◄── OUT ── [IR sensor slot 1]  ── VCC/GND fra skinne            │
     ├── GPIO 16  ──► 220Ω ──► [LED slot 1] ──► GND                              │
     │                                                                            │
     ├── GPIO 14 ◄── OUT ── [IR sensor slot 2]  ── VCC/GND fra skinne            │
     ├── GPIO 17  ──► 220Ω ──► [LED slot 2] ──► GND                              │
     │                                                                            │
     ├── GPIO 27 ◄── OUT ── [IR sensor slot 3]  ── VCC/GND fra skinne            │
     ├── GPIO 18  ──► 220Ω ──► [LED slot 3] ──► GND                              │
     │                                                                            │
     ├── GPIO 26 ◄── OUT ── [IR sensor slot 4]  ── VCC/GND fra skinne            │
     ├── GPIO 19  ──► 220Ω ──► [LED slot 4] ──► GND                              │
     │                                                                            │
     ├── GPIO 25 ◄── OUT ── [IR sensor slot 5]  ── VCC/GND fra skinne            │
     ├── GPIO 21  ──► 220Ω ──► [LED slot 5] ──► GND                              │
     │                                                                            │
     ├── GPIO 32  ──► SDA ── [OLED display]  ── VCC/GND fra skinne               │
     ├── GPIO 33  ──► SCL ── [OLED display]                                       │
     │                                                                            │
     │ WiFi                                                                       │
     ▼                                                                            │
[Hjemmeruter] ──► [Expo-appen]                                  alle sensorer/LEDs
                                                                 henter VCC/GND ──┘
```

---

## Sensorlogikk

IR-sensoren fra elkim.no gir:
- `LOW` (0) = objekt detektert (telefon på plass)
- `HIGH` (1) = ingenting foran sensoren (slot tom)

Potensiometeret justerer følsomheten (2–30 cm). Anbefalt: ca. 8–12 cm. Drei mot klokka for kortere rekkevidde.

---

## Kommunikasjonsflyt (sensor → app)

```
1. IR-sensor registrerer telefon (LOW-signal på GPIO)
2. ESP32 leser signalet hvert 500ms
3. Hvis statusendring: send JSON via WebSocket:
   { "slot": 1, "occupied": true, "timestamp": 1712073600 }
4. LED settes HIGH (lyser grønt)
5. Expo-appen mottar meldingen, lagrer checkInTime, starter timer
6. Telefonen tas ut → sensor gir HIGH → ESP32 sender:
   { "slot": 1, "occupied": false, "timestamp": 1712077200 }
7. LED slukkes
8. Appen beregner varighet, regner ut Plugs, viser konfetti
```

Appen kobler til ESP32 via lokal IP-adresse (f.eks. `ws://192.168.1.100:81`).

---

## Programmeringsverktøy

1. **Arduino IDE** – Last ned fra [arduino.cc/en/software](https://www.arduino.cc/en/software)
2. Legg til ESP32-støtte:
   - File → Preferences → Additional Boards Manager URLs:
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Tools → Board → Boards Manager → søk "esp32" → installer
3. Velg brett: Tools → Board → ESP32 Arduino → **ESP32 Dev Module**
4. Velg port: Tools → Port → (COM-porten som dukker opp)

### Påkrevde Arduino-biblioteker

| Bibliotek | Søk etter | Til hva |
|---|---|---|
| ESPAsyncWebServer | `ESPAsyncWebServer` | WebSocket-server |
| AsyncTCP | `AsyncTCP` | Kreves av ESPAsyncWebServer |
| ArduinoJson | `ArduinoJson` | JSON til appen |
| Adafruit SSD1306 | `Adafruit SSD1306` | OLED-display driver |
| Adafruit GFX Library | `Adafruit GFX` | Kreves av Adafruit SSD1306 |

---

## Tips og feilsøking

- **ESP32 gjenkjennes ikke av PC:** Installer CH9102X-driver fra [wch-ic.com](https://www.wch-ic.com/downloads/CH343SER_EXE.html)
- **Sensor reagerer ikke:** Drei potensiometeret og sjekk at rødt strømlys på sensoren lyser
- **Falske positiver:** Skru ned følsomheten, juster vinkel/avstand – test per telefon
- **LED lyser ikke:** Sjekk polaritet (lang pinne = +) og at motstand er i serie
- **App kobler ikke til ESP32:** Sjekk at telefon og ESP32 er på samme WiFi. Se IP i Serial Monitor (115200 baud)
- **Kabelrot:** Fargekod kablene – rød = VCC, sort = GND, én farge per slot
- **OLED viser ingenting:** Sjekk at `Wire.begin(32, 33)` kalles før `display.begin()`. Prøv adresse `0x3C` og `0x3D`
