import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stadsguiden.vercel.app'
  
  // Populära svenska städer för SEO
  const popularCities = [
    "Stockholm",
    "Göteborg", 
    "Malmö",
    "Uppsala",
    "Västerås",
    "Örebro",
    "Linköping",
    "Helsingborg",
    "Jönköping",
    "Norrköping",
    "Lund",
    "Umeå",
    "Gävle",
    "Borås",
    "Eskilstuna",
    "Karlstad",
    "Växjö",
    "Halmstad"
  ];

  // Statiska sidor
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/places`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  // Stad-specifika sidor för SEO
  const cityPages = popularCities.map(city => ({
    url: `${baseUrl}/places?city=${encodeURIComponent(city)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Kategori-sidor för SEO
  const categories = [
    { id: 'restaurant', name: 'restauranger' },
    { id: 'tourist_attraction', name: 'sevärdheter' }, 
    { id: 'store', name: 'butiker' },
    { id: 'cafe', name: 'kaféer' }
  ];

  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/places?category=${category.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...cityPages, ...categoryPages]
}