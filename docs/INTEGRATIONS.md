# Integrasjoner & Distribusjon – Teknisk Research

Oversikt over app-distribusjon, native builds og eksterne integrasjoner for automatisk poengsamling. Oppdatert april 2026.

---

## 0. Fra Expo Go til ekte app (Development Build & Distribusjon)

**Status:** Nødvendig forutsetning for alle integrasjoner.

Expo Go er kun for prototyping. For Screen Time API, push-varsler, bakgrunnskjøring og installasjon på familiens enheter trenger vi en **custom development build** via EAS (Expo Application Services).

### Hva er forskjellen?

| | Expo Go | Development Build | Production Build |
|--|---------|-------------------|-----------------|
| Installasjon | Expo Go-app fra App Store | Egen .ipa installert direkte | Egen .ipa via TestFlight/Ad Hoc |
| Native moduler | Kun det Expo Go inkluderer | Alle, inkl. Screen Time API | Alle |
| Oppdateringer | Live reload via metro | Live reload via metro + OTA | OTA via EAS Update |
| Push-varsler | Nei | Ja | Ja |
| Bakgrunnskjøring | Nei | Ja | Ja |
| App-ikon/navn | Expo Go | "Mobilhotell" med eget ikon | "Mobilhotell" med eget ikon |

### Forutsetninger

- **Apple Developer Account** ($99/år) – kreves for å signere og installere på enheter
- **Xcode** installert på Mac (for lokal bygging)
- **EAS CLI** – `npm install -g eas-cli`
- **Developer Mode** aktivert på alle iPhones (Innstillinger → Personvern → Utviklermodus)

### Steg-for-steg: Sette opp development build

#### 1. Installer expo-dev-client
```bash
npx expo install expo-dev-client
```
Denne pakken erstatter Expo Go runtime med en egen som støtter alle native moduler.

#### 2. Logg inn på EAS
```bash
eas login
```

#### 3. Konfigurer eas.json
Opprett `eas.json` i prosjektrot:
```json
{
  "cli": {
    "version": ">= 15.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production",
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "din@apple-id.no",
        "ascAppId": "fra-app-store-connect"
      }
    }
  }
}
```

#### 4. Registrer familiens iPhones
```bash
eas device:create
```
Dette genererer en URL som åpnes på hver iPhone. Telefonen installerer en provisioning-profil som tillater installasjon av dev builds. Kan sendes til alle familiemedlemmer via SMS/iMessage.

#### 5. Generer native prosjekt
```bash
npx expo prebuild
```
Dette oppretter `ios/` og `android/`-mappene med native kode. Legg til i `.gitignore` om ønskelig, eller commit for full kontroll.

#### 6. Bygg til familiens enheter
```bash
# Bygg i skyen (enklest, krever ikke lokal Xcode)
eas build --platform ios --profile development

# ELLER bygg lokalt (raskere, krever Xcode)
eas build --platform ios --profile development --local
```
Bygget tar 5-15 minutter. Resultatet er en .ipa-fil som kan installeres direkte.

#### 7. Installer på enhetene
Etter bygging vises en QR-kode/link i terminalen. Åpne på telefonen → installer appen. Alternativt: bruk **Expo Orbit** (Mac-app) for å dra og slippe .ipa til tilkoblede enheter.

#### 8. Koble til dev server
Appen fungerer nå som Expo Go, men med alle native moduler tilgjengelig:
```bash
npx expo start --dev-client
```
Skann QR-koden fra appen (ikke fra Expo Go).

### Oppdateringer uten ny build (OTA)

For endringer i JavaScript/TypeScript (ikke native kode):
```bash
# Publiser oppdatering direkte til alle familiens enheter
eas update --branch preview --message "Fikset poengtavle-bug"
```
Appen laster ned oppdateringen automatisk neste gang den åpnes. Ingen ny build nødvendig.

For endringer i native kode (nye pakker, config-endringer):
```bash
eas build --platform ios --profile development
```
Ny build må installeres manuelt.

### Distribusjon til familien (uten App Store)

Vi trenger IKKE publisere til App Store. **Internal distribution** via EAS:

1. **Development build** – for daglig utvikling, med hot reload
2. **Preview build** – for testing av ny funksjonalitet, uten dev server
3. Alle familiemedlemmer registreres via `eas device:create`
4. Nye builds installeres via link fra EAS dashboard eller Expo Orbit

