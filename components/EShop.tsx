
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, ShoppingCart, ExternalLink, MessageCircle, Filter, Tag, CheckCircle2, ChevronRight, PlusCircle, LayoutGrid, Leaf } from 'lucide-react';
import { Language, Product } from '../types';
import { translations } from '../locales';

interface EShopProps {
  language: Language;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

const PRODUCTS: Product[] = [
  // FUNGICIDES
  {
    id: 'f1',
    name: 'SCORE (Difenoconazole 25% EC)',
    category: 'Fungicide',
    description: 'Systemic fungicide for exceptional control of Apple Scab and Alternaria.',
    benefits: ['Quick absorption', 'Long duration control', 'Excellent rainfastness'],
    imageUrl: 'https://parijatagrochemicals.com/wp-content/uploads/2021/04/Score.png',
    siteUrl: 'https://parijatagrochemicals.com/products/'
  },
  {
    id: 'f2',
    name: 'PARIJAT ZINEB (Zineb 75% WP)',
    category: 'Fungicide',
    description: 'Broad spectrum contact fungicide for effective management of various fruit diseases.',
    benefits: ['Good adhesiveness', 'Effective against apple scab', 'Low toxicity to crops'],
    imageUrl: 'https://parijatagrochemicals.com/wp-content/uploads/2021/04/Zineb.png',
    siteUrl: 'https://parijatagrochemicals.com/products/'
  },
  {
    id: 'f3',
    name: 'TEBUCON (Tebuconazole 25.9% EC)',
    category: 'Fungicide',
    description: 'Modern systemic fungicide for Powdery Mildew and Leaf Spot control.',
    benefits: ['Preventive & Curative', 'Fast action', 'Systemic movement'],
    imageUrl: 'https://parijatagrochemicals.com/wp-content/uploads/2021/04/Tebucon.png',
    siteUrl: 'https://parijatagrochemicals.com/products/'
  },
  {
    id: 'f4',
    name: 'MANCOZEB (Mancozeb 75% WP)',
    category: 'Fungicide',
    description: 'King of contact fungicides for broad disease management in orchards.',
    benefits: ['Multi-site action', 'Zinc and Manganese supply', 'Economical'],
    imageUrl: 'https://parijatagrochemicals.com/wp-content/uploads/2021/04/Mancozeb.png',
    siteUrl: 'https://parijatagrochemicals.com/products/'
  },
  // INSECTICIDES
  {
    id: 'i1',
    name: 'GLADIATOR (Chlorpyriphos 50% + Cypermethrin 5% EC)',
    category: 'Insecticide',
    description: 'Powerful broad-spectrum insecticide for controlling Aphids and Scale.',
    benefits: ['Dual action', 'Knockdown effect', 'Deep penetration'],
    imageUrl: 'https://parijatagrochemicals.com/wp-content/uploads/2021/04/Gladiator.png',
    siteUrl: 'https://parijatagrochemicals.com/products/'
  },
  {
    id: 'i2',
    name: 'CLOUDY (Thiamethoxam 25% WG)',
    category: 'Insecticide',
    description: 'Next-gen systemic insecticide for Sucking Pests and Aphids.',
    benefits: ['Water soluble', 'Excellent crop safety', 'Residual control'],
    imageUrl: 'https://parijatagrochemicals.com/wp-content/uploads/2021/04/Cloudy.png',
    siteUrl: 'https://parijatagrochemicals.com/products/'
  },
  {
    id: 'i3',
    name: 'FIPRONIL (Fipronil 5% SC)',
    category: 'Insecticide',
    description: 'Broad spectrum insecticide with unique mode of action against mites and beetles.',
    benefits: ['Contact & Ingestion', 'Systemic action', 'Crop vigor increase'],
    imageUrl: 'https://parijatagrochemicals.com/wp-content/uploads/2021/04/Fipronil.png',
    siteUrl: 'https://parijatagrochemicals.com/products/'
  },
  // PGR
  {
    id: 'p1',
    name: 'BOOSTER (Gibberellic Acid 0.001% L)',
    category: 'PGR',
    description: 'Advanced plant growth regulator for uniform fruit size and vigor.',
    benefits: ['Enhanced fruit development', 'Stress tolerance', 'Uniform growth'],
    imageUrl: 'https://parijatagrochemicals.com/wp-content/uploads/2021/04/Booster.png',
    siteUrl: 'https://parijatagrochemicals.com/products/'
  },
  {
    id: 'p2',
    name: 'PACLO (Paclobutrazol 23% SC)',
    category: 'PGR',
    description: 'Growth retardant for inducing early flowering and controlling canopy.',
    benefits: ['Balanced growth', 'Root development', 'Drought tolerance'],
    imageUrl: 'https://parijatagrochemicals.com/wp-content/uploads/2021/04/Paclo.png',
    siteUrl: 'https://parijatagrochemicals.com/products/'
  },
  // NUTRIENTS
  {
    id: 'n1',
    name: 'PARIJAT BORE (Boron 20%)',
    category: 'Nutrient',
    description: 'High-quality water-soluble Boron for better fruit set and quality.',
    benefits: ['Prevents fruit cracking', 'Improves pollination', 'Essential for tissue growth'],
    imageUrl: 'https://parijatagrochemicals.com/wp-content/uploads/2021/04/Boron.png',
    siteUrl: 'https://parijatagrochemicals.com/products/'
  },
  {
    id: 'n2',
    name: 'ZINC (Zinc EDTA 12%)',
    category: 'Nutrient',
    description: 'Fully chelated Zinc for rapid absorption and correction of deficiency.',
    benefits: ['Chlorophyll formation', 'Fast action', 'Safe for foliage'],
    imageUrl: 'https://parijatagrochemicals.com/wp-content/uploads/2021/04/Zinc.png',
    siteUrl: 'https://parijatagrochemicals.com/products/'
  },
  // HERBICIDES
  {
    id: 'h1',
    name: 'PARAQUAT (Paraquat Dichloride 24% SL)',
    category: 'Herbicide',
    description: 'Fast acting contact herbicide for non-selective weed control in orchards.',
    benefits: ['Broad spectrum', 'Quick results', 'Safe for soil'],
    imageUrl: 'https://parijatagrochemicals.com/wp-content/uploads/2021/04/Paraquat.png',
    siteUrl: 'https://parijatagrochemicals.com/products/'
  }
];

export const EShop: React.FC<EShopProps> = ({ language, onBack, onAddToCart }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const t = translations[language];

  const categories = ['All', 'Fungicide', 'Insecticide', 'PGR', 'Nutrient', 'Herbicide'];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  const handleBuy = (productName: string) => {
    const msg = `Hi Farmers Corner, I want to inquire about Parijat Product: ${productName}. Please share availability and current price.`;
    window.open(`https://wa.me/916006086915?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 font-medium hover:text-green-600 transition-colors">
          <ArrowLeft className={`w-5 h-5 ${t.dir === 'rtl' ? 'rotate-180' : ''}`} /> {t.back}
        </button>
        <div className="text-center">
          <h2 className="font-black text-gray-900 leading-none">{t.eshopTitle}</h2>
          <p className="text-[10px] text-green-600 font-black uppercase tracking-widest mt-1">115+ Crop Care Solutions</p>
        </div>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 no-scrollbar">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Banner */}
          <div className="bg-gradient-to-br from-purple-700 to-indigo-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md">
                  <Tag className="w-3 h-3" /> Official Parijat Store
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Advanced Solutions for Kashmir.</h2>
                <p className="text-indigo-100 font-medium text-lg leading-relaxed opacity-90">Browse 115+ Parijat products specifically curated for Apple, Saffron, and Temperate fruits.</p>
                <div className="pt-4">
                  <button 
                    onClick={() => window.open('https://parijatagrochemicals.com/products/', '_blank')}
                    className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black uppercase text-sm shadow-xl hover:bg-indigo-50 transition-all flex items-center gap-2"
                  >
                    View All 115 Products <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="hidden md:flex justify-center">
                 <div className="bg-white/10 p-10 rounded-[4rem] backdrop-blur-xl border border-white/20 shadow-2xl rotate-3">
                    <LayoutGrid className="w-32 h-32 text-white/40" />
                 </div>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-6 items-center sticky top-20 z-10 bg-gray-50/80 backdrop-blur-md py-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search Parijat products (Score, Gladiator, Tebucon...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-white border border-gray-100 shadow-xl focus:ring-4 focus:ring-purple-100 outline-none font-bold text-gray-800 transition-all"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-2">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all border ${
                    activeCategory === cat ? 'bg-purple-600 text-white shadow-lg border-purple-500' : 'bg-white text-gray-500 border-gray-100 hover:border-purple-200'
                  }`}
                >
                  {cat === 'All' ? t.allProducts : t[cat.toLowerCase() + 's' as keyof typeof t] || cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 pb-32">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-gray-50 group hover:-translate-y-2 transition-all flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-gray-100 p-8 flex items-center justify-center">
                  <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-purple-600 uppercase tracking-widest shadow-lg">
                      {product.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-xl font-black text-gray-900 leading-tight mb-2 group-hover:text-purple-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="space-y-2 mb-8 flex-1">
                    {product.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs text-gray-600 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${
                        addedItem === product.id 
                          ? 'bg-purple-100 text-purple-600 border-2 border-purple-200' 
                          : 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50'
                      }`}
                    >
                      {addedItem === product.id ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <PlusCircle className="w-4 h-4" />
                      )}
                      {addedItem === product.id ? t.added : t.addToCart}
                    </button>
                    <button 
                      onClick={() => handleBuy(product.name)}
                      className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-900/10 hover:bg-[#128C7E] transition-all active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4" /> {t.buyNow}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
              <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-black text-gray-400">No products found matching your search.</h3>
              <p className="text-gray-400 mt-2 font-medium">Check categories or try "Score", "Mancozeb", or "Gladiator".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
