# Mobilhotell – Hardware-oppsett

Fysisk mobilhotell med 5 slotter (en per familiemedlem), IR-sensorer, statuslys og OLED-display, koblet til Expo-appen via WiFi og WebSocket.

---

## Komponentliste

### Nødvendig

| # | Komponent | Antall | Lenke | Estimert pris |
|---|---|---|---|---|
| 1 | ESP32 NodeMCU (30 GPIO, CH9102X) | 1 stk | [elkim.no](https://elkim.no/produkt/esp32-ch9102x/) | ~95 kr |
| 2 | IR Infrared Obstacle Sensor-modul | 5 stk | [elkim.no](https://elkim.no/produkt/ir-infrared-obstacle-sensor-infrarod-hindringsdeteksjonsmodul/) | ~150 kr |
| 3 | Grønne LEDs 3mm eller 5mm | 5 stk | [elkim.no – LED-komponenter](https://elkim.no/produktkategori/komponenter/led-komponenter/) | ~20 kr |
| 4 | 220 ohm motstander | 5 stk | [elkim.no – LED-komponenter](https://elkim.no/produktkategori/komponenter/led-komponenter/) | ~10 kr |
| 5 | Breadboard 830 hull | 1 stk | [elkim.no](https://elkim.no/produkt/koblingsbrett-breadboard/) | ~49 kr |
| 6 | Jumperkabler 40 stk x 10 cm (HAN/HUN) | 1 pakke | [elkim.no](https://elkim.no/produkt/jumper-kabel-40x10-cm-flere-variasjoner/) | ~59 kr |
| 7 | OLED-display 0.96" 128x64 I2C | 1 stk | [elkim.no](https://elkim.no/produkt/0-96-i2c-iic-serial-12864-oled-lcd-screen-display-module-for-arduino-raspberry-osv/) | ~89 kr |
| 8 | Micro-USB datakabel (ikke kun lading) | 1 stk | Kjell & Co / har sikkert | ~0–49 kr |

**Total nødvendig: ~470–520 kr**

### Valgfritt (anbefalt)

| # | Komponent | Antall | Lenke | Estimert pris |
|---|---|---|---|---|
| 8 | USB-hub 5-port (for lading av telefoner) | 1 stk | [Kjell & Company](https://www.kjell.com/no/produkter/data-og-tilbehor/usb-og-thunderbolt/usb-huber/) | ~149 kr |
| 9 | Korte USB-kabler 20 cm | 5 stk | [AliExpress](https://www.aliexpress.com/wholesale?SearchText=short+usb+cable+20cm+5+pack) | ~60 kr |

### Til kabinettet (fysisk mobilhotell)

| # | Komponent | Antall | Lenke | Estimert pris |
|---|---|---|---|---|
| 10 | MDF-plate 3mm (600×300mm eller større) | 2 stk | [Panduro](https://www.panduro.com/nb-no/produkter/hobby/trelast/plater/mdf-plate-3-mm-a4-297x210-mm-610101) / [Byggmax](https://www.byggmax.no) | ~100 kr |
| 11 | Akrylplate opalhvit 3mm (LED-diffuser) | 1 stk | [Biltema](https://www.biltema.no/bygg/platematerialer/pleksiglass/akrylplast-opalhvit-1200-x-800-x-4-mm-2000034953) | ~149 kr |
| 12 | Akrylplate røykfarget/sotfarget 3mm | 1 stk | [Glassbutikk.no](https://www.glassbutikk.no/produkt/akryl-plexiglass-gra-sotfarget-10mm/) | ~200 kr |
| 13 | Akrylmaling hvit (spray eller pensel) | 1 stk | [Clas Ohlson](https://www.clasohlson.com/no/Spraymaling/p/34-8621) | ~79 kr |
| 14 | Akrylmaling grønn (#2DC653) | 1 stk | [Panduro](https://www.panduro.com/nb-no/produkter/maling) | ~50 kr |
| 15 | Trelim (PVA) | 1 stk | [Biltema](https://www.biltema.no/bygg/lim/trelim/) | ~49 kr |
| 16 | Skruer 3×12mm (for sensorfeste) | 10 stk | [Biltema](https://www.biltema.no/bygg/festemidler/skruer/) | ~29 kr |

**Total kasett-materialer: ~650–750 kr**

---

## Verifiserte komponentmål

| Komponent | Mål (L × B × H) | Kilde |
|-----------|-----------------|-------|
| ESP32 NodeMCU 30-pin | 54 × 25.5 × 12 mm | [Datasheet](https://mischianti.org/esp32-nodemcu-32s-esp-32s-kit-high-resolution-pinout-datasheet-and-specs) |
| Breadboard 830 hull | 165 × 54 × 10 mm | Produsent-data |
| IR-sensor FC-51 | 32 × 14 × 8 mm | [Datasheet](https://elkim.no/produkt/ir-infrared-obstacle-sensor-infrarod-hindringsdeteksjonsmodul/) |
| OLED 0.96" display | 27 × 27 × 4 mm (skjerm) | [Datasheet](https://elkim.no/produkt/0-96-i2c-iic-serial-12864-oled-lcd-screen-display-module-for-arduino-raspberry-osv/) |
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
║ Emma    –        ║
║ Noah    ✓  15m  ║
║ Lilly   –        ║
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

### Sensor-montering

IR-sensoren plasseres **innerst i hver slot**, pekende mot åpningen.
Telefonen skyves inn og reflekterer IR-strålen tilbake → sensor registrerer `LOW` → telefon inne.

```
  ┌────────────────────────────────┐
  │  Åpning          Innerst       │
  │    │                 │         │
  │    │  → telefon →  [IR]──kabel─┼──► breadboard
  │    │                           │
  └────────────────────────────────┘
```

Sensoren har 3 mm skruehull – skrus fast i bunn eller side av sloten.

### LED-montering bak diffusert akryl

For et polert utseende monteres LED-ene bak en stripe med **opalhvit eller røykfarget akryl** (3mm).
Dette gir et diffust, mykt lys i stedet for punktlyskilder.

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
│   │     │ │     │ │     │ │     │ │     │     │  ← Slotter
└───┴─────┴─┴─────┴─┴─────┴─┴─────┴─┴─────┴─────┘
```

**Materialer:**
- Akrylplate opalhvit 3mm fra [Biltema](https://www.biltema.no/bygg/platematerialer/pleksiglass/akrylplast-opalhvit-1200-x-800-x-4-mm-2000034953) (~149 kr)
- Alternativt: Røykfarget akryl fra [Glassbutikk.no](https://www.glassbutikk.no) for mørkere look

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
  │         │   Emma –   Noah ✓    │            │
  │         │   Lilly –  Plugs:247 │            │
  │         └──────────────────────┘            │
  ├──────┬──────┬──────┬──────┬──────┤
  │  🟢  │  🟢  │      │  🟢  │      │  ← Status-LEDs
  │      │      │      │      │      │
  │  📱  │  📱  │      │  📱  │      │  ← Slotter
  │      │      │      │      │      │
  │Mamma │Pappa │ Emma │ Noah │Lilly │
  └──────┴──────┴──────┴──────┴──────┘
```

### Kabinettet (korrigerte mål for 5 slotter)

**Ytre mål:**
- Totalbredde: **654 mm** (65.4 cm)
- Totalhøyde: **220 mm** (22 cm)
- Totaldybde: **140 mm** (14 cm)

**Indre mål:**
- Slotbredde per plass: **125 mm** (like store slotter!)
- Slothøyde: **150 mm**
- Slotdybde: **120 mm** (plass til telefon med deksel)
- Skillevegg-tykkelse: **3 mm** (MDF)
- Elektronikkbase høyde: **60 mm**

**Beregning (korrigert):**
```
Indre bredde:     654 - 2×3 = 648 mm
5 slotter:        5 × 125 = 625 mm
4 skillevegger:   4 × 3 = 12 mm
Frontlist:        2 × 5 = 10 mm (for LED-diffuser)
Totalt:           625 + 12 + 10 = 647 mm ✓
```

**Telefonstøtte (VIKTIG):**
Telefonene må ha støtte for å stå oppreist. To alternativer:

**Alt A: Skrå bunn (15°)**
```
Side-visning av slot:
        ┌───────────────┐
        │               │
        │    📱        │  ← Telefon lener mot bakvegg
        │   /          │
        │  /           │
        └─/────────────┘
         ↑
      15° vinkel på bunnen
```

**Alt B: Støttelist**
```
        ┌───────────────┐
        │               │
        │    📱        │
        │    │          │
        │   ═══         │  ← 10mm list telefonen hviler på
        └───────────────┘
```

---

## Elektronikkbase (skjult under slottene)

Elektronikkbasen er **60 mm høy** og har indre mål på ca. **648 × 134 mm**.

**Plassering av komponenter:**
```
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│   ┌──────────────────┐   ┌──────────┐   ┌──────────────────────┐ │
│   │    Breadboard    │   │  USB-hub │   │   Kabler og          │ │
│   │    165 × 54 mm   │   │ ~100×30  │   │   tilkobling         │ │
│   │    + ESP32       │   │ (valgfri)│   │                      │ │
│   └──────────────────┘   └──────────┘   └──────────────────────┘ │
│                                                                   │
│   [  Kabelhull 1  ] [  Kabelhull 2  ] ... [  Kabelhull 5  ]      │
│         ↓               ↓                       ↓                │
└───────────────────────────────────────────────────────────────────┘
          til slot 1      til slot 2            til slot 5
```

**Kabelhull (5 stk):**
- Diameter: **15 mm**
- Plassering: Ett hull under hver slot for sensorkabler
- Fra base til slot: Sensor-kablene (VCC, GND, OUT) føres gjennom

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

| Slot | GPIO sensor | GPIO LED | Familiemedlem |
|---|---|---|---|
| 1 | 13 | 16 | Konfigureres i app |
| 2 | 14 | 17 | Konfigureres i app |
| 3 | 27 | 18 | Konfigureres i app |
| 4 | 26 | 19 | Konfigureres i app |
| 5 | 25 | 21 | Konfigureres i app |

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
- **Falske positiver (sensor utløses uten telefon):** Skru ned følsomheten (potensiometer), eller sorter innvendig i sloten slik at sensoren ikke ser åpningen
- **LED lyser ikke:** Sjekk polaritet (lang pinne = +, kort pinne = −) og at motstanden er koblet i serie
- **App kobler ikke til ESP32:** Sjekk at telefon og ESP32 er på samme WiFi-nettverk. Sjekk IP-adressen i Arduino Serial Monitor (115200 baud)
- **Kabelrot:** Fargekod kablene – rød = VCC, sort = GND, deretter en farge per slot for signalledningene
- **OLED viser ingenting:** Sjekk at `Wire.begin(32, 33)` er kalt før `display.begin()` i firmware. Sjekk også I2C-adressen – prøv `0x3C` og `0x3D` (de fleste 0.96" moduler bruker `0x3C`)
- **OLED viser feil tekst:** OLED oppdateres av ESP32 direkte og er ikke avhengig av appen. Sjekk at sensor-GPIO-statusen leses riktig i firmware

---

## Design-sjekkliste

### Fysisk design
- [ ] Like store slotter (125mm hver)
- [ ] Telefonstøtte (skråbunn 15° eller støttelist)
- [ ] LED-er bak diffusert akryl for mykt lys
- [ ] Sensorer montert i bakkant av hver slot
- [ ] Kabelhull fra hver slot til elektronikkbase
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
- [ ] MDF-plater 3mm – [Panduro](https://www.panduro.com) / [Byggmax](https://www.byggmax.no)
- [ ] Akrylplate opalhvit – [Biltema](https://www.biltema.no/bygg/platematerialer/pleksiglass/)
- [ ] Trelim – [Biltema](https://www.biltema.no/bygg/lim/trelim/)
- [ ] Maling (hvit + grønn) – [Clas Ohlson](https://www.clasohlson.com/no)

### Elektronikk-verifikasjon
- [ ] Alle komponenter passer i 60mm høy base
- [ ] Breadboard (165×54mm) + ESP32 + USB-hub = ~315mm (648mm tilgjengelig ✓)
- [ ] Sensor-kabler (10cm) når fra slot til base
- [ ] OLED-kabel (10-15cm) når fra base til frontpanel

### Før bygging
- [ ] Last ned og test firmware på breadboard
- [ ] Verifiser at alle sensorer fungerer
- [ ] Test OLED-display med riktig I2C-adresse
- [ ] Mål opp og tegn alle deler på papir først
- [ ] Lag papp-prototype av én slot for å teste telefonstørrelse
