
import React, { useState, useEffect } from 'react';
import { Mic, Camera, Calendar, Apple, Youtube, Facebook, MessageCircle, Bug, Droplets, Sprout, Users, TrendingUp, Star, Play, ExternalLink, MessageSquare, Quote, BellRing, CloudSun, Wind, Droplet, ThermometerSun, MapPin, ChevronRight, Lightbulb, ShoppingCart, Store, Phone, Info, Target, Zap, PhoneCall } from 'lucide-react';
import { Language, User } from '../types';
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
}

export const Home: React.FC<HomeProps> = ({ user, language, onLanguageChange, onStartVoice, onStartScan, onBookAppointment, onStartCommunity, onViewWeather, onViewMarket, onOpenEShop }) => {
  const t = translations[language];
  const [showToast, setShowToast] = useState(false);
  
  const ytChannel = 'https://youtube.com/@farmerscorner.tech.?si=dbu1uevlRRx_b50A';
  const fbPage = 'https://www.facebook.com/share/1BrCbsdBk1/';
  const whatsappDar = 'https://wa.me/916006086915?text=Hi%20Dar%20Towseef,%20I%20need%20expert%20advice%20for%20my%20orchard.';
  const phoneDar = 'tel:+916006086915';

  const marketTicker = [
    { name: "Grade A Red Delicious", price: "₹1,250", trend: "up" },
    { name: "Gala Premium", price: "₹1,400", trend: "up" },
    { name: "Golden Delicious", price: "₹950", trend: "down" },
    { name: "Culinary Grade", price: "₹450", trend: "up" }
  ];

  const agriSchemes = [
    "HADDP: Holistic Agriculture Development Programme - JK Govt targeting 29 projects.",
    "PM-Kisan: 17th Installment released for eligible farmers.",
    "KCC: Interest subvention for timely repayment extended.",
    "National Horticulture Board (NHB): Subsidy on Cold Storage construction up to 35%.",
    "Mission Integrated Development of Horticulture (MIDH): Support for rejuvenation of old orchards.",
    "PM-FBY: Pradhan Mantri Fasal Bima Yojana - Apply for Kharif crop insurance now."
  ];

  const districtsWeather = [
    { name: "Srinagar", temp: 18, condition: "Partly Cloudy" },
    { name: "Shopian", temp: 14, condition: "Sunny" },
    { name: "Baramulla", temp: 16, condition: "Clear" },
    { name: "Anantnag", temp: 17, condition: "Haze" }
  ];

  const socialFeed = [
    { 
      platform: 'YouTube', 
      title: 'Advanced Apple Pruning 2024', 
      stats: '45K views • 2 weeks ago', 
      img: 'https://images.unsplash.com/photo-1594236053800-4b2075f782c5?auto=format&fit=crop&q=80&w=600',
      link: ytChannel
    },
    { 
      platform: 'Facebook', 
      title: 'Successful M9 Plantation Tour', 
      stats: '1.2K Likes • 3 days ago', 
      img: 'https://images.unsplash.com/photo-1592321675774-3de57f3ee0dc?auto=format&fit=crop&q=80&w=600',
      link: fbPage
    }
  ];

  const growerComments = [
    { author: "Mushtaq Ahmad", text: "The soil testing tool gave me exactly what I needed for my nitrogen deficiency. Saved my crop!", location: "Pulwama", rating: 5 },
    { author: "Irfan Lone", text: "Dar Towseef's suggestions on drip irrigation were a game changer for my M9 plantation.", location: "Baramulla", rating: 5 }
  ];

  const expertSuggestions = [
    { icon: <Lightbulb className="w-5 h-5 text-yellow-600" />, text: "Use Dormant Spray before the silver tip stage to prevent Scab.", category: "Spray" },
    { icon: <Droplet className="w-5 h-5 text-blue-600" />, text: "Irrigation frequency should be increased for young M9 plants in May.", category: "Watering" },
    { icon: <ShoppingCart className="w-5 h-5 text-green-600" />, text: "Current Mandi rates are peaking in Delhi for Grade A apples.", category: "Market" }
  ];

  const getSeasonalInfo = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return { stage: "Pink Bud / Bloom", task: "Ensure pollinizer bees are active and apply anti-scab spray." };
    if (month >= 5 && month <= 7) return { stage: "Fruit Sizing", task: "Monitor for Mites and ensure regular irrigation during dry spells." };
    if (month >= 8 && month <= 10) return { stage: "Harvest Season", task: "Focus on color development and proper post-harvest handling." };
    return { stage: "Dormancy / Pruning", task: "Prune trees for better sunlight penetration and apply copper spray." };
  };

  const seasonal = getSeasonalInfo();

  const handleToolClick = (feature: string) => {
    if (feature === 'Soil Testing') {
      onStartVoice("Tell me about soil testing for my apple orchard in Kashmir.");
    } else if (feature === 'Spray Guide') {
      onStartVoice("Give me a spray schedule for apple scab in current weather.");
    } else if (feature === 'Pest') {
      onStartVoice("Help me identify common apple pests in my area.");
    } else if (feature === 'High Density') {
      onStartVoice("How should I transition to high density apple plantation?");
    }
  };

  const handleSuggestionClick = (text: string) => {
    onStartVoice(`Expert suggestion: "${text}". Can you explain this in detail for my orchard?`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-12 h-full overflow-y-auto pb-48 no-scrollbar scroll-smooth">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <BellRing className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-bold">{t.comingSoon}</span>
        </div>
      )}

      {/* Govt Schemes Ticker */}
      <div className="bg-orange-50 rounded-3xl p-4 shadow-sm border border-orange-100 overflow-hidden relative">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-orange-600" />
          <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{t.schemesTicker}</span>
        </div>
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {[...agriSchemes, ...agriSchemes].map((scheme, i) => (
            <div key={i} className="inline-flex items-center gap-2">
              <span className="text-sm font-black text-gray-800">• {scheme}</span>
              <button 
                onClick={() => onStartVoice(`Tell me more about this scheme: ${scheme}`)}
                className="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter hover:bg-orange-700 transition-colors"
              >
                {t.viewScheme}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Seasonal Advisor Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl animate-in fade-in slide-in-from-top-6 duration-700">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10">
              <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" /> {t.seasonalFocus}
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              {t.orchardStage}: <span className="text-emerald-200">{seasonal.stage}</span>
            </h2>
            <p className="text-emerald-50 text-base font-medium opacity-90 max-w-xl">
              {seasonal.task} Stay updated with current weather forecasts before any field application.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <button onClick={() => handleToolClick('Spray Guide')} className="bg-white text-emerald-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all active:scale-95 shadow-lg">
                Get Advisory
              </button>
              <button onClick={() => onStartVoice(`What are the key requirements for ${seasonal.stage} stage?`)} className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all border border-white/20 active:scale-95">
                Ask AI Assistant
              </button>
            </div>
          </div>
          <div className="shrink-0 bg-white/10 p-8 rounded-[3rem] backdrop-blur-xl border border-white/20 group-hover:rotate-6 transition-transform">
             <Target className="w-20 h-20 text-white/40" />
          </div>
        </div>
      </div>

      {/* Market Ticker */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-green-50 overflow-hidden relative group cursor-pointer hover:border-green-200 transition-all" onClick={onViewMarket}>
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.marketWatch}</span>
        </div>
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...marketTicker, ...marketTicker].map((rate, i) => (
            <div key={i} className="inline-flex items-center gap-2">
              <span className="text-sm font-bold text-gray-700">{rate.name}:</span>
              <span className="text-sm font-black text-green-600">{rate.price}</span>
              <span className={rate.trend === 'up' ? 'text-green-500 text-[10px]' : 'text-red-500 text-[10px]'}>
                {rate.trend === 'up' ? '▲' : '▼'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              <Star className="w-3 h-3 fill-green-800" /> KASHMIR'S SMART AGRICULTURE
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">
              {user ? (
                <>{t.welcome}, <span className="text-green-600 underline decoration-green-100 underline-offset-8">{user.name.split(' ')[0]}</span>!</>
              ) : (
                t.heroTitle
              )}
            </h2>
            <p className="mt-4 text-xl text-gray-500 leading-relaxed max-w-2xl font-medium">
              {t.heroDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <button 
              onClick={onStartScan}
              className="group relative bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 p-6 rounded-[2.5rem] font-black text-xl transition-all flex flex-col items-center gap-4 shadow-xl shadow-green-900/5 active:scale-95"
            >
              <div className="bg-green-100 p-5 rounded-3xl group-hover:scale-110 transition-transform">
                <Camera className="w-12 h-12" />
              </div>
              {t.scanBtn}
            </button>
            <button 
              onClick={() => onStartVoice()}
              className="group relative bg-green-600 hover:bg-green-700 text-white p-6 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-green-900/20 transition-all flex flex-col items-center gap-4 active:scale-95"
            >
              <div className="bg-white/20 p-5 rounded-3xl group-hover:scale-110 transition-transform backdrop-blur-sm">
                <Mic className="w-12 h-12 group-hover:animate-pulse" />
              </div>
              {t.voiceBtn}
            </button>
          </div>
        </div>

        {/* Real-time Weather Section */}
        <div className="lg:col-span-4 space-y-4 animate-in fade-in slide-in-from-right-8 duration-700">
          <div 
            onClick={onViewWeather}
            className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-gray-100 overflow-hidden relative group cursor-pointer hover:shadow-2xl transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-700 opacity-50"></div>
            <div className="relative z-10">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-blue-500" /> {t.weatherTitle}
              </h3>
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-5xl font-black text-gray-900 flex items-start">
                    18<span className="text-2xl mt-1">°C</span>
                  </p>
                  <p className="text-blue-600 font-black uppercase text-xs mt-1">SRINAGAR • CLEAR</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-3xl">
                  <ThermometerSun className="w-10 h-10 text-blue-600" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50 mb-4">
                <div className="flex items-center gap-3">
                  <Droplet className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{t.humidity}</p>
                    <p className="text-sm font-black text-gray-800">45%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Wind className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{t.wind}</p>
                    <p className="text-sm font-black text-gray-800">12 km/h</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-blue-600 font-black text-xs uppercase group-hover:translate-x-1 transition-transform">
                View All Districts <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-100 max-h-60 overflow-y-auto no-scrollbar">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">{t.forecast}</h4>
            <div className="space-y-2">
              {districtsWeather.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors cursor-pointer" onClick={onViewWeather}>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    <span className="text-sm font-bold text-gray-800">{d.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase">{d.condition}</span>
                    <span className="text-sm font-black text-gray-900">{d.temp}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[
          { icon: <Bug />, title: t.pestAlert, desc: t.pestDesc, color: 'text-orange-600', bg: 'bg-orange-50', feature: 'Pest' },
          { icon: <Droplets />, title: t.sprayGuide, desc: t.sprayDesc, color: 'text-blue-600', bg: 'bg-blue-50', feature: 'Spray Guide' },
          { icon: <Apple />, title: t.highDensity, desc: t.hdDesc, color: 'text-red-600', bg: 'bg-red-50', feature: 'High Density' },
          { icon: <Sprout />, title: t.soilReports, desc: t.soilDesc, color: 'text-emerald-600', bg: 'bg-emerald-50', feature: 'Soil Testing' },
          { icon: <Store />, title: t.eshopTitle, desc: t.eshopDesc, color: 'text-purple-600', bg: 'bg-purple-50', feature: 'EShop' }
        ].map((item, idx) => (
          <div 
            key={idx} 
            onClick={() => {
              if (item.feature === 'EShop') onOpenEShop();
              else handleToolClick(item.feature);
            }}
            className={`${item.bg} p-6 rounded-[2.5rem] border-2 border-transparent hover:border-white transition-all cursor-pointer group shadow-sm hover:shadow-2xl hover:-translate-y-1 active:scale-95`}
          >
            <div className={`${item.color} mb-4 group-hover:rotate-12 transition-transform w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-lg`}>
              {React.cloneElement(item.icon as React.ReactElement, { className: "w-8 h-8" })}
            </div>
            <h3 className="font-black text-gray-900 text-base leading-tight">{item.title}</h3>
            <p className="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-tighter opacity-70">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Mandi Rates Quick Access */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group cursor-pointer active:scale-95 transition-all" onClick={onViewMarket}>
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex items-center gap-6">
          <div className="bg-white/20 p-5 rounded-[2rem] backdrop-blur-md">
            <TrendingUp className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight">{t.liveMandi}</h3>
            <p className="text-green-100 font-medium opacity-80">Track apple prices in Srinagar, Sopore, Delhi & Mumbai Mandis.</p>
          </div>
        </div>
        <button className="bg-white text-green-700 px-8 py-4 rounded-2xl font-black uppercase text-sm shadow-xl hover:bg-green-50 transition-colors whitespace-nowrap">
          {t.viewMarket}
        </button>
      </div>

      {/* Suggestions & Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" /> {t.expertSuggestions}
          </h3>
          <div className="space-y-4">
            {expertSuggestions.map((sug, i) => (
              <div 
                key={i} 
                onClick={() => handleSuggestionClick(sug.text)}
                className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex gap-4 items-start group hover:shadow-md hover:border-green-100 transition-all cursor-pointer active:scale-95"
              >
                <div className="shrink-0 p-3 bg-gray-50 rounded-2xl group-hover:bg-yellow-50 transition-colors">
                  {sug.icon}
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-1">{sug.category}</p>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">{sug.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-600" /> {t.latestContent}
            </h3>
            <button onClick={() => window.open(ytChannel, '_blank')} className="text-xs font-black text-red-600 uppercase hover:underline">View All</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {socialFeed.map((post, i) => (
              <div key={i} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col cursor-pointer hover:shadow-2xl active:scale-95 transition-all" onClick={() => window.open(post.link, '_blank')}>
                <div className="relative aspect-video overflow-hidden">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 p-3 rounded-full shadow-2xl">
                      <Play className="w-6 h-6 text-red-600 fill-red-600" />
                    </div>
                  </div>
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase text-white ${post.platform === 'YouTube' ? 'bg-red-600' : 'bg-blue-600'}`}>
                    {post.platform}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-black text-gray-900 leading-tight mb-2 group-hover:text-green-600 transition-colors">{post.title}</h4>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{post.stats}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Buzz */}
      <div className="space-y-6 pb-24">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" /> {t.communityBuzz}
          </h3>
          <button onClick={onStartCommunity} className="text-xs font-black text-green-600 uppercase hover:underline">Join Square</button>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-green-50 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full -mr-32 -mt-32 opacity-30"></div>
          {growerComments.map((buzz, i) => (
            <div key={i} className="relative z-10 space-y-4">
              <div className="flex gap-4 items-start">
                <div className="shrink-0 bg-green-100 w-12 h-12 rounded-2xl flex items-center justify-center">
                  <Quote className="w-6 h-6 text-green-600 opacity-50" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700 leading-relaxed italic">"{buzz.text}"</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black text-green-600 uppercase text-xs">
                      {buzz.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900">{buzz.author}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{buzz.location} Grower</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[...Array(buzz.rating)].map((_, j) => (
                        <Star key={j} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {i < growerComments.length - 1 && <div className="border-b border-gray-50 pt-4"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Unified Expert Hub (Floating Rounded Dock) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4">
        <div className="bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-[3rem] p-2 flex items-center shadow-2xl shadow-black/40 ring-1 ring-white/5 animate-in slide-in-from-bottom-12 duration-700">
          <div className="flex-1 flex items-center gap-3 px-4">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-green-400 uppercase tracking-widest leading-none">{t.liveNow}</span>
              <span className="text-[11px] font-bold text-white uppercase tracking-tighter mt-1">DAR TOWSEEF</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-[2.5rem]">
            <button 
              onClick={() => window.open(phoneDar, '_self')}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all active:scale-90 shadow-lg"
              title={t.callLead}
            >
              <PhoneCall className="w-5 h-5" />
            </button>
            <button 
              onClick={() => window.open(whatsappDar, '_blank')}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-[2.25rem] flex items-center gap-2 font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-green-500/20"
            >
              <MessageCircle className="w-4 h-4" /> {t.callExpert}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 pt-12 border-t border-gray-100 mb-20">
        <span className="text-xs font-black text-gray-300 uppercase tracking-[0.3em]">{t.connect}</span>
        <div className="flex gap-4">
          <a href={ytChannel} target="_blank" className="bg-red-600 text-white p-4 rounded-[1.5rem] hover:scale-110 transition-transform shadow-xl"><Youtube /></a>
          <a href={fbPage} target="_blank" className="bg-blue-700 text-white p-4 rounded-[1.5rem] hover:scale-110 transition-transform shadow-xl"><Facebook /></a>
          <a href="https://wa.me/916006086915" target="_blank" className="bg-green-500 text-white p-4 rounded-[1.5rem] hover:scale-110 transition-transform shadow-xl"><MessageCircle /></a>
        </div>
      </div>
    </div>
  );
};
