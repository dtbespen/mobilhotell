# Mobilhotell – Fysisk Design med BuildCAD AI

Denne guiden hjelper deg med å designe "The Unplugger 3000" i BuildCAD AI via Cursor.

---

## Oppsett

1. **Opprett gratis konto:** [buildcad.ai](https://buildcad.ai/auth/login)
2. **Restart Cursor** for å laste MCP-serveren
3. **Test tilkoblingen:** Spør Claude: "List my BuildCAD designs"

---

## Parametriske mål (juster etter behov)

```yaml
# Hovedmål
total_width: 650mm       # Totalbredde
total_height: 220mm      # Totalhøyde (inkl. base)
total_depth: 200mm       # Totaldybde

# Slotter (5 stk)
slot_width: 120mm        # Bredde per slot
slot_height: 180mm       # Høyde (for telefon)
slot_depth: 25mm         # Dybde
slot_spacing: 10mm       # Mellomrom mellom slotter

# Elektronikkbase
base_height: 60mm        # Høyde på skjult base
base_clearance: 20mm     # Plass til kabler bak

# Komponenter
led_hole_diameter: 3mm   # Hull for LED
sensor_mount_width: 20mm # IR-sensor monteringspunkt
sensor_mount_depth: 15mm
cable_channel_width: 10mm
```

---

## BuildCAD-prompts for mobilhotellet

### Steg 1: Hovedkabinett

```
Create a rectangular box enclosure with these dimensions:
- Width: 650mm
- Height: 220mm  
- Depth: 200mm
- Wall thickness: 4mm
- Open front
- Hollow interior

The enclosure should have a removable back panel for cable access.
```

### Steg 2: Interne skillevegger (5 slotter)

```
Inside my enclosure, add 4 vertical divider walls to create 5 equal slots:
- Divider height: 180mm (leaving 40mm at bottom for base)
- Divider thickness: 4mm
- Divider depth: 150mm (leaving 50mm at back for cables)
- Space the dividers evenly to create 5 slots of ~120mm width each
```

### Steg 3: Elektronikkbase

```
Add a horizontal shelf 60mm from the bottom of the enclosure:
- Full width and depth
- 4mm thick
- With 5 cable routing holes (15mm diameter) positioned at the back of each slot
This creates a hidden compartment for the ESP32 and wiring.
```

### Steg 4: LED-hull

```
Add 5 small holes (3mm diameter) on the front face:
- Position each hole 10mm above the top of each slot
- Center each hole horizontally in its slot
These are for status LEDs.
```

### Steg 5: Sensor-monteringspunkter

```
At the back of each slot, add a small mounting bracket:
- 20mm x 15mm rectangular platform
- 2mm thick
- With 2 screw holes (3mm diameter) for mounting IR sensors
Position each bracket at the bottom-back corner of each slot.
```

### Steg 6: Navneskilt-spor

```
On the front face, below each slot opening, add a recessed area:
- 80mm wide x 20mm tall x 2mm deep
- Centered under each slot
These will hold printed name labels.
```

---

## Eksport og produksjon

### For laserkutting (anbefalt for MDF/akryl)

```
Export my design as DXF with these flat pattern cuts:
- Front panel
- Back panel  
- Top panel
- Bottom panel
- 2x side panels
- 4x divider walls
- 1x internal shelf

Include finger joints for assembly.
```

### For 3D-printing (enkeltdeler)

```
Export these components as separate STL files:
- IR sensor mounting brackets (x5)
- LED light pipes (x5)
- Name plate holders (x5)
- Cable management clips (x10)
```

---

## Materialer

| Del | Materiale | Tykkelse | Kilde |
|-----|-----------|----------|-------|
| Hovedpaneler | MDF | 4mm | Clas Ohlson |
| Skillevegger | MDF | 4mm | Clas Ohlson |
| Sensorholdere | PLA (3D-print) | - | Makerspace |
| LED-rør | Klar akryl | 3mm | Clas Ohlson |

---

## Malingsskjema (Unplug-farger)

```
Utside: Hvit matt (#FFFFFF)
Innside slotter: Unplug Green (#2DC653)
Tekst/logo: Unplug Dark (#1A1A2E)
LED-aksentfarge: Unplug Yellow (#FFD93D)
```

---

## Tips for BuildCAD

1. **Start enkelt** – få hovedformen riktig først
2. **Iterer med tekst** – "Make the walls thicker" / "Add chamfered edges"
3. **Bruk preview** – "Show me a preview of my design"
4. **Eksporter tidlig** – test i Fusion 360 eller FreeCAD før produksjon

---

## Neste steg

1. [ ] Opprett BuildCAD-konto
2. [ ] Restart Cursor
3. [ ] Design hovedkabinettet
4. [ ] Legg til slotter og skillevegger
5. [ ] Eksporter DXF for laserkutting
6. [ ] Bestill MDF fra Clas Ohlson
7. [ ] Finn makerspace med laserkutter (f.eks. Bitraf i Oslo)
