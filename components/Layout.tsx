
import React, { useState } from 'react';
import { Leaf, Globe, Menu, LogOut, User as UserIcon, Bell, ShoppingCart, X, Trash2, Plus, Minus, MessageCircle, Apple, Settings } from 'lucide-react';
import { Language, User, CartItem } from '../types';
import { translations } from '../locales';

interface LayoutProps {
  children: React.ReactNode;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  user: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
  cart: CartItem[];
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onClearCart: () => void;
  onOpenAdmin: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  language, 
  onLanguageChange, 
  user, 
  onLogout, 
  onLoginClick,
  cart,
  onRemoveFromCart,
  onUpdateQuantity,
  onClearCart,
  onOpenAdmin
}) => {
  const t = translations[language];
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    const cartSummary = cart.map(item => `• ${item.product.name} (x${item.quantity})`).join('\n');
    const msg = `Assalam Alaikum Farmers Corner,\n\nI would like to order the following products:\n\n${cartSummary}\n\nPlease confirm availability and total cost for my location.`;
    window.open(`https://wa.me/916006086915?text=${encodeURIComponent(msg)}`, '_blank');
    onClearCart();
    setShowCart(false);
  };

  const getGreeting = () => {
    if (language === 'ur' || language === 'ks') return "Assalam Alaikum";
    if (language === 'hi') return "Namaste";
    return "Welcome";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-green-50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="bg-green-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20 group-hover:rotate-6 transition-transform">
                <Leaf className="text-white w-6 h-6" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-red-500 w-6 h-6 rounded-lg border-2 border-white flex items-center justify-center shadow-md">
                <Apple className="text-white w-3 h-3" />
              </div>
            </div>
            <div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-gray-900 leading-none tracking-tight">
                  FARMERS<span className="text-green-600">CORNER</span>
                </span>
                <span className="text-[10px] font-black text-green-600 tracking-[0.35em] uppercase mt-1">
                  KASHMIR
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <span className="hidden md:block text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                {getGreeting()}, {user.name.split(' ')[0]}
              </span>
            )}

            <div className="hidden lg:flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
              {(['en', 'ur', 'hi', 'ks'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-tighter ${
                    language === lang ? 'bg-white text-green-700 shadow-sm border border-green-100' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {lang === 'en' ? 'ENG' : lang === 'ur' ? 'اردو' : lang === 'hi' ? 'हिंदी' : 'KAS'}
                </button>
              ))}
            </div>
            
            <button className="relative p-2 text-gray-400 hover:text-green-600 transition-colors">
              <Bell className="w-6 h-6" />
              {hasNotification && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            <button onClick={() => setShowCart(true)} className="relative p-2 text-gray-400 hover:text-purple-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{cartCount}</span>}
            </button>

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 bg-white border border-gray-100 p-1 pr-3 rounded-full hover:shadow-md transition-all"
                >
                  <img src={user.photoUrl} alt={user.name} className="w-8 h-8 rounded-full border border-green-50 object-cover" />
                  <span className="hidden sm:block text-[10px] font-black text-gray-700 uppercase">{user.name.split(' ')[0]}</span>
                </button>
                
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)}></div>
                    <div className={`absolute ${language === 'en' || language === 'hi' ? 'right-0' : 'left-0'} top-full mt-3 w-56 bg-white rounded-[2rem] shadow-2xl border border-gray-100 py-3 z-20 animate-in fade-in slide-in-from-top-4`}>
                      <div className="px-5 py-3 border-b border-gray-50 mb-2">
                        <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight truncate">{user.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold truncate">{user.email}</p>
                      </div>
                      
                      {user.isAdmin && (
                        <button 
                          onClick={() => { onOpenAdmin(); setShowProfileMenu(false); }}
                          className="w-full flex items-center gap-3 px-5 py-3 text-[11px] font-black text-green-600 hover:bg-green-50 transition-colors uppercase tracking-widest border-b border-gray-50"
                        >
                          <Settings className="w-4 h-4" /> Admin Dashboard
                        </button>
                      )}

                      <button 
                        onClick={() => { onLogout(); setShowProfileMenu(false); }}
                        className="w-full flex items-center gap-3 px-5 py-3 text-[11px] font-black text-red-600 hover:bg-red-50 transition-colors uppercase tracking-widest"
                      >
                        <LogOut className="w-4 h-4" /> {t.logout}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button onClick={onLoginClick} className="bg-green-600 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-md active:scale-95">Sign In</button>
            )}
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      {showCart && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]" onClick={() => setShowCart(false)} />
          <div className={`fixed inset-y-0 ${language === 'ur' || language === 'ks' ? 'left-0' : 'right-0'} w-full max-w-md bg-white z-[110] shadow-2xl flex flex-col`}>
            <div className="p-8 border-b flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="bg-purple-600 p-3 rounded-2xl shadow-lg">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 leading-none">{t.cartTitle}</h2>
                  <p className="text-[10px] text-purple-600 font-black uppercase mt-1 tracking-widest">Store Checkout</p>
                </div>
              </div>
              <button onClick={() => setShowCart(false)} className="p-3 bg-white border border-gray-100 rounded-full hover:bg-gray-50 transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="bg-gray-50 p-12 rounded-[3rem] border border-gray-100"><ShoppingCart className="w-20 h-20 text-gray-200" /></div>
                  <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest">{t.cartEmpty}</h3>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-gray-50 shrink-0 border border-gray-100 p-2">
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-black text-gray-900 leading-tight mb-1">{item.product.name}</h4>
                          <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded-md">{item.product.category}</span>
                        </div>
                        <button onClick={() => onRemoveFromCart(item.product.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                          <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-400"><Minus className="w-3 h-3" /></button>
                          <span className="w-10 text-center text-sm font-black">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-400"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t bg-gray-50/50 space-y-4">
                <div className="flex justify-between items-center px-2">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{t.total}</span>
                  <span className="text-xl font-black text-gray-900">{cartCount} Items</span>
                </div>
                <button onClick={handleCheckout} className="w-full bg-[#25D366] text-white py-6 rounded-[2.5rem] font-black text-lg shadow-xl shadow-green-900/10 hover:bg-[#128C7E] flex items-center justify-center gap-4 active:scale-95 transition-all">
                  <MessageCircle className="w-6 h-6" /> {t.checkout}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-2 opacity-30">
            <Leaf className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Farmers Corner Kashmir</span>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">© 2024 supporting kashmir's agriculture through smart innovation.</p>
        </div>
      </footer>
    </div>
  );
};
