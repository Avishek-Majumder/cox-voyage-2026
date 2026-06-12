import React from 'react';
import { motion } from 'motion/react';
import { Calculator, Bus, Hotel as HotelIcon, ArrowRight, Info, Percent, RefreshCw } from 'lucide-react';
import { Hotel, GroupSize, TripCosts } from '../types';
import { calculateAllTripCosts, formatBDT } from '../data/hotels';

interface CalculatorPanelProps {
  selectedHotel: Hotel;
  groupSize: GroupSize;
  oneWayBusFare: number;
  onBusFareChange: (fare: number) => void;
}

export default function CalculatorPanel({
  selectedHotel,
  groupSize,
  oneWayBusFare,
  onBusFareChange,
}: CalculatorPanelProps) {
  const costs: TripCosts = calculateAllTripCosts(selectedHotel, groupSize, oneWayBusFare);

  const resetBusFare = () => {
    onBusFareChange(2000);
  };

  return (
    <div className="bg-white dark:bg-[#0F1A30] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors duration-300" id="cost-calculator">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 dark:border-slate-800 pb-5 mb-5">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-sky-500" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white font-sans">Formula Breakdown</h2>
        </div>
        <div className="flex items-center gap-2 bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-305 text-xs font-semibold px-2.5 py-1 rounded-lg">
          <Info className="w-3.5 h-3.5" />
          Selected: {selectedHotel.name}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Math column */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-2">Calculation Flow</h3>
          
          {/* Step 1: Per Room Cost */}
          <div className="bg-gray-50/50 dark:bg-[#1A263F]/20 rounded-2xl p-4 border border-gray-200/60 dark:border-slate-800/80 relative">
            <span className="absolute top-4 right-4 bg-gray-100 dark:bg-[#0F1A30] text-gray-600 dark:text-slate-350 font-mono text-[10px] px-2 py-0.5 rounded-md font-semibold">
              STEP 1
            </span>
            <h4 className="text-sm font-bold text-gray-800 dark:text-slate-105 flex items-center gap-1.5">
              <HotelIcon className="w-4 h-4 text-sky-500" />
              Final Per Room Cost
            </h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Base Price + Taxes & Fees - 3% bKash Discount</p>
            
            <div className="mt-3 font-mono text-xs sm:text-sm text-gray-700 dark:text-slate-300 space-y-1 bg-white dark:bg-[#0F1A30] p-3 rounded-xl border border-gray-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span>Base Room Price:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatBDT(costs.basePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Service Fees:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">+{formatBDT(costs.taxesAndFees)}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-gray-100 dark:border-slate-800">
                <span className="flex items-center gap-0.5">
                  bKash Discount <span className="bg-sky-100 dark:bg-[#003B95]/40 text-sky-700 dark:text-sky-300 text-[9px] px-1 rounded-sm font-semibold">3%</span>:
                </span>
                <span className="font-semibold text-orange-600 dark:text-orange-450">-{formatBDT(costs.bkashDiscount)}</span>
              </div>
              <div className="flex justify-between pt-1.5 text-sm font-bold text-sky-600 dark:text-sky-400">
                <span>Final Per Room:</span>
                <span>{formatBDT(costs.finalPerRoomCost)}</span>
              </div>
            </div>
          </div>

          {/* Step 2: Hotel Total */}
          <div className="bg-gray-50/50 dark:bg-[#1A263F]/20 rounded-2xl p-4 border border-gray-200/60 dark:border-slate-800/80 relative">
            <span className="absolute top-4 right-4 bg-gray-100 dark:bg-[#0F1A30] text-gray-600 dark:text-slate-350 font-mono text-[10px] px-2 py-0.5 rounded-md font-semibold">
              STEP 2
            </span>
            <h4 className="text-sm font-bold text-gray-800 dark:text-slate-105 flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-sky-500" />
              Hotel Total Billing
            </h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Final Per Room Cost × Allocated Rooms</p>
            
            <div className="mt-3 font-mono text-xs sm:text-sm text-gray-700 dark:text-slate-300 bg-white dark:bg-[#0F1A30] p-3 rounded-xl border border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span>{formatBDT(costs.finalPerRoomCost)}</span>
                <span className="text-gray-400 dark:text-slate-500 mx-1.5">×</span>
                <span className="font-semibold bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-300 px-2 py-0.5 rounded-md">{costs.roomCount} Rooms</span>
              </div>
              <span className="font-bold text-sm text-gray-900 dark:text-white">{formatBDT(costs.hotelTotal)}</span>
            </div>
          </div>

          {/* Step 3: Bus Cost */}
          <div className="bg-gray-50/50 dark:bg-[#1A263F]/20 rounded-2xl p-4 border border-gray-200/60 dark:border-slate-800/80 relative">
            <span className="absolute top-4 right-4 bg-gray-100 dark:bg-[#0F1A30] text-gray-600 dark:text-slate-350 font-mono text-[10px] px-2 py-0.5 rounded-md font-semibold font-bold">
              STEP 3
            </span>
            <h4 className="text-sm font-bold text-gray-800 dark:text-slate-105 flex items-center gap-1.5">
              <Bus className="w-4 h-4 text-sky-500" />
              Round-Trip Bus Total
            </h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Persons × Round-Trip fare (One-way × 2)</p>
            
            <div className="mt-3 space-y-2 bg-white dark:bg-[#0F1A30] p-3.5 rounded-xl border border-gray-150 dark:border-slate-800 text-xs">
              <div className="flex justify-between items-center text-gray-600 dark:text-slate-400 leading-normal">
                <span className="flex items-center gap-1.5 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Outbound Bus (Shohagh Poribohon):
                </span>
                <div className="text-right">
                  <span className="font-extrabold font-mono text-gray-905 dark:text-slate-100">{formatBDT(8700)}</span>
                  <span className="text-[10px] block font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/25 px-1 py-0.5 rounded ml-1">Confirmed</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-gray-600 dark:text-slate-400 pt-1.5 border-t border-dashed border-gray-250/50 dark:border-slate-800 leading-normal">
                <span className="flex items-center gap-1.5 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Return Bus (Confirmed):
                </span>
                <div className="text-right">
                  <span className="font-extrabold font-mono text-gray-905 dark:text-slate-100">{formatBDT(groupSize * oneWayBusFare)}</span>
                  <span className="text-[10px] block font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/25 px-1 py-0.5 rounded ml-1 font-mono">Confirmed</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm font-black pt-2 border-t border-gray-200 dark:border-slate-750">
                <span className="text-gray-800 dark:text-white font-sans">Total Confirmed Bus Transit:</span>
                <span className="text-sky-600 dark:text-sky-400 font-mono font-black">{formatBDT(costs.busTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Adjust fare controls & summary column */}
        <div className="lg:col-span-4 bg-sky-900 text-sky-100 rounded-3xl p-6 flex flex-col justify-between shadow-inner">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-sky-300">Set Bus Fare</h3>
            <p className="text-[11px] text-sky-200 mt-1 pb-4 border-b border-sky-800">
              Customize one-way bus fare per person below.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>One-Way Fare:</span>
                  <span className="text-yellow-300 font-mono font-bold text-sm">{formatBDT(oneWayBusFare)}</span>
                </div>
                
                <input
                  type="range"
                  min="1000"
                  max="4000"
                  step="50"
                  value={oneWayBusFare}
                  onChange={(e) => onBusFareChange(Number(e.target.value))}
                  className="w-full h-1.5 bg-sky-850 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                />
                
                <div className="flex justify-between text-[10px] text-sky-300 font-mono mt-1">
                  <span>{formatBDT(1000)}</span>
                  <span>{formatBDT(4000)}</span>
                </div>
              </div>

              {oneWayBusFare !== 2000 && (
                <button
                  onClick={resetBusFare}
                  className="flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-white rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors w-full cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset to Standard ({formatBDT(2000)})
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-sky-800 space-y-4">
            <div>
              <span className="text-xs text-sky-300 block font-bold">Grand Trip Cost</span>
              <motion.span
                key={costs.fullTripTotal}
                initial={{ opacity: 0.5, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="text-2xl font-black text-white font-mono block mt-0.5"
              >
                {formatBDT(costs.fullTripTotal)}
              </motion.span>
            </div>

            <div className="bg-sky-800/50 p-4 rounded-2xl border border-sky-700/50">
              <span className="text-xs text-yellow-300 font-bold block uppercase tracking-wider">
                Individual Share:
              </span>
              <div className="flex items-baseline gap-1 mt-1 font-mono">
                <motion.span
                  key={costs.individualCost}
                  initial={{ opacity: 0.5, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, type: 'spring', stiffness: 200 }}
                  className="text-3xl font-black text-yellow-300 block"
                >
                  {formatBDT(costs.individualCost)}
                </motion.span>
                <span className="text-xs text-sky-200">/ person</span>
              </div>
              <p className="text-[10px] text-sky-200 mt-2 leading-tight">
                {costs.fullTripTotal} BDT / {groupSize} members
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
