// Google Places API integration
export interface Place {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  price_level?: number;
  types: string[];
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  website?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
}

export interface PlaceDetails extends Place {
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
  editorial_summary?: {
    overview?: string;
  };
  current_opening_hours?: {
    open_now?: boolean;
    periods?: Array<{
      close?: { day: number; time: string };
      open?: { day: number; time: string };
    }>;
    weekday_text?: string[];
  };
}

// Client-side har inte tillgång till server environment variabler
// Vi behöver bara anropa våra API routes som hanterar API-nyckeln på server-side

// Cache för API-svar (i produktion skulle detta vara Redis/Memcached)
const searchCache = new Map<string, { data: Place[]; timestamp: number }>();
const detailsCache = new Map<string, { data: PlaceDetails | null; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minuter

// Funktion för att rensa gamla cache-poster
function cleanCache<T>(cache: Map<string, { data: T; timestamp: number }>) {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}


export async function searchPlaces(query: string, location: string = "Karlstad", type?: string): Promise<Place[]> {
  // Skapa cache-nyckel
  const cacheKey = `search_${query}_${location}_${type || 'all'}`;
  
  // Kontrollera cache först
  cleanCache(searchCache);
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('✅ Hämtar sökresultat från cache');
    return cached.data;
  }

  try {
    
    // Anropa vår egna API route istället för Google Places API direkt
    const params = new URLSearchParams({
      q: query,
      location: location
    });
    
    if (type && type !== 'all') {
      params.append('type', type);
    }
    
    const response = await fetch(`/api/places?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`API error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    const results = data || [];
    
    // Spara i cache
    searchCache.set(cacheKey, {
      data: results,
      timestamp: Date.now()
    });

    return results;
    
  } catch (error) {
    console.error('❌ Fel vid sökning av platser:', error);
    return []; // Returnera tom array vid fel
  }
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  // Kontrollera cache först
  cleanCache(detailsCache);
  const cached = detailsCache.get(placeId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('✅ Hämtar platsdetaljer från cache');
    return cached.data;
  }

  // Client-side anropar alltid API routes - server-side hanterar API-nyckeln

  try {
    console.log(`🔍 getPlaceDetails anropar API för place_id: ${placeId}`);
    
    // Anropa vår egna API route istället för Google Places API direkt
    const response = await fetch(`/api/places/${placeId}`);

    console.log(`📡 API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API error! status: ${response.status}, body: ${errorText}`);
      throw new Error(`API error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`📦 API response data:`, data);
    
    if (data.error) {
      throw new Error(data.error);
    }

    const result = data || null;
    
    // Spara i cache
    detailsCache.set(placeId, {
      data: result,
      timestamp: Date.now()
    });

    return result;
    
  } catch (error) {
    console.error('❌ Fel vid hämtning av platsdetaljer:', error);
    return null;
  }
}

export function getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
  // Om ingen photo reference, använd placeholder
  if (!photoReference) {
    return '/placeholder.jpg';
  }
  
  // Använd vår API proxy istället för att exponera API-nyckeln
  return `/api/photos/${photoReference}?maxwidth=${maxWidth}`;
}

export function getGoogleMapsUrl(place: Place): string {
  const lat = place.geometry.location.lat;
  const lng = place.geometry.location.lng;
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${place.place_id}`;
}