import React, { useEffect, useState } from 'react';
import { Cloud, Sun, Droplets, Wind, RefreshCw, AlertCircle, CalendarRange } from 'lucide-react';
import { fetchCoxBazarOpenWeather, CurrentWeather, ForecastItem, getOpenWeatherApiKey } from '../services/openWeatherService';

export default function WeatherDashboard() {
  const [data, setData] = useState<{ current: CurrentWeather; forecast: ForecastItem[] } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorStatus, setErrorStatus] = useState<'none' | 'missing_key' | 'failed'>('none');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadWeatherData = async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setErrorStatus('none');

    try {
      const apiKey = getOpenWeatherApiKey();
      if (!apiKey || apiKey === '' || apiKey === 'your_openweather_api_key') {
        setErrorStatus('missing_key');
        setLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (forceRefresh) {
        localStorage.removeItem('cox-voyage-openweather-cache');
      }

      const weatherResult = await fetchCoxBazarOpenWeather();
      setData(weatherResult);
    } catch (err: any) {
      console.error('Weather dashboard error:', err);
      if (err?.message === 'API_KEY_MISSING') {
        setErrorStatus('missing_key');
      } else {
        setErrorStatus('failed');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
  }, []);

  const handleRefresh = () => {
    loadWeatherData(true);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#0F1A30] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-10"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-hidden">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex-1 min-w-[80px] h-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (errorStatus === 'missing_key') {
    return (
      <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900 rounded-2xl p-6 text-center">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2.5" />
        <h4 className="font-extrabold text-amber-950 dark:text-amber-200 text-sm mb-1">
          OpenWeather API Key Missing
        </h4>
        <p className="text-amber-800 dark:text-amber-300 text-xs max-w-md mx-auto leading-relaxed">
          OpenWeather API key is not configured yet. Configure <code className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-[10.5px] font-mono">VITE_OPENWEATHER_API_KEY</code> to enable real-time local weather updates.
        </p>
      </div>
    );
  }

  if (errorStatus === 'failed' || !data) {
    return (
      <div className="bg-rose-50/80 dark:bg-rose-950/20 border border-rose-300 dark:border-rose-900 rounded-2xl p-6 text-center shadow-xs">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2.5" />
        <p className="text-rose-900 dark:text-rose-200 font-extrabold text-sm mb-2">
          Could not load live weather. Please try again later.
        </p>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Fetching
        </button>
      </div>
    );
  }

  const { current, forecast } = data;

  return (
    <div className="bg-white dark:bg-[#0F1A30] rounded-2xl border border-slate-250 dark:border-slate-800/80 shadow-xs mb-8 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-150 dark:border-slate-800/80 bg-slate-50/85 dark:bg-[#14223A]/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-lg shadow-xxs">
            <Cloud className="w-4 h-4 text-sky-500 animate-pulse" />
          </div>
          <div>
            <h3 className="font-black text-slate-850 dark:text-white text-[13px] tracking-tight uppercase">
              Live Cox’s Bazar Weather
            </h3>
            <p className="text-[10px] text-slate-550 dark:text-slate-400 font-medium">
              Coordinates: <span className="font-mono">21.4272° N, 92.0058° E</span>
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition duration-150 disabled:opacity-50 flex items-center gap-1 text-[11px] font-bold cursor-pointer hover:border-slate-300 dark:hover:border-slate-705 border border-transparent"
          title="Force weather sync"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Current weather Left */}
        <div className="lg:col-span-5 bg-gradient-to-br from-sky-50 to-slate-50 dark:from-[#112036] dark:to-[#17273F] p-5 rounded-2xl border border-sky-100/60 dark:border-slate-800 overflow-hidden relative">
          <span className="absolute top-3 right-3 text-[9px] font-bold text-slate-500 bg-white/70 dark:bg-black/30 px-1.5 py-0.5 rounded font-mono">
            UPDATED {current.updatedAt}
          </span>
          <div className="flex items-center gap-3">
            <img
              src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
              alt={current.condition}
              className="w-16 h-16 object-contain pointer-events-none drop-shadow-sm select-none"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-extrabold text-4xl text-slate-900 dark:text-white tracking-tight text-shadow-sm">
                  {current.temperatureC}°C
                </span>
                <span className="text-slate-505 dark:text-slate-400 text-xs font-bold leading-none">
                  / Feels {current.feelsLikeC}°
                </span>
              </div>
              <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 capitalize mt-0.5">
                {current.condition} &mdash; <span className="font-normal text-slate-505 dark:text-slate-400">{current.description}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mt-5">
            <div className="bg-white/80 dark:bg-black/15 p-2 rounded-xl text-center border border-slate-150/40 dark:border-transparent">
              <Droplets className="w-3.5 h-3.5 text-blue-500 mx-auto mb-1 stroke-[2.5]" />
              <span className="block text-[9px] text-slate-505 dark:text-slate-400 font-bold uppercase">
                Humidity
              </span>
              <span className="font-extrabold text-slate-800 dark:text-white text-xs font-mono">
                {current.humidity}%
              </span>
            </div>
            <div className="bg-white/80 dark:bg-black/15 p-2 rounded-xl text-center border border-slate-150/40 dark:border-transparent">
              <Wind className="w-3.5 h-3.5 text-teal-500 mx-auto mb-1 stroke-[2.5]" />
              <span className="block text-[9px] text-slate-505 dark:text-slate-400 font-bold uppercase">
                Wind
              </span>
              <span className="font-extrabold text-slate-800 dark:text-white text-xs font-mono">
                {current.windSpeed} km/h
              </span>
            </div>
            <div className="bg-white/80 dark:bg-black/15 p-2 rounded-xl text-center border border-slate-150/40 dark:border-transparent">
              <Sun className="w-3.5 h-3.5 text-amber-500 mx-auto mb-1 stroke-[2.5]" />
              <span className="block text-[9px] text-slate-550 dark:text-slate-400 font-bold uppercase">
                Location
              </span>
              <span className="font-bold text-slate-800 dark:text-white text-[10.5px] tracking-tight truncate block">
                Cox's Bazar
              </span>
            </div>
          </div>
        </div>

        {/* Forecast weather Right */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-3">
              5-Day Outlook (Live Forecast)
            </span>
            <div className="flex gap-2.5 overflow-x-auto pb-2 snap-x scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
              {forecast.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 min-w-[105px] bg-slate-50 dark:bg-[#15233C]/60 border border-slate-205 dark:border-slate-800 p-2.5 rounded-xl snap-align-none flex flex-col items-center justify-between shadow-xxs"
                >
                  <span className="text-[10px] font-black text-slate-650 dark:text-slate-300 block mb-1">
                    {item.dateTime.split(',')[0]}
                  </span>
                  <img
                    src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                    alt={item.condition}
                    className="w-10 h-10 object-contain drop-shadow-xxs pointer-events-none select-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-center mt-1">
                    <span className="font-black text-slate-900 dark:text-white text-[13px] font-mono block">
                      {item.temperatureC}°C
                    </span>
                    <span className="text-[9px] text-slate-505 dark:text-slate-400 block truncate max-w-[90px] font-medium leading-tight">
                      {item.condition}
                    </span>
                  </div>
                  {item.rainProbability !== undefined && item.rainProbability > 0 && (
                    <span className="mt-1.5 text-[8.5px] font-bold text-sky-500 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-1.5 py-0.5 rounded font-mono">
                      💧{item.rainProbability}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* June 2026 Future Note Warning */}
          <div className="mt-4 bg-amber-50/70 dark:bg-amber-950/15 border border-amber-200 dark:border-amber-900/65 rounded-xl p-3 flex items-start gap-2">
            <CalendarRange className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed font-medium">
              <span className="font-extrabold text-amber-950 dark:text-amber-200 block md:inline mr-1">
                📅 Trip Dates (18 Jun – 21 Jun 2026):
              </span>
              Trip-date forecast is not available yet. Live forecast will appear closer to the travel date. Current readings show live weather in Cox’s Bazar right now.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
