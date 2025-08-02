"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Cloud, Droplets, Wind } from "lucide-react";
import Image from "next/image";
import {
  getCurrentWeather,
  getWeatherIconUrl,
  getTemperatureColor,
  getWeatherEmoji,
  WeatherData,
} from "@/lib/openWeather";

interface WeatherWidgetProps {
  city?: string;
  compact?: boolean;
}

export default function WeatherWidget({
  city = "Karlstad",
  compact = false,
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const weatherData = await getCurrentWeather(city);
        if (!abortController.signal.aborted) {
          setWeather(weatherData);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError("Kunde inte hämta väderdata");
          console.error(err);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchWeather();
    
    return () => {
      abortController.abort();
    };
  }, [city]);

  if (loading) {
    return (
      <Card className={`city-card border-0 ${compact ? "p-3" : "p-4"}`}>
        <CardContent className={`${compact ? "p-0" : "p-0"} space-y-3`}>
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          {!compact && (
            <div className="flex gap-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="city-card border-0 p-4">
        <CardContent className="p-0 flex items-center gap-3">
          <Cloud className="h-8 w-8 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">Väderdata ej tillgänglig</p>
            <p className="text-xs text-gray-400">{city}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const tempColorClass = getTemperatureColor(weather.temperature);

  return (
    <Card
      className={`city-card border-0 hover:shadow-lg transition-shadow duration-200 ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <CardContent className={`${compact ? "p-0" : "p-0"} space-y-3`}>
        <div className="flex items-center gap-3">
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
            <Image
              src={getWeatherIconUrl(weather.icon)}
              alt={weather.description}
              width={48}
              height={48}
              className="h-12 w-12 drop-shadow-sm"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent && !parent.querySelector(".weather-emoji")) {
                  const emojiDiv = document.createElement("div");
                  emojiDiv.className =
                    "weather-emoji h-12 w-12 flex items-center justify-center text-2xl";
                  emojiDiv.innerHTML = getWeatherEmoji(weather.icon);
                  parent.appendChild(emojiDiv);
                }
              }}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${tempColorClass}`}>
                {weather.temperature}°
              </span>
              <Badge
                variant="secondary"
                className="bg-white/80 text-gray-600 text-xs px-2 py-0.5"
              >
                Känns som {weather.feelsLike}°
              </Badge>
            </div>
            <p className="text-sm text-gray-600 capitalize">
              {weather.description}
            </p>
            <p className="text-xs text-gray-400">{weather.location}</p>
          </div>
        </div>

        {!compact && (
          <div className="flex gap-4 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Droplets className="h-3.5 w-3.5" />
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Wind className="h-3.5 w-3.5" />
              <span>{weather.windSpeed} m/s</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
