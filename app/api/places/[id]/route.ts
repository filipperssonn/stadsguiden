import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: placeId } = await params;
  
  console.log(`🔍 API route anropad med place_id: ${placeId}`);

  // Kontrollera om vi har giltig API-nyckel
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY.includes('your_')) {
    console.error('❌ Ingen giltig Google API-nyckel konfigurerad för place details:', {
      hasKey: !!GOOGLE_API_KEY,
      keyPreview: GOOGLE_API_KEY ? GOOGLE_API_KEY.substring(0, 10) + '...' : 'undefined',
      envKeys: Object.keys(process.env).filter(key => key.includes('GOOGLE'))
    });
    return NextResponse.json({ 
      error: 'API-nyckel saknas eller ogiltig',
      debug: {
        hasKey: !!GOOGLE_API_KEY,
        keyPreview: GOOGLE_API_KEY ? GOOGLE_API_KEY.substring(0, 10) + '...' : 'undefined'
      }
    }, { status: 500 });
  }

  try {
    console.log(`🌐 Hämtar platsdetaljer från Google Places API för ID: ${placeId}`);
    
    // Google Places Details API
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
    const params = new URLSearchParams({
      place_id: placeId,
      key: GOOGLE_API_KEY,
      language: 'sv',
      fields: [
        'place_id',
        'name', 
        'formatted_address',
        'rating',
        'price_level',
        'types',
        'opening_hours',
        'current_opening_hours',
        'geometry',
        'website',
        'formatted_phone_number',
        'international_phone_number',
        'reviews',
        'editorial_summary',
        'photos'
      ].join(',')
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error_message) {
      throw new Error(`Google Places API error: ${data.error_message}`);
    }

    if (!data.result) {
      return NextResponse.json({ error: 'Plats hittades inte' }, { status: 404 });
    }

    const place = data.result;
    
    // Mappa Google Places resultatet till vårt format
    const placeDetails = {
      place_id: place.place_id,
      name: place.name,
      formatted_address: place.formatted_address,
      rating: place.rating,
      price_level: place.price_level,
      types: place.types || [],
      opening_hours: place.opening_hours ? {
        open_now: place.opening_hours.open_now,
        weekday_text: place.opening_hours.weekday_text
      } : undefined,
      current_opening_hours: place.current_opening_hours ? {
        open_now: place.current_opening_hours.open_now,
        weekday_text: place.current_opening_hours.weekday_text,
        periods: place.current_opening_hours.periods
      } : undefined,
      geometry: {
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        }
      },
      website: place.website,
      formatted_phone_number: place.formatted_phone_number,
      international_phone_number: place.international_phone_number,
      reviews: place.reviews?.slice(0, 5).map((review: { author_name: string; rating: number; text: string; time: number }) => ({
        author_name: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.time
      })),
      editorial_summary: place.editorial_summary ? {
        overview: place.editorial_summary.overview
      } : undefined,
      photos: place.photos?.slice(0, 5).map((photo: { photo_reference: string; height: number; width: number }) => ({
        photo_reference: photo.photo_reference,
        height: photo.height,
        width: photo.width
      }))
    };

    console.log(`✅ Hämtade detaljer för plats: ${place.name}`);
    return NextResponse.json(placeDetails);

  } catch (error) {
    console.error('❌ Fel vid hämtning av platsdetaljer:', error);
    
    // Returnera fel istället för mock data
    return NextResponse.json({ error: 'Kunde inte hämta platsdetaljer' }, { status: 500 });
  }
}