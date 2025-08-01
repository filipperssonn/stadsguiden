import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const location = searchParams.get('location') || 'Karlstad';
  const type = searchParams.get('type');

  // Kontrollera om vi har giltig API-nyckel
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY.includes('your_')) {
    console.error('❌ Ingen giltig Google API-nyckel konfigurerad');
    return NextResponse.json({ error: 'API-nyckel saknas' }, { status: 500 });
  }

  try {
    console.log('🌐 Anropar Google Places API');
    
    // Bygg Google Places Text Search URL
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    const params = new URLSearchParams({
      query: query ? `${query} in ${location}` : location,
      key: GOOGLE_API_KEY,
      language: 'sv',
      region: 'se'
    });

    if (type && type !== 'all') {
      params.append('type', type);
    }

    const response = await fetch(`${baseUrl}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error_message) {
      throw new Error(`Google Places API error: ${data.error_message}`);
    }

    // Mappa Google Places resultatet till vårt format
    const places = data.results?.map((place: any) => ({
      place_id: place.place_id,
      name: place.name,
      formatted_address: place.formatted_address,
      rating: place.rating,
      price_level: place.price_level,
      types: place.types || [],
      opening_hours: place.opening_hours ? {
        open_now: place.opening_hours.open_now
      } : undefined,
      geometry: {
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        }
      },
      photos: place.photos?.slice(0, 1).map((photo: any) => ({
        photo_reference: photo.photo_reference,
        height: photo.height,
        width: photo.width
      }))
    })) || [];

    console.log(`✅ Hämtade ${places.length} platser från Google Places API`);
    return NextResponse.json(places);

  } catch (error) {
    console.error('❌ Fel vid anrop till Google Places API:', error);
    
    // Returnera fel istället för mock data
    return NextResponse.json({ error: 'Kunde inte hämta platser' }, { status: 500 });
  }
}
