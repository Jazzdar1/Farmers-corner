
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Calendar, User, Phone, MapPin, CheckCircle2, MessageCircle, Clock, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales';

interface AppointmentFormProps {
  onBack: () => void;
  language: Language;
}

const LOCATIONS = {
  "Jammu & Kashmir": [
    "Srinagar", "Anantnag", "Baramulla", "Shopian", "Pulwama", "Budgam", "Kulgam", 
    "Ganderbal", "Kupwara", "Bandipora", "Sopore", "Ramban", "Reasi", "Doda"
  ],
  "Himachal Pradesh": [
    "Shimla", "Kullu", "Kinnaur", "Mandi", "Chamba", "Sirmaur", "Lahaul & Spiti"
  ],
  "Uttarakhand": [
    "Uttarkashi", "Almora", "Nainital", "Chamoli", "Pithoragarh", "Tehri Garhwal", "Pauri Garhwal"
  ],
  "Arunachal Pradesh": [
    "Tawang", "West Kameng", "Lower Subansiri"
  ],
  "Sikkim": [
    "North Sikkim", "West Sikkim"
  ],
  "Nagaland": [
    "Kohima", "Phek"
  ]
};

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ onBack, language }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    state: 'Jammu & Kashmir',
    district: 'Shopian',
    date: ''
  });
  
  const t = translations[language];

  const districts = useMemo(() => {
    return LOCATIONS[formData.state as keyof typeof LOCATIONS] || [];
  }, [formData.state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `Assalam Alaikum Farmers Corner,\n\nI want to book an expert session with DAR TOWSEEF.\n\n👤 Name: ${formData.name}\n📞 Phone: ${formData.phone}\n📍 State: ${formData.state}\n🏘️ District: ${formData.district}\n📅 Preferred Date: ${formData.date}\n\nPlease confirm my slot.`;
    
    const whatsappUrl = `https://wa.me/916006086915?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-6 bg-gray-50 text-center animate-in fade-in duration-700">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-green-50">
          <div className="bg-green-600 p-12 text-white relative">
            <div className="absolute inset-0 bg-white/5 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-white/20 p-6 rounded-full mb-6 backdrop-blur-md ring-8 ring-white/10 animate-bounce">
                <CheckCircle2 className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-2">Request Sent!</h2>
              <p className="text-green-100 font-medium opacity-80 text-sm">Your details have been shared with our experts via WhatsApp.</p>
            </div>
          </div>
          
          <div className="p-8 space-y-8 text-left">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Summary of Request</h3>
              <div className="bg-gray-50 rounded-3xl p-6 space-y-4 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-xl border border-gray-100"><User className="w-4 h-4 text-green-600" /></div>
                  <span className="text-sm font-black text-gray-800">{formData.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-xl border border-gray-100"><MapPin className="w-4 h-4 text-green-600" /></div>
                  <span className="text-sm font-bold text-gray-600">{formData.district}, {formData.state}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-xl border border-gray-100"><Clock className="w-4 h-4 text-green-600" /></div>
                  <span className="text-sm font-bold text-gray-600">{formData.date || 'To be discussed'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.open(`https://wa.me/916006086915`, '_blank')}
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-green-900/10 hover:bg-[#128C7E] transition-all active:scale-95"
              >
                <MessageCircle className="w-6 h-6" /> Open WhatsApp Again
              </button>
              <button 
                onClick={onBack} 
                className="w-full py-5 text-gray-400 font-black uppercase text-xs tracking-widest hover:text-green-600 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-xs text-gray-400 font-medium max-w-xs leading-relaxed">
          An expert will typically respond within 2-4 hours. Please keep your orchard photos ready for discussion.
        </p>
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
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-green-100 p-4 rounded-3xl">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{t.appointmentTitle}</h3>
                <p className="text-gray-400 font-medium text-sm">Schedule a 1-on-1 session with Dar Towseef</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <User className="w-3 h-3 text-green-600" /> {t.fullName}
                </label>
                <input 
                  required 
                  type="text" 
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-green-500 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Phone className="w-3 h-3 text-green-600" /> {t.mobile}
                </label>
                <input 
                  required 
                  type="tel" 
                  placeholder="Enter your 10 digit number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-green-500 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300" 
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-green-600" /> {t.location}
                  </label>
                  <select 
                    value={formData.state}
                    onChange={(e) => {
                      const newState = e.target.value;
                      setFormData({
                        ...formData, 
                        state: newState,
                        district: LOCATIONS[newState as keyof typeof LOCATIONS][0]
                      });
                    }}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-green-500 outline-none transition-all font-bold text-gray-800 cursor-pointer appearance-none"
                  >
                    {Object.keys(LOCATIONS).map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-green-600" /> {t.district}
                  </label>
                  <select 
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-green-500 outline-none transition-all font-bold text-gray-800 cursor-pointer appearance-none"
                  >
                    {districts.map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-green-600" /> {t.date}
                </label>
                <input 
                  required 
                  type="date" 
                  value={formData.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-green-500 outline-none transition-all font-bold text-gray-800" 
                />
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  className="w-full bg-green-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-green-900/20 hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-4 group"
                >
                  <ExternalLink className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  {t.confirmBtn}
                </button>
                <p className="mt-6 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                  Clicking this will open your WhatsApp to send the request
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
