export type CurrentWeather = {
  temperatureC: number;
  feelsLikeC: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  updatedAt: string;
};

export type ForecastItem = {
  dateTime: string;
  temperatureC: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  rainProbability?: number; // pop from openweather as percentage (0 to 100)
};

export type CachedWeatherData = {
  timestamp: number;
  current: CurrentWeather;
  forecast: ForecastItem[];
};

const LAT = 21.4272;
const LON = 92.0058;
const CACHE_KEY = 'cox-voyage-openweather-cache';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache

export function getOpenWeatherApiKey(): string {
  const envKey = import.meta.env.VITE_OPENWEATHER_API_KEY as string | undefined;
  if (envKey && envKey.trim() !== '') {
    return envKey.trim();
  }
  // Fallback testing key
  return '167aa3fcef30a54cc8a44415d409ee3c';
}

export async function fetchCoxBazarOpenWeather(): Promise<{ current: CurrentWeather; forecast: ForecastItem[] }> {
  const apiKey = getOpenWeatherApiKey();
  
  if (!apiKey || apiKey === 'your_openweather_api_key') {
    throw new Error('API_KEY_MISSING');
  }

  // Check Cache first
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed: CachedWeatherData = JSON.parse(cached);
      const isNotExpired = Date.now() - parsed.timestamp < CACHE_TTL_MS;
      if (isNotExpired && parsed.current && parsed.forecast) {
        return { current: parsed.current, forecast: parsed.forecast };
      }
    }
  } catch (err) {
    console.warn('LocalStorage weather reading error:', err);
  }

  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&appid=${apiKey}`;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error(`Weather fetched failed. Statuses: current=${currentRes.status}, forecast=${forecastRes.status}`);
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    // Mapping Raw Current Weather
    const current: CurrentWeather = {
      temperatureC: Math.round(currentData.main.temp),
      feelsLikeC: Math.round(currentData.main.feels_like),
      condition: currentData.weather[0]?.main || 'Clear',
      description: currentData.weather[0]?.description || 'clear sky',
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
      icon: currentData.weather[0]?.icon || '01d',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Mapping Forecast weather. OpenWeather forecast returns every 3 hours.
    // We group them or select one representative node per day (e.g. 12:00 PM / mid-day nodes) for a clean 5-day view.
    const rawList = forecastData.list || [];
    const forecast: ForecastItem[] = [];
    const datesSeen = new Set<string>();

    for (const item of rawList) {
      const dt = new Date(item.dt * 1000);
      const dateString = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const timeString = dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      
      // We want to capture 1 mid-day representative forecast per day (or default to any if not found)
      // but only one per distinct date.
      const hours = dt.getHours();
      const isMidDay = hours >= 11 && hours <= 15;
      const isLastItem = rawList.indexOf(item) === rawList.length - 1;

      if (!datesSeen.has(dateString)) {
        // If we haven't seen this date or it's mid-day, let's add it. 
        // We'll prioritize mid-day, so if we can, we grab that or the first representation.
        if (isMidDay || isLastItem || forecast.length < 5) {
          datesSeen.add(dateString);
          forecast.push({
            dateTime: dateString,
            temperatureC: Math.round(item.main.temp),
            condition: item.weather[0]?.main || 'Clear',
            description: item.weather[0]?.description || 'clear sky',
            humidity: item.main.humidity,
            windSpeed: Math.round(item.wind.speed * 3.6),
            icon: item.weather[0]?.icon || '01d',
            rainProbability: item.pop ? Math.round(item.pop * 100) : 0,
          });
        }
      }
    }

    // Double check we have at most 5 forecast cards
    const finalForecast = forecast.slice(0, 5);

    // Save to Cache
    try {
      const cachePayload: CachedWeatherData = {
        timestamp: Date.now(),
        current,
        forecast: finalForecast,
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));
    } catch (_) {}

    return { current, forecast: finalForecast };
  } catch (error) {
    console.error('Failed to parse OpenWeather details:', error);
    throw error;
  }
}
