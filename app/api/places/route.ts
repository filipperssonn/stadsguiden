import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

export async function GET(request: NextRequest) {
  console.log('🔄 API route anropad - /api/places');
  
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
        geometry: { location: { lat: 59.3800, lng: 13.5045 } }
      },
      {
        place_id: "mock_2",
        name: "Café Central",
        formatted_address: "Drottninggatan 5, Karlstad",
        rating: 4.2,
        price_level: 1,
        types: ["cafe", "food", "establishment"],
        opening_hours: { open_now: true },
        geometry: { location: { lat: 59.3801, lng: 13.5055 } }
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
    console.log('🌐 Anropar Google Places API från server');
    
    const searchQuery = `${query} in ${location}`;
    const typeParam = type && type !== 'all' ? `&type=${type}` : '';
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${GOOGLE_API_KEY}${typeParam}`
    );

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API status: ${data.status}`);
    }

    console.log(`🌐 Google Places returnerade ${data.results?.length || 0} platser`);
    return NextResponse.json(data.results || []);
    
  } catch (error) {
    console.error('❌ Fel vid anrop till Google Places API:', error);
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
}