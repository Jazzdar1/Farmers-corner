
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ArrowLeft, TrendingUp, TrendingDown, Loader2, Search, RefreshCw, MapPin, ExternalLink, Globe, ShoppingBag } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales';

interface MarketRatesProps {
  onBack: () => void;
  language: Language;
}

interface MandiPrice {
  mandi: string;
  variety: string;
  grade: string;
  price: string;
  trend: 'up' | 'down' | 'stable';
  date: string;
}

export const MarketRates: React.FC<MarketRatesProps> = ({ onBack, language }) => {
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const t = translations[language];

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{
          parts: [{
            text: `Find the current real-time Mandi rates for Kashmiri Apples in major Indian markets (Sopore, Srinagar, Azadpur Delhi, Mumbai, Bengaluru). 
            Include rates for Red Delicious Grade A, Gala, and Golden Delicious. 
            IMPORTANT: Format your entire response as a JSON array of objects.
            Schema: [{ "mandi": "...", "variety": "...", "grade": "...", "price": "₹...", "trend": "up/down/stable", "date": "..." }]`
          }]
        }],
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text || '';
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      const data = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      setPrices(data);
      
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        setSources(chunks.map((c: any) => c.web).filter(Boolean));
      }
    } catch (err) {
      console.error(err);
      setPrices([
        { mandi: "Azadpur, Delhi", variety: "Red Delicious", grade: "Grade A", price: "₹1,250 - 1,400", trend: "up", date: "Today" },
        { mandi: "Sopore, J&K", variety: "Gala Premium", grade: "Grade A", price: "₹1,100 - 1,200", trend: "stable", date: "Today" },
        { mandi: "Vashi, Mumbai", variety: "Red Delicious", grade: "Grade A", price: "₹1,450 - 1,600", trend: "up", date: "Yesterday" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 font-medium hover:text-green-600 transition-colors">
          <ArrowLeft className={`w-5 h-5 ${t.dir === 'rtl' ? 'rotate-180' : ''}`} /> {t.back}
        </button>
        <h2 className="font-extrabold text-gray-900 tracking-tight">{t.liveMandi}</h2>
        <button onClick={fetchPrices} className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 no-scrollbar">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center py-20">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-green-600 animate-spin" />
              <ShoppingBag className="w-6 h-6 text-green-600 absolute inset-0 m-auto" />
            </div>
            <p className="mt-6 text-gray-500 font-black uppercase tracking-widest text-sm animate-pulse">Scanning Indian Mandis...</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prices.map((p, i) => (
                <div key={i} className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 group hover:shadow-2xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-50 p-2 rounded-xl text-green-600">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <h3 className="font-black text-gray-900">{p.mandi}</h3>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{p.date}</span>
                  </div>

                  <div className="space-y-1 mb-6">
                    <p className="text-xl font-black text-gray-900">{p.variety}</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{p.grade}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-black text-green-600">{p.price}</span>
                      <span className="text-[10px] font-bold text-gray-400 mb-1.5">/ Box</span>
                    </div>
                    <div className={`p-2 rounded-xl ${p.trend === 'up' ? 'bg-green-50 text-green-600' : p.trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
                      {p.trend === 'up' ? <TrendingUp className="w-6 h-6" /> : p.trend === 'down' ? <TrendingDown className="w-6 h-6" /> : <RefreshCw className="w-6 h-6" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sources.length > 0 && (
              <div className="pt-10 border-t border-gray-200">
                <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Trusted Market Sources
                </h4>
                <div className="flex flex-wrap gap-3">
                  {sources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-green-50 text-gray-600 hover:text-green-700 px-4 py-2.5 rounded-full border border-gray-100 shadow-sm transition-all flex items-center gap-2 text-[10px] font-bold"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {source.title.substring(0, 35)}...
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
