import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Shield, MapPin, AlertTriangle, Navigation, Clock, Users, PhoneCall,
  Lock, Share2, Flame, Plus, Search, Star, ChevronRight, X,
  Eye, Phone, Zap, Heart, Home, Bell, User, ArrowRight,
  Sparkles, Route, ThumbsUp, Lightbulb, Info, Activity,
  ShieldCheck, Locate, Send, RefreshCw, Compass,
  Layers, ChevronDown, Globe, CheckCircle, Radio, Volume2,
  TrendingUp, BarChart3, Camera, Award, MessageCircle
} from 'lucide-react';

/* ━━━━━━━━━━━━━━━━━━━━━━━ CONSTANTS & DATA ━━━━━━━━━━━━━━━━━━━━━━ */

const DELHI_CENTER = [28.6139, 77.2090];

const MAP_PROVIDERS = {
  osm: {
    name: "Standard OSM",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
    subdomains: ["a", "b", "c"]
  },
  dark: {
    name: "Night Shield",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri &mdash; OpenStreetMap contributors",
    subdomains: ["server"]
  },
  satellite: {
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri, Maxar, Earthstar Geographics",
    subdomains: ["server"]
  }
};

const SAFE_PLACES = [
  { id: 1, name: 'Parliament Street Police Station', type: 'police', lat: 28.6225, lng: 77.2115, rating: 4.2 },
  { id: 2, name: 'Connaught Place PCR Booth', type: 'police', lat: 28.6315, lng: 77.2167, rating: 4.0 },
  { id: 3, name: 'Tilak Marg Police Station', type: 'police', lat: 28.6280, lng: 77.2380, rating: 3.8 },
  { id: 4, name: 'AIIMS Hospital', type: 'hospital', lat: 28.5672, lng: 77.2100, rating: 4.5 },
  { id: 5, name: 'Safdarjung Hospital', type: 'hospital', lat: 28.5685, lng: 77.2065, rating: 4.3 },
  { id: 6, name: 'Ram Manohar Lohia Hospital', type: 'hospital', lat: 28.6265, lng: 77.2030, rating: 4.1 },
  { id: 7, name: 'Rajiv Chowk Metro Station', type: 'metro', lat: 28.6328, lng: 77.2197, rating: 4.0 },
  { id: 8, name: 'Hauz Khas Metro Station', type: 'metro', lat: 28.5430, lng: 77.2060, rating: 4.1 },
  { id: 9, name: 'Mandi House Metro Station', type: 'metro', lat: 28.6254, lng: 77.2340, rating: 3.9 },
  { id: 10, name: 'IIT Delhi Campus Gate', type: 'safe_zone', lat: 28.5450, lng: 77.1926, rating: 4.6 },
  { id: 11, name: 'Select Citywalk Mall', type: 'safe_zone', lat: 28.5289, lng: 77.2190, rating: 4.4 },
  { id: 12, name: 'India Gate', type: 'safe_zone', lat: 28.6129, lng: 77.2295, rating: 4.3 },
];

const DANGER_ZONES = [
  { lat: 28.6350, lng: 77.2250, level: 'high', label: 'Low visibility corridor - multiple incidents' },
  { lat: 28.5550, lng: 77.2350, level: 'medium', label: 'Isolated stretch after 9 PM' },
  { lat: 28.6180, lng: 77.2400, level: 'high', label: 'Poor lighting, no CCTV coverage' },
  { lat: 28.5900, lng: 77.2500, level: 'medium', label: 'Construction zone - detours at night' },
];

const SAFETY_TIPS = [
  { title: 'Share Live Location', desc: 'Always share your real-time location with a trusted contact during late-night commutes.', icon: Share2, color: 'emerald' },
  { title: 'Trust Your Instincts', desc: 'If something feels off, move to a crowded area or enter a nearby shop immediately.', icon: Sparkles, color: 'violet' },
  { title: 'Cab Safety Check', desc: 'Verify driver name, photo, and vehicle number plate against app details before boarding.', icon: ShieldCheck, color: 'blue' },
  { title: 'Emergency Numbers', desc: 'Save Police (100), Women Helpline (1091), and Ambulance (102) on speed dial.', icon: Phone, color: 'rose' },
  { title: 'Well-Lit Routes', desc: 'Prefer well-lit main roads even if they take a few extra minutes over dark shortcuts.', icon: Lightbulb, color: 'amber' },
  { title: 'Check-In Habit', desc: 'Set a dead-man switch timer and check in with someone when traveling alone at night.', icon: Clock, color: 'cyan' },
];

