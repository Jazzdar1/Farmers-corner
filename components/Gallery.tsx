
import React from 'react';
import { ArrowLeft, Camera, Heart, MessageCircle, Share2, Sparkles, Filter } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales';

interface GalleryProps {
  language: Language;
  onBack: () => void;
}

const GALLERY_ITEMS = [
  { id: 1, url: 'https://images.unsplash.com/photo-1594236053800-4b2075f782c5?auto=format&fit=crop&q=80&w=800', author: 'Bilal Ahmad', location: 'Shopian', likes: 142 },
  { id: 2, url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=800', author: 'Suhail Dar', location: 'Sopore', likes: 89 },
  { id: 3, url: 'https://images.unsplash.com/photo-1615485290382-441e4d029cb5?auto=format&fit=crop&q=80&w=800', author: 'Mushtaq Sofi', location: 'Pulwama', likes: 210 },
  { id: 4, url: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&q=80&w=800', author: 'Arshid Malik', location: 'Anantnag', likes: 56 },
  { id: 5, url: 'https://images.unsplash.com/photo-1591932314546-249567c8702c?auto=format&fit=crop&q=80&w=800', author: 'Zahid Khan', location: 'Baramulla', likes: 112 },
  { id: 6, url: 'https://images.unsplash.com/photo-1494253109108-2e30c049369b?auto=format&fit=crop&q=80&w=800', author: 'Feroz Bhat', location: 'Kupwara', likes: 334 },
];

export const Gallery: React.FC<GalleryProps> = ({ language, onBack }) => {
  const t = translations[language];

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      <div className="p-4 bg-white border-b flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 font-bold hover:text-green-600">
          <ArrowLeft className="w-5 h-5" /> {t.back}
        </button>
        <div className="text-center">
           <h2 className="text-xl font-black text-slate-900 tracking-tight">FARMERS CORNER GALLERY</h2>
           <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Kashmir's Finest Produce</p>
        </div>
        <button className="p-3 bg-slate-100 rounded-2xl text-slate-400 hover:text-green-600 transition-colors">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-12 no-scrollbar pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {GALLERY_ITEMS.map((item) => (
              <div key={item.id} className="group relative bg-white rounded-[3rem] overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl transition-all animate-in fade-in zoom-in duration-500">
                <div className="aspect-[4/5] overflow-hidden bg-slate-100">
                  <img src={item.url} alt="Orchard" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                
                {/* Meta info shown on hover or as a caption */}
                <div className="p-6">
                   <div className="flex items-center justify-between mb-4">
                      <div>
                         <p className="font-black text-slate-900 text-sm uppercase">{item.author}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.location}</p>
                      </div>
                      <div className="flex items-center gap-2 text-rose-500">
                        <Heart className="w-4 h-4 fill-rose-500" />
                        <span className="text-xs font-black">{item.likes}</span>
                      </div>
                   </div>
                   <div className="flex gap-2">
                     <button className="flex-1 bg-slate-50 text-slate-600 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-50 hover:text-green-600 transition-colors">COMMENT</button>
                     <button className="bg-slate-50 text-slate-600 p-3 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-colors"><Share2 className="w-4 h-4" /></button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-12 right-12 z-50">
        <button className="bg-green-600 text-white w-20 h-20 rounded-[2.5rem] shadow-3xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-green-900/40 border-4 border-white">
          <Camera className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};
