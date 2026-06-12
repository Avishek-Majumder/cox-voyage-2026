import React, { useState, useEffect } from 'react';
import { Bell, BellOff, ShieldCheck, CheckCircle, Info, Sparkles, AlertCircle, Clock } from 'lucide-react';

export default function NotificationSettings() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [enabledTopics, setEnabledTopics] = useState({
    departure: true,
    checkIn: true,
    payment: true,
  });
  const [delaySecs, setDelaySecs] = useState(5);
  const [isScheduling, setIsScheduling] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Read current permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    } else {
      setErrorMessage('Browser platform does not support native Web Notifications.');
    }
  }, []);

  const handleRequestPermission = async () => {
    if (!('Notification' in window)) {
      setErrorMessage('This browser does not support standard desktop Web Notifications.');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        new Notification("🔔 Beach Reminders Active!", {
          body: "Squad Voyage companion will keep you alerted of bus countdowns and checklist tasks.",
        });
      } else if (result === 'denied') {
        setErrorMessage('Web Notifications permission was denied. Unblock it in your address bar.');
      }
    } catch (err) {
      setErrorMessage('Failed to request notification credentials. Check iframe policies.');
    }
  };

  const triggerTestNotification = (topic: 'departure' | 'checkIn' | 'payment') => {
    if (!('Notification' in window)) return;

    if (Notification.permission !== 'granted') {
      handleRequestPermission();
      return;
    }

    if (topic === 'departure') {
      new Notification("🚌 Bus Departure Alert - 10:45 PM", {
        body: "Your Shohagh Poribohon bus (Panthapath) departs in less than 24 hours. Ensure your team packing boxes are sealed!",
        tag: 'bus-departure',
        requireInteraction: true
      });
    } else if (topic === 'checkIn') {
      new Notification("🏨 Beachfront Stay Check-In Countdown", {
        body: "Your room voucher baggage drop window starts at 08:30 AM Friday. early lobby rest tokens issued.",
        tag: 'hotel-checkin'
      });
    } else if (topic === 'payment') {
      new Notification("💸 Budget Split Sync Alert", {
        body: "bKash split dues recalculated. Settle individual sums with Avishek to lock booking values.",
        tag: 'payment-dues'
      });
    }
  };

  const scheduleDelayedNotification = () => {
    if (Notification.permission !== 'granted') {
      handleRequestPermission();
      return;
    }

    setIsScheduling(true);
    setTimeout(() => {
      new Notification("⏰ Destination Countdown Milestone reached!", {
        body: "Squad voyage departure is approaching rapidly. Tap to check active baggage checklist status!",
        requireInteraction: true
      });
      setIsScheduling(false);
    }, delaySecs * 1000);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-150 mb-8" id="voyage-push-center">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-50 pb-4 mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500 animate-[pulse_2s_infinite]" />
            Push Travel Alert Center 🔔
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Configure local push reminders using the browser's native **Notification API** to ensure you never miss critical travel deadlines.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <span className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-lg ${
            permission === 'granted' ? 'bg-indigo-50 text-indigo-700 border border-indigo-150' : 'bg-amber-50 text-amber-600 border border-amber-150'
          }`}>
            {permission === 'granted' ? 'Alerts Authorized 🟢' : 'Needs Action 🟡'}
          </span>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition cursor-pointer"
          >
            {isCollapsed ? 'Configure Alerts ▼' : 'Minimize Alerts ▲'}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fade-in">
          {/* Permission Request panel */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Browser Credentials Outlook
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">
                    {permission === 'granted' ? 'Web Push Active' : permission === 'denied' ? 'Alerts Blocked By Browser' : 'Permission Unrequested'}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Allows instant, high-importance background popup messages on your phone/desktop.
                  </p>
                </div>

                {permission !== 'granted' ? (
                  <button
                    onClick={handleRequestPermission}
                    className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-3.5 py-2 rounded-xl transition cursor-pointer active:scale-95 shadow-xxs"
                  >
                    Enable Push
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-white px-2.5 py-1.5 rounded-lg border border-emerald-150">
                    <CheckCircle className="w-4 h-4" />
                    <span>Enabled</span>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="mt-3 p-2 bg-rose-50 text-rose-700 text-[10px] leading-relaxed rounded-lg flex items-start gap-1.5 font-medium border border-rose-100">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Trigger simulations */}
            <div className="space-y-2">
              <span className="text-[9px] font-black tracking-widest text-[#006CE4] uppercase block">
                Toggle Alerts Subscription
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'departure', label: 'Bus Departure 🚌' },
                  { id: 'checkIn', label: 'Hotel Lobby 🏨' },
                  { id: 'payment', label: 'Due Splits 💸' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setEnabledTopics(t => ({ ...t, [item.id]: !t[item.id as keyof typeof t] }))}
                    className={`px-2 py-2 rounded-xl border text-[10.5px] font-bold text-center transition cursor-pointer ${
                      enabledTopics[item.id as keyof typeof enabledTopics]
                        ? 'bg-white border-indigo-200 text-indigo-700 shadow-xxs'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Test Notification actions */}
          <div className="lg:col-span-6 bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-4">
            <div>
              <span className="text-[9px] font-black tracking-widest text-indigo-600 uppercase block">
                Simulate Milestone Warnings
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Select a milestone below to dispatch a real-time notification loop instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => triggerTestNotification('departure')}
                disabled={!enabledTopics.departure}
                className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Test Bus Departure
              </button>
              <button
                onClick={() => triggerTestNotification('checkIn')}
                disabled={!enabledTopics.checkIn}
                className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Test Check-in
              </button>
              <button
                onClick={() => triggerTestNotification('payment')}
                disabled={!enabledTopics.payment}
                className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Test Due Split
              </button>
            </div>

            <div className="pt-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 font-medium">Delay: </span>
                <select
                  value={delaySecs}
                  onChange={(e) => setDelaySecs(parseInt(e.target.value, 10))}
                  className="bg-white border border-slate-250 rounded-md px-1.5 py-0.5 font-bold focus:outline-none"
                >
                  <option value={3}>3 Secs</option>
                  <option value={5}>5 Secs</option>
                  <option value={10}>10 Secs</option>
                </select>
              </div>

              <button
                onClick={scheduleDelayedNotification}
                disabled={isScheduling}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-slate-400"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>{isScheduling ? 'Scheduling...' : 'Schedule Alert'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
