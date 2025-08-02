"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";

interface CitySelectorProps {
  onCitySelect: (city: string) => void;
  defaultCity?: string;
}

// Populära svenska städer för snabbval
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

export default function CitySelector({ onCitySelect, defaultCity }: CitySelectorProps) {
  const [customCity, setCustomCity] = useState(defaultCity || "");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCityClick = (city: string) => {
    onCitySelect(city);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCity.trim()) {
      onCitySelect(customCity.trim());
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <MapPin className="h-6 w-6 text-primary" aria-hidden="true" />
          <CardTitle className="text-2xl font-bold text-gray-900">
            Välj din stad
          </CardTitle>
        </div>
        <p className="text-gray-600 text-lg">
          Upptäck de bästa platserna i din stad eller den stad du vill besöka
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Populära städer grid */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Populära städer
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {popularCities.map((city) => (
              <Button
                key={city}
                variant="outline"
                size="sm"
                onClick={() => handleCityClick(city)}
                className="h-10 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={`Välj ${city}`}
              >
                {city}
              </Button>
            ))}
          </div>
        </div>

        {/* Annan stad sektion */}
        <div className="border-t pt-6">
          {!showCustomInput ? (
            <div className="text-center">
              <p className="text-gray-600 mb-3">Hittar du inte din stad?</p>
              <Button
                variant="outline"
                onClick={() => setShowCustomInput(true)}
                className="gap-2 hover:bg-primary hover:text-white hover:border-primary"
                aria-label="Skriv in egen stad"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Skriv in din stad
              </Button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <label htmlFor="custom-city" className="block text-sm font-medium text-gray-700">
                Skriv in din stad:
              </label>
              <div className="flex gap-2">
                <Input
                  id="custom-city"
                  type="text"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  placeholder="T.ex. Kiruna, Visby, Haparanda..."
                  className="flex-1 focus:ring-2 focus:ring-primary focus:border-primary"
                  autoFocus
                  aria-describedby="custom-city-help"
                />
                <Button 
                  type="submit" 
                  disabled={!customCity.trim()}
                  className="bg-primary hover:bg-primary/90"
                  aria-label="Bekräfta stadsvalet"
                >
                  Välj
                </Button>
              </div>
              <p id="custom-city-help" className="text-xs text-gray-500">
                Skriv namnet på den stad du vill utforska
              </p>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
}