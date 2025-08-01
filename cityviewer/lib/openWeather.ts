// OpenWeatherMap API integration
export interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY || process.env.NEXT_PUBLIC_OPENWEATHER_KEY;


export async function getCurrentWeather(city: string = "Karlstad"): Promise<WeatherData | null> {
  // Kontrollera om vi har giltig API-nyckel
  if (!OPENWEATHER_KEY || OPENWEATHER_KEY.includes('your_')) {
    console.error('❌ Ingen giltig OpenWeatherMap API-nyckel konfigurerad');
    return null;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_KEY}&units=metric&lang=sv`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenWeatherMap API fel:', response.status, errorText);
      throw new Error(`OpenWeatherMap API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    return {
      location: data.name,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      feelsLike: Math.round(data.main.feels_like)
    };
  } catch (error) {
    console.error('❌ Fel vid hämtning av väderdata:', error);
    return null; // Returnera null vid fel
  }
}

export function getWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

export function getTemperatureColor(temp: number): string {
  if (temp >= 20) return "text-orange-600";
  if (temp >= 10) return "text-yellow-600"; 
  if (temp >= 0) return "text-blue-500";
  return "text-blue-700";
}

export function getWeatherEmoji(icon: string): string {
  const emojiMap: { [key: string]: string } = {
    '01d': '☀️', // clear sky day
    '01n': '🌙', // clear sky night
    '02d': '⛅', // few clouds day
    '02n': '☁️', // few clouds night
    '03d': '☁️', // scattered clouds
    '03n': '☁️',
    '04d': '☁️', // broken clouds
    '04n': '☁️',
    '09d': '🌧️', // shower rain
    '09n': '🌧️',
    '10d': '🌦️', // rain day
    '10n': '🌧️', // rain night
    '11d': '⛈️', // thunderstorm
    '11n': '⛈️',
    '13d': '🌨️', // snow
    '13n': '🌨️',
    '50d': '🌫️', // mist
    '50n': '🌫️'
  };
  return emojiMap[icon] || '🌤️';
}