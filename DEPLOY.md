# Utrulling – Unplug Quests

## Har du endret JS/TypeScript? → OTA-oppdatering

Skjermer, logikk, styling, tekst – alt som ikke er native kode.

NOVA: KOPIER ALT FRA DEN BLÅ TIL DEN LILLA INN I TERMINALEN NÅR DU SKAL SENDE EN OPPDATERING AV APPEN TIL IPHONEN DIN
LAG DIN EGEN MELDING PÅ SLUTTEN I STEDET FOR DET SOM STÅR DER NÅ
```powershell
$env:EXPO_TOKEN=(Get-Content .env | Select-String "EXPO_TOKEN" | ForEach-Object { $_.ToString().Split("=")[1] })
C:\Users\maria\AppData\Roaming\npm\eas.ps1 update --branch preview --message "Kort beskrivelse av hva som er nytt"
```

Appen oppdaterer seg selv neste gang den åpnes. Ingen ny installasjon.

---

## Har du lagt til en ny native pakke? → Ny build

Eksempler: Screen Time API, push-varsler, Bluetooth, kamera.

```bash
eas build --platform ios --profile preview
```

Når builden er ferdig får du en install-link. Send den til alle med telefon i familien – de må åpne lenken og installere på nytt.

---

## Usikker? Sjekk dette

| Endring | OTA | Ny build |
|---|---|---|
| Ny skjerm eller komponent | ✅ | |
| Styling / farger / tekst | ✅ | |
| Ny logikk eller hook | ✅ | |
| Ny npm-pakke (ren JS) | ✅ | |
| Ny Expo-pakke med native kode | | ✅ |
| Endring i `app.json` (navn, ikon, permissions) | | ✅ |
| Ny native modul (Screen Time, Bluetooth) | | ✅ |

---

## Nyttige kommandoer

```bash
# Se status på builds
eas build:list

# Se status på OTA-oppdateringer
eas update:list

# Legg til ny telefon (UDID) og bygg på nytt
eas device:create
eas build --platform ios --profile preview
```