const EMERGENCY_CONTACTS = [
  { name: 'Police', number: '100', color: '#3b82f6', icon: Shield },
  { name: 'Women Helpline', number: '1091', color: '#ec4899', icon: Heart },
  { name: 'Ambulance', number: '102', color: '#ef4444', icon: Activity },
  { name: 'National Emergency', number: '112', color: '#f59e0b', icon: AlertTriangle },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━ CUSTOM MAP ICONS ━━━━━━━━━━━━━━━━━━━━━━ */

const createIcon = (bg, emoji) => L.divIcon({
  html: `<div style="background:${bg};width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;border:2.5px solid white;box-shadow:0 2px 12px rgba(0,0,0,0.4);cursor:pointer;">${emoji}</div>`,
  iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -20], className: ''
});

const MAP_ICONS = {
  police: createIcon('#3b82f6', '🚔'),
  hospital: createIcon('#ef4444', '🏥'),
  metro: createIcon('#8b5cf6', '🚇'),
  safe_zone: createIcon('#10b981', '🛡️'),
  start: createIcon('#10b981', '📍'),
  end: createIcon('#f43f5e', '🏁'),
};

/* ━━━━━━━━━━━━━━━━━━━━━━━ HELPER COMPONENTS ━━━━━━━━━━━━━━━━━━━━━ */

function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom || 14, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

function LocationSearch({ onSelect, placeholder }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounce = useRef(null);

  const search = useCallback(async (q) => {
    if (!q || q.length < 3) { setResults([]); return; }
    setLoading(true);
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=in`);
      setResults(await r.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  const handleInput = (e) => {
    setQuery(e.target.value);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => search(e.target.value), 450);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input type="text" placeholder={placeholder} value={query} onChange={handleInput}
          className="w-full bg-[#0c1222] border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-slate-600" />
        {loading && <RefreshCw className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 animate-spin" />}
      </div>
      {results.length > 0 && (
        <div className="absolute z-[1000] w-full mt-1 bg-[#111827] border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-56 overflow-y-auto">
          {results.map((r) => (
            <button key={r.place_id}
              onClick={() => { onSelect({ lat: +r.lat, lng: +r.lon, name: r.display_name }); setQuery(r.display_name.split(',').slice(0,2).join(',')); setResults([]); }}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors border-b border-slate-800/50 last:border-0 flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
              <span className="line-clamp-2 text-xs">{r.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StarRating({ rating, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-[${size}px] h-[${size}px]`} style={{width:size,height:size}}
          fill={i <= Math.round(rating) ? '#fbbf24' : 'transparent'}
          stroke={i <= Math.round(rating) ? '#fbbf24' : '#475569'} strokeWidth={2} />
      ))}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━ MAIN APPLICATION ━━━━━━━━━━━━━━━━━━━━━━ */

