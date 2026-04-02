# Mobilhotell

iPhone-app bygget med [Expo](https://expo.dev) og React Native.

## Kom i gang

### Forutsetninger

- [Node.js](https://nodejs.org/) (LTS)
- [Expo Go](https://expo.dev/go) installert på iPhone

### Installasjon

```bash
npm install
```

### Start utviklingsserver

```bash
npm start
```

Skann QR-koden med kameraet på iPhone for å åpne appen i Expo Go.

## Prosjektstruktur

```
app/                  # Sider (file-based routing via expo-router)
├── (tabs)/           # Tab-navigasjon
│   ├── _layout.tsx   # Tab-layout
│   ├── index.tsx     # Hjem-fane
│   └── explore.tsx   # Utforsk-fane
├── _layout.tsx       # Root layout
└── +not-found.tsx    # 404-side
components/           # Gjenbrukbare UI-komponenter
constants/            # Farger og tema
hooks/                # Custom React hooks
```

## Teknologi

- **Expo SDK 52** – Utviklingsplattform
- **React Native 0.76** – UI-rammeverk
- **Expo Router** – Filbasert navigasjon
- **TypeScript** – Typesikkerhet