Maks 100 enheter per Apple Developer-konto (mer enn nok for en familie).

### Hva dette låser opp

Med development build kan vi bruke:
- Apple Screen Time API (FamilyControls, DeviceActivity)
- Push-varsler (expo-notifications)
- Bakgrunnskjøring (expo-background-fetch, expo-task-manager)
- Bluetooth (for fysisk mobilhotell-sensor)
- Biometrisk autentisering (Face ID/Touch ID)

### App Store-publisering (EAS Submit & Workflows)

Expo har en komplett pipeline for å gå fra kode til App Store uten å åpne Xcode eller App Store Connect manuelt.

#### Tre EAS-tjenester som dekker hele flyten

| Tjeneste | Hva den gjør | Kommando |
|----------|-------------|----------|
| **EAS Build** | Bygger .ipa (iOS) og .aab (Android) i skyen | `eas build` |
| **EAS Submit** | Sender bygget direkte til App Store / Google Play | `eas submit` |
| **EAS Update** | Pusher JS-oppdateringer OTA uten ny build | `eas update` |

#### Manuell publisering (to kommandoer)
```bash
# 1. Bygg produksjonsversjon
eas build --platform ios --profile production

# 2. Send til App Store Connect → TestFlight → Review → Publiser
eas submit --platform ios --latest
```

Bygget signeres automatisk med riktig sertifikat, lastes opp til App Store Connect, og gjøres tilgjengelig i TestFlight. Derfra kan man sende til Apple Review for publisering.

#### Automatisk pipeline (CI/CD med EAS Workflows)

Med EAS Workflows kan hele flyten automatiseres ved push til `main`. Konfigureres med en YAML-fil i prosjektet:

```yaml
# .eas/workflows/deploy.yml
name: Deploy to production
on:
  push:
    branches: [main]

jobs:
  deploy:
    steps:
      - name: Fingerprint
        uses: expo/fingerprint
      - name: Build (if needed)
        if: steps.fingerprint.outputs.changed == 'true'
        uses: expo/build
        with:
          platform: ios
          profile: production
      - name: Submit (if new build)
        if: steps.build.outputs.build_id
        uses: expo/submit
        with:
          platform: ios
          profile: production
      - name: OTA Update (if no new build needed)
        if: steps.fingerprint.outputs.changed == 'false'
        uses: expo/update
        with:
          branch: production
```

**Flyten:**
1. Push til `main`
2. **Expo Fingerprint** sjekker om native kode er endret
3. Hvis native endringer → bygg ny .ipa → send til App Store automatisk
4. Hvis kun JS/TS-endringer → send OTA-oppdatering direkte til brukerne

#### Byggehastigheter

| Type | Tid | Når |
|------|-----|-----|
| Full build | 10-20 min | Nye native pakker eller config-endringer |
| Repack | ~2 min | Ingen native endringer, gjenbruker siste build |
| OTA-oppdatering | <5 min | Kun JS/TS-endringer, brukerne får det automatisk |

