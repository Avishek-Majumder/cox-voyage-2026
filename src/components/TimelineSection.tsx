import React, { useState, useEffect } from 'react';
import {
  Bus,
  Hotel as HotelIcon,
  Palmtree,
  Compass,
  Sun,
  MapPin,
  Coffee,
  Moon,
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  Check,
  X,
  Camera,
  Utensils,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export interface TimelineEvent {
  id: string;
  day: 'thursday' | 'friday' | 'saturday' | 'sunday';
  time: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'transit' | 'hotel' | 'sightseeing' | 'exploration' | 'meal' | 'sunset' | 'custom';
  tips: string;
}

const DEFAULT_EVENTS: TimelineEvent[] = [
  {
    id: '1',
    day: 'thursday',
    time: '10:45 PM',
    title: 'Dhaka Bus Departure 🚌',
    subtitle: 'Panthapath Counter',
    description: 'Meet up at the highway ticket counter (Panthapath). Board the premium overnight Shohagh Poribohon bus with confirmed seats C2, C3, D2, D3. Unpack blankets and enjoy the cozy and conversational night road journey.',
    category: 'transit',
    tips: 'Carry neck pillows and travel snacks. Bus departures are strictly on time (reporting at 10:25 PM)!'
  },
  {
    id: '2',
    day: 'friday',
    time: '08:30 AM',
    title: 'Arrival & Welcome Drinks 🏝️',
    subtitle: 'Hotel Lobby Check-in',
    description: 'Reach Cox’s Bazar bus station. Take an easy TomTom auto directly to our selected hotel stay. Collect welcoming cool fresh mango drinks. Safe early luggage deposit at the front counter.',
    category: 'hotel',
    tips: 'Most hotels allow early luggage stashing so we can head straight out to explore!'
  },
  {
    id: '3',
    day: 'friday',
    time: '01:00 PM',
    title: 'Sea Bath & Famous Coastal Seafood 🍤',
    subtitle: 'Sugondha & Kolatoli Beaches',
    description: 'Head over to Sugondha or Kolatoli beach for refreshing sea swims and sea splashes. Grab a fantastic lunch consisting of famous local mouth-watering fried loittya fish, crispy crabs, and shutki bhorta at Poushee restaurant.',
    category: 'meal',
    tips: 'Rent sea umbrella-beds at registered hourly government-approved rates only!'
  },
  {
    id: '4',
    day: 'saturday',
    time: '07:30 AM',
    title: 'Epic Marine Drive Exploration 🌊',
    subtitle: 'Inani Corals & Himchori Hills',
    description: 'Savor a delicious complimentary hotel breakfast buffet. Rent an open-air TomTom/Chander Gari tour carriage. Cruise down the spectacular 80km Marine Drive road flanked by high green hills and crushing waves.',
    category: 'exploration',
    tips: 'Check out the high Himchori waterfall trail and collect beautiful sea-shells from Inani Coral beach.'
  },
  {
    id: '5',
    day: 'saturday',
    time: '05:30 PM',
    title: 'Sunset Views & Burmese Market 🌅',
    subtitle: 'Laboni Beach Bazaar',
    description: 'Walk back to Laboni beach for a spectacular crimson sunset. Capture awesome team photoshoots. Explore the vibrant local Burmese market for traditional warm handloom shawls, conch-shell ornaments, and yummy dried local pickles (achor).',
    category: 'sunset',
    tips: 'Bargain politely with vendors! Pickles make wonderful, authentic souvenirs for family back home.'
  },
  {
    id: '6',
    day: 'sunday',
    time: '11:00 AM',
    title: 'Relaxed checkout & Snapshots 🏨',
    subtitle: 'Resort Wrapping Up',
    description: 'Sleep in late, or hang out by the hotel poolside bed. Clear front desk service bills, submit room cards, and park suitcases in lockers. Spend the afternoon taking final memorable high-angle scenic photos.',
    category: 'hotel',
    tips: 'Check electrical outlets, side-tables, and charger points twice to avoid leaving belongings.'
  },
  {
    id: '7',
    day: 'sunday',
    time: '12:30 PM',
    title: 'Return Coach to Dhaka 🔙',
    subtitle: 'Daytime Tour Return',
    description: 'Pack up and board our daytime return coach back to Dhaka. Sit back, relax, watch the changing views of the highway, or play group travel games and listen to music together. We will arrive back in Dhaka mid-evening (around 10:00 - 11:00 PM).',
    category: 'transit',
    tips: 'Expected arrival in Dhaka is around 10:00 - 11:00 PM on Sunday night.'
  }
];

export default function TimelineSection() {
  const [events, setEvents] = useState<TimelineEvent[]>(() => {
    const saved = localStorage.getItem('cox_trip_timeline_events');
    return saved ? JSON.parse(saved) : DEFAULT_EVENTS;
  });

  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TimelineEvent>>({});

  // Adding state
  const [showAddForm, setShowAddForm] = useState<'friday' | 'saturday' | null>(null);
  const [addForm, setAddForm] = useState<Omit<TimelineEvent, 'id' | 'day'>>({
    time: '12:00 PM',
    title: '',
    subtitle: '',
    description: '',
    category: 'custom',
    tips: ''
  });

  // Persist events state to localStorage
  useEffect(() => {
    localStorage.setItem('cox_trip_timeline_events', JSON.stringify(events));
  }, [events]);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to restore the default recommended trip itinerary? All custom activities will be cleared.')) {
      setEvents(DEFAULT_EVENTS);
      setEditingId(null);
      setShowAddForm(null);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Only allow deletion of Friday/Saturday items
    const event = events.find(ev => ev.id === id);
    if (!event) return;
    if (event.day !== 'friday' && event.day !== 'saturday') {
      alert('Milestone travel transits (Thursday departure and Sunday return) are fixed scheduling backbones and cannot be deleted!');
      return;
    }
    if (window.confirm(`Delete activity "${event.title}"?`)) {
      setEvents(prev => prev.filter(ev => ev.id !== id));
      if (activeEventId === id) setActiveEventId(null);
      if (editingId === id) setEditingId(null);
    }
  };

  const handleStartEdit = (event: TimelineEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.day !== 'friday' && event.day !== 'saturday') {
      alert('Departure and return milestone times are fixed, but you can build custom activities inside Friday and Saturday!');
      return;
    }
    setEditingId(event.id);
    setEditForm(event);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.title || !editForm.time) {
      alert('Activity Time and Title are required!');
      return;
    }
    setEvents(prev => prev.map(ev => ev.id === editingId ? { ...(ev), ...editForm } as TimelineEvent : ev));
    setEditingId(null);
  };

  const handleAddEvent = (day: 'friday' | 'saturday', e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.title || !addForm.time) {
      alert('Please fill out the Time and Activity Title!');
      return;
    }
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      day,
      ...addForm
    };
    setEvents(prev => {
      // Find where to insert chronologically or simply append to day group
      const otherDaysBefore = prev.filter(ev => {
        if (day === 'friday') return ev.day === 'thursday';
        if (day === 'saturday') return ev.day === 'thursday' || ev.day === 'friday';
        return false;
      });
      const sameDayEvents = prev.filter(ev => ev.day === day);
      const otherDaysAfter = prev.filter(ev => {
        if (day === 'friday') return ev.day === 'saturday' || ev.day === 'sunday';
        if (day === 'saturday') return ev.day === 'sunday';
        return false;
      });

      return [...otherDaysBefore, ...sameDayEvents, newEvent, ...otherDaysAfter];
    });

    // Reset Form
    setAddForm({
      time: '12:00 PM',
      title: '',
      subtitle: '',
      description: '',
      category: 'custom',
      tips: ''
    });
    setShowAddForm(null);
  };

  const getEventIcon = (category: string) => {
    switch (category) {
      case 'transit':
        return <Bus className="w-4 h-4 text-orange-500" />;
      case 'hotel':
        return <HotelIcon className="w-4 h-4 text-[#006CE4]" />;
      case 'meal':
        return <Utensils className="w-4 h-4 text-pink-500" />;
      case 'exploration':
        return <Compass className="w-4 h-4 text-indigo-500" />;
      case 'sightseeing':
        return <MapPin className="w-4 h-4 text-emerald-500" />;
      case 'sunset':
        return <Sun className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-violet-500" />;
    }
  };

  const getEventColorBg = (category: string) => {
    switch (category) {
      case 'transit':
        return 'border-orange-200 bg-orange-50/40 hover:bg-orange-50/70 dark:border-orange-900/40 dark:bg-orange-950/20 dark:hover:bg-orange-900/20';
      case 'hotel':
        return 'border-[#B1D6F7] bg-[#F0F6FC] hover:bg-[#E1EEFB] dark:border-blue-900/45 dark:bg-blue-950/15 dark:hover:bg-blue-900/20';
      case 'meal':
        return 'border-pink-200 bg-pink-50/40 hover:bg-pink-50/70 dark:border-pink-905/30 dark:bg-pink-950/15 dark:hover:bg-pink-900/20';
      case 'exploration':
        return 'border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/70 dark:border-indigo-900/45 dark:bg-indigo-950/15 dark:hover:bg-indigo-900/20';
      case 'sightseeing':
        return 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70 dark:border-emerald-900/45 dark:bg-emerald-950/15 dark:hover:bg-emerald-900/20';
      case 'sunset':
        return 'border-amber-200 bg-amber-50/40 hover:bg-amber-50/70 dark:border-amber-900/45 dark:bg-amber-950/15 dark:hover:bg-amber-900/20';
      default:
        return 'border-violet-200 bg-violet-50/40 hover:bg-violet-50/70 dark:border-violet-900/45 dark:bg-violet-950/15 dark:hover:bg-violet-900/20';
    }
  };

  // Group events by day to render sections beautifully
  const groupedEvents = {
    thursday: events.filter(e => e.day === 'thursday'),
    friday: events.filter(e => e.day === 'friday'),
    saturday: events.filter(e => e.day === 'saturday'),
    sunday: events.filter(e => e.day === 'sunday'),
  };

  return (
    <div className="bg-white dark:bg-[#0F1A30] rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-150 dark:border-slate-800 mb-8 transition-colors duration-300" id="trip-timeline">
      <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 font-sans">
            <Palmtree className="w-5 h-5 text-[#006CE4]" />
            Squad Trip Timeline 🗺️
          </h2>
          <p className="text-slate-505 dark:text-slate-400 text-xs mt-1">
            Thursday night departure to Sunday night return. Friday & Saturday schedules can be updated in real-time.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 p-2 bg-slate-50 dark:bg-[#1A263F] hover:bg-slate-100 dark:hover:bg-[#25365C] text-slate-650 dark:text-slate-350 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-bold transition duration-200 cursor-pointer"
          title="Reset back to default voyage plan"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Map</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* DAY GROUPINGS */}
        {(['thursday', 'friday', 'saturday', 'sunday'] as const).map((dayName) => {
          const dayEvents = groupedEvents[dayName];
          const isInteractiveDay = dayName === 'friday' || dayName === 'saturday';

          return (
            <div key={dayName} className="space-y-3.5">
              {/* Day Section Header Badge */}
              <div className="flex flex-col gap-1.5 bg-slate-50 dark:bg-[#1A263F]/40 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      dayName === 'thursday' ? 'bg-orange-500' :
                      dayName === 'friday' ? 'bg-[#006CE4]' :
                      dayName === 'saturday' ? 'bg-indigo-500' : 'bg-violet-500'
                    }`}></span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      {dayName === 'thursday' && '🚌 Thursday, 18 June 2026 — Night Departure'}
                      {dayName === 'friday' && '🌴 Friday, 19 June 2026 — Arrival + Check-in Day'}
                      {dayName === 'saturday' && '🌊 Saturday, 20 June 2026 — Full Stay Day'}
                      {dayName === 'sunday' && '🏨 Sunday, 21 June 2026 — Checkout + Return'}
                    </span>
                  </div>

                  {isInteractiveDay && (
                    <button
                      onClick={() => setShowAddForm(showAddForm === dayName ? null : dayName)}
                      className="flex items-center gap-1 bg-[#006CE4] hover:bg-[#0052BE] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition duration-200 cursor-pointer"
                    >
                      {showAddForm === dayName ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      <span>{showAddForm === dayName ? 'Close Form' : 'Add custom state'}</span>
                    </button>
                  )}
                </div>
                
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium pl-4.5">
                  {dayName === 'thursday' && 'Get into the bus from Dhaka at night.'}
                  {dayName === 'friday' && 'Reach Cox’s Bazar in the morning. Hotel check-in from 2:00 PM unless hotel policy says otherwise. Beach walk, food, rest, and light sightseeing.'}
                  {dayName === 'saturday' && 'Main Cox’s Bazar trip day. Beach time, sightseeing, food plan, shopping, photos, and group activities.'}
                  {dayName === 'sunday' && 'Check out from hotel. Return from Cox’s Bazar to Dhaka.'}
                </p>
              </div>

              {/* Add Custom Event Inline Block */}
              {showAddForm === dayName && (
                <form
                  onSubmit={(e) => {
                    if (dayName === 'friday' || dayName === 'saturday') {
                      handleAddEvent(dayName, e);
                    }
                  }}
                  className="bg-slate-50 dark:bg-[#1A263F]/40 border border-[#B1D6F7] dark:border-slate-800 p-4 rounded-2xl text-xs space-y-3 animate-fade-in"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="font-bold text-[#003B95] dark:text-sky-450 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#006CE4]" /> New Customizable Activity for {dayName === 'friday' ? 'Friday' : 'Saturday'}
                    </span>
                    <button type="button" onClick={() => setShowAddForm(null)} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Time (e.g. 10:30 AM)</label>
                      <input
                        type="text"
                        value={addForm.time}
                        onChange={(e) => setAddForm(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full bg-white dark:bg-[#0F1A30] border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-medium dark:text-white"
                        placeholder="Time slot"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Activity Category / Icon</label>
                      <select
                        value={addForm.category}
                        onChange={(e) => setAddForm(prev => ({ ...prev, category: e.target.value as any }))}
                        className="w-full bg-white dark:bg-[#0F1A30] border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
                      >
                        <option value="sightseeing" className="dark:bg-[#0F1A30]">🏝️ Sightseeing / Outing</option>
                        <option value="meal" className="dark:bg-[#0F1A30]">🍤 Local Meal Idea</option>
                        <option value="exploration" className="dark:bg-[#0F1A30]">🌊 Adventure & Exploration</option>
                        <option value="hotel" className="dark:bg-[#0F1A30]">🏨 Hotel Relax / Spa</option>
                        <option value="sunset" className="dark:bg-[#0F1A30]">🌅 Sunset & Views</option>
                        <option value="transit" className="dark:bg-[#0F1A30]">🚌 Local Commute / Tour</option>
                        <option value="custom" className="dark:bg-[#0F1A30]">✨ Special Group Event</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Title</label>
                      <input
                        type="text"
                        value={addForm.title}
                        onChange={(e) => setAddForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-white dark:bg-[#0F1A30] border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-semibold text-slate-800 dark:text-white"
                        placeholder="e.g. Fresh Coconut Drinks Session"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Subtitle / Location</label>
                      <input
                        type="text"
                        value={addForm.subtitle}
                        onChange={(e) => setAddForm(prev => ({ ...prev, subtitle: e.target.value }))}
                        className="w-full bg-white dark:bg-[#0F1A30] border border-slate-200 dark:border-slate-800 rounded-xl p-2 dark:text-white"
                        placeholder="e.g. laboni beach deckchairs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Brief Description</label>
                    <textarea
                      value={addForm.description}
                      onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-white dark:bg-[#0F1A30] border border-slate-200 dark:border-slate-800 rounded-xl p-2 h-16 resize-none dark:text-white"
                      placeholder="List details of what the travel squad will be doing..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Squad Pro Travel Tip</label>
                    <input
                      type="text"
                      value={addForm.tips}
                      onChange={(e) => setAddForm(prev => ({ ...prev, tips: e.target.value }))}
                      className="w-full bg-white dark:bg-[#0F1A30] border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-emerald-700 dark:text-emerald-400 font-bold placeholder:font-normal"
                      placeholder="e.g. Must carry water-bottle and high-SPF block."
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(null)}
                      className="px-3.5 py-1.5 bg-white dark:bg-[#1A263F] hover:bg-slate-100 dark:hover:bg-[#25365C] text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#006CE4] hover:bg-[#0052BE] text-white rounded-xl font-bold cursor-pointer transition shadow-xs"
                    >
                      Add to Timeline ✓
                    </button>
                  </div>
                </form>
              )}

              {/* LIST OF EVENTS IN THIS DAY */}
              <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4.5 pl-6 space-y-4">
                {dayEvents.map((event) => {
                  const isActive = activeEventId === event.id;
                  const isEditing = editingId === event.id;

                  return (
                    <div
                      key={event.id}
                      className="relative group transition-all duration-300"
                    >
                      {/* Left vertical timeline indicator bullet */}
                      <div className="absolute -left-[35px] top-2 p-1.5 rounded-full bg-white dark:bg-[#0F1A30] border border-slate-200 dark:border-slate-800 shadow-xxs z-10 transition duration-300 group-hover:scale-110">
                        {getEventIcon(event.category)}
                      </div>

                      {isEditing ? (
                        /* Inline Edit Form */
                        <form
                          onSubmit={handleSaveEdit}
                          className="rounded-2xl border border-[#006CE4] bg-white dark:bg-[#1A263F] p-4 shadow-sm text-xs space-y-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2">
                            <span className="font-extrabold text-[#006CE4] dark:text-sky-400 flex items-center gap-1.5">
                              <Edit2 className="w-3.5 h-3.5" /> Modify Travel Activity
                            </span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="p-1 rounded-full text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] text-slate-400 dark:text-slate-350 uppercase font-bold mb-1">Time</label>
                              <input
                                type="text"
                                value={editForm.time}
                                onChange={(e) => setEditForm(prev => ({ ...prev, time: e.target.value }))}
                                className="w-full bg-slate-50 dark:bg-[#0F1A30] border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-medium dark:text-white focus:outline-none"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-400 dark:text-slate-350 uppercase font-bold mb-1">Tag Location</label>
                              <input
                                type="text"
                                value={editForm.subtitle}
                                onChange={(e) => setEditForm(prev => ({ ...prev, subtitle: e.target.value }))}
                                className="w-full bg-slate-50 dark:bg-[#0F1A30] border border-slate-200 dark:border-slate-800 rounded-xl p-2 dark:text-white focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-400 dark:text-slate-350 uppercase font-bold mb-1">Activity title</label>
                            <input
                              type="text"
                              value={editForm.title}
                              onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full bg-slate-50 dark:bg-[#0F1A30] border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-bold dark:text-white focus:outline-none"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-400 dark:text-slate-350 uppercase font-bold mb-1">Description</label>
                            <textarea
                              value={editForm.description}
                              onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                              className="w-full bg-slate-50 dark:bg-[#0F1A30] border border-slate-200 dark:border-slate-800 rounded-xl p-2 h-14 resize-none dark:text-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-400 dark:text-slate-350 uppercase font-bold mb-1">Travel Tip</label>
                            <input
                              type="text"
                              value={editForm.tips}
                              onChange={(e) => setEditForm(prev => ({ ...prev, tips: e.target.value }))}
                              className="w-full bg-slate-50 dark:bg-[#0F1A30] border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-semibold text-emerald-800 dark:text-emerald-400 focus:outline-none"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 bg-slate-100 dark:bg-[#1A263F] hover:bg-slate-200 dark:hover:bg-[#25365C] text-slate-600 dark:text-slate-300 rounded-xl font-bold cursor-pointer"
                            >
                              Discard
                            </button>
                            <button
                              type="submit"
                              className="px-3.5 py-1 bg-[#006CE4] hover:bg-[#0052BE] text-white rounded-xl font-bold cursor-pointer transition"
                            >
                              Save Activity ✓
                            </button>
                          </div>
                        </form>
                      ) : (
                        /* Standard View Card */
                        <div
                          className={`rounded-2xl border p-4 transition-all duration-300 cursor-pointer ${
                            getEventColorBg(event.category)
                          } ${
                            isActive
                              ? 'border-[#006CE4] dark:border-sky-500 shadow-xxs ring-1 ring-[#006CE4]/10 bg-white dark:bg-[#1A263F]'
                              : 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#1A263F]/20'
                          }`}
                          onClick={() => setActiveEventId(isActive ? null : event.id)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-[#006CE4] dark:text-sky-400 font-mono tracking-wide uppercase">
                                  {event.time}
                                </span>
                                <span className="text-[9px] bg-[#006CE4]/10 dark:bg-[#006CE4]/20 text-[#006CE4] dark:text-sky-305 px-1.5 py-0.5 rounded-sm font-semibold tracking-wider font-sans uppercase">
                                  {event.category}
                                </span>
                              </div>
                              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white mt-1">
                                {event.title}
                              </h3>
                            </div>

                            <div className="flex items-center gap-1.5 justify-between sm:justify-end text-xs">
                              {event.subtitle && (
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-300 bg-slate-50 dark:bg-[#0F1A30]/80 border border-slate-150 dark:border-slate-800/80 px-2 py-0.5 rounded-md truncate max-w-[140px] sm:max-w-none">
                                  📍 {event.subtitle}
                                </span>
                              )}

                              {/* Interactive customize buttons for Friday and Saturday Stay events */}
                              {isInteractiveDay && (
                                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => handleStartEdit(event, e)}
                                    className="p-1 rounded-md text-slate-500 hover:text-[#006CE4] dark:hover:text-sky-305 hover:bg-slate-100 dark:hover:bg-[#1A263F]/80 cursor-pointer transition"
                                    title="Edit travel slot name & details"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => handleDelete(event.id, e)}
                                    className="p-1 rounded-md text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/25 cursor-pointer transition"
                                    title="Remove this slot activity"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <p className={`text-xs text-slate-600 dark:text-slate-350 mt-2.5 leading-relaxed ${isActive ? '' : 'line-clamp-2 md:line-clamp-none'}`}>
                            {event.description}
                          </p>

                          {/* Extended Tip shown on click or force active */}
                          {isActive && (
                            <div className="mt-3.5 pt-3 border-t border-dashed border-[#B1D6F7] dark:border-slate-800 bg-[#F0F6FC] dark:bg-[#0F1A30] p-3 rounded-xl">
                              <span className="text-[10px] font-extrabold text-[#0052BE] dark:text-sky-400 block uppercase tracking-wider mb-1 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-500" /> Crew Pro-Travel Tip:
                              </span>
                              <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                                "{event.tips || 'Enjoy this session with the group! Maintain timings closely.'}"
                              </p>
                            </div>
                          )}

                          <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-[9px] text-[#006CE4] dark:text-sky-400 font-bold">
                              {isActive ? 'Click to minimize information ▲' : 'Click to see tips & recommendations ▼'}
                            </span>
                            {isInteractiveDay && (
                              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono italic">
                                Custom Activity Slot
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {dayEvents.length === 0 && (
                  <div className="bg-slate-50 dark:bg-[#1A263F]/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-6 text-center text-xs text-slate-400 dark:text-slate-505">
                    <AlertCircle className="w-5 h-5 text-slate-300 mx-auto mb-2" />
                    No custom plans scheduled for this day yet. Click "Add custom state" above to custom design your session!
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
