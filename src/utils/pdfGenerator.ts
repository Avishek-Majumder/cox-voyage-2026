import { jsPDF } from 'jspdf';
import { Hotel, Member, TripCosts } from '../types';

export function generateTripPDF(
  hotel: Hotel,
  groupSize: number,
  members: Member[],
  oneWayBusFare: number,
  costs: TripCosts,
  currency: 'BDT' | 'USD',
  formatPriceFn: (amt: number) => string
) {
  const doc = new jsPDF();
  
  // Custom theme colors
  const primaryBg = [0, 108, 228]; // Cox Voyage Blue
  const secondaryBg = [0, 59, 149]; // Deep Indigo
  const textDark = [33, 43, 54];
  const textMuted = [110, 120, 130];
  const borderLight = [220, 227, 234];
  
  // Draw primary header background banner
  doc.setFillColor(primaryBg[0], primaryBg[1], primaryBg[2]);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Header title text
  doc.setTextColor(255, 255, 255);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.text("Cox Voyage 2026 Planner", 15, 18);
  
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(11);
  doc.text("SQUAD ITINERARY & BUDGET BREAKDOWN • COX'S BAZAR 2026", 15, 28);
  
  // Current Date
  const dateStr = new Date().toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
  doc.setFontSize(9);
  doc.text(`Generated: ${dateStr}`, 160, 14);
  
  // Let's draw sections:
  let y = 50;
  
  // SECTION 1: EXEC SUMMARY
  doc.setTextColor(primaryBg[0], primaryBg[1], primaryBg[2]);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text("1. Trip Overview & Parameters", 15, y);
  y += 6;
  
  // Parameters table
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.line(15, y, 195, y);
  y += 6;
  
  doc.setFontSize(10);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  
  const drawRow = (label1: string, val1: string, label2: string, val2: string) => {
    doc.setFont('Helvetica', 'bold');
    doc.text(label1, 15, y);
    doc.setFont('Helvetica', 'normal');
    doc.text(val1, 55, y);
    
    doc.setFont('Helvetica', 'bold');
    doc.text(label2, 110, y);
    doc.setFont('Helvetica', 'normal');
    doc.text(val2, 150, y);
    
    y += 8;
  };
  
  drawRow("Chosen Stay:", hotel.name, "Squad Members:", `${groupSize} Persons`);
  drawRow("Selected Room:", hotel.roomName.substring(0, 36) + (hotel.roomName.length > 36 ? "..." : ""), "Required Rooms:", `${costs.roomCount} Double Rooms`);
  drawRow("Breakfast Status:", hotel.breakfast ? "Included Free" : "Room Only", "Refundability:", hotel.refundable ? "Refundable Booking" : "Non-Refundable");
  drawRow("Est. Bus Fare:", formatPriceFn(oneWayBusFare * 2) + " RT / seat", "Currency Shown:", currency);
  
  y += 4;
  
  // SECTION 2: BUDGET CALCULATIONS
  doc.setTextColor(primaryBg[0], primaryBg[1], primaryBg[2]);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text("2. Cost Calculations & Billing Splits", 15, y);
  y += 6;
  
  doc.line(15, y, 195, y);
  y += 6;
  
  const drawLineItem = (label: string, value: string, isBold: boolean = false) => {
    if (isBold) {
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(secondaryBg[0], secondaryBg[1], secondaryBg[2]);
    } else {
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    }
    doc.setFontSize(10);
    doc.text(label, 15, y);
    doc.text(value, 150, y, { align: 'right' });
    y += 7;
  };
  
  drawLineItem("Hotel Base Cost (per room night default):", formatPriceFn(costs.basePrice));
  drawLineItem("Hotel Taxes & Surcharges (VAT + Service fee):", `+ ${formatPriceFn(costs.taxesAndFees)}`);
  drawLineItem("Exclusive promotion bKash 3% Cash Discount:", `- ${formatPriceFn(costs.bkashDiscount)}`);
  doc.line(15, y-2, 195, y-2);
  drawLineItem("Final Per Room Night Cost:", formatPriceFn(costs.finalPerRoomCost), true);
  
  y += 3;
  drawLineItem(`Collective Room Bills (${costs.roomCount} Rooms):`, formatPriceFn(costs.hotelTotal));
  drawLineItem(`Collective Bus Fares (${groupSize} Persons Roundtrip Seats):`, formatPriceFn(costs.busTotal));
  doc.line(15, y-2, 195, y-2);
  drawLineItem("Squad Voyage Grand Total Budget:", formatPriceFn(costs.fullTripTotal), true);
  
  // Large visual individual cost highlights box
  y += 4;
  doc.setFillColor(244, 247, 250);
  doc.rect(15, y, 180, 20, 'F');
  doc.setDrawColor(primaryBg[0], primaryBg[1], primaryBg[2]);
  doc.rect(15, y, 180, 20, 'S');
  
  doc.setTextColor(primaryBg[0], primaryBg[1], primaryBg[2]);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.text("INDIVIDUAL MEMBERS DEBT SHARE:", 22, y + 12);
  
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(secondaryBg[0], secondaryBg[1], secondaryBg[2]);
  doc.text(`${formatPriceFn(costs.individualCost)} / per person`, 112, y + 13);
  
  // Let's add a page break to look extremely neat and spacious for Section 3 and Section 4
  doc.addPage();
  
  // Re-draw small header on page 2
  doc.setFillColor(primaryBg[0], primaryBg[1], primaryBg[2]);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.text("Cox Voyage 2026 • Squad Itinerary Continued", 15, 12);
  
  y = 32;
  
  // SECTION 3: MEMBERWISE SPLITS
  doc.setTextColor(primaryBg[0], primaryBg[1], primaryBg[2]);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text("3. Detailed Member Billing Matrix", 15, y);
  y += 6;
  
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.line(15, y, 195, y);
  y += 6;
  
  doc.setFontSize(9);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text("MEMBER NAME", 15, y);
  doc.text("INVOICE REFERENCE", 60, y);
  doc.text("HOTEL SHARE", 110, y);
  doc.text("BUS SHARE", 145, y);
  doc.text("TOTAL DUE", 180, y, { align: 'right' });
  
  y += 3;
  doc.line(15, y, 195, y);
  y += 5;
  
  doc.setFontSize(10);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  
  members.forEach((m) => {
    doc.setFont('Helvetica', 'bold');
    doc.text(m.name, 15, y);
    doc.setFont('Helvetica', 'normal');
    doc.text(`CX26-${m.id}`, 60, y);
    doc.text(formatPriceFn(Math.round(costs.hotelTotal / groupSize)), 110, y);
    doc.text(formatPriceFn(Math.round(costs.busTotal / groupSize)), 145, y);
    doc.setFont('Helvetica', 'bold');
    doc.text(formatPriceFn(costs.individualCost), 180, y, { align: 'right' });
    
    y += 7;
  });
  
  y += 10;

  // SECTION 4: TICKETS & BOOKING
  doc.setTextColor(primaryBg[0], primaryBg[1], primaryBg[2]);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text("4. Confirmed Tickets & Bus Booking", 15, y);
  y += 6;
  
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.line(15, y, 195, y);
  y += 6;

  doc.setFontSize(10);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  
  const drawTicketRow = (lbl1: string, v1: string, lbl2: string, v2: string) => {
    doc.setFont('Helvetica', 'bold');
    doc.text(lbl1, 15, y);
    doc.setFont('Helvetica', 'normal');
    doc.text(v1, 55, y);
    
    doc.setFont('Helvetica', 'bold');
    doc.text(lbl2, 110, y);
    doc.setFont('Helvetica', 'normal');
    doc.text(v2, 150, y);
    
    y += 8;
  };

  drawTicketRow("Bus Operator:", "Shohagh Poribohon", "Route Direction:", "Dhaka to Cox’s Bazar (One-Way)");
  drawTicketRow("Boarding Point:", "Panthapath Counter", "Reporting Time:", "10:25 PM");
  drawTicketRow("Departure Time:", "10:45 PM", "Confirmed Seats:", "C2, C3, D2, D3");
  drawTicketRow("Total Paid Cost:", `${formatPriceFn(8700)} (Confirmed)`, "Ticket Link:", "View file on Google Drive");
  
  y += 2;
  doc.setTextColor(secondaryBg[0], secondaryBg[1], secondaryBg[2]);
  doc.setFont('Helvetica', 'oblique');
  doc.setFontSize(9);
  doc.text("Secure Ticket PDF Link: https://drive.google.com/file/d/1qZGZPEVow_X6-v9I6k7O1r0WGLyPRy50/view", 15, y);
  y += 10;

  // Hotel Booking Documents Section
  doc.setTextColor(primaryBg[0], primaryBg[1], primaryBg[2]);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.text("Hotel Booking Documents (Confirmed Stay)", 15, y);
  y += 6;

  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.text("• Hotel Invoice Drive Link:", 15, y);
  doc.setTextColor(0, 108, 228);
  doc.text("https://drive.google.com/file/d/1PGGSDDy8vvibL1T1Nqs8-PcdZP8PI-42/view", 58, y);
  y += 5;

  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text("• Hotel Voucher Drive Link:", 15, y);
  doc.setTextColor(0, 108, 228);
  doc.text("https://drive.google.com/file/d/1VUC5qSkCs91bdY7bWCwGzU1sdE3hljiI/view", 58, y);
  y += 12;
  
  // Footer page message
  doc.setFont('Helvetica', 'oblique');
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text("Please settle balances using local payment methods, e.g., bKash or Nagad, by scanning QR codes in the web app.", 15, y);
  y += 4;
  doc.text("Draft plan modeled under active travel criteria. Actual fares are dynamic based on booking window.", 15, y);
  
  // Save document
  doc.save(`Cox_Voyage_Squad_Itinerary_${hotel.id}.pdf`);
}
