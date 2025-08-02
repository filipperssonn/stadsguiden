"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export default function SearchFilter({
  onSearch,
  placeholder = "Sök efter restauranger, butiker eller sevärdheter...",
  initialValue = "",
}: SearchFilterProps) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl" role="search">
      <div className="relative">
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" 
          aria-hidden="true"
        />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-20 h-12 text-base rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-0 bg-white shadow-md"
          aria-label="Sökfält för platser"
          aria-describedby="search-help"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-xl"
              aria-label="Rensa sökfältet"
              title="Rensa sökfältet"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            className="h-8 px-3 city-primary hover:city-secondary rounded-xl font-semibold text-sm"
            aria-label="Starta sökning"
          >
            Sök
          </Button>
        </div>
      </div>
      <div id="search-help" className="sr-only">
        Använd sökfältet för att hitta restauranger, butiker och sevärdheter
      </div>
    </form>
  );
}
