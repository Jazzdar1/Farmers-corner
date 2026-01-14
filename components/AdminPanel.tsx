
import React, { useState } from 'react';
import { 
  ArrowLeft, Plus, Trash2, Save, ShoppingBag, Newspaper, MapPin, 
  UserCheck, X, TrendingUp, CloudSun, Share2, Lightbulb 
} from 'lucide-react';
import { Product, AdminSettings, SocialLink } from '../types';

interface AdminPanelProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  settings: AdminSettings;
  setSettings: React.Dispatch<React.SetStateAction<AdminSettings>>;
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  products, setProducts, settings, setSettings, onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'store' | 'content' | 'geo' | 'expert'>('store');

  // Product Form State
  const [pForm, setPForm] = useState<Partial<Product>>({ category: 'Fungicide' });
  
  const addP = () => {
    if (!pForm.name || !pForm.imageUrl) {
      alert("Please enter product name and image URL");
      return;
    }
    const newProduct: Product = {
      id: Date.now().toString(),
      name: pForm.name,
      category: pForm.category || 'Fungicide',
      description: pForm.description || '',
      benefits: [],
      imageUrl: pForm.imageUrl,
      siteUrl: pForm.siteUrl || '#'
    };
    setProducts([...products, newProduct]);
    setPForm({ category: 'Fungicide' });
  };

  const removeP = (id: string) => {
    if (confirm("Remove this product from E-Shop?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const updateSocial = (index: number, url: string) => {
    const next = [...settings.socialLinks];
    next[index] = { ...next[index], url };
    setSettings({ ...settings, socialLinks: next });
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      {/* Admin Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-green-600 transition-all">
          <ArrowLeft className="w-5 h-5" /> EXIT CONTROL PANEL
        </button>
        <div className="flex items-center gap-3">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">
            System Administrator
          </span>
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-black text-xs">DT</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-12 space-y-12 no-scrollbar pb-32">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Dashboard Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'store', label: 'Store Manager', icon: <ShoppingBag className="w-5 h-5" />, color: 'text-green-600' },
              { id: 'content', label: 'Live Ticker', icon: <Newspaper className="w-5 h-5" />, color: 'text-orange-600' },
              { id: 'geo', label: 'Markets & Geo', icon: <MapPin className="w-5 h-5" />, color: 'text-blue-600' },
              { id: 'expert', label: 'Expert Bio', icon: <UserCheck className="w-5 h-5" />, color: 'text-indigo-600' }
            ].map(tab => (
              <button 
                key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center gap-3 p-6 rounded-[2.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-2xl scale-105' 
                    : 'bg-white text-slate-400 border border-slate-100 shadow-sm hover:shadow-md'
                }`}
              >
                <div className={`${activeTab === tab.id ? 'text-white' : tab.color}`}>{tab.icon}</div>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-[3.5rem] p-8 md:p-12 shadow-2xl border border-slate-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {activeTab === 'store' && (
              <div className="space-y-12">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] space-y-6 border border-slate-100">
                  <h3 className="font-black text-slate-900 flex items-center gap-3"><Plus className="text-green-600" /> ADD NEW STORE PRODUCT</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Product Name</label>
                      <input value={pForm.name || ''} onChange={e => setPForm({...pForm, name: e.target.value})} placeholder="e.g. SCORE Fungicide" className="w-full p-4 rounded-xl bg-white border border-slate-200 font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Category</label>
                      <select value={pForm.category} onChange={e => setPForm({...pForm, category: e.target.value})} className="w-full p-4 rounded-xl bg-white border border-slate-200 font-bold">
                        <option value="Fungicide">Fungicide</option>
                        <option value="Insecticide">Insecticide</option>
                        <option value="Nutrient">Nutrient</option>
                        <option value="PGR">Growth Regulator</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Image URL</label>
                      <input value={pForm.imageUrl || ''} onChange={e => setPForm({...pForm, imageUrl: e.target.value})} placeholder="Direct Link" className="w-full p-4 rounded-xl bg-white border border-slate-200 font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Manufacturer Link</label>
                      <input value={pForm.siteUrl || ''} onChange={e => setPForm({...pForm, siteUrl: e.target.value})} placeholder="URL" className="w-full p-4 rounded-xl bg-white border border-slate-200 font-bold" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Short Description</label>
                    <textarea value={pForm.description || ''} onChange={e => setPForm({...pForm, description: e.target.value})} placeholder="What does this product do?" className="w-full p-4 rounded-xl bg-white border border-slate-200 font-bold h-24" />
                  </div>
                  <button onClick={addP} className="bg-green-600 text-white px-12 py-5 rounded-[2rem] font-black uppercase text-xs shadow-xl shadow-green-900/10 hover:bg-green-700 transition-all flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save to Inventory
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Current Catalog ({products.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-3xl border border-slate-100 group">
                        <div className="flex items-center gap-4">
                          <img src={p.imageUrl} className="w-14 h-14 rounded-2xl object-contain bg-white shadow-sm" /> 
                          <div>
                            <p className="font-black text-slate-900 text-sm">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{p.category}</p>
                          </div>
                        </div>
                        <button onClick={() => removeP(p.id)} className="p-3 bg-white text-slate-300 hover:text-red-500 rounded-2xl transition-all shadow-sm">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-12">
                <div className="space-y-6">
                   <h3 className="font-black text-slate-900 flex items-center gap-3"><Newspaper className="text-orange-500" /> HOMESCREEN NEWS TICKER</h3>
                   <div className="flex gap-2">
                     <input id="newScheme" className="flex-1 p-5 rounded-3xl bg-slate-50 border border-slate-200 font-bold outline-none focus:ring-2 focus:ring-orange-100" placeholder="Enter government update or scheme..." />
                     <button onClick={() => {
                       const el = document.getElementById('newScheme') as HTMLInputElement;
                       if (el.value) setSettings({...settings, schemes: [el.value, ...settings.schemes]});
                       el.value = '';
                     }} className="bg-slate-900 text-white px-8 rounded-3xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg">Add News</button>
                   </div>
                   <div className="space-y-3">
                     {settings.schemes.map((s, i) => (
                       <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                         <span className="text-sm font-bold text-slate-700">{s}</span>
                         <button onClick={() => setSettings({...settings, schemes: settings.schemes.filter((_, idx) => idx !== i)})} className="text-slate-300 hover:text-red-500 transition-colors">
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                     ))}
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="font-black text-slate-900 flex items-center gap-3"><Share2 className="text-blue-500" /> SOCIAL MEDIA LINKS</h3>
                   <div className="grid grid-cols-1 gap-4">
                     {settings.socialLinks.map((link, i) => (
                       <div key={i} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          <div className="flex items-center gap-3">
                            {link.platform === 'YouTube' ? <Youtube className="text-red-600" /> : <Facebook className="text-blue-600" />}
                            <span className="font-black text-slate-900 text-xs uppercase">{link.platform}</span>
                          </div>
                          <input value={link.label} readOnly className="p-3 rounded-xl bg-white border border-slate-100 font-bold text-[10px] uppercase text-slate-400" />
                          <input 
                            value={link.url} 
                            onChange={e => updateSocial(i, e.target.value)}
                            className="p-3 rounded-xl bg-white border border-slate-200 font-bold text-xs md:col-span-2 focus:ring-2 focus:ring-blue-100 outline-none" 
                          />
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'geo' && (
              <div className="space-y-12">
                <div className="bg-blue-50 p-8 rounded-[3rem] space-y-6">
                   <h3 className="font-black text-blue-900 flex items-center gap-3"><CloudSun className="text-blue-500" /> WEATHER LOCATIONS</h3>
                   <div className="flex gap-2">
                     <input id="newDist" className="flex-1 p-4 rounded-2xl bg-white border-none font-bold outline-none" placeholder="District name..." />
                     <button onClick={() => {
                       const el = document.getElementById('newDist') as HTMLInputElement;
                       if (el.value) setSettings({...settings, weatherDistricts: [...settings.weatherDistricts, el.value]});
                       el.value = '';
                     }} className="bg-blue-600 text-white px-8 rounded-2xl font-black text-xs uppercase shadow-lg shadow-blue-900/10">Add District</button>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {settings.weatherDistricts.map(d => (
                        <span key={d} className="bg-white px-5 py-2.5 rounded-2xl text-xs font-black text-blue-600 shadow-sm flex items-center gap-2">
                          {d} <X className="w-3 h-3 cursor-pointer opacity-40 hover:opacity-100" onClick={() => setSettings({...settings, weatherDistricts: settings.weatherDistricts.filter(item => item !== d)})} />
                        </span>
                      ))}
                   </div>
                </div>

                <div className="bg-green-50 p-8 rounded-[3rem] space-y-6">
                   <h3 className="font-black text-green-900 flex items-center gap-3"><TrendingUp className="text-green-600" /> MANDI MARKETS</h3>
                   <div className="flex gap-2">
                     <input id="newMandi" className="flex-1 p-4 rounded-2xl bg-white border-none font-bold outline-none" placeholder="Mandi city..." />
                     <button onClick={() => {
                       const el = document.getElementById('newMandi') as HTMLInputElement;
                       if (el.value) setSettings({...settings, mandis: [...settings.mandis, {name: el.value, varieties: ['Red Delicious']}]});
                       el.value = '';
                     }} className="bg-green-600 text-white px-8 rounded-2xl font-black text-xs uppercase shadow-lg shadow-green-900/10">Add Mandi</button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {settings.mandis.map(m => (
                       <div key={m.name} className="p-5 bg-white rounded-3xl flex items-center justify-between shadow-sm">
                         <span className="font-black text-green-800 text-sm">{m.name}</span>
                         <button onClick={() => setSettings({...settings, mandis: settings.mandis.filter(item => item.name !== m.name)})} className="p-2 text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'expert' && (
               <div className="max-w-2xl mx-auto space-y-12">
                 <div className="space-y-6">
                   <h3 className="font-black text-slate-900 flex items-center gap-3"><UserCheck className="text-indigo-500" /> LEAD EXPERT IDENTITY</h3>
                   <div className="bg-indigo-50 p-8 rounded-[3rem] space-y-6 border border-indigo-100">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-4">Full Expert Name</label>
                       <input value={settings.expertName} onChange={e => setSettings({...settings, expertName: e.target.value})} className="w-full p-5 rounded-3xl bg-white border-none font-black text-indigo-900 shadow-sm" />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-4">Direct Contact</label>
                         <input value={settings.expertPhone} onChange={e => setSettings({...settings, expertPhone: e.target.value})} className="w-full p-5 rounded-3xl bg-white border-none font-black text-indigo-900 shadow-sm" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-4">WhatsApp ID</label>
                         <input value={settings.expertWhatsApp} onChange={e => setSettings({...settings, expertWhatsApp: e.target.value})} className="w-full p-5 rounded-3xl bg-white border-none font-black text-indigo-900 shadow-sm" />
                       </div>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="font-black text-slate-900 flex items-center gap-3"><Lightbulb className="text-yellow-500" /> DYNAMIC EXPERT TIPS</h3>
                    <div className="space-y-4">
                      {settings.expertSuggestions.map((tip, i) => (
                        <div key={i} className="flex gap-3 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                          <input value={tip.category} readOnly className="w-24 bg-white p-3 rounded-2xl text-[10px] font-black uppercase text-indigo-600 shadow-sm" />
                          <input 
                            value={tip.text} 
                            onChange={e => {
                              const next = [...settings.expertSuggestions];
                              next[i].text = e.target.value;
                              setSettings({...settings, expertSuggestions: next});
                            }} 
                            className="flex-1 bg-white p-3 rounded-2xl font-bold text-xs shadow-sm border-none outline-none focus:ring-2 focus:ring-indigo-100" 
                          />
                        </div>
                      ))}
                    </div>
                 </div>
               </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components for Admin Panel
const Youtube = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
  </svg>
);

const Facebook = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
  </svg>
);
