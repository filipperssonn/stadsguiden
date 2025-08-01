"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import MapButton from "@/components/MapButton";
import WeatherWidget from "@/components/WeatherWidget";
import { getPlaceDetails, getPhotoUrl, PlaceDetails } from "@/lib/googlePlaces";
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Phone,
  Globe,
  ExternalLink,
  Heart,
  Share2,
  Calendar,
  Info,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PlaceDetailClient() {
  const params = useParams();
  const router = useRouter();
  const placeId = params.id as string;

  const [place, setPlace] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      if (!placeId) {
        setError("Ogiltigt plats-ID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const placeData = await getPlaceDetails(placeId);
        setPlace(placeData);
      } catch (err) {
        setError("Kunde inte hämta platsdetaljer. Försök igen.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetails();
  }, [placeId]);

  const handleShare = async () => {
    if (navigator.share && place) {
      try {
        await navigator.share({
          title: place.name,
          text: `Kolla in ${place.name} på Stadsguiden`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback - kopiera länk
      navigator.clipboard.writeText(window.location.href);
      // Här kunde man visa en toast/notification
    }
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Här skulle man integrera med Supabase för att spara favoriter
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-8 w-40" />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-64 w-full rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <Link href="/places">
              <Button variant="outline" size="sm" className="rounded-xl">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Tillbaka
              </Button>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="city-card border-0 p-8 text-center max-w-md mx-auto">
            <CardContent className="p-0 space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-2xl mx-auto flex items-center justify-center">
                <Info className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Platsen hittades inte
                </h3>
                <p className="text-gray-600 mb-4">
                  {error || "Den här platsen finns inte eller har tagits bort."}
                </p>
                <Button
                  onClick={() => router.back()}
                  className="city-primary hover:city-secondary rounded-2xl"
                >
                  Gå tillbaka
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const hasPhoto = place.photos && place.photos.length > 0 && place.photos[0].photo_reference;
  const photoUrl = hasPhoto
    ? getPhotoUrl(place.photos[0].photo_reference, 800)
    : "/placeholder.jpg";
  const isOpen =
    place.current_opening_hours?.open_now ?? place.opening_hours?.open_now;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/places">
                <Button variant="outline" size="sm" className="rounded-xl">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Tillbaka
                </Button>
              </Link>
              <Link
                href="/"
                className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
              >
                <Image
                  src="/logo.svg"
                  alt="Stadsguiden"
                  width={140}
                  height={39}
                  priority
                />
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={toggleFavorite}
                variant="outline"
                size="sm"
                className={`rounded-xl ${
                  isFavorited ? "text-red-500 border-red-200" : ""
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`}
                />
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="rounded-xl"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Image */}
          <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-3xl shadow-xl">
            <Image
              src={photoUrl}
              alt={place.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              priority={true}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.jpg";
              }}
            />

            {/* Rating overlay */}
            {place.rating && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-bold text-lg">{place.rating}</span>
                {place.reviews && (
                  <span className="text-sm text-gray-600">
                    ({place.reviews.length})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Main Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {place.name}
              </h1>

              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span className="text-lg">{place.formatted_address}</span>
              </div>

              {/* Status and Category Badges */}
              <div className="flex flex-wrap gap-3">
                {isOpen !== undefined && (
                  <Badge
                    variant={isOpen ? "default" : "destructive"}
                    className={`px-4 py-2 text-sm font-semibold ${
                      isOpen
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {isOpen ? "Öppet nu" : "Stängt"}
                  </Badge>
                )}

                {place.types.slice(0, 2).map((type) => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 px-3 py-1"
                  >
                    {type.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <MapButton place={place} />

              {place.formatted_phone_number && (
                <Button
                  onClick={() =>
                    window.open(`tel:${place.formatted_phone_number}`, "_self")
                  }
                  variant="outline"
                  className="flex items-center gap-2 h-12 px-6 border-2 border-gray-200 hover:border-primary rounded-2xl font-semibold"
                >
                  <Phone className="h-4 w-4" />
                  Ring
                </Button>
              )}

              {place.website && (
                <Button
                  onClick={() =>
                    window.open(place.website, "_blank", "noopener,noreferrer")
                  }
                  variant="outline"
                  className="flex items-center gap-2 h-12 px-6 border-2 border-gray-200 hover:border-primary rounded-2xl font-semibold"
                >
                  <Globe className="h-4 w-4" />
                  Hemsida
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              {place.editorial_summary?.overview && (
                <Card className="city-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Om platsen
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {place.editorial_summary.overview}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Opening Hours */}
              {(place.current_opening_hours?.weekday_text ||
                place.opening_hours?.weekday_text) && (
                <Card className="city-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Öppettider
                      </div>
                      {isOpen !== undefined && (
                        <Badge
                          variant={isOpen ? "default" : "destructive"}
                          className={`${
                            isOpen
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {isOpen ? "Öppet nu" : "Stängt"}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(
                        place.current_opening_hours?.weekday_text ||
                        place.opening_hours?.weekday_text ||
                        []
                      ).map((day, index) => {
                        const [dayName, hours] = day.split(": ");
                        const isToday = new Date().getDay() === (index + 1) % 7;
                        const isClosed = hours === "Stängt" || hours === "Closed";
                        
                        return (
                          <div
                            key={index}
                            className={`flex justify-between items-center py-2 px-3 rounded-lg transition-colors ${
                              isToday ? "bg-primary/10 border border-primary/20" : "hover:bg-gray-50"
                            }`}
                          >
                            <span className={`font-medium ${isToday ? "text-primary" : "text-gray-700"}`}>
                              {dayName}
                              {isToday && <span className="text-xs ml-2 text-primary">(Idag)</span>}
                            </span>
                            <span className={`font-medium ${
                              isClosed 
                                ? "text-red-600" 
                                : isToday 
                                  ? "text-primary font-bold" 
                                  : "text-gray-900"
                            }`}>
                              {hours}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Extra information about opening hours */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-blue-800 font-medium mb-1">Bra att veta</p>
                          <p className="text-blue-700 text-xs">
                            Öppettiderna kan variera under helger och speciella dagar. 
                            Ring gärna och bekräfta innan ditt besök.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reviews */}
              {place.reviews && place.reviews.length > 0 && (
                <Card className="city-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Recensioner
                      </div>
                      {place.rating && (
                        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-bold text-yellow-700">{place.rating}</span>
                          <span className="text-xs text-yellow-600">({place.reviews.length} recensioner)</span>
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {place.reviews.slice(0, 5).map((review, index) => (
                        <div key={index} className="border-l-4 border-gray-100 pl-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {review.author_name.charAt(0)}
                              </div>
                              <div>
                                <span className="font-semibold text-gray-900 text-sm">
                                  {review.author_name}
                                </span>
                                <div className="flex items-center gap-1 mt-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < review.rating
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                  <span className="text-xs text-gray-500 ml-1">
                                    {new Date(review.time * 1000).toLocaleDateString('sv-SE')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed text-sm">
                            {review.text}
                          </p>
                          {index < Math.min(place.reviews.length - 1, 4) && (
                            <Separator className="mt-4" />
                          )}
                        </div>
                      ))}
                      {place.reviews.length > 5 && (
                        <div className="text-center pt-2">
                          <span className="text-sm text-gray-500">
                            Visar 5 av {place.reviews.length} recensioner
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className="city-card border-0">
                <CardHeader>
                  <CardTitle>Kontaktuppgifter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {place.formatted_phone_number && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">
                        {place.formatted_phone_number}
                      </span>
                    </div>
                  )}

                  {place.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Besök hemsida
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 text-sm">
                      {place.formatted_address}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Weather */}
              <WeatherWidget />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}