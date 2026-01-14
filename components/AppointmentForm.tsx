
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Calendar, User, Phone, MapPin, CheckCircle2, MessageCircle, Clock, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales';

interface AppointmentFormProps {
  onBack: () => void;
  language: Language;
  locations: Record<string, string[]>;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ onBack, language, locations }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    state: Object.keys(locations)[0] || 'Jammu & Kashmir',
    district: (locations[Object.keys(locations)[0]] || [''])[0] || 'Shopian',
    date: ''
  });
  
  const t = translations[language];

  const districts = useMemo(() => {
    return locations[formData.state] || [];
  }, [formData.state, locations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Assalam Alaikum Farmers Corner,\n\nExpert session request:\n👤 Name: ${formData.name}\n📍 Loc: ${formData.district}, ${formData.state}\n📅 Date: ${formData.date}`;
    window.open(`https://wa.me/916006086915?text=${encodeURIComponent(message)}`, '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-6 bg-gray-50 text-center animate-in fade-in duration-700">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-green-50">
          <div className="bg-green-600 p-12 text-white relative">
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-white/20 p-6 rounded-full mb-6 backdrop-blur-md animate-bounce"><CheckCircle2 className="w-16 h-16 text-white" /></div>
              <h2 className="text-3xl font-black tracking-tight mb-2">Request Sent!</h2>
              <p className="text-green-100 font-medium opacity-80 text-sm">Our expert will contact you on WhatsApp shortly.</p>
            </div>
          </div>
          <div className="p-8"><button onClick={onBack} className="w-full py-5 text-gray-400 font-black uppercase text-xs tracking-widest hover:text-green-600 transition-colors">Return to Dashboard</button></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 flex flex-col">
      <div className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 font-medium hover:text-green-600 transition-colors">
          <ArrowLeft className={`w-5 h-5 ${t.dir === 'rtl' ? 'rotate-180' : ''}`} /> {t.back}
        </button>
        <h2 className="font-black text-gray-900 tracking-tight">{t.bookBtn}</h2>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-12 no-scrollbar">
        <div className="max-w-xl mx-auto">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 animate-in slide-in-from-bottom-8">
            <h3 className="text-2xl font-black text-gray-900 mb-8">{t.appointmentTitle}</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t.fullName}</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-green-500 outline-none transition-all font-bold" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t.location}</label>
                  <select value={formData.state} onChange={(e) => {
                    const s = e.target.value;
                    setFormData({...formData, state: s, district: (locations[s] || [''])[0]});
                  }} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent outline-none font-bold">
                    {Object.keys(locations).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t.district}</label>
                  <select value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent outline-none font-bold">
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t.date}</label>
                <input required type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent outline-none font-bold" />
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-green-700 active:scale-95 transition-all">{t.confirmBtn}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
