import React, { useState } from 'react';
import { X, Shuffle, Check, AlertTriangle, Coffee, ShieldAlert, Sparkles, Building } from 'lucide-react';
import { Hotel, GroupSize } from '../types';
import { calculateAllTripCosts, formatBDT } from '../data/hotels';

interface CompareDrawerProps {
  compareHotels: Hotel[];
  onRemoveFromCompare: (hotel: Hotel) => void;
  onClearCompare: () => void;
  groupSize: GroupSize;
  oneWayBusFare: number;
  onSelectHotel: (hotel: Hotel) => void;
  selectedHotelId: string;
}

export default function CompareDrawer({
  compareHotels,
  onRemoveFromCompare,
  onClearCompare,
  groupSize,
  oneWayBusFare,
  onSelectHotel,
  selectedHotelId,
}: CompareDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const cheapestCompareHotel = React.useMemo(() => {
    if (compareHotels.length === 0) return null;
    return [...compareHotels].sort((a, b) => {
      const costA = calculateAllTripCosts(a, groupSize, oneWayBusFare);
      const costB = calculateAllTripCosts(b, groupSize, oneWayBusFare);
      return costA.individualCost - costB.individualCost;
    })[0];
  }, [compareHotels, groupSize, oneWayBusFare]);

  const bestBreakfastCompareHotel = React.useMemo(() => {
    const breakfastHotels = compareHotels.filter(h => h.breakfast);
    if (breakfastHotels.length === 0) return null;
    return [...breakfastHotels].sort((a, b) => {
      const costA = calculateAllTripCosts(a, groupSize, oneWayBusFare);
      const costB = calculateAllTripCosts(b, groupSize, oneWayBusFare);
      return costA.individualCost - costB.individualCost;
    })[0];
  }, [compareHotels, groupSize, oneWayBusFare]);

  if (compareHotels.length === 0) return null;

  return (
    <>
      {/* Sticky Bottom Compare Bar */}
      <div className="fixed bottom-16 sm:bottom-4 left-4 right-4 z-40 bg-slate-900 text-white rounded-2xl shadow-2xl p-4 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-5xl mx-auto transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500 p-2.5 rounded-xl text-white">
            <Shuffle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base flex items-center gap-1.5">
              Compare Hotels{' '}
              <span className="bg-sky-500/20 text-sky-300 text-xs px-2 py-0.5 rounded-full font-extrabold font-mono">
                {compareHotels.length}/3
              </span>
            </h3>
            <p className="text-slate-400 text-xs hidden sm:block">
              Select up to 3 hotels to see total per-person cost and features side-by-side.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 justify-between md:justify-end">
          {/* Selected Hotel Badges */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-[200px] sm:max-w-md">
            {compareHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="flex items-center gap-1.5 bg-slate-800 text-slate-100 text-xs px-2.5 py-1.5 rounded-lg border border-slate-750 flex-shrink-0"
              >
                <span className="truncate max-w-[80px] sm:max-w-[120px] font-semibold">
                  {hotel.name}
                </span>
                <button
                  onClick={() => onRemoveFromCompare(hotel)}
                  className="text-slate-400 hover:text-red-400 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(true)}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
            >
              Compare Now
            </button>
            <button
              onClick={onClearCompare}
              className="text-slate-400 hover:text-white text-xs px-2 py-2 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Detailed Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[85vh] overflow-y-auto shadow-2xl relative flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Shuffle className="w-5 h-5 text-sky-500" />
                  Hotel Comparison Matrix
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Budget breakdown for group size of <strong className="text-gray-700">{groupSize} persons </strong>({formatBDT(oneWayBusFare)} bus fare)
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Table-like Card Grid Layout */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex flex-row md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 snap-x snap-mandatory">
                {compareHotels.map((hotel) => {
                  const costs = calculateAllTripCosts(hotel, groupSize, oneWayBusFare);
                  const isSelected = selectedHotelId === hotel.id;
                  const isCheapest = cheapestCompareHotel?.id === hotel.id;
                  const isBestBreakfast = bestBreakfastCompareHotel?.id === hotel.id;

                  return (
                    <div
                      key={hotel.id}
                      className={`relative rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 min-w-[285px] md:min-w-0 snap-align-start flex-shrink-0 ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50/10 shadow-md ring-2 ring-sky-500/10'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      {/* Top ribbon if selected */}
                      <div className="flex flex-col gap-1 mb-2">
                        {isSelected && (
                          <span className="bg-sky-500 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wider text-center block shadow-xs">
                            Active Selection
                          </span>
                        )}
                        {isCheapest && (
                          <span className="bg-emerald-500 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wider text-center block shadow-xs">
                            🏆 Cheapest Selected Option 🏷️
                          </span>
                        )}
                        {isBestBreakfast && (
                          <span className="bg-amber-500 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wider text-center block shadow-xs">
                            🍳 Best Breakfast Value Stay
                          </span>
                        )}
                      </div>

                      {/* Header info */}
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-base text-gray-800 leading-tight">
                            {hotel.name}
                          </h3>
                          <button
                            onClick={() => onRemoveFromCompare(hotel)}
                            className="text-gray-400 hover:text-red-500 p-1 rounded-sm cursor-pointer"
                            title="Remove from comparison"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5 italic h-10 overflow-hidden line-clamp-2">
                          {hotel.roomName}
                        </p>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                            hotel.breakfast
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-150'
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {hotel.planType}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase border border-sky-105 ${
                            hotel.refundable
                              ? 'bg-sky-50/50 text-sky-800 border-sky-100'
                              : 'bg-rose-55 text-rose-700 border-rose-100'
                          }`}>
                            Refundable: {hotel.refundable ? 'Yes' : 'No'}
                          </span>
                        </div>

                        {/* Comparative Costs */}
                        <div className="mt-5 space-y-3 pt-4 border-t border-gray-100 font-sans text-xs">
                          {/* Share highlight */}
                          <div className="bg-[#006CE4]/10 rounded-2xl p-3 text-center border border-[#006CE4]/20">
                            <span className="text-[10px] uppercase font-bold text-[#006CE4] block tracking-wider">
                              Individual Cost Share
                            </span>
                            <span className="text-2xl font-black text-[#003B95] font-mono block mt-0.5">
                              {formatBDT(costs.individualCost)}
                            </span>
                            <span className="text-[9px] text-slate-500 block mt-0.5">
                              per person for {groupSize} members
                            </span>
                          </div>

                          <div className="space-y-2 pt-2 text-slate-700">
                            {/* Standardized properties list */}
                            <div className="flex justify-between items-center py-1 border-b border-slate-100">
                              <span className="text-slate-400 font-medium font-sans">Breakfast Status:</span>
                              <span className={`font-bold text-[11px] px-2 py-0.5 rounded-sm ${
                                hotel.breakfast
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}>
                                {hotel.breakfast ? '🍳 Included' : '🛏️ Room Only'}
                              </span>
                            </div>

                            <div className="flex justify-between items-center py-1 border-b border-slate-100">
                              <span className="text-slate-400 font-medium font-sans">Refundable Status:</span>
                              <span className={`font-bold text-[11px] px-2 py-0.5 rounded-sm ${
                                hotel.refundable
                                  ? 'bg-[#006CE4]/10 text-sky-800'
                                  : 'bg-rose-50 text-rose-700'
                              }`}>
                                {hotel.refundable ? '💚 Full Refund' : '🔒 Non-Refundable'}
                              </span>
                            </div>

                            <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-150 font-mono text-[11px]">
                              <div className="flex justify-between text-slate-500">
                                <span>Base Night price:</span>
                                <span className="font-semibold text-slate-700">
                                  {formatBDT(costs.basePrice)}
                                </span>
                              </div>
                              <div className="flex justify-between text-slate-500">
                                <span>Taxes & Fees:</span>
                                <span className="font-semibold text-slate-750">
                                  +{formatBDT(costs.taxesAndFees)}
                                </span>
                              </div>
                              <div className="flex justify-between text-emerald-600">
                                <span>bKash Disc. (3%):</span>
                                <span className="font-bold">
                                  -{formatBDT(costs.bkashDiscount)}
                                </span>
                              </div>
                              <div className="flex justify-between pt-1 border-t border-dashed border-slate-200 text-xs font-bold text-slate-800">
                                <span className="font-sans">Final Per-Room Cost:</span>
                                <span>{formatBDT(costs.finalPerRoomCost)}</span>
                              </div>
                            </div>

                            <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-200/50 text-[11px] font-sans">
                              <div className="flex justify-between text-slate-600">
                                <span className="font-medium">Total Hotel Cost ({costs.roomCount} rooms):</span>
                                <span className="font-bold font-mono text-slate-800">
                                  {formatBDT(costs.hotelTotal)}
                                </span>
                              </div>
                              <div className="flex justify-between text-slate-600">
                                <span className="font-medium">Total Bus Cost ({groupSize}p round):</span>
                                <span className="font-bold font-mono text-slate-800">
                                  {formatBDT(costs.busTotal)}
                                </span>
                              </div>
                              <div className="flex justify-between pt-1 border-t border-slate-200 font-extrabold text-[#006CE4] text-xs">
                                <span>Full Trip Total:</span>
                                <span className="font-mono text-lg">{formatBDT(costs.fullTripTotal)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Group capacity warnings */}
                        {(hotel.id === 'white-orchid-executive' || hotel.id === 'white-orchid-executive-couple-garden-view') && groupSize >= 5 && (
                          <div className="mt-4 bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-[10px] text-amber-700 flex items-start gap-1.5 leading-relaxed">
                            <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span>
                              Availability warning: this option showed only 2 rooms left in the screenshot, but this group needs {costs.roomCount} rooms. Recheck before booking.
                            </span>
                          </div>
                        )}

                        {/* Room Specifications comparative metadata */}
                        <div className="mt-4 border-t border-dashed border-gray-200 pt-3 text-[11px] grid grid-cols-2 gap-2 text-slate-700 font-sans">
                          <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                            <span className="text-gray-400 block font-bold uppercase text-[8px] tracking-wide">Room Size:</span>
                            <span className="font-bold text-slate-800">{hotel.details.roomDetails?.size || 'Standard'}</span>
                          </div>
                          <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                            <span className="text-gray-400 block font-bold uppercase text-[8px] tracking-wide">Room View:</span>
                            <span className="font-bold text-slate-805 truncate block" title={hotel.details.roomDetails?.view || 'Not Specified'}>
                              {hotel.details.roomDetails?.view || 'Standard View'}
                            </span>
                          </div>
                          <div className="col-span-2 bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                            <span className="text-gray-400 block font-bold uppercase text-[8px] tracking-wide">Layout & Bed Type:</span>
                            <span className="font-bold text-slate-805 block truncate" title={hotel.details.roomDetails?.characteristics || 'Double or Twin Bed configuration'}>
                              {hotel.details.roomDetails?.characteristics || 'Standard setup'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 bg-gray-50 rounded-xl p-3 text-xs text-gray-550 border border-gray-100">
                          <strong className="text-gray-700 block font-semibold mb-1 text-[11px]">Notes & Amenities:</strong>
                          {hotel.notes}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-5 pt-3 border-t border-gray-150">
                        <button
                          onClick={() => {
                            onSelectHotel(hotel);
                            setIsOpen(false);
                          }}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                              : 'bg-sky-500 hover:bg-sky-600 text-white'
                          }`}
                        >
                          {isSelected ? '✓ Currently Selected' : 'Choose as Target Hotel'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Foot note */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-[10px] text-gray-400">
              Comparing and planning with group rules. Tap 'Choose' to swap active website calculations.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
