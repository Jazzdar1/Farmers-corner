
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ArrowLeft, CloudSun, Loader2, MapPin, RefreshCw, Thermometer, Wind, Droplet } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales';

interface WeatherDashboardProps {
  onBack: () => void;
  language: Language;
  districts: string[];
}

interface WData {
  name: string;
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
}

export const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ onBack, language, districts }) => {
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WData[]>([]);
  const t = translations[language];

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const list = districts.join(', ');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{
          parts: [{
            text: `Find current weather for Kashmir districts: ${list}. 
            Format: [{ "name": "...", "temp": 18, "condition": "...", "humidity": 45, "wind": 12 }]`
          }]
        }],
        config: { tools: [{ googleSearch: {} }] }
      });
      const text = response.text || '';
      const match = text.match(/\[[\s\S]*\]/);
      if (match) setWeather(JSON.parse(match[0]));
    } catch (err) {
      console.error(err);
      setWeather(districts.map(d => ({ name: d, temp: 18, condition: "Sunny", humidity: 40, wind: 10 })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWeather(); }, [districts]);

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      <div className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 font-bold hover:text-green-600"><ArrowLeft className="w-5 h-5" /> {t.back}</button>
        <h2 className="font-black text-slate-900 tracking-tight">{t.weatherTitle}</h2>
        <button onClick={fetchWeather} className="p-2 text-green-600 hover:bg-green-50 rounded-full"><RefreshCw className={loading ? 'animate-spin' : ''} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-12 no-scrollbar pb-32">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center py-20"><Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" /><p className="text-slate-500 font-black tracking-widest uppercase text-xs">Sky Inspection...</p></div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {weather.map((w, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 group hover:shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3"><div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><MapPin /></div> <span className="font-black text-slate-900 text-lg uppercase tracking-tight">{w.name}</span></div>
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{w.condition}</span>
                </div>
                <div className="flex items-end gap-2 mb-10"><span className="text-6xl font-black text-slate-900">{w.temp}°</span><span className="text-slate-400 font-bold mb-2">C</span></div>
                <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-8">
                  <div className="flex items-center gap-2 text-blue-500 font-bold text-xs"><Droplet className="w-4 h-4" /> {w.humidity}% HMD</div>
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-xs"><Wind className="w-4 h-4" /> {w.wind} KM/H</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
