export interface WeatherDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  rainProbability: number;
  windSpeed: number;
  weatherCode: number;
  weatherLabel: string;
  iconType: 'sunny' | 'cloudy' | 'foggy' | 'drizzle' | 'rainy' | 'snowy' | 'thunderstorm';
}

const CACHE_KEY = 'cox_voyage_weather_cache_v3';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 Hour caching

export function getWeatherConditionByCode(code: number): { label: string; iconType: WeatherDay['iconType'] } {
  if (code === 0) {
    return { label: 'Sunny/Clear', iconType: 'sunny' };
  } else if (code >= 1 && code <= 3) {
    return { label: 'Partly Cloudy', iconType: 'cloudy' };
  } else if (code === 45 || code === 48) {
    return { label: 'Foggy Mist', iconType: 'foggy' };
  } else if (code >= 51 && code <= 57) {
    return { label: 'Light Drizzle', iconType: 'drizzle' };
  } else if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return { label: 'Showers/Heavy Rain 🌧️', iconType: 'rainy' };
  } else if (code >= 71 && code <= 77) {
    return { label: 'Winter Snow', iconType: 'snowy' };
  } else if (code >= 95 && code <= 99) {
    return { label: 'Thunderstorms ⛈️', iconType: 'thunderstorm' };
  }
  return { label: 'Mild Breezes', iconType: 'sunny' };
}

export async function fetchCoxBazarWeather(): Promise<{ days: WeatherDay[]; source: 'api' | 'cache' }> {
  try {
    // Check localStorage cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const isNotExpired = Date.now() - parsed.timestamp < CACHE_TTL_MS;
      if (isNotExpired && parsed.data && parsed.data.length > 0) {
        return { days: parsed.data, source: 'cache' };
      }
    }
  } catch (err) {
    console.warn('LocalStorage weather reading err:', err);
  }

  // Lat and Lon of Cox's Bazar: 21.4272, 91.9715
  const API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=21.4272&longitude=91.9715&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,weathercode&timezone=auto';

  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error(`Weather request failed with status: ${res.status}`);
    }
    const data = await res.json();
    const daily = data.daily;

    if (!daily || !daily.time) {
      throw new Error('Invalid Open-Meteo response structure');
    }

    // Process up to 5 days, mapping them
    const days: WeatherDay[] = daily.time.slice(0, 4).map((timeStr: string, idx: number) => {
      const maxTemp = Math.round(daily.temperature_2m_max[idx]);
      const minTemp = Math.round(daily.temperature_2m_min[idx]);
      const rainProbability = Math.round(daily.precipitation_probability_max[idx] ?? 0);
      const windSpeed = Math.round(daily.wind_speed_10m_max[idx] ?? 0);
      const weatherCode = daily.weathercode[idx] ?? 0;
      const { label, iconType } = getWeatherConditionByCode(weatherCode);

      // Match to calendar dates of 18 Jun to 21 Jun 2026.
      // Since weather API gets current forecast, we map indices to the 4 planned days:
      // index 0 -> 18 June, index 1 -> 19 June, index 2 -> 20 June, index 3 -> 21 June
      const weekdays = ['Thursday 18 Jun', 'Friday 19 Jun', 'Saturday 20 Jun', 'Sunday 21 Jun'];
      const displayDate = weekdays[idx] || timeStr;

      return {
        date: displayDate,
        maxTemp,
        minTemp,
        rainProbability,
        windSpeed,
        weatherCode,
        weatherLabel: label,
        iconType
      };
    });

    // Save to local cache
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: days
      }));
    } catch (_) {}

    return { days, source: 'api' };
  } catch (error) {
    console.error('Failed to fetch open meteo weather API:', error);
    throw error;
  }
}
