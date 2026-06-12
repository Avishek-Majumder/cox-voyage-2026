import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, ClipboardList, Plus, Trash2, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

interface PackingItem {
  id: string;
  name: string;
  category: 'documents' | 'apparel' | 'sun_care' | 'electronics' | 'custom';
  packed: boolean;
  isCustom?: boolean;
}

const DEFAULT_PACKING_ITEMS: PackingItem[] = [
  { id: 'p1', name: 'NID Photocopy & Print Hotel Voucher 📄', category: 'documents', packed: false },
  { id: 'p2', name: 'Liquid Cash (approx. BDT 5,000 / $41 for local stalls) 💵', category: 'documents', packed: false },
  { id: 'p3', name: 'Polarised Beach Sunglasses 🕶️', category: 'apparel', packed: false },
  { id: 'p4', name: 'Quick-dry shorts & linen shirts 🩳', category: 'apparel', packed: false },
  { id: 'p5', name: 'Comfortable beach slippers/sandals 🩴', category: 'apparel', packed: false },
  { id: 'p6', name: 'SPF 50+ Broad Spectrum Sunscreen 🧴', category: 'sun_care', packed: false },
  { id: 'p7', name: 'Waterproof absolute Dry Bag (10L) 🎒', category: 'sun_care', packed: false },
  { id: 'p8', name: '20,000mAh Power Bank for long bus ride 🔋', category: 'electronics', packed: false },
  { id: 'p9', name: 'Waterproof phone pouch with neck lanyard 📱', category: 'electronics', packed: false },
  { id: 'p10', name: 'Noise-cancelling earbuds / travel neck pillow 🎧', category: 'electronics', packed: false },
];

