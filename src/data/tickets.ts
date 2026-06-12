export interface BusTicket {
  id: string;
  seat: string;
  cost: number;
  status: string;
  assignedTo: string;
}

export interface BusBooking {
  id: string;
  ticketName: string;
  status: string;
  operator: string;
  routeFrom: string;
  routeTo: string;
  routeLabel: string;
  direction: string;
  boardingPoint: string;
  tripDate: string;
  reportingTime: string;
  departureTime: string;
  totalTickets: number;
  totalPaid: number;
  perTicketCost: number;
  ticketFileId: string;
  ticketViewUrl: string;
  ticketEmbedUrl: string;
  seats: BusTicket[];
}

export const busBooking: BusBooking = {
  id: "shohagh-dhaka-cox-oneway-2026-06-18",
  ticketName: "Departure from Dhaka and Arrival in Cox’s Bazar",
  status: "Booked",
  operator: "Shohagh Paribahan",
  routeFrom: "Dhaka",
  routeTo: "Cox’s Bazar",
  routeLabel: "Dhaka → Cox’s Bazar",
  direction: "outbound",
  boardingPoint: "Panthapath",
  tripDate: "18 Jun 2026",
  reportingTime: "10:25 PM",
  departureTime: "10:45 PM",
  totalTickets: 4,
  totalPaid: 8700,
  perTicketCost: 2175,
  ticketFileId: "1qZGZPEVow_X6-v9I6k7O1r0WGLyPRy50",
  ticketViewUrl: "https://drive.google.com/file/d/1qZGZPEVow_X6-v9I6k7O1r0WGLyPRy50/view?usp=sharing",
  ticketEmbedUrl: "https://drive.google.com/file/d/1qZGZPEVow_X6-v9I6k7O1r0WGLyPRy50/preview",
  seats: [
    { id: "ticket-c2", seat: "C2", cost: 2175, status: "Booked", assignedTo: "" },
    { id: "ticket-c3", seat: "C3", cost: 2175, status: "Booked", assignedTo: "" },
    { id: "ticket-d2", seat: "D2", cost: 2175, status: "Booked", assignedTo: "" },
    { id: "ticket-d3", seat: "D3", cost: 2175, status: "Booked", assignedTo: "" }
  ]
};

export const returnBusBooking: BusBooking = {
  id: "shohagh-cox-dhaka-return-2026-06-21",
  ticketName: "Departure from Cox’s Bazar and Arrival in Dhaka",
  status: "Booked",
  operator: "Shohagh Paribahan",
  routeFrom: "Cox’s Bazar",
  routeTo: "Dhaka",
  routeLabel: "Cox’s Bazar → Dhaka",
  direction: "return",
  boardingPoint: "Kolatoli",
  tripDate: "21 Jun 2026",
  reportingTime: "10:40 AM",
  departureTime: "11:00 AM",
  totalTickets: 4,
  totalPaid: 8700,
  perTicketCost: 2175,
  ticketFileId: "1MbOLlBA9LSMUUIThCl0XHJxn7Cgnt5Zx",
  ticketViewUrl: "https://drive.google.com/file/d/1MbOLlBA9LSMUUIThCl0XHJxn7Cgnt5Zx/view?usp=sharing",
  ticketEmbedUrl: "https://drive.google.com/file/d/1MbOLlBA9LSMUUIThCl0XHJxn7Cgnt5Zx/preview",
  seats: [
    { id: "ticket-return-e2", seat: "E2", cost: 2175, status: "Booked", assignedTo: "" },
    { id: "ticket-return-e3", seat: "E3", cost: 2175, status: "Booked", assignedTo: "" },
    { id: "ticket-return-f2", seat: "F2", cost: 2175, status: "Booked", assignedTo: "" },
    { id: "ticket-return-f3", seat: "F3", cost: 2175, status: "Booked", assignedTo: "" }
  ]
};

export const busBookings: BusBooking[] = [busBooking, returnBusBooking];
