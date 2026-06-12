import React, { useEffect, useState } from 'react';
import {
  X,
  Star,
  MapPin,
  Coffee,
  ShieldCheck,
  Bed,
  Users,
  Bus,
  Activity,
  Heart,
  Plus,
  Check,
  Percent,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Flame,
  Info,
  Compass,
  FileText
} from 'lucide-react';
import { Hotel, GroupSize, TripCosts } from '../types';
import { calculateAllTripCosts, formatBDT } from '../data/hotels';
import { hotelBookingDocuments } from '../data/bookingDocuments';
import BookingDocumentViewer from './BookingDocumentViewer';

interface HotelDetailsModalProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
  groupSize: GroupSize;
  oneWayBusFare: number;
  isSelected: boolean;
  onSelect: () => void;
  isCompared: boolean;
  onToggleCompare: () => void;
  isShortlisted: boolean;
  onToggleShortlist: () => void;
}

type TabType =
  | 'overview'
  | 'room'
  | 'room_facilities'
  | 'facilities'
  | 'nearby'
  | 'policy'
  | 'costs'
  | 'reviews';

export default function HotelDetailsModal({
  hotel,
  isOpen,
  onClose,
  groupSize,
  oneWayBusFare,
  isSelected,
  onSelect,
  isCompared,
  onToggleCompare,
  isShortlisted,
  onToggleShortlist,
}: HotelDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [activeImage, setActiveImage] = useState<string>('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [activeDoc, setActiveDoc] = useState<{
    title: string;
    type: string;
    viewUrl: string;
    embedUrl: string;
  } | null>(null);

  useEffect(() => {
    if (hotel) {
      setActiveImage(hotel.imageUrl);
    }
  }, [hotel]);

  // Prevent scroll background when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!hotel || !isOpen) return null;

  const currentCosts = calculateAllTripCosts(hotel, groupSize, oneWayBusFare);
  const details = hotel.details;
  const isPremiumHotel = hotel.id === 'ocean-paradise';

  // Highlighted facilities helper
  const isHighlightedFacility = (name: string) => {
    const lowerName = name.toLowerCase();
    return (
      lowerName.includes('shuttle') ||
      lowerName.includes('pool') ||
      lowerName.includes('gym') ||
      lowerName.includes('breakfast') ||
      lowerName.includes('couple')
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
      onClick={onClose}
    >
      {/* Drawer Container */}
      <div
        className="w-full max-w-4xl bg-slate-50 h-full overflow-y-auto shadow-2xl flex flex-col relative md:rounded-l-3xl animate-slide-in-right cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Absolute Header with close button */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-150 z-25 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#006CE4]/10 text-[#006CE4] p-1.5 rounded-xl">
              <Star className="w-5 h-5 fill-current" />
            </span>
            <div>
              <h2 className="text-sm md:text-base font-black text-slate-950 flex flex-wrap items-center gap-2 leading-none">
                {details.hotelName}
                {isPremiumHotel && (
                  <span className="bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                    👑 Luxury Pick
                  </span>
                )}
                {isSelected && (
                  <span className="bg-emerald-550 dark:bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1 shadow-xs ring-1 ring-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Hotel Booked
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" /> {details.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Shortlist heart inside detail header */}
            <button
              onClick={onToggleShortlist}
              className={`p-2.5 rounded-xl border transition ${
                isShortlisted
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-450 border-slate-200'
              }`}
              title={isShortlisted ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              title="Close details (Esc)"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Content Outer Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          {/* Main Details Panel (Col 1 to 7) */}
          <div className="lg:col-span-8 p-5 sm:p-6 space-y-6">
            {/* Main Picture Gallery Cover */}
            <div className="space-y-3">
              {/* Main Large Preview Image */}
              <div className="relative h-60 md:h-72 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                {hotel.id === 'surestay-premium-deluxe' && hotel.galleryImages && hotel.galleryImages.length > 0 ? (
                  <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth">
                    {hotel.galleryImages.map((imgUrl, uidx) => {
                      const fallbackText = `SureStay Premium Deluxe Room Interior ${uidx + 1}`;
                      return (
                        <div key={uidx} className="w-full h-full flex-shrink-0 snap-start relative">
                          {imageErrors[imgUrl] ? (
                            <div className="w-full h-full bg-gradient-to-br from-[#003B95] to-[#006CE4] flex flex-col items-center justify-center p-4 text-center text-white">
                              <Compass className="w-8 h-8 text-white/50 mb-2 animate-pulse" />
                              <span className="font-extrabold text-[11px] tracking-wide uppercase">Failed to load</span>
                              <span className="text-[9px] text-white/50 mt-0.5">{fallbackText}</span>
                            </div>
                          ) : (
                            <img
                              src={imgUrl}
                              alt={fallbackText}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={() => {
                                setImageErrors((prev) => ({ ...prev, [imgUrl]: true }));
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : imageErrors[activeImage || hotel.imageUrl] ? (
                  <div className="w-full h-full bg-gradient-to-br from-[#003B95] to-[#006CE4] flex flex-col items-center justify-center p-4 text-center text-white">
                    <Compass className="w-10 h-10 text-white/85 mb-2 select-none animate-pulse" />
                    <span className="font-extrabold text-[13px] tracking-wider uppercase">Cox Voyage 2026</span>
                    <span className="text-[10px] text-white/70 mt-1">{hotel.name}</span>
                  </div>
                ) : (
                  <img
                    src={activeImage || hotel.imageUrl}
                    alt={
                      hotel.id === 'ocean-paradise'
                        ? 'Ocean Paradise Hotel & Resort image'
                        : hotel.id === 'green-nature-resort'
                        ? 'Green Nature Resort and Suites image'
                        : hotel.id === 'grand-pacific-premier'
                        ? 'Hotel Grand Pacific, Cox’s Bazar image'
                        : hotel.id === 'windy-terrace-standard'
                        ? 'Windy Terrace Hotel Standard King Deluxe image'
                        : hotel.id === 'windy-terrace-superior'
                        ? 'Windy Terrace Hotel Superior King Deluxe image'
                        : hotel.id === 'hotel-sea-crown'
                        ? 'Hotel Sea Crown Super Deluxe with Balcony image'
                        : hotel.id === 'hotel-sea-uttara'
                        ? 'Hotel Sea Uttara Premier Double King with Balcony image'
                        : hotel.id === 'white-orchid-sapphire'
                        ? 'White Orchid Sapphire Premier King with Balcony image'
                        : hotel.id === 'white-orchid-executive-couple-garden-view'
                        ? 'White Orchid Executive Couple Garden View image'
                        : hotel.id === 'surestay-premium-deluxe'
                        ? 'SureStay by Best Western Cox’s Bazar Premium Deluxe image'
                        : hotel.id === 'grace-cox-standard-double-queen'
                        ? 'Grace Cox Smart Hotel Standard Double Queen image'
                        : hotel.id === 'grace-cox-deluxe-double-king'
                        ? 'Grace Cox Smart Hotel Deluxe Double King image'
                        : hotel.id === 'hotel-sea-paradise-higher-floor'
                        ? 'Hotel Sea Paradise Deluxe Couple Side Sea View Higher Floor image'
                        : hotel.id === 'hotel-sea-paradise-balcony'
                        ? 'Hotel Sea Paradise Deluxe Couple Side Sea View with Balcony image'
                        : `${hotel.name} - ${hotel.roomName}`
                    }
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => {
                      setImageErrors((prev) => ({ ...prev, [activeImage || hotel.imageUrl]: true }));
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"></div>
                
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3 pointer-events-none">
                  <div className="text-white space-y-1">
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const count = parseFloat(details.starRating);
                        return (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < count ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500 fill-slate-500'
                            }`}
                          />
                        );
                      })}
                      <span className="text-xs font-bold text-yellow-300 tracking-wide font-mono ml-1">
                        {details.starRating} Rating
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold tracking-tight">{details.roomName}</h3>
                  </div>

                  <div className="bg-black/60 backdrop-blur-md text-white font-mono rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1 border border-white/10">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{hotel.planType}</span>
                  </div>
                </div>
              </div>

              {/* Gallery Scrollable Thumbnails Section */}
              {hotel.galleryImages && hotel.galleryImages.length > 0 && (
                <div className="bg-white p-2.5 rounded-2xl border border-slate-150 shadow-xxs">
                  <p className="text-[9px] uppercase font-black tracking-wider text-slate-400 mb-1.5 px-0.5 flex items-center justify-between">
                    <span>Hotel Room Gallery</span>
                    <span className="font-mono lowercase text-[9px] font-bold text-slate-500">
                      {hotel.galleryImages.filter(imgUrl => !imageErrors[imgUrl]).findIndex(img => img === (activeImage || hotel.imageUrl)) + 1} of {hotel.galleryImages.filter(imgUrl => !imageErrors[imgUrl]).length}
                    </span>
                  </p>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scrollbar-thin snap-x snap-mandatory">
                    {hotel.galleryImages.filter(imgUrl => !imageErrors[imgUrl]).map((imgUrl, idx) => {
                      const isActive = (activeImage || hotel.imageUrl) === imgUrl;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImage(imgUrl)}
                          className={`relative w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden flex-shrink-0 transition border cursor-pointer snap-start ${
                            isActive
                              ? 'border-[#006CE4] ring-2 ring-[#006CE4]/20 opacity-100'
                              : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-350'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`${hotel.name} Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={() => {
                              setImageErrors((prev) => ({ ...prev, [imgUrl]: true }));
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Ocean Paradise Highlight Badges section */}
            {isPremiumHotel && (
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 rounded-2xl p-4 space-y-3">
                <span className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Highlighted 5-Star Perks
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wide border border-amber-200/60 shadow-xxs">
                    🏊 Swimming Pool Free
                  </span>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wide border border-amber-200/60 shadow-xxs">
                    🏋️ Gym Facility Free
                  </span>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wide border border-amber-200/60 shadow-xxs">
                    🍳 Free Breakfast Included
                  </span>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wide border border-amber-200/60 shadow-xxs">
                    👫 Couple Friendly
                  </span>
                </div>
              </div>
            )}

            {/* Hotel Sea Crown Highlight Badges section */}
            {hotel.id === 'hotel-sea-crown' && (
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 border border-rose-200 rounded-2xl p-4 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase text-rose-850 tracking-wider flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> Highlighted Sea Crown Features
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-rose-150/60 shadow-xxs">
                      📍 4.4 Location Rating
                    </span>
                    <span className="bg-white text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-rose-150/60 shadow-xxs">
                      🌊 0.02 km from Kolatoli Beach
                    </span>
                    <span className="bg-white text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-rose-150/60 shadow-xxs">
                      🌅 Sea-View Balcony
                    </span>
                    <span className="bg-white text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-rose-150/60 shadow-xxs">
                      🏖️ Beachfront Location
                    </span>
                    <span className="bg-white text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-rose-150/60 shadow-xxs">
                      👫 Couple Friendly
                    </span>
                    <span className="bg-white text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-rose-150/60 shadow-xxs">
                      🚐 Airport Shuttle Service
                    </span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-250 text-amber-850 p-4 rounded-2xl text-[11px] font-semibold leading-relaxed flex items-start gap-2.5 shadow-xxs font-sans">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>Renovation warning: the property notes that loud noise may occur during stay.</span>
                </div>
              </div>
            )}

            {/* Hotel Sea Uttara Highlight Badges section */}
            {hotel.id === 'hotel-sea-uttara' && (
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 border border-rose-200 rounded-2xl p-4 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase text-rose-850 tracking-wider flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> Highlighted Sea Uttara Features
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-rose-150/60 shadow-xxs">
                      👤 4.2 Staff Score
                    </span>
                    <span className="bg-white text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-rose-150/60 shadow-xxs">
                      📍 4.2 Location Score
                    </span>
                    <span className="bg-white text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-rose-150/60 shadow-xxs">
                      ✨ 4.1 Cleanliness Score
                    </span>
                    <span className="bg-white text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-rose-150/60 shadow-xxs">
                      🌅 Balcony
                    </span>
                    <span className="bg-white text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-rose-150/60 shadow-xxs">
                      📐 330 sq.ft Room Size
                    </span>
                    <span className="bg-white text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-rose-150/60 shadow-xxs">
                      🏖️ 0.35 km from Kolatoli Beach
                    </span>
                    <span className="bg-white text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-rose-150/60 shadow-xxs">
                      🚌 0.15 km from Kolatoli Bus Stand
                    </span>
                    <span className="bg-white text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-rose-150/60 shadow-xxs">
                      👫 Couple Friendly
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Grace Cox Smart Hotel Highlight Badges and Data Quality Notice section */}
            {hotel.id.includes('grace-cox') && (
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-250 rounded-2xl p-4 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase text-indigo-900 tracking-wider flex items-center gap-1 font-sans">
                    <Flame className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600/20 animate-pulse" /> Highlighted Grace Cox Features
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      🤝 4.5 Staff Score
                    </span>
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      💖 Couple Friendly
                    </span>
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      🏙️ City Centre Location
                    </span>
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      🚐 Free Airport Shuttle
                    </span>
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      🥣 Free Buffet Breakfast
                    </span>
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      🛡️ Refundable
                    </span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-250 text-amber-850 p-4 rounded-2xl text-[11px] font-semibold leading-relaxed flex items-start gap-2.5 shadow-xxs font-sans">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>Hotel details and prices are based on screenshots and manually collected trip-planning data. Recheck price, availability, room policy, and cancellation terms before final booking.</span>
                </div>
              </div>
            )}

            {/* Hotel Sea Paradise Highlight Badges and Data Quality Notice section */}
            {hotel.id.includes('hotel-sea-paradise') && (
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-250 rounded-2xl p-4 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase text-indigo-900 tracking-wider flex items-center gap-1 font-sans">
                    <Flame className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600/20 animate-pulse" /> Highlighted Sea Paradise Features
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      👫 Couple Friendly
                    </span>
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      🏊 Swimming Pool
                    </span>
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      🥣 Breakfast Included
                    </span>
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      🛡️ Refundable
                    </span>
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      🌊 Kolatoli Beach
                    </span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-250 text-amber-850 p-4 rounded-2xl text-[11px] font-semibold leading-relaxed flex items-start gap-2.5 shadow-xxs font-sans">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>Hotel details and prices are based on screenshots and manually collected trip-planning data. Recheck price, availability, room policy, and cancellation terms before final booking.</span>
                </div>
              </div>
            )}

            {/* White Orchid Highlight Badges and Data Quality Notice section */}
            {hotel.id.includes('white-orchid') && (
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-250 rounded-2xl p-4 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase text-indigo-900 tracking-wider flex items-center gap-1 font-sans">
                    <Flame className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600/20 animate-pulse" /> Highlighted White Orchid Features
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      👫 Couple Friendly
                    </span>
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      🥣 Breakfast Included
                    </span>
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      🛡️ Refundable
                    </span>
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      📶 Free Wi-Fi
                    </span>
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      🌅 Terrace
                    </span>
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      🍽️ Restaurant
                    </span>
                  </div>
                </div>

                {/* White Orchid images are loaded from public Google Drive image thumbnails for demo use. For production stability, local public/hotels assets are recommended. */}
                <div className="bg-amber-50 border border-amber-250 text-amber-850 p-4 rounded-2xl text-[11px] font-semibold leading-relaxed flex items-start gap-2.5 shadow-xxs font-sans">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>Hotel details and prices are based on screenshots and manually collected trip-planning data. Recheck price, availability, room policy, and cancellation terms before final booking.</span>
                </div>
              </div>
            )}

            {/* SureStay Highlight Badges and Data Quality Notice section */}
            {hotel.id.includes('surestay') && (
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100/45 border border-blue-200 rounded-2xl p-4 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase text-indigo-900 tracking-wider flex items-center gap-1 font-sans">
                    <Flame className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600/20 animate-pulse" /> Highlights & Verified Amenities
                  </span>
                  <div className="flex flex-wrap gap-1.5 font-sans">
                    <span className="bg-white text-indigo-800 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      🏨 {hotel.name}
                    </span>
                    <span className="bg-white text-indigo-850 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs flex items-center gap-1">
                      ⭐ {hotel.starRating} Badge
                    </span>
                    <span className="bg-white text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 shadow-xxs">
                      📍 {details.address}
                    </span>
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase shadow-xxs flex items-center gap-1">
                      👍 4.4/5 Excellent
                    </span>
                    <span className="bg-white text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-emerald-150/60 shadow-xxs">
                      ✨ Cleanliness: 4.6
                    </span>
                    <span className="bg-white text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-emerald-150/60 shadow-xxs">
                      👥 Staff: 4.5
                    </span>
                    <span className="bg-white text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-emerald-150/60 shadow-xxs">
                      🛋️ Comfort: 4.5
                    </span>
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      👫 Couple Friendly
                    </span>
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      🥣 Breakfast Included
                    </span>
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      🛡️ Refundable
                    </span>
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      🌎 International Chain
                    </span>
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      🏋️ Gym
                    </span>
                    <span className="bg-white text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-indigo-150/60 shadow-xxs">
                      🚐 Airport Shuttle Service
                    </span>
                  </div>
                </div>

                {/* SureStay by Best Western Cox’s Bazar images are loaded from public Google Drive image thumbnails for demo use. For production stability, local public/hotels assets are recommended. */}
                <div className="bg-amber-50 border border-amber-250 text-amber-850 p-4 rounded-2xl text-[11px] font-semibold leading-relaxed flex items-start gap-2.5 shadow-xxs font-sans">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>Hotel details and prices are based on screenshots and manually collected trip-planning data. Recheck price, availability, room policy, and cancellation terms before final booking.</span>
                </div>
              </div>
            )}

            {/* Unified Pool Access Status Panel */}
            {hotel.poolAccess && (
              <div className="bg-white dark:bg-[#131E35] border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xxs">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">🏊</span>
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Swimming Pool Access</span>
                  <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md ml-auto ${
                    hotel.poolAccess === 'included'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : hotel.poolAccess === 'shared'
                      ? 'bg-amber-100 text-amber-800 border border-amber-250'
                      : 'bg-rose-50 text-rose-700 border border-rose-150'
                  }`}>
                    {hotel.poolAccess === 'included' ? 'Included / Free' : hotel.poolAccess === 'shared' ? 'Shared Pool' : 'Not Available'}
                  </span>
                </div>
                <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-medium">
                  {hotel.poolNote || "No specific swimming pool service notes retrieved from listing screenshot details."}
                </p>
              </div>
            )}

            {/* Tabs List */}
            <div className="flex h-11 border-b border-slate-200 overflow-x-auto gap-4 no-scrollbar scroll-smooth">
              {([
                { id: 'overview', name: 'Overview' },
                ...(hotel.id === 'hotel-sea-crown' || hotel.id === 'hotel-sea-uttara' || hotel.id.includes('hotel-sea-paradise') || hotel.id.includes('white-orchid') || hotel.id.includes('surestay')
                  ? [
                      { id: 'room', name: 'Room Details' },
                      { id: 'room_facilities', name: 'Room Facilities' },
                      { id: 'nearby', name: 'Nearby' },
                      { id: 'facilities', name: 'Hotel Facilities' },
                    ]
                  : [
                      { id: 'room', name: 'Room Space' },
                      { id: 'facilities', name: 'Facilities' },
                      { id: 'nearby', name: 'Terminals / Nearby' },
                    ]
                ),
                { id: 'policy', name: 'Policy' },
                { id: 'costs', name: (hotel.id === 'hotel-sea-crown' || hotel.id === 'hotel-sea-uttara' || hotel.id.includes('hotel-sea-paradise') || hotel.id.includes('white-orchid') || hotel.id.includes('surestay')) ? 'Cost Breakdown' : 'Cost splits' },
                { id: 'reviews', name: 'Reviews' },
              ] as { id: TabType; name: string }[]).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative font-bold text-xs md:text-sm h-full shrink-0 px-1 border-b-2 transition duration-200 cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-[#006CE4] text-[#006CE4]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Tab Contents Frame */}
            <div className="bg-white rounded-2xl p-5 border border-slate-150 shadow-xxs min-h-[220px]">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-indigo-50/55 p-3 rounded-xl border border-indigo-100">
                    <span className="bg-indigo-600 text-white font-mono font-bold text-xs px-2 py-1 rounded-lg shadow-xxs">
                      {details.reviewSummary?.score || 'Not provided'}
                    </span>
                    <div>
                      <strong className="text-xs font-bold text-slate-850 block">
                        Review Grade: {details.reviewSummary?.text || 'Standard'}
                      </strong>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Based on {details.reviewSummary?.count || 'screenshot'} genuine traveler feedbacks
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono">
                      About the Hotel
                    </h4>
                    <p className="text-xs text-slate-650 leading-relaxed whitespace-pre-line">
                      {details.description || 'Hotel details described inside screenshots. Fully comfortable.'}
                    </p>
                  </div>

                  {details.notes && (
                    <div className="bg-slate-50 p-3 rounded-xl text-slate-650 text-xs border border-slate-150 leading-relaxed font-sans">
                      <strong className="font-bold text-slate-800 block">Note summary:</strong>
                      {details.notes}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'room' && (
                <div className="space-y-4 font-mono">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest font-sans">
                    Room Space Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl flex justify-between">
                      <span className="text-slate-400">Room Name:</span>
                      <span className="font-bold text-slate-850">{details.roomName}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl flex justify-between font-sans">
                      <span className="text-slate-400">Star Grade:</span>
                      <span className="font-bold text-slate-850 text-yellow-600 flex items-center gap-1">
                        ★ {details.starRating}
                      </span>
                    </div>
                    {details.roomDetails?.roomType && (
                      <div className="bg-slate-50 p-3 rounded-xl flex justify-between">
                        <span className="text-slate-400">Bed configuration:</span>
                        <span className="font-bold text-slate-850">{details.roomDetails.roomType}</span>
                      </div>
                    )}
                    {details.roomDetails?.occupancy && (
                      <div className="bg-slate-50 p-3 rounded-xl flex justify-between">
                        <span className="text-slate-400">Standard Occupancy:</span>
                        <span className="font-bold text-slate-850">{details.roomDetails.occupancy}</span>
                      </div>
                    )}
                    <div className="bg-slate-50 p-3 rounded-xl flex justify-between">
                      <span className="text-slate-400">Breakfast Plan:</span>
                      <span className="font-bold text-slate-850">
                        {hotel.breakfast ? 'Buffet Included 🍳' : 'Room Only 🛏️'}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl flex justify-between">
                      <span className="text-slate-400">Refund Liability:</span>
                      <span className="font-bold text-slate-850">
                        {hotel.refundable ? 'Fully Refundable' : 'Non-Refundable'}
                      </span>
                    </div>
                  </div>

                  {/* Room Facilities Section */}
                  {!hotel.id.includes('hotel-sea-paradise') && !hotel.id.includes('white-orchid') && !hotel.id.includes('surestay') && hotel.id !== 'hotel-sea-crown' && hotel.id !== 'hotel-sea-uttara' && (
                    <>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest font-sans pt-2">
                        Room Facilities
                      </h4>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {details.roomFacilities?.bedroom?.map((fac, i) => (
                          <span key={i} className="bg-emerald-50 border border-emerald-150 text-emerald-800 px-2.5 py-1 rounded-lg font-sans">
                            🛌 {fac}
                          </span>
                        ))}
                        {details.roomFacilities?.bathroom?.map((fac, i) => (
                          <span key={i} className="bg-sky-50 border border-sky-150 text-sky-800 px-2.5 py-1 rounded-lg font-sans">
                            🚿 {fac}
                          </span>
                        ))}
                        {details.roomFacilities?.others?.map((fac, i) => (
                          <span key={i} className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-sans">
                            ✓ {fac}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'room_facilities' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest font-sans">
                    Room Facilities & Services
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {details.roomFacilities?.bedroom?.map((fac, i) => (
                      <span key={i} className="bg-emerald-50 border border-emerald-110 text-emerald-800 px-3 py-1.5 rounded-lg font-sans flex items-center gap-1.5 shadow-xxs">
                        🛌 <strong>Bedroom:</strong> {fac}
                      </span>
                    ))}
                    {details.roomFacilities?.bathroom?.map((fac, i) => (
                      <span key={i} className="bg-sky-50 border border-sky-110 text-sky-800 px-3 py-1.5 rounded-lg font-sans flex items-center gap-1.5 shadow-xxs">
                        🚿 <strong>Bathroom:</strong> {fac}
                      </span>
                    ))}
                    {details.roomFacilities?.media?.map((fac, i) => (
                      <span key={i} className="bg-purple-50 border border-purple-110 text-purple-800 px-3 py-1.5 rounded-lg font-sans flex items-center gap-1.5 shadow-xxs">
                        💻 <strong>Media:</strong> {fac}
                      </span>
                    ))}
                    {details.roomFacilities?.food?.map((fac, i) => (
                      <span key={i} className="bg-amber-50 border border-amber-110 text-amber-800 px-3 py-1.5 rounded-lg font-sans flex items-center gap-1.5 shadow-xxs font-medium">
                        🍽️ <strong>Dining:</strong> {fac}
                      </span>
                    ))}
                    {details.roomFacilities?.others?.map((fac, i) => (
                      <span key={i} className="bg-slate-100 border border-slate-150 text-slate-700 px-3 py-1.5 rounded-lg font-sans flex items-center gap-1.5 shadow-xxs">
                        ✓ <strong>Service:</strong> {fac}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'facilities' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest font-sans">
                    General Hotel Facilities
                  </h4>
                  
                  {details.hotelFacilities && Object.keys(details.hotelFacilities).length > 2 ? (
                    <div className="space-y-4">
                      {Object.entries(details.hotelFacilities).map(([category, items]) => {
                        if (!items || items.length === 0) return null;
                        
                        // Capitalize category name nicely
                        const categoryLabels: Record<string, string> = {
                          business: 'Business Facilities',
                          wellness: 'Wellness & Health',
                          food: 'Food & Dining',
                          general: 'General Amenities',
                          media: 'Media & Technology',
                          parking: 'Parking & Accessibility',
                          safety: 'Safety & Security',
                          services: 'Services & Extras',
                          transport: 'Transportation',
                        };
                        const label = categoryLabels[category] || category.substring(0, 1).toUpperCase() + category.substring(1);
                        
                        // Icon mapping
                        const iconLabels: Record<string, string> = {
                          business: '💼',
                          wellness: '🏊',
                          food: '🍽️',
                          general: '✨',
                          media: '📱',
                          parking: '🅿️',
                          safety: '🛡️',
                          services: '🛎️',
                          transport: '🚐',
                        };
                        const icon = iconLabels[category] || '✓';

                        return (
                          <div key={category} className="space-y-2">
                            <span className="text-[10px] font-extrabold text-slate-400 font-mono uppercase tracking-widest block">
                              {icon} {label}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {items.map((item, i) => (
                                <span key={i} className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium transition duration-200 hover:border-slate-300">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : isPremiumHotel ? (
                    <div className="space-y-4">
                      {/* Wellness facilities */}
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">Wellness & Pool:</span>
                        <div className="flex flex-wrap gap-1.5 overflow-hidden">
                          {details.hotelFacilities?.wellness?.map((item, i) => (
                            <span key={i} className="bg-indigo-50 border border-indigo-150 text-indigo-800 text-xs px-2.5 py-1 rounded-lg font-bold">
                              💆‍♂️ {item}
                            </span>
                          ))}
                        </div>
                      </div>
 
                      {/* General amenities */}
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">Hospitality & Infrastructure:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {details.hotelFacilities?.general?.map((item, i) => {
                            const isHighlight = isHighlightedFacility(item);
                            return (
                              <span
                                key={i}
                                className={`text-xs px-2.5 py-1 rounded-lg font-sans border transition ${
                                  isHighlight
                                    ? 'bg-amber-50 border-amber-250 text-amber-800 font-bold'
                                    : 'bg-slate-50 border-slate-200 text-slate-650'
                                }`}
                              >
                                {item}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-slate-500 text-xs italic">
                        General facilities as captured inside screenshots of listings:
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {hotel.tags.map((tag, i) => (
                          <span key={i} className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-semibold">
                            {tag}
                          </span>
                        ))}
                        {details.hotelFacilities?.general?.map((item, i) => (
                          <span key={i} className="bg-sky-50 border border-sky-100 text-sky-800 text-xs px-2.5 py-1 rounded-lg font-semibold">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'nearby' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest font-sans">
                    Terminals & Nearby Attractions
                  </h4>

                  {details.nearby && details.nearby.length > 0 ? (
                    <div className="space-y-2.5">
                      {details.nearby.map((point, idx) => (
                        <div key={idx} className="flex gap-2.5 items-center text-xs text-slate-700 font-sans border-b border-dashed border-slate-100 pb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#006CE4]"></span>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Not detailed in screenshots. Located inside the main Hotel Motel Zone, Kolatoli, Cox's Bazar.</p>
                  )}
                </div>
              )}

              {activeTab === 'policy' && (
                <div className="space-y-4 text-xs">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest font-sans">
                    Hotel Policies & House Rules
                  </h4>

                  <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                    <div className="bg-slate-50 p-3 rounded-xl font-mono">
                      <span className="text-slate-400 block text-[10px] uppercase font-sans mb-1">Check-in time:</span>
                      <strong className="text-slate-800">{details.policies?.checkIn || '14:00'} PM</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl font-mono">
                      <span className="text-slate-400 block text-[10px] uppercase font-sans mb-1">Check-out time:</span>
                      <strong className="text-slate-800">{details.policies?.checkOut || '12:00'} PM</strong>
                    </div>
                  </div>

                  {details.policies?.childPolicy && (
                    <div className="space-y-1">
                      <strong className="text-slate-800 block">Children Accommodation Policy:</strong>
                      <p className="text-slate-600 leading-relaxed font-sans">{details.policies.childPolicy}</p>
                    </div>
                  )}

                  {details.policies?.houseRules && details.policies.houseRules.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <strong className="text-slate-800 block">House Rules & Notes:</strong>
                      <div className="space-y-1 font-sans">
                        {details.policies.houseRules.map((rule, idx) => (
                          <div key={idx} className="flex items-start gap-1 pb-1 text-slate-650 leading-relaxed text-[11px]">
                            <span className="text-emerald-500 font-bold block mr-1 flex-shrink-0">✓</span>
                            <span>{rule}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'costs' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest font-sans">
                    Detailed Math Cost Splits
                  </h4>
                  
                  <div className="bg-slate-50 p-4 rounded-2xl font-mono text-xs space-y-2.5 border border-slate-200/50">
                    <div className="flex justify-between border-b border-slate-200/30 pb-2">
                      <span className="text-slate-500">Base Room (1 Night):</span>
                      <span className="font-bold text-slate-800">{formatBDT(currentCosts.basePrice)}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/30 pb-2">
                      <span className="text-slate-500">Taxes & Service fees:</span>
                      <span className="font-bold text-slate-800">+{formatBDT(currentCosts.taxesAndFees)}</span>
                    </div>
                    <div className="flex justify-between text-[#E2136E] border-b border-slate-200/30 pb-2">
                      <span>bKash 3% Cash Discount:</span>
                      <span className="font-bold font-mono">-{formatBDT(currentCosts.bkashDiscount)}</span>
                    </div>
                    <div className="flex justify-between items-baseline font-bold font-sans text-sm pb-1 text-slate-900">
                      <span>Final Net Cost (Per Room night):</span>
                      <span className="text-[#006CE4] font-mono">{formatBDT(currentCosts.finalPerRoomCost)}</span>
                    </div>
                    
                    <div className="pt-2.5 border-t border-dashed border-slate-200 space-y-1.5 text-[11px] font-sans">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Allocated Rooms ({currentCosts.roomCount} Double Rooms):</span>
                        <strong className="text-slate-800 font-mono">{formatBDT(currentCosts.hotelTotal)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Round-trip Bus ({groupSize} seats at {formatBDT(oneWayBusFare * 2)} RT):</span>
                        <strong className="text-slate-800 font-mono">{formatBDT(currentCosts.busTotal)}</strong>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-200 font-black text-xs text-slate-900">
                        <span>Squad Grand Trip Total:</span>
                        <span className="text-amber-600 font-mono text-sm">{formatBDT(currentCosts.fullTripTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest font-sans">
                    Screenshot & Manual Feedback Scores
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl space-y-3.5">
                      <div className="flex items-baseline gap-1 bg-white p-3 rounded-xl border border-slate-150 text-center justify-center">
                        <span className="text-3xl font-mono font-black text-slate-900">
                          {details.reviewSummary?.score || '4.0'}
                        </span>
                        <span className="text-slate-400 text-xs">/ 5.0</span>
                      </div>
                      
                      <div className="text-center font-bold text-xs text-slate-600 font-mono">
                        {details.reviewSummary?.count || 'Screenshot'} verified reviews cataloged
                      </div>
                    </div>

                    <div className="space-y-3 font-sans">
                      {/* Score metrics */}
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                            <span>📍 Location proximity</span>
                            <span>{details.reviewSummary?.locationScore || '4.2'} / 5</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-[#006CE4] h-1.5 rounded-full" style={{ width: `${((details.reviewSummary?.locationScore || 4.2) / 5) * 100}%` }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                            <span>🛌 Bed & Sleep comfort</span>
                            <span>{details.reviewSummary?.comfortScore || '4.0'} / 5</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${((details.reviewSummary?.comfortScore || 4.0) / 5) * 100}%` }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                            <span>✨ Cleanliness rating</span>
                            <span>{details.reviewSummary?.cleanlinessScore || '4.0'} / 5</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${((details.reviewSummary?.cleanlinessScore || 4.0) / 5) * 100}%` }}></div>
                          </div>
                        </div>

                        {details.reviewSummary?.staffScore && (
                          <div>
                            <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                              <span>👥 Staff hospitality</span>
                              <span>{details.reviewSummary.staffScore} / 5</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${(details.reviewSummary.staffScore / 5) * 100}%` }}></div>
                            </div>
                          </div>
                        )}

                        {details.reviewSummary?.facilitiesScore && (
                          <div>
                            <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                              <span>🛎️ Hotel facilities</span>
                              <span>{details.reviewSummary.facilitiesScore} / 5</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${(details.reviewSummary.facilitiesScore / 5) * 100}%` }}></div>
                            </div>
                          </div>
                        )}

                        {details.reviewSummary?.valueScore && (
                          <div>
                            <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                              <span>💰 Value for money</span>
                              <span>{details.reviewSummary.valueScore} / 5</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${(details.reviewSummary.valueScore / 5) * 100}%` }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {details.reviews && details.reviews.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-150 space-y-3.5" id="customer-opinions-log">
                      <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-wider font-sans mb-3">
                        Detailed Customer Log ({details.reviews.length} reviews)
                      </h5>
                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                        {details.reviews.map((rev, revIdx) => (
                          <div key={revIdx} className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-xs space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-extrabold text-slate-800">{rev.author}</span>
                                <span className="text-gray-400 text-[10px] block font-mono">{rev.date}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] px-2 py-0.5 rounded-sm font-bold ${
                                  rev.score >= 4 ? 'bg-emerald-50 text-emerald-700' :
                                  rev.score === 3 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                                }`}>
                                  ⭐ {rev.score}.0 {rev.status || ''}
                                </span>
                              </div>
                            </div>
                            <p className="text-slate-650 leading-relaxed font-sans">{rev.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Note block at bottom of panels */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-[11px] text-amber-800 leading-relaxed font-sans">
              <strong>💡 Planning Accuracy Notice:</strong> Hotel details and prices are based on screenshots and manually collected trip-planning data. Recheck price, availability, room policy, and cancellation terms before final booking.
            </div>
          </div>

          {/* Right Sticky Cost Summary Panel (Col 8 to 12) */}
          <div className="lg:col-span-4 bg-slate-100/70 border-t lg:border-t-0 lg:border-l border-slate-200 p-5 sm:p-6 flex flex-col justify-between">
            <div className="space-y-5">
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
                Split Billing Summary
              </h3>

              <div className="bg-white rounded-2xl p-4.5 border border-slate-200 space-y-4">
                <div className="flex items-center gap-3 bg-[#006CE4]/5 p-3 rounded-xl border border-[#006CE4]/10">
                  <Users className="w-4 h-4 text-[#006CE4]" />
                  <div className="text-xs">
                    <span className="text-slate-450 block">Active travelers:</span>
                    <strong className="text-slate-800">{groupSize} Persons ({currentCosts.roomCount} Rooms)</strong>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs border-b border-dashed border-slate-200 pb-3 font-mono text-slate-600">
                  <div className="flex justify-between">
                    <span>Net per room night:</span>
                    <strong className="text-slate-800 font-bold">{formatBDT(currentCosts.finalPerRoomCost)}</strong>
                  </div>
                  <div className="flex justify-between text-indigo-600 font-sans font-bold">
                    <span>Rooms needed:</span>
                    <span>× {currentCosts.roomCount} Rooms</span>
                  </div>
                  <div className="flex justify-between font-sans pt-1 border-t border-slate-100 font-bold">
                    <span className="text-slate-700">Hotel Accommodation Total:</span>
                    <strong className="text-slate-900 font-mono font-black">{formatBDT(currentCosts.hotelTotal)}</strong>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs pb-1 font-mono text-slate-600">
                  <div className="flex justify-between">
                    <span>Bus counter ticket:</span>
                    <strong className="text-slate-800 font-bold">{formatBDT(oneWayBusFare * 2)} RT</strong>
                  </div>
                  <div className="flex justify-between text-[#006CE4] font-sans font-bold">
                    <span>Group seats required:</span>
                    <span>× {groupSize} Persons</span>
                  </div>
                  <div className="flex justify-between font-sans pt-1 border-t border-slate-100 font-bold">
                    <span className="text-slate-700">Bus Transport Total:</span>
                    <strong className="text-[#006CE4] font-mono font-black">{formatBDT(currentCosts.busTotal)}</strong>
                  </div>
                </div>

                {/* Grand totals display inside card container */}
                <div className="bg-gradient-to-br from-[#003B95] to-slate-900 text-white p-4 rounded-xl space-y-1 shadow-xs font-mono">
                  <span className="text-[9px] uppercase tracking-widest text-slate-300 font-sans block">
                    Squad Grand Total Budget
                  </span>
                  <div className="text-2xl font-black text-amber-300">
                    {formatBDT(currentCosts.fullTripTotal)}
                  </div>
                  <div className="pt-2 mt-1.5 border-t border-white/10 flex justify-between items-baseline text-xs font-sans">
                    <span className="text-slate-200">Per person share:</span>
                    <strong className="text-lg font-black text-emerald-400 font-mono">
                      {formatBDT(currentCosts.individualCost)}
                    </strong>
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-800/40 rounded-2xl p-4 space-y-3 shadow-xxs">
                  <div className="flex items-center justify-between">
                    <span className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      Hotel Booked
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold font-sans">
                      Confirmed
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-650 dark:text-slate-300 leading-normal font-sans">
                    Booking details are available in the attached invoice and voucher.
                  </p>
                  
                  <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase text-[#006CE4] dark:text-sky-400 tracking-wider block font-sans">
                      Booking Documents
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveDoc(hotelBookingDocuments[0])}
                        className="py-1.5 px-2 bg-white dark:bg-[#1A263F] border border-[#006CE4]/30 dark:border-slate-800 hover:bg-[#003B95]/10 text-[#006CE4] dark:text-sky-400 text-[10.5px] font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span>View Invoice</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveDoc(hotelBookingDocuments[1])}
                        className="py-1.5 px-2 bg-white dark:bg-[#1A263F] border border-[#006CE4]/30 dark:border-slate-800 hover:bg-[#003B95]/10 text-[#003B95] dark:text-indigo-400 text-[10.5px] font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span>View Voucher</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions for select/compare inside detail view */}
            <div className="space-y-3.5 pt-6 lg:pt-0">
              <button
                type="button"
                onClick={() => {
                  onSelect();
                  onClose();
                }}
                className={`w-full py-3 rounded-2xl text-sm font-black tracking-wide transition transform hover:-translate-y-0.5 active:translate-y-0 shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-slate-300 text-slate-700 pointer-events-none'
                    : 'bg-[#003B95] hover:bg-[#002B75] text-white'
                }`}
              >
                {isSelected ? (
                  <>
                    <CheckCircle2 className="w-4.5 h-4.5" />
                    <span>Selected Stay Option</span>
                  </>
                ) : (
                  <span>Select This Stay Option</span>
                )}
              </button>

              <button
                type="button"
                onClick={onToggleCompare}
                className={`w-full py-2.5 rounded-2xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  isCompared
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isCompared ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added to Compare list</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-amber-500 stroke-[3]" />
                    <span>Compare with other hotels</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
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
