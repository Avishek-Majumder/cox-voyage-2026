export interface HotelBookingDocument {
  id: string;
  title: string;
  type: string;
  status: string;
  fileId: string;
  viewUrl: string;
  embedUrl: string;
  description: string;
}

export const hotelBookingDocuments: HotelBookingDocument[] = [
  {
    id: "hotel-invoice-2026",
    title: "Hotel Invoice",
    type: "invoice",
    status: "available",
    fileId: "1PGGSDDy8vvibL1T1Nqs8-PcdZP8PI-42",
    viewUrl: "https://drive.google.com/file/d/1PGGSDDy8vvibL1T1Nqs8-PcdZP8PI-42/view?usp=sharing",
    embedUrl: "https://drive.google.com/file/d/1PGGSDDy8vvibL1T1Nqs8-PcdZP8PI-42/preview",
    description: "Hotel booking invoice for Cox Voyage 2026."
  },
  {
    id: "hotel-voucher-2026",
    title: "Hotel Voucher",
    type: "voucher",
    status: "available",
    fileId: "1VUC5qSkCs91bdY7bWCwGzU1sdE3hljiI",
    viewUrl: "https://drive.google.com/file/d/1VUC5qSkCs91bdY7bWCwGzU1sdE3hljiI/view?usp=drive_link",
    embedUrl: "https://drive.google.com/file/d/1VUC5qSkCs91bdY7bWCwGzU1sdE3hljiI/preview",
    description: "Hotel booking voucher for Cox Voyage 2026."
  }
];

export interface BusTicketDocument {
  id: string;
  title: string;
  type: string;
  status: string;
  route: string;
  fileId: string;
  viewUrl: string;
  embedUrl: string;
}

export const busTicketDocuments: BusTicketDocument[] = [
  {
    id: "bus-ticket-dhaka-to-cox-2026-06-18",
    title: "Departure from Dhaka and Arrival in Cox’s Bazar",
    type: "bus-ticket",
    status: "booked",
    route: "Dhaka → Cox’s Bazar",
    fileId: "1qZGZPEVow_X6-v9I6k7O1r0WGLyPRy50",
    viewUrl: "https://drive.google.com/file/d/1qZGZPEVow_X6-v9I6k7O1r0WGLyPRy50/view?usp=sharing",
    embedUrl: "https://drive.google.com/file/d/1qZGZPEVow_X6-v9I6k7O1r0WGLyPRy50/preview"
  },
  {
    id: "bus-ticket-cox-to-dhaka-2026-06-21",
    title: "Departure from Cox’s Bazar and Arrival in Dhaka",
    type: "bus-ticket",
    status: "booked",
    route: "Cox’s Bazar → Dhaka",
    fileId: "1MbOLlBA9LSMUUIThCl0XHJxn7Cgnt5Zx",
    viewUrl: "https://drive.google.com/file/d/1MbOLlBA9LSMUUIThCl0XHJxn7Cgnt5Zx/view?usp=sharing",
    embedUrl: "https://drive.google.com/file/d/1MbOLlBA9LSMUUIThCl0XHJxn7Cgnt5Zx/preview"
  }
];
