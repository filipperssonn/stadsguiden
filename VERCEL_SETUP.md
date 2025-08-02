# Vercel Deployment Guide för Stadsguiden

## Miljövariabler som måste konfigureras i Vercel

Gå till ditt Vercel Dashboard → Project Settings → Environment Variables och lägg till:

### Obligatoriska API-nycklar:

```
GOOGLE_API_KEY=din_google_places_api_nyckel_här
OPENWEATHER_KEY=din_openweather_api_nyckel_här
NEXT_PUBLIC_OPENWEATHER_KEY=din_openweather_api_nyckel_här
```

### Valfria (för Supabase integration):

```
NEXT_PUBLIC_SUPABASE_URL=din_supabase_url_här
NEXT_PUBLIC_SUPABASE_ANON_KEY=din_supabase_anon_key_här
```

### För Google Site Verification (valfritt):

```
GOOGLE_SITE_VERIFICATION=din_google_site_verification_code
```

## API-nycklar setup:

### Google Places API:
1. Gå till [Google Cloud Console](https://console.cloud.google.com/)
2. Aktivera Places API och Maps JavaScript API
3. Skapa API-nyckel
4. Begränsa nyckeln till dina domäner för säkerhet

### OpenWeatherMap API:
1. Registrera dig på [OpenWeatherMap](https://openweathermap.org/api)
2. Få din gratis API-nyckel
3. Lägg till i både OPENWEATHER_KEY och NEXT_PUBLIC_OPENWEATHER_KEY

## Deployment:
Efter att miljövariablerna är konfigurerade, deploy:
- Pusha kod till GitHub
- Vercel kommer automatiskt att bygga och deploya
- Kontrollera att API:erna fungerar i Vercel logs

## Troubleshooting:
- Kontrollera Vercel logs för API-fel
- Verifiera att alla miljövariabler är korrekt konfigurerade
- Testa API-nycklar i Google Cloud Console och OpenWeatherMap