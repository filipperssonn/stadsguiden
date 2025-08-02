import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  const { reference: photoReference } = await params;
  const searchParams = request.nextUrl.searchParams;
  const maxWidth = searchParams.get('maxwidth') || '400';

  // Om vi saknar API-nyckel
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY.includes('your_')) {
    // Redirect till placeholder bild
    return NextResponse.redirect(new URL('/placeholder.jpg', request.url));
  }

  try {
    // Bygg Google Places Photo API URL
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
    
    // Hämta bilden från Google
    const response = await fetch(photoUrl);
    
    if (!response.ok) {
      console.error('Google Photos API fel:', response.status);
      return NextResponse.redirect(new URL('/placeholder.jpg', request.url));
    }

    // Vidarebefordra bilden med rätt headers
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800', // Cache i 1 dag
      },
    });

  } catch (error) {
    console.error('Fel vid hämtning av Google Photos:', error);
    return NextResponse.redirect(new URL('/placeholder.jpg', request.url));
  }
}