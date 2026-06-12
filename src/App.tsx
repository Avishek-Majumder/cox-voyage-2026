import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Bus,
  Hotel as HotelIcon,
  Users,
  Compass,
  DollarSign,
  AlertCircle,
  TrendingDown,
  Info,
  Layers,
  FileSpreadsheet,
  Check,
  CreditCard,
  UserCheck,
  Clock,
  ExternalLink,
  Github,
  Share2,
  FileDown,
  Sun,
  Moon
} from 'lucide-react';
import { Hotel, GroupSize, Member, TripCosts } from './types';
import { HOTELS, calculateAllTripCosts, formatBDT, getRoomsNeeded } from './data/hotels';
import { useCurrency } from './hooks/useCurrency';
import { generateTripPDF } from './utils/pdfGenerator';
import { motion, AnimatePresence } from 'motion/react';

import HeroSection from './components/HeroSection';
import HotelDetailsModal from './components/HotelDetailsModal';
import GroupSelector from './components/GroupSelector';
import HotelGrid from './components/HotelGrid';
import CalculatorPanel from './components/CalculatorPanel';
import TimelineSection from './components/TimelineSection';
import CompareDrawer from './components/CompareDrawer';
import RouteMap from './components/RouteMap';
import PackingChecklist from './components/PackingChecklist';
import TripUpdates from './components/TripUpdates';
import NotificationSettings from './components/NotificationSettings';
import NavigationMenu from './components/NavigationMenu';
import ThemeToggle from './components/ThemeToggle';
import TicketsBookingSection from './components/TicketsBookingSection';
import TodaysAction from './components/TodaysAction';
import TripWallet from './components/TripWallet';
import CostSplit, { MemberSplit } from './components/CostSplit';
import BookingDocumentViewer from './components/BookingDocumentViewer';
import TripGallery from './components/TripGallery';

// Authentication & Core Persistence Enhancements
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import AuthModal from './components/AuthModal';
import ProfileMenu from './components/ProfileMenu';
import WeatherDashboard from './components/WeatherDashboard';
import { saveUserTripPlan, loadUserTripPlan } from './services/userTripService';
import { hotelBookingDocuments } from './data/bookingDocuments';

// Sensible pre-filled names for group sizing
const PRESET_MEMBERS_2: Member[] = [
  { id: '1', name: 'Avishek' },
  { id: '2', name: 'Joana' },
];

const PRESET_MEMBERS_3: Member[] = [
  { id: '1', name: 'Joana' },
  { id: '2', name: 'Avishek' },
  { id: '3', name: 'Kevin' },
];

const PRESET_MEMBERS_4: Member[] = [
  { id: '1', name: 'Joana' },
  { id: '2', name: 'Avishek' },
  { id: '3', name: 'Kevin' },
  { id: '4', name: 'Ishraq' },
];

const PRESET_MEMBERS_5: Member[] = [
  { id: '1', name: 'Joana' },
  { id: '2', name: 'Avishek' },
  { id: '3', name: 'Kevin' },
  { id: '4', name: 'Kevin’s sister' },
  { id: '5', name: 'Kevin’s Dulabhai' },
];

const PRESET_MEMBERS_6: Member[] = [
  { id: '1', name: 'Joana' },
  { id: '2', name: 'Avishek' },
  { id: '3', name: 'Kevin' },
  { id: '4', name: 'Kevin’s sister' },
  { id: '5', name: 'Kevin’s Dulabhai' },
  { id: '6', name: 'Ishraq' },
];

const DEFAULT_CHEAPEST_HOTEL = [...HOTELS].sort((a, b) => a.basePrice - b.basePrice)[0];

