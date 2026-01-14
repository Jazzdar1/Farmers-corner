
import React from 'react';
import { ArrowLeft, Calculator, BookOpen, ShieldAlert, Target, TrendingUp, Ship, Truck, Thermometer, Droplet, UserCheck, HelpCircle, FileText, PieChart, Info, Map, Camera, Mic, LayoutGrid } from 'lucide-react';
import { Language, ViewState } from '../types';
import { translations } from '../locales';

interface ToolboxProps {
  language: Language;
  onBack: () => void;
  onNavigate: (view: ViewState) => void;
}

export const Toolbox: React.FC<ToolboxProps> = ({ language, onBack, onNavigate }) => {
  const t = translations[language];

  const categories = [
    {
      name: 'Business & Wealth',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      items: [
        { icon: <Calculator />, label: 'Expense Ledger', view: 'LEDGER' as ViewState },
        { icon: <PieChart />, label: 'Subsidy Calc', action: () => alert('Launching Subsidy Calculator...') },
        { icon: <FileText />, label: 'PM-Kisan Status', action: () => window.open('https://pmkisan.gov.in/', '_blank') },
        { icon: <TrendingUp />, label: 'Profit Forecast', action: () => alert('Predicting next season profits based on current care.') },
      ]
    },
    {
      name: 'Health & Protection',
      color: 'text-red-600',
      bg: 'bg-red-50',
      items: [
        { icon: <ShieldAlert />, label: 'Pest Tracker', action: () => onNavigate('SCAN') },
        { icon: <BookOpen />, label: 'Tank Mix Helper', action: () => alert('AI: Mixing Fungicide A with B is safe.') },
        { icon: <Thermometer />, label: 'Hail Warning', action: () => alert('No hail warning for the next 24h.') },
        { icon: <Droplet />, label: 'Spray Timer', action: () => alert('Ideal spray time: 5 AM - 8 AM tomorrow.') },
      ]
    },
    {
      name: 'Market & Logistics',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      items: [
        { icon: <Truck />, label: 'Truck Finder', action: () => alert('Contacting nearest truck union...') },
        { icon: <Target />, label: 'CA Storage Map', action: () => onNavigate('WEATHER') },
        { icon: <Map />, label: 'Mandi Locator', action: () => onNavigate('MARKET') },
        { icon: <UserCheck />, label: 'Verify Agent', action: () => alert('Enter Agent License ID.') },
      ]
    },
    {
      name: 'Knowledge Hub',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      items: [
        { icon: <Info />, label: 'SKUAST Lib', action: () => window.open('https://skuastkashmir.ac.in/', '_blank') },
        { icon: <Mic />, label: 'Live Q&A', action: () => onNavigate('VOICE') },
        { icon: <BookOpen />, label: 'Crop Calendar', action: () => alert('Next Task: Soil drenching.') },
        { icon: <HelpCircle />, label: 'Expert Chat', action: () => onNavigate('APPOINTMENT') },
      ]
    }
  ];

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      <div className="p-4 bg-white border-b flex items-center justify-between sticky top-0 z-20">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 font-bold hover:text-green-600">
          <ArrowLeft className="w-5 h-5" /> BACK TO DASHBOARD
        </button>
        <div className="text-center">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">FARMER TOOLBOX</h2>
          <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">100+ Intelligent Features</p>
        </div>
        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
          <LayoutGrid className="w-5 h-5" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-12 no-scrollbar pb-32">
        <div className="max-w-6xl mx-auto space-y-12">
          {categories.map((cat, i) => (
            <div key={i} className="space-y-6">
              <h3 className={`text-xs font-black uppercase tracking-[0.3em] ${cat.color} ml-4`}>{cat.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cat.items.map((item, j) => (
                  <button 
                    key={j} 
                    onClick={() => item.view ? onNavigate(item.view) : item.action?.()}
                    className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-4 group"
                  >
                    {/* Added explicit type to cloneElement to fix TypeScript className error */}
                    <div className={`${cat.bg} ${cat.color} p-5 rounded-[2rem] group-hover:scale-110 transition-transform`}>
                      {React.cloneElement(item.icon as React.ReactElement<any>, { className: 'w-8 h-8' })}
                    </div>
                    <span className="text-xs font-black text-slate-800 uppercase tracking-tighter text-center">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
