import React, { useState, useEffect } from 'react';
import { Ticket, CheckCircle2, AlertTriangle, FileText, ExternalLink, X, UserCheck, Users, CornerDownRight, Calendar, Landmark, MapPin } from 'lucide-react';
import { busBooking, returnBusBooking, BusTicket, BusBooking } from '../data/tickets';
import { hotelBookingDocuments, HotelBookingDocument } from '../data/bookingDocuments';
import { Member } from '../types';
import BookingDocumentViewer from './BookingDocumentViewer';
import CopyButton from './CopyButton';

interface TicketsBookingSectionProps {
  groupSize: number;
  members: Member[];
  formatBDT: (amount: number) => string;
  ticketAssignments: Record<string, string>; // ticketId -> memberName
  onUpdateAssignment: (ticketId: string, memberName: string) => void;
}

export default function TicketsBookingSection({
  groupSize,
  members,
  formatBDT,
  ticketAssignments,
  onUpdateAssignment,
}: TicketsBookingSectionProps) {
  const [activeTab, setActiveTab] = useState<'bus' | 'hotel'>('bus');
  
  // Reusable Doc Viewer state
  const [selectedDoc, setSelectedDoc] = useState<{
    title: string;
    type: string;
    viewUrl: string;
    embedUrl: string;
  } | null>(null);

  // Auto assign default names if group size is 4 and no assignments are made yet
  useEffect(() => {
    if (groupSize === 4) {
      const defaultNames = ['Joana', 'Avishek', 'Kevin', 'Ishraq'];
      
      // Outbound auto-assignment
      const isOutboundEmpty = busBooking.seats.every(seat => !ticketAssignments[seat.id]);
      if (isOutboundEmpty) {
        busBooking.seats.forEach((seat, idx) => {
          const member = members.find(m => m.name.toLowerCase() === defaultNames[idx].toLowerCase()) || members[idx];
          if (member) {
            onUpdateAssignment(seat.id, member.name);
          }
        });
      }

      // Return auto-assignment
      const isReturnEmpty = returnBusBooking.seats.every(seat => !ticketAssignments[seat.id]);
      if (isReturnEmpty) {
        returnBusBooking.seats.forEach((seat, idx) => {
          const member = members.find(m => m.name.toLowerCase() === defaultNames[idx].toLowerCase()) || members[idx];
          if (member) {
            onUpdateAssignment(seat.id, member.name);
          }
        });
      }
    }
  }, [groupSize, members, ticketAssignments]);

  return (
    <div className="bg-white dark:bg-[#0F1A30] rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-150 dark:border-slate-800 transition-colors duration-300 mb-8" id="tickets-booking">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#006CE4]" />
            Confirmed Bus Tickets 🚍
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Both Dhaka to Cox’s Bazar and Cox’s Bazar to Dhaka tickets are booked.
          </p>
        </div>
        
        {/* Confirmed badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-black px-3 py-1.5 rounded-full border border-emerald-250 dark:border-emerald-800/60 font-sans tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-505 animate-pulse"></span>
            Bus: Shohagh Paribahan
          </span>
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-black px-3 py-1.5 rounded-full border border-emerald-250 dark:border-emerald-800/60 font-sans tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-555 animate-pulse"></span>
            Return/Departure: Booked
          </span>
          <span className="inline-flex items-center gap-1.5 bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-450 text-xs font-black px-3 py-1.5 rounded-full border border-sky-250 dark:border-sky-800/60 font-sans tracking-wide">
            <span className="w-2 h-2 rounded-full bg-sky-505 animate-pulse"></span>
            Hotel: Booked
          </span>
        </div>
      </div>

      {/* Chapter Toggle Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-[#15223F] rounded-2xl mb-6 max-w-md">
        <button
          onClick={() => setActiveTab('bus')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'bus'
              ? 'bg-white dark:bg-[#006CE4] text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <span>🚍 Bus Tickets</span>
          <span className="px-1.5 py-0.5 text-[10px] bg-emerald-100 dark:bg-emerald-850/60 text-emerald-700 dark:text-emerald-350 rounded-md font-mono">
            8 Seats
          </span>
        </button>
        <button
          onClick={() => setActiveTab('hotel')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'hotel'
              ? 'bg-white dark:bg-[#006CE4] text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <span>🏨 Hotel Stay Docs</span>
          <span className="px-1.5 py-0.5 text-[10px] bg-sky-100 dark:bg-sky-850/60 text-sky-700 dark:text-sky-350 rounded-md font-mono">
            Invoice/Vou
          </span>
        </button>
      </div>

      {/* Tab 1: BUS BOOKING TRANST SECTION */}
      {activeTab === 'bus' && (
        <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-200">
          
          {/* Top Summary Card */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full font-mono">
                Fully Booked
              </span>
              <h3 className="text-base font-black text-slate-905 dark:text-white mt-1">
                Dhaka &mdash; Cox’s Bazar Round-trip Complete
              </h3>
              <p className="text-xs text-slate-505 dark:text-slate-400">
                Operator: <strong>{busBooking.operator}</strong> &bull; Total tickets: 8 entries across 2 journeys &bull; Trip group size: 4 people
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-sans text-right shrink-0 border-l border-emerald-500/20 pl-4">
              <div>
                <span className="text-slate-500 block">Dhaka &rarr; Cox:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">Booked</span>
              </div>
              <div>
                <span className="text-slate-500 block">Cox &rarr; Dhaka:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">Booked</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-dashed border-emerald-500/20">
                <span className="text-slate-500 mr-2">Total Confirmed Bus Cost:</span>
                <strong className="font-mono text-sm text-[#003B95] dark:text-sky-305 font-black">{formatBDT(17400)}</strong>
                <span className="text-[10px] text-slate-400 block font-bold uppercase mt-0.5">({formatBDT(4350)} per person round-trip)</span>
              </div>
            </div>
          </div>

          {/* TWO MAIN TICKET CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1 &mdash; Departure to Cox */}
            <div className="bg-slate-50 dark:bg-[#1A263F]/20 p-5 rounded-2.5xl border border-slate-250/60 dark:border-slate-800 flex flex-col justify-between hover:shadow-xs transition duration-200">
              <div className="space-y-3.5">
                <div className="flex justify-between items-start border-b border-slate-200/50 dark:border-slate-800/80 pb-3">
                  <div>
                    <h4 className="font-black text-sm text-slate-850 dark:text-white leading-snug">
                      Departure from Dhaka and Arrival in Cox’s Bazar
                    </h4>
                    <span className="text-[10px] uppercase font-bold text-[#006CE4] dark:text-sky-400 mt-1 block">
                      Outbound Journey
                    </span>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-lg">
                    Booked
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-xs font-sans">
                  <div>
                    <span className="text-slate-455 block">Route:</span>
                    <strong className="text-slate-800 dark:text-slate-250 block font-bold">{busBooking.routeLabel}</strong>
                  </div>
                  <div>
                    <span className="text-slate-455 block">Boarding / Counter:</span>
                    <strong className="text-slate-800 dark:text-slate-250 block font-bold">{busBooking.boardingPoint}</strong>
                  </div>
                  <div>
                    <span className="text-slate-455 block">Reporting / Departure:</span>
                    <strong className="text-slate-800 dark:text-slate-250 block font-mono">
                      {busBooking.reportingTime} / <span className="text-[#006CE4] dark:text-sky-400">{busBooking.departureTime}</span>
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-455 block">Trip Date:</span>
                    <strong className="text-slate-800 dark:text-slate-250 block font-bold">{busBooking.tripDate}</strong>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Confirmed Seats ({busBooking.seats.length}):</span>
                      <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{busBooking.seats.map(s => s.seat).join(', ')}</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Total outbound cost:</span>
                      <span className="font-mono">{formatBDT(busBooking.totalPaid)}</span>
                    </div>
                    <div className="flex justify-between text-[10.5px] text-slate-500 mt-0.5">
                      <span>Per person share:</span>
                      <span className="font-mono">{formatBDT(busBooking.perTicketCost)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200/50 dark:border-slate-800/60 flex gap-2">
                <button
                  onClick={() => setSelectedDoc({
                    title: "Departure from Dhaka and Arrival in Cox’s Bazar",
                    type: "Bus Ticket",
                    viewUrl: busBooking.ticketViewUrl,
                    embedUrl: busBooking.ticketEmbedUrl
                  })}
                  className="flex-1 py-2 px-3 bg-[#003B95] dark:bg-[#0051BE] hover:bg-[#002B70] dark:hover:bg-[#00419C] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-97 shadow-xxs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Ticket</span>
                </button>
                <a
                  href={busBooking.ticketViewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 bg-slate-200 dark:bg-[#1A263F] hover:bg-slate-300 dark:hover:bg-[#2A3754] text-slate-700 dark:text-slate-250 transition rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer border border-slate-300/30 dark:border-slate-800"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Drive</span>
                </a>
              </div>
            </div>

            {/* Card 2 &mdash; Return to Dhaka */}
            <div className="bg-slate-50 dark:bg-[#1A263F]/20 p-5 rounded-2.5xl border border-slate-250/60 dark:border-slate-800 flex flex-col justify-between hover:shadow-xs transition duration-200">
              <div className="space-y-3.5">
                <div className="flex justify-between items-start border-b border-slate-200/50 dark:border-slate-800/80 pb-3">
                  <div>
                    <h4 className="font-black text-sm text-slate-850 dark:text-white leading-snug">
                      Departure from Cox’s Bazar and Arrival in Dhaka
                    </h4>
                    <span className="text-[10px] uppercase font-bold text-[#006CE4] dark:text-sky-400 mt-1 block">
                      Return Journey
                    </span>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-lg">
                    Booked
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-xs font-sans">
                  <div>
                    <span className="text-slate-455 block">Route:</span>
                    <strong className="text-slate-800 dark:text-slate-250 block font-bold">{returnBusBooking.routeLabel}</strong>
                  </div>
                  <div>
                    <span className="text-slate-455 block">Boarding / Counter:</span>
                    <strong className="text-slate-800 dark:text-slate-250 block font-bold">{returnBusBooking.boardingPoint}</strong>
                  </div>
                  <div>
                    <span className="text-slate-455 block">Reporting / Departure:</span>
                    <strong className="text-slate-800 dark:text-slate-250 block font-mono">
                      {returnBusBooking.reportingTime} / <span className="text-[#006CE4] dark:text-sky-400">{returnBusBooking.departureTime}</span>
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-455 block">Trip Date:</span>
                    <strong className="text-slate-800 dark:text-slate-250 block font-bold">{returnBusBooking.tripDate}</strong>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Confirmed Seats ({returnBusBooking.seats.length}):</span>
                      <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{returnBusBooking.seats.map(s => s.seat).join(', ')}</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Total return cost:</span>
                      <span className="font-mono">{formatBDT(returnBusBooking.totalPaid)}</span>
                    </div>
                    <div className="flex justify-between text-[10.5px] text-slate-500 mt-0.5">
                      <span>Per person share:</span>
                      <span className="font-mono">{formatBDT(returnBusBooking.perTicketCost)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200/50 dark:border-slate-800/60 flex gap-2">
                <button
                  onClick={() => setSelectedDoc({
                    title: "Departure from Cox’s Bazar and Arrival in Dhaka",
                    type: "Bus Ticket",
                    viewUrl: returnBusBooking.ticketViewUrl,
                    embedUrl: returnBusBooking.ticketEmbedUrl
                  })}
                  className="flex-1 py-2 px-3 bg-[#003B95] dark:bg-[#0051BE] hover:bg-[#002B70] dark:hover:bg-[#00419C] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-97 shadow-xxs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Ticket</span>
                </button>
                <a
                  href={returnBusBooking.ticketViewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 bg-slate-200 dark:bg-[#1A263F] hover:bg-slate-300 dark:hover:bg-[#2A3754] text-slate-700 dark:text-slate-250 transition rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer border border-slate-300/30 dark:border-slate-800"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Drive</span>
                </a>
              </div>
            </div>

          </div>

          {/* INDIVIDUAL SEAT DECAL ASSIGNMENTS */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                  Seat Assignations & Member Roster (8 Seats Total)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Assign each squad member to exactly one seat per direction. Duplicate seat assignments per journey are prevented.
                </p>
              </div>
              {groupSize !== 4 && (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  Squad size is {groupSize}
                </span>
              )}
            </div>

            {/* Outbound Seats Selection */}
            <div>
              <h5 className="text-[11px] font-black text-[#006CE4] dark:text-sky-400 tracking-wider uppercase mb-3 flex items-center gap-1">
                <CornerDownRight className="w-3 h-3 shrink-0" />
                Dhaka &rarr; Cox’s Bazar Seat Assignments
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {busBooking.seats.map((seat: BusTicket) => {
                  const assignedName = ticketAssignments[seat.id] || "";
                  
                  // Collect other assigned names to prevent duplicate seat allocation
                  const assignedOnOtherSeatsOutbound = busBooking.seats
                    .filter(s => s.id !== seat.id)
                    .map(s => ticketAssignments[s.id])
                    .filter(Boolean);

                  return (
                    <div
                      key={seat.id}
                      className="bg-slate-50 dark:bg-[#1a263f]/30 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] text-slate-400 font-sans">Outbound Seat</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase font-mono">Booked</span>
                        </div>
                        <strong className="text-lg font-black font-mono text-slate-850 dark:text-white leading-none">
                          {seat.seat}
                        </strong>
                        <div className="text-[10.5px] text-slate-500 mt-2 space-y-0.5 font-sans">
                          <div>Route: <span className="font-semibold text-slate-700 dark:text-slate-300">Dhaka &rarr; Cox</span></div>
                          <div>Cost share: <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">{formatBDT(seat.cost)}</span></div>
                        </div>
                      </div>

                      <div className="mt-3.5 space-y-1">
                        <label className="block text-[9px] text-slate-400 uppercase font-black tracking-widest">
                          Assign Passenger:
                        </label>
                        <div className="relative">
                          <select
                            value={assignedName}
                            onChange={(e) => onUpdateAssignment(seat.id, e.target.value)}
                            className="w-full text-xs font-bold py-2 pl-2 pr-7 bg-white dark:bg-[#15223F] border border-slate-200 dark:border-slate-750 text-slate-850 dark:text-slate-200 rounded-xl focus:ring-1 focus:ring-[#006CE4] transition cursor-pointer appearance-none"
                          >
                            <option value="">-- Unassigned --</option>
                            {members.map((member) => {
                              const isUnavaliable = assignedOnOtherSeatsOutbound.includes(member.name);
                              return (
                                <option 
                                  key={member.id} 
                                  value={member.name}
                                  disabled={isUnavaliable}
                                >
                                  {member.name} {isUnavaliable ? '(taken)' : ''}
                                </option>
                              );
                            })}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                            <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Return Seats Selection */}
            <div className="pt-2">
              <h5 className="text-[11px] font-black text-[#006CE4] dark:text-sky-400 tracking-wider uppercase mb-3 flex items-center gap-1">
                <CornerDownRight className="w-3 h-3 shrink-0" />
                Cox’s Bazar &rarr; Dhaka Seat Assignments
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {returnBusBooking.seats.map((seat: BusTicket) => {
                  const assignedName = ticketAssignments[seat.id] || "";
                  
                  // Collect other assigned names to prevent duplicate seat allocation
                  const assignedOnOtherSeatsReturn = returnBusBooking.seats
                    .filter(s => s.id !== seat.id)
                    .map(s => ticketAssignments[s.id])
                    .filter(Boolean);

                  return (
                    <div
                      key={seat.id}
                      className="bg-slate-50 dark:bg-[#1a263f]/30 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] text-slate-400 font-sans">Return Seat</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase font-mono">Booked</span>
                        </div>
                        <strong className="text-lg font-black font-mono text-slate-850 dark:text-white leading-none">
                          {seat.seat}
                        </strong>
                        <div className="text-[10.5px] text-slate-505 mt-2 space-y-0.5 font-sans">
                          <div>Route: <span className="font-semibold text-slate-700 dark:text-slate-300">Cox &rarr; Dhaka</span></div>
                          <div>Cost share: <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">{formatBDT(seat.cost)}</span></div>
                        </div>
                      </div>

                      <div className="mt-3.5 space-y-1">
                        <label className="block text-[9px] text-slate-400 uppercase font-black tracking-widest">
                          Assign Passenger:
                        </label>
                        <div className="relative">
                          <select
                            value={assignedName}
                            onChange={(e) => onUpdateAssignment(seat.id, e.target.value)}
                            className="w-full text-xs font-bold py-2 pl-2 pr-7 bg-white dark:bg-[#15223F] border border-slate-200 dark:border-slate-750 text-slate-850 dark:text-slate-200 rounded-xl focus:ring-1 focus:ring-[#006CE4] transition cursor-pointer appearance-none"
                          >
                            <option value="">-- Unassigned --</option>
                            {members.map((member) => {
                              const isUnavaliable = assignedOnOtherSeatsReturn.includes(member.name);
                              return (
                                <option 
                                  key={member.id} 
                                  value={member.name}
                                  disabled={isUnavaliable}
                                >
                                  {member.name} {isUnavaliable ? '(taken)' : ''}
                                </option>
                              );
                            })}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                            <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: HOTEL BOOKING DOCUMENTS SECTION */}
      {activeTab === 'hotel' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in text-slate-850 dark:text-slate-200">
          {/* Left Column: Summary Card */}
          <div className="lg:col-span-4 bg-gradient-to-tr from-[#003B95]/5 to-[#006CE4]/5 dark:from-[#1E293B]/10 dark:to-[#1E293B]/20 rounded-2.5xl p-5 border border-slate-200/50 dark:border-slate-800 transition-colors">
            <h3 className="text-xs font-extrabold uppercase text-[#006CE4] dark:text-sky-400 tracking-wider">
              Hotel Booking Status
            </h3>
            <div className="mt-4 space-y-3.5 text-xs text-slate-700 dark:text-slate-300 font-sans">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Status:</span>
                <span className="font-extrabold text-sky-600 dark:text-sky-455 bg-sky-50 dark:bg-sky-955/20 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-sky-850/40 text-[10px]">
                  Hotel Booked
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Hotel Stay:</span>
                <span className="font-black text-slate-800 dark:text-slate-200">Hotel Grand Pacific</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Documents:</span>
                <strong className="text-slate-850 dark:text-white font-bold">Invoice & Voucher</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Check-In:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-sky-500" />
                  Friday, 19 Jun 2026
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Check-Out:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  Sunday, 21 Jun 2026
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Duration:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">2 Nights Stay</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Emergency Contact:</span>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-bold text-slate-850 dark:text-white font-mono">01711746681</span>
                  <CopyButton value="01711746681" label="Copy" className="scale-90" />
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[10.5px] text-slate-505 dark:text-slate-400 leading-relaxed font-sans cursor-default">
                ℹ️ Booking details are available in the attached invoice and voucher. Open the specific cards on the right to read full details.
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedDoc({
                  title: hotelBookingDocuments[0].title,
                  type: hotelBookingDocuments[0].type,
                  viewUrl: hotelBookingDocuments[0].viewUrl,
                  embedUrl: hotelBookingDocuments[0].embedUrl
                })}
                className="py-2.5 px-3 bg-[#006CE4] hover:bg-[#0051BE] text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Invoice</span>
              </button>
              <button
                onClick={() => setSelectedDoc({
                  title: hotelBookingDocuments[1].title,
                  type: hotelBookingDocuments[1].type,
                  viewUrl: hotelBookingDocuments[1].viewUrl,
                  embedUrl: hotelBookingDocuments[1].embedUrl
                })}
                className="py-2.5 px-3 bg-[#003B95] hover:bg-[#002B70] text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Voucher</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hotel Booking Documents */}
          <div className="lg:col-span-8 space-y-4">
            <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              Confirmed Hotel Booking Documents
            </h4>

            {/* Grid of 2 documents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hotelBookingDocuments.map((doc: HotelBookingDocument) => (
                <div
                  key={doc.id}
                  className="bg-slate-50 dark:bg-[#1A263F]/20 rounded-2.5xl p-5 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between hover:border-slate-350 dark:hover:border-slate-700 transition duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#006CE4] dark:text-sky-400 tracking-wider font-mono">
                          {doc.type}
                        </span>
                        <h4 className="text-base font-black text-slate-850 dark:text-white leading-tight mt-1">
                          {doc.title}
                        </h4>
                      </div>
                      <span className="inline-flex items-center gap-1 bg-emerald-505/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        {doc.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-505 dark:text-slate-400 leading-relaxed font-sans">
                      {doc.description} Google Drive File ID: <span className="font-mono text-[10px] font-bold text-slate-655 dark:text-slate-300">{doc.fileId}</span>
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => setSelectedDoc({
                        title: doc.title,
                        type: doc.type,
                        viewUrl: doc.viewUrl,
                        embedUrl: doc.embedUrl
                      })}
                      className="flex-1 py-2 px-3 bg-[#006CE4]/10 hover:bg-[#006CE4] text-[#006CE4] hover:text-white dark:bg-[#006CE4]/15 dark:hover:bg-[#006CE4] dark:text-sky-305 dark:hover:text-white transition duration-200 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View PDF Preview</span>
                    </button>
                    <a
                      href={doc.viewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 bg-slate-200 hover:bg-slate-300 dark:bg-[#1A263F] dark:hover:bg-[#31456D] text-slate-700 dark:text-slate-200 transition duration-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer border border-slate-300/40 dark:border-slate-800"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open in Drive</span>
                    </a>
                    <CopyButton
                      value={doc.viewUrl}
                      label="Copy Link"
                      className="py-2 px-3 text-xs shadow-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reusable Document Viewer Modal */}
      {selectedDoc && (
        <BookingDocumentViewer
          title={selectedDoc.title}
          type={selectedDoc.type}
          viewUrl={selectedDoc.viewUrl}
          embedUrl={selectedDoc.embedUrl}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  );
}
