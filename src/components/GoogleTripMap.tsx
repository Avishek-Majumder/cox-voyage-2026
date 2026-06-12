import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { MapPin, ExternalLink, Compass, Car, Clock, ShieldCheck, CheckCircle2, ChevronRight, AlertTriangle, RefreshCw } from 'lucide-react';
import { COORDINATES, INSTANT_MARKERS, MapMarker } from '../services/mapConfig';
import CopyButton from './CopyButton';

const API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || (process.env.GOOGLE_MAPS_PLATFORM_KEY as string) || '';
const hasInitialValidKey = Boolean(API_KEY) && API_KEY.trim() !== '' && API_KEY !== 'YOUR_API_KEY';

// External URLs for Google Maps navigation
const OUTBOUND_URL = "https://www.google.com/maps/dir/?api=1&origin=Panthapath,Dhaka,Bangladesh&destination=Hotel%20Grand%20Pacific,Cox%27s%20Bazar,Bangladesh&travelmode=driving";
const RETURN_URL = "https://www.google.com/maps/dir/?api=1&origin=Kolatoli,Cox%27s%20Bazar,Bangladesh&destination=Dhaka,Bangladesh&travelmode=driving";

// Interactive Route display helper
function RouteDisplay({
  origin,
  destination,
  isReturn
}: {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
  isReturn: boolean;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!map) return;

    // Draw backup manual route first in case directions service fails/is restricted
    const fallbackPath = isReturn ? [
      destination, // Cox
      { lat: 22.3569, lng: 91.7832 }, // Chittagong
      { lat: 23.4607, lng: 91.1809 }, // Comilla
      origin // Dhaka
    ] : [
      origin, // Dhaka
      { lat: 23.4607, lng: 91.1809 }, // Comilla
      { lat: 22.3569, lng: 91.7832 }, // Chittagong
      destination // Cox
    ];

    const fallbackPolyline = new google.maps.Polyline({
      path: fallbackPath,
      strokeColor: isReturn ? '#E11D48' : '#006CE4',
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map: map
    });

    polylinesRef.current.push(fallbackPolyline);

    if (!routesLib) {
      return () => {
        polylinesRef.current.forEach(p => p.setMap(null));
        polylinesRef.current = [];
      };
    }

    // Try computing driving routes dynamically if API behaves
    routesLib.Route.computeRoutes({
      origin: origin,
      destination: destination,
      travelMode: 'DRIVING' as any,
      fields: ['path', 'viewport'],
    })
      .then(({ routes }) => {
        if (routes?.[0]) {
          fallbackPolyline.setMap(null);
          const newPolylines = routes[0].createPolylines();
          newPolylines.forEach(p => p.setMap(map));
          polylinesRef.current = newPolylines;

          if (routes[0].viewport) {
            map.fitBounds(routes[0].viewport);
          }
        }
      })
      .catch((err) => {
        console.warn('Real driving route computation failed (possibly due to API key restrictions). Kept standard map polyline.', err);
      });

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [routesLib, map, origin, destination, isReturn]);

  return null;
}

// Custom interactive SVG route vector for high loyalty backup view
interface MilestoneNode {
  name: string;
  sub: string;
  distance: string;
  timeLabel: string;
  color: string;
  description: string;
}

const OUTBOUND_MILESTONES: MilestoneNode[] = [
  { name: 'Dhaka', sub: 'Panthapath', distance: '0 km', timeLabel: '10:45 PM Outbound', color: 'bg-emerald-500', description: 'Shohagh counter boarding at Panthapath. Departure scheduled at 10:45 PM on June 18.' },
  { name: 'Comilla Bypass', sub: 'Highway Hub', distance: '98 km', timeLabel: '01:30 AM Break', color: 'bg-amber-500', description: 'Brief highway break at Comilla washroom & snacks hub.' },
  { name: 'Chittagong', sub: 'Junction', distance: '242 km', timeLabel: '04:45 AM Transit', color: 'bg-orange-500', description: 'Passing the Chittagong city outer loop/highway terminal.' },
  { name: 'Hotel Grand Pacific', sub: 'Cox’s Bazar Stay', distance: '398 km', timeLabel: '07:30 AM Arrival', color: 'bg-indigo-500', description: 'Arrival at Hotel Grand Pacific, check-in, check-out, and premium resort stay.' }
];