#### Build-profiler i eas.json (komplett)

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": { "resourceClass": "m-medium" }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production",
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "din@apple-id.no",
        "ascAppId": "app-id-fra-app-store-connect",
        "appleTeamId": "TEAM_ID"
      }
    }
  }
}
```

| Profil | Bruk | Distribusjon |
|--------|------|-------------|
| `development` | Daglig utvikling med hot reload | Direkte til registrerte enheter |
| `preview` | Testing av ny funksjonalitet uten dev server | Direkte til registrerte enheter |
| `production` | Klar for App Store | TestFlight → App Store Review |

#### Vår strategi

**Fase 1 (nå):** Intern distribusjon via `development` og `preview` builds. Ingen App Store nødvendig.

**Fase 2 (eventuelt):** Hvis vi vil dele appen med andre familier, setter vi opp `production` build + `eas submit` + automatisk CI/CD pipeline. Alt er allerede konfigurert i `eas.json`.

**Kostnader:**
- Apple Developer Account: $99/år (kreves uansett for device builds)
- EAS Build: 30 gratis builds/mnd på free tier, $99/mnd for unlimited
- EAS Submit: Inkludert i alle planer
- EAS Update: 50k oppdateringer/mnd gratis

---

## 1. Apple Screen Time API (iOS)

**Status:** Høyeste prioritet. Dekker 80% av behovet med én integrasjon.

### Hva den gir oss
- Tid brukt per app og app-kategori (automatisk, på enhetsnivå)
- Daglige rapporter med bruksvarighet
- Terskelvarsler ("TikTok brukt > 30 min i dag")
- Mulighet til å blokkere apper (ManagedSettings)
- Pickup-frekvens og notifikasjonstellinger

### Tre rammeverk
| Rammeverk | Funksjon |
|-----------|----------|
| **FamilyControls** | Autorisasjon og app-velger (FamilyActivityPicker) |
| **ManagedSettings** | Blokkering/shielding av apper, tidsgrenser |
| **DeviceActivity** | Overvåking av bruk, rapporter, terskler |

### Arkitektur
- `DeviceActivityMonitor` Extension – bakgrunnsprosess som mottar hendelser fra iOS
- `DeviceActivityReport` Extension – henter bruksstatistikk, bygger rapporter
- Extensions kjører som separate prosesser (~15MB minnegrense)
- Data deles mellom app og extensions via App Groups
- All data behandles på enheten (personvernkrav fra Apple)

### Personvernbegrensning
Apple eksponerer ikke app-navn direkte. Apper representeres som opake "tokens" (ApplicationToken, CategoryToken). Utviklere kan:
- Vise Apple sin innebygde FamilyActivityPicker for at brukeren velger apper
- Matche tokens mot kategorier (Social, Games, Entertainment, etc.)
- IKKE lese ut "com.tiktok.app" eller lignende bundle IDs programmatisk

### Krav
- iOS 16.0+ (DeviceActivityReport krever iOS 17.4+ for full funksjonalitet)
- Barnet må være i en **Apple Family Sharing**-gruppe
- Foresatt må godkjenne appen via Family Controls
- **Family Controls entitlement** – må søkes om hos Apple (gratis, tar ~1-5 dager)
- Krever **development build** – fungerer IKKE i Expo Go
- Xcode 16.1+ for å bygge

### React Native-bibliotek
**`react-native-device-activity`** (github.com/kingstinct/react-native-device-activity)
- 145+ stars, 20+ bidragsytere, aktivt vedlikeholdt
- Siste release: v0.6.1 (feb 2026)
- Støtter Expo med custom dev client
- Gir tilgang til DeviceActivity, FamilyControls og Shielding

### Implementasjonsplan
```
1. npx expo prebuild                         (genererer ios/ og android/)
2. npm install react-native-device-activity
3. Legg til Family Controls entitlement i app.config.js
4. Søk Apple om Family Controls distribution entitlement
5. Implementer DeviceActivityMonitor extension (native Swift)
6. Implementer DeviceActivityReport extension for bruksdata
7. Bridge data til React Native via App Groups
8. Lagre i Supabase: source='screen_time_api', metadata={category, duration}
```

### Mapping til vår datamodell
```typescript
// activity_types: automatisk generert per app-kategori
{ name: "Skjermfri tid", category: "screen_free", source: "screen_time_api" }
{ name: "Sosiale medier", category: "custom", source: "screen_time_api" }

// activities: logges automatisk
{
  source: "screen_time_api",
  metadata: {
    category_token: "...",
    category_name: "Social Networking",
    total_minutes: 45,
    pickup_count: 12
  }
}
```

---

## 2. Fysisk Mobilhotell (Sensor)

**Status:** Høy prioritet. Uavhengig av Apple-godkjenning.

### Konsept
Fysisk stasjon ved inngangsdøra der mobiler "sjekkes inn". Sensor detekterer tilstedeværelse og rapporterer til Supabase.

### Hardware-alternativer
| Sensor | Fordeler | Ulemper |
|--------|----------|---------|
| **Lyssensor (LDR)** | Billig, enkel | Krever lukket rom/boks |
| **Vektsensor (load cell)** | Presis, detekterer vekt | Litt mer kompleks |
| **NFC-tag** | Enkel check-in/out | Manuelt, ikke kontinuerlig |
| **Bluetooth proximity** | Automatisk, presis | Krever BLE beacon per telefon |
| **Magnetkontakt** | Billig, pålitelig | Krever luke/dør på hotellet |

### Anbefalt: ESP32 + vektsensor
- ESP32 mikrokontroller (~50 NOK) med WiFi
- HX711 load cell amplifier + load cell (~30 NOK)
- Detekterer vektendring når telefon legges i/fjernes
- Kan skille mellom antall telefoner basert på vekt

### Dataflyt
```
ESP32 (sensor) → HTTP POST → Supabase Edge Function → activities-tabell
                                                        source: 'sensor'
