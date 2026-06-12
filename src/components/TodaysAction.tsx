import React, { useState, useEffect } from 'react';
import { AlertCircle, Calendar, CheckCircle2, MapPin, Key, Compass } from 'lucide-react';

export default function TodaysAction() {
  const [currentAction, setCurrentAction] = useState({
    title: 'Keep documents ready',
    description: 'Keep your ticket, invoice, voucher, and NID/passport ready.',
    badge: 'Pre-Trip Preparation',
    icon: 'docs'
  });

  useEffect(() => {
    function evaluateAction() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth(); // 0-indexed
      const date = now.getDate();
      
      // Let's get timestamps for targets on June 18, 19, 21 in Dhaka local time (UTC+6)
      // Since the app might be viewed in other timezones, we can parse specific ISO strings with +06:00
      const nowMs = now.getTime();
      
      const reportingMs = new Date("2026-06-18T22:25:00+06:00").getTime();
      const departureMs = new Date("2026-06-18T22:45:00+06:00").getTime();
      const day18StartMs = new Date("2026-06-18T00:00:00+06:00").getTime();
      const checkInStartMs = new Date("2026-06-19T00:00:00+06:00").getTime();
      const checkoutStartMs = new Date("2026-06-21T00:00:00+06:00").getTime();

      if (nowMs < day18StartMs) {
        // Before 18 Jun 2026
        setCurrentAction({
          title: 'Keep ticket, invoice, voucher, and NID/passport ready.',
          description: 'Ensure you have downloaded offline copies of the Shohagh bus ticket and Grand Pacific hotel documents.',
          badge: 'Preparation Phase',
          icon: 'docs'
        });
      } else if (nowMs >= day18StartMs && nowMs < reportingMs) {
        // On 18 Jun 2026 before reporting
        setCurrentAction({
          title: 'Report at Panthapath by 10:25 PM.',
          description: 'Make sure your packing is complete and you leave early to avoid Dhaka traffic. Reporting counter is Panthapath.',
          badge: 'Reporting Today',
          icon: 'reporting'
        });
      } else if (nowMs >= reportingMs && nowMs < departureMs) {
        // After reporting time but before departure
        setCurrentAction({
          title: 'Boarding window is active. Keep ticket PDF ready.',
          description: 'Show your C2, C3, D2, D3 ticket seats at the counter and board the Shohagh Poribohon bus.',
          badge: 'Boarding Active',
          icon: 'boarding'
        });
      } else if (nowMs >= departureMs && nowMs < checkInStartMs) {
        // After departure but before June 19
        setCurrentAction({
          title: 'Bus journey has started. Next step: hotel check-in.',
          description: 'Enjoy the highway trip. Next up is Hotel Grand Pacific check-in on Friday morning.',
          badge: 'En Route',
          icon: 'enroute'
        });
      } else if (nowMs >= checkInStartMs && nowMs < checkoutStartMs) {
        // On 19 Jun 2026 to checking in
        setCurrentAction({
          title: 'Check in at Hotel Grand Pacific, Cox’s Bazar.',
          description: 'Check-in is permitted. Double rooms are booked. Premium Deluxe King [City View] rooms are ready for Joana, Avishek, Kevin, and Ishraq.',
          badge: 'Hotel Check-In',
          icon: 'checkin'
        });
      } else {
        // On or after 21 Jun 2026 check-out
        setCurrentAction({
          title: 'Check out and confirm return plan.',
          description: 'Hotel checkout is by 12:00 PM. Ensure all billing splits are cleared, bags are packed, and return bus is arranged.',
          badge: 'Checkout & Return',
          icon: 'checkout'
        });
      }
    }

    evaluateAction();
    const interval = setInterval(evaluateAction, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const renderIcon = () => {
    switch (currentAction.icon) {
      case 'docs':
        return <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'reporting':
        return <MapPin className="w-5 h-5 text-amber-500" />;
      case 'boarding':
        return <AlertCircle className="w-5 h-5 text-rose-500 animate-pulse" />;
      case 'enroute':
        return <Compass className="w-5 h-5 text-indigo-500 animate-spin-slow" />;
      case 'checkin':
        return <Key className="w-5 h-5 text-emerald-505 text-emerald-600 dark:text-emerald-400" />;
      case 'checkout':
        return <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-indigo-505" />;
    }
  };

  return (
    <div id="todays-action-section" className="bg-white dark:bg-[#1A263F] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
          {renderIcon()}
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-605 dark:text-indigo-300 font-extrabold px-2.5 py-0.5 rounded-full">
              🚨 Today's Guided Action
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
              Status: {currentAction.badge}
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1">
            {currentAction.title}
          </h4>
          <p className="text-xs text-slate-650 dark:text-slate-300 font-medium">
            {currentAction.description}
          </p>
        </div>
      </div>
    </div>
  );
}
