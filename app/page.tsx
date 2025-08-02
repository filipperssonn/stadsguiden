"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SearchFilter from "@/components/SearchFilter";
import CategorySelector from "@/components/CategorySelector";
import WeatherWidget from "@/components/WeatherWidget";
import CitySelector from "@/components/CitySelector";
import { useCity } from "@/lib/contexts/CityContext";
import { MapPin, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  generateOrganizationJsonLd,
  generateWebsiteJsonLd,
} from "@/lib/seo/jsonLd";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const router = useRouter();
  const { selectedCity, setSelectedCity, hasSelectedCity } = useCity();

  const handleSearch = (query: string) => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedCity) params.set("city", selectedCity);

    router.push(`/places?${params.toString()}`);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleQuickSearch = (searchTerm: string, category?: string) => {
    const params = new URLSearchParams();
    params.set("q", searchTerm);
    if (category && category !== "all") params.set("category", category);

    router.push(`/places?${params.toString()}`);
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateOrganizationJsonLd(selectedCity)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateWebsiteJsonLd(selectedCity)),
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0"
              >
                <Image
                  src="/stadsguiden-logo.svg"
                  alt="Stadsguiden - Upptäck din stad"
                  width={180}
                  height={40}
                  priority
                  className="max-w-none"
                />
              </Link>
              <Suspense fallback={<div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />}>
                <WeatherWidget compact city={selectedCity || "Stockholm"} />
              </Suspense>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main id="main-content" className="container mx-auto px-4 py-12 space-y-12">
          {!hasSelectedCity ? (
            /* Stadsväljare när ingen stad är vald */
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Upptäck <span className="text-yellow-500">din stad</span>
                  <span className="block text-gray-900">
                    på ett nytt sätt
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Hitta de bästa restaurangerna, butikerna och sevärdheterna i 
                  din stad. Välj din stad nedan för att komma igång.
                </p>
              </div>
              
              <CitySelector onCitySelect={handleCitySelect} />
            </div>
          ) : (
            /* Huvudsida när stad är vald */
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Upptäck <span className="text-yellow-500">{selectedCity}</span>
                  <span className="block text-gray-900">
                    på ett nytt sätt
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Hitta de bästa restaurangerna, butikerna och sevärdheterna i{" "}
                  {selectedCity}. Allt du behöver för att utforska staden finns här.
                </p>
                
                {/* Knapp för att byta stad */}
                <Button
                  variant="outline"
                  onClick={() => setSelectedCity("")}
                  className="gap-2 hover:bg-primary hover:text-white"
                  aria-label="Byt stad"
                >
                  <MapPin className="h-4 w-4" />
                  Byt stad
                </Button>
              </div>

              {/* Search Section */}
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-xl">
                <div className="space-y-6">
                  <SearchFilter
                    onSearch={handleSearch}
                    placeholder={`Vad letar du efter i ${selectedCity}?`}
                  />

                  <CategorySelector
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions - bara visa när stad är vald */}
          {hasSelectedCity && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card
              className="city-card border-0 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleQuickSearch("restaurang", "restaurant")}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 city-primary rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Populära Restauranger
                  </h3>
                  <p className="text-gray-600">
                    Upptäck de bäst betygsatta restaurangerna i staden
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="city-card border-0 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleQuickSearch("museum", "tourist_attraction")}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 city-secondary rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Sevärdheter
                  </h3>
                  <p className="text-gray-600">
                    Utforska museer, parker och kulturella platser
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="city-card border-0 hover:shadow-xl transition-all duration-300 cursor-pointer group md:col-span-2 lg:col-span-1"
              onClick={() => handleQuickSearch("butik", "store")}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Shopping
                  </h3>
                  <p className="text-gray-600">
                    Hitta unika butiker och köpcentrum
                  </p>
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {/* Weather Section - bara visa när stad är vald */}
          {hasSelectedCity && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Dagens väder i {selectedCity}
              </h2>
              <Suspense fallback={<div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />}>
                <WeatherWidget city={selectedCity} />
              </Suspense>
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Redo att utforska?</h2>
              <p className="text-xl mb-6 opacity-90">
                Starta din upptäcktsresa genom staden idag
              </p>
              <Button
                onClick={() => router.push("/places")}
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 rounded-2xl font-bold px-8 py-3 text-lg"
              >
                Börja utforska
              </Button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-100 mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-gray-600">
              <p>
                &copy; 2025 Stadsguiden. Byggd med ❤️ för att upptäcka din stad.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