```

### Edge Function (pseudokode)
```typescript
// supabase/functions/sensor-checkin/index.ts
// ESP32 kaller: POST /functions/v1/sensor-checkin
// Body: { station_id, event: "checkin"|"checkout", weight_grams }

if (event === "checkin") {
  // Opprett activity med started_at = now, ended_at = null
}
if (event === "checkout") {
  // Sett ended_at = now, beregn duration og poeng
}
```

### Mapping til vår datamodell
```typescript
{
  source: "sensor",
  activity_type: "Mobilhotell",  // points_per_minute: 1.5
  metadata: {
    station_id: "entrance-1",
    weight_grams: 195,
    sensor_type: "load_cell"
  }
}
```

---

## 3. Fortnite

**Status:** Mulig. Semi-automatisk via daglig polling.

### Tilgjengelige API-er
| API | Autentisering | Data |
|-----|--------------|------|
| **fortnite-api.com** | Gratis API-nøkkel | Stats per plattform, matches, wins, kills |
| **fortnitetracker.com** | API-nøkkel | Profil, match history, power rankings |
| **Epic Games Data API** | Ingen auth | Minutter spilt (kun for island-eiere) |

### Hva vi kan hente (fortnite-api.com)
```json
GET /v2/stats/br/v2?name={username}&accountType=epic

{
  "stats": {
    "all": {
      "overall": {
        "matches": 1247,
        "kills": 3891,
        "minutesPlayed": 28450,
        "wins": 89
      }
    }
  }
}
```

### Strategi: Daglig differanse
Fortnite gir kumulative stats. Vi beregner daglig aktivitet via differanse:
```
dag_1: minutesPlayed = 28450
dag_2: minutesPlayed = 28520
→ spilt i dag: 70 minutter
```

### Implementasjon
```
1. Bruker oppgir Epic Games-brukernavn i app
2. Supabase Edge Function kjører daglig (cron) eller on-demand
3. Henter stats fra fortnite-api.com
4. Beregner diff mot forrige lagrede verdi
5. Oppretter activity med source='fortnite_api'
```

### Mapping til vår datamodell
```typescript
{
  source: "screen_time_api",  // eller ny source: "game_api"
  activity_type: "Fortnite",  // negativ poeng? eller kun tracking
  metadata: {
    platform: "epic",
    username: "player123",
    matches_today: 5,
    minutes_played_today: 70,
    kills_today: 23,
    wins_today: 1,
    cumulative_minutes: 28520
  }
}
```

### Vurdering
- Krever at barnet oppgir brukernavn (ikke passord)
- Stats er offentlige, ingen auth nødvendig
- Kan brukes til belønning ("1 win = 10 Plugs") eller bare sporing
- Oppdateres ikke i sanntid – best med daglig polling

---

## 4. Roblox

**Status:** Begrenset. Ingen offisiell tredjeparts-API.

### Tilgjengelig data
| Endpoint | Data | Auth |
|----------|------|------|
| `presence.roblox.com/v1/presence/users` | Online-status, siste spill, lastOnline | `.ROBLOSECURITY` cookie |
| `users.roblox.com/v1/users/{id}` | Profil-info | Ingen |
| `games.roblox.com/v1/games/...` | Spillinfo | Ingen |

### Problem
- **Ingen offentlig API for spilletid**
- Presence API krever `.ROBLOSECURITY` cookie – sensitiv session-cookie som gir full kontotilgang
- Ingen OAuth-flyt for tredjeparter
- Lagring av denne cookien i en familieapp er en sikkerhetsrisiko

### Alternativ: Polling-basert estimering
```
Hvert 5. minutt:
  → Sjekk presence (online/in-game/offline)
  → Hvis in-game: akkumuler 5 min spilletid
  → Lagre estimert spilletid
