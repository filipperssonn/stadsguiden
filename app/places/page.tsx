"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SearchFilter from "@/components/SearchFilter";
import CategorySelector from "@/components/CategorySelector";
import AdvancedFilters, { FilterOptions } from "@/components/AdvancedFilters";
import PlaceCard from "@/components/PlaceCard";
import WeatherWidget from "@/components/WeatherWidget";
import { searchPlaces, Place } from "@/lib/googlePlaces";
import { useCity } from "@/lib/contexts/CityContext";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function PlacesContent() {
  const searchParams = useSearchParams();
  const { selectedCity } = useCity();
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "all";
  const cityFromUrl = searchParams.get("city");
  const currentCity = cityFromUrl || selectedCity || "Stockholm";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [filters, setFilters] = useState<FilterOptions>({
    nameSearch: '',
    ratingFilter: 'all',
    openNow: false,
    sortBy: 'relevance',
  });

  // Filtrera och sortera platser
  const applyFilters = (placesToFilter: Place[], currentFilters: FilterOptions) => {
    let filtered = [...placesToFilter];

    // Filtrera efter namn
    if (currentFilters.nameSearch.trim()) {
      const searchTerm = currentFilters.nameSearch.toLowerCase();
      filtered = filtered.filter(place => 
        place.name.toLowerCase().includes(searchTerm) ||
        place.formatted_address.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrera efter betyg
    if (currentFilters.ratingFilter !== 'all' && filtered.length > 0) {
      filtered = filtered.filter(place => {
        if (!place.rating) return currentFilters.ratingFilter === 'low';
        
        switch (currentFilters.ratingFilter) {
          case 'high':
            return place.rating >= 4.0;
          case 'medium':
            return place.rating >= 3.0 && place.rating < 4.0;
          case 'low':
            return place.rating < 3.0;
          default:
            return true;
        }
      });
    }

    // Filtrera efter "öppet nu"
    if (currentFilters.openNow) {
      filtered = filtered.filter(place => 
        place.opening_hours?.open_now === true
      );
    }

    // Sortera resultat
    switch (currentFilters.sortBy) {
      case 'rating_high':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'rating_low':
        filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'sv'));
        break;
      case 'relevance':
      default:
        // Behåll ursprunglig ordning (relevans från Google)
        break;
    }

    setFilteredPlaces(filtered);
  };

  const performSearch = useCallback(async (searchQuery: string, category: string) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const results = await searchPlaces(
        searchQuery,
        currentCity,
        category === "all" ? undefined : category
      );
      setPlaces(results);
      applyFilters(results, filters);
    } catch (err) {
      setError("Något gick fel vid sökningen. Försök igen.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentCity, filters]);

  // Initial search on page load
  useEffect(() => {
    if (initialQuery || initialCategory !== "all") {
      performSearch(initialQuery, initialCategory);
    }
  }, [initialQuery, initialCategory, performSearch]);

  // Apply filters when they change
  useEffect(() => {
    if (places.length > 0) {
      applyFilters(places, filters);
    }
  }, [filters, places]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    performSearch(newQuery, selectedCategory);

    // Update URL
    const params = new URLSearchParams();
    if (newQuery.trim()) params.set("q", newQuery.trim());
    if (selectedCategory !== "all") params.set("category", selectedCategory);

    window.history.replaceState({}, "", `?${params.toString()}`);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    performSearch(query, categoryId);

    // Update URL
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (categoryId !== "all") params.set("category", categoryId);

    window.history.replaceState({}, "", `?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="rounded-xl">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Tillbaka
                </Button>
              </Link>
              <Link
                href="/"
                className="flex items-center hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0"
              >
                <Image
                  src="/stadsguiden-logo.svg"
                  alt="Stadsguiden"
                  width={160}
                  height={50}
                  priority
                  className="max-w-none"
                />
              </Link>
            </div>
            <WeatherWidget compact city={currentCity} />
          </div>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-8 space-y-8">
        {/* Search Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-gray-100 shadow-lg">
          <div className="space-y-6">
            <SearchFilter
              onSearch={handleSearch}
              initialValue={query}
              placeholder="Förfina din sökning..."
            />

            <CategorySelector
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              resultsCount={filteredPlaces.length}
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {hasSearched && (
          <AdvancedFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            resultsCount={filteredPlaces.length}
            isExpanded={filtersExpanded}
            onToggleExpanded={() => setFiltersExpanded(!filtersExpanded)}
          />
        )}

        {/* Results Section */}
        <div className="space-y-6">
          {/* Results Header */}
          {hasSearched && (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading
                    ? "Söker..."
                    : `${filteredPlaces.length} ${
                        filteredPlaces.length === 1 ? "resultat" : "resultat"
                      }`}
                </h2>
                {query && (
                  <p className="text-gray-600">
                    för &quot;{query}&quot;{" "}
                    {selectedCategory !== "all" &&
                      `i kategorin ${selectedCategory}`}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="city-card border-0">
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="city-card border-0 p-8 text-center">
              <CardContent className="p-0 space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-2xl mx-auto flex items-center justify-center">
                  <Search className="h-8 w-8 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Något gick fel
                  </h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button
                    onClick={() => performSearch(query, selectedCategory)}
                    className="city-primary hover:city-secondary rounded-2xl"
                  >
                    Försök igen
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Results */}
          {!loading && !error && hasSearched && filteredPlaces.length === 0 && places.length > 0 && (
            <Card className="city-card border-0 p-8 text-center">
              <CardContent className="p-0 space-y-4">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl mx-auto flex items-center justify-center">
                  <Search className="h-8 w-8 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Inga resultat med aktuella filter
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Prova att justera dina filter eller rensa alla filter för att se fler resultat.
                  </p>
                  <Button
                    onClick={() => handleFiltersChange({
                      nameSearch: '',
                      ratingFilter: 'all',
                      openNow: false,
                      sortBy: 'relevance',
                    })}
                    className="city-primary hover:city-secondary rounded-2xl"
                  >
                    Rensa alla filter
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Search Results */}
          {!loading && !error && hasSearched && places.length === 0 && (
            <Card className="city-card border-0 p-8 text-center">
              <CardContent className="p-0 space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Inga resultat hittades
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Prova att ändra dina söktermer eller välja en annan
                    kategori.
                  </p>
                  <Button
                    onClick={() => {
                      setQuery("");
                      setSelectedCategory("all");
                      handleSearch("");
                    }}
                    variant="outline"
                    className="rounded-2xl"
                  >
                    Rensa sökning
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Grid */}
          {!loading && !error && filteredPlaces.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((place) => (
                <PlaceCard key={place.place_id} place={place} />
              ))}
            </div>
          )}

          {/* Initial State */}
          {!hasSearched && !loading && (
            <Card className="city-card border-0 p-8 text-center">
              <CardContent className="p-0 space-y-4">
                <div className="w-16 h-16 city-primary rounded-2xl mx-auto flex items-center justify-center">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Välkommen till sökningen
                  </h3>
                  <p className="text-gray-600">
                    Använd sökfältet ovan eller välj en kategori för att hitta
                    platser.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

export default function PlacesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-12 w-full mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-64 w-full" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <PlacesContent />
    </Suspense>
  );
}