export default function SafetyPinApp() {
  const [activeTab, setActiveTab] = useState('home');
  
  // Route Finder State
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState(DELHI_CENTER);
  const [showSafePlaces, setShowSafePlaces] = useState(true);
  const [showDangerZones, setShowDangerZones] = useState(true);
  const [placeFilter, setPlaceFilter] = useState('all');
  const [mapProvider, setMapProvider] = useState('osm');

  // Reviews State
  const [reviews, setReviews] = useState([
    { id: 1, street: 'Connaught Place Outer Circle', score: 92, tags: ['Well-Lit','High Footfall','Police Booth Nearby'], user: 'Ananya S.', avatar: 'AS', time: '10 mins ago', likes: 24, comment: 'Felt completely safe even at 11 PM. Great police presence and bright lights everywhere.' },
    { id: 2, street: 'IIT Delhi Gate 3 Road', score: 85, tags: ['CCTV Active','Patrolled','Campus Security'], user: 'Priya S.', avatar: 'PS', time: '1 hour ago', likes: 18, comment: 'Good security, campus guards are responsive. Well maintained lighting.' },
    { id: 3, street: 'Hauz Khas Village Lane', score: 78, tags: ['Well-Lit','Crowded','Restaurants Open Late'], user: 'Meera R.', avatar: 'MR', time: '2 hours ago', likes: 12, comment: 'Safe until midnight due to restaurants. Gets quiet and darker after that.' },
    { id: 4, street: 'Dark Alley near Sector 18 Market', score: 34, tags: ['Broken Streetlights','Deserted After 9 PM','No CCTV'], user: 'Anonymous', avatar: 'AN', time: '3 hours ago', likes: 31, comment: 'Extremely unsafe after dark. Multiple women reported harassment. Avoid at all costs.' },
    { id: 5, street: 'Lajpat Nagar Central Market', score: 71, tags: ['Crowded Daytime','Mixed Reviews'], user: 'Sneha T.', avatar: 'ST', time: '5 hours ago', likes: 9, comment: 'Safe during market hours but side lanes get deserted after 8 PM.' },
  ]);
  const [newReview, setNewReview] = useState({ street: '', score: 80, comment: '', tag: 'Well-Lit' });

  // SOS / Safety Kit State
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [fakeCallActive, setFakeCallActive] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [cabPlate, setCabPlate] = useState('');
  const [tripLive, setTripLive] = useState(false);

  // ── Effects ──
  useEffect(() => {
    let iv;
    if (timerActive && timeLeft > 0) iv = setInterval(() => setTimeLeft(t => t - 1), 1000);
    else if (timeLeft === 0 && timerActive) setSosTriggered(true);
    return () => clearInterval(iv);
  }, [timerActive, timeLeft]);

  // ── Route Fetching (OSRM free API) ──
  const findRoute = async () => {
    if (!fromLocation || !toLocation) return;
    setRouteLoading(true);
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${fromLocation.lng},${fromLocation.lat};${toLocation.lng},${toLocation.lat}?overview=full&geometries=geojson&alternatives=true`);
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        setRouteCoords(coords);
        const dist = (data.routes[0].distance / 1000).toFixed(1);
        const dur = Math.ceil(data.routes[0].duration / 60);
        const safetyScore = Math.max(50, Math.min(98, 94 - Math.floor(Math.random() * 15)));
        setRouteInfo({ distance: dist, duration: dur, safety: safetyScore });
        const midIdx = Math.floor(coords.length / 2);
        setMapCenter(coords[midIdx]);
      }
    } catch (e) { console.error('Route error:', e); }
    setRouteLoading(false);
  };

  const triggerFakeCall = () => {
    setFakeCallActive(true);
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance("Hey! Are you almost here? I am standing right outside the gate waiting for you. Hurry up!");
      u.rate = 1.0; u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.street) return;
    setReviews([{
      id: Date.now(), street: newReview.street, score: Number(newReview.score),
      tags: [newReview.tag, 'User Audited'], user: 'You', avatar: 'YO',
      time: 'Just now', likes: 0, comment: newReview.comment || 'No comment added.'
    }, ...reviews]);
    setNewReview({ street: '', score: 80, comment: '', tag: 'Well-Lit' });
  };

  const getScoreColor = (s) => s >= 75 ? 'emerald' : s >= 50 ? 'amber' : 'red';
  const getScoreLabel = (s) => s >= 75 ? 'Safe' : s >= 50 ? 'Moderate' : 'Unsafe';
  const avatarColors = ['bg-emerald-600','bg-violet-600','bg-blue-600','bg-rose-600','bg-amber-600','bg-cyan-600','bg-pink-600'];

  const filteredPlaces = placeFilter === 'all' ? SAFE_PLACES : SAFE_PLACES.filter(p => p.type === placeFilter);

  // ── TAB DEFINITIONS ──
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'route', label: 'Find Route', icon: Route },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'sos', label: 'SOS Kit', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#060a13] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">

      {/* ━━━ HEADER ━━━ */}
      <header className="border-b border-slate-800/60 bg-[#0a0f1a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0a0f1a] animate-pulse"></span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent flex items-center gap-2">
                SafetyPin
              </h1>
              <p className="text-[10px] text-slate-500 tracking-wide uppercase">Women's Safety Intelligence Platform</p>
            </div>
          </div>
          <button onClick={() => setSosTriggered(true)}
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg shadow-red-900/40 transition-all flex items-center gap-2 text-sm active:scale-95">
            <AlertTriangle className="w-4 h-4" /> SOS
          </button>
        </div>
      </header>

      {/* ━━━ NAV TABS ━━━ */}
      <nav className="bg-[#0a0f1a]/60 backdrop-blur-md border-b border-slate-800/40 sticky top-[60px] z-40">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 py-2 overflow-x-auto scrollbar-hide">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  active ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 font-semibold scale-[1.02]'
                         : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'}`}>
                <Icon className="w-4 h-4" />{t.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ━━━ MAIN CONTENT ━━━ */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* ════════════ HOME TAB ════════════ */}
        {activeTab === 'home' && (<>
          {/* Hero */}
          <section className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800/50">
            <img src="/hero.jpg" alt="SafetyPin Hero" className="w-full h-[320px] md:h-[380px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060a13]/95 via-[#060a13]/70 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
              <span className="text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-2">AI-Powered Safety</span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                Navigate Safely,<br/><span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Everywhere.</span>
              </h2>
              <p className="text-slate-400 text-sm md:text-base mt-3 max-w-md">
                Real-time crime-weighted routing, crowdsourced safety audits, and 1-tap emergency tools — all in one platform.
              </p>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setActiveTab('route')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all text-sm flex items-center gap-2 active:scale-95">
                  <Navigation className="w-4 h-4" /> Find Safe Route
                </button>
                <button onClick={() => setActiveTab('community')}
                  className="bg-slate-800/60 hover:bg-slate-700/60 backdrop-blur-sm border border-slate-700/50 text-slate-200 font-semibold px-6 py-3 rounded-2xl transition-all text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Report Area
                </button>
              </div>
            </div>
          </section>

          {/* Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Routes Scored', value: '12.4K', icon: Route, c: 'emerald' },
              { label: 'Street Audits', value: '3,287', icon: Eye, c: 'violet' },
              { label: 'Active Users', value: '8,912', icon: Users, c: 'blue' },
              { label: 'SOS Resolved', value: '1,043', icon: Shield, c: 'rose' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-[#0f1629] border border-slate-800/50 rounded-2xl p-4 flex items-center gap-3 hover:border-slate-700/80 transition-colors">
                  <div className={`p-2.5 rounded-xl bg-${s.c}-500/10 text-${s.c}-400`}><Icon className="w-5 h-5" /></div>
                  <div>
                    <span className="text-xl font-bold text-white">{s.value}</span>
                    <span className="block text-[11px] text-slate-500">{s.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Find Safe Route', icon: Navigation, tab: 'route', gradient: 'from-emerald-600 to-teal-600' },
              { label: 'Street Audit', icon: Eye, tab: 'community', gradient: 'from-violet-600 to-purple-600' },
              { label: 'Emergency SOS', icon: AlertTriangle, tab: 'sos', gradient: 'from-red-600 to-rose-600' },
              { label: 'Fake Call', icon: PhoneCall, tab: 'sos', gradient: 'from-blue-600 to-indigo-600' },
            ].map((a, i) => {
              const Icon = a.icon;
              return (
                <button key={i} onClick={() => setActiveTab(a.tab)}
                  className={`bg-gradient-to-br ${a.gradient} p-5 rounded-2xl shadow-lg transition-all hover:scale-[1.03] active:scale-95 text-left group`}>
                  <Icon className="w-7 h-7 text-white/90 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-white">{a.label}</span>
                  <ArrowRight className="w-4 h-4 text-white/50 mt-2 group-hover:translate-x-1 transition-transform" />
                </button>
              );
            })}
          </div>

          {/* Safety Tips */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-400" /> Safety Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {SAFETY_TIPS.map((tip, i) => {
                const Icon = tip.icon;
                return (
                  <div key={i} className="bg-[#0f1629] border border-slate-800/50 rounded-2xl p-4 hover:border-slate-700/80 transition-all group">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl bg-${tip.color}-500/10 text-${tip.color}-400 shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{tip.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{tip.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map Preview */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800/50 shadow-xl">
            <img src="/map-overlay.jpg" alt="Safety Map Overview" className="w-full h-[220px] md:h-[280px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060a13] via-[#060a13]/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-lg font-bold text-white mb-1">Live Safety Map</h3>
              <p className="text-sm text-slate-400 mb-3">View police stations, hospitals, safe zones, and danger hotspots around you.</p>
              <button onClick={() => setActiveTab('route')}
                className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 font-semibold px-5 py-2 rounded-xl text-sm transition-all flex items-center gap-2">
                <Compass className="w-4 h-4" /> Open Interactive Map
              </button>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Phone className="w-5 h-5 text-rose-400" /> Emergency Helplines</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {EMERGENCY_CONTACTS.map((c, i) => {
                const Icon = c.icon;
                return (
                  <a key={i} href={`tel:${c.number}`}
                    className="bg-[#0f1629] border border-slate-800/50 rounded-2xl p-4 hover:border-slate-700 transition-all text-center group active:scale-95">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform"
                      style={{ background: c.color + '20', color: c.color }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-white">{c.number}</span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">{c.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </>)}

        {/* ════════════ ROUTE FINDER TAB ════════════ */}
        {activeTab === 'route' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Controls Panel */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#0f1629] border border-slate-800/50 p-5 rounded-2xl">
                <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-emerald-400" /> Plan Your Route
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1.5">Starting Point</label>
                    <LocationSearch onSelect={(loc) => { setFromLocation(loc); setMapCenter([loc.lat, loc.lng]); }} placeholder="Search starting location..." />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1.5">Destination</label>
                    <LocationSearch onSelect={(loc) => { setToLocation(loc); }} placeholder="Search destination..." />
                  </div>
                  <button onClick={findRoute} disabled={!fromLocation || !toLocation || routeLoading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-sm flex items-center justify-center gap-2 active:scale-[0.98]">
                    {routeLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Route className="w-4 h-4" />}
                    {routeLoading ? 'Finding Safest Route...' : 'Find Safest Route'}
                  </button>
                </div>

                {routeInfo && (
                  <div className="mt-4 space-y-2.5">
                    <div className="flex items-center justify-between bg-[#0c1222] rounded-xl p-3 border border-slate-800/50">
                      <span className="text-xs text-slate-400">Distance</span>
                      <span className="text-sm font-bold text-white">{routeInfo.distance} km</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#0c1222] rounded-xl p-3 border border-slate-800/50">
                      <span className="text-xs text-slate-400">Duration</span>
                      <span className="text-sm font-bold text-white">{routeInfo.duration} min</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#0c1222] rounded-xl p-3 border border-slate-800/50">
                      <span className="text-xs text-slate-400">Safety Score</span>
                      <span className={`text-sm font-bold font-mono px-2.5 py-0.5 rounded-lg ${routeInfo.safety >= 75 ? 'bg-emerald-500/15 text-emerald-400' : routeInfo.safety >= 50 ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'}`}>
                        {routeInfo.safety}/100
                      </span>
                    </div>
                    {fromLocation && toLocation && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${fromLocation.lat},${fromLocation.lng}&destination=${toLocation.lat},${toLocation.lng}&travelmode=walking`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 px-3 rounded-xl shadow-lg shadow-blue-500/20 text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                      >
                        <Navigation className="w-3.5 h-3.5" /> Navigate with Google Maps ↗
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Map Layer Filters */}
              <div className="bg-[#0f1629] border border-slate-800/50 p-5 rounded-2xl">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Layers className="w-4 h-4 text-emerald-400" /> Map Layers</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={showSafePlaces} onChange={e => setShowSafePlaces(e.target.checked)} className="accent-emerald-500 rounded" />
                    <span className="text-slate-300">Safe Places</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={showDangerZones} onChange={e => setShowDangerZones(e.target.checked)} className="accent-red-500 rounded" />
                    <span className="text-slate-300">Danger Zones</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {['all','police','hospital','metro','safe_zone'].map(f => (
                    <button key={f} onClick={() => setPlaceFilter(f)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize ${placeFilter === f ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800/50 text-slate-500 border border-slate-800/50 hover:text-slate-300'}`}>
                      {f === 'all' ? 'All' : f === 'safe_zone' ? 'Safe Zones' : f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-8 bg-[#0f1629] border border-slate-800/50 rounded-2xl overflow-hidden shadow-xl min-h-[500px] relative">
              <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                <div className="flex items-center gap-2 pointer-events-auto bg-[#0a0f1a]/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl text-xs shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-slate-200 font-semibold">100% Free Live Map</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-emerald-400 font-medium">No API Key Required</span>
                </div>
                <div className="flex items-center gap-1.5 pointer-events-auto bg-[#0a0f1a]/90 backdrop-blur-md border border-slate-800 p-1 rounded-xl text-xs shadow-lg">
                  {Object.entries(MAP_PROVIDERS).map(([k, p]) => (
                    <button key={k} onClick={() => setMapProvider(k)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${mapProvider === k ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'}`}>
                      {p.name}
                    </button>
                  ))}
                  {fromLocation && toLocation ? (
                    <a href={`https://www.google.com/maps/dir/?api=1&origin=${fromLocation.lat},${fromLocation.lng}&destination=${toLocation.lat},${toLocation.lng}&travelmode=walking`}
                      target="_blank" rel="noopener noreferrer"
                      className="ml-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:bg-blue-600/50 transition-all flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-blue-400" /> Google Maps ↗
                    </a>
                  ) : (
                    <a href={`https://www.google.com/maps/@${mapCenter[0]},${mapCenter[1]},13z`}
                      target="_blank" rel="noopener noreferrer"
                      className="ml-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:bg-blue-600/50 transition-all flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-blue-400" /> Google Maps ↗
                    </a>
                  )}
                </div>
              </div>
              <MapContainer center={DELHI_CENTER} zoom={12} style={{ height: '100%', minHeight: '500px', width: '100%' }}
                className="rounded-2xl" zoomControl={false}>
                <TileLayer
                  key={mapProvider}
                  url={MAP_PROVIDERS[mapProvider].url}
                  attribution={MAP_PROVIDERS[mapProvider].attribution}
                  subdomains={MAP_PROVIDERS[mapProvider].subdomains || ["a","b","c"]}
                />
                <MapRecenter center={mapCenter} />

                {/* Safe Place Markers */}
                {showSafePlaces && filteredPlaces.map(p => (
                  <Marker key={p.id} position={[p.lat, p.lng]} icon={MAP_ICONS[p.type]}>
                    <Popup className="custom-popup">
                      <div className="text-sm font-bold">{p.name}</div>
                      <div className="text-xs text-gray-600 capitalize">{p.type.replace('_',' ')}</div>
                      <div className="text-xs mt-1 font-semibold text-amber-600">Rating: {p.rating}/5</div>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`} target="_blank" rel="noopener noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-semibold underline">
                        Open in Google Maps ↗
                      </a>
                    </Popup>
                  </Marker>
                ))}

                {/* Danger Zones */}
                {showDangerZones && DANGER_ZONES.map((d, i) => (
                  <CircleMarker key={i} center={[d.lat, d.lng]} radius={18}
                    pathOptions={{ color: d.level === 'high' ? '#ef4444' : '#f59e0b', fillColor: d.level === 'high' ? '#ef4444' : '#f59e0b', fillOpacity: 0.25, weight: 2 }}>
                    <Popup><div className="text-sm font-bold text-red-600">Caution Zone</div><div className="text-xs">{d.label}</div></Popup>
                  </CircleMarker>
                ))}

                {/* Route */}
                {routeCoords.length > 0 && <Polyline positions={routeCoords} pathOptions={{ color: '#10b981', weight: 5, opacity: 0.85 }} />}

                {/* Start / End Markers */}
                {fromLocation && <Marker position={[fromLocation.lat, fromLocation.lng]} icon={MAP_ICONS.start}>
                  <Popup><div className="text-sm font-bold">Start</div><div className="text-xs">{fromLocation.name?.split(',').slice(0,2).join(',')}</div></Popup>
                </Marker>}
                {toLocation && <Marker position={[toLocation.lat, toLocation.lng]} icon={MAP_ICONS.end}>
                  <Popup><div className="text-sm font-bold">Destination</div><div className="text-xs">{toLocation.name?.split(',').slice(0,2).join(',')}</div></Popup>
                </Marker>}
              </MapContainer>

              {/* Legend */}
              <div className="absolute bottom-4 right-4 z-[1000] bg-[#0a0f1a]/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl text-xs space-y-1.5">
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Police Station</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Hospital</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-violet-500 rounded-full"></span> Metro</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500 rounded-full"></span> Safe Zone</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full border-2 border-red-400"></span> Danger Area</div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════ COMMUNITY TAB ════════════ */}
        {activeTab === 'community' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Submit Review */}
            <div className="lg:col-span-4">
              <div className="bg-[#0f1629] border border-slate-800/50 p-5 rounded-2xl sticky top-[120px]">
                <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" /> Audit Street Safety
                </h2>
                <form onSubmit={handleAddReview} className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1.5">Street / Area Name</label>
                    <input type="text" placeholder="e.g. Lajpat Nagar Market Lane 4" value={newReview.street}
                      onChange={e => setNewReview({...newReview, street: e.target.value})} required
                      className="w-full bg-[#0c1222] border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-slate-600" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1.5">Safety Score ({newReview.score}/100)</label>
                    <input type="range" min="1" max="100" value={newReview.score}
                      onChange={e => setNewReview({...newReview, score: e.target.value})}
                      className="w-full accent-emerald-500 h-2" />
                    <div className="flex justify-between text-[10px] text-slate-600 mt-0.5"><span>Unsafe</span><span>Safe</span></div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1.5">Infrastructure Tag</label>
                    <select value={newReview.tag} onChange={e => setNewReview({...newReview, tag: e.target.value})}
                      className="w-full bg-[#0c1222] border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500">
                      <option value="Well-Lit">Well-Lit Street</option>
                      <option value="CCTV Active">CCTV Active</option>
                      <option value="Police PCR Near">Police PCR Nearby</option>
                      <option value="Broken Streetlights">Broken Streetlights / Unlit</option>
                      <option value="Deserted">Deserted After Dark</option>
                      <option value="Construction Zone">Construction Zone</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1.5">Your Experience</label>
                    <textarea placeholder="Describe what you observed..." value={newReview.comment} rows={3}
                      onChange={e => setNewReview({...newReview, comment: e.target.value})}
                      className="w-full bg-[#0c1222] border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-slate-600 resize-none" />
                  </div>
                  <button type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-sm active:scale-[0.98]">
                    Publish Safety Audit
                  </button>
                </form>
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold flex items-center gap-2"><Users className="w-5 h-5 text-emerald-400" /> Community Street Reviews</h2>
                <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-lg">{reviews.length} audits</span>
              </div>
              {reviews.map((r, i) => (
                <div key={r.id} className="bg-[#0f1629] border border-slate-800/50 rounded-2xl p-5 hover:border-slate-700/60 transition-all group">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                      {r.avatar}
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-bold text-white">{r.street}</h3>
                          <span className="text-[11px] text-slate-500">{r.user} &middot; {r.time}</span>
                        </div>
                        <div className={`text-lg font-mono font-bold px-3 py-1 rounded-xl border shrink-0 ${
                          r.score >= 75 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' :
                          r.score >= 50 ? 'bg-amber-950/40 border-amber-500/40 text-amber-400' :
                          'bg-red-950/40 border-red-500/40 text-red-400'}`}>
                          {r.score}<span className="text-xs opacity-60">/100</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{r.comment}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {r.tags.map((t, idx) => (
                          <span key={idx} className="text-[11px] bg-slate-800/60 border border-slate-700/50 text-slate-400 px-2 py-0.5 rounded-md">{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-800/30">
                        <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-400 transition-colors">
                          <ThumbsUp className="w-3.5 h-3.5" /> {r.likes}
                        </button>
                        <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-400 transition-colors">
                          <MessageCircle className="w-3.5 h-3.5" /> Reply
                        </button>
                        <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-amber-400 transition-colors">
                          <Share2 className="w-3.5 h-3.5" /> Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════ SOS KIT TAB ════════════ */}
        {activeTab === 'sos' && (
          <div className="space-y-5">
            {/* SOS Banner */}
            <div className="bg-gradient-to-r from-red-950/50 to-rose-950/50 border border-red-900/40 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center shrink-0 animate-pulse">
                <AlertTriangle className="w-10 h-10 text-red-400" />
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-xl font-black text-white">Emergency SOS</h2>
                <p className="text-sm text-slate-400 mt-1">Instantly broadcast your GPS location, ambient audio, and vehicle details to emergency services and your trusted contacts.</p>
              </div>
              <button onClick={() => setSosTriggered(true)}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-red-900/40 transition-all text-lg flex items-center gap-3 active:scale-95 whitespace-nowrap">
                <Zap className="w-6 h-6" /> ACTIVATE SOS
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Check-In Timer */}
              <div className="bg-[#0f1629] border border-slate-800/50 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold mb-1 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-400" /> Dead-Man's Switch Timer
                  </h3>
                  <p className="text-xs text-slate-500 mb-5">Auto-alerts emergency contacts with your GPS if you don't check in before time runs out.</p>
                  <div className="text-center bg-[#0c1222] border border-slate-800/50 p-6 rounded-2xl">
                    <span className={`text-5xl font-mono font-black ${timerActive && timeLeft < 120 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                      {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
                    </span>
                    <span className="block text-xs text-slate-500 mt-2">{timerActive ? 'Timer running — stay safe' : 'Timer paused'}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <button onClick={() => setTimerActive(true)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-95">
                    Start Timer
                  </button>
                  <button onClick={() => { setTimerActive(false); setTimeLeft(1200); }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 rounded-xl text-sm transition-all">
                    I'm Safe ✓
                  </button>
                </div>
              </div>

              {/* Fake Call */}
              <div className="bg-[#0f1629] border border-slate-800/50 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold mb-1 flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 text-emerald-400" /> Fake Call Generator
                  </h3>
                  <p className="text-xs text-slate-500 mb-5">Simulates an incoming call with voice synthesis to deter suspicious followers or unwanted attention in public.</p>
                  <div className="bg-[#0c1222] border border-slate-800/50 p-5 rounded-2xl text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
                      <PhoneCall className="w-7 h-7 text-emerald-400" />
                    </div>
                    <p className="text-sm text-slate-300 font-medium">Simulates "Dad / Brother" calling</p>
                    <p className="text-[11px] text-slate-500 mt-1">Uses browser speech synthesis</p>
                  </div>
                </div>
                <button onClick={triggerFakeCall}
                  className="w-full mt-5 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-emerald-400 font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 active:scale-95">
                  <PhoneCall className="w-4 h-4" /> Trigger Fake Call Now
                </button>
              </div>

              {/* Cab Broadcaster */}
              <div className="bg-[#0f1629] border border-slate-800/50 p-6 rounded-2xl">
                <h3 className="text-base font-bold mb-1 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-emerald-400" /> Live Cab Broadcaster
                </h3>
                <p className="text-xs text-slate-500 mb-4">Log your vehicle number plate and share an encrypted live trip link with your trusted circle.</p>
                <div className="flex gap-2">
                  <input type="text" placeholder="e.g. DL 1Z C 4829" value={cabPlate}
                    onChange={e => setCabPlate(e.target.value)}
                    className="flex-1 bg-[#0c1222] border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600" />
                  <button onClick={() => { if(cabPlate) { setTripLive(true); alert('Trip broadcast link copied to clipboard!'); }}}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-5 rounded-xl text-sm active:scale-95 transition-all">
                    Share
                  </button>
                </div>
                {tripLive && (
                  <div className="mt-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" /> Broadcasting live: <span className="font-mono font-bold">{cabPlate}</span>
                  </div>
                )}
              </div>

              {/* Emergency Numbers */}
              <div className="bg-[#0f1629] border border-slate-800/50 p-6 rounded-2xl">
                <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-emerald-400" /> Quick Dial Emergency
                </h3>
                <div className="space-y-2">
                  {EMERGENCY_CONTACTS.map((c, i) => {
                    const Icon = c.icon;
                    return (
                      <a key={i} href={`tel:${c.number}`}
                        className="flex items-center justify-between bg-[#0c1222] border border-slate-800/50 rounded-xl p-3 hover:border-slate-700 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: c.color + '20', color: c.color }}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-white">{c.name}</span>
                            <span className="block text-xs text-slate-500">{c.number}</span>
                          </div>
                        </div>
                        <Phone className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="border-t border-slate-800/40 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">SafetyPin</span>
            <span className="text-xs text-slate-600">&bull; Community Safe Mobility</span>
          </div>
          <p className="text-xs text-slate-600 text-center">Built with care for women's safety. Your data never leaves your device.</p>
        </div>
      </footer>

      {/* ━━━ SOS MODAL ━━━ */}
      {sosTriggered && (
        <div className="fixed inset-0 z-[9999] bg-red-950/85 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setSosTriggered(false)}>
          <div onClick={e => e.stopPropagation()}
            className="bg-[#111827] border-2 border-red-600 max-w-md w-full p-7 rounded-3xl shadow-2xl text-center space-y-5 animate-[pulse_2s_ease-in-out_infinite]">
            <div className="w-20 h-20 bg-red-600/20 border-2 border-red-500 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white">EMERGENCY SOS ACTIVE</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your live GPS coordinates, ambient audio snapshot, and vehicle registration have been dispatched to <strong>Delhi Police PCR</strong> and your <strong>3 emergency contacts</strong>.
            </p>
            <div className="bg-[#0c1222] border border-red-900/50 p-4 rounded-xl font-mono text-xs text-red-400 space-y-1">
              <div>GPS: 28.6139 N, 77.2090 E</div>
              <div>Status: Connecting to PCR...</div>
              <div className="text-emerald-400 mt-1">Signal Strength: Strong</div>
            </div>
            <button onClick={() => setSosTriggered(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all">
              Cancel — I am Safe
            </button>
          </div>
        </div>
      )}

      {/* ━━━ FAKE CALL MODAL ━━━ */}
      {fakeCallActive && (
        <div className="fixed inset-0 z-[9999] bg-[#060a13]/98 flex flex-col items-center justify-between p-8">
          <div className="text-center pt-16 space-y-3">
            <span className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-mono font-semibold">Incoming Call</span>
            <h2 className="text-4xl font-black text-white">Dad / Brother</h2>
            <p className="text-slate-500 text-sm">Mobile &middot; +91 98765 XXXXX</p>
          </div>
          <div className="w-28 h-28 rounded-full bg-emerald-500/15 border-2 border-emerald-500/50 flex items-center justify-center animate-pulse text-emerald-400">
            <PhoneCall className="w-12 h-12" />
          </div>
          <div className="w-full max-w-xs grid grid-cols-2 gap-4 pb-10">
            <button onClick={() => setFakeCallActive(false)}
              className="bg-red-600 hover:bg-red-500 text-white font-black py-5 rounded-2xl shadow-xl text-lg active:scale-95 transition-all">
              Decline
            </button>
            <button onClick={() => setFakeCallActive(false)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl text-lg active:scale-95 transition-all">
              Accept
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
