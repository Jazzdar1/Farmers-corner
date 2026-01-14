
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { VoiceSession } from './components/VoiceSession';
import { ScanSession } from './components/ScanSession';
import { AppointmentForm } from './components/AppointmentForm';
import { CommunityChat } from './components/CommunityChat';
import { WeatherDashboard } from './components/WeatherDashboard';
import { MarketRates } from './components/MarketRates';
import { EShop } from './components/EShop';
import { Login } from './components/Login';
import { AdminPanel } from './components/AdminPanel';
import { Toolbox } from './components/Toolbox';
import { Ledger } from './components/Ledger';
import { Gallery } from './components/Gallery';
import { DiseaseLibrary } from './components/DiseaseLibrary';
import { ViewState, Language, User, CartItem, Product, AdminSettings } from './types';
import { translations } from './locales';

const INITIAL_SETTINGS: AdminSettings = {
  schemes: [
    "HADDP: Holistic Agriculture Development Programme - JK Govt targeting 29 projects.",
    "PM-Kisan: 17th Installment released for eligible farmers.",
    "NHB: Subsidy on Cold Storage construction up to 35%."
  ],
  locations: {
    "Jammu & Kashmir": ["Srinagar", "Shopian", "Baramulla", "Sopore", "Anantnag", "Pulwama"],
    "Himachal Pradesh": ["Shimla", "Kullu"]
  },
  expertName: "DAR TOWSEEF",
  expertPhone: "+916006086915",
  expertWhatsApp: "916006086915",
  mandis: [
    { name: "Sopore, J&K", varieties: ["Red Delicious", "Gala", "Golden"] },
    { name: "Azadpur, Delhi", varieties: ["Red Delicious", "Gala"] },
    { name: "Mumbai", varieties: ["Red Delicious"] }
  ],
  weatherDistricts: ["Srinagar", "Shopian", "Baramulla", "Anantnag", "Kupwara"],
  socialLinks: [
    { platform: 'YouTube', url: 'https://youtube.com/@farmerscorner.tech.', label: 'Farmers Corner YT' },
    { platform: 'Facebook', url: 'https://www.facebook.com/share/1BrCbsdBk1/', label: 'Official Page' }
  ],
  expertSuggestions: [
    { category: "Spray", text: "Use Dormant Spray before the silver tip stage to prevent Scab." },
    { category: "Watering", text: "Irrigation frequency should be increased for young M9 plants in May." },
    { category: "Market", text: "Current Mandi rates are peaking in Delhi for Grade A apples." }
  ]
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [language, setLanguage] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fc_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [initialVoicePrompt, setInitialVoicePrompt] = useState<string | undefined>(undefined);
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('fc_managed_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('fc_admin_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('farmers_corner_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fc_managed_products', JSON.stringify(products));
    localStorage.setItem('fc_admin_settings', JSON.stringify(settings));
    localStorage.setItem('farmers_corner_cart', JSON.stringify(cart));
    if (user) localStorage.setItem('fc_user', JSON.stringify(user));
    else localStorage.removeItem('fc_user');
  }, [products, settings, cart, user]);

  const t = translations[language];

  const renderView = () => {
    if (!user && currentView !== 'HOME' && currentView !== 'LOGIN') {
      setCurrentView('LOGIN');
      return null;
    }

    switch (currentView) {
      case 'ADMIN':
        return <AdminPanel products={products} setProducts={setProducts} settings={settings} setSettings={setSettings} onBack={() => setCurrentView('HOME')} />;
      case 'LOGIN':
        return <Login language={language} onLogin={(u) => { setUser(u); setCurrentView('HOME'); }} />;
      case 'VOICE':
        return <VoiceSession language={language} onBack={() => setCurrentView('HOME')} initialPrompt={initialVoicePrompt} />;
      case 'SCAN':
        return <ScanSession language={language} onBack={() => setCurrentView('HOME')} onVoiceConsult={(p) => { setInitialVoicePrompt(p); setCurrentView('VOICE'); }} />;
      case 'APPOINTMENT':
        return <AppointmentForm language={language} onBack={() => setCurrentView('HOME')} locations={settings.locations} />;
      case 'COMMUNITY':
        return <CommunityChat language={language} onBack={() => setCurrentView('HOME')} />;
      case 'WEATHER':
        return <WeatherDashboard language={language} onBack={() => setCurrentView('HOME')} districts={settings.weatherDistricts} />;
      case 'MARKET':
        return <MarketRates language={language} onBack={() => setCurrentView('HOME')} mandis={settings.mandis} />;
      case 'ESHOP':
        return <EShop language={language} onBack={() => setCurrentView('HOME')} products={products} onAddToCart={(p) => setCart([...cart, {product: p, quantity: 1}])} />;
      case 'TOOLBOX':
        return <Toolbox language={language} onBack={() => setCurrentView('HOME')} onNavigate={(v) => setCurrentView(v)} />;
      case 'LEDGER':
        return <Ledger language={language} onBack={() => setCurrentView('TOOLBOX')} />;
      case 'GALLERY':
        return <Gallery language={language} onBack={() => setCurrentView('HOME')} />;
      case 'DISEASES':
        return <DiseaseLibrary language={language} onBack={() => setCurrentView('HOME')} onConsult={(p) => { setInitialVoicePrompt(p); setCurrentView('VOICE'); }} />;
      default:
        return (
          <Home 
            user={user} language={language} onLanguageChange={setLanguage} 
            onStartVoice={(p) => { setInitialVoicePrompt(p); setCurrentView('VOICE'); }}
            onStartScan={() => setCurrentView('SCAN')}
            onBookAppointment={() => setCurrentView('APPOINTMENT')}
            onStartCommunity={() => setCurrentView('COMMUNITY')}
            onViewWeather={() => setCurrentView('WEATHER')}
            onViewMarket={() => setCurrentView('MARKET')}
            onOpenEShop={() => setCurrentView('ESHOP')}
            onOpenToolbox={() => setCurrentView('TOOLBOX')}
            onViewGallery={() => setCurrentView('GALLERY')}
            onViewDiseases={() => setCurrentView('DISEASES')}
            settings={settings}
          />
        );
    }
  };

  return (
    <div dir={t.dir}>
      <Layout 
        language={language} onLanguageChange={setLanguage} user={user} onLogout={() => setUser(null)}
        onLoginClick={() => setCurrentView('LOGIN')} cart={cart} 
        onRemoveFromCart={(id) => setCart(cart.filter(i => i.product.id !== id))}
        onUpdateQuantity={(id, q) => setCart(cart.map(i => i.product.id === id ? {...i, quantity: q} : i))}
        onClearCart={() => setCart([])} onOpenAdmin={() => setCurrentView('ADMIN')}
      >
        {renderView()}
      </Layout>
    </div>
  );
};

export default App;
