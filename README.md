# 🌇 Stadsguiden - Modern City Explorer

En responsiv webbapplikation för att upptäcka restauranger, butiker och sevärdheter i din stad. Byggd med Next.js 14, TypeScript, Tailwind CSS och Shadcn UI.

## ✨ Funktioner

### 🔍 Sök & Filtrera

- **Smart sökning** med Google Places API
- **Kategorifiltrering** (Restauranger, Butiker, Sevärdheter)
- **Realtidssökning** med responsiv UI
- **Fallback mock-data** när API-nycklar saknas

### 🏠 Responsiv Design

- **Mobile-first** designfilosofi
- **Modernt kort-baserat layout** med skuggor och rundade hörn
- **Inter-typsnitt** för optimal läsbarhet
- **Anpassat färgschema** (solgul #FFC107, orange #FF9800)

### 🌤️ Väderintegrering

- **Realtidsväder** via OpenWeatherMap API
- **Temperaturbaserade färger** för visuell feedback
- **Kompakt widget** i header och stor vy på startsidan

### 👤 Autentisering & Favoriter

- **Supabase-integration** för användarhantering
- **localStorage-fallback** när Supabase inte är konfigurerat
- **Favoritsystem** för att spara platser
- **Responsiv auth-modal** med registrering och inloggning

### 📱 Användarvänlig Navigation

- **Sticky headers** med navigation
- **Breadcrumbs** och tillbaka-knappar
- **Loading states** och error handling
- **Delningsfunktionalitet** för platser

## 🏗️ Teknisk Stack

- **Framework:** Next.js 14 med App Router
- **Språk:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI-komponenter:** Shadcn UI
- **Databas:** Supabase (valfritt)
- **API:er:** Google Places API, OpenWeatherMap API
- **Ikoner:** Lucide React

## 📁 Projektstruktur

```
cityviewer/
├── app/
│   ├── places/
│   │   ├── [id]/
│   │   │   └── page.tsx       # Detaljsida för plats
│   │   └── page.tsx           # Sök- och resultatssida
│   ├── layout.tsx
│   ├── page.tsx               # Startsida
│   └── globals.css
├── components/
│   ├── ui/                    # Shadcn UI komponenter
│   ├── AuthButton.tsx         # Autentisering
│   ├── CategorySelector.tsx   # Kategorifiltrering
│   ├── MapButton.tsx          # Google Maps-integration
│   ├── PlaceCard.tsx          # Platskort med all info
│   ├── SearchFilter.tsx       # Sökfunktionalitet
│   └── WeatherWidget.tsx      # Vädervisning
├── lib/
│   ├── googlePlaces.ts        # Google Places API
│   ├── openWeather.ts         # OpenWeatherMap API
│   ├── supabase.ts            # Supabase-integration
│   └── utils.ts               # Shadcn utilities
└── public/
    └── placeholder.jpg        # Fallback-bild
```

## 🚀 Snabbstart

### 1. Installera dependencies

```bash
cd cityviewer
npm install
```

### 2. Konfigurera miljövariabler

Skapa `.env.local` med:

```env
# API Nycklar
GOOGLE_API_KEY=your_google_places_api_key_here
OPENWEATHER_KEY=your_openweather_api_key_here

# Supabase (valfritt)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Demo mode för utveckling
NEXT_PUBLIC_DEMO_MODE=true
```

### 3. Starta utvecklingsserver

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

## 🔧 API-integration

### Google Places API

1. Gå till [Google Cloud Console](https://console.cloud.google.com/)
2. Aktivera Places API och Maps JavaScript API
3. Skapa API-nyckel och lägg till i `.env.local`

### OpenWeatherMap API

1. Registrera dig på [OpenWeatherMap](https://openweathermap.org/api)
2. Få din gratis API-nyckel
3. Lägg till i `.env.local`

### Supabase (Valfritt)

1. Skapa projekt på [Supabase](https://supabase.com)
2. Skapa tabeller för användare och favoriter
3. Lägg till URL och anon key i `.env.local`

## 🎨 Designprinciper

- **Färgschema:** Solgul (#FFC107) primär, Orange (#FF9800) sekundär
- **Typografi:** Inter-font för modern, läsbar text
- **Layout:** Grid-baserat kortsystem med generösa marginaler
- **Rundade hörn:** 2xl (20px) för mjuk, modern känsla
- **Skuggor:** Subtila för djup och hierarki

## 📱 Responsivitet

- **Mobil-först** design
- **Flexibla grid-layouts** som anpassar sig efter skärmstorlek
- **Touch-vänliga** knappar och interaktioner
- **Kompakta komponenter** för mobila enheter

## 🔄 Fallback-system

Applikationen fungerar även utan API-nycklar:

- **Mock-data** för platser och väder
- **localStorage** för favoriter utan Supabase
- **Placeholder-bilder** för platser utan foton
- **Graceful degradation** för alla funktioner

## 🚀 Deployment

### Vercel (Rekommenderat)

1. **Förbered för deployment:**
   ```bash
   npm run build
   ```

2. **Deploy till Vercel:**
   - Connecta ditt GitHub-repo till Vercel
   - Eller använd Vercel CLI: `npx vercel`

3. **Konfigurera miljövariabler i Vercel:**
   - Gå till ditt projekt i Vercel Dashboard
   - Settings → Environment Variables
   - Lägg till alla variabler från `.env.example`

4. **Vercel-specifika filer:**
   - `vercel.json` - Deployment konfiguration
   - `.vercelignore` - Filer att exkludera från deployment
   - `.env.example` - Template för miljövariabler

### Andra plattformar

```bash
npm run build
npm start
```

## 🤝 Bidrag

Välkommen att bidra! Se till att:

- Följ TypeScript strict mode
- Använd Prettier för kodformatering
- Testa responsivitet på olika enheter
- Dokumentera nya funktioner

## 📄 Licens

MIT License - Se [LICENSE](LICENSE) för detaljer.

---

**Byggd med ❤️ för att upptäcka din stad!**
