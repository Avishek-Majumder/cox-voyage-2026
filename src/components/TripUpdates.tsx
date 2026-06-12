import React, { useState } from 'react';
import { Bell, Check, Trash2, HelpCircle, MessageSquare, Send, Volume2, Sparkles } from 'lucide-react';

interface TripUpdate {
  id: string;
  source: 'System' | 'bKash Official' | 'Trip Lead' | 'Member';
  senderName?: string;
  avatarColor?: string;
  title: string;
  body: string;
  timestamp: string;
  isNew: boolean;
  tag?: string;
}

const INITIAL_UPDATES: TripUpdate[] = [
  {
    id: 'u1',
    source: 'Trip Lead',
    senderName: 'Avishek',
    avatarColor: 'bg-[#003B95]',
    title: 'Bus Departure Reminder 🚌',
    body: 'Shohagh Poribohon seats (C2, C3, D2, D3) are confirmed for Thursday night, 18 June 2026. Meet at Panthapath ticket counter, departure is strictly at 10:45 PM (reporting at 10:25 PM).',
    timestamp: '10 mins ago',
    isNew: true,
    tag: 'Bus Booking'
  },
  {
    id: 'u2',
    source: 'bKash Official',
    title: '3% Checkout Discount Activated 💸',
    body: 'Exclusive bKash merchant split offer applied. Our hotel bill total includes the 3% instant discount on base prices automatically.',
    timestamp: '1 hour ago',
    isNew: true,
    tag: 'Savings'
  },
  {
    id: 'u3',
    source: 'System',
    title: 'Hotel Check-In Reminder 🏨',
    body: 'Official hotel check-in starts on Friday, 19 June 2026 at 2:00 PM (14:00) unless different. Quick luggage drop in lobby is available starting 08:30 AM.',
    timestamp: '3 hours ago',
    isNew: true,
    tag: 'Hotel'
  },
  {
    id: 'u4',
    source: 'Member',
    senderName: 'Neha',
    avatarColor: 'bg-rose-500',
    title: 'Full Beach Day Blast 🌊',
    body: 'Saturday, 20 June 2026 is our full beach day! Get ready for Marine Drive exploring, Inani coral beach walk, Himchori Hill trail, and a team photoshoot at sunset!',
    timestamp: 'Yesterday',
    isNew: false,
    tag: 'Activities'
  },
  {
    id: 'u5',
    source: 'System',
    title: 'Checkout & Return Reminder 🔙',
    body: 'Hotel check-out is on Sunday, 21 June 2026 at each hotel’s checkout time (normally 11:00 AM or 12:05 PM). Return coach departs for Dhaka in the afternoon (around 12:30 PM) so we reach Dhaka by Sunday night around 10:00 - 11:00 PM.',
    timestamp: '2 days ago',
    isNew: false,
    tag: 'Checkout Details'
  }
];

const SIMULATED_MESSAGES = [
  "Neha: Don't forget to pack toiletries! Sunscreen SPF 50 is a non-negotiable.",
  "Sajid: Can we do a quick morning beach run on Saturday? 🏃‍♂️",
  "Imran: Guys, should we book some parasailing sessions over Himchari beach? It's highly rated!",
  "Anika: I've verified that our chosen hotel offers free airport shuttle transfer as well.",
  "Avishek: Everyone settle individual split dues using the Pay QR drawer so we can finalize the booking!",
];

