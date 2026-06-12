export interface HotelDetails {
  id: string;
  hotelName: string;
  roomName: string;
  starRating: string;
  address: string;
  reviewSummary: {
    text: string;
    count: number | string;
    score: number;
    locationScore?: number;
    comfortScore?: number;
    cleanlinessScore?: number;
    facilitiesScore?: number;
    valueScore?: number;
    staffScore?: number;
  };
  nearby: string[];
  tags: string[];
  description: string;
  roomDetails: {
    roomType?: string;
    occupancy?: string;
    adultOccupancy?: number;
    childOccupancy?: number;
    extraBed?: number;
    maxGuests?: number;
    typeDetail?: string;
    smokingAllowed?: boolean;
    characteristics?: string;
    size?: string;
    view?: string;
  };
  roomFacilities: {
    others: string[];
    bathroom: string[];
    bedroom: string[];
    media: string[];
    food: string[];
  };
  hotelFacilities: {
    business?: string[];
    wellness?: string[];
    food?: string[];
    general?: string[];
    indoor?: string[];
    media?: string[];
    outdoors?: string[];
    parking?: string[];
    safety?: string[];
    services?: string[];
    transport?: string[];
  };
  policies: {
    checkIn: string;
    checkOut: string;
    childPolicy?: string;
    petPolicy?: string;
    houseRules?: string[];
  };
  price: number;
  taxes: number;
  breakfastIncluded: boolean;
  refundable: boolean;
  notes?: string;
  warnings?: string;
  reviews?: {
    author: string;
    date: string;
    score: number;
    status?: string;
    text: string;
  }[];
}

export interface Hotel {
  id: string; // Flat option level unique id (e.g. 'ocean-paradise' or 'grace-cox-smart-opt1')
  hotelGroupId: string; // Links back to parent hotel group (e.g. 'ocean-paradise-group')
  name: string; // The main hotel's name (e.g., 'Ocean Paradise Hotel & Resort')
  roomName: string;
  planType: string;
  breakfast: boolean;
  refundable: boolean;
  basePrice: number;
  taxesAndFees: number;
  notes: string;
  warningForLargeGroup?: boolean;
  category: 'premium' | 'budget' | 'mid-range' | 'balcony';
  tags: string[];
  imageUrl: string;
  galleryImages?: string[];
  details: HotelDetails;
  starRating: string; // 3 Star, 4 Star, 5 Star, "not provided"
  originalPrice?: number;
  discountLabel?: string;
  bedType?: string;
  availabilityNote?: string;
  poolAccess?: 'included' | 'shared' | 'not_available' | 'not_provided';
  poolNote?: string;
}

export type GroupSize = 2 | 3 | 4 | 5 | 6;

export interface Member {
  id: string;
  name: string;
}

export interface FilterOptions {
  breakfastOnly: boolean;      // Breakfast Included
  roomOnly: boolean;           // Room Only
  balconyOnly: boolean;         // Balcony
  seaViewOnly: boolean;         // Sea View
  premiumOnly: boolean;         // Premium
  fourStarOnly: boolean;        // 4 Star
  threeStarOnly: boolean;       // 3 Star
  budgetOnly: boolean;          // Budget
  refundableOnly: boolean;      // Refundable Only
  coupleFriendlyOnly: boolean;  // Couple Friendly
  poolAccessOnly: boolean;      // Pool Access Only
}

export type SortOption =
  | 'cheapest_total'
  | 'lowest_per_person'
  | 'star_rating_desc'
  | 'premium_first'
  | 'breakfast_first'
  | 'best_review_score';

export interface TripCosts {
  basePrice: number;
  taxesAndFees: number;
  bkashDiscount: number;
  finalPerRoomCost: number;
  roomCount: number;
  hotelTotal: number;
  busTotal: number;
  fullTripTotal: number;
  individualCost: number;
}
