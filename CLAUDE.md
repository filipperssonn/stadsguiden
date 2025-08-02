# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Stadsguiden** (City Guide) is a modern Swedish city exploration app built with Next.js 15. It helps users discover restaurants, shops, and attractions using Google Places API, with weather integration via OpenWeatherMap API.

Working directory: Root directory (the Next.js project is at the repository root)

## Development Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm start           # Start production server
npm run lint        # Run ESLint
```

## Architecture & Key Concepts

### API Integration Strategy
- **Google Places API**: Primary data source for places (`lib/googlePlaces.ts`)
- **OpenWeatherMap API**: Weather data (`lib/openWeather.ts`) 
- **Supabase**: Optional authentication and favorites (`lib/supabase.ts`)
- **Graceful Fallbacks**: Mock data when APIs unavailable, localStorage when Supabase missing

### Component Architecture
- **PlaceCard**: Main place display component with two variants (default/compact)
- **SearchFilter**: Handles search and category filtering
- **WeatherWidget**: Displays current weather with temperature-based colors
- **AuthButton**: Supabase authentication with localStorage fallback
- All components use Shadcn UI with Tailwind CSS

### Data Flow
1. Search queries hit Google Places API or fallback to mock data
2. Places rendered in grid layout using PlaceCard components
3. Favorites system works with Supabase or localStorage fallback
4. Weather data fetched separately and cached

### Styling System
- **Colors**: Primary `#FFC107` (sun yellow), Secondary `#FF9800` (orange)
- **Typography**: Inter font family
- **Layout**: Mobile-first responsive design with card-based UI
- **Tailwind**: Custom classes like `city-card`, `city-primary`, `city-secondary`

## Environment Variables

Required in `.env.local`:
```env
GOOGLE_API_KEY=your_google_places_api_key_here
OPENWEATHER_KEY=your_openweather_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here (optional)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here (optional)
NEXT_PUBLIC_DEMO_MODE=true (for development without real APIs)
```

## File Structure Highlights

```
├── app/
│   ├── api/                   # API routes
│   │   ├── places/            # Google Places API endpoints
│   │   └── photos/            # Photo proxy endpoints
│   ├── places/[id]/page.tsx   # Individual place detail page
│   ├── places/page.tsx        # Search and results page
│   └── page.tsx              # Homepage
├── components/
│   ├── ui/                    # Shadcn UI components
│   └── *.tsx                  # Custom components
└── lib/
    ├── googlePlaces.ts        # Google Places API logic
    ├── openWeather.ts         # Weather API logic
    └── supabase.ts           # Auth and favorites
```

## Key Implementation Details

- **TypeScript**: Strict mode enabled with proper type definitions
- **Error Handling**: All API calls have fallbacks and error boundaries  
- **Internationalization**: Swedish language throughout (labels, metadata)
- **Performance**: Image optimization, loading states, proper caching
- **Accessibility**: Semantic HTML, proper ARIA labels, keyboard navigation