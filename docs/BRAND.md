# Unplug – Brand Guidelines

## Kjerneidentitet

**Tagline:** "Unplug. Level up."

**Verdier:**
- Fun – appen skal føles som et spill, ikke en plikt
- Together – guildet (familien) gjør det sammen
- Rewarding – det lønner seg å legge vekk telefonen

**Tone of voice:**
- Eventyrlig og oppmuntrende – "Din magi vokser!" aldri straffende
- Kort og direkte – korte setninger, enkle ord (målgruppe: 10-åringer)
- Spill-inspirert – RPG-termer: quest, guild, mana, loot, boss, rank

---

## Logo

**Konsept:** Pixel-art støpsel med magisk glow – symboliserer å koble fra.

**Bruk:**
- Ikon-versjon (pixel-støpsel med glow) – app-ikon, splash screen
- Ordmerke-versjon ("Unplug" i Press Start 2P + pixel-støpsel) – onboarding, about

---

## Visuell stil

**Estetikk:** Pixel art / retro RPG med dark fantasy-tema.

- Alt UI er mørk modus – ingen lys modus
- Pixel-font (Press Start 2P) for overskrifter, tall og game-elementer
- System-font (Inter) for brødtekst og etiketter
- Tydelige borders og kanter i stedet for myke skygger
- Fargekodede rarity-rammer rundt items
- Sprite-baserte karakterer og bosser med idle-animasjoner

---

## Fargepalett

Alle farger er autoritative – brukes identisk i `constants/Colors.ts` og `tailwind.config.js`.

### Primære farger

| Navn | Hex | Token | Bruk |
|------|-----|-------|------|
| Mana Green | `#00cc52` | primary-500 | Mana, leveling, CTA-knapper, positive actions |
| Loot Gold | `#ffba24` | accent-500 | XP, sjeldne items, boss loot |
| Boss Red | `#ff5c4d` | danger-500 | Boss HP, streak-tap, varsler |
| Mystic Purple | `#7b61ff` | info-500 | Abilities, spesialeffekter, epic items |

### Bakgrunn og flater

| Navn | Hex | Token | Bruk |
|------|-----|-------|------|
| Dungeon Dark | `#16191d` | dark-300 | Primær bakgrunn |
| Stone Dark | `#1c1f24` | dark-200 | Kort, paneler |
| Shadow Dark | `#22252b` | dark-100 | Inputs, sekundære flater |
| Ash Grey | `#2a2d35` | dark-50 | Borders, subtile skillelinjer |
| Void Black | `#121417` | dark-400 | Dypeste bakgrunn |
| Abyss Black | `#0e1012` | dark-500 | Tab bar, statusbar |

### Tekst og ikoner

| Bruk | Farge |
|------|-------|
| Primær tekst | `#ffffff` |
| Sekundær tekst | `rgba(255,255,255,0.6)` |
| Muted tekst / placeholders | `#555a62` |
| Disabled | `rgba(255,255,255,0.25)` |

### Rarity-farger (items og borders)

| Rarity | Farge | Hex |
|--------|-------|-----|
| Common | Hvit/grå | `#9ca3af` |
| Uncommon | Mana Green | `#00cc52` |
| Rare | Sky Blue | `#457BFF` |
| Epic | Mystic Purple | `#7b61ff` |
| Legendary | Loot Gold | `#ffba24` (med glow) |

---

## Typografi

### Fonter

| Font | Bruk |
|------|------|
| Press Start 2P | Overskrifter, tall (mana, level, damage), game-elementer |
| Inter | Brødtekst, etiketter, knapper, beskrivelser |

### Størrelser

Tilpasset 10-åringer (litt større enn standard):

| Bruk | Font | Vekt | Størrelse |
|------|------|------|-----------|
| Overskrifter | Press Start 2P | 400 | 20–24px |
| Tall/stats | Press Start 2P | 400 | 16–20px |
| Underoverskrifter | Inter | SemiBold 600 | 18–20px |
| Brødtekst | Inter | Regular 400 | 16–17px |
| Etiketter / knapper | Inter | Medium 500 | 14–16px |
| Liten tekst | Inter | Regular 400 | 12–13px |

**NativeWind-klasser:** `font-pixel` (Press Start 2P), `font-body` (Inter)

---

## Terminologi

Spill-språk brukes konsekvent i hele appen:

| Gammel term | Ny term | Kontekst |
|-------------|---------|----------|
| Plugs | Mana | Poengvaluta – "Du har 120 Mana" |
| Aktiviteter | Quests | "Fullfør en quest for å tjene mana" |
| Familie | Guild | "Ditt guild samarbeider mot bossen" |
| Familiekode | Guild Code | "Del din Guild Code" |
| Ledertavle | Guild Hall | "Se rankingen i Guild Hall" |
| Profil | Character Sheet | "Se din helt på Character Sheet" |
| Innstillinger | Guild Master | "Kun foreldre (Guild Masters) har tilgang" |
| Level (overordnet) | Rank | "Din Rank er Adept" |
| Level (numerisk) | Level | "Du er Level 14" |
| Streak | Power Streak | "Power Streak: 7 dager!" |

### Valuta

- **Mana** er den primære valutaen – tjenes ved å være offline / fullføre quests
- **Ikon:** Mana-dråpe i Mana Green, eller pixel-lightning i Loot Gold
- **Språk:** "Du har 120 Mana" / "Tjen 50 Mana på 1 time"
- **Aldri:** "poeng", "coins"

---

## Meldingsstil (push / in-app)

Eventyrlig, oppmuntrende tone på norsk:

**Quest start:**
> "Oppdraget har begynt. Samle mana, helt!"

**Quest fullført:**
> "Quest fullført! +60 Mana. Magien din vokser!"

**Level up:**
> "LEVEL UP! Du er nå en Adept. Ny evne låst opp!"

**Boss defeated:**
> "BOSS BESEIRET! Skjermtrollet falt! Åpne din loot-kiste!"

**Påminnelse:**
> "Guildet trenger din hjelp! Bossen har 2000 HP igjen."

**Power Streak:**
> "Power Streak: 7 dager! Magien din er ustoppelig!"

---

## Belønningsestetikk

- Lottie-animasjon ved level-up (konfetti + sparkles)
- Lottie-animasjon ved loot reveal (kiste som åpnes)
- Lottie-animasjon ved boss defeated (eksplosjon + feiring)
- Gul glow-effekt (Loot Gold) rundt Mana-teller når den øker
- Skia partikler for mana-strøm under aktiv quest
- Damage-tall som svever opp ved boss-bidrag (Reanimated)
- Rarity-glow rundt sjeldne items

---

## Karakterklasser

Fire spillbare klasser med unik identitet:

| Klasse | Farge-assosiasjon | Personlighet |
|--------|-------------------|--------------|
| Wizard | Mystic Purple | Allsidig, magisk, mystisk |
| Knight | Boss Red | Sterk, modig, beskyttende |
| Druid | Mana Green | Naturlig, helbredende, støttende |
| Rogue | Loot Gold | Snik, heldig, skattejeger |

---

## Hva vi ikke er

- Ikke moraliserende – "Din magi vokser!" aldri "Du bruker for mye tid på telefon"
- Ikke komplisert – intuitiv for 10-åringer, ingen lange tutorials
- Ikke kjedelig – alltid noe å oppnå, låse opp, slåss mot
- Ikke et action-spill – RPG der TÅLMODIGHET (offline-tid) er superkraften
- Ikke pay-to-win – alle items kan oppnås gjennom spilling
