
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
import { ViewState, Language, User, CartItem, Product } from './types';
import { translations } from './locales';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [language, setLanguage] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);
  const [initialVoicePrompt, setInitialVoicePrompt] = useState<string | undefined>(undefined);
  
  // Shopping Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('farmers_corner_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist Cart
  useEffect(() => {
    localStorage.setItem('farmers_corner_cart', JSON.stringify(cart));
  }, [cart]);

  const t = translations[language];

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setCurrentView('HOME');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('HOME');
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const startVoice = (prompt?: string) => {
    if (!user) {
      setCurrentView('LOGIN');
      return;
    }
    setInitialVoicePrompt(prompt);
    setCurrentView('VOICE');
  };

  const renderView = () => {
    // Gate specific features behind login
    if (!user && currentView !== 'HOME' && currentView !== 'LOGIN') {
      setCurrentView('LOGIN');
      return null;
    }

    switch (currentView) {
      case 'LOGIN':
        return <Login language={language} onLogin={handleLogin} />;
      case 'VOICE':
        return (
          <VoiceSession 
            language={language} 
            onBack={() => { setCurrentView('HOME'); setInitialVoicePrompt(undefined); }} 
            initialPrompt={initialVoicePrompt}
          />
        );
      case 'SCAN':
        return <ScanSession language={language} onBack={() => setCurrentView('HOME')} />;
      case 'APPOINTMENT':
        return <AppointmentForm language={language} onBack={() => setCurrentView('HOME')} />;
      case 'COMMUNITY':
        return <CommunityChat language={language} onBack={() => setCurrentView('HOME')} />;
      case 'WEATHER':
        return <WeatherDashboard language={language} onBack={() => setCurrentView('HOME')} />;
      case 'MARKET':
        return <MarketRates language={language} onBack={() => setCurrentView('HOME')} />;
      case 'ESHOP':
        return (
          <EShop 
            language={language} 
            onBack={() => setCurrentView('HOME')} 
            onAddToCart={addToCart}
          />
        );
      default:
        return (
          <Home 
            user={user}
            language={language}
            onLanguageChange={setLanguage}
            onStartVoice={startVoice} 
            onStartScan={() => user ? setCurrentView('SCAN') : setCurrentView('LOGIN')}
            onBookAppointment={() => user ? setCurrentView('APPOINTMENT') : setCurrentView('LOGIN')}
            onStartCommunity={() => user ? setCurrentView('COMMUNITY') : setCurrentView('LOGIN')}
            onViewWeather={() => setCurrentView('WEATHER')}
            onViewMarket={() => setCurrentView('MARKET')}
            onOpenEShop={() => user ? setCurrentView('ESHOP') : setCurrentView('LOGIN')}
          />
        );
    }
  };

  return (
    <div dir={t.dir}>
      <Layout 
        language={language} 
        onLanguageChange={setLanguage} 
        user={user} 
        onLogout={handleLogout}
        onLoginClick={() => setCurrentView('LOGIN')}
        cart={cart}
        onRemoveFromCart={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onClearCart={clearCart}
      >
        {renderView()}
      </Layout>
    </div>
  );
};

export default App;
