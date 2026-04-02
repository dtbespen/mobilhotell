# Mobilhotell / Unplug – Appbeskrivelse

## Hva er appen?

En familieapp for å motivere til positiv mobil- og skjermbruk. Familiemedlemmer samler poeng ("Plugs") ved å gjøre aktiviteter som skjermfri tid, lese bøker, lytte til lydbøker, eller lage ting. Foreldre administrerer aktivitetstyper og ser alles fremgang. Barna ser sine egne og familiens poeng på en poengtavle.

Appen er kun for intern bruk i familien – ingen skalering nødvendig.

---

## Kjernefunksjoner (Fase 1 – implementert)

### Brukerhåndtering
- Registrering med e-post og passord via Supabase Auth
- Første bruker oppretter en familie og får en 6-tegns invitasjonskode
- Andre familiemedlemmer registrerer seg og skriver inn invitasjonskoden
- Roller: **forelder** (admin) eller **barn**
- Auth-tilstand sjekkes i root layout, med automatisk redirect

### Dashboard
- Personlig velkomst med navn og familienavn
- Poengoversikt: i dag, denne uken, streak
- Progressbar mot neste nivå (per 1000 poeng)
- Indikator for pågående aktivitet
- Liste over siste 5 fullførte aktiviteter

### Aktivitetslogging
- **Timer-modus:** Start/stopp en aktivitet med live nedtelling og estimerte poeng
- **Manuell logging:** Legg inn antall minutter for en aktivitet i etterkant
- Poeng beregnes automatisk basert på aktivitetstype × varighet

### Poengtavle (Leaderboard)
- Rangert liste over familiemedlemmer
- Filtrerbar periode: i dag / denne uken / totalt
- Medaljer for topp 3 (🥇🥈🥉)
- Realtime-oppdateringer via Supabase

### Admin-panel (kun foreldre)
- Familieinnstillinger med invitasjonskode
- Oversikt over alle familiemedlemmer
- Administrer aktivitetstyper: legg til, slett egendefinerte typer
- Juster poeng per minutt per aktivitetstype

---

## Poengalgoritme

Hver aktivitetstype har en konfigurerbar `points_per_minute`-verdi:

| Aktivitet | Poeng/minutt | Kategori |
|-----------|-------------|----------|
| Skjermfri tid | 1.0 | screen_free |
| Lese bok | 2.0 | reading |
| Lydbok | 2.0 | reading |
| Lage ting | 2.0 | creating |
| Mobilhotell (sensor) | 1.5 | screen_free |

Standardaktivitetene seedes automatisk via en database-trigger når en familie opprettes. Foreldre kan legge til egne aktivitetstyper og justere poengverdier.

Formel: `poeng = avrundet(minutter × poeng_per_minutt)`

---

## Tech Stack

| Lag | Teknologi |
|-----|-----------|
| Frontend | React Native / Expo SDK 54 |
| Routing | Expo Router v6 (fil-basert) |
| Styling | NativeWind v4 (Tailwind CSS for RN) |
| Backend | Supabase (PostgreSQL, Auth, Realtime) |
| State | React Context + hooks |
| Språk | TypeScript (strict mode) |

### Viktige pakker
- `@supabase/supabase-js` – database og auth
- `@react-native-async-storage/async-storage` – lokal token-lagring
- `expo-secure-store` – sikker lagring av sensitiv data
- `nativewind` – Tailwind CSS i React Native
- `react-native-reanimated` – animasjoner
- `react-native-safe-area-context` – safe area insets

---

## Prosjektstruktur

```
app/
  _layout.tsx           Root layout med AuthProvider
  index.tsx             Smart redirect basert på auth-tilstand
  (auth)/
    _layout.tsx         Auth-stack
    login.tsx           Innlogging
    register.tsx        Registrering
    join.tsx            Opprett/bli med i familie
  (tabs)/
    _layout.tsx         Tab-navigasjon (4 tabs)
    index.tsx           Dashboard
    activities.tsx      Aktivitetslogging med timer
    leaderboard.tsx     Poengtavle
    profile.tsx         Min profil
  (admin)/
    _layout.tsx         Admin-stack (kun foreldre)
    settings.tsx        Familieinnstillinger
    activity-types.tsx  Administrer aktivitetstyper

lib/
  supabase.ts           Supabase-klient
  auth.tsx              AuthProvider / useAuth
  points.ts             Poengberegning og formatering
  database.types.ts     TypeScript-typer for databasen

hooks/
  useActivities.ts      CRUD + realtime for aktiviteter
  useActivityTypes.ts   CRUD for aktivitetstyper
  usePoints.ts          Poengoversikt med realtime
  useFamily.ts          Familiemedlemmer

supabase/
  schema.sql            Komplett database-skjema
  fix-rls.sql           RLS-policies med security definer
  fix-trigger.sql       Trigger for å seede standardaktiviteter
```

---

## Database (Supabase PostgreSQL)

### Tabeller
- **families** – familier med invitasjonskode
- **profiles** – brukerprofiler koblet til auth.users
- **activity_types** – definisjoner av aktiviteter (poeng/min, kategori, ikon)
- **activities** – loggede aktiviteter med start/slutt, varighet, poeng og kilde
- **blocked_apps** – blokkerte apper (fremtidig bruk)
- **rewards** – belønninger/premier (fremtidig bruk)

### Sikkerhet (RLS)
- Alle tabeller har Row Level Security aktivert
- `get_my_family_id()` – security definer-funksjon som unngår rekursiv RLS
- Brukere kan kun se data innenfor sin egen familie
- Foreldre har admin-rettigheter for aktivitetstyper, blokkerte apper og belønninger

---

## Fremtidige faser

### Fase 2 – Fysisk mobilhotell
- Lyssensor eller lignende koblet til en fysisk "mobilhotell"-stasjon ved inngangsdøra
- ESP32/Arduino med WiFi sender data til Supabase
- `source: 'sensor'` i activities-tabellen
- Automatisk poengsamling basert på tid i hotellet

### Fase 3 – iOS Screen Time API
- Integrasjon via `react-native-device-activity`
- Krever development build (ikke Expo Go)
- Automatisk sporing av skjermfri tid og app-bruk
- `source: 'screen_time_api'` i activities-tabellen

### Fase 4 – Integrasjoner
- Roblox, YouTube, og andre plattformer
- Nye `activity_types` med API-integrasjoner
- `metadata`-feltet (jsonb) lagrer plattformspesifikk data

### Fase 5 – Belønningssystem
- Rewards-tabellen er allerede definert
- Foreldre definerer premier med poengkostnad
- Barn kan "kjøpe" premier med opptjente Plugs

### Fase 6 – Brand & UX
- Implementere Unplug-branding fra BRAND.md
- Rename "poeng" til "Plugs" gjennom hele appen
- Inter-font, fargepalett, konfetti-animasjoner
- Push-varsler med leken tone of voice

---

## Oppsett for nye utviklere

1. `npm install`
2. Kopier `.env.example` til `.env` og fyll inn Supabase-nøkler
3. Kjør `supabase/schema.sql` → `fix-rls.sql` → `fix-trigger.sql` i Supabase SQL Editor
4. `npm start` – åpne i Expo Go