export default function App() {
  // Authentication & Session state controllers
  const {
    user,
    loading: authLoading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOutUser,
  } = useAuth();
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isCloudSyncLoading, setIsCloudSyncLoading] = useState(false);

  const [groupSize, setGroupSize] = useState<GroupSize>(4);
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem('squad_trip_members');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 4) {
          return parsed;
        }
      }
    } catch (e) {}
    return PRESET_MEMBERS_4;
  });
  const [oneWayBusFare, setOneWayBusFare] = useState<number>(() => {
    const saved = localStorage.getItem('squad_trip_bus_fare');
    return saved ? parseInt(saved, 10) : 2000;
  });
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(['grand-pacific-premier']);
  const [compareHotels, setCompareHotels] = useState<Hotel[]>([]);
  const [shareState, setShareState] = useState<'idle' | 'sharing' | 'copied'>('idle');
  const { currency, setCurrency } = useCurrency();
  const [ticketAssignments, setTicketAssignments] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('squad_trip_ticket_assignments');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [activeQrMemberId, setActiveQrMemberId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [memberSplits, setMemberSplits] = useState<MemberSplit[]>(() => {
    try {
      const saved = localStorage.getItem('squad_trip_member_splits');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('squad_trip_member_splits', JSON.stringify(memberSplits));
  }, [memberSplits]);
  const [detailHotel, setDetailHotel] = useState<Hotel | null>(null);
  const [activeWalletDoc, setActiveWalletDoc] = useState<{ title: string; type: string; viewUrl: string; embedUrl: string } | null>(null);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);

  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Method to restore state from Cloud Synced link or Recent Search badge clicked
  const handleRestoreState = (hotelId: string, groupSizeVal: GroupSize, busFareVal: number) => {
    setGroupSize(4);
    setOneWayBusFare(busFareVal);
    const foundHotel = HOTELS.find(h => h.id === 'grand-pacific-premier');
    if (foundHotel) {
      setSelectedHotel(foundHotel);
    }
  };

  // Find the cheapest hotel dynamically on mount to set it as default selected.
  const cheapestHotel = useMemo(() => {
    return DEFAULT_CHEAPEST_HOTEL;
  }, []);

  const [selectedHotel, setSelectedHotel] = useState<Hotel>(() => {
    const savedId = localStorage.getItem('squad_trip_selected_hotel_id');
    if (savedId) {
      const found = HOTELS.find(h => h.id === savedId);
      if (found) return found;
    }
    return DEFAULT_CHEAPEST_HOTEL;
  });

  const [bookingDocumentsMetadata, setBookingDocumentsMetadata] = useState(() => {
    try {
      const saved = localStorage.getItem('squad_trip_booking_documents');
      return saved ? JSON.parse(saved) : hotelBookingDocuments;
    } catch (e) {
      return hotelBookingDocuments;
    }
  });

  useEffect(() => {
    localStorage.setItem('squad_trip_booking_documents', JSON.stringify(bookingDocumentsMetadata));
  }, [bookingDocumentsMetadata]);

  useEffect(() => {
    localStorage.setItem('squad_trip_members', JSON.stringify(members));
  }, [members]);

  // Sync state modifications with localStorage
  useEffect(() => {
    localStorage.setItem('squad_trip_group_size', groupSize.toString());
  }, [groupSize]);

  useEffect(() => {
    localStorage.setItem('squad_trip_bus_fare', oneWayBusFare.toString());
  }, [oneWayBusFare]);

  useEffect(() => {
    localStorage.setItem('squad_trip_selected_hotel_id', selectedHotel.id);
  }, [selectedHotel]);

  useEffect(() => {
    localStorage.setItem('cox-voyage-currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('squad_trip_ticket_assignments', JSON.stringify(ticketAssignments));
  }, [ticketAssignments]);

  // Load user data from Firestore on login
  useEffect(() => {
    async function loadPlanOnLogin() {
      if (user && user.uid) {
        setIsCloudSyncLoading(true);
        try {
          const savedTrip = await loadUserTripPlan(user.uid);
          if (savedTrip) {
            // Always lock to 4 members
            setGroupSize(4);
            if (savedTrip.members && savedTrip.members.length === 4) {
              setMembers(savedTrip.members);
            } else {
              setMembers(PRESET_MEMBERS_4);
            }
            if (savedTrip.oneWayBusFare) setOneWayBusFare(savedTrip.oneWayBusFare);
            if (savedTrip.currency) setCurrency(savedTrip.currency);
            
            // Clean shortlisted / comparison clutter
            setShortlistedIds(['grand-pacific-premier']);
            setCompareHotels([]);
            
            if (savedTrip.ticketAssignments) setTicketAssignments(savedTrip.ticketAssignments);
            if (savedTrip.memberSplits) setMemberSplits(savedTrip.memberSplits);
            
            // Force selectedHotelId to grand-pacific-premier
            const matched = HOTELS.find(h => h.id === 'grand-pacific-premier');
            if (matched) {
              setSelectedHotel(matched);
            } else {
              setSelectedHotel(DEFAULT_CHEAPEST_HOTEL);
            }
            
            if (savedTrip.bookingDocumentsMetadata) {
              setBookingDocumentsMetadata(savedTrip.bookingDocumentsMetadata);
            }
          }
        } catch (err) {
          console.error("Error restoring user trip from database: ", err);
        } finally {
          setIsCloudSyncLoading(false);
        }
      }
    }
    loadPlanOnLogin();
  }, [user]);

  // Save/auto-sync user data to Firestore on state changes
  useEffect(() => {
    if (user && user.uid && !isCloudSyncLoading) {
      const timeoutId = setTimeout(() => {
        saveUserTripPlan(user.uid!, {
          groupSize,
          members,
          selectedHotelId: selectedHotel.id,
          shortlistedIds,
          compareHotelIds: compareHotels.map(h => h.id),
          oneWayBusFare,
          currency,
          ticketAssignments,
          memberSplits,
          bookingDocumentsMetadata,
          lastUpdated: new Date().toISOString()
        }).catch(err => console.error("Error auto-saving plan to database: ", err));
      }, 800); // Small debounce for fast consecutive keystrokes/actions
      
      return () => clearTimeout(timeoutId);
    }
  }, [user, groupSize, members, selectedHotel, shortlistedIds, compareHotels, oneWayBusFare, currency, ticketAssignments, memberSplits, bookingDocumentsMetadata, isCloudSyncLoading]);




  // Sync members whenever groupSize toggles
  useEffect(() => {
    if (groupSize === 2) {
      setMembers(PRESET_MEMBERS_2);
    } else if (groupSize === 3) {
      setMembers(PRESET_MEMBERS_3);
    } else if (groupSize === 4) {
      setMembers(PRESET_MEMBERS_4);
    } else if (groupSize === 5) {
      setMembers(PRESET_MEMBERS_5);
    } else if (groupSize === 6) {
      setMembers(PRESET_MEMBERS_6);
    }
  }, [groupSize]);

  // Handle shortlist toggles
  const handleToggleShortlist = (id: string) => {
    setShortlistedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Compare hotels handlings
  const handleToggleCompare = (hotel: Hotel) => {
    setCompareHotels((prev) => {
      const isAlreadyIn = prev.some((h) => h.id === hotel.id);
      if (isAlreadyIn) {
        return prev.filter((h) => h.id !== hotel.id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare a maximum of 3 hotels simultaneously!');
          return prev;
        }
        return [...prev, hotel];
      }
    });
  };

  const handleRemoveFromCompare = (hotel: Hotel) => {
    setCompareHotels((prev) => prev.filter((h) => h.id !== hotel.id));
  };

  const handleClearCompare = () => {
    setCompareHotels([]);
  };

  // Calculations for current selected hotel
  const currentCosts = useMemo(() => {
    return calculateAllTripCosts(selectedHotel, groupSize, oneWayBusFare);
  }, [selectedHotel, groupSize, oneWayBusFare]);

  // Calculations for cheapest hotel to display inside Executive Summary Card
  const cheapestTripCosts = useMemo(() => {
    return calculateAllTripCosts(cheapestHotel, groupSize, oneWayBusFare);
  }, [cheapestHotel, groupSize, oneWayBusFare]);

  const roomsNeeded = getRoomsNeeded(groupSize);

  const copyToClipboardFallback = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShareState('copied');
      setTimeout(() => setShareState('idle'), 3000);
    } catch (err) {
      console.error('Failed to copy', err);
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setShareState('copied');
        setTimeout(() => setShareState('idle'), 3000);
      } catch (e) {
        setShareState('idle');
        alert('Could not copy automatically. Please select text manually.');
      }
      document.body.removeChild(textarea);
    }
  };

  const handleShareTrip = async () => {
    const formattedHotelCost = formatBDT(currentCosts.hotelTotal);
    const formattedBusCost = formatBDT(currentCosts.busTotal);
    const formattedIndividualCost = formatBDT(currentCosts.individualCost);
    const formattedTripTotal = formatBDT(currentCosts.fullTripTotal);

    const arrivalStr = currency === 'USD' ? 'Arrival cost: $71.31' : 'Arrival cost: BDT 8,700';
    const departureStr = currency === 'USD' ? 'Expected departure cost: $71.31' : 'Expected departure cost: BDT 8,700';
    const roundTripBusStr = currency === 'USD' ? 'Expected round trip bus cost: $142.62' : 'Expected round trip bus cost: BDT 17,400';

    const shareText = `🌴 Cox's Bazar Voyage Itinerary 2026 Plan Draft 🌴\n\n` +
      `🏨 SELECTED HOTEL: ${selectedHotel.name}\n` +
      `🛌 ROOM TYPE: ${selectedHotel.roomName}\n` +
      `🍳 COMPLIMENTARY BREAKFAST: ${selectedHotel.breakfast ? 'Included 🍳' : 'Room Only 🛏️'}\n` +
      `🔑 REFUNDABILITY: ${selectedHotel.refundable ? 'Refundable Stay ✅' : 'Non-refundable booking 🔒'}\n` +
      `👥 SQUAD SIZE: ${groupSize} Members (${roomsNeeded} Double Rooms)\n\n` +
      `💰 GROUP SPLITS Fares:\n` +
      `• Total Hotel Fare: ${formattedHotelCost}\n` +
      `• Total Round-Trip Bus: ${formattedBusCost} (Shohagh Poribohon Overnight Bus Splits)\n` +
      `  - ${arrivalStr}\n` +
      `  - ${departureStr}\n` +
      `  - ${roundTripBusStr}\n` +
      `• Grand Full Trip Budget: ${formattedTripTotal}\n\n` +
      `💸 INDIVIDUAL BILL: ${formattedIndividualCost} per person\n\n` +
      `📂 HOTEL DOCUMENTS:\n` +
      `• Hotel booking documents added: Invoice and Voucher available in the app.\n\n` +
      `📍 Managed & updated via Cox Voyage 2026 planner. Join the chat group!`;

    if (navigator.share) {
      setShareState('sharing');
      try {
        await navigator.share({
          title: `Dhaka to Cox's Bazar Voyage Itinerary 2026`,
          text: shareText,
          url: window.location.href,
        });
        setShareState('idle');
      } catch (err) {
        await copyToClipboardFallback(shareText);
      }
    } else {
      await copyToClipboardFallback(shareText);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] dark:bg-[#060D1E] text-slate-800 dark:text-slate-100 pb-28 font-sans antialiased selection:bg-[#006CE4] selection:text-white transition-colors duration-300">
      {/* Upper Brand Line */}
      <div className="bg-[#003B95] text-white text-[10px] sm:text-xs py-2.5 px-4 font-bold shadow-sm text-center tracking-wide flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>🇧🇩 Destination: Dhaka to Cox's Bazar Voyage 2026 • Optimized in High Density Mode • Check Avishek's Magic</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        
        {/* Section Index Ribbon / FAB */}
        <NavigationMenu />

        {/* Top Navigation Bar / Header */}
        <div className="bg-white dark:bg-[#0F1A30] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs mb-6 p-4 sm:p-5 transition-colors duration-300">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 sm:p-2.5 bg-[#006CE4] text-white rounded-xl shadow-xs shrink-0">
                <Compass className="w-4 sm:w-5 h-4 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex flex-wrap items-center gap-1.5 leading-none">
                  <span className="truncate">Cox Voyage 2026</span>
                  <span className="hidden sm:inline-block bg-[#003B95]/10 dark:bg-[#003B95]/30 text-[#003B95] dark:text-sky-300 text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-md font-bold shrink-0">
                    Companion v2.6
                  </span>
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">Squad splits, hotel matches & scheduling</p>
              </div>
            </div>

            {/* Actions Block */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Desktop-only Currency, PDF & Share Actions */}
              <div className="hidden md:flex items-center gap-2">
                {/* Currency Switcher */}
                <div className="flex items-center bg-slate-100 dark:bg-[#1A263F] p-0.5 rounded-xl border border-slate-200 dark:border-slate-750">
                  <button
                    type="button"
                    onClick={() => setCurrency('BDT')}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      currency === 'BDT'
                        ? 'bg-[#003B95] text-white'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-805 dark:hover:text-slate-200'
                    }`}
                    title="Show in BDT"
                  >
                    BDT ৳
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('USD')}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      currency === 'USD'
                        ? 'bg-[#003B95] text-white'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-805 dark:hover:text-slate-200'
                    }`}
                    title="Show in USD"
                  >
                    USD $
                  </button>
                </div>

                {/* Export PDF */}
                <button
                  type="button"
                  onClick={() => generateTripPDF(selectedHotel, groupSize, members, oneWayBusFare, currentCosts, currency, formatBDT)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1A263F] hover:bg-slate-50 dark:hover:bg-[#25365C] text-slate-700 dark:text-slate-205 font-bold text-xs cursor-pointer active:scale-95 transition"
                  title="Export PDF Summary"
                >
                  <FileDown className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>PDF Invoice</span>
                </button>

                {/* Share Itinerary */}
                <button
                  onClick={handleShareTrip}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#006CE4] hover:bg-[#0052BE] text-white rounded-xl font-bold text-xs cursor-pointer active:scale-95 transition"
                >
                  {shareState === 'copied' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Share Plan</span>
                    </>
                  )}
                </button>
              </div>

              {/* Theme Toggle is essential on all screen sizes */}
              <ThemeToggle />

              {/* Profile or Login on all screen sizes */}
              <div>
                {authLoading ? (
                  <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 animate-pulse bg-slate-50 dark:bg-[#1A263F] flex items-center justify-center">
                    <span className="text-[10px] text-slate-400">...</span>
                  </div>
                ) : user ? (
                  <ProfileMenu user={user} signOutUser={signOutUser} />
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-black text-white bg-[#006CE4] hover:bg-[#0051BE] rounded-xl transition cursor-pointer shadow-xxs shrink-0"
                    id="login-navbar-btn"
                  >
                    Login
                  </button>
                )}
              </div>

              {/* Mobile-only Menu toggle for auxiliary operations */}
              <button
                onClick={() => setMobileActionsOpen(!mobileActionsOpen)}
                className="md:hidden flex items-center justify-center p-2 rounded-xl bg-slate-100 dark:bg-[#1A263F] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer active:scale-95 transition shrink-0"
                aria-label="Toggle actions menu"
              >
                <div className="flex flex-col gap-1 items-center justify-center w-4 h-4">
                  <div className={`w-3.5 h-0.5 bg-current transition-all ${mobileActionsOpen ? 'rotate-45 translate-y-1' : ''}`} />
                  <div className={`w-3.5 h-0.5 bg-current transition-all ${mobileActionsOpen ? 'opacity-0' : ''}`} />
                  <div className={`w-3.5 h-0.5 bg-current transition-all ${mobileActionsOpen ? '-rotate-45 -translate-y-1' : ''}`} />
                </div>
              </button>
            </div>
          </div>

          {/* Collapsible Mobile Actions Panel */}
          <AnimatePresence>
            {mobileActionsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden mt-3 pt-3 border-t border-slate-150 dark:border-slate-850 space-y-3"
              >
                <div className="flex items-center justify-between bg-slate-50 dark:bg-[#1A263F]/40 p-2.5 rounded-xl border border-slate-150 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-sans">Currency</span>
                  <div className="flex items-center bg-slate-100 dark:bg-[#0F1A30] p-0.5 rounded-lg border border-slate-200 dark:border-slate-705">
                    <button
                      type="button"
                      onClick={() => setCurrency('BDT')}
                      className={`px-2.5 py-1 rounded text-[10px] font-black cursor-pointer ${
                        currency === 'BDT' ? 'bg-[#003B95] text-white shadow-xxs' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      BDT ৳
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency('USD')}
                      className={`px-2.5 py-1 rounded text-[10px] font-black cursor-pointer ${
                        currency === 'USD' ? 'bg-[#003B95] text-white shadow-xxs' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      USD $
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      generateTripPDF(selectedHotel, groupSize, members, oneWayBusFare, currentCosts, currency, formatBDT);
                      setMobileActionsOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-105 dark:bg-[#1A263F]/50 text-slate-700 dark:text-slate-250 font-bold text-xs cursor-pointer active:scale-95 transition"
                  >
                    <FileDown className="w-3.5 h-3.5 text-rose-500" />
                    <span>PDF Invoice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleShareTrip();
                      setMobileActionsOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#006CE4] text-white font-bold text-xs cursor-pointer active:scale-95 transition"
                  >
                    {shareState === 'copied' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share Plan</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section 1: Hero Block */}
        <HeroSection />

        {/* Section 2: Today's Action */}
        <div id="todays-action" className="scroll-mt-16 mb-8">
          <TodaysAction />
        </div>

        {/* Section 3: Tickets & Booking Section */}
        <div id="tickets-booking" className="scroll-mt-16 mb-8">
          <TicketsBookingSection
            groupSize={groupSize}
            members={members}
            formatBDT={formatBDT}
            ticketAssignments={ticketAssignments}
            onUpdateAssignment={(ticketId, memberName) => {
              setTicketAssignments(prev => ({
                ...prev,
                [ticketId]: memberName
              }));
            }}
          />
        </div>

        {/* Section 4: Booked Hotel */}
        <div id="booked-hotel" className="scroll-mt-16 mb-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                Booked Hotel
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Accommodations are confirmed at Hotel Grand Pacific, Kolatoli, Cox's Bazar.
              </p>
            </div>
            <span className="bg-emerald-500 text-white text-[11.5px] font-black px-3.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              ACTIVE RESERVATION
            </span>
          </div>

          <HotelGrid
            hotels={HOTELS}
            groupSize={groupSize}
            oneWayBusFare={oneWayBusFare}
            selectedHotel={selectedHotel}
            onSelectHotel={setSelectedHotel}
            compareHotels={compareHotels}
            onToggleCompare={handleToggleCompare}
            shortlistedIds={shortlistedIds}
            onToggleShortlist={handleToggleShortlist}
            onOpenDetails={setDetailHotel}
          />
        </div>

        {/* Section 5: Trip Wallet */}
        <div id="trip-wallet" className="scroll-mt-16 mb-8">
          <TripWallet
            onViewDoc={(title, type, viewUrl, embedUrl) => {
              setActiveWalletDoc({ title, type, viewUrl, embedUrl });
            }}
            members={members}
          />
          {activeWalletDoc && (
            <BookingDocumentViewer
              title={activeWalletDoc.title}
              type={activeWalletDoc.type}
              viewUrl={activeWalletDoc.viewUrl}
              embedUrl={activeWalletDoc.embedUrl}
              onClose={() => setActiveWalletDoc(null)}
            />
          )}
        </div>

        {/* Section 6: Trip Gallery */}
        <div id="trip-gallery" className="scroll-mt-16 mb-8">
          <TripGallery />
        </div>

        {/* Section 7: Cost Split */}
        <div id="cost-split" className="scroll-mt-16 mb-8">
          <CostSplit
            selectedHotel={selectedHotel}
            groupSize={groupSize}
            oneWayBusFare={oneWayBusFare}
            members={members}
            memberSplits={memberSplits}
            onMemberSplitsChange={setMemberSplits}
          />
        </div>

        {/* Section 7: Members & Seat Assignment */}
        <div id="group-selector" className="scroll-mt-16 mb-8">
          <GroupSelector
            groupSize={groupSize}
            onGroupSizeChange={setGroupSize}
            members={members}
            onMembersChange={setMembers}
            oneWayBusFare={oneWayBusFare}
          />
        </div>

        {/* Section 8: Route Map */}
        <div id="route-map" className="scroll-mt-16 mb-8">
          <RouteMap />
        </div>

        {/* Section 9: Timeline */}
        <div id="timeline" className="scroll-mt-16 mb-8">
          <TimelineSection />
        </div>

        {/* Section 10: Checklist */}
        <div id="checklist" className="scroll-mt-16 mb-8">
          <PackingChecklist />
        </div>

        {/* Section 11: Real Weather section */}
        <div id="weather" className="scroll-mt-16 mb-8">
          <WeatherDashboard />
        </div>

        {/* Auxiliary alert and push notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <TripUpdates />
          <NotificationSettings />
        </div>

        {/* Section 7: Dedicated calculations panel */}
        <div className="mt-10 scroll-mt-16" id="calculator-section">
          <CalculatorPanel
            selectedHotel={selectedHotel}
            groupSize={groupSize}
            oneWayBusFare={oneWayBusFare}
            onBusFareChange={setOneWayBusFare}
          />
        </div>

        {/* Price disclaimer caution footer */}
        <div className="mt-12 bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-4.5 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2 max-w-4xl mx-auto transition-colors duration-300">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Disclaimer on Travel Prices (Screenshots Base):</strong>
            <p className="mt-1 leading-relaxed">
              These rates and discounts are based on current screenshot extracts and dynamic room availability data for the 2026 trip calendar. Actual prices might fluctuate based on real-time booking windows, seasonal high times in Cox’s Bazar, and bus operator policy updates. Always verify details with booking systems, bKash pay structures, or official agencies before booking.
            </p>
          </div>
        </div>

        {/* Footer info brand elements */}
        <footer className="mt-16 text-center border-t border-gray-200 dark:border-slate-800 pt-8 pb-12 text-xs text-gray-400 dark:text-slate-500">
          <p className="font-bold text-gray-500 dark:text-slate-400 font-sans">
            🌴 COX'S BAZAR SQUAD TRIP PLANNER 2026
          </p>
          <p className="mt-1.5">
            Designed to empower travel squads in Bangladesh with instant cost splits, hotel ratings, and bus details.
          </p>
          <p className="mt-4 font-mono text-[10px]">
            © 2026 Cox Voyage 2026. Custom squad trip planning tool made by Avishek Majumder.
          </p>
        </footer>
      </div>

      {/* Section 6 (Modal Compare Drawer) & Section 11 (Mobile app bottom sticky action bar) */}
      <CompareDrawer
        compareHotels={compareHotels}
        onRemoveFromCompare={handleRemoveFromCompare}
        onClearCompare={handleClearCompare}
        groupSize={groupSize}
        oneWayBusFare={oneWayBusFare}
        onSelectHotel={setSelectedHotel}
        selectedHotelId={selectedHotel.id}
      />

      {/* Hotel Details Side Drawer Modal */}
      <HotelDetailsModal
        hotel={detailHotel}
        isOpen={detailHotel !== null}
        onClose={() => setDetailHotel(null)}
        groupSize={groupSize}
        oneWayBusFare={oneWayBusFare}
        isSelected={detailHotel ? selectedHotel.id === detailHotel.id : false}
        onSelect={() => detailHotel && setSelectedHotel(detailHotel)}
        isCompared={detailHotel ? compareHotels.some(h => h.id === detailHotel.id) : false}
        onToggleCompare={() => detailHotel && handleToggleCompare(detailHotel)}
        isShortlisted={detailHotel ? shortlistedIds.includes(detailHotel.id) : false}
        onToggleShortlist={() => detailHotel && handleToggleShortlist(detailHotel.id)}
      />

      {/* Floating Bottom cost action bar for mobile devices only */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-[#0F1A30]/95 backdrop-blur-md border-t border-gray-250 dark:border-slate-800 p-3.5 flex items-center justify-between shadow-lg transition-colors duration-300">
        <div className="overflow-hidden max-w-[55%]">
          <span className="text-[10px] text-gray-400 dark:text-slate-400 block font-mono truncate">
            {selectedHotel.name} ({groupSize}p)
          </span>
          <span className="text-lg font-black text-sky-600 block leading-tight font-mono">
            {formatBDT(currentCosts.individualCost)} <span className="text-[10px] text-gray-500 dark:text-slate-450 font-sans font-normal">/person</span>
          </span>
        </div>

        <a
          href="#group-selector"
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer shadow-sm text-center"
        >
          Adjust Group
        </a>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        signInWithGoogle={signInWithGoogle}
        signInWithEmail={signInWithEmail}
        signUpWithEmail={signUpWithEmail}
        onSuccess={() => {
          setAuthModalOpen(false);
        }}
      />
    </div>
  );
}