export default function PackingChecklist() {
  const [items, setItems] = useState<PackingItem[]>(() => {
    const saved = localStorage.getItem('squad_trip_packing_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing packing items from localStorage', e);
      }
    }
    return DEFAULT_PACKING_ITEMS;
  });

  const [newItemName, setNewItemName] = useState('');
  const [activeTab, setActiveTab2] = useState<'all' | 'documents' | 'apparel' | 'sun_care' | 'electronics' | 'custom'>('all');
  const [isChecklistCollapsed, setIsChecklistCollapsed] = useState(true);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('squad_trip_packing_list', JSON.stringify(items));
  }, [items]);

  const toggleItemPacked = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item))
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: PackingItem = {
      id: `custom_${Date.now()}`,
      name: `${newItemName.trim()} 🌟`,
      category: 'custom',
      packed: false,
      isCustom: true,
    };

    setItems((prev) => [...prev, newItem]);
    setNewItemName('');
    setActiveTab2('all');
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const resetToDefault = () => {
    if (window.confirm('Do you really want to reset your checklist to default items? Your custom items will be cleared.')) {
      setItems(DEFAULT_PACKING_ITEMS);
    }
  };

  const packAllItems = () => {
    setItems((prev) => prev.map((item) => ({ ...item, packed: true })));
  };

  const totalCount = items.length;
  const packedCount = items.filter((i) => i.packed).length;
  const packedPercent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const filteredItems = items.filter((item) => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  return (
    <div className="bg-white dark:bg-[#0F1A30] rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-150 dark:border-slate-800 mb-8 transition-colors duration-300" id="packing-checklist">
      {/* Header section with toggle for collapse */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-50 dark:bg-rose-950/25 rounded-xl">
            <ClipboardList className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              Smart Packing Checklist 👜
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
              Prepare for the 3-day Cox's Bazar beach getaway. Ensure your squad doesn't forget the essentials!
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsChecklistCollapsed(!isChecklistCollapsed)}
          className="text-xs text-indigo-600 dark:text-sky-400 hover:text-indigo-800 dark:hover:text-sky-300 font-bold bg-slate-50 dark:bg-[#1A263F] hover:bg-slate-100 dark:hover:bg-[#25365C] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-750 transition cursor-pointer"
        >
          {isChecklistCollapsed ? 'Expand Checklist ▼' : 'Collapse Checklist ▲'}
        </button>
      </div>

      {!isChecklistCollapsed && (
        <div className="space-y-4 pt-3">
          {/* Progress Section */}
          <div className="bg-slate-50 dark:bg-[#1A263F]/40 border border-slate-150 dark:border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
            <div className="flex-1 w-full space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Beach Readiness Rating</span>
                <span className="font-mono font-black text-[#006CE4] dark:text-sky-400">{packedCount} of {totalCount} Packed ({packedPercent}%)</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${packedPercent}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-450 italic">
                {packedPercent === 100 
                  ? '🎉 Outstanding! You are 100% prepared to hit the Cox’s Bazar shorelines.' 
                  : packedPercent > 60 
                  ? '🌊 Almost there! Most essential items are checked and ready.' 
                  : '🎒 Good start. Complete checking items to prevent high-priced local beach side purchases!'
                }
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={packAllItems}
                className="text-center py-1.5 px-3 rounded-lg text-[11px] font-bold bg-emerald-50 dark:bg-[#1C2C4E] hover:bg-emerald-100 dark:hover:bg-[#25365C] text-emerald-700 dark:text-emerald-400 transition cursor-pointer active:scale-95"
              >
                Let's Pack All
              </button>
              <button
                onClick={resetToDefault}
                className="p-1.5 text-slate-400 dark:text-slate-550 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A263F] rounded-lg transition cursor-pointer"
                title="Reset checklist to original preset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Categories filter */}
          <div className="flex flex-wrap gap-1 border-b border-slate-100 dark:border-slate-800 pb-2">
            {[
              { id: 'all', label: 'All Gear' },
              { id: 'documents', label: 'Documents 📄' },
              { id: 'apparel', label: 'Apparel 🩳' },
              { id: 'sun_care', label: 'Sun & Coastal 🧴' },
              { id: 'electronics', label: 'Electronics 🔌' },
              { id: 'custom', label: 'Custom 🌟' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab2(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                  activeTab === tab.id
                    ? 'bg-[#003B95] text-white font-bold shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A263F]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Packing Items list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
            {filteredItems.length === 0 ? (
              <div className="col-span-full py-8 text-center text-slate-400 dark:text-slate-505 text-xs">
                No items found in this segment. Custom items will display under the "Custom 🌟" filter.
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleItemPacked(item.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    item.packed
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/35 text-slate-500 dark:text-slate-400'
                      : 'bg-white dark:bg-[#1A263F]/55 hover:bg-slate-50/60 dark:hover:bg-[#25365C]/60 border-slate-150 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 w-5/6">
                    {item.packed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-md flex-shrink-0"></div>
                    )}
                    <span className={`text-xs select-none ${item.packed ? 'line-through text-slate-400 dark:text-slate-500' : 'font-medium'}`}>
                      {item.name}
                    </span>
                  </div>

                  {item.isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent triggering check packed toggle
                        handleDeleteItem(item.id);
                      }}
                      className="p-1 text-slate-300 dark:text-slate-605 hover:text-rose-500 rounded-lg transition"
                      title="Delete custom item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Custom item addition form */}
          <form onSubmit={handleAddItem} className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Pack extra gear? Try 'GoPro Actioncam' or 'Waterproof sandals'..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                maxLength={42}
                className="w-full text-xs bg-slate-50 dark:bg-[#1A263F] hover:bg-slate-100/30 dark:hover:bg-[#25365C]/35 focus:bg-white dark:focus:bg-transparent border border-slate-200 dark:border-slate-800 hover:border-slate-300 focus:border-[#006CE4] rounded-xl px-3 py-2.5 outline-none transition font-medium dark:text-white"
              />
              <span className="absolute right-3 top-3 text-[9px] text-slate-400 dark:text-slate-500 font-mono">
                {newItemName.length}/42
              </span>
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-[#003B95] dark:hover:bg-[#002B75] text-white font-bold text-xs uppercase tracking-wide transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
