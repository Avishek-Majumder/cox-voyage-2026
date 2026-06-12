import React from 'react';
import { MapPin, Calendar, Compass, Sun, Ticket, Building, Users } from 'lucide-react';
import TripCountdown from './TripCountdown';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#006CE4] to-[#003B95] dark:from-[#0E1B35] dark:to-[#050C1B] text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg mb-8 transition-all duration-300" id="hero-section">
      {/* Background overlay design elements */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-yellow-300 dark:bg-[#006CE4] opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-400 dark:bg-[#003B95] opacity-15 rounded-full blur-3xl"></div>
      
      {/* Soft Wave Graphic Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-white/10 backdrop-blur-[2px] rounded-t-2xl flex items-center justify-center">
        <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-sky-100 uppercase">
          ✈️ EXPLORE BANGLADESH • PREMIUM TRIP PLANNER
        </span>
      </div>

      <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-stretch gap-8 pb-6">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-sky-50 border border-white/20">
            <Sun className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-spin-slow" />
            Summer Trip Planner 2026
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight drop-shadow-sm">
            Cox Voyage <span className="text-yellow-300">2026</span>
          </h1>
          
          <p className="text-sky-100 font-medium text-sm sm:text-base max-w-xl leading-relaxed">
            All squad bookings locked in for 4 participants. Plan details, budget breakdowns, and hotel documents are fully finalized!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl pt-2">
            {/* Info Item 1: Dates */}
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-yellow-300 shrink-0" />
              <div>
                <span className="text-[10px] text-sky-200 uppercase tracking-wider block font-bold font-mono">Trip Dates</span>
                <span className="text-xs sm:text-sm font-bold text-white">18 Jun 2026 to 21 Jun 2026</span>
              </div>
            </div>

            {/* Info Item 2: Group Size */}
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10 flex items-center gap-3">
              <Users className="w-5 h-5 text-yellow-300 shrink-0" />
              <div>
                <span className="text-[10px] text-sky-200 uppercase tracking-wider block font-bold font-mono">Group Size</span>
                <span className="text-xs sm:text-sm font-bold text-white">4 People (Locked)</span>
              </div>
            </div>

            {/* Info Item 3: Transit */}
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10 flex items-center gap-3">
              <Compass className="w-5 h-5 text-yellow-300 shrink-0" />
              <div>
                <span className="text-[10px] text-sky-200 uppercase tracking-wider block font-bold font-mono">Transit Operator</span>
                <span className="text-xs sm:text-sm font-bold text-white">Shohagh Poribohon</span>
              </div>
            </div>

            {/* Info Item 4: Hotel */}
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10 flex items-center gap-3">
              <Building className="w-5 h-5 text-yellow-300 shrink-0" />
              <div>
                <span className="text-[10px] text-sky-200 uppercase tracking-wider block font-bold font-mono">Accommodations</span>
                <span className="text-xs sm:text-sm font-bold text-white">Hotel Grand Pacific</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Countdown and Status Badges Card */}
        <div className="w-full xl:w-[380px] bg-white/10 backdrop-blur-md rounded-2.5xl p-5 border border-white/15 flex flex-col justify-between space-y-4 font-sans">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2 text-white">
              <Compass className="w-4 h-4 text-yellow-300 animate-spin-slow" />
              <span className="text-xs font-bold tracking-wide uppercase">Journey Dashboard</span>
            </div>
            <span className="text-[9px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-md font-mono flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
              CONFIRMED
            </span>
          </div>

          {/* Real-time Trip Countdown component integration */}
          <TripCountdown />

          {/* Badges and short transit facts */}
          <div className="bg-black/15 p-3 rounded-xl border border-white/5 space-y-2 text-[11px] text-sky-100/90 font-sans">
            <div className="flex items-center justify-between">
              <span className="font-bold">🚌 Bus Tickets:</span>
              <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase">
                Tickets Booked
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold">🏨 Stay reservation:</span>
              <span className="bg-[#003B95] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase">
                Hotel Booked
              </span>
            </div>
            <div className="pt-1.5 border-t border-white/10 text-[10px] space-y-1 text-sky-150 leading-relaxed">
              <p>• Seats: <strong className="text-white font-mono">C2, C3, D2, D3</strong></p>
              <p>• Bus Reporting: <strong className="text-white">10:25 PM</strong> at Panthapath</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Schedule Row */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/15 text-sm">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-200 border border-orange-500/30">
            <Calendar className="w-4 h-4 text-orange-300 animate-pulse" />
          </div>
          <div>
            <p className="font-bold text-white">Thursday Night</p>
            <p className="text-xs text-sky-155 sm:text-sky-150">Dhaka Departure & Transit (Shohagh)</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-200 border border-yellow-500/30">
            <Compass className="w-4 h-4 text-yellow-300" />
          </div>
          <div>
            <p className="font-bold text-white">Fri & Sat Stay</p>
            <p className="text-xs text-sky-155 sm:text-sky-150 font-medium">Hotel Grand Pacific, Cox’s Bazar</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-500/30">
            <MapPin className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <p className="font-bold text-white">Sunday Return</p>
            <p className="text-xs text-sky-155 sm:text-sky-150">Checkout & return departure to Dhaka</p>
          </div>
        </div>
      </div>
    </div>
  );
}
