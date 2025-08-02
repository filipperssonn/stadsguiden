import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const location = searchParams.get('location') || 'Karlstad';
  const type = searchParams.get('type');

  // Om demo mode eller ingen API-nyckel, returnera mock data
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !GOOGLE_API_KEY || GOOGLE_API_KEY.includes('your_')) {
    console.log('🔄 Använder mock data (API route)');
    
    // Mock data för Karlstad
    const mockPlaces = [
      {
        place_id: "mock_1",
        name: "Café Bageri Petrus",
        formatted_address: "Kungsgatan 26, Karlstad",
        rating: 4.4,
        price_level: 1,
        types: ["cafe", "bakery", "food"],
        opening_hours: { open_now: true },
        geometry: { location: { lat: 59.3800, lng: 13.5045 } },
        photos: [{
          photo_reference: "mock_photo_1",
          height: 400,
          width: 600
        }]
      },
      {
        place_id: "mock_2", 
        name: "Café Central",
        formatted_address: "Drottninggatan 5, Karlstad",
        rating: 4.2,
        price_level: 1,
        types: ["cafe", "food", "establishment"],
        opening_hours: { open_now: true },
        geometry: { location: { lat: 59.3801, lng: 13.5055 } },
        photos: [{
          photo_reference: "mock_photo_2",
          height: 400,
          width: 600
        }]
      },
      {
        place_id: "mock_3",
        name: "Pizzeria Milano",
        formatted_address: "Västra Torggatan 10, Karlstad",
        rating: 4.0,
        price_level: 2,
        types: ["restaurant", "food", "meal_takeaway"],
        opening_hours: { open_now: true },
        geometry: { location: { lat: 59.3795, lng: 13.5050 } }
      },
      {
        place_id: "mock_4",
        name: "Systembolaget Karlstad",
        formatted_address: "Köpmangatan 15, Karlstad",
        rating: 3.8,
        price_level: 2,
        types: ["store", "liquor_store"],
        opening_hours: { open_now: false },
        geometry: { location: { lat: 59.3802, lng: 13.5048 } }
      },
      {
        place_id: "mock_5",
        name: "Domkyrkan",
        formatted_address: "Kungsgatan 18, Karlstad",
        rating: 4.6,
        types: ["church", "place_of_worship", "tourist_attraction"],
        opening_hours: { open_now: true },
        geometry: { location: { lat: 59.3798, lng: 13.5047 } }
      }
    ];

    let filteredPlaces = mockPlaces;
    
    // Filtrera baserat på typ
    if (type && type !== 'all') {
      filteredPlaces = filteredPlaces.filter(place => 
        place.types.some(t => t.includes(type))
      );
    }

    // Filtrera baserat på sökfråga
    if (query.trim()) {
      filteredPlaces = filteredPlaces.filter(place =>
        place.name.toLowerCase().includes(query.toLowerCase()) ||
        place.types.some(t => t.toLowerCase().includes(query.toLowerCase()))
      );
    }

    console.log(`🔍 Returnerar ${filteredPlaces.length} platser för query: "${query}"`);
    return NextResponse.json(filteredPlaces);
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
