"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  Clock, 
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X
} from "lucide-react";

export interface FilterOptions {
  nameSearch: string;
  ratingFilter: 'all' | 'high' | 'medium' | 'low';
  openNow: boolean;
  sortBy: 'relevance' | 'rating_high' | 'rating_low' | 'name';
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  resultsCount: number;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export default function AdvancedFilters({
  filters,
  onFiltersChange,
  resultsCount,
  isExpanded,
  onToggleExpanded,
}: AdvancedFiltersProps) {
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      nameSearch: '',
      ratingFilter: 'all',
      openNow: false,
      sortBy: 'relevance',
    });
  };

  const activeFiltersCount = [
    filters.nameSearch.length > 0,
    filters.ratingFilter !== 'all',
    filters.openNow,
    filters.sortBy !== 'relevance',
  ].filter(Boolean).length;

  const getRatingFilterText = (rating: string) => {
    switch (rating) {
      case 'high': return 'Högt betyg (4.0+)';
      case 'medium': return 'Medel betyg (3.0-3.9)';
      case 'low': return 'Lågt betyg (<3.0)';
      default: return 'Alla betyg';
    }
  };

  const getSortText = (sort: string) => {
    switch (sort) {
      case 'rating_high': return 'Högsta betyg först';
      case 'rating_low': return 'Lägsta betyg först';
      case 'name': return 'Alfabetisk ordning';
      default: return 'Relevans';
    }
  };

  return (
    <Card className="city-card border-0 mb-6">
      <CardContent className="p-4">
        {/* Filter Toggle & Summary */}
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onToggleExpanded}
            variant="outline"
            className="flex items-center gap-2 h-10 px-4 rounded-xl border-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filter & Sortering</span>
            {activeFiltersCount > 0 && (
              <Badge className="bg-primary text-primary-foreground ml-2 px-2 py-0.5 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {resultsCount} {resultsCount === 1 ? "resultat" : "resultat"}
            </span>
            {activeFiltersCount > 0 && (
              <Button
                onClick={clearAllFilters}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 h-8 px-2"
              >
                <X className="h-4 w-4" />
                Rensa filter
              </Button>
            )}
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-6">
            <Separator />

            {/* Name Search */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Sök efter namn
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  value={filters.nameSearch}
                  onChange={(e) => updateFilter('nameSearch', e.target.value)}
                  placeholder="Skriv platsens namn..."
                  className="pl-10 h-10 rounded-xl border-2 border-gray-200 focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Filtrera efter betyg
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'Alla betyg', stars: null },
                    { value: 'high', label: 'Högt betyg', stars: '4.0+' },
                    { value: 'medium', label: 'Medel betyg', stars: '3.0-3.9' },
                    { value: 'low', label: 'Lågt betyg', stars: '<3.0' },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      onClick={() => updateFilter('ratingFilter', option.value)}
                      variant={filters.ratingFilter === option.value ? "default" : "outline"}
                      className={`w-full justify-start h-10 rounded-lg ${
                        filters.ratingFilter === option.value
                          ? "city-primary"
                          : "bg-white border-gray-200 hover:border-primary"
                      }`}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      <span className="flex-1 text-left">{option.label}</span>
                      {option.stars && (
                        <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600 text-xs">
                          {option.stars}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Sortera resultat
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'relevance', label: 'Relevans', icon: ArrowUpDown },
                    { value: 'rating_high', label: 'Högsta betyg först', icon: ArrowDown },
                    { value: 'rating_low', label: 'Lägsta betyg först', icon: ArrowUp },
                    { value: 'name', label: 'Alfabetisk ordning', icon: ArrowUpDown },
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <Button
                        key={option.value}
                        onClick={() => updateFilter('sortBy', option.value)}
                        variant={filters.sortBy === option.value ? "default" : "outline"}
                        className={`w-full justify-start h-10 rounded-lg ${
                          filters.sortBy === option.value
                            ? "city-primary"
                            : "bg-white border-gray-200 hover:border-primary"
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        <span className="flex-1 text-left">{option.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Open Now Toggle */}
            <div>
              <Button
                onClick={() => updateFilter('openNow', !filters.openNow)}
                variant={filters.openNow ? "default" : "outline"}
                className={`flex items-center gap-2 h-12 px-6 rounded-2xl border-2 font-semibold ${
                  filters.openNow
                    ? "city-primary border-primary"
                    : "bg-white border-gray-200 hover:border-green-300 hover:text-green-700"
                }`}
              >
                <Clock className="h-5 w-5" />
                <span>Visa endast öppet nu</span>
                {filters.openNow && (
                  <Badge className="bg-green-100 text-green-700 ml-2">
                    Aktivt
                  </Badge>
                )}
              </Button>
            </div>

            {/* Active Filters Summary */}
            {activeFiltersCount > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Aktiva filter:
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.nameSearch && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      Namn: "{filters.nameSearch}"
                    </Badge>
                  )}
                  {filters.ratingFilter !== 'all' && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                      {getRatingFilterText(filters.ratingFilter)}
                    </Badge>
                  )}
                  {filters.openNow && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Öppet nu
                    </Badge>
                  )}
                  {filters.sortBy !== 'relevance' && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      {getSortText(filters.sortBy)}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}