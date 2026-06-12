import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, Compass } from 'lucide-react';

export default function TripCountdown() {
  const targetTimeStr = "2026-06-18T22:45:00+06:00";
  const reportingTimeStr = "2026-06-18T22:25:00+06:00";
  const checkInTimeStr = "2026-06-19T00:00:00+06:00";
  const checkOutTimeStr = "2026-06-21T23:59:59+06:00";

  const targetDate = new Date(targetTimeStr);
  const reportingDate = new Date(reportingTimeStr);
  const checkInDate = new Date(checkInTimeStr);
  const checkOutDate = new Date(checkOutTimeStr);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    status: 'active' // 'active' | 'reporting' | 'started' | 'inprogress' | 'completed'
  });

  useEffect(() => {
    function calculateTime() {
      const now = new Date();
      const nowMs = now.getTime();
      const targetMs = targetDate.getTime();
      const reportingMs = reportingDate.getTime();
      const checkInMs = checkInDate.getTime();
      const checkOutMs = checkOutDate.getTime();

      let status = 'active';

      if (nowMs >= checkOutMs) {
        status = 'completed';
      } else if (nowMs >= checkInMs) {
        status = 'inprogress';
      } else if (nowMs >= targetMs) {
        status = 'started';
      } else if (nowMs >= reportingMs) {
        status = 'reporting';
      }

      const diff = targetMs - nowMs;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, status });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, status });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  if (timeLeft.status === 'reporting') {
    return (
      <div className="bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-center space-y-2">
        <AlertCircle className="w-8 h-8 text-amber-500 dark:text-amber-400 mx-auto animate-pulse" />
        <h4 className="text-base font-bold text-amber-800 dark:text-amber-200">Reporting time has started. Please be at Panthapath.</h4>
        <span className="inline-block text-[11px] font-mono font-bold bg-amber-500 text-slate-950 px-3 py-1 rounded-full uppercase">
          Departure at 10:45 PM
        </span>
      </div>
    );
  }

  if (timeLeft.status === 'started') {
    return (
      <div className="bg-indigo-500/10 dark:bg-indigo-500/10 border border-indigo-505/30 rounded-2xl p-5 text-center space-y-2">
        <Compass className="w-8 h-8 text-indigo-500 dark:text-indigo-400 mx-auto animate-bounce" />
        <h4 className="text-base font-bold text-indigo-800 dark:text-indigo-200">Tour has started.</h4>
        <p className="text-xs text-indigo-700 dark:text-indigo-100 font-medium">Shohagh Poribohon is on its way to Cox’s Bazar!</p>
      </div>
    );
  }

  if (timeLeft.status === 'inprogress') {
    return (
      <div className="bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-center space-y-2">
        <span className="text-2xl block">🌴</span>
        <h4 className="text-base font-bold text-emerald-800 dark:text-emerald-205">Cox Voyage 2026 is in progress.</h4>
      </div>
    );
  }

  if (timeLeft.status === 'completed') {
    return (
      <div className="bg-slate-500/10 dark:bg-slate-500/15 border border-slate-505/25 rounded-2xl p-5 text-center space-y-2">
        <span className="text-2xl block">✨</span>
        <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">Cox Voyage 2026 completed.</h4>
      </div>
    );
  }

  return (
    <div className="font-sans w-full space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-200 tracking-wider flex items-center gap-1.5 leading-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
            Tour starts in
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
            Shohagh Poribohon departs from Panthapath at 10:45 PM
          </p>
        </div>
        <span className="self-start sm:self-center text-[10.5px] font-black bg-rose-500 text-white rounded-lg px-2.5 py-1 font-sans shadow-xs flex items-center gap-1 leading-normal">
          <Clock className="w-3.5 h-3.5" />
          Report by 10:25 PM
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
        {/* Days */}
        <div className="bg-white/40 dark:bg-black/25 backdrop-blur-sm border border-slate-205/50 dark:border-white/10 rounded-xl py-2 px-1">
          <span className="block text-xl sm:text-2xl font-black text-slate-800 dark:text-white font-mono leading-none">
            {formatNumber(timeLeft.days)}
          </span>
          <span className="text-[9px] uppercase tracking-wide text-slate-500 dark:text-indigo-250 font-bold block mt-1">
            Days
          </span>
        </div>

        {/* Hours */}
        <div className="bg-white/40 dark:bg-black/25 backdrop-blur-sm border border-slate-205/50 dark:border-white/10 rounded-xl py-2 px-1">
          <span className="block text-xl sm:text-2xl font-black text-slate-800 dark:text-white font-mono leading-none">
            {formatNumber(timeLeft.hours)}
          </span>
          <span className="text-[9px] uppercase tracking-wide text-slate-500 dark:text-indigo-250 font-bold block mt-1">
            Hours
          </span>
        </div>

        {/* Minutes */}
        <div className="bg-white/40 dark:bg-black/25 backdrop-blur-sm border border-slate-205/50 dark:border-white/10 rounded-xl py-2 px-1">
          <span className="block text-xl sm:text-2xl font-black text-slate-800 dark:text-white font-mono leading-none">
            {formatNumber(timeLeft.minutes)}
          </span>
          <span className="text-[9px] uppercase tracking-wide text-slate-500 dark:text-indigo-250 font-bold block mt-1">
            Minutes
          </span>
        </div>

        {/* Seconds */}
        <div className="bg-white/40 dark:bg-black/25 backdrop-blur-sm border border-slate-205/50 dark:border-white/10 rounded-xl py-2 px-1">
          <span className="block text-xl sm:text-2xl font-black text-yellow-600 dark:text-yellow-300 font-mono leading-none">
            {formatNumber(timeLeft.seconds)}
          </span>
          <span className="text-[9px] uppercase tracking-wide text-slate-500 dark:text-indigo-250 font-bold block mt-1">
            Seconds
          </span>
        </div>
      </div>
    </div>
  );
}