```

### Vurdering
- **Anbefales IKKE** som separat integrasjon pga. sikkerhetsproblemer
- Roblox-tid fanges uansett opp av **Apple Screen Time API** (kategori: Games)
- Eventuelt: spør barnet om å logge Roblox-tid manuelt

---

## 5. YouTube

**Status:** Ikke mulig via API. Kun via Screen Time.

### Situasjon
- YouTube Data API v3 **deaktiverte watch history** i 2016
- Requests returnerer tom liste
- Ingen alternativ API for "tid brukt på YouTube"

### Alternativ: Google Takeout
- Brukeren kan eksportere watch history manuelt via takeout.google.com
- Gir JSON med videoer sett + tidspunkt (men ikke varighet sett)
- For tungvint for daglig bruk

### Vurdering
- YouTube-bruk fanges opp av **Apple Screen Time API** (kategori: Entertainment)
- Ingen grunn til egen YouTube-integrasjon
- Eventuelt: manuell logging av YouTube-tid i appen

---

## 6. Apple HealthKit / Garmin (Treningsdata)

**Status:** Høy verdi. Krever development build (allerede planlagt).

### Konsept
Hente treningsdata (steg, løping, gåturer, kalorier, søvn) fra Apple Health. Garmin-klokker synkroniserer automatisk til Apple Health via Garmin Connect-appen, så dette dekker Garmin-data uten å trenge Garmin sitt eget API.

### Hvorfor HealthKit fremfor Garmin Health API direkte?

| | Apple HealthKit | Garmin Health API |
|--|----------------|-------------------|
| **Tilgang** | Gratis, ingen godkjenning | Krever godkjenning fra Garmin Developer Program |
| **Personlige prosjekter** | Ingen begrensning | Tiltenkt "business use" – indie/hobby kan få avslag |
| **Datakilder** | Garmin + Apple Watch + iPhone + alle andre apper | Kun Garmin |
| **Databehandling** | Lokalt på enhet (personvernvennlig) | Via Garmin sine servere |
| **Dev build nødvendig** | Ja (allerede planlagt for Screen Time) | Nei (server-side), men trenger OAuth-flyt i appen |

### Dataflyt
```
Garmin-klokke → Garmin Connect-app → Apple Health → HealthKit API → Mobilhotell-appen
                                                                      ↓
                                                               Supabase (activities)
                                                               source: 'healthkit'
```

### React Native-biblioteker

| Bibliotek | Beskrivelse |
|-----------|-------------|
| **`expo-healthkit-module`** | Expo-modul, støtter iOS HealthKit + Android Health Connect. Steg, puls, kalorier, søvn, treningsøkter. |
| **`@kingstinct/react-native-healthkit`** | TypeScript-first, omfattende HealthKit-API, 500+ stars, aktivt vedlikeholdt. |
| **`expo-health-kit`** | Enkel Expo-modul fokusert på steg-data. |

### Tilgjengelige data
- **Steg** (daglig, per time)
- **Treningsøkter** (type, varighet, distanse, kalorier)
- **Puls** (hvilepuls, gjennomsnitt, maks)
- **Søvn** (varighet, faser)
- **Kalorier** (forbrukt, aktivt)
- **Distanse** (gåing, løping)

### Krav
- Development build (kreves allerede for Screen Time API)
- Fysisk enhet (HealthKit fungerer ikke i simulator)
- Bruker må godkjenne tilgang til helse-data i appen
- `NSHealthShareUsageDescription` i Info.plist

### Implementasjonsplan
```
1. npm install @kingstinct/react-native-healthkit (eller expo-healthkit-module)
2. Legg til HealthKit capability i app.config.js
3. Implementer permission-flyt (be om tilgang til steg, treningsøkter, søvn)
4. Hent daglige steg og treningsøkter
5. Synk til Supabase: source='healthkit', metadata={type, duration, steps, ...}
6. Opprett automatiske quests: "8000 steg i dag", "3 treningsøkter denne uken"
```

### Mapping til vår datamodell
```typescript
// activity_types
{ name: "Gåtur", category: "exercise", source: "healthkit" }
{ name: "Løping", category: "exercise", source: "healthkit" }
{ name: "Daglige steg", category: "exercise", source: "healthkit" }

