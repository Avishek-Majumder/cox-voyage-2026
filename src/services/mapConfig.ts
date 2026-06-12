export interface MapCoordinate {
  lat: number;
  lng: number;
}

export interface MapMarker {
  id: string;
  name: string;
  label: string;
  position: MapCoordinate;
  description: string;
}

export const COORDINATES = {
  dhaka: { lat: 23.8103, lng: 90.4125 },
  panthapath: { lat: 23.7515, lng: 90.3867 },
  coxsBazar: { lat: 21.4272, lng: 92.0058 },
  hotelGrandPacific: { lat: 21.4145, lng: 91.9860 }
};

export const INSTANT_MARKERS: MapMarker[] = [
  {
    id: 'dhaka',
    name: 'Dhaka',
    label: 'Dhaka',
    position: COORDINATES.dhaka,
    description: 'Capital city and journey region reference.'
  },
  {
    id: 'panthapath',
    name: 'Panthapath Boarding Point',
    label: 'Boarding: Panthapath',
    position: COORDINATES.panthapath,
    description: 'Shohagh Poribohon departure terminal. Reporting at 10:25 PM, departs 10:45 PM.'
  },
  {
    id: 'coxsBazar',
    name: 'Cox’s Bazar Terminal',
    label: 'Cox’s Bazar',
    position: COORDINATES.coxsBazar,
    description: 'Arrival zone at Cox’s Bazar.'
  },
  {
    id: 'hotelGrandPacific',
    name: 'Hotel Grand Pacific',
    label: 'Hotel: Grand Pacific',
    position: COORDINATES.hotelGrandPacific,
    description: 'Our designated stay at Cox’s Bazar. Dual Occupancy Deluxe rooms booked!'
  }
];

export const GOOGLE_MAPS_EXTERNAL_URL = "https://www.google.com/maps/dir/?api=1&origin=Panthapath,Dhaka,Bangladesh&destination=Hotel%20Grand%20Pacific,Cox%27s%20Bazar,Bangladesh&travelmode=driving";