const RETURN_MILESTONES: MilestoneNode[] = [
  { name: 'Hotel Grand Pacific', sub: 'Kolatoli', distance: '0 km', timeLabel: '10:40 AM Reporting', color: 'bg-indigo-500', description: 'Checking out of Hotel Grand Pacific. Report at Kolatoli Counter at 10:40 AM on June 21.' },
  { name: 'Chittagong', sub: 'Junction', distance: '156 km', timeLabel: '02:00 PM Passing', color: 'bg-orange-500', description: 'Passing Chittagong loop back towards Dhaka highway.' },
  { name: 'Comilla Bypass', sub: 'Highway Hub', distance: '300 km', timeLabel: '05:15 PM Break', color: 'bg-amber-500', description: 'Brief pitstop for tea and refreshments at Comilla.' },
  { name: 'Dhaka', sub: 'Arriving Terminal', distance: '398 km', timeLabel: '07:45 PM Arrival', color: 'bg-emerald-500', description: 'Arrival back in Dhaka city safely completing Cox Voyage 2026.' }
];

export default function GoogleTripMap() {
  const [direction, setDirection] = useState<'outbound' | 'return'>('outbound');
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(true);
  const [hasMapError, setHasMapError] = useState(false);
  const [activeMilestoneId, setActiveMilestoneId] = useState<number>(0);
  const [showLiveMap, setShowLiveMap] = useState(false);

  // Focus initially on a center coordinate of Bangladesh
  const mapCenter = { lat: 22.6, lng: 91.2 };

  useEffect(() => {
    // Intercept Google Maps Auth or Billing failures (e.g., BillingNotEnabledMapError)
    const handleAuthFailure = () => {
      console.warn("Google Maps Auth/Billing failure detected (e.g., BillingNotEnabledMapError). Switched to Vector Interactive Tracker.");
      setHasMapError(true);
    };

    (window as any).gm_authFailure = handleAuthFailure;

    // Listen for general load exceptions
    const handleErrorEvent = (event: ErrorEvent) => {
      if (
        event.message?.includes('BillingNotEnabledMapError') ||
        event.message?.includes('google.maps') ||
        event.error?.message?.includes('BillingNotEnabledMapError')
      ) {
        setHasMapError(true);
      }
    };
    window.addEventListener('error', handleErrorEvent);

    return () => {
      window.removeEventListener('error', handleErrorEvent);
      if ((window as any).gm_authFailure === handleAuthFailure) {
        (window as any).gm_authFailure = undefined;
      }
    };
  }, []);

  const activeMilestones = direction === 'outbound' ? OUTBOUND_MILESTONES : RETURN_MILESTONES;
  const currentExternalUrl = direction === 'outbound' ? OUTBOUND_URL : RETURN_URL;

  // Render highly polished interactive vector visualizer if no key or billing error active
  const renderFallbackVectorMap = () => {
    return (
      <div className="bg-white dark:bg-[#0F1A30] rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-150 dark:border-slate-800 transition-colors duration-300" id="route-map">
        
        {/* Header and Route Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-rose-100 dark:border-rose-950/20">
          <div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-rose-500 animate-[spin_4s_linear_infinite]" />
              Voyage Route Planner & Map
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
              Interactive high-fidelity voyage tracker &bull; Both routes confirmed
            </p>
          </div>          {/* Direction toggle switch */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-[#15223F] p-1 rounded-xl self-start md:self-auto">
            <button
              onClick={() => {
                setDirection('outbound');
                setActiveMilestoneId(0);
              }}
              className={`py-1.5 px-3 rounded-lg text-xs font-black transition-all cursor-pointer ${
                direction === 'outbound'
                  ? 'bg-white dark:bg-[#006CE4] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ➡ Dhaka to Cox
            </button>
            <button
              onClick={() => {
                setDirection('return');
                setActiveMilestoneId(0);
              }}
              className={`py-1.5 px-3 rounded-lg text-xs font-black transition-all cursor-pointer ${
                direction === 'return'
                  ? 'bg-[#E11D48] text-white shadow-xs'
                  : 'text-slate-505 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ⬅ Cox to Dhaka
            </button>

            {hasInitialValidKey && (
              <button
                onClick={() => setShowLiveMap(true)}
                className="py-1.5 px-2.5 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition cursor-pointer flex items-center gap-1 border border-indigo-100/10 ml-1"
                id="load-live-map-btn"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Load Live Map</span>
              </button>
            )}
          </div>
        </div>

        {/* Warning Badge explaining fallback status */}
        <div className="bg-amber-500/10 border border-amber-550/25 p-3.5 rounded-2xl text-[11px] text-amber-800 dark:text-amber-450 flex items-start gap-3 mb-5 leading-relaxed font-sans">
          <AlertTriangle className="w-5 h-5 text-amber-550 shrink-0 mt-0.5" />
          <div>
            <strong className="font-extrabold block">Bypass Google Maps Pricing:</strong>
            Using premium offline SVG vector routing tracker. Google billing requirements restricts live map rendering. Press <strong>"Open in Google Maps"</strong> below to load driving step-by-steps on your device interface for free.
          </div>
        </div>

        {/* Dynamic Road Visualizer Main Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Active SVG Vector Canvas */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-[#1A263F]/20 border border-slate-200 dark:border-slate-800 rounded-2.5xl p-6 min-h-[350px] flex flex-col justify-between relative overflow-hidden">
            
            {/* Background elements */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#006CE4_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="relative z-10">
              <span className="text-[9px] uppercase font-bold text-[#006CE4] dark:text-sky-400 font-mono tracking-widest block mb-1">
                Line-Route Simulator
              </span>
              <h3 className="text-base font-black text-slate-800 dark:text-white tracking-snug">
                {direction === 'outbound' ? 'Dhaka to Cox’s Bazar Journey Route (398km)' : 'Cox’s Bazar to Dhaka Return Route (398km)'}
              </h3>
            </div>

            {/* Premium Curved Interactive Roadmap SVG */}
            <div className="my-8 relative px-4 flex items-center justify-center">
              <svg className="w-full max-w-lg h-36" viewBox="0 0 500 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Dashed Route Path */}
                <path 
                  d="M 40 60 Q 150 15, 250 60 T 460 60" 
                  stroke="#CBD5E1" 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                  className="stroke-slate-200 dark:stroke-slate-800"
                />
                
                {/* Active Colored Route Progress Line */}
                <path 
                  d="M 40 60 Q 150 15, 250 60 T 460 60" 
                  stroke={direction === 'outbound' ? '#006CE4' : '#E11D48'} 
                  strokeWidth="4" 
                  className="stroke-animated"
                  strokeDasharray="500"
                  strokeDashoffset={500 - (activeMilestoneId * 166)}
                  style={{ transition: 'stroke-dashoffset 0.8s lg, stroke 0.5s' }}
                />

                {/* Animated Bus Icon or indicator trailing */}
                <circle 
                  cx={40 + (activeMilestoneId * 140)} 
                  cy={activeMilestoneId === 0 ? 60 : activeMilestoneId === 1 ? 40 : activeMilestoneId === 2 ? 60 : 60} 
                  r="8" 
                  fill={direction === 'outbound' ? '#006CE4' : '#E11D48'}
                  className="animate-pulse"
                  style={{ transition: 'cx 0.8s, cy 0.8s' }}
                />

                {/* Clickable SVG stops */}
                {activeMilestones.map((milestone, idx) => {
                  const nodeX = 40 + (idx * 140);
                  // Approximate correct Y height matching the spline path parameters
                  const nodeY = idx === 0 ? 60 : idx === 1 ? 40 : idx === 2 ? 60 : 60;
                  const isActive = activeMilestoneId === idx;

                  return (
                    <g key={idx} className="cursor-pointer group" onClick={() => setActiveMilestoneId(idx)}>
                      <circle 
                        cx={nodeX} 
                        cy={nodeY} 
                        r={isActive ? '14' : '10'} 
                        fill={isActive ? (direction === 'outbound' ? '#006CE4' : '#E11D48') : '#FFF'} 
                        stroke={direction === 'outbound' ? '#006CE4' : '#E11D48'}
                        strokeWidth="3.5"
                        style={{ transition: 'all 0.3s' }}
                      />
                      <text 
                        x={nodeX} 
                        y={nodeY + 28} 
                        textAnchor="middle" 
                        className={`text-[9.5px] font-black pointer-events-none fill-slate-700 dark:fill-slate-300 font-sans ${isActive ? 'font-black scale-105 fill-[#006CE4]' : ''}`}
                      >
                        {milestone.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Quick Milestone Detail Box on click */}
            <div className="bg-white dark:bg-[#15223F] rounded-2xl p-4 border border-slate-200/50 dark:border-slate-800 shadow-xxs">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${activeMilestones[activeMilestoneId].color}`}></span>
                <span className="text-[10px] uppercase font-black text-slate-400 font-mono tracking-wider">
                  Checkpoint {activeMilestoneId + 1} of 4: {activeMilestones[activeMilestoneId].distance}
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-850 dark:text-white mt-1">
                {activeMilestones[activeMilestoneId].name} ({activeMilestones[activeMilestoneId].sub})
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pb-1 leading-relaxed font-sans">
                {activeMilestones[activeMilestoneId].description}
              </p>
              <div className="border-t border-dashed border-slate-100 dark:border-slate-800 pt-2 flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Scheduled Landmark Interval:</span>
                <strong className="text-slate-700 dark:text-slate-200 font-bold font-mono">
                  {activeMilestones[activeMilestoneId].timeLabel}
                </strong>
              </div>
            </div>

          </div>

          {/* Right Info Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              
              {/* Detailed schedule box */}
              <div className="bg-slate-50 dark:bg-[#1A263F]/40 border border-slate-150 dark:border-slate-800 p-5 rounded-2.5xl text-xs space-y-4 shadow-xxs">
                <h4 className="font-extrabold text-slate-800 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-155 dark:border-slate-800/80">
                  <Car className="w-4 h-4 text-[#006CE4]" />
                  Ride Logistics ({direction === 'outbound' ? 'Outbound' : 'Return'})
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-baseline border-b border-dashed border-slate-205 dark:border-slate-800/85 pb-2">
                    <span className="text-slate-500">Route Direction:</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-bold">
                      {direction === 'outbound' ? 'Dhaka ➔ Cox’s Bazar' : 'Cox’s Bazar ➔ Dhaka'}
                    </strong>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-dashed border-slate-205 dark:border-slate-800/85 pb-2">
                    <span className="text-slate-500">Scheduled Date:</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-bold font-sans">
                      {direction === 'outbound' ? '18 Jun 2026 (Thursday)' : '21 Jun 2026 (Sunday)'}
                    </strong>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-dashed border-slate-205 dark:border-slate-800/85 pb-2">
                    <span className="text-slate-500">Boarding Location:</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-bold">
                      {direction === 'outbound' ? 'Panthapath Counter, Dhaka' : 'Kolatoli Counter, Cox’s Bazar'}
                    </strong>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-dashed border-slate-205 dark:border-slate-800/85 pb-2">
                    <span className="text-slate-505">Depart / Report:</span>
                    <strong className="text-slate-800 dark:text-slate-100 font-mono">
                      {direction === 'outbound' ? '10:25 PM / 10:45 PM' : '10:40 AM / 11:00 AM'}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-555">Transit Seats:</span>
                    <strong className="text-[13px] font-mono tracking-wider font-black px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-md border border-emerald-100/10">
                      {direction === 'outbound' ? 'C2, C3, D2, D3' : 'E2, E3, F2, F3'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Status checklist badge */}
              <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 p-4 rounded-2.5xl text-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="font-sans">
                  <strong className="font-extrabold text-emerald-700 dark:text-emerald-400 block mb-0.5">Booking Fully Fully Booked</strong>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                    This ticket is finalized and paid for. Check-in is fully cleared on BOTH sectors. Present the PDF ticket in the tickets section to board.
                  </p>
                </div>
              </div>

            </div>

            {/* Launch buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <a
                href={currentExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-3.5 px-4 rounded-xl bg-[#006CE4] hover:bg-[#0051BE] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition active:scale-97 cursor-pointer shadow-xs border border-[#003B95] leading-none"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in Google Maps</span>
              </a>
              <CopyButton
                value={currentExternalUrl}
                label="Copy View URL"
                className="py-3.5 px-4 text-xs shadow-xxs font-bold"
              />
            </div>

          </div>

        </div>

      </div>
    );
  };

  // If map load failed due to BillingNotEnabledMapError or any auth exception, or showLiveMap is false, render the custom vector mapping fall-back
  if (hasMapError || !hasInitialValidKey || !showLiveMap) {
    return renderFallbackVectorMap();
  }

  const outboundOrigin = COORDINATES.panthapath;
  const outboundDestination = COORDINATES.hotelGrandPacific;

  return (
    <div className="bg-white dark:bg-[#0F1A30] rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-150 dark:border-slate-800 mb-8" id="route-map">
      
      {/* Title Header with interactive Direction Switching Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2 font-sans tracking-tight">
            <Compass className="w-5 h-5 text-[#006CE4]" />
            Route Map 🗺️
          </h2>
          <p className="text-slate-505 dark:text-slate-400 text-xs mt-0.5 font-sans">
            Dhaka to Cox’s Bazar route &bull; Both Outbound and Return sections
          </p>
        </div>

        {/* Direction Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-[#15223F] p-1 rounded-xl">
          <button
            onClick={() => setDirection('outbound')}
            className={`py-1.5 px-3 rounded-lg text-xs font-black transition cursor-pointer ${
              direction === 'outbound'
                ? 'bg-white dark:bg-[#006CE4] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Outbound: Dhaka ➔ Cox
          </button>
          <button
            onClick={() => setDirection('return')}
            className={`py-1.5 px-3 rounded-lg text-xs font-black transition cursor-pointer ${
              direction === 'return'
                ? 'bg-[#E11D48] text-white shadow-xs'
                : 'text-slate-505 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Return: Cox ➔ Dhaka
          </button>

          <button
            onClick={() => setShowLiveMap(false)}
            className="py-1.5 px-2.5 rounded-lg text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition cursor-pointer flex items-center gap-1 border border-rose-100/10 ml-1"
          >
            <span>Show Vector Roadmap</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Real Live Google Map Frame */}
        <div 
          className="lg:col-span-7 relative bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2.5xl overflow-hidden shadow-xs h-80 sm:h-96 lg:h-[480px]"
        >
          <APIProvider apiKey={API_KEY} version="weekly">
            <Map
              defaultZoom={7.3}
              defaultCenter={mapCenter}
              gestureHandling="cooperative"
              disableDefaultUI={false}
              mapId="cox_voyage_map_2026"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
            >
              {/* Markers */}
              {INSTANT_MARKERS.map((marker) => (
                <AdvancedMarker
                  key={marker.id}
                  position={marker.position}
                  onClick={() => setSelectedMarker(marker)}
                  title={marker.name}
                >
                  <Pin 
                    background={marker.id.includes('hotel') ? '#8E44AD' : marker.id.includes('panthapath') ? '#E67E22' : '#006CE4'} 
                    glyphColor="#FFF" 
                    scale={1.1}
                  />
                </AdvancedMarker>
              ))}

              {/* Dynamic or Static Route Overlay Line */}
              <RouteDisplay
                origin={outboundOrigin}
                destination={outboundDestination}
                isReturn={direction === 'return'}
              />

              {/* Custom Popup for interactive markers */}
              {selectedMarker && (
                <InfoWindow
                  position={selectedMarker.position}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div className="p-2.5 max-w-[240px] text-slate-800 dark:text-slate-950 font-sans">
                    <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-sm inline-block mb-1 text-white leading-none ${
                      selectedMarker.id.includes('hotel') ? 'bg-purple-600' : 'bg-[#006CE4]'
                    }`}>
                      {selectedMarker.label}
                    </span>
                    <h4 className="font-extrabold text-xs leading-snug">{selectedMarker.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-normal">{selectedMarker.description}</p>
                    <div className="mt-2 text-right">
                      <a
                        href={currentExternalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[9px] text-[#006CE4] font-bold hover:underline"
                      >
                        <span>Open Directions</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        </div>

        {/* Right Sidebar: Driving Route Information & Details */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-[#1A263F]/40 border border-slate-150 dark:border-slate-800 p-5 rounded-2xl text-xs space-y-4 shadow-xxs">
              <h4 className="font-extrabold text-slate-850 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-155 dark:border-slate-800">
                <Car className="w-4 h-4 text-[#006CE4]" />
                Route Information ({direction === 'outbound' ? 'Outbound' : 'Return'})
              </h4>

              <div className="space-y-2.5">
                <div className="flex justify-between items-baseline border-b border-dashed border-slate-205 dark:border-slate-800/80 pb-2">
                  <span className="text-slate-505 dark:text-slate-400 font-medium">Voyage Course:</span>
                  <strong className="text-slate-808 dark:text-slate-100 font-bold text-right pl-2">
                    {direction === 'outbound' 
                      ? 'Dhaka (Panthapath) → Cox’s Bazar (Kolatoli)' 
                      : 'Kolatoli (Cox’s Bazar) → Dhaka'
                    }
                  </strong>
                </div>

                <div className="flex justify-between items-baseline border-b border-dashed border-slate-205 dark:border-slate-800/80 pb-2">
                  <span className="text-slate-505 dark:text-slate-400 font-medium">Carrier Bus Type:</span>
                  <strong className="text-slate-808 dark:text-slate-100 font-bold">Shohagh Poribohon Scania VIP</strong>
                </div>

                <div className="flex justify-between items-baseline border-b border-dashed border-slate-205 dark:border-slate-800/80 pb-2">
                  <span className="text-slate-505 dark:text-slate-400 font-medium">Reporting Location:</span>
                  <strong className="text-slate-850 dark:text-slate-100 font-bold">
                    {direction === 'outbound' ? 'Panthapath Counter, Dhaka' : 'Kolatoli Counter, Cox’s Bazar'}
                  </strong>
                </div>

                <div className="flex justify-between items-baseline border-b border-dashed border-slate-205 dark:border-slate-800/80 pb-2">
                  <span className="text-slate-505 dark:text-slate-400 font-medium">Reporting & Departure:</span>
                  <strong className="text-slate-850 dark:text-slate-100 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {direction === 'outbound' ? '10:25 PM / 10:45 PM' : '10:40 AM / 11:00 AM'}
                  </strong>
                </div>

                <div className="flex justify-between items-baseline border-b border-dashed border-slate-205 dark:border-slate-800/80 pb-2">
                  <span className="text-slate-505 dark:text-slate-400 font-medium font-sans">Travel Distance:</span>
                  <strong className="text-slate-808 dark:text-slate-100 font-bold">~ 398 km (Approx 8 hours)</strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-505 dark:text-slate-400 font-medium font-sans">Seats Reserved:</span>
                  <strong className="text-slate-805 dark:text-slate-100 font-mono text-[13px] tracking-wide font-black px-2 py-0.5 bg-sky-50 dark:bg-sky-950/30 border border-sky-100/30 text-[#006CE4] dark:text-sky-400 rounded-md">
                    {direction === 'outbound' ? 'C2, C3, D2, D3' : 'E2, E3, F2, F3'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Quick Trip Advice Badge */}
            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 p-4 rounded-2xl text-[11.5px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-450 shrink-0 mt-0.5" />
              <div>
                <strong className="font-extrabold block">Confirmed Premium Voyage:</strong>
                <p className="mt-0.5 leading-relaxed text-slate-600 dark:text-slate-400 text-xs">
                  {direction === 'outbound' 
                    ? 'All 4 seats are fully booked on Shohagh Poribohon. Reporting is strictly at 10:25 PM on June 18.'
                    : 'Report at Kolatoli by 10:40 AM on June 21 for departure at 11:00 AM. Boarding tickets ready.'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href={currentExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-grow text-center py-3.5 px-4 rounded-xl bg-[#006CE4] hover:bg-[#0051BE] text-white font-extrabold text-[12.5px] flex items-center justify-center gap-2 transition active:scale-97 cursor-pointer shadow-xs border border-[#003B95] leading-none"
            >
              <ExternalLink className="w-4.5 h-4.5" />
              <span>Open Directions in Maps</span>
            </a>
            <CopyButton
              value={currentExternalUrl}
              label="Copy Link"
              className="py-3.5 px-4 text-xs shadow-sm font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
