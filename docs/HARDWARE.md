# Mobilhotell – Hardware-oppsett

Dette dokumentet beskriver **én samlet løsning**: ett sett materialer, én byggeidé og **konkrete lenker** til innkjøp.

**Hva dere bygger:** Et fysisk **mobilhotell** med **én åpen toppflate** – som når du **legger telefonen i Tesla-konsollen**: du **setter den rett på** en **myk, sammenhengende overflate** (skum + filt), **uten skillevegger og uten «lommer»**. Fem **navngitte plasser** (Mamma, Pappa, Nova, Emil, Anna) er **markering på fremsiden** + én **LED** + én **IR-sensor** per plass under/ved flaten. **OLED** på front. **ESP32** med WiFi/WebSocket til appen. **USB-hub og korte kabler** for lading.

---

## Innkjøpsliste – én løsning (alle lenker)

| # | Hva | Antall | Kjøp her | Ca. pris |
|---|-----|--------|----------|----------|
| 1 | ESP32 NodeMCU (CH9102X) | 1 | [elkim.no – ESP32](https://elkim.no/produkt/esp32-ch9102x/) | ~95 kr |
| 2 | IR hindringssensor FC-51 | 5 | [elkim.no – IR-sensor](https://elkim.no/produkt/ir-infrared-obstacle-sensor-infrarod-hindringsdeteksjonsmodul/) | ~150 kr |
| 3 | Grønn LED 5 mm | 5 | [elkim.no – LED](https://elkim.no/produktkategori/komponenter/led-komponenter/) | ~20 kr |
| 4 | Motstand 220 Ω | 5 | [elkim.no – motstander](https://elkim.no/produktkategori/komponenter/led-komponenter/) | ~10 kr |
| 5 | Breadboard 830 hull | 1 | [elkim.no – breadboard](https://elkim.no/produkt/koblingsbrett-breadboard/) | ~49 kr |
| 6 | Jumperkabel 40×10 cm HAN/HUN | 1 pk | [elkim.no – jumper](https://elkim.no/produkt/jumper-kabel-40x10-cm-flere-variasjoner/) | ~59 kr |
| 7 | OLED 0,96" 128×64 I2C | 1 | [elkim.no – OLED](https://elkim.no/produkt/0-96-i2c-iic-serial-12864-oled-lcd-screen-display-module-for-arduino-raspberry-osv/) | ~89 kr |
| 8 | Micro-USB-kabel **med data** (ikke «charge only») | 1 | [Kjell & Company – USB-kabler](https://www.kjell.com/no/produkter/kabler-og-adaptere/usb-kabler/) (velg A → Micro-USB) | ~50 kr |
| 9 | USB-hub 5-porters (gjerne med egen strømforsyning) | 1 | [Kjell & Company – USB-hub](https://www.kjell.com/no/produkter/data-og-tilbehor/usb-og-thunderbolt/usb-huber/) | ~149 kr |
| 10 | Korte USB-kabler til familiens plugger (A→C / A→Lightning e.l.) | 5 | [Kjell – USB-kabler](https://www.kjell.com/no/produkter/kabler-og-adaptere/usb-kabler/) eller [AliExpress – «short usb cable 20cm»](https://www.aliexpress.com/wholesale?SearchText=short+usb+cable+20cm) | ~60–250 kr |
| 11 | MDF-plate 3 mm (min. ca. **500×220 mm** til denne kassen – se mål under) | etter behov | [Panduro – MDF 3 mm A4](https://www.panduro.com/nb-no/produkter/hobby/trelast/plater/mdf-plate-3-mm-a4-297x210-mm-610101) (flere ark) eller større plater [Byggmax](https://www.byggmax.no) | ~100–250 kr |
| 12 | Trelim PVA | 1 | [Biltema – trelim](https://www.biltema.no/bygg/lim/trelim/) | ~49 kr |
| 13 | Skrue 3×12 mm (sensor + montasje) | 10+ | [Biltema – skruer](https://www.biltema.no/bygg/festemidler/skruer/) | ~29 kr |
| 14 | Polyeterskum 30P, **5 mm** tykk (én bit **408×170 mm** til dekk – rest til test) | 1 lm | [Industrisøm – polyeterskum 0,5 cm](https://industrisom.no/produkt/05cm-polyeterskum-we30-120cm-pr-lengdemeter/) | ~139 kr |
| 15 | Selvklebende hobbyfilt **20×30 cm** (5 ark per pakke) | **2+ pakker** for **408×170 mm** dekk (overlapp / side-i-side) | [Hobbykunst – selvklebende filt](https://www.hobbykunst-norge.no/vaare-produkter/nettbutikk-navigering/hobby-generelt/filt-ull/selvklebende-hobbyfilt-noytrale-farger-str-20x30-cm-5/pkg) | ~100 kr+ |
| 16 | Akrylplate **opalhvit** 3–4 mm (stripe bak LED-ene) | utsnitt / rest | [Biltema – opalhvit akryl](https://www.biltema.no/bygg/platematerialer/pleksiglass/akrylplast-opalhvit-1200-x-800-x-4-mm-2000034953) | etter behov |
| 17 | **Tresparkel** til MDF-fuger og små ujevnheter | 1 | [Clas Ohlson – søk «sparkel»](https://www.clasohlson.com/no/s?query=sparkel) | ~40–90 kr |
| 18 | Sandpapir (grovt + fint, f.eks. 120 og 240) | 1 sett | [Biltema – sandpapir](https://www.biltema.no/bygg/slipeutstyr/sandpapir/) | ~30 kr |
| 19 | **Grunning** til tre/MDF (anbefales før toppstrøk) | 1 | [Clas Ohlson – søk «grunning tre»](https://www.clasohlson.com/no/s?query=grunning%20tre) | ~80–150 kr |
| 20 | **Hvit** maling til tre/MDF (spray eller boks) | 1 | [Clas Ohlson – spraymaling](https://www.clasohlson.com/no/Spraymaling/p/34-8621) | ~79 kr |
| 21 | **Grønn** akrylmaling (Unplug **#2DC653** – velg nær nyanse eller bland) | 1 | [Panduro – maling](https://www.panduro.com/nb-no/produkter/maling) | ~50 kr |

**Prisoverslag:** Elektronikk rad 1–8 ca. **470–520 kr**. Med lading 9–10 ca. **+200–350 kr**. Kabinett, pute og finish 11–21 ca. **600–1000 kr** (avhengig av MDF-størrelse og kabler).

**Prototype:** Klipp papp **408×170 mm** dekk (+ vegger); test **skum + filt** (14–15).

---

## iPhone-mål og kassedimensjoner (minimal)

Kassen er tegnet for **vanlige iPhone-størrelser** (15/16-serien) med **tynt deksel**, uten ekstra luft «for sporten». Tallene under er **naken telefon** fra Apples sammenligning; små tillegg er dokumentert.

| Modell (eksempler) | Høyde × bredde × dybde (mm) | Kilde |
|--------------------|------------------------------|--------|
| iPhone 16 Pro Max | 163,0 × 77,6 × 8,25 | [Apple – sammenlign modeller](https://www.apple.com/iphone/compare/) |
| iPhone 16 Plus | 160,9 × 77,8 × 7,8 | Samme |
| iPhone 16 / 15 | 147,6 × 71,6 × 7,8 | Samme |

**Valg i prosjektet (matcher `mobilhotell.kcl`):**

- **Orientering på puta:** Telefonene ligger **ved siden av hverandre** langs **X** (du ser **smalsiden** mot deg). **Langsiden** peker mot **bakveggen** (**+Y**) – som fem «stående» telefoner i bredden, ikke én lang rad med langside langs bordet.
- **Plass per telefon langs X:** **80 mm** = **78 mm** (bredeste vanlige bredde, 16 Plus) + **2 mm** deksel, pluss **2 mm** glippe til nabotelefon (`neighborGap` i KCL).
- **Putedybde langs Y:** **170 mm** = **163 mm** (største vanlige lengde, 16 Pro Max) + **3 mm** deksel + **4 mm** luft foran/bak på matten.
- **Dekkflate:** **408 mm** langs **X** (5×80 mm + 4×2 mm glippe) × **170 mm** langs **Y** (én sammenhengende flate).
- **Elektronikk under:** Breadboard **165×54 mm** + hub **100×50 mm** typisk ligger **side om side langs X** under dekket – innvendig gulv **~412×170 mm** rommer dette (mål [hub](https://www.kjell.com/no/produkter/data-og-tilbehor/usb-og-thunderbolt/usb-huber/) du kjøper).
- **Basehøyde:** **38 mm** i CAD = tilstrekkelig til høyeste del under hyllen (typisk USB-hub **23 mm** + avstand fra bunn) + **litt** plass til kabler. Tykkere hub, større kontakter eller mye kabler → øk `baseHeight` i KCL.
- **Høyde:** `totalHeight` i KCL følger **hele kassen** rundt skrå puta: `tiltDeckTopZ` = høyeste punkt på filt (bak) fra trigonometri med **11°**, pluss **`lidClearance`** og lokk (**`wall`**). Typisk **~100 mm** ytre høyde (ikke bare «løft puta» – **sidevegger** og **topp** rommer vinkelen). Dekk **408×170 mm** i **3 mm** MDF; ved behov **4–6 mm** (`deckMdf` i KCL).

**Ytre mål (fra CAD):** bredde **418 mm**, dybde **176 mm**, høyde **~100 mm** (vegger + horisontal toppplate over skrå puta).

**Ikke-iPhone:** Større enn tabellen – øk `iphoneWideMax` / `iphoneLongMax` (og evt. `neighborGap`) eller `deckDepth` i KCL proporsjonalt.

---

## Overflate på kassen: sparkel og maling

**Ja – MDF-kassen bør sparkles og males** på alle **synlige ytre flater** som ikke skal være filt/skum på **toppflaten**.

- **Sparkel (tresparkel):** Fyll **limfuger**, små **hakker** og **skruehull** som skal dekkes av maling. **Ikke** sparkel der **hele toppdekke** (skum + filt) skal lime – der skal MDF være ren for lim til skum.
- **SliP** sparkel flat når den er tørr; støv av før maling.
- **Grunning (rad 19):** Én strøk på MDF reduserer «sug» og gir jevnere hvitt – **anbefales**.
- **Toppstrøk:** Minst **to strøk hvitt** (rad 20). Deretter **grønn aksent** (rad 21) på valgte detaljer – masker nøye.

**Glitter / «sparkle» på hele kassen:** Vi anbefaler **ikke** glitter som hovedflate – det **samler støv** og blir fort rotete i daglig bruk. Vil dere ha litt liv, bruk **satin/halvmatt** lakk eller en **diskret** grønn aksent i stedet.

**Akryl-diffuseren (rad 16)** skal **ikke males** – den skal være opalhvit så LED-lyset blir mykt.

---

## Åpen toppflate og pute (Tesla-lignende opplevelse)

Målet er **samme følelse som i bilen**: du **slipper telefonen på en myk, åpen matte** – ikke «ned i en kasse» eller mellom skillevegger.

### Hva som *ikke* er med

- **Ingen** vertikale skillevegger mellom telefonene på toppen.
- **Ingen** nedsenkede lommer – bare én **sammenhengende** puteflate.

### Hva som *er* med

- **Én MDF-plate** som bærer hele toppen.
- **Ett lag polyeter 5 mm** (rad 14) kuttet til **408 × 170 mm** (samme som dekk i KCL). **Rekkefølge:** MDF nederst → lim **skum** → **filt** oppå (samme som tre lagfarger i CAD).
- **Selvklebende filt** (rad 15) over hele – **minst to pakker** 20×30 cm-ark, lim i overlapp; unngå tykk søm midt i hver sone.
- **Navn** (Mamma, Pappa, Nova, Emil, Anna) på **fremsiden** under toppen – ren **visuell** plassering, ikke fysiske skiller.
- **Skrå vinkel** (som i Tesla): avtalt område **10–12°** – **bakre kant av puta opp**, **fram mot deg litt lavere** (som **kile bak**). Telefonene står **ved siden av hverandre** med **langside mot bakveggen**; hellingen går derfor **fram–bak** (inn i kassen), **ikke** sideveis langs raden. I `mobilhotell.kcl` brukes **11°** rotasjon rundt **global X** (samme retning som rekken) – **ikke** «`pitch` alene», som i Zoo kan gi feil akse.

### IR-sensor på åpen flate

Én **FC-51 per plass**, montert **under bakre del** av dekket (eller med **lite hull** i MDF/skim for synslinje). Telefonen ligger **åpent oppå filt** med **langside mot bakvegg** – juster **vinkel og potensiometer** til dere får stabil **LOW** når riktig telefon ligger i «sin» sone (**~80 mm** bredde per plass langs front, **~82 mm** senter-til-senter inkl. glippe). **Test alltid med ekte telefoner.**

### Oversikt (ovenfra)

```
  ┌──────────────────────────────────────────────────────────┐
  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  ← én myk flate
  │   📱      📱      📱      📱      📱   (fritt plassert)   │
  └──────────────────────────────────────────────────────────┘
   Mamma   Pappa    Nova    Emil    Anna   ← navn på front (LED under diffuser)
```

---

## CAD-modell og fargekoder

Fil: `hardware/cad/mobilhotell.kcl`. Modellen følger **innkjøpslisten** øverst i dette dokumentet (rad 1–21) for alle kjøpbare deler.

| Farge (hex, i CAD) | Representerer | Innkjøp (HARDWARE rad / leverandør) |
|--------------------|---------------|-------------------------------------|
| `#c8b8a8`, `#d7c4b2`, `#b5a08e`, `#a89888`, `#e8dfd6`, `#f2ebe4` | MDF 3 mm (rå / malt) | Rad 11 – [Panduro](https://www.panduro.com/nb-no/produkter/hobby/trelast/plater/mdf-plate-3-mm-a4-297x210-mm-610101) / [Byggmax](https://www.byggmax.no) |
| `#2DC653` | Ytre aksent / detaljer (ikke skillevegger på topp) | Rad 21 – [Panduro maling](https://www.panduro.com/nb-no/produkter/maling) |
| `#FFD93D` | Navneskilt (maling eller vinyl) | Egen detalj / rad 20–21 |
| `#eef6fc` (gjennomsiktig) | Opalhvit akryl 4 mm, diffuser | Rad 16 – [Biltema](https://www.biltema.no/bygg/platematerialer/pleksiglass/akrylplast-opalhvit-1200-x-800-x-4-mm-2000034953) |
| `#c5c5c5` | Polyeterskum 5 mm (30P) | Rad 14 – [Industrisøm](https://industrisom.no/produkt/05cm-polyeterskum-we30-120cm-pr-lengdemeter/) |
| `#8a8a8a` | Selvklebende hobbyfilt | Rad 15 – [Hobbykunst](https://www.hobbykunst-norge.no/vaare-produkter/nettbutikk-navigering/hobby-generelt/filt-ull/selvklebende-hobbyfilt-noytrale-farger-str-20x30-cm-5/pkg) |
| `#00c853` | Grønn LED 5 mm | Rad 3 – [elkim](https://elkim.no/produktkategori/komponenter/led-komponenter/) |
| `#2a2a2a` | IR-modul FC-51 | Rad 2 – [elkim](https://elkim.no/produkt/ir-infrared-obstacle-sensor-infrarod-hindringsdeteksjonsmodul/) |
| `#bea878` | Motstand 220 Ω (aksial) | Rad 4 – [elkim](https://elkim.no/produktkategori/komponenter/led-komponenter/) |
| `#f5f5f0` | Breadboard 830 | Rad 5 – [elkim](https://elkim.no/produkt/koblingsbrett-breadboard/) |
| `#1e4d8b` | ESP32 NodeMCU CH9102X | Rad 1 – [elkim](https://elkim.no/produkt/esp32-ch9102x/) |
| `#2f2f2f` | USB-hub (plastkabinett) | Rad 9 – [Kjell](https://www.kjell.com/no/produkter/data-og-tilbehor/usb-og-thunderbolt/usb-huber/) – **mål egen modell**; CAD bruker typisk fotavtrykk |
| `#121820` | OLED 0,96" modul | Rad 7 – [elkim](https://elkim.no/produkt/0-96-i2c-iic-serial-12864-oled-lcd-screen-display-module-for-arduino-raspberry-osv/) |

**Mål fra CAD:** `totalWidth` = **418 mm**, `totalDepth` = **176 mm**, `totalHeight` ≈ **100 mm** (`tiltDeckTopZ` + **`lidClearance`** + lokk; vegger strekker seg til samme høyde). Dekk **408×170 mm**: **MDF**, **polyeter** og **filt** har hver sin farge, samme **11°** rundt **akse [1,0,0]**, pivot på **fremskanten**; **IR** har samme transform. Kabel- og venthull er **subtract** i hylle/bakvegg.

**Jumperkabler** og **USB-kabler** er ikke modellert (for små / variantrike); se innkjøpsliste rad 6 og 8–10.

---

## Verifiserte komponentmål

| Komponent | Mål (L × B × H) | Kilde |
|-----------|-----------------|-------|
| ESP32 NodeMCU 30-pin | 54 × 25.5 × 12 mm | [Datasheet](https://mischianti.org/esp32-nodemcu-32s-esp-32s-kit-high-resolution-pinout-datasheet-and-specs) |
| Breadboard 830 hull | 165 × 54 × 10 mm | Produsent-data |
| IR-sensor FC-51 | 32 × 14 × 8 mm | [Datasheet](https://elkim.no/produkt/ir-infrared-obstacle-sensor-infrarod-hindringsdeteksjonsmodul/) |
| OLED 0,96" display | Aktivt vindu **27 × 27 × 4 mm** (skjerm); hele PCB større | [elkim](https://elkim.no/produkt/0-96-i2c-iic-serial-12864-oled-lcd-screen-display-module-for-arduino-raspberry-osv/) oppgir for noen varianter **emballasje 2 × 2 × 1 cm** – **mål mottatt modul** for presis kabinett |
| LED 5mm | Ø5 × 8 mm | Standard |

---

## GPIO Pin-tilordning

```
Slot 1 (Familiemedlem 1) – IR sensor   →  GPIO 13
Slot 1 (Familiemedlem 1) – Status-LED  →  GPIO 16

Slot 2 (Familiemedlem 2) – IR sensor   →  GPIO 14
Slot 2 (Familiemedlem 2) – Status-LED  →  GPIO 17

Slot 3 (Familiemedlem 3) – IR sensor   →  GPIO 27
Slot 3 (Familiemedlem 3) – Status-LED  →  GPIO 18

Slot 4 (Familiemedlem 4) – IR sensor   →  GPIO 26
Slot 4 (Familiemedlem 4) – Status-LED  →  GPIO 19

Slot 5 (Familiemedlem 5) – IR sensor   →  GPIO 25
Slot 5 (Familiemedlem 5) – Status-LED  →  GPIO 21

OLED Display – SDA  →  GPIO 32
OLED Display – SCL  →  GPIO 33
```

> GPIO 21 er ESP32s standard I2C SDA-pin, men den er allerede brukt til LED slot 5.
> Derfor brukes GPIO 32 (SDA) og GPIO 33 (SCL) for OLED-displayet via software I2C (`Wire.begin(32, 33)`).

---

## Koblingsskjema

### Strøm (gjøres én gang for alle komponenter)

```
ESP32 pin 3V3  →  (+) rød skinne på breadboard
ESP32 pin GND  →  (−) blå skinne på breadboard
```

### IR-sensorer (samme mønster for alle 5)

Hver IR-sensor har tre pinner: **VCC**, **GND**, **OUT**.

```
Sensor VCC  →  (+) rød skinne på breadboard
Sensor GND  →  (−) blå skinne på breadboard
Sensor OUT  →  GPIO-pin (se tabell over)
```

Sensor-modulene fra elkim.no er komplette moduler med innebygd LM393-komparator,
potensiometer og pull-up-motstand. Ingen ekstra komponenter nødvendig.

### Status-LEDs (samme mønster for alle 5)

```
GPIO-pin  →  220Ω motstand  →  LED (lang pinne, +)  →  GND (kort pinne, −)
```

LED-en lyser grønt når telefonen er sjekket inn (GPIO settes HIGH i firmware).

### OLED-display

OLED-displayet bruker I2C-protokollen og kobles til ESP32 med 4 ledninger:

```
Display VCC  →  (+) rød skinne på breadboard
Display GND  →  (−) blå skinne på breadboard
Display SDA  →  GPIO 32
Display SCL  →  GPIO 33
```

I firmware initialiseres I2C med `Wire.begin(32, 33)` for å bruke disse pinnene i stedet for standard (GPIO 21/22).

Displayet viser live-status for alle 5 slotter direkte fra ESP32 – uavhengig av om appen er åpen:

```
╔══════════════════╗
║  UNPLUG HOTEL    ║
╠══════════════════╣
║ Mamma   ✓  42m  ║
║ Pappa   ✓  38m  ║
║ Nova    –        ║
║ Emil    ✓  15m  ║
║ Anna    –        ║
╠══════════════════╣
║ Plugs i dag: 247 ║
╚══════════════════╝
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

## Fysisk plassering i kasettet

### Sensor-montering (åpen topp)

Samme som under [IR-sensor på åpen flate](#åpen-toppflate-og-pute-tesla-lignende-opplevelse).

### LED-montering bak diffusert akryl

LED-ene monteres bak én stripe **opalhvit akryl** (3–4 mm) – **én løsning**, mykt diffust lys.

**Design:**
```
Front-panel (tverrsnitt):
┌─────────────────────────────────────────────────┐
│                                                 │
│   ┌─────────────────────────────────────────┐   │
│   │  ● LED   ● LED   ● LED   ● LED   ● LED  │   │  ← LED-er bak
│   │  ═══════════════════════════════════════│   │    akrylplate
│   └─────────────────────────────────────────┘   │
│                                                 │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐     │
│   │     │ │     │ │     │ │     │ │     │     │  ← Åpen topp (én flate)
└───┴─────┴─┴─────┴─┴─────┴─┴─────┴─┴─────┴─────┘
```

**Material:** [Biltema – opalhvit akryl](https://www.biltema.no/bygg/platematerialer/pleksiglass/akrylplast-opalhvit-1200-x-800-x-4-mm-2000034953) (se innkjøpsliste rad 16).

**LED-montering:**
- 5 mm grønne LED-er med 220Ω motstand
- Plasser LED 5-10mm bak akrylplaten for optimal diffusjon
- Drill 5mm hull i MDF-fronten, LED stikkes gjennom bakfra

### OLED-montering

OLED-displayet monteres synlig på fronten av mobilhotellet, f.eks. sentrert over alle slottene
eller på siden av kasettet. Viser live-status for hele familien uten at man trenger å åpne appen.

```
  Frontpanel mobilhotell:

  ┌─────────────────────────────────────────────┐
  │         ┌──────────────────────┐            │
  │         │   UNPLUG HOTEL       │            │  ← OLED-display
│         │   Mamma ✓  Pappa ✓   │            │
│         │   Nova –   Emil ✓    │            │
│         │   Anna –   Plugs:247 │            │
  │         └──────────────────────┘            │
  ├──────┬──────┬──────┬──────┬──────┤
  │  🟢  │  🟢  │      │  🟢  │      │  ← Status-LEDs
  │      │      │      │      │      │
│  📱  │  📱  │      │  📱  │      │  ← Åpen flate (soner)
│      │      │      │      │      │
│Mamma │Pappa │ Nova │ Emil │Anna │
  └──────┴──────┴──────┴──────┴──────┘
```

### Kabinettet – mål fra CAD (`mobilhotell.kcl`)

**Ytre mål:** **418 × 176 × ~100 mm** (B × D × H). **Innvendig pute:** **408 × 170 mm** (flate størrelse; **skrå 10–12°**, CAD **11°**). **Base:** **38 mm** (juster om hub/kabler krever mer). Se [iPhone-mål og kassedimensjoner](#iphone-mål-og-kassedimensjoner-minimal).

**Farge → material → lenke:** [CAD-modell og fargekoder](#cad-modell-og-fargekoder).

---

## Elektronikkbase (skjult under den åpne toppflaten)

Elektronikkbasen er **38 mm høy** i CAD (øk ved behov om hub/kabler er høyere). **Innvendig plan:** ca. **412 × 170 mm** – breadboard og hub ligger **side om side langs X** under dekket (se KCL).

**Plassering av komponenter:**
```
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│   ┌──────────────────┐   ┌──────────┐   ┌──────────────────────┐ │
│   │    Breadboard    │   │  USB-hub │   │   Kabler og          │ │
│   │    165 × 54 mm   │   │ ~100×30  │   │   tilkobling         │ │
│   │    + ESP32       │   │ + strøm │   │                      │ │
│   └──────────────────┘   └──────────┘   └──────────────────────┘ │
│                                                                   │
│   [  Kabelhull 1  ] [  Kabelhull 2  ] ... [  Kabelhull 5  ]      │
│         ↓               ↓                       ↓                │
└───────────────────────────────────────────────────────────────────┘
          sone 1          sone 2                 sone 5
```

**Kabelhull (5 stk):**
- Diameter: **15 mm**
- Plassering: Ett hull under **hver IR-sone** (under den åpne toppflaten)
- Sensor-kablene (VCC, GND, OUT) føres fra dekk til base

**Ventilasjon:**
- 2-3 ventilasjonshull (10mm) i bakveggen for ESP32-kjøling
- Plasseres nær ESP32-posisjonen

**Strøminntak:**
- Ett hull (10mm) for Micro-USB kabel til ESP32
- Plasseres på siden eller bak

**Vedlikehold:**
- Avtakbar bunnplate eller bakplate anbefales
- Festet med skruer (ikke lim) for enkel tilgang

---

## Programmeringsverktøy

1. **Arduino IDE** – Last ned fra [arduino.cc/en/software](https://www.arduino.cc/en/software)
2. Legg til ESP32-støtte i Arduino IDE:
   - File → Preferences → Additional Boards Manager URLs:
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Tools → Board → Boards Manager → søk "esp32" → installer "esp32 by Espressif Systems"
3. Velg riktig brett: Tools → Board → ESP32 Arduino → **ESP32 Dev Module**
4. Velg riktig port: Tools → Port → (den COM-porten som dukker opp når ESP32 kobles til)

**Obs:** Bruk en Micro-USB-kabel som støtter data (ikke kun lading).
Test ved å koble ESP32 til PC – den skal dukke opp som en COM-port i Enhetsbehandling.

---

## Påkrevde Arduino-biblioteker

Installer via Arduino IDE → Tools → Manage Libraries:

| Bibliotek | Søk etter | Til hva |
|---|---|---|
| ESPAsyncWebServer | `ESPAsyncWebServer` | WebSocket-server |
| AsyncTCP | `AsyncTCP` | Kreves av ESPAsyncWebServer |
| ArduinoJson | `ArduinoJson` | Formatere JSON til appen |
| Adafruit SSD1306 | `Adafruit SSD1306` | OLED-display driver |
| Adafruit GFX Library | `Adafruit GFX` | Kreves av Adafruit SSD1306 |

---

## Sensorlogikk

IR-sensoren fra elkim.no gir:
- `LOW` (0) = objekt detektert (telefon inne i sloten)
- `HIGH` (1) = ingenting foran sensoren (slot tom)

Potensiometeret på sensoren justerer følsomheten (rekkevidde 2–30 cm).
Drei mot klokka for kortere rekkevidde, mot klokka for lengre.
Anbefalt innstilling for mobilhotell: ca. 8–12 cm.

---

## Slot-til-bruker-mapping

Konfigureres én gang i Settings-skjermen i appen.
Hvert familiemedlem får fast slot – bytter ikke.

| Plass (sone) | GPIO sensor | GPIO LED | Navn (forslag – mappes i app) |
|---|---|---|---|
| 1 | 13 | 16 | Mamma |
| 2 | 14 | 17 | Pappa |
| 3 | 27 | 18 | Nova |
| 4 | 26 | 19 | Emil |
| 5 | 25 | 21 | Anna |

| Komponent | GPIO SDA | GPIO SCL |
|---|---|---|
| OLED-display | 32 | 33 |

---

## Kommunikasjonsflyt (sensor → app)

```
1. IR-sensor registrerer telefon (LOW-signal på GPIO)
2. ESP32 leser signalet hvert 500ms
3. Hvis statusendring: send JSON via WebSocket til alle tilkoblede klienter:
   { "slot": 1, "occupied": true, "timestamp": 1712073600 }
4. LED for sloten settes HIGH (lyser grønt)
5. Expo-appen mottar meldingen, lagrer checkInTime, starter timer
6. Telefonen tas ut → sensor gir HIGH → ESP32 sender:
   { "slot": 1, "occupied": false, "timestamp": 1712077200 }
7. LED slukkes
8. Appen beregner varighet, regner ut Plugs, viser konfetti
```

Appen kobler til ESP32 via lokal IP-adresse (f.eks. `ws://192.168.1.100:81`).
IP-adressen konfigureres én gang i Settings-skjermen.

---

## Tips og feilsøking

- **ESP32 gjenkjennes ikke av PC:** Installer CH9102X-driver fra [wch-ic.com](https://www.wch-ic.com/downloads/CH343SER_EXE.html)
- **Sensor reagerer ikke:** Drei potensiometeret og sjekk at det røde strømlyset på sensoren lyser
- **Falske positiver (sensor utløses uten telefon):** Skru ned følsomheten (potensiometer), eller juster vinkel / avstand – på **åpen flate** kan nabosoner påvirke; test per telefon
- **LED lyser ikke:** Sjekk polaritet (lang pinne = +, kort pinne = −) og at motstanden er koblet i serie
- **App kobler ikke til ESP32:** Sjekk at telefon og ESP32 er på samme WiFi-nettverk. Sjekk IP-adressen i Arduino Serial Monitor (115200 baud)
- **Kabelrot:** Fargekod kablene – rød = VCC, sort = GND, deretter en farge per slot for signalledningene
- **OLED viser ingenting:** Sjekk at `Wire.begin(32, 33)` er kalt før `display.begin()` i firmware. Sjekk også I2C-adressen – prøv `0x3C` og `0x3D` (de fleste 0.96" moduler bruker `0x3C`)
- **OLED viser feil tekst:** OLED oppdateres av ESP32 direkte og er ikke avhengig av appen. Sjekk at sensor-GPIO-statusen leses riktig i firmware

---

## Design-sjekkliste

### Fysisk design
- [ ] **Én åpen toppflate** – ingen skillevegger mellom telefoner (Tesla-følelse)
- [ ] Pute: **ett** polyeterlag + filt over hele dekket (rad 14–15, nok filt-pakker)
- [ ] Fem **navn** + fem **LED** + fem **IR** (én plass per **~80 mm** bredde langs X, langside mot bak)
- [ ] **Skrå puta** (**10–12°**, CAD **11°**): kile under MDF bak, eller følg `mobilhotell.kcl`
- [ ] Sparkel, slip, grunning og maling (se «Overflate»)
- [ ] LED bak opal akryl
- [ ] IR plassert og testet for **åpen** flate
- [ ] Kabelhull fra hver sone til base
- [ ] Ventilasjonshull for ESP32
- [ ] Avtakbar bakplate for vedlikehold
- [ ] Hull for strømkabel (Micro-USB)

### Materialer (faktiske produkter)
- [x] ESP32 NodeMCU CH9102X – [elkim.no](https://elkim.no/produkt/esp32-ch9102x/)
- [x] IR-sensorer FC-51 (5 stk) – [elkim.no](https://elkim.no/produkt/ir-infrared-obstacle-sensor-infrarod-hindringsdeteksjonsmodul/)
- [x] OLED 0.96" display – [elkim.no](https://elkim.no/produkt/0-96-i2c-iic-serial-12864-oled-lcd-screen-display-module-for-arduino-raspberry-osv/)
- [x] Grønne LED-er 5mm – [elkim.no](https://elkim.no/produktkategori/komponenter/led-komponenter/)
- [x] Motstander 220Ω – [elkim.no](https://elkim.no/produktkategori/komponenter/led-komponenter/)
- [x] Breadboard 830 hull – [elkim.no](https://elkim.no/produkt/koblingsbrett-breadboard/)
- [x] Jumperkabler – [elkim.no](https://elkim.no/produkt/jumper-kabel-40x10-cm-flere-variasjoner/)
- [ ] MDF 3 mm, lim, skruer – rad 11–13
- [ ] Polyeterskum (én stor bit) + nok filt-ark – rad 14–15
- [ ] Opalhvit akryl, sparkel, sandpapir, grunning, hvit + grønn maling – rad 16–21
- [ ] USB-hub og korte kabler – rad 9–10

### Elektronikk-verifikasjon
- [ ] Alt passer i **38 mm** base (eller øk `baseHeight` i KCL om nødvendig); **~170 mm** innvendig dybde under puta
- [ ] Breadboard **165×54** + hub **100×50×23** (typisk) langs **X** – **mål egen hub**
- [ ] Sensor-kabler (10 cm) når fra dekk til base
- [ ] OLED-kabel (10–15 cm) når fra base til frontpanel

### Før bygging
- [ ] Last ned og test firmware på breadboard
- [ ] Verifiser at alle sensorer fungerer
- [ ] Test OLED-display med riktig I2C-adresse
- [ ] Mål opp og tegn alle deler på papir først
- [ ] Papp-prototype av **hel åpen topp** + pute-lag; test IR og plassering av alle telefoner
