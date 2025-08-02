import { Metadata } from "next";
import PlaceDetailClient from "./PlaceDetailClient";
import { generatePlaceJsonLd } from "@/lib/seo/jsonLd";

// Funktion för att hämta platsdata på server-side
async function getPlaceData(placeId: string) {
  try {

    // För riktiga Google place_id:n, försök anropa API:n
    console.log('🌐 Hämtar metadata för riktig Google place_id:', placeId);
    
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    
    // Om vi har API-nyckel, försök hämta riktig data
    if (GOOGLE_API_KEY && !GOOGLE_API_KEY.includes('your_')) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}&fields=name,formatted_address,rating,types,editorial_summary&language=sv`,
          { next: { revalidate: 3600 } } // Cache i 1 timme
        );

        if (response.ok) {
          const data = await response.json();
          if (data.result) {
            console.log('✅ Hämtade metadata från Google Places API');
            return {
              name: data.result.name,
              formatted_address: data.result.formatted_address,
              rating: data.result.rating,
              types: data.result.types || [],
              editorial_summary: data.result.editorial_summary
            };
          }
        }
      } catch (apiError) {
        console.error('Fel vid anrop till Google Places API för metadata:', apiError);
      }
    }

    // Fallback för okända place_id:n
    console.log('🔄 Använder generisk metadata för okänd place_id');
    return {
      name: 'Okänd plats',
      formatted_address: 'Karlstad',
      rating: null,
      types: ['establishment'],
      editorial_summary: { overview: 'Information om denna plats kommer att laddas när sidan öppnas.' }
    };

  } catch (error) {
    console.error('Fel vid hämtning av platsdata:', error);
    return null;
  }
}

// Generera metadata för varje platssida
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id: placeId } = await params;
  const place = await getPlaceData(placeId);

  if (!place) {
    return {
      title: 'Plats hittades inte - Stadsguiden',
      description: 'Den efterfrågade platsen kunde inte hittas.',
    };
  }

  const title = `${place.name} - Stadsguiden`;
  const description = place.editorial_summary?.overview 
    ? `${place.editorial_summary.overview} ${place.formatted_address}. Betyg: ${place.rating}/5.`
    : `Upptäck ${place.name} i ${place.formatted_address}. Betyg: ${place.rating}/5.`;

  return {
    title,
    description,
    keywords: [
      place.name,
      'Karlstad',
      'stadsguide',
      ...place.types,
      'restaurant',
      'butik',
      'sevärdhet'
    ].join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'sv_SE',
      siteName: 'Stadsguiden',
      images: [
        {
          url: '/placeholder.jpg', // I produktion skulle detta vara den riktiga bilden
          width: 1200,
          height: 630,
          alt: place.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/placeholder.jpg'],
    },
    alternates: {
      canonical: `/places/${placeId}`,
    },
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { id: placeId } = await params;
  const place = await getPlaceData(placeId);
  
  return (
    <>
      {place && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generatePlaceJsonLd(place)),
          }}
        />
      )}
      <PlaceDetailClient />
    </>
  );
}
