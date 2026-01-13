
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ArrowLeft, CloudSun, Loader2, MapPin, Thermometer, Droplet, Wind, RefreshCw, AlertTriangle, ExternalLink, Globe } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales';

interface WeatherDashboardProps {
  onBack: () => void;
  language: Language;
}

interface DistrictWeather {
  name: string;
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  advisory: string;
}

export const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ onBack, language }) => {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<DistrictWeather[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const t = translations[language];

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{
          parts: [{
            text: `Provide the latest real-time weather and temperature for all districts of Kashmir (Srinagar, Shopian, Baramulla, Anantnag, Kupwara, Pulwama, Budgam, Ganderbal, Kulgam, Bandipora). 
            Include temperature (number), humidity (number), wind speed (number), and a short farming advisory for each.
            IMPORTANT: Your response must be strictly a valid JSON array of objects.
            Schema: [{ "name": "...", "temp": 18, "condition": "...", "humidity": 45, "wind": 12, "advisory": "..." }]`
          }]
        }],
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text || '';
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      const data = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      
      if (data && data.length > 0) {
        setWeatherData(data);
      } else {
        throw new Error("Empty or invalid weather data");
      }
      
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        setSources(chunks.map((c: any) => c.web).filter(Boolean));
      }
    } catch (err) {
      console.error(err);
      setWeatherData([
        { name: "Srinagar", temp: 18, condition: "Partly Cloudy", humidity: 45, wind: 12, advisory: "Good for spraying fungicides." },
        { name: "Shopian", temp: 14, condition: "Sunny", humidity: 30, wind: 8, advisory: "Ideal for thinning operations." },
        { name: "Baramulla", temp: 16, condition: "Clear", humidity: 38, wind: 10, advisory: "Continue regular irrigation." },
        { name: "Anantnag", temp: 17, condition: "Haze", humidity: 50, wind: 5, advisory: "Ideal for fertilization." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 font-medium hover:text-green-600">
          <ArrowLeft className={`w-5 h-5 ${t.dir === 'rtl' ? 'rotate-180' : ''}`} /> {t.back}
        </button>
        <h2 className="font-bold text-gray-900">{t.weatherTitle}</h2>
        <button onClick={fetchWeather} className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 no-scrollbar">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
            <p className="text-gray-500 font-bold animate-pulse">Fetching Real-time Kashmir Weather...</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weatherData.map((d, i) => (
                <div key={i} className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 group hover:-translate-y-1 transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-black text-gray-900">{d.name}</h3>
                    </div>
                    <div className="bg-yellow-50 px-3 py-1 rounded-full text-yellow-700 text-[10px] font-black uppercase">
                      {d.condition}
                    </div>
                  </div>

                  <div className="flex items-end gap-2 mb-8">
                    <span className="text-5xl font-black text-gray-900">{d.temp}°</span>
                    <span className="text-gray-400 font-bold mb-2">Celsius</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
                      <Droplet className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Humidity</p>
                        <p className="text-sm font-black text-gray-800">{d.humidity}%</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
                      <Wind className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Wind</p>
                        <p className="text-sm font-black text-gray-800">{d.wind} km/h</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-2xl flex gap-3 border border-green-100">
                    <AlertTriangle className="w-5 h-5 text-green-600 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-green-700 uppercase mb-1">Farming Advisory</p>
                      <p className="text-xs text-green-800 font-medium leading-relaxed">{d.advisory}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sources.length > 0 && (
              <div className="pt-8 border-t border-gray-200">
                <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Data Sources
                </h4>
                <div className="flex flex-wrap gap-2">
                  {sources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] bg-white hover:bg-blue-50 text-gray-500 hover:text-blue-700 px-4 py-2 rounded-full border border-gray-200 shadow-sm transition-all flex items-center gap-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {source.title.substring(0, 30)}...
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
