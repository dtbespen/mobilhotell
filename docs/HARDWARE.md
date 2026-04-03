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

### Til kasettet (fysisk mobilhotell)

| # | Komponent | Lenke | Estimert pris |
|---|---|---|---|
| 10 | MDF-plate 3–4 mm eller kryssfiner | [Clas Ohlson](https://www.clasohlson.com/no/MDF-plates/c/5308) | ~70 kr |
| 11 | Akrylmaling – hvit + grønn (#2DC653) | [Clas Ohlson](https://www.clasohlson.com/no/paint-accessories/c/5317) | ~50 kr |
| 12 | Trelim | Clas Ohlson / Biltema | ~40 kr |

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

### LED-montering

En 3 mm LED monteres i et lite hull bohret i fronten av mobilhotellet,
rett over eller ved siden av åpningen til sloten. Lyser grønt når telefonen er inne.

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

### Kasettet (mål for 5 slotter)

- Totalbredde: ca. 65 cm
- Høyde: ca. 22 cm
- Dybde: ca. 14 cm
- Slotbredde per plass: ca. 11 cm
- Slotdybde: ca. 12 cm (nok til de fleste telefoner med deksel)
- Skillevegg-tykkelse: ca. 4 mm (MDF)
- Basen (der elektronikken skjules): ca. 6 cm høy

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