// activities
{
  source: "healthkit",
  activity_type: "Gåtur",
  metadata: {
    workout_type: "walking",
    duration_minutes: 45,
    distance_km: 3.2,
    calories: 210,
    steps: 4800,
    source_device: "Garmin Venu"
  }
}
```

### Poenggivning
- **X Mana per 1000 steg** (daglig, automatisk)
- **Bonus-Mana for treningsøkter** over en viss varighet
- **Quest:** "Gå 8000 steg i dag" / "Tren 3 ganger denne uken"
- **Streak:** "5 dager på rad med 6000+ steg"

### Vurdering
- Svært god integrasjon – fullautomatisk, ingen manuell logging
- Dekker alle treningskilder, ikke bare Garmin
- Krever dev build som allerede er planlagt
- Personvernvennlig – all data behandles på enheten
- Naturlig utvidelse av "belønne gode vaner"-konseptet

---

## 7. Leseaktivitet (Open Library API + Goodreads RSS)

**Status:** Mulig. Lav kompleksitet. Krever IKKE development build.

### Konsept
Kombinere **Open Library API** for boksøk og metadata med **Goodreads RSS** for bokhylle-synk og **manuell lesetid-logging** i appen. Brukeren søker opp en bok, får automatisk tittel, forfatter, omslag og sideantall – og logger deretter lesetid med en timer.

### Open Library API (bokdata og søk)

**Helt gratis, ingen autentisering, åpen kildekode.** Drevet av Internet Archive.

#### Søk etter bøker
```
GET https://openlibrary.org/search.json?q=harry+potter&fields=key,title,author_name,first_publish_year,number_of_pages_median,cover_i,isbn&limit=10
```

Respons (forenklet):
```json
{
  "numFound": 585,
  "docs": [
    {
      "key": "/works/OL82563W",
      "title": "Harry Potter and the Philosopher's Stone",
      "author_name": ["J. K. Rowling"],
      "first_publish_year": 1997,
      "number_of_pages_median": 309,
      "cover_i": 10521270,
      "isbn": ["9780747532743", "0747532745"]
    }
  ]
}
```

#### Hente bokomslag
```
https://covers.openlibrary.org/b/id/{cover_i}-M.jpg     (via cover ID)
https://covers.openlibrary.org/b/isbn/{isbn}-M.jpg       (via ISBN)
```
Størrelser: `S` (liten), `M` (medium), `L` (stor).

#### Hente detaljert bokinfo
```
GET https://openlibrary.org/works/OL82563W.json
```
Gir beskrivelse, emner, relaterte verk m.m.

#### API-egenskaper

| Egenskap | Detalj |
|----------|--------|
| **Pris** | Gratis |
| **Autentisering** | Ingen (identifiser med `User-Agent` for bedre rate limits) |
| **Rate limit** | 1 req/sek (uidentifisert), 3 req/sek (med `User-Agent` + e-post) |
| **Dataformat** | JSON, YAML, RDF/XML |
| **Dekning** | 20M+ bøker, de fleste med sideantall og omslag |

#### Hva vi bruker fra Open Library

| Felt | Bruk i appen |
|------|-------------|
| `title` | Vis boktittel |
| `author_name` | Vis forfatter |
| `cover_i` / `isbn` | Hente bokomslag-bilde |
| `number_of_pages_median` | Beregne sidefremdrift og bonus for fullført bok |
| `first_publish_year` | Vis i bokinfo |
| `key` (work ID) | Unik identifikator for å lagre i vår DB |
| `subject` | Kan brukes til quests: "Les en fantasy-bok" |

### Amazon Kindle API (ikke tilgjengelig)

Amazon har **ingen offentlig API** for Kindle-lesedata. Whispersync samler inn detaljert leseposisjon og tid, men deler det ikke med tredjeparter. De fjernet til og med Kindle-til-Goodreads-synkronisering i 2024. GDPR/CCPA-eksport inkluderer heller ikke lesefremdrift. EU sin Digital Markets Act kan tvinge endring på sikt, men foreløpig er det helt lukket.

### Goodreads RSS (bokhylle-synk)

Goodreads la ned sitt offisielle API i **desember 2020**, men RSS-feeds per hylle fungerer fortsatt:
```
https://www.goodreads.com/review/list_rss/{PROFILE_ID}?key={RSS_KEY}&shelf=currently-reading
https://www.goodreads.com/review/list_rss/{PROFILE_ID}?key={RSS_KEY}&shelf=read
```

**Hva man kan hente:** Tittel, forfatter, bokomslag, dato lagt til, rating.
**Hva man IKKE kan hente:** Sidefremdrift, lesetid, daglig lesing.

RSS-nøkkelen er unik per bruker og finnes på Goodreads under profil → "RSS feed"-lenken. Maks 100 elementer per feed.

**Goodreads er valgfritt** – appen fungerer helt fint uten, da brukeren kan søke opp bøker direkte via Open Library.

### Anbefalt strategi

**Kjerne (krever ingen external accounts):**
1. **Boksøk via Open Library** – bruker søker opp boken, får tittel, forfatter, omslag og sideantall automatisk
2. **Lesetid-timer i appen** – bruker trykker "Les" og stopper når ferdig, eller logger minutter manuelt
3. **Sidefremdrift** – bruker oppdaterer "lest til side X av Y" (Y fra Open Library)
4. **Fullført bok** – når fremdrift = 100%, gi bonus-Mana

**Valgfritt tillegg (Goodreads-kobling):**
5. **Daglig RSS-polling** – Supabase Edge Function sjekker "read"-hyllen
6. **Auto-deteksjon av fullført bok** – ny bok på "read" → bonus-Mana

### Dataflyt
```
Bruker søker bok i appen
        ↓
