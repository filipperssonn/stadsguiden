import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const placeId = context.params.id;
  console.log(`🔄 API route anropad - /api/places/${placeId}`);

  if (!placeId) {
    return NextResponse.json({ error: 'Place ID required' }, { status: 400 });
  }

  // Mock place details baserat på place_id
  const mockPlaceDetails = {
    place_id: placeId,
    name: placeId.includes('mock_1') ? "Café Bageri Petrus" : 
          placeId.includes('mock_2') ? "Café Central" : "Test Plats",
    formatted_address: placeId.includes('mock_1') ? "Kungsgatan 26, Karlstad" :
                      placeId.includes('mock_2') ? "Drottninggatan 5, Karlstad" : "Karlstad, Sverige",
    rating: placeId.includes('mock_1') ? 4.4 : 4.2,
    price_level: 1,
    types: ["cafe", "food", "establishment"],
    opening_hours: {
      open_now: true,
      weekday_text: [
        "måndag: 07:00 – 18:00",
        "tisdag: 07:00 – 18:00", 
        "onsdag: 07:00 – 18:00",
        "torsdag: 07:00 – 18:00",
        "fredag: 07:00 – 19:00",
        "lördag: 08:00 – 17:00",
        "söndag: 09:00 – 16:00"
      ]
    },
    geometry: { 
      location: placeId.includes('mock_1') ? 
        { lat: 59.3800, lng: 13.5045 } : 
        { lat: 59.3801, lng: 13.5055 }
    },
    website: "https://example.com",
    formatted_phone_number: "054-123 45 67",
    editorial_summary: {
      overview: `Ett mysigt café i centrala Karlstad. Perfekt för en fika eller en lugn stund med kaffe och bakverk.`
    }
  };

  console.log(`🔍 Returnerar detaljer för plats: ${mockPlaceDetails.name}`);
  return NextResponse.json(mockPlaceDetails);
}