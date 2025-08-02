// Strukturerad data för SEO
export function generatePlaceJsonLd(place: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stadsguiden.se';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: place.name,
    description: place.editorial_summary?.overview || `Upptäck ${place.name} i ${place.formatted_address}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: place.formatted_address,
      addressLocality: 'Karlstad',
      addressRegion: 'Värmland',
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

export function generateOrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stadsguiden.se';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Stadsguiden',
    description: 'Upptäck de bästa restaurangerna, butikerna och sevärdheterna i Karlstad',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
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

export function generateWebsiteJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stadsguiden.se';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Stadsguiden',
    description: 'Upptäck de bästa restaurangerna, butikerna och sevärdheterna i Karlstad',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/places?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}