// Strukturerad data för SEO
interface PlaceForJsonLd {
  name: string;
  formatted_address?: string;
  rating?: number;
  types: string[];
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  formatted_phone_number?: string;
  website?: string;
  geometry?: {
    location?: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
  editorial_summary?: {
    overview?: string;
  };
}

export function generatePlaceJsonLd(place: PlaceForJsonLd, city?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stadsguiden.se';
  
  // Försök extrahera stad och region från adress eller använd medskickad stad
  const addressParts = place.formatted_address?.split(', ') || [];
  const extractedCity = city || addressParts.find((part: string) => 
    !part.includes('Sweden') && !part.match(/^\d{3}\s?\d{2}/) // Inte postnummer
  ) || 'Sverige';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: place.name,
    description: place.editorial_summary?.overview || `Upptäck ${place.name} i ${place.formatted_address}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: place.formatted_address,
      addressLocality: extractedCity,
      addressCountry: 'SE',
    },
    ...(place.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: place.rating,
        bestRating: 5,
        worstRating: 1,
        ratingCount: place.reviews?.length || 1,
      },
    }),
    ...(place.formatted_phone_number && {
      telephone: place.formatted_phone_number,
    }),
    ...(place.website && {
      url: place.website,
    }),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: place.geometry?.location?.lat,
      longitude: place.geometry?.location?.lng,
    },
    ...(place.opening_hours?.weekday_text && {
      openingHours: place.opening_hours.weekday_text.map((hours: string) => {
        // Konvertera från "Måndag: 10:00 – 18:00" till schema.org format
        const [day, time] = hours.split(': ');
        if (time === 'Stängt' || time === '24 timmar') return null;
        
        const dayMap: { [key: string]: string } = {
          'Måndag': 'Mo',
          'Tisdag': 'Tu', 
          'Onsdag': 'We',
          'Torsdag': 'Th',
          'Fredag': 'Fr',
          'Lördag': 'Sa',
          'Söndag': 'Su'
        };
        
        return `${dayMap[day]} ${time.replace(' – ', '-')}`;
      }).filter(Boolean)
    }),
    sameAs: [
      `${baseUrl}/places/${place.place_id}`,
      ...(place.website ? [place.website] : [])
    ],
  };
}

export function generateOrganizationJsonLd(city?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stadsguiden.se';
  const description = city 
    ? `Upptäck de bästa restaurangerna, butikerna och sevärdheterna i ${city}`
    : 'Upptäck de bästa restaurangerna, butikerna och sevärdheterna i svenska städer';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Stadsguiden',
    description,
    url: baseUrl,
    logo: `${baseUrl}/stadsguiden-logo.svg`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      areaServed: 'SE',
      availableLanguage: 'Swedish',
    },
    sameAs: [
      // Här kan du lägga till sociala medier-länkar
    ],
  };
}

export function generateWebsiteJsonLd(city?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stadsguiden.se';
  const description = city 
    ? `Upptäck de bästa restaurangerna, butikerna och sevärdheterna i ${city}`
    : 'Upptäck de bästa restaurangerna, butikerna och sevärdheterna i svenska städer';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Stadsguiden',
    description,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: city 
          ? `${baseUrl}/places?q={search_term_string}&city=${encodeURIComponent(city)}`
          : `${baseUrl}/places?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}