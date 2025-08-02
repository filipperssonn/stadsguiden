import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: placeId } = await params;
  
  console.log(`🔍 API route anropad med place_id: ${placeId}`);

  // Om demo mode eller ingen API-nyckel, returnera mock data
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !GOOGLE_API_KEY || GOOGLE_API_KEY.includes('your_')) {
    console.log('🔄 Använder mock data för place details');
    
    // Mock place details baserat på place_id
    const mockPlaceDetails = {
      place_id: placeId,
      name: placeId.includes('mock_1') ? "Café Bageri Petrus" : 
            placeId.includes('mock_2') ? "Café Central" :
            placeId.includes('mock_3') ? "Pizzeria Milano" :
            placeId.includes('mock_4') ? "Systembolaget Karlstad" :
            placeId.includes('mock_5') ? "Domkyrkan" : "Test Plats",
      formatted_address: placeId.includes('mock_1') ? "Kungsgatan 26, Karlstad" :
                        placeId.includes('mock_2') ? "Drottninggatan 5, Karlstad" :
                        placeId.includes('mock_3') ? "Västra Torggatan 10, Karlstad" :
                        placeId.includes('mock_4') ? "Köpmangatan 15, Karlstad" :
                        placeId.includes('mock_5') ? "Kungsgatan 18, Karlstad" : "Karlstad, Sverige",
      rating: placeId.includes('mock_1') ? 4.4 : 
              placeId.includes('mock_2') ? 4.2 :
              placeId.includes('mock_3') ? 4.0 :
              placeId.includes('mock_4') ? 3.8 :
              placeId.includes('mock_5') ? 4.6 : 4.0,
      price_level: placeId.includes('mock_1') || placeId.includes('mock_2') ? 1 : 
                   placeId.includes('mock_3') || placeId.includes('mock_4') ? 2 : undefined,
      types: placeId.includes('mock_1') ? ["cafe", "bakery", "food"] :
             placeId.includes('mock_2') ? ["cafe", "food", "establishment"] :
             placeId.includes('mock_3') ? ["restaurant", "food", "meal_takeaway"] :
             placeId.includes('mock_4') ? ["store", "liquor_store"] :
             placeId.includes('mock_5') ? ["church", "place_of_worship", "tourist_attraction"] : ["establishment"],
      opening_hours: {
        open_now: !placeId.includes('mock_4'), // Systembolaget stängt
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
        location: placeId.includes('mock_1') ? { lat: 59.3800, lng: 13.5045 } :
                  placeId.includes('mock_2') ? { lat: 59.3801, lng: 13.5055 } :
                  placeId.includes('mock_3') ? { lat: 59.3795, lng: 13.5050 } :
                  placeId.includes('mock_4') ? { lat: 59.3802, lng: 13.5048 } :
                  placeId.includes('mock_5') ? { lat: 59.3798, lng: 13.5047 } : { lat: 59.3800, lng: 13.5045 }
      },
      website: placeId.includes('mock_1') ? "https://bageri-petrus.se" : "https://example.com",
      formatted_phone_number: "054-123 45 67",
      editorial_summary: {
        overview: placeId.includes('mock_1') ? "Ett traditionellt bageri och café i hjärtat av Karlstad. Känt för sina färska bakverk och mysiga atmosfär." :
                  placeId.includes('mock_2') ? "Ett populärt café i centrala Karlstad med bred meny och bra kaffe." :
                  placeId.includes('mock_3') ? "Autentisk italiensk pizzeria med hemgjorda pizzor och pasta." :
                  placeId.includes('mock_4') ? "Systembolagets butik i centrala Karlstad med brett sortiment." :
                  placeId.includes('mock_5') ? "Karlstads domkyrka, en vacker kyrka från 1700-talet och stadens viktigaste religiösa landmärke." :
                  "Ett mysigt ställe i centrala Karlstad. Perfekt för en fika eller en lugn stund."
      },
      reviews: [
        {
          author_name: "Anna Svensson",
          rating: 5,
          text: "Fantastiskt ställe! Mycket trevlig personal och utmärkt kaffe. Kommer definitivt tillbaka.",
          time: 1703090400
        },
        {
          author_name: "Erik Johansson", 
          rating: 4,
          text: "Bra kvalitet och mysig atmosfär. Lite trångt på helgerna men värt att vänta.",
          time: 1702826400
        }
      ],
      photos: placeId.includes('mock_1') || placeId.includes('mock_2') ? [
        {
          photo_reference: `mock_photo_${placeId.includes('mock_1') ? '1' : '2'}`,
          height: 400,
          width: 600
        }
      ] : []
    };

    console.log(`🔍 Returnerar mock detaljer för plats: ${mockPlaceDetails.name}`);
    return NextResponse.json(mockPlaceDetails);
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
      reviews: place.reviews?.slice(0, 5).map((review: any) => ({
        author_name: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.time
      })),
      editorial_summary: place.editorial_summary ? {
        overview: place.editorial_summary.overview
      } : undefined,
      photos: place.photos?.slice(0, 5).map((photo: any) => ({
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