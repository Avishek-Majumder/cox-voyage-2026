import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  CheckCircle2,
  Heart,
  SlidersHorizontal,
  ArrowUpDown,
  Coffee,
  AlertCircle,
  HelpCircle,
  Clock,
  Bed,
  Check,
  Percent,
  Plus,
  Compass,
  FileText,
  ExternalLink,
  Eye,
  Settings,
  Calendar,
  MapPin,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { Hotel, GroupSize, FilterOptions, SortOption } from '../types';
import { calculateAllTripCosts, formatBDT } from '../data/hotels';
import { hotelBookingDocuments, HotelBookingDocument } from '../data/bookingDocuments';
import BookingDocumentViewer from './BookingDocumentViewer';

interface HotelGridProps {
  hotels: Hotel[];
  groupSize: GroupSize;
  oneWayBusFare: number;
  selectedHotel: Hotel;
  onSelectHotel: (hotel: Hotel) => void;
  compareHotels: Hotel[];
  onToggleCompare: (hotel: Hotel) => void;
  shortlistedIds: string[];
  onToggleShortlist: (id: string) => void;
  onOpenDetails: (hotel: Hotel) => void;
}

export default function HotelGrid({
  hotels,
  groupSize,
  oneWayBusFare,
  selectedHotel,
  onSelectHotel,
  compareHotels,
  onToggleCompare,
  shortlistedIds,
  onToggleShortlist,
  onOpenDetails,
}: HotelGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpts, setFilterOpts] = useState<FilterOptions>({
    breakfastOnly: false,
    roomOnly: false,
    balconyOnly: false,
    seaViewOnly: false,
    premiumOnly: false,
    fourStarOnly: false,
    threeStarOnly: false,
    budgetOnly: false,
    refundableOnly: false,
    coupleFriendlyOnly: false,
  });
  const [sortBy, setSortBy] = useState<SortOption>('cheapest_total');
  const [showShortlistOnly, setShowShortlistOnly] = useState(false);
  const [expandedCardIds, setExpandedCardIds] = useState<string[]>([]);
  const [activeOptionIds, setActiveOptionIds] = useState<Record<string, string>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [devMode, setDevMode] = useState(false);
  const [activeDoc, setActiveDoc] = useState<HotelBookingDocument | null>(null);

  const toggleBreakdown = (id: string) => {
    setExpandedCardIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle quick filter helpers
  const toggleFilter = (key: keyof FilterOptions) => {
    // If setting breakfastOnly to true, set roomOnly to false and vice-versa
    if (key === 'breakfastOnly') {
      setFilterOpts((prev) => ({ ...prev, breakfastOnly: !prev.breakfastOnly, roomOnly: false }));
    } else if (key === 'roomOnly') {
      setFilterOpts((prev) => ({ ...prev, roomOnly: !prev.roomOnly, breakfastOnly: false }));
    } else {
      setFilterOpts((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const resetFilters = () => {
    setFilterOpts({
      breakfastOnly: false,
      roomOnly: false,
      balconyOnly: false,
      seaViewOnly: false,
      premiumOnly: false,
      fourStarOnly: false,
      threeStarOnly: false,
      budgetOnly: false,
      refundableOnly: false,
      coupleFriendlyOnly: false,
    });
    setSearchQuery('');
    setShowShortlistOnly(false);
  };

  // Find cheapest and premium thresholds for badges
  const bPrices = hotels.map((h) => h.basePrice);
  const minBasePrice = Math.min(...bPrices);
  const maxBasePrice = Math.max(...bPrices);

  // Filter and sort computation
  const processedHotels = useMemo(() => {
    let filtered = [...hotels];

    // Search query keyword filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.roomName.toLowerCase().includes(q) ||
          h.notes.toLowerCase().includes(q)
      );
    }

    // Shortlist only filter
    if (showShortlistOnly) {
      filtered = filtered.filter((h) => shortlistedIds.includes(h.id));
    }

    // Option state filters
    if (filterOpts.breakfastOnly) {
      filtered = filtered.filter((h) => h.breakfast === true);
    }
    if (filterOpts.roomOnly) {
      filtered = filtered.filter((h) => h.breakfast === false);
    }
    if (filterOpts.balconyOnly) {
      filtered = filtered.filter(
        (h) =>
          h.category === 'balcony' ||
          h.roomName.toLowerCase().includes('balcony') ||
          h.tags.some((t) => t.toLowerCase().includes('balcony')) ||
          h.details.roomFacilities?.bedroom?.some((bf) => bf.toLowerCase().includes('balcony'))
      );
    }
    if (filterOpts.seaViewOnly) {
      filtered = filtered.filter(
        (h) =>
          h.roomName.toLowerCase().includes('sea') ||
          h.tags.some((t) => t.toLowerCase().includes('sea')) ||
          h.details.tags.some((t) => t.toLowerCase().includes('sea')) ||
          h.notes.toLowerCase().includes('sea')
      );
    }
    if (filterOpts.premiumOnly) {
      filtered = filtered.filter((h) => h.category === 'premium');
    }
    if (filterOpts.fourStarOnly) {
      filtered = filtered.filter((h) => h.starRating.includes('4.0') || h.details.starRating.includes('4.0'));
    }
    if (filterOpts.threeStarOnly) {
      filtered = filtered.filter((h) => h.starRating.includes('3.0') || h.details.starRating.includes('3.0') || h.starRating.includes('3.5'));
    }
    if (filterOpts.budgetOnly) {
      filtered = filtered.filter((h) => h.category === 'budget' || h.id === 'hotel-sea-uttara');
    }
    if (filterOpts.refundableOnly) {
      filtered = filtered.filter((h) => h.refundable === true);
    }
    if (filterOpts.coupleFriendlyOnly) {
      filtered = filtered.filter(
        (h) =>
          h.tags.some((t) => t.toLowerCase().includes('couple')) ||
          h.details?.tags?.some((t) => t.toLowerCase().includes('couple')) ||
          h.details?.hotelFacilities?.general?.some((f) => f.toLowerCase().includes('couple'))
      );
    }

    // Sort options
    filtered.sort((a, b) => {
      const costA = calculateAllTripCosts(a, groupSize, oneWayBusFare);
      const costB = calculateAllTripCosts(b, groupSize, oneWayBusFare);

      if (sortBy === 'cheapest_total') {
        return costA.fullTripTotal - costB.fullTripTotal;
      }
      if (sortBy === 'lowest_per_person') {
        return costA.individualCost - costB.individualCost;
      }
      if (sortBy === 'star_rating_desc') {
        const starVal = (sRating: string) => {
          if (!sRating || sRating.includes('not provided')) return 0;
          const num = parseFloat(sRating);
          return isNaN(num) ? 0 : num;
        };
        return starVal(b.starRating) - starVal(a.starRating);
      }
      if (sortBy === 'premium_first') {
        // Premium category first
        const categoryScore = (cat: string) => {
          if (cat === 'premium') return 3;
          if (cat === 'mid-range') return 2;
          if (cat === 'balcony') return 1;
          return 0;
        };
        return categoryScore(b.category) - categoryScore(a.category);
      }
      if (sortBy === 'breakfast_first') {
        return (b.breakfast ? 1 : 0) - (a.breakfast ? 1 : 0);
      }
      if (sortBy === 'best_review_score') {
        const scoreVal = (sc: any) => {
          if (!sc) return 0;
          return sc.score || 0;
        };
        return scoreVal(b.details?.reviewSummary) - scoreVal(a.details?.reviewSummary);
      }
      return 0;
    });

    return filtered;
  }, [hotels, groupSize, oneWayBusFare, searchQuery, filterOpts, sortBy, shortlistedIds, showShortlistOnly]);

  // Group filtered hotels by hotelGroupId
  const groupedHotels = useMemo(() => {
    const groups: { id: string; name: string; options: Hotel[] }[] = [];
    processedHotels.forEach((hotel) => {
      let group = groups.find((g) => g.id === hotel.hotelGroupId);
      if (!group) {
        group = {
          id: hotel.hotelGroupId,
          name: hotel.name,
          options: [],
        };
        groups.push(group);
      }
      group.options.push(hotel);
    });
    return groups;
  }, [processedHotels]);

  if (!devMode) {
    const hotel = hotels.find((h) => h.id === 'grand-pacific-premier') || hotels[0];
    if (!hotel) return null;

    const costs = calculateAllTripCosts(hotel, groupSize, oneWayBusFare);

    return (
      <div className="space-y-6" id="booked-hotel-container">
        {/* Info notice stating hotel is booked and comparison is locked */}
        <div className="bg-[#006CE4]/5 dark:bg-[#1A263F]/25 rounded-3xl p-5 border border-[#006CE4]/10 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-[#006CE4] dark:text-sky-400 text-xs uppercase tracking-wider block">
                Booking Status Confirmed
              </span>
              <p className="text-xs text-gray-600 dark:text-slate-350 mt-1 leading-normal font-sans">
                Hotel comparison, directory lists, and search filters are locked because your stay at <span className="font-bold text-gray-800 dark:text-white">Hotel Grand Pacific</span> has been successfully booked.
              </p>
            </div>
          </div>
          {/* Subtle Dev Toggle button */}
          <button
            onClick={() => setDevMode(true)}
            className="cursor-pointer text-[10px] py-1 px-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors uppercase font-bold flex items-center gap-1 shrink-0 self-end sm:self-center border border-dashed border-slate-300 dark:border-slate-700 rounded-md bg-transparent"
            title="Developer Mode"
          >
            <Settings className="w-3 h-3 animate-spin [animation-duration:8s]" />
            <span>Developer View</span>
          </button>
        </div>

        {/* Premium Booked Hotel Single Card */}
        <div className="bg-white dark:bg-[#0F1A30] rounded-3xl overflow-hidden border border-gray-150 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 md:grid-cols-12">
          {/* Left: Image Frame */}
          <div className="relative md:col-span-5 h-64 md:h-auto min-h-[250px] bg-slate-100 dark:bg-slate-900">
            <img
              referrerPolicy="no-referrer"
              src={hotel.imageUrl}
              alt={hotel.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                setImageErrors((prev) => ({ ...prev, [hotel.imageUrl]: true }));
              }}
            />
            
            {/* Status badges floating over image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-emerald-500 text-white font-extrabold text-[9px] px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-md flex items-center gap-1.5 self-start leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                ✓ Hotel Booked
              </span>
            </div>
          </div>

          {/* Right: Booking detail content & metadata elements */}
          <div className="p-6 md:p-8 md:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Hotel & Room Title headings */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-[#006CE4] dark:text-sky-400 tracking-wider uppercase flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#006CE4]" /> Cox's Bazar Road, Kolatoli
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white tracking-tight leading-snug">
                  {hotel.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-sky-500" />
                  Room: <strong className="text-gray-700 dark:text-white font-bold">{hotel.roomName}</strong>
                </p>
              </div>

              {/* Dynamic Document Indicators */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border border-sky-100/30 dark:border-sky-955/20 font-bold text-[10px] px-2.5 py-1 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>Invoice Available</span>
                </span>
                <span className="bg-purple-50 dark:bg-purple-955/35 text-purple-700 dark:text-purple-450 border border-purple-100/30 dark:border-purple-955/20 font-bold text-[10px] px-2.5 py-1 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span>Voucher Available</span>
                </span>
              </div>

              {/* Schedule and stay constraints layout */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/85">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> Check-In
                  </span>
                  <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-white font-mono">
                    Friday, 19 Jun 2026
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">From 12:00 PM</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> Check-Out
                  </span>
                  <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-white font-mono">
                    Sunday, 21 Jun 2026
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Before 11:00 AM</p>
                </div>
              </div>

              {/* Booking configuration metadata */}
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-850">
                <div className="bg-slate-50 dark:bg-[#1A263F]/40 border border-slate-100 dark:border-slate-800/80 p-3 rounded-2xl flex flex-col justify-center">
                  <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-wider">Rooms Allocated</span>
                  <span className="text-base font-black font-mono text-gray-800 dark:text-white mt-0.5">2 Rooms Needed</span>
                  <span className="text-[9px] text-gray-400 block mt-0.5">Dual Occupancy Deluxe rule</span>
                </div>

                <div className="bg-slate-50 dark:bg-[#1A263F]/40 border border-slate-100 dark:border-slate-800/80 p-3 rounded-2xl flex flex-col justify-center">
                  <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-wider">Group Composition</span>
                  <span className="text-base font-black font-mono text-gray-800 dark:text-white mt-0.5">4 Members</span>
                  <span className="text-[9px] text-gray-400 block mt-0.5">Confirmed traveler limit</span>
                </div>
              </div>

              {/* Pricing breakdown block */}
              <div className="bg-[#46e49e]/5 dark:bg-[#1A263F]/30 border border-[#006CE4]/10 dark:border-slate-800 rounded-2xl p-4 mt-5 space-y-2">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Room Rate per Night (2 Rooms):</span>
                  <span className="font-extrabold font-mono text-slate-800 dark:text-slate-200">{formatBDT(hotel.basePrice * 2)}</span>
                </div>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Stay Duration:</span>
                  <span className="font-extrabold font-mono text-slate-800 dark:text-slate-200">2 Nights</span>
                </div>
                <div className="flex justify-between items-baseline text-xs/tight pt-2 border-t border-dashed border-emerald-250 dark:border-slate-800">
                  <span className="text-slate-650 dark:text-slate-350 font-medium">Hotel Accommodation Total:</span>
                  <span className="font-extrabold font-mono text-emerald-600 dark:text-emerald-400 text-sm">{formatBDT(costs.hotelTotal)}</span>
                </div>
              </div>
            </div>

            {/* Action buttons triggers */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/85">
              <button
                type="button"
                onClick={() => onOpenDetails(hotel)}
                className="flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-black bg-[#006CE4] hover:bg-[#0051BE] text-white flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm cursor-pointer border border-[#003B95]"
              >
                <Eye className="w-4 h-4" />
                <span>View Room Details</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const invoice = hotelBookingDocuments.find((d) => d.type === 'invoice');
                  if (invoice) {
                    setActiveDoc(invoice);
                  }
                }}
                className="flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold bg-sky-55 dark:bg-[#1A263F]/70 hover:bg-sky-100 dark:hover:bg-[#1A263F] text-[#006CE4] dark:text-sky-305 border border-sky-200 dark:border-slate-800 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-sky-500" />
                <span>View Hotel Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const voucher = hotelBookingDocuments.find((d) => d.type === 'voucher');
                  if (voucher) {
                    setActiveDoc(voucher);
                  }
                }}
                className="flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold bg-purple-55 dark:bg-[#1A263F]/70 hover:bg-purple-100 dark:hover:bg-[#1A263F] text-[#8E44AD] dark:text-purple-300 border border-purple-200 dark:border-slate-800 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-purple-400" />
                <span>View Hotel Voucher</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reusable Local Document Viewer Modal */}
        {activeDoc && (
          <BookingDocumentViewer
            title={activeDoc.title}
            type={activeDoc.type}
            viewUrl={activeDoc.viewUrl}
            embedUrl={activeDoc.embedUrl}
            onClose={() => setActiveDoc(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6" id="hotel-directory">
      {/* Dev Mode Banner indicating developers can switch back */}
      {devMode && (
        <div className="bg-red-500/10 dark:bg-red-500/15 border border-red-500/20 p-4 rounded-3xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-xs font-bold text-red-650 dark:text-red-400">
              🛠️ Developer Mode Active (All Stays & Filters Unlocked for future expansion)
            </span>
          </div>
          <button
            onClick={() => setDevMode(false)}
            className="cursor-pointer bg-red-650 hover:bg-red-750 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg uppercase tracking-wider transition"
          >
            Switch to Booked View
          </button>
        </div>
      )}
      {/* Search and Filters Disclaimer */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-150 text-xs text-amber-850 flex items-start gap-2.5 shadow-xxs">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold block">⚠️ Booking Rate Note</span>
          <p className="mt-0.5 font-medium leading-relaxed opacity-95">
            Hotel prices are based on screenshots and may change during actual booking. Recheck price, availability, and cancellation policy before payment.
          </p>
        </div>
      </div>

      {/* Search and Filters Hub */}
      <div className="bg-white dark:bg-[#0F1A30] rounded-3xl p-6 shadow-xs border border-gray-100 dark:border-slate-800 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-5">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by hotel name or keyword (e.g. Balcony)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A263F] border border-gray-200.5 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-gray-850 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-sky-400 focus:bg-white dark:focus:bg-[#1A263F] transition-all"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto justify-end">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#1A263F] border border-gray-150 dark:border-slate-705 px-3 py-2 rounded-2xl text-xs text-gray-600 dark:text-slate-300 transition-colors">
              <ArrowUpDown className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span className="font-semibold select-none">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent font-bold text-gray-800 dark:text-white focus:outline-hidden cursor-pointer"
              >
                <option value="cheapest_total" className="bg-white dark:bg-[#141E33]">Cheapest Total</option>
                <option value="lowest_per_person" className="bg-white dark:bg-[#141E33]">Lowest Per-Person Cost</option>
                <option value="star_rating_desc" className="bg-white dark:bg-[#141E33]">Star Rating (High to Low)</option>
                <option value="premium_first" className="bg-white dark:bg-[#141E33]">Premium First</option>
                <option value="breakfast_first" className="bg-white dark:bg-[#141E33]">Breakfast Included First</option>
                <option value="best_review_score" className="bg-white dark:bg-[#141E33]">Best Review Score</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Badges Grid */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-2 flex items-center gap-1 select-none">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" /> Filter Hotels:
          </span>

          <button
            onClick={() => setShowShortlistOnly(!showShortlistOnly)}
            className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-bold border transition duration-200 ${
              showShortlistOnly
                ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900 shadow-xxs'
                : 'bg-white dark:bg-[#1A263F] border-gray-200 dark:border-slate-705 text-gray-650 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-[#25365C]'
            }`}
          >
            ❤️ Favorites ({shortlistedIds.length})
          </button>

          <button
            onClick={() => toggleFilter('breakfastOnly')}
            className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-bold border transition duration-200 ${
              filterOpts.breakfastOnly
                ? 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-905'
                : 'bg-white dark:bg-[#1A263F] border-gray-200 dark:border-slate-705 text-gray-650 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-[#25365C]'
            }`}
          >
            🍳 Breakfast Included
          </button>

          <button
            onClick={() => toggleFilter('balconyOnly')}
            className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-bold border transition duration-200 ${
              filterOpts.balconyOnly
                ? 'bg-purple-50 dark:bg-purple-950/35 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900 shadow-xxs'
                : 'bg-white dark:bg-[#1A263F] border-gray-200 dark:border-slate-705 text-gray-650 dark:text-slate-350 hover:bg-gray-50 dark:hover:bg-[#25365C]'
            }`}
          >
            🌅 Balcony
          </button>

          <button
            onClick={() => toggleFilter('seaViewOnly')}
            className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-bold border transition duration-200 ${
              filterOpts.seaViewOnly
                ? 'bg-blue-50 dark:bg-blue-950/35 text-blue-700 dark:text-blue-400 border-blue-250 dark:border-blue-900 shadow-xxs'
                : 'bg-white dark:bg-[#1A263F] border-gray-200 dark:border-slate-705 text-gray-650 dark:text-slate-350 hover:bg-gray-50 dark:hover:bg-[#25365C]'
            }`}
          >
            🌊 Sea View
          </button>

          <button
            onClick={() => toggleFilter('fourStarOnly')}
            className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-bold border transition duration-200 ${
              filterOpts.fourStarOnly
                ? 'bg-amber-100 dark:bg-amber-955/30 text-amber-805 dark:text-amber-400 border-[#d97706] dark:border-amber-900 shadow-xxs'
                : 'bg-white dark:bg-[#1A263F] border-gray-200 dark:border-slate-705 text-gray-650 dark:text-slate-350 hover:bg-gray-50 dark:hover:bg-[#25365C]'
            }`}
          >
            ⭐ 4 Star
          </button>

          <button
            onClick={() => toggleFilter('threeStarOnly')}
            className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-bold border transition duration-200 ${
              filterOpts.threeStarOnly
                ? 'bg-orange-50 dark:bg-orange-955/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900 shadow-xxs'
                : 'bg-white dark:bg-[#1A263F] border-gray-200 dark:border-slate-705 text-gray-650 dark:text-slate-350 hover:bg-gray-50 dark:hover:bg-[#25365C]'
            }`}
          >
            ⭐ 3 Star
          </button>

          <button
            onClick={() => toggleFilter('coupleFriendlyOnly')}
            className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-bold border transition duration-200 ${
              filterOpts.coupleFriendlyOnly
                ? 'bg-pink-50 dark:bg-pink-955/30 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-900 shadow-xxs'
                : 'bg-white dark:bg-[#1A263F] border-gray-200 dark:border-slate-705 text-gray-650 dark:text-slate-350 hover:bg-gray-50 dark:hover:bg-[#25365C]'
            }`}
          >
            💑 Couple Friendly
          </button>

          <button
            onClick={() => toggleFilter('refundableOnly')}
            className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-bold border transition duration-200 ${
              filterOpts.refundableOnly
                ? 'bg-teal-50 dark:bg-teal-955/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-900 shadow-xxs'
                : 'bg-white dark:bg-[#1A263F] border-gray-200 dark:border-slate-705 text-gray-650 dark:text-slate-350 hover:bg-gray-50 dark:hover:bg-[#25365C]'
            }`}
          >
            💚 Refundable Only
          </button>

          {(searchQuery || showShortlistOnly || Object.values(filterOpts).some(Boolean)) && (
            <button
              onClick={resetFilters}
              className="cursor-pointer text-xs font-bold text-red-500 hover:text-red-700 dark:text-red-400 ml-auto px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Hotel Cards Grid */}
      {processedHotels.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800">No hotels match your filters</h3>
          <p className="text-gray-500 text-sm mt-1.5">
            Try resetting some filters or change your query keywords to find what you need.
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-xs transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {groupedHotels.map((group) => {
              // Determine active option for this group
              const getActiveOption = () => {
                const globallySelected = group.options.find((o) => o.id === selectedHotel.id);
                if (globallySelected) return globallySelected;

                const userSelectedId = activeOptionIds[group.id];
                if (userSelectedId) {
                  const match = group.options.find((o) => o.id === userSelectedId);
                  if (match) return match;
                }

                return group.options[0];
              };

              const activeOption = getActiveOption();
              const costs = calculateAllTripCosts(activeOption, groupSize, oneWayBusFare);
              const isSelected = selectedHotel.id === activeOption.id;
              const isShortlisted = shortlistedIds.includes(activeOption.id);
              const isCompared = compareHotels.some((h) => h.id === activeOption.id);

              const isCheapestOption = activeOption.basePrice === minBasePrice;
              const isPremiumOption = activeOption.basePrice === maxBasePrice;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={group.id}
                  onClick={() => onOpenDetails(activeOption)}
                  className={`flex flex-col bg-white dark:bg-[#0F1A30] rounded-3xl overflow-hidden border transition-all duration-300 relative group h-full cursor-pointer hover:shadow-md ${
                    isSelected
                      ? 'border-[#006CE4] dark:border-[#006CE4] shadow-md ring-2 ring-[#006CE4]/10 dark:ring-[#006CE4]/20'
                      : 'border-slate-150 dark:border-slate-800 hover:border-[#006CE4]/30 dark:hover:border-[#006CE4]/50 shadow-xxs'
                  }`}
                >
                {/* Images Layer */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  {imageErrors[activeOption.imageUrl] ? (
                    <div className="w-full h-full bg-gradient-to-br from-[#003B95] to-[#006CE4] flex flex-col items-center justify-center p-4 text-center text-white">
                      <Compass className="w-8 h-8 text-white/80 mb-1 select-none animate-pulse" />
                      <span className="font-black text-[11px] tracking-wider uppercase">Cox Voyage 2026</span>
                      <span className="text-[9px] text-white/75 mt-0.5 line-clamp-1">{activeOption.name}</span>
                    </div>
                  ) : (
                    <img
                      referrerPolicy="no-referrer"
                      src={activeOption.imageUrl}
                      alt={
                        activeOption.id === 'ocean-paradise'
                          ? 'Ocean Paradise Hotel & Resort image'
                          : activeOption.id === 'green-nature-resort'
                          ? 'Green Nature Resort and Suites image'
                          : activeOption.id === 'grand-pacific-premier'
                          ? 'Hotel Grand Pacific, Cox’s Bazar image'
                          : activeOption.id === 'windy-terrace-standard'
                          ? 'Windy Terrace Hotel Standard King Deluxe image'
                          : activeOption.id === 'windy-terrace-superior'
                          ? 'Windy Terrace Hotel Superior King Deluxe image'
                          : activeOption.id === 'hotel-sea-crown'
                          ? 'Hotel Sea Crown Super Deluxe with Balcony image'
                          : activeOption.id === 'hotel-sea-uttara'
                          ? 'Hotel Sea Uttara Premier Double King with Balcony image'
                          : activeOption.id === 'white-orchid-sapphire'
                          ? 'White Orchid Sapphire Premier King with Balcony image'
                          : activeOption.id === 'white-orchid-executive-couple-garden-view'
                          ? 'White Orchid Executive Couple Garden View image'
                          : activeOption.id === 'surestay-premium-deluxe'
                          ? 'SureStay by Best Western Cox’s Bazar Premium Deluxe image'
                          : activeOption.id === 'grace-cox-standard-double-queen'
                          ? 'Grace Cox Smart Hotel Standard Double Queen image'
                          : activeOption.id === 'grace-cox-deluxe-double-king'
                          ? 'Grace Cox Smart Hotel Deluxe Double King image'
                          : activeOption.id === 'hotel-sea-paradise-higher-floor'
                          ? 'Hotel Sea Paradise Deluxe Couple Side Sea View Higher Floor image'
                          : activeOption.id === 'hotel-sea-paradise-balcony'
                          ? 'Hotel Sea Paradise Deluxe Couple Side Sea View with Balcony image'
                          : `${activeOption.name} - ${activeOption.roomName}`
                      }
                      onError={() => {
                        setImageErrors((prev) => ({ ...prev, [activeOption.imageUrl]: true }));
                      }}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  )}
                  
                  {/* Floating tags */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[80%]">
                    {isSelected && (
                      <span className="bg-[#003B95] text-white font-extrabold text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Hotel Booked
                      </span>
                    )}

                    {isCheapestOption && (
                      <span className="bg-emerald-500 text-white font-bold text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                        Cheapest Pick 🏷️
                      </span>
                    )}

                    {isPremiumOption && (
                      <span className="bg-amber-500 text-white font-bold text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                        Top Premium 💎
                      </span>
                    )}

                    {activeOption.warningForLargeGroup && groupSize >= 5 && (
                      <span className="bg-red-500 text-white font-bold text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm flex items-center gap-1 animate-pulse">
                        ⚠️ Limited Rooms
                      </span>
                    )}
                  </div>

                  {/* Favorite Shortlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleShortlist(activeOption.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full cursor-pointer transition shadow-sm ${
                      isShortlisted
                        ? 'bg-red-550 text-white'
                        : 'bg-white/95 text-gray-500 hover:text-red-500 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-white' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md text-white rounded-md text-[10px] font-mono px-2 py-0.5 font-bold uppercase">
                    {activeOption.category}
                  </div>
                </div>

                {/* Card Details Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-1 pb-1">
                      <h3 className="font-black text-slate-900 dark:text-white group-hover:text-[#006CE4] dark:group-hover:text-[#006CE4] transition-colors leading-tight text-sm sm:text-base">
                        {activeOption.name}
                      </h3>
                      {activeOption.details?.reviewSummary && (
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="bg-sky-600/10 dark:bg-sky-600/25 text-sky-700 dark:text-sky-400 text-[11px] font-black px-1.5 py-0.5 rounded-md">
                            {activeOption.details.reviewSummary.score.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Star Rating & Reviews Badge */}
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span className="bg-[#003B95]/10 dark:bg-[#003B95]/30 text-[#003B95] dark:text-sky-300 text-[10px] px-1.5 py-0.5 rounded-sm font-extrabold flex items-center gap-0.5">
                        ⭐ {activeOption.starRating}
                      </span>
                      {activeOption.details?.reviewSummary && (
                        <span className="font-bold text-slate-500 dark:text-slate-350 text-[11px]">
                          {activeOption.details.reviewSummary.text} · <span className="text-slate-400 dark:text-slate-500">{activeOption.details.reviewSummary.count} Reviews</span>
                        </span>
                      )}
                    </div>

                    {/* Short Address / Zone Line */}
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1.5 flex items-center gap-1">
                      📍 <span>
                        {activeOption.details?.address ? (
                          activeOption.id === 'hotel-sea-uttara' ? 'New Beach Rd, Kolatoli, Cox’s Bazar' :
                          activeOption.id === 'white-orchid-sapphire' ? 'Kolatoli Road, Hotel–Motel Zone, Cox’s Bazar' :
                          activeOption.id.includes('grace-cox') ? 'Kolatoli, Cox’s Bazar' :
                          activeOption.id.includes('hotel-sea-paradise') ? 'Kolatoli Beach, Cox’s Bazar' :
                          activeOption.details.address.includes('Hotel–Motel Zone') ? 'Hotel–Motel Zone, Cox’s Bazar' :
                          activeOption.details.address.includes('Kolotaoli') ? 'Kolatoli Road, Cox’s Bazar' :
                          activeOption.details.address.includes('Kolatoli Beach') ? 'Kolatoli Beach Area' :
                          'Cox’s Bazar'
                        ) : 'Cox’s Bazar'}
                      </span>
                    </div>

                    {/* Check-In / Check-Out Times */}
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1.5 flex items-center gap-1.5 bg-slate-50/50 dark:bg-[#1A263F]/35 border border-slate-100 dark:border-slate-800/80 px-2 py-0.5 rounded-lg w-max">
                      <span>🕒 In: <strong className="text-slate-700 dark:text-slate-300 font-bold">{activeOption.details?.policies?.checkIn?.split(' ')[0] || '14:00'}</strong></span>
                      <span className="text-slate-300 dark:text-slate-600 font-light">|</span>
                      <span>Out: <strong className="text-slate-700 dark:text-slate-300 font-bold">{activeOption.details?.policies?.checkOut || '11:00'}</strong></span>
                    </div>

                    {/* Room Options Switcher Tabs inside the Card if there are multiple options */}
                    {group.options.length > 1 && (
                      <div className="mt-4 mb-2 bg-slate-50 dark:bg-[#1A263F]/25 border border-slate-150 dark:border-slate-800 p-1.5 rounded-2xl flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider px-1">Select Room Option:</span>
                        <div className="flex flex-wrap gap-1">
                          {group.options.map((option) => {
                            const isOptionActive = activeOption.id === option.id;
                            const optionCosts = calculateAllTripCosts(option, groupSize, oneWayBusFare);
                            const optSelected = selectedHotel.id === option.id;
                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveOptionIds((prev) => ({
                                    ...prev,
                                    [group.id]: option.id,
                                  }));
                                  // Auto-select globally if the group is currently selected
                                  if (isSelected || optSelected) {
                                    onSelectHotel(option);
                                  }
                                }}
                                className={`flex-1 min-w-[110px] text-left px-2.5 py-1.5 rounded-xl border transition-all text-[11px] font-bold ${
                                  isOptionActive
                                    ? 'bg-sky-50 dark:bg-[#006CE4]/10 border-[#006CE4] dark:border-[#006CE4] text-[#006CE4] dark:text-sky-400 shadow-xxs'
                                    : 'bg-white dark:bg-[#1A263F] border-slate-200 dark:border-slate-755 text-slate-655 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#25365C] hover:text-slate-800 dark:hover:text-white'
                                }`}
                              >
                                <span className="block truncate max-w-[115px]">{option.roomName.replace(', Option 3', '')}</span>
                                <span className="text-[9px] font-mono text-emerald-700 block whitespace-nowrap mt-0.5">
                                  {formatBDT(optionCosts.finalPerRoomCost)}/night
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="text-slate-705 dark:text-slate-300 text-xs mt-3 flex items-center gap-1 bg-slate-50 dark:bg-[#1A263F]/30 border border-slate-200/55 dark:border-slate-805 rounded-xl px-2.5 py-1">
                      💡 <span className="font-extrabold text-slate-700 dark:text-slate-200 truncate">Selected: {activeOption.roomName}</span>
                    </div>

                    {/* Features Badges */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {activeOption.breakfast && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-150 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                          🍳 {activeOption.planType}
                        </span>
                      )}
                      {activeOption.refundable && (
                        <span className="bg-sky-50 text-sky-700 text-[9px] px-2 py-0.5 rounded-md font-bold uppercase border border-sky-100">
                          🛡️ Refundable
                        </span>
                      )}

                      {/* Couple Friendly Badge */}
                      {(activeOption.tags.includes('Couple Friendly') || activeOption.id.includes('windy-terrace') || activeOption.id === 'hotel-sea-crown') && (
                        <span className="bg-rose-50 text-rose-700 border border-rose-150 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                          💖 Couple Friendly
                        </span>
                      )}

                      {/* Balcony Badge */}
                      {(activeOption.tags.includes('With Balcony') || activeOption.id === 'hotel-sea-crown') && (
                        <span className="bg-amber-50 text-amber-700 border border-amber-150 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                          🌅 Balcony
                        </span>
                      )}

                      {/* Near Beach Badge */}
                      {(activeOption.tags.includes('Near Beach') || activeOption.id === 'hotel-sea-crown') && (
                        <span className="bg-blue-50 text-blue-700 border border-blue-150 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                          🏖️ Near Beach
                        </span>
                      )}

                      {/* Swimming Pool Badge */}
                      {activeOption.poolAccess && activeOption.poolAccess !== 'not_available' && (
                        <span className={`border text-[9px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          activeOption.poolAccess === 'included'
                            ? 'bg-cyan-50 text-cyan-700 border-cyan-150'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-150'
                        }`} title={activeOption.poolNote}>
                          🏊 Pool: {activeOption.poolAccess === 'included' ? 'Included' : 'Shared'}
                        </span>
                      )}

                      {/* 0.02 km from Kolatoli Beach Badge */}
                      {activeOption.id === 'hotel-sea-crown' && (
                        <span className="bg-teal-50 text-teal-700 border border-teal-150 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase animate-pulse">
                          📍 0.02 km from Kolatoli Beach
                        </span>
                      )}

                      {/* City Centre Badge */}
                      {(activeOption.tags.includes('City Centre') || activeOption.id === 'hotel-sea-uttara') && (
                        <span className="bg-purple-50 text-purple-700 border border-purple-150 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                          🏙️ City Centre
                        </span>
                      )}

                      {/* 0.15 km from Kolatoli Bus Stand Badge */}
                      {(activeOption.tags.includes('0.15 km from Kolatoli Bus Stand') || activeOption.id === 'hotel-sea-uttara') && (
                        <span className="bg-rose-50 text-rose-700 border border-rose-150 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                          🚌 0.15 km from Bus Stand
                        </span>
                      )}

                      {/* Swimming Pool Badge */}
                      {(activeOption.details?.hotelFacilities?.wellness?.includes('Swimming Pool') || 
                        activeOption.id.includes('windy-terrace') || activeOption.id === 'white-orchid-sapphire') && activeOption.id !== 'hotel-sea-crown' && (
                        <span className="bg-cyan-50 text-cyan-750 border border-cyan-150 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                          🏊 Swimming Pool
                        </span>
                      )}

                      {/* Gym Badge */}
                      {(activeOption.details?.hotelFacilities?.wellness?.includes('Gym') || activeOption.id === 'white-orchid-sapphire') && (
                        <span className="bg-rose-50 text-rose-700 border border-rose-150 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                          🏋️ Gym
                        </span>
                      )}

                      {/* City View Badge */}
                      {(activeOption.details?.roomDetails?.view === 'City View' || activeOption.id === 'white-orchid-sapphire') && (
                        <span className="bg-slate-50 text-slate-700 border border-slate-150 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                          🌆 City View
                        </span>
                      )}

                      {/* Availability Warning Badges */}
                      {activeOption.id === 'white-orchid-sapphire' && (
                        <span className="bg-red-50 text-red-700 border border-red-150 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                          ⚠️ Only 6 rooms left
                        </span>
                      )}

                      {activeOption.id === 'hotel-sea-uttara' && (
                        <span className="bg-red-50 text-red-700 border border-red-150 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                          ⚠️ Only 10 rooms left
                        </span>
                      )}

                      {/* Free Airport Shuttle Service Badge */}
                      {(activeOption.details?.hotelFacilities?.transport?.includes('Free Airport Shuttle Service') || 
                        activeOption.id.includes('windy-terrace')) && activeOption.id !== 'hotel-sea-crown' && (
                        <span className="bg-indigo-50 text-indigo-750 border border-indigo-150 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                          📋 Free Airport Shuttle
                        </span>
                      )}

                      <span className="bg-indigo-50 dark:bg-[#1A263F] text-indigo-705 dark:text-sky-300 text-[9px] px-2 py-0.5 rounded-md font-bold uppercase border border-indigo-100 dark:border-slate-800">
                        🛌 {costs.roomCount} Rooms Needed
                      </span>
                    </div>

                    {/* Specific group capacity warnings for White Orchid */}
                    {(activeOption.id === 'white-orchid-executive' || activeOption.id === 'white-orchid-executive-couple-garden-view') && groupSize >= 5 && (
                      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 p-3 rounded-2xl text-[11px] leading-relaxed flex items-start gap-1.5 mt-3.5 font-sans">
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Availability warning: this option showed only 2 rooms left in the screenshot, but this group needs {costs.roomCount} rooms. Recheck before booking.</span>
                      </div>
                    )}

                    {/* Highly scannable high-level pricing totals */}
                    <div className="bg-[#003B95]/5 dark:bg-[#003B95]/15 border border-[#003B95]/10 dark:border-sky-800/30 rounded-2xl p-3.5 mt-4 flex items-center justify-between transition-colors">
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block leading-none">
                          Trip Total Cost
                        </span>
                        <span className="text-sm sm:text-base font-black text-[#003B95] dark:text-sky-305 font-mono block mt-1">
                          {formatBDT(costs.fullTripTotal)}
                        </span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-505 font-mono">
                          ({costs.roomCount} Rooms + Bus)
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-extrabold block leading-none">
                          Per Person
                        </span>
                        <span className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400 font-mono block mt-1">
                          {formatBDT(costs.individualCost)}
                        </span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500">
                          split {groupSize} ways
                        </span>
                      </div>
                    </div>

                    {/* Toggleable Breakdown Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBreakdown(activeOption.id);
                      }}
                      className="w-full text-center mt-3 py-1.5 bg-slate-50 dark:bg-[#1A263F]/40 hover:bg-slate-100 dark:hover:bg-[#25365C] rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-350 hover:text-slate-800 dark:hover:text-white transition flex items-center justify-center gap-1 cursor-pointer border border-slate-200/50 dark:border-slate-800"
                    >
                      <span>{expandedCardIds.includes(activeOption.id) ? 'Hide details ▲' : 'View breakdown ▼'}</span>
                    </button>

                    {/* Expandable detailed math breakdown section */}
                    <AnimatePresence>
                      {expandedCardIds.includes(activeOption.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 bg-slate-50 dark:bg-[#1A263F]/20 border border-slate-200/60 dark:border-slate-800 p-3.5 rounded-2xl text-xs font-mono space-y-2 overflow-hidden text-slate-700 dark:text-slate-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-between items-baseline">
                            <span className="text-gray-500 dark:text-slate-450 text-[10px] uppercase font-bold">Base (Per Room Night):</span>
                            <span className="text-gray-800 dark:text-slate-200 font-bold font-mono">{formatBDT(costs.basePrice)}</span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="text-gray-500 dark:text-slate-450 text-[10px] uppercase font-bold">Taxes & Fees:</span>
                            <span className="text-gray-800 dark:text-slate-200 font-bold font-mono">+{formatBDT(costs.taxesAndFees)}</span>
                          </div>
                          <div className="flex justify-between items-baseline text-[#E2136E]">
                            <span className="text-[10px] uppercase font-bold">bKash 3% Cash Discount:</span>
                            <span className="font-bold font-mono">-{formatBDT(costs.bkashDiscount)}</span>
                          </div>
                          <div className="pt-2 border-t border-dashed border-gray-250 dark:border-slate-800 flex justify-between items-baseline font-bold text-slate-850 dark:text-slate-205">
                            <span className="text-[10px] uppercase font-sans">Final Per-Room Night:</span>
                            <span className="text-sky-600 dark:text-sky-400 font-mono text-sm">{formatBDT(costs.finalPerRoomCost)}</span>
                          </div>
                          <div className="pt-2 border-t border-dashed border-gray-250 dark:border-slate-800 space-y-1 text-[11px] text-gray-550 dark:text-slate-450 font-sans">
                            <div className="flex justify-between">
                              <span>Hotel Total ({costs.roomCount} Rooms):</span>
                              <span className="font-mono font-bold text-gray-850 dark:text-slate-205">{formatBDT(costs.hotelTotal)}</span>
                            </div>
                            <div className="flex justify-between animate-fade-in">
                              <span>Bus Total ({groupSize} seats RT):</span>
                              <span className="font-mono font-bold text-gray-850 dark:text-slate-205">{formatBDT(costs.busTotal)}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Actions Area */}
                  <div className="mt-5 space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800/85">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectHotel(activeOption);
                        }}
                        type="button"
                        className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#003B95] text-white shadow-md border border-[#003B95]'
                            : 'bg-white dark:bg-[#1A263F] hover:bg-sky-50/20 dark:hover:bg-[#006CE4]/10 text-[#003B95] dark:text-sky-400 border border-sky-305 dark:border-slate-705'
                        }`}
                      >
                        {isSelected ? '✓ Selected Stay' : 'Select Stay'}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDetails(activeOption);
                        }}
                        type="button"
                        className="py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#19253F] hover:bg-[#006CE4]/10 dark:hover:bg-[#006CE4]/20 text-[#006CE4] dark:text-sky-400 border border-slate-200 dark:border-slate-705 hover:border-[#006CE4]/30 transition cursor-pointer"
                        title="View Full Room & Hotel Details"
                      >
                        Details
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCompare(activeOption);
                        }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition duration-200 cursor-pointer ${
                          isCompared
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {isCompared ? '✓ Added to Compare' : 'Add to Compare'}
                      </button>
                    </div>
                  </div>
                </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {/* Data Quality Disclaimer note */}
          <div className="col-span-full mt-10 md:mt-12 text-center max-w-2xl mx-auto bg-slate-50 border border-slate-200/60 p-4.5 rounded-2xl text-[11px] text-slate-500 leading-relaxed font-sans shadow-xxs">
            ⚠️ <strong>Data Quality Notice:</strong> Hotel details and prices are based on screenshots and manually collected trip-planning data. Recheck price, availability, room policy, and cancellation terms before final booking.
          </div>
        </div>
      )}
    </div>
  );
}
