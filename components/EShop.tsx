
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, ShoppingCart, ExternalLink, MessageCircle, Filter, Tag, CheckCircle2, ChevronRight, PlusCircle, LayoutGrid, Leaf } from 'lucide-react';
import { Language, Product } from '../types';
import { translations } from '../locales';

interface EShopProps {
  language: Language;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  products: Product[];
}

export const EShop: React.FC<EShopProps> = ({ language, onBack, onAddToCart, products }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const t = translations[language];

  const categories = ['All', 'Fungicide', 'Insecticide', 'PGR', 'Nutrient', 'Herbicide'];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, products]);

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  const handleBuy = (productName: string) => {
    const msg = `Hi Farmers Corner, I want to inquire about: ${productName}. Please share availability.`;
    window.open(`https://wa.me/916006086915?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 font-medium hover:text-green-600 transition-colors">
          <ArrowLeft className={`w-5 h-5 ${t.dir === 'rtl' ? 'rotate-180' : ''}`} /> {t.back}
        </button>
        <div className="text-center">
          <h2 className="font-black text-gray-900 leading-none">{t.eshopTitle}</h2>
          <p className="text-[10px] text-green-600 font-black uppercase tracking-widest mt-1">Managed Inventory</p>
        </div>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 no-scrollbar pb-24">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-center sticky top-0 z-10 bg-gray-50/80 backdrop-blur-md py-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" placeholder="Search products..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-white border border-gray-100 shadow-xl focus:ring-4 focus:ring-purple-100 outline-none font-bold text-gray-800 transition-all"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
              {categories.map(cat => (
                <button 
                  key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all border ${
                    activeCategory === cat ? 'bg-purple-600 text-white shadow-lg border-purple-500' : 'bg-white text-gray-500 border-gray-100'
                  }`}
                >
                  {cat === 'All' ? t.allProducts : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-gray-50 group hover:-translate-y-2 transition-all flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-gray-100 p-8 flex items-center justify-center">
                  <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-purple-600 uppercase tracking-widest shadow-lg">{product.category}</span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-gray-900 leading-tight mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">{product.description}</p>
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button onClick={() => handleAddToCart(product)} className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase transition-all ${addedItem === product.id ? 'bg-purple-100 text-purple-600' : 'bg-white text-purple-600 border-2 border-purple-600'}`}>
                      {addedItem === product.id ? <CheckCircle2 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />} {addedItem === product.id ? t.added : t.addToCart}
                    </button>
                    <button onClick={() => handleBuy(product.name)} className="bg-[#25D366] text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg"><MessageCircle className="w-4 h-4" /> Inquiry</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
