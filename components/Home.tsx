
import React from 'react';
import { 
  Mic, Camera, Apple, MessageCircle, TrendingUp, CloudSun, 
  ChevronRight, LayoutGrid, Calculator, BookOpen, ShieldAlert, 
  Image as ImageIcon, Calendar, Droplets, FlaskConical, Users, 
  Sparkles, PhoneCall, Info, Target 
} from 'lucide-react';
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
  onOpenToolbox: () => void;
  onViewGallery: () => void;
  onViewDiseases: () => void;
  settings: AdminSettings;
}

export const Home: React.FC<HomeProps> = ({ 
  user, language, onStartVoice, onStartScan, onStartCommunity, 
  onViewWeather, onViewMarket, onOpenEShop, onOpenToolbox, 
  onViewGallery, onViewDiseases, settings 
}) => {
  const t = translations[language];
  const waLink = `https://wa.me/${settings.expertWhatsApp}`;
  const phoneLink = `tel:${settings.expertPhone}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-12 h-full overflow-y-auto pb-48 no-scrollbar scroll-smooth">
      
      {/* Top Welcome Section */}
      <div className="relative overflow-hidden rounded-[4rem] bg-gradient-to-br from-green-700 to-green-900 p-8 md:p-16 text-white shadow-3xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
             <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/10">
               <Sparkles className="w-4 h-4 text-yellow-400" />
               <span className="text-[10px] font-black uppercase tracking-widest">{t.heroSubtitle || "Valley's Digital Expert"}</span>
             </div>
             <h2 className="text-4xl md:text-7xl font-black leading-[1.1] tracking-tighter">
               {user ? <>{t.welcome}, <br/><span className="text-green-300">{user.name.split(' ')[0]}</span>!</> : t.heroTitle}
             </h2>
             <p className="text-lg md:text-xl text-green-50/70 leading-relaxed font-medium">
               {t.heroDesc}
             </p>
             <div className="flex flex-wrap gap-4 pt-4">
               <button onClick={() => onStartVoice()} className="bg-white text-green-900 px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-3 active:scale-95">
                 <Mic className="w-5 h-5" /> {t.voiceBtn}
               </button>
               <button onClick={onStartScan} className="bg-green-600/50 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-all flex items-center gap-3 active:scale-95">
                 <Camera className="w-5 h-5" /> {t.scanBtn}
               </button>
             </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-yellow-400 blur-[120px] opacity-20 animate-pulse"></div>
            <div className="bg-white/5 backdrop-blur-2xl border border-white/20 p-8 rounded-[4rem] shadow-2xl relative z-10 w-[300px]">
               <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Live News</span>
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                 </div>
                 <div className="space-y-4">
                    {settings.schemes.slice(0, 2).map((s, i) => (
                      <p key={i} className="text-xs font-bold leading-relaxed border-b border-white/10 pb-4">{s}</p>
                    ))}
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Spray Calendar Card */}
        <div onClick={() => onStartVoice("Show me the apple spray schedule for this month.")} className="group bg-white rounded-[3.5rem] p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer">
           <div className="bg-blue-50 w-16 h-16 rounded-[2rem] flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
             <Calendar className="w-8 h-8" />
           </div>
           <h3 className="text-2xl font-black text-gray-900 leading-none mb-2">{t.sprayGuide || "Spray Calendar"}</h3>
           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t.orchardStage || "Dormant Stage"}</p>
           <div className="mt-8 flex items-center justify-between">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-full">View Schedule</span>
              <ChevronRight className="text-gray-300 w-5 h-5 group-hover:translate-x-1 transition-transform" />
           </div>
        </div>

        {/* Diseases Encyclopedia Card */}
        <div onClick={onViewDiseases} className="group bg-white rounded-[3.5rem] p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer">
           <div className="bg-red-50 w-16 h-16 rounded-[2rem] flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform">
             <ShieldAlert className="w-8 h-8" />
           </div>
           <h3 className="text-2xl font-black text-gray-900 leading-none mb-2">{t.pestAlert || "Disease Library"}</h3>
           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Pest Profiles</p>
           <div className="mt-8 flex items-center justify-between">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-4 py-2 rounded-full">Explore 100+</span>
              <ChevronRight className="text-gray-300 w-5 h-5" />
           </div>
        </div>

        {/* Community Chat Hub Card */}
        <div onClick={onStartCommunity} className="group bg-white rounded-[3.5rem] p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer">
           <div className="bg-orange-50 w-16 h-16 rounded-[2rem] flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
             <Users className="w-8 h-8" />
           </div>
           <h3 className="text-2xl font-black text-gray-900 leading-none mb-2">{t.communityTitle || "Farmers Chat"}</h3>
           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Grower Network</p>
           <div className="mt-8 flex items-center justify-between">
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-4 py-2 rounded-full">Join Hub</span>
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />)}
              </div>
           </div>
        </div>

        {/* Gallery Card */}
        <div onClick={onViewGallery} className="group bg-slate-900 rounded-[3.5rem] p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer text-white">
           <div className="bg-white/10 w-16 h-16 rounded-[2rem] flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
             <ImageIcon className="w-8 h-8" />
           </div>
           <h3 className="text-2xl font-black leading-none mb-2">{t.galleryTitle || "Orchard Gallery"}</h3>
           <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Farmer Photos</p>
           <div className="mt-8 flex items-center justify-between">
              <span className="text-[10px] font-black text-white uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full">View Media</span>
              <ChevronRight className="text-white/40 w-5 h-5" />
           </div>
        </div>
      </div>

      {/* Interactive Tool Grid (Attractive Small Icons) */}
      <div className="space-y-6">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-8">Essential Tools</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: <Calculator />, label: t.ledger || 'Ledger', onClick: onOpenToolbox, color: 'text-emerald-600 bg-emerald-50' },
            { icon: <Droplets />, label: t.sprayAlert || 'Sprays', onClick: () => onStartVoice('What is the best spray for today?'), color: 'text-blue-600 bg-blue-50' },
            { icon: <FlaskConical />, label: t.pesticides || 'Pesticides', onClick: onOpenEShop, color: 'text-purple-600 bg-purple-50' },
            { icon: <TrendingUp />, label: t.mandiRates || 'Mandi', onClick: onViewMarket, color: 'text-green-600 bg-green-50' },
            { icon: <CloudSun />, label: t.weather || 'Weather', onClick: onViewWeather, color: 'text-sky-600 bg-sky-50' },
            { icon: <Target />, label: t.storage || 'CA Store', onClick: onOpenToolbox, color: 'text-rose-600 bg-rose-50' }
          ].map((tool, i) => (
            <button key={i} onClick={tool.onClick} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 active:scale-95 group">
              <div className={`p-4 rounded-2xl ${tool.color} group-hover:scale-110 transition-transform`}>
                {React.cloneElement(tool.icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
              </div>
              <span className="text-[10px] font-black uppercase tracking-tight text-gray-500">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Expert Contact Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-4">
        <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex items-center shadow-3xl ring-4 ring-white/5">
          <div className="flex-1 px-8 flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-black text-sm shadow-xl">DT</div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-slate-900 rounded-full"></div>
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-green-400 uppercase tracking-widest leading-none">Senior Lead Expert</span>
               <span className="text-sm font-black text-white uppercase tracking-tighter mt-1">{settings.expertName}</span>
            </div>
          </div>
          <div className="flex gap-2 pr-2">
            <button onClick={() => window.open(phoneLink, '_self')} className="w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all"><PhoneCall className="w-6 h-6" /></button>
            <button onClick={() => window.open(waLink, '_blank')} className="bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-full flex items-center gap-2 font-black text-xs uppercase shadow-2xl transition-all active:scale-95">WHATSAPP</button>
          </div>
        </div>
      </div>
    </div>
  );
};
