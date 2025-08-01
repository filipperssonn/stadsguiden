# 🌇 Stadsguide – Projektöversikt & Cursor Guidelines

Resurser:

Google Places API: https://developers.google.com/maps/documentation/places/web-service

OpenWeatherMap API: https://openweathermap.org/api

## 🧱 Projektstruktur

```bash
/app
  /places
    /[id]
      page.tsx         # Detaljsida för en plats
    page.tsx           # Listvy med sök/filter
  layout.tsx
  page.tsx             # Startsida

/components
  SearchFilter.tsx
  PlaceCard.tsx
  WeatherWidget.tsx
  MapButton.tsx

/lib
  googlePlaces.ts      # API-hantering för Google Places
  openWeather.ts       # API-hantering för väder

/styles
  globals.css

/public
  placeholder.jpg

.env.local              # API-nycklar (läggs EJ i Git)


```
