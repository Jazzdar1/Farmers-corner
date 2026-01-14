
import React, { useState } from 'react';
import { ArrowLeft, Search, ShieldAlert, FlaskConical, Bug, Leaf, Info, ChevronRight, Mic } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales';

interface DiseaseLibraryProps {
  language: Language;
  onBack: () => void;
  onConsult: (prompt: string) => void;
}

const DISEASES = [
  { id: 1, name: 'Apple Scab', type: 'Fungal', symptom: 'Olive-green to black spots on leaves.', treatment: 'Dodine, Captan, or Myclobutanil.', schedule: 'Silver Tip to Petal Fall' },
  { id: 2, name: 'Alternaria Leaf Blotch', type: 'Fungal', symptom: 'Small, circular, brown spots on leaves.', treatment: 'Ziram or Mancozeb.', schedule: 'Fruit Development' },
  { id: 3, name: 'San Jose Scale', type: 'Pest', symptom: 'Greyish scales on bark and fruit.', treatment: 'Horticultural Mineral Oil (HMO).', schedule: 'Dormant Stage' },
  { id: 4, name: 'European Red Mite', type: 'Pest', symptom: 'Bronzing of leaves.', treatment: 'Hexythiazox or Clofentezine.', schedule: 'Summer Months' },
  { id: 5, name: 'Powdery Mildew', type: 'Fungal', symptom: 'White powdery coating on shoots.', treatment: 'Sulphur or Penconazole.', schedule: 'Pink Bud to Fruit Set' },
  { id: 6, name: 'Marssonina Blotch', type: 'Fungal', symptom: 'Premature leaf fall, black spots.', treatment: 'Propineb or Tebuconazole.', schedule: 'Rainy Season' }
];

export const DiseaseLibrary: React.FC<DiseaseLibraryProps> = ({ language, onBack, onConsult }) => {
  const [search, setSearch] = useState('');
  const t = translations[language];

  const filtered = DISEASES.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      <div className="p-8 bg-white border-b flex flex-col gap-6 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-600 font-bold hover:text-green-600 transition-colors">
            <ArrowLeft className="w-5 h-5" /> {t.back}
          </button>
          <div className="text-center">
             <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Disease & Pest Library</h2>
             <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">SKUAST-K Verified Profiles</p>
          </div>
          <div className="w-8" />
        </div>
        
        <div className="relative max-w-2xl mx-auto w-full">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
           <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-5 pl-16 pr-8 font-bold outline-none focus:ring-4 focus:ring-red-100 transition-all shadow-inner"
              placeholder="Search by disease name or pest type..."
           />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-12 no-scrollbar pb-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
           {filtered.map((d) => (
             <div key={d.id} className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-50 hover:shadow-2xl transition-all group animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${d.type === 'Pest' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>
                         {d.type === 'Pest' ? <Bug className="w-7 h-7" /> : <ShieldAlert className="w-7 h-7" />}
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-slate-900 leading-none">{d.name}</h3>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.type} Profile</span>
                      </div>
                   </div>
                   <button 
                     onClick={() => onConsult(`Tell me about ${d.name} and its SKUAST-K recommended spray.`)}
                     className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-green-600 transition-all shadow-lg active:scale-95"
                   >
                     <Mic className="w-5 h-5" />
                   </button>
                </div>

                <div className="space-y-6">
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Info className="w-3 h-3" /> Visual Symptom</h4>
                      <p className="text-sm font-bold text-slate-700 leading-relaxed">{d.symptom}</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 rounded-3xl bg-blue-50/50 border border-blue-100">
                         <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2"><FlaskConical className="w-3 h-3" /> Treatment</h4>
                         <p className="text-[11px] font-black text-blue-900">{d.treatment}</p>
                      </div>
                      <div className="p-5 rounded-3xl bg-green-50/50 border border-green-100">
                         <h4 className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Leaf className="w-3 h-3" /> Spray Window</h4>
                         <p className="text-[11px] font-black text-green-900">{d.schedule}</p>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => onConsult(`I suspect my apples have ${d.name}. What should I do?`)}
                  className="w-full mt-8 py-4 bg-slate-50 text-slate-400 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                >
                  View Full Research Report <ChevronRight className="inline-block w-3 h-3 ml-1" />
                </button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
