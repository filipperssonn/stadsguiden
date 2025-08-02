"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, MapPin, ExternalLink, Phone, Globe } from "lucide-react";
import { Place, getPhotoUrl } from "@/lib/googlePlaces";
import MapButton from "./MapButton";
import Link from "next/link";
import Image from "next/image";

interface PlaceCardProps {
  place: Place;
  variant?: "default" | "compact";
}

export default function PlaceCard({
  place,
  variant = "default",
}: PlaceCardProps) {
  const isOpen = place.opening_hours?.open_now;
  const hasPhoto = place.photos && place.photos.length > 0 && place.photos[0].photo_reference;
  const photoUrl = hasPhoto
    ? getPhotoUrl(place.photos![0].photo_reference, 400)
    : "/placeholder.jpg";

  const getPriceLevel = (level?: number) => {
    if (!level) return null;
    return "€".repeat(level);
  };

  const getTypeDisplay = (types: string[]) => {
    const typeMap: { [key: string]: string } = {
      restaurant: "Restaurang",
      food: "Mat",
      cafe: "Kafé",
      store: "Butik",
      shopping_mall: "Köpcentrum",
      tourist_attraction: "Sevärdhet",
      museum: "Museum",
      park: "Park",
      establishment: "Verksamhet",
    };

    const displayType = types.find((type) => typeMap[type]);
    return displayType ? typeMap[displayType] : types[0]?.replace(/_/g, " ");
  };

  if (variant === "compact") {
    return (
      <Card className="city-card border-0 hover:shadow-lg transition-all duration-200 cursor-pointer">
        <Link 
          href={`/places/${place.place_id}`}
          className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl"
          aria-label={`Visa detaljer för ${place.name}`}
        >
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={photoUrl}
                  alt={`Bild av ${place.name}`}
                  fill
                  className="object-cover rounded-xl"
                  sizes="64px"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Wj2he9kY2jtgp9PkDgLt6zx/f"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.jpg";
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">
                    {place.name}
                  </h3>
                  {place.rating && (
                    <div className="flex items-center gap-1 flex-shrink-0" aria-label={`Betyg ${place.rating} av 5 stjärnor`}>
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-current" aria-hidden="true" />
                      <span className="text-xs font-medium" aria-hidden="true">
                        {place.rating}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-500 mb-2 truncate">
                  {place.formatted_address}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeDisplay(place.types) && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-0.5 bg-gray-100"
                      >
                        {getTypeDisplay(place.types)}
                      </Badge>
                    )}
                    {isOpen !== undefined && (
                      <div
                        className={`flex items-center gap-1 text-xs ${
                          isOpen ? "text-green-600" : "text-red-500"
                        }`}
                        aria-label={isOpen ? "Öppet nu" : "Stängt just nu"}
                      >
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        <span aria-hidden="true">{isOpen ? "Öppet" : "Stängt"}</span>
                      </div>
                    )}
                  </div>
                  <MapButton place={place} variant="compact" />
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="city-card border-0 hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative h-48 overflow-hidden rounded-t-2xl">
        <Image
          src={photoUrl}
          alt={`Bild av ${place.name}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Wj2he9kY2jtgp9PkDgLt6zx/f"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.jpg";
          }}
        />

        {/* Rating overlay */}
        {place.rating && (
          <div 
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-2.5 py-1.5 flex items-center gap-1 shadow-lg"
            aria-label={`Betyg ${place.rating} av 5 stjärnor`}
          >
            <Star className="h-4 w-4 text-yellow-400 fill-current" aria-hidden="true" />
            <span className="text-sm font-semibold" aria-hidden="true">{place.rating}</span>
          </div>
        )}

        {/* Price level overlay */}
        {getPriceLevel(place.price_level) && (
          <div 
            className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-2.5 py-1.5 shadow-lg"
            aria-label={`Prisnivå ${getPriceLevel(place.price_level)}`}
          >
            <span className="text-sm font-semibold text-gray-700" aria-hidden="true">
              {getPriceLevel(place.price_level)}
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
            {place.name}
          </h3>
          <div className="flex items-center gap-2 text-gray-500 mb-3">
            <MapPin className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm" aria-label={`Adress: ${place.formatted_address}`}>
              {place.formatted_address}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {getTypeDisplay(place.types) && (
            <Badge
              variant="secondary"
              className="bg-gray-100 text-gray-700 px-3 py-1"
            >
              {getTypeDisplay(place.types)}
            </Badge>
          )}
          {isOpen !== undefined && (
            <Badge
              variant={isOpen ? "default" : "destructive"}
              className={`px-3 py-1 ${
                isOpen
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
              {isOpen ? "Öppet nu" : "Stängt"}
            </Badge>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Link href={`/places/${place.place_id}`} className="flex-1">
            <Button 
              className="w-full city-primary hover:city-secondary rounded-2xl font-semibold"
              aria-label={`Visa detaljer för ${place.name}`}
            >
              Visa detaljer
            </Button>
          </Link>
          <MapButton place={place} />
        </div>

        {/* Quick actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          {place.formatted_phone_number && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(`tel:${place.formatted_phone_number}`, "_self")
              }
              className="flex items-center gap-1.5 h-8 px-3 text-xs rounded-xl"
              aria-label={`Ring ${place.name} på ${place.formatted_phone_number}`}
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              Ring
            </Button>
          )}
          {place.website && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(place.website, "_blank", "noopener,noreferrer")
              }
              className="flex items-center gap-1.5 h-8 px-3 text-xs rounded-xl"
              aria-label={`Besök hemsidan för ${place.name} (öppnas i ny flik)`}
            >
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              Hemsida
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