Open Library API → tittel, forfatter, omslag, sideantall
        ↓
Lagre som "reading_books" i Supabase
        ↓
Bruker logger lesetid (timer/manuelt) → activities (source: 'manual')
Bruker oppdaterer sidefremdrift       → reading_books.current_page
        ↓
Fullført (current_page >= total_pages) → bonus-activity (source: 'app_auto')

(Valgfritt: Goodreads RSS → Edge Function → detekter fullførte bøker)
```

### Implementasjonsplan
```
1. Lag boksøk-komponent som kaller Open Library Search API
2. Vis søkeresultater med omslag, tittel, forfatter, sideantall
3. "Legg til bok" → lagre i reading_books-tabell med Open Library work ID
4. Lesetid-timer (start/stopp) eller manuell minutt-logging
5. Sidefremdrift-slider/input (side X av Y)
6. Automatisk "Fullført bok"-activity når fremdrift = 100%
7. (Valgfritt) Goodreads RSS-synk via Edge Function for auto-deteksjon
```

### Ny tabell: reading_books
```sql
create table reading_books (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  author text,
  cover_url text,
  total_pages integer,
  current_page integer default 0,
  status text not null default 'reading',  -- 'reading', 'finished', 'dropped'
  open_library_key text,                   -- '/works/OL82563W'
  isbn text,
  goodreads_id text,
  started_at timestamp with time zone default now(),
  finished_at timestamp with time zone,
  total_minutes_read integer default 0,    -- akkumulert fra activities
  created_at timestamp with time zone default now()
);
```

### Mapping til vår datamodell
```typescript
// activity_types
{ name: "Lesing", category: "reading", source: "manual", points_per_minute: 1.0 }
{ name: "Fullført bok", category: "reading", source: "app_auto" }

// activities: leseøkt (timer eller manuell)
{
  source: "manual",
  activity_type: "Lesing",
  metadata: {
    reading_book_id: "uuid-...",
    book_title: "Harry Potter og Ildbegeret",
    book_author: "J.K. Rowling",
    open_library_key: "/works/OL82563W",
    minutes_read: 30,
    pages_read: 25,             // fra side 120 til 145
    page_from: 120,
    page_to: 145
  }
}

