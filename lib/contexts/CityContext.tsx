"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CityContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  hasSelectedCity: boolean;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

interface CityProviderProps {
  children: ReactNode;
}

export function CityProvider({ children }: CityProviderProps) {
  const [selectedCity, setSelectedCityState] = useState<string>('');
  const [hasSelectedCity, setHasSelectedCity] = useState<boolean>(false);

  // Ladda sparad stad från localStorage vid start
  useEffect(() => {
    const savedCity = localStorage.getItem('stadsguiden-selected-city');
    if (savedCity) {
      setSelectedCityState(savedCity);
      setHasSelectedCity(true);
    }
  }, []);

  const setSelectedCity = (city: string) => {
    setSelectedCityState(city);
    setHasSelectedCity(city.length > 0);
    // Spara i localStorage för att komma ihåg användarens val
    if (city.length > 0) {
      localStorage.setItem('stadsguiden-selected-city', city);
    } else {
      localStorage.removeItem('stadsguiden-selected-city');
    }
  };

  const value = {
    selectedCity,
    setSelectedCity,
    hasSelectedCity
  };

  return (
    <CityContext.Provider value={value}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
}