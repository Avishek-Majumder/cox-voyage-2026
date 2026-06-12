import React, { useState } from 'react';
import { Users, User, Edit3, HelpCircle, Check, BedDouble, AlertCircle } from 'lucide-react';
import { GroupSize, Member } from '../types';
import { getRoomsNeeded, formatBDT } from '../data/hotels';

interface GroupSelectorProps {
  groupSize: GroupSize;
  onGroupSizeChange: (size: GroupSize) => void;
  members: Member[];
  onMembersChange: (members: Member[]) => void;
  oneWayBusFare: number;
}

export default function GroupSelector({
  groupSize,
  onGroupSizeChange,
  members,
  onMembersChange,
  oneWayBusFare,
}: GroupSelectorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');

  const roomsNeeded = getRoomsNeeded(groupSize);
  const roundTripBusCost = oneWayBusFare * 2;
  const groupBusTotal = groupSize * roundTripBusCost;

  const startEditing = (member: Member) => {
    setEditingId(member.id);
    setEditName(member.name);
  };

  const saveEdit = (id: string) => {
    if (!editName.trim()) return;
    const updated = members.map((m) =>
      m.id === id ? { ...m, name: editName.trim() } : m
    );
    onMembersChange(updated);
    setEditingId(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0F1A30] rounded-3xl p-6 shadow-xs border border-gray-100 dark:border-slate-800 mb-8 transition-colors duration-300" id="group-selector">
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center border-b border-gray-100 dark:border-slate-800 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-500" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white font-sans">Who is traveling?</h2>
          </div>
          <p className="text-gray-500 dark:text-slate-400 text-xs mt-1">
            Group size is fixed at 4 members. Room allocations & bus charges are fully locked.
          </p>
        </div>

        {/* Lock indicator */}
        <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto">
          <div className="inline-flex p-1 bg-slate-100 dark:bg-[#1A263F]/80 rounded-2xl border border-slate-200 dark:border-slate-800 w-full sm:w-auto select-none opacity-90">
            <span className="px-5 py-2.5 bg-[#006CE4] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              4 Persons (Locked)
            </span>
          </div>
          <span className="text-[10px] font-semibold text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-100/50 dark:border-rose-950/20 rounded-md px-2 py-1 text-center block sm:max-w-xs leading-tight">
            🔒 Group size is locked because 4 bus tickets have already been booked.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Room rule info block */}
        <div className="md:col-span-4 bg-sky-50/50 dark:bg-[#1A263F]/40 rounded-2xl p-4 border border-sky-100 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-sky-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wider block">
              Fixed Room Rule
            </span>
            <div className="flex items-center gap-2 mt-2">
              <BedDouble className="w-6 h-6 text-sky-500" />
              <span className="text-2xl font-black text-gray-900 dark:text-white font-mono">{roomsNeeded} Rooms</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">
              For <span className="font-semibold dark:text-slate-200">{groupSize} persons</span>, we always book{' '}
              <span className="font-semibold dark:text-slate-200">{roomsNeeded} rooms</span> to ensure perfect spacing.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-sky-100 dark:border-slate-800 text-xs text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Room Capacity constraint overridden as requested.</span>
          </div>
        </div>

        {/* Dynamic members list */}
        <div className="md:col-span-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">
              Travel Team List <span className="text-sky-500 dark:text-sky-400 lowercase">(Click to Rename)</span>
            </span>
            <span className="text-xs text-gray-500 dark:text-slate-400">
              Round-trip Bus Total: <strong className="text-gray-800 dark:text-slate-200">{formatBDT(groupBusTotal)}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {members.map((member, index) => {
              const isEditing = editingId === member.id;
              return (
                <div
                  key={member.id}
                  onClick={() => !isEditing && startEditing(member)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 group ${
                    isEditing
                      ? 'border-sky-500 bg-sky-50/40 ring-2 ring-sky-500/10'
                      : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-[#1A263F]/50 hover:border-sky-300 dark:hover:border-sky-500 hover:shadow-xs'
                  } cursor-pointer`}
                >
                  <div className="flex items-center gap-2.5 w-full">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 text-gray-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                      #{index + 1}
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => handleKeyPress(e, member.id)}
                          className="w-full text-sm font-bold text-gray-800 dark:text-white border-b border-sky-400 focus:outline-hidden bg-transparent"
                          autoFocus
                          maxLength={15}
                        />
                        <button
                          onClick={() => saveEdit(member.id)}
                          className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-xs cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-hidden">
                        <span className="font-bold text-sm text-gray-750 dark:text-slate-200 block truncate">
                          {member.name}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-slate-400 block font-mono">
                          Share:{' '}
                          {formatBDT(roundTripBusCost)} (Bus)
                        </span>
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <Edit3 className="w-3.5 h-3.5 text-gray-300 dark:text-slate-600 group-hover:text-sky-500 dark:group-hover:text-sky-400 opacity-60 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-3 text-[11px] text-amber-600 bg-amber-50 dark:bg-amber-950/20 rounded-lg p-2.5 border border-amber-100/50 dark:border-amber-950/30 dark:text-amber-400 transition-colors duration-300">
            💡 Click any member card above to custom rename them. These names will apply across your saved dashboard, cost split, and tickets sheet.
          </div>
        </div>
      </div>
    </div>
  );
}