// activities: automatisk fullført-bok-bonus
{
  source: "app_auto",           // appen genererer selv når fremdrift = 100%
  activity_type: "Fullført bok",
  metadata: {
    reading_book_id: "uuid-...",
    book_title: "Harry Potter og Ildbegeret",
    book_author: "J.K. Rowling",
    total_pages: 636,
    total_minutes_read: 840,
    days_to_finish: 14
  }
}
```

### Poenggivning
- **X Mana per minutt lest** (manuell logging/timer)
- **Bonus-Mana per 50 sider** (fremdriftsbelønning)
- **Stor Mana-bonus for fullført bok** (skalert etter sideantall fra Open Library)
- **Quest:** "Les 30 minutter i dag" / "Fullfør en bok denne uken"
- **Quest:** "Les en bok med 300+ sider" (mulig takket være sideantall-data)
- **Streak:** "Lest noe 3 dager på rad"
- **Ekstra bonus for tykke bøker** (sideantall fra Open Library gjør dette mulig)

### Vurdering
- **Open Library er ideell** – gratis, ingen auth, gir sideantall og omslag
- Sideantall muliggjør fremdriftssporing og skalert belønning
- Krever IKKE development build (alt er REST API + manuell logging)
- Fungerer helt uavhengig av Goodreads (men kan kombineres)
- Goodreads RSS er valgfritt tillegg for de som bruker det
- Passer utmerket inn i "belønne gode vaner"-konseptet
- Lav risiko – Open Library er drevet av Internet Archive, en ideell organisasjon

---

## Prioritert implementeringsrekkefølge

### Fase 1.5 (nå – forutsetning for alt annet)
1. **Development build** – `npx expo install expo-dev-client` + `eas build`
2. **Registrer familiens enheter** – `eas device:create` for alle iPhones
3. **Sett opp OTA-oppdateringer** – `eas update` for sømløse oppdateringer

### Fase 2 (automatisk sporing)
4. **Apple Screen Time API** – dekker TikTok, CapCut, YouTube, Roblox, Fortnite og alle andre apper automatisk
5. **Fysisk mobilhotell** – ESP32 + sensor, uavhengig av Apple
6. **Push-varsler** – påminnelser og oppmuntring

### Fase 3 (positive vaner)
7. **Apple HealthKit / Garmin** – automatisk steg, treningsøkter, søvn. Krever allerede dev build.
8. **Goodreads / Lesing** – semi-automatisk via RSS + manuell lesetid-logging. Krever IKKE dev build.

### Fase 4 (spillintegrasjoner)
9. **Fortnite stats** – bonus-data (matches, wins, kills) utover ren skjermtid
10. **Ny source-type i DB** – `game_api` for spillspesifikke stats

### Fase 5 (vurderes)
11. **Roblox** – kun hvis de åpner et offisielt tredjeparts-API
12. **Andre spill** – Minecraft, etc. (avhenger av tilgjengelige API-er)

### Ikke prioritert
- YouTube (dekkes av Screen Time)
- Roblox spilletid (dekkes av Screen Time, eget API for risikabelt)

---

## Database-utvidelser som trengs

### Ny source-verdi
Nåværende `source` check constraint: `('manual', 'sensor', 'screen_time_api')`

Utvides til:
```sql
alter table activities drop constraint activities_source_check;
alter table activities add constraint activities_source_check
  check (source in ('manual', 'sensor', 'screen_time_api', 'game_api', 'healthkit', 'goodreads_rss', 'app_auto'));
```

### Ny tabell: reading_books
```sql
create table reading_books (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  author text,
  cover_url text,                          -- fra Open Library Covers API
  total_pages integer,                     -- fra Open Library (number_of_pages_median)
  current_page integer default 0,
  status text not null default 'reading',  -- 'reading', 'finished', 'dropped'
  open_library_key text,                   -- '/works/OL82563W'
  isbn text,
  goodreads_id text,
  started_at timestamp with time zone default now(),
  finished_at timestamp with time zone,
  total_minutes_read integer default 0,    -- akkumulert fra activities
  created_at timestamp with time zone default now()
);
```

### Ny tabell: connected_accounts
```sql
create table connected_accounts (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  platform text not null,  -- 'fortnite', 'roblox', 'apple_screen_time', 'garmin_healthkit', 'goodreads'
  external_username text,
  external_id text,
  is_active boolean default true,
  last_synced_at timestamp with time zone,
  metadata jsonb,          -- lagre siste kjente stats for diff-beregning
  created_at timestamp with time zone default now()
);
```

### Ny tabell: sync_logs
```sql
create table sync_logs (
  id uuid primary key default uuid_generate_v4(),
  connected_account_id uuid references connected_accounts(id),
  synced_at timestamp with time zone default now(),
  status text not null,    -- 'success', 'error'
  data_snapshot jsonb,     -- rå data fra API
  error_message text
);
```