export default function TripUpdates() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [updates, setUpdates] = useState<TripUpdate[]>(INITIAL_UPDATES);
  const [simulatedIndex, setSimulatedIndex] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const markAllAsRead = () => {
    setUpdates((prev) => prev.map((u) => ({ ...u, isNew: false })));
    triggerFeedback('All alerts marked as read! 🔔');
  };

  const deleteAlert = (id: string) => {
    setUpdates((prev) => prev.filter((u) => u.id !== id));
  };

  const triggerFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const simulateNewMessage = () => {
    const rawMsg = SIMULATED_MESSAGES[simulatedIndex];
    const [sender, ...bodyParts] = rawMsg.split(':');
    const bodyText = bodyParts.join(':').trim();

    const newUpdate: TripUpdate = {
      id: `sim_${Date.now()}`,
      source: 'Member',
      senderName: sender,
      avatarColor: sender === 'Avishek' ? 'bg-[#003B95]' : sender === 'Neha' ? 'bg-rose-500' : 'bg-emerald-600',
      title: `Message from ${sender} 💬`,
      body: bodyText,
      timestamp: 'Just now',
      isNew: true,
      tag: 'Squad Chat'
    };

    setUpdates((prev) => [newUpdate, ...prev]);
    setSimulatedIndex((prev) => (prev + 1) % SIMULATED_MESSAGES.length);
    triggerFeedback(`New message from ${sender} simulated!`);
  };

  const unreadCount = updates.filter((u) => u.isNew).length;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-150 mb-8" id="trip-updates">
      {/* Alert Header bar */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Bell className="w-5 h-5 animate-[swing_2.5s_infinite]" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black leading-none min-w-4 h-4 text-center flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-1.5">
              Trip Updates & Alerts 🔔
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Live updates, team guidelines, and coordinated travel advice.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && !isCollapsed && (
            <button
              onClick={markAllAsRead}
              className="text-[10px] text-indigo-600 hover:text-indigo-800 font-extrabold flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg cursor-pointer align-middle"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark read</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition cursor-pointer align-middle"
          >
            {isCollapsed ? 'Expand ▼' : 'Minimize ▲'}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="animate-fade-in">

      {feedbackMsg && (
        <div className="my-2 p-2 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-xl border border-emerald-100 text-center animate-fade-in flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* List Container */}
      <div className="mt-4 space-y-3 max-h-[360px] overflow-y-auto pr-1">
        {updates.length === 0 ? (
          <div className="py-10 text-center text-slate-450 text-xs space-y-2">
            <p>No active alerts. All travel clear!</p>
            <button
              onClick={() => setUpdates(INITIAL_UPDATES)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
            >
              Reset Alerts Feed
            </button>
          </div>
        ) : (
          updates.map((up) => (
            <div
              key={up.id}
              className={`p-3.5 rounded-2xl border transition duration-200 relative ${
                up.isNew
                  ? 'bg-[#006CE4]/3 border-[#006CE4]/20'
                  : 'bg-slate-50/60 border-slate-100'
              }`}
            >
              {/* Highlight badge for unread */}
              {up.isNew && (
                <span className="absolute top-3.5 right-11 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              )}

              <div className="flex items-start gap-3">
                {/* Visual sender bubble or tag icon */}
                {up.source === 'Member' || up.source === 'Trip Lead' ? (
                  <div className={`w-8 h-8 rounded-full ${up.avatarColor || 'bg-[#003B95]'} text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 uppercase font-sans border-2 border-white shadow-xs`}>
                    {up.senderName?.substring(0, 2) || 'TL'}
                  </div>
                ) : (
                  <div className={`w-8 h-8 rounded-full ${up.source === 'bKash Official' ? 'bg-[#E2136E]' : 'bg-[#0052BE]'} text-white font-extrabold text-[9px] flex items-center justify-center flex-shrink-0 font-sans border-2 border-white shadow-xs`}>
                    {up.source === 'bKash Official' ? 'BK' : 'SYS'}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2.5">
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">
                      {up.source === 'Member' ? `${up.senderName} (Squad Member)` : up.source}
                    </span>
                    <span className="text-[9.5px] text-slate-400 font-mono pr-5">{up.timestamp}</span>
                  </div>

                  <h3 className="text-xs font-extrabold text-slate-800 mt-0.5 leading-snug">
                    {up.title}
                  </h3>
                  
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {up.body}
                  </p>

                  {/* Inner Category tag */}
                  {up.tag && (
                    <span className="mt-2 inline-block text-[9px] bg-white border border-slate-200 text-slate-500 font-bold px-2 py-0.5 rounded-md font-mono">
                      {up.tag}
                    </span>
                  )}
                </div>
              </div>

              {/* Individual delete item */}
              <button
                onClick={() => deleteAlert(up.id)}
                className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 p-1 rounded-md transition cursor-pointer"
                title="Dismiss update"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Button to simulate additional updates */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-[10px] text-slate-400 font-medium italic">
          Simulated active squad room v2.6
        </span>
        <button
          type="button"
          onClick={simulateNewMessage}
          className="text-center py-1.5 px-3 rounded-lg text-[10px] font-extrabold bg-[#006CE4] hover:bg-[#0052BE] text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
          title="Simulate incoming messages from Avishek and Neha"
        >
          <MessageSquare className="w-3 h-3" />
          <span>Simulate Co-Traveller Message</span>
        </button>
      </div>
      </div>
      )}
    </div>
  );
}
