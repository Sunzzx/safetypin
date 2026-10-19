import React, { useState, useEffect } from 'react';
import { 
  Shield, MapPin, AlertTriangle, Navigation, Clock, Users, PhoneCall, 
  Lock, CheckCircle, Share2, Eye, Flame, Award, Heart, Radio, Send, Plus, RefreshCw, Layers
} from 'lucide-react';

export default function SafetyPinApp() {
  const [activeTab, setActiveTab] = useState('navigator');
  const [commuteMode, setCommuteMode] = useState('daily');
  const [timeOfDay, setTimeOfDay] = useState('20:00');
  const [selectedRoute, setSelectedRoute] = useState('safest');
  
  // Real-time Cloud/Local synced state for reviews & pins
  const [reviews, setReviews] = useState([
    { id: 1, street: 'Connaught Place Outer Circle', score: 92, tags: ['Well-Lit', 'High Footfall', 'Police Booth Nearby'], user: 'Ayu K.', time: '10 mins ago' },
    { id: 2, street: 'IIT Delhi Gate 3 Road', score: 85, tags: ['CCTV Active', 'Patrolled'], user: 'Priya S.', time: '1 hour ago' },
    { id: 3, street: 'Dark Alley near Sector 18 Market', score: 34, tags: ['Broken Streetlights', 'Deserted After 9 PM'], user: 'Anonymous', time: '3 hours ago' }
  ]);

  const [newReview, setNewReview] = useState({ street: '', score: 80, comment: '', tag: 'Well-Lit' });
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 mins
  const [fakeCallActive, setFakeCallActive] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);
  
  // Cab Live Sharing State
  const [cabPlate, setCabPlate] = useState('');
  const [tripLive, setTripLive] = useState(false);

  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      setSosTriggered(true);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const triggerFakeCall = () => {
    setFakeCallActive(true);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Hey! Are you reaching soon? I am waiting right at the intersection for you.");
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.street) return;
    const item = {
      id: Date.now(),
      street: newReview.street,
      score: Number(newReview.score),
      tags: [newReview.tag, 'User Audited'],
      user: 'Ayu Kandwal',
      time: 'Just now'
    };
    setReviews([item, ...reviews]);
    setNewReview({ street: '', score: 80, comment: '', tag: 'Well-Lit' });
    alert('Street safety audit published to live cloud network!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-xl text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                SafetyPin <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">Live Cloud Synced</span>
              </h1>
              <p className="text-xs text-slate-400">Women's Safe Navigation & Crime-Weighted Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSosTriggered(true)}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg shadow-red-900/30 transition-all flex items-center gap-2 animate-pulse text-sm"
            >
              <AlertTriangle className="w-4 h-4" /> 1-Tap SOS
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <div className="bg-slate-900/40 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 flex space-x-1 py-2 overflow-x-auto">
          {[
            { id: 'navigator', label: 'Safe Router & Map', icon: Navigation },
            { id: 'analytics', label: 'Crime Risk Analytics', icon: Flame },
            { id: 'reviews', label: 'Crowdsourced Audits', icon: Users },
            { id: 'safetykit', label: 'Active Transit & SOS Kit', icon: Lock }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-semibold' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        {/* TAB 1: NAVIGATOR */}
        {activeTab === 'navigator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Controls */}
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-400" /> Route Parameters
                </h2>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Journey Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setCommuteMode('daily')}
                        className={`py-2 text-xs rounded-xl border font-medium transition-all ${commuteMode === 'daily' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'border-slate-800 text-slate-400'}`}
                      >
                        Daily Commute
                      </button>
                      <button 
                        onClick={() => setCommuteMode('highway')}
                        className={`py-2 text-xs rounded-xl border font-medium transition-all ${commuteMode === 'highway' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'border-slate-800 text-slate-400'}`}
                      >
                        Outstation Highway
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Departure Time Simulator</label>
                    <select 
                      value={timeOfDay} 
                      onChange={(e) => setTimeOfDay(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="14:00">2:00 PM (Daytime - Safe)</option>
                      <option value="19:30">7:30 PM (Evening Rush)</option>
                      <option value="22:00">10:00 PM (Night - High Caution)</option>
                      <option value="01:30">1:30 AM (Late Night - Restricted)</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <label className="text-xs text-slate-400 block mb-2">Route Options</label>
                    <div className="space-y-2">
                      <div 
                        onClick={() => setSelectedRoute('safest')}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedRoute === 'safest' ? 'bg-emerald-950/30 border-emerald-500/80 shadow-md' : 'bg-slate-950 border-slate-800'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5"><Shield className="w-4 h-4"/> Safest Route</span>
                          <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">Score: 94/100</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">High CCTV density, well-lit main arterial roads, police patrolling active.</p>
                      </div>

                      <div 
                        onClick={() => setSelectedRoute('fastest')}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedRoute === 'fastest' ? 'bg-amber-950/30 border-amber-500/80 shadow-md' : 'bg-slate-950 border-slate-800'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-amber-400 flex items-center gap-1.5"><Navigation className="w-4 h-4"/> Fastest (Caution)</span>
                          <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">Score: 68/100</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Saves 4 mins, but passes through unlit industrial stretches after 9 PM.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Map Container */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-[450px] relative">
              <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Live Spatial Grid Active ({commuteMode === 'daily' ? 'New Delhi Urban Corridor' : 'NH-334 Express Highway'})</span>
              </div>

              {/* Map Mock Graphic */}
              <div className="flex-1 bg-slate-950 relative flex items-center justify-center p-6 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"></div>
                
                {/* SVG Simulated Route Lines */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 80,350 Q 250,120 520,300 T 800,100" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 6" opacity="0.6"/>
                  <path d="M 80,350 Q 300,380 520,300 T 800,100" fill="none" stroke="#10b981" strokeWidth="6" />
                </svg>

                {/* Simulated Pins */}
                <div className="absolute top-1/3 left-1/4 bg-emerald-500 text-slate-950 p-2 rounded-full shadow-lg shadow-emerald-500/50 animate-bounce">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="absolute top-1/2 right-1/3 bg-amber-500 text-slate-950 p-2 rounded-full shadow-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>

                <div className="absolute bottom-4 right-4 bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500 rounded-sm"></span> Safest Route (Recommended)</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 bg-amber-500 rounded-sm"></span> High Caution Zone at {timeOfDay}</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: CRIME RISK ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Flame className="w-5 h-5 text-emerald-400" /> Spatio-Temporal Safety Cost Function
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                SafetyPin weights road edges using Kernel Density Estimation (KDE) over historical crime datasets, infrastructure audits, and live user reviews.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <span className="text-xs text-slate-400">Historical Crime Weight</span>
                  <div className="text-2xl font-bold text-red-400 mt-1">35%</div>
                  <p className="text-xs text-slate-500 mt-1">3-5 year FIR density analysis with time-decay smoothing.</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <span className="text-xs text-slate-400">Lighting & CCTV Index</span>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">40%</div>
                  <p className="text-xs text-slate-500 mt-1">OpenStreetMap streetlamp tags & municipal CCTV coverage.</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <span className="text-xs text-slate-400">Crowdsourced Sentiment</span>
                  <div className="text-2xl font-bold text-amber-400 mt-1">25%</div>
                  <p className="text-xs text-slate-500 mt-1">Real-time NLP sentiment analysis on recent commuter feedback.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CROWDSOURCED REVIEWS & AUDITS */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
              <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" /> Pin & Audit Street Safety
              </h2>
              <form onSubmit={handleAddReview} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Street / Area Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Lajpat Nagar Market Lane 4" 
                    value={newReview.street}
                    onChange={(e) => setNewReview({...newReview, street: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Safety Score (1 - 100)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="100" 
                    value={newReview.score}
                    onChange={(e) => setNewReview({...newReview, score: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Key Infrastructure Tag</label>
                  <select 
                    value={newReview.tag}
                    onChange={(e) => setNewReview({...newReview, tag: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Well-Lit">Well-Lit Street</option>
                    <option value="CCTV Active">CCTV Active</option>
                    <option value="Police PCR Near">Police PCR Nearby</option>
                    <option value="Broken Streetlights">Broken Streetlights / Unlit</option>
                    <option value="Deserted">Deserted After Dark</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-2.5 rounded-xl transition-all text-sm mt-2">
                  Publish Safety Audit
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" /> Live Community Street Reviews
              </h2>
              {reviews.map((r) => (
                <div key={r.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{r.street}</h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {r.tags.map((t, idx) => (
                        <span key={idx} className="text-xs bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-2 block">By {r.user} - {r.time}</span>
                  </div>
                  <div className={`text-lg font-mono font-bold px-3 py-1.5 rounded-xl border ${r.score > 75 ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400' : 'bg-red-950/40 border-red-500/50 text-red-400'}`}>
                    {r.score}/100
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ACTIVE TRANSIT & SOS KIT */}
        {activeTab === 'safetykit' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Smart Check-In Timer */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <h2 className="text-base font-semibold mb-1 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-400" /> Smart Check-In Timer (Dead-Man's Switch)
                </h2>
                <p className="text-xs text-slate-400 mb-6">
                  Set a transit timer. If you don't check in before time expires, emergency contacts receive your live GPS coordinates automatically.
                </p>
                <div className="text-center bg-slate-950 border border-slate-800 p-6 rounded-2xl my-4">
                  <span className="text-4xl font-mono font-bold text-emerald-400">
                    {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
                  </span>
                  <span className="block text-xs text-slate-500 mt-1">Remaining until automatic alert</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button 
                  onClick={() => setTimerActive(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-2.5 rounded-xl text-sm transition-all"
                >
                  Start Timer
                </button>
                <button 
                  onClick={() => { setTimerActive(false); setTimeLeft(1200); }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2.5 rounded-xl text-sm transition-all"
                >
                  I'm Safe (Reset)
                </button>
              </div>
            </div>

            {/* Fake Call & Broadcaster */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h2 className="text-base font-semibold mb-1 flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-emerald-400" /> Deterrent Voice Synthesis (Fake Call)
                </h2>
                <p className="text-xs text-slate-400 mb-4">
                  Triggers an automated voice call simulation to deter suspicious followers or unwanted attention.
                </p>
                <button 
                  onClick={triggerFakeCall}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" /> Trigger Simulated Incoming Call
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h2 className="text-base font-semibold mb-1 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-emerald-400" /> Live Cab / Auto Broadcaster
                </h2>
                <p className="text-xs text-slate-400 mb-4">
                  Log your vehicle number plate and share an encrypted live trip link with your trusted circle.
                </p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. DL 1Z C 4829" 
                    value={cabPlate}
                    onChange={(e) => setCabPlate(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <button 
                    onClick={() => { if(cabPlate) setTripLive(true); alert('Trip Live Broadcast Link Copied!'); }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2 rounded-xl text-sm"
                  >
                    Broadcast
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* SOS Modal Overlay */}
      {sosTriggered && (
        <div className="fixed inset-0 z-50 bg-red-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-red-600 max-w-md w-full p-6 rounded-3xl shadow-2xl text-center space-y-4 animate-bounce">
            <div className="w-16 h-16 bg-red-600/20 border border-red-500 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">EMERGENCY SOS BROADCASTING</h3>
            <p className="text-xs text-slate-300">
              Your live GPS location, ambient audio snapshot, and cab registration details have been dispatched to Delhi Police PCR and your 3 emergency contacts.
            </p>
            <div className="bg-slate-950 border border-red-900/50 p-3 rounded-xl font-mono text-xs text-red-400">
              GPS: 28.6139 N, 77.2090 E - Status: Connecting to PCR...
            </div>
            <button 
              onClick={() => setSosTriggered(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 rounded-xl text-sm transition-all"
            >
              Cancel / I am Safe
            </button>
          </div>
        </div>
      )}

      {/* Fake Call Active Overlay */}
      {fakeCallActive && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-between p-8">
          <div className="text-center pt-12 space-y-2">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono">Incoming Call</span>
            <h2 className="text-3xl font-bold text-white">Dad / Brother</h2>
            <p className="text-slate-400 text-sm">Mobile - +91 98765 XXXXX</p>
          </div>
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center animate-pulse text-emerald-400">
            <PhoneCall className="w-10 h-10" />
          </div>
          <div className="w-full max-w-xs grid grid-cols-2 gap-4 pb-8">
            <button 
              onClick={() => setFakeCallActive(false)}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl shadow-lg"
            >
              Decline
            </button>
            <button 
              onClick={() => setFakeCallActive(false)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg"
            >
              Accept
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
