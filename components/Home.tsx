
import React from 'react';
import { Mic, Camera, Apple, MessageCircle, TrendingUp, Star, CloudSun, PhoneCall, Info, Target, ChevronRight, MapPin, Youtube, Facebook } from 'lucide-react';
import { Language, User, AdminSettings } from '../types';
import { translations } from '../locales';

interface HomeProps {
  user: User | null;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onStartVoice: (initialPrompt?: string) => void;
  onStartScan: () => void;
  onBookAppointment: () => void;
  onStartCommunity: () => void;
  onViewWeather: () => void;
  onViewMarket: () => void;
  onOpenEShop: () => void;
  settings: AdminSettings;
}

export const Home: React.FC<HomeProps> = ({ user, language, onLanguageChange, onStartVoice, onStartScan, onBookAppointment, onStartCommunity, onViewWeather, onViewMarket, onOpenEShop, settings }) => {
  const t = translations[language];
  const ytLink = settings.socialLinks.find(l => l.platform === 'YouTube')?.url || '#';
  const fbLink = settings.socialLinks.find(l => l.platform === 'Facebook')?.url || '#';
  const waLink = `https://wa.me/${settings.expertWhatsApp}`;
  const phoneLink = `tel:${settings.expertPhone}`;

  const getSeasonalInfo = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return { stage: "Pink Bud / Bloom", task: "Ensure pollinizer bees are active and apply anti-scab spray." };
    if (month >= 5 && month <= 7) return { stage: "Fruit Sizing", task: "Monitor for Mites and ensure regular irrigation during dry spells." };
    if (month >= 8 && month <= 10) return { stage: "Harvest Season", task: "Focus on color development and proper post-harvest handling." };
    return { stage: "Dormancy / Pruning", task: "Prune trees for better sunlight penetration and apply copper spray." };
  };

  const seasonal = getSeasonalInfo();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-12 h-full overflow-y-auto pb-48 no-scrollbar scroll-smooth">
      
      {/* Dynamic News Ticker Managed by Admin */}
      <div className="bg-orange-50 rounded-3xl p-4 shadow-sm border border-orange-100 overflow-hidden relative">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-orange-600" />
          <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{t.schemesTicker}</span>
        </div>
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {settings.schemes.concat(settings.schemes).map((s, i) => (
            <div key={i} className="inline-flex items-center gap-2">
              <span className="text-sm font-black text-slate-800">• {s}</span>
              <button onClick={() => onStartVoice(`Tell me more about: ${s}`)} className="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                {t.viewScheme}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              <Star className="w-3 h-3 fill-green-800" /> KASHMIR'S SMART AGRICULTURE
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
              {user ? <>{t.welcome}, <span className="text-green-600 underline decoration-green-100 underline-offset-8">{user.name.split(' ')[0]}</span>!</> : t.heroTitle}
            </h2>
            <p className="mt-4 text-xl text-slate-500 leading-relaxed max-w-2xl font-medium">{t.heroDesc}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={onStartScan} className="group relative bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 p-6 rounded-[2.5rem] font-black text-xl transition-all flex flex-col items-center gap-4 shadow-xl active:scale-95">
              <div className="bg-green-100 p-5 rounded-3xl group-hover:scale-110 transition-transform"><Camera className="w-12 h-12" /></div>
              {t.scanBtn}
            </button>
            <button onClick={() => onStartVoice()} className="group relative bg-green-600 hover:bg-green-700 text-white p-6 rounded-[2.5rem] font-black text-xl shadow-2xl transition-all flex flex-col items-center gap-4 active:scale-95">
              <div className="bg-white/20 p-5 rounded-3xl group-hover:scale-110 transition-transform"><Mic className="w-12 h-12 group-hover:animate-pulse" /></div>
              {t.voiceBtn}
            </button>
          </div>
        </div>

        {/* Dynamic Weather & Market Snapshots */}
        <div className="lg:col-span-4 space-y-6">
          <div onClick={onViewWeather} className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-gray-100 group cursor-pointer hover:shadow-2xl transition-all">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <CloudSun className="w-4 h-4 text-blue-500" /> {t.weatherTitle}
               </h3>
               <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
             </div>
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-5xl font-black text-gray-900 flex items-start">18<span className="text-2xl mt-1">°C</span></p>
                 <p className="text-blue-600 font-black uppercase text-[10px] mt-1 tracking-widest">{settings.weatherDistricts[0]}</p>
               </div>
               <div className="bg-blue-50 p-4 rounded-3xl"><CloudSun className="w-10 h-10 text-blue-600" /></div>
             </div>
          </div>

          <div onClick={onViewMarket} className="bg-slate-900 rounded-[2.5rem] p-6 shadow-xl group cursor-pointer hover:shadow-2xl transition-all border border-slate-800">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <TrendingUp className="w-4 h-4 text-green-500" /> {t.mandiRates}
               </h3>
               <ChevronRight className="w-4 h-4 text-slate-700 group-hover:translate-x-1 transition-transform" />
             </div>
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-3xl font-black text-white leading-none">₹1,300</p>
                 <p className="text-green-500 font-black uppercase text-[10px] mt-2 tracking-widest">{settings.mandis[0].name}</p>
               </div>
               <div className="bg-white/10 p-4 rounded-3xl"><MapPin className="w-8 h-8 text-white" /></div>
             </div>
          </div>
        </div>
      </div>

      {/* Dynamic Seasonal Focus Section */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{t.seasonalFocus}</div>
            <h2 className="text-4xl font-black leading-tight">{t.orchardStage}: <span className="text-emerald-200">{seasonal.stage}</span></h2>
            <p className="text-emerald-50 text-lg font-medium opacity-90 leading-relaxed">{seasonal.task}</p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button onClick={onBookAppointment} className="bg-white text-emerald-900 px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-xl active:scale-95 transition-all">Schedule Expert Visit</button>
              <button onClick={onOpenEShop} className="bg-emerald-400 text-emerald-950 px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-xl active:scale-95 transition-all">Parijat E-Shop</button>
            </div>
          </div>
          <div className="hidden md:flex justify-end">
            <div className="bg-white/10 p-12 rounded-[4rem] backdrop-blur-3xl border border-white/20">
               <Target className="w-32 h-32 text-white/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Social Links Managed by Admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a href={ytLink} target="_blank" rel="noopener" className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-gray-100 flex items-center gap-6 group hover:shadow-2xl transition-all">
          <div className="bg-red-50 p-6 rounded-[2rem] group-hover:scale-110 transition-transform"><Youtube className="w-10 h-10 text-red-600" /></div>
          <div>
            <h4 className="font-black text-slate-900 text-lg">Watch Expert Advice</h4>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Visit YouTube Channel</p>
          </div>
        </a>
        <a href={fbLink} target="_blank" rel="noopener" className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-gray-100 flex items-center gap-6 group hover:shadow-2xl transition-all">
          <div className="bg-blue-50 p-6 rounded-[2rem] group-hover:scale-110 transition-transform"><Facebook className="w-10 h-10 text-blue-600" /></div>
          <div>
            <h4 className="font-black text-slate-900 text-lg">Farmers Facebook Square</h4>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Connect with Peers</p>
          </div>
        </a>
      </div>

      {/* Floating Expert Hub Managed by Admin */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 animate-in slide-in-from-bottom-20 duration-1000">
        <div className="bg-gray-900/90 backdrop-blur-2xl border border-white/10 rounded-[3.5rem] p-2 flex items-center shadow-3xl shadow-black/50 ring-1 ring-white/10">
          <div className="flex-1 flex items-center gap-3 px-6">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-50"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-green-400 uppercase tracking-widest leading-none">{t.liveNow}</span>
              <span className="text-xs font-black text-white uppercase tracking-tighter mt-1">{settings.expertName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-[3rem]">
            <button onClick={() => window.open(phoneLink, '_self')} className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all active:scale-90"><PhoneCall className="w-5 h-5" /></button>
            <button onClick={() => window.open(waLink, '_blank')} className="bg-green-500 hover:bg-green-600 text-white px-8 py-5 rounded-[3rem] flex items-center gap-2 font-black text-xs uppercase transition-all active:scale-95 shadow-lg shadow-green-500/20"><MessageCircle className="w-4 h-4" /> {t.callExpert}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
