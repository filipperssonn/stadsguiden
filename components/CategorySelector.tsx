"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Utensils, ShoppingBag, Camera, Star } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  types: string[];
}

const categories: Category[] = [
  {
    id: "all",
    name: "Alla",
    icon: <Star className="h-4 w-4" />,
    types: [],
  },
  {
    id: "restaurant",
    name: "Restauranger",
    icon: <Utensils className="h-4 w-4" />,
    types: ["restaurant", "food", "meal_takeaway", "cafe"],
  },
  {
    id: "store",
    name: "Butiker",
    icon: <ShoppingBag className="h-4 w-4" />,
    types: ["store", "shopping_mall", "clothing_store", "electronics_store"],
  },
  {
    id: "tourist_attraction",
    name: "Sevärdheter",
    icon: <Camera className="h-4 w-4" />,
    types: ["tourist_attraction", "museum", "art_gallery", "park"],
  },
];

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  resultsCount?: number;
}

export default function CategorySelector({
  selectedCategory,
  onCategoryChange,
  resultsCount,
}: CategorySelectorProps) {
  return (
    <div className="w-full space-y-4">
      <div 
        className="flex flex-wrap gap-2 justify-center sm:justify-start"
        role="group"
        aria-label="Välj kategori för platser"
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <Button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={`
                flex items-center gap-2 h-10 px-4 rounded-2xl border-2 font-semibold transition-all duration-200
                ${
                  isSelected
                    ? "city-primary border-primary shadow-md"
                    : "bg-white border-gray-200 text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5"
                }
              `}
              aria-pressed={isSelected}
              aria-label={`${isSelected ? 'Vald kategori' : 'Välj kategori'}: ${category.name}`}
            >
              <span aria-hidden="true">{category.icon}</span>
              <span>{category.name}</span>
            </Button>
          );
        })}
      </div>

      {resultsCount !== undefined && selectedCategory !== "all" && (
        <div className="flex justify-center sm:justify-start">
          <Badge
            variant="secondary"
            className="bg-gray-100 text-gray-600 px-3 py-1 rounded-xl"
          >
            {resultsCount} {resultsCount === 1 ? "resultat" : "resultat"}
          </Badge>
        </div>
      )}
    </div>
  );
}

export { categories };
