import React from 'react';
import { ShieldAlert, FileText, Phone, CheckCircle, ExternalLink, HelpCircle } from 'lucide-react';
import CopyButton from './CopyButton';

interface TripWalletProps {
  onViewDoc: (title: string, type: string, viewUrl: string, embedUrl: string) => void;
  members: { name: string }[];
}

export default function TripWallet({ onViewDoc, members }: TripWalletProps) {
  const documents = [
    {
      title: 'Bus Ticket (Dhaka → Cox’s Bazar)',
      type: 'Bus Ticket',
      status: 'Confirmed',
      viewUrl: 'https://drive.google.com/file/d/1qZGZPEVow_X6-v9I6k7O1r0WGLyPRy50/view?usp=sharing',
      embedUrl: 'https://drive.google.com/file/d/1qZGZPEVow_X6-v9I6k7O1r0WGLyPRy50/preview'
    },
    {
      title: 'Hotel Grand Pacific Invoice',
      type: 'Hotel Invoice',
      status: 'Available',
      viewUrl: 'https://drive.google.com/file/d/1PGGSDDy8vvibL1T1Nqs8-PcdZP8PI-42/view?usp=sharing',
      embedUrl: 'https://drive.google.com/file/d/1PGGSDDy8vvibL1T1Nqs8-PcdZP8PI-42/preview'
    },
    {
      title: 'Hotel Grand Pacific Voucher',
      type: 'Hotel Voucher',
      status: 'Available',
      viewUrl: 'https://drive.google.com/file/d/1VUC5qSkCs91bdY7bWCwGzU1sdE3hljiI/view?usp=drive_link',
      embedUrl: 'https://drive.google.com/file/d/1VUC5qSkCs91bdY7bWCwGzU1sdE3hljiI/preview'
    }
  ];

  const emergencyReminders = [
    'NID/passport copy',
    'Power bank',
    'Cash',
    'Medicine',
    'Phone charger',
    'Ticket PDF',
    'Hotel voucher'
  ];

  return (
    <div id="trip-wallet" className="bg-white dark:bg-[#0F1A30] rounded-3xl p-6 shadow-xs border border-gray-100 dark:border-slate-800 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-6">
        <ShieldAlert className="w-5 h-5 text-indigo-500" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white font-sans">Trip Wallet & Rescue Center</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Confirmed Booking Documents */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">
            Documents (Ready & Verified)
          </h3>
          <div className="space-y-3">
            {documents.map((doc, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-[#1A263F]/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl">
                    <FileText className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-slate-200">
                      {doc.type}
                    </h4>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase flex items-center gap-1.5 mt-0.5">
                      <CheckCircle className="w-3 h-3" /> {doc.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onViewDoc(doc.title, doc.type, doc.viewUrl, doc.embedUrl)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700 text-[11px] font-bold rounded-lg transition duration-150 cursor-pointer"
                >
                  View
                </button>
              </div>
            ))}

            {/* Hotel Booking Metadata Card */}
            <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/5 rounded-2xl border border-emerald-500/10 dark:border-emerald-500/10 space-y-1.5">
              <span className="text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-extrabold">
                Active Stay Details
              </span>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                Hotel Grand Pacific, Cox's Bazar
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-450 font-medium">
                Premier Deluxe King [City View] &bull; 2 Rooms &bull; Booked
              </p>
            </div>
          </div>
        </div>

        {/* Reminders & Security Fallbacks */}
        <div className="lg:col-span-6 space-y-6">
          {/* Important Reminders */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">
              Emergency Packing List
            </h3>
            <div className="flex flex-wrap gap-2">
              {emergencyReminders.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-[#1A263F]/50 border border-slate-200/65 dark:border-slate-800 text-slate-650 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Emergency Contacts card */}
          <div className="p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10 dark:border-rose-500/10 space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-rose-500" />
              <h4 className="text-sm font-extrabold text-rose-700 dark:text-rose-400">Emergency Contacts</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-650 dark:text-slate-300">
              <div>
                <span className="text-slate-400 dark:text-slate-500 font-bold block text-[10px] uppercase">
                  Trip Organizer
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-extrabold dark:text-slate-200">Avishek Majumder</span>
                </div>
              </div>
              
              <div>
                <span className="text-slate-400 dark:text-slate-500 font-bold block text-[10px] uppercase">
                  Hotel Grand Pacific Help
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-extrabold dark:text-slate-200">01711746681</span>
                  <CopyButton value="01711746681" label="Copy" className="scale-90" />
                </div>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-500 font-bold block text-[10px] uppercase">
                  Shohagh Bus Counter
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-extrabold dark:text-slate-200">+8809606444777</span>
                  <CopyButton value="+8809606444777" label="Copy" className="scale-90" />
                </div>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-500 font-bold block text-[10px] uppercase">
                  National Response
                </span>
                <span className="font-bold text-red-500 dark:text-red-400 block mt-0.5">999 (Local Helpline)</span>
              </div>
            </div>

            <p className="text-[10px] leading-relaxed text-indigo-400/80 font-semibold border-t border-rose-500/10 pt-2 shrink-0">
              Note: Hospital & local police coordinates are accessible standard at Cox's Bazar Tourist Police stations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
