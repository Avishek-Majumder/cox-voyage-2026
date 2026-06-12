import React from 'react';
import { DollarSign, CheckCircle2, AlertCircle, Info, RefreshCw, Layers } from 'lucide-react';
import { Hotel, GroupSize, TripCosts } from '../types';
import { calculateAllTripCosts, formatBDT } from '../data/hotels';

export interface MemberSplit {
  memberId: string;
  memberName: string;
  paidAmount: number;
  status: 'Paid' | 'Partial' | 'Pending';
  note: string;
}

interface CostSplitProps {
  selectedHotel: Hotel;
  groupSize: GroupSize;
  oneWayBusFare: number;
  members: { id: string; name: string }[];
  memberSplits: MemberSplit[];
  onMemberSplitsChange: (splits: MemberSplit[]) => void;
}

export default function CostSplit({
  selectedHotel,
  groupSize,
  oneWayBusFare,
  members,
  memberSplits,
  onMemberSplitsChange,
}: CostSplitProps) {
  const costs: TripCosts = calculateAllTripCosts(selectedHotel, groupSize, oneWayBusFare);

  // Fallback and fill defaults safely if member splits is empty or has wrong length
  const resolvedSplits = React.useMemo(() => {
    const list: MemberSplit[] = [];
    members.forEach((m) => {
      const existing = memberSplits.find((s) => s.memberId === m.id);
      list.push({
        memberId: m.id,
        memberName: m.name,
        paidAmount: existing ? existing.paidAmount : 0,
        status: existing ? existing.status : 'Pending',
        note: existing ? existing.note : '',
      });
    });
    return list;
  }, [members, memberSplits]);

  const updateSplit = (memberId: string, field: keyof MemberSplit, value: any) => {
    const updated = resolvedSplits.map((item) => {
      if (item.memberId === memberId) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onMemberSplitsChange(updated);
  };

  const outboundBusTotal = 8700;
  const estimatedReturnFarePerPerson = 2175;
  const estimatedReturnTotal = 8700;
  const totalBusEstimateCombined = outboundBusTotal + estimatedReturnTotal;

  const outboundPerPerson = 2175;
  const returnPerPerson = 2175;
  const busTotalPerPerson = outboundPerPerson + returnPerPerson;
  const hotelPerPerson = Math.round(costs.hotelTotal / 4);

  return (
    <div id="cost-split-dashboard" className="bg-white dark:bg-[#0F1A30] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 dark:border-slate-800 pb-5 mb-6">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white font-sans">Trip Wallet & Cost Split</h2>
        </div>
        <span className="text-[10px] uppercase font-black tracking-widest bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-md">
          4-Person Settled Split
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
        {/* Left Side: Summary Cards */}
        <div className="xl:col-span-4 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">
            Transit & Lodging Budget
          </h3>

          {/* Transit breakdown */}
          <div className="p-4 bg-slate-50 dark:bg-[#1A263F]/50 border border-slate-150 dark:border-slate-805/40 rounded-2xl space-y-3 font-sans">
            <span className="text-[10px] text-indigo-500 font-extrabold uppercase">Bus Transit Matrix</span>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-655 dark:text-slate-300">
                <span>Outbound Bus (Confirmed):</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{formatBDT(outboundBusTotal)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-655 dark:text-slate-300">
                <span>Return Bus (Confirmed):</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{formatBDT(estimatedReturnTotal)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200/50 dark:border-slate-800 text-slate-900 dark:text-white font-black">
                <span>Total Bus Cost:</span>
                <span>{formatBDT(totalBusEstimateCombined)}</span>
              </div>
            </div>
          </div>

          {/* Individual Shares list */}
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 dark:border-emerald-555/5 rounded-2xl space-y-3 text-xs leading-normal">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase block">
              Individual Cost Matrix (x1)
            </span>
            <div className="space-y-1.5 text-slate-655 dark:text-slate-300 font-medium">
              <div className="flex justify-between text-[11px]">
                <span>Outbound Bus per person:</span>
                <span className="font-bold font-mono">{formatBDT(outboundPerPerson)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Return Bus per person:</span>
                <span className="font-bold font-mono">{formatBDT(returnPerPerson)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Hotel Grand Pacific share:</span>
                <span className="font-bold font-mono">{formatBDT(hotelPerPerson)}</span>
              </div>
              <div className="flex justify-between pt-1.5 mt-1.5 border-t border-emerald-500/10 dark:border-emerald-500/10 font-bold text-emerald-800 dark:text-emerald-300 text-xs">
                <span>Total Budget Per Person:</span>
                <span className="font-black font-mono">{formatBDT(costs.individualCost)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl text-xs space-y-1 leading-normal">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase">
              <Info className="w-3.5 h-3.5" />
              <span>Hotel Billing note</span>
            </div>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              Hotel payment details are available in invoice and voucher.
            </p>
          </div>
        </div>

        {/* Right Side: Active Members Payment Grid */}
        <div className="xl:col-span-8 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">
            Travel Members Cost Tracker
          </h3>

          <div className="space-y-3.5">
            {resolvedSplits.map((split) => {
              const totalOwed = costs.individualCost;
              const due = Math.max(0, totalOwed - split.paidAmount);

              return (
                <div
                  key={split.memberId}
                  className="p-4 bg-slate-50 dark:bg-[#1A263F]/40 border border-slate-150 dark:border-slate-805/40 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                >
                  {/* Name and share summary */}
                  <div className="space-y-1 md:max-w-[200px] w-full">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                      {split.memberName}
                    </h4>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold space-y-0.5">
                      <div className="flex justify-between">
                        <span>Owed:</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{formatBDT(totalOwed)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Due:</span>
                        <span className="font-mono text-rose-500 dark:text-rose-400 font-bold">{formatBDT(due)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Editors column */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                    {/* Paid Amount Input */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1 uppercase">
                        Paid Amount (BDT ৳)
                      </label>
                      <input
                        type="number"
                        value={split.paidAmount || ''}
                        onChange={(e) => updateSplit(split.memberId, 'paidAmount', Number(e.target.value))}
                        placeholder="0"
                        className="w-full bg-white dark:bg-[#0F1A30] text-xs font-bold text-slate-800 dark:text-slate-105 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Status Dropdown */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1 uppercase">
                        Payment Status
                      </label>
                      <select
                        value={split.status}
                        onChange={(e) => updateSplit(split.memberId, 'status', e.target.value)}
                        className="w-full bg-white dark:bg-[#0F1A30] text-xs font-bold text-slate-800 dark:text-slate-105 px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Partial">Partial</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>

                    {/* Personal Note */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1 uppercase">
                        Note / Cash method
                      </label>
                      <input
                        type="text"
                        value={split.note}
                        onChange={(e) => updateSplit(split.memberId, 'note', e.target.value)}
                        placeholder="e.g., bKash send money"
                        className="w-full bg-white dark:bg-[#0F1A30] text-xs px-3 py-2 rounded-xl text-slate-800 dark:text-slate-105 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        maxLength={40}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
