"use client";

import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink } from "lucide-react";
import { Place, getGoogleMapsUrl } from "@/lib/googlePlaces";

interface MapButtonProps {
  place: Place;
  variant?: "default" | "compact";
  className?: string;
}

export default function MapButton({
  place,
  variant = "default",
  className = "",
}: MapButtonProps) {
  const handleOpenMaps = () => {
    const mapsUrl = getGoogleMapsUrl(place);
    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  };

  if (variant === "compact") {
    return (
      <Button
        onClick={handleOpenMaps}
        variant="outline"
        size="sm"
        className={`flex items-center gap-1.5 h-8 px-3 text-xs border-primary text-primary hover:bg-primary hover:text-white rounded-xl transition-colors ${className}`}
      >
        <MapPin className="h-3.5 w-3.5" />
        <span>Karta</span>
        <ExternalLink className="h-3 w-3" />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleOpenMaps}
      variant="outline"
      className={`flex items-center gap-2 h-10 px-4 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-2xl font-semibold transition-all duration-200 ${className}`}
    >
      <MapPin className="h-4 w-4" />
      <span>Visa på karta</span>
      <ExternalLink className="h-4 w-4" />
    </Button>
  );
}
