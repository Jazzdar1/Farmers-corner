
import React, { useState } from 'react';
import { Leaf, LogIn, Loader2, Apple, Star } from 'lucide-react';
import { Language, User } from '../types';
import { translations } from '../locales';

interface LoginProps {
  language: Language;
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ language, onLogin }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const t = translations[language];

  const handleGoogleSignIn = () => {
    setIsAuthenticating(true);
    // PROFESSIONAL SIMULATION: Google OAuth Flow
    setTimeout(() => {
      const mockUser: User = {
        id: 'google-10101',
        name: 'Dar Towseef Admin',
        email: 'towseef@farmerscorner.tech',
        photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Towseef',
        isAdmin: true // HARDCODED FOR OWNER ACCESS
      };
      onLogin(mockUser);
      setIsAuthenticating(false);
    }, 2000);
  };

  return (
    <div className="min-h-full flex items-center justify-center p-4 bg-cover bg-center relative overflow-hidden" 
         style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1594236053800-4b2075f782c5?auto=format&fit=crop&q=80&w=1200)' }}>
      {/* Dynamic Overlay */}
      <div className="absolute inset-0 bg-green-950/80 backdrop-blur-md"></div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-[4rem] shadow-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-700">
        <div className="p-12 text-center">
          <div className="relative mx-auto mb-10">
            <div className="bg-green-600 w-28 h-28 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl rotate-6 group hover:rotate-0 transition-transform duration-500">
              <Leaf className="text-white w-14 h-14" />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-red-500 p-3 rounded-2xl shadow-xl -rotate-12 border-4 border-white">
              <Apple className="text-white w-8 h-8" />
            </div>
            <div className="absolute top-0 right-0 animate-pulse"><Star className="w-6 h-6 text-yellow-400 fill-yellow-400" /></div>
          </div>
          
          <h2 className="text-4xl font-black text-gray-900 mb-4 leading-tight tracking-tighter">
            {t.loginTitle}
          </h2>
          <p className="text-gray-500 text-lg mb-12 px-6 font-medium leading-relaxed opacity-80">
            {t.loginSubtitle}
          </p>

          <button
            onClick={handleGoogleSignIn}
            disabled={isAuthenticating}
            className="w-full flex items-center justify-center gap-5 bg-white border-2 border-gray-100 hover:border-green-300 py-6 px-10 rounded-[2.5rem] font-black text-gray-700 transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-70 group shadow-xl hover:shadow-green-900/5"
          >
            {isAuthenticating ? (
              <div className="flex items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                <span className="text-green-600 text-xl">Connecting...</span>
              </div>
            ) : (
              <>
                <div className="bg-gray-50 p-2 rounded-xl">
                  <svg className="w-8 h-8 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                <span className="text-xl tracking-tight">{t.signInGoogle}</span>
              </>
            )}
          </button>

          <div className="mt-16 pt-10 border-t border-gray-50 flex flex-col items-center gap-4">
            <span className="text-[11px] font-black text-gray-300 uppercase tracking-[0.4em]">Integrated Secure Control</span>
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-green-200"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-green-100"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
