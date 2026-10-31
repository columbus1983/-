import React, { useState } from 'react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { Search, Flame, ArrowUpDown } from 'lucide-react';
import { playClickSound } from '../utils/audio';
import { formatDT } from '../utils/pricing';

interface MarketViewProps {
  products: Product[];
  cartItemsMap: Record<string, number>;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
  onOpenWheel: () => void;
  likedProductIds: Set<string>;
  onToggleLike: (productId: string) => void;
  maxDistance: number;
}

export const MarketView: React.FC<MarketViewProps> = ({
  products,
  cartItemsMap,
  onAddToCart,
  onRemoveFromCart,
  onOpenDetails,
  onOpenWheel,
  likedProductIds,
  onToggleLike,
  maxDistance,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'flash'>('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'savings'>('savings');

  const filteredProducts = products.filter((p) => {
    if (p.farmDistanceKm > maxDistance) return false;

    if (selectedCategory === 'flash') {
      if (!p.isFlashDeal) return false;
    } else if (selectedCategory !== 'tous' && p.category !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchFarm = p.farmName.toLowerCase().includes(q);
      const matchGov = p.governorate?.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchLabels = p.qualityLabels.some((l) => l.toLowerCase().includes(q));
      if (!matchName && !matchFarm && !matchGov && !matchCategory && !matchLabels) return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'distance') {
      return a.farmDistanceKm - b.farmDistanceKm;
    }
    if (sortBy === 'price') {
      return a.priceDirect - b.priceDirect;
    }
    const savA = (a.priceSupermarketEstimated - a.priceDirect) / a.priceSupermarketEstimated;
    const savB = (b.priceSupermarketEstimated - b.priceDirect) / b.priceSupermarketEstimated;
    return savB - savA;
  });

  const categories = [
    { id: 'tous', label: '🌾 الكل' },
    { id: 'flash', label: '⚡ فرص اليوم' },
    { id: 'anti-gaspi', label: '🧺 قفة الخير' },
    { id: 'legumes', label: '🥕 خضروات' },
    { id: 'fruits', label: '🍊 قوارص وغلال' },
    { id: 'huiles', label: '🫒 زيت زيتونة' },
    { id: 'fromages', label: '🧀 أجبان باجة' },
    { id: 'dattes', label: '🌴 دقلة نور' },
    { id: 'epicerie', label: '🌶️ هريسة وعسل' },
  ];

  const heroDeal = products.find((p) => p.isFlashDeal && p.id === 'prod-p1') || products[0];

  return (
    <div className="space-y-4" dir="rtl">
      {/* Hero Banner: صابة الصباح الفلاحية */}
      {heroDeal && selectedCategory === 'tous' && !searchQuery && (
        <div className="relative bg-gradient-to-br from-amber-600 via-amber-700 to-emerald-900 rounded-3xl p-4 sm:p-5 text-white shadow-sm overflow-hidden">
          <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="bg-amber-300 text-stone-950 text-[10px] sm:text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                فرصة اليوم الذهبية من السانية
              </span>
              <span className="text-xs text-amber-100 font-bold">
                ولاية {heroDeal.governorate} · {heroDeal.farmName}
              </span>
            </div>

            <h2 className="font-serif-display font-bold text-lg sm:text-xl text-white leading-tight">
              {heroDeal.name}
            </h2>

            <p className="text-xs text-amber-100 max-w-md line-clamp-2 leading-relaxed">
              {heroDeal.dealReason || heroDeal.description}
            </p>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-baseline gap-2">
                <span className="font-serif-display font-extrabold text-2xl text-amber-200 font-mono">
                  {formatDT(heroDeal.priceDirect)}
                </span>
                <span className="text-xs text-amber-200/80 line-through font-mono">
                  {formatDT(heroDeal.priceSupermarketEstimated)} عند القشارة
                </span>
                <span className="text-[11px] font-bold bg-white text-emerald-900 px-2 py-0.5 rounded shadow-2xs">
                  -58%
                </span>
              </div>

              <button
                onClick={() => {
                  playClickSound();
                  onAddToCart(heroDeal);
                }}
                className="py-2 px-4 rounded-xl bg-white hover:bg-amber-50 text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>احجز قفتك</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gamified Convivial Banner: عجلة البركة */}
      <div 
        onClick={onOpenWheel}
        className="bg-white hover:bg-amber-50/50 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shrink-0 shadow-2xs">
            🎡
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif-display font-bold text-xs text-stone-900">
                عجلة البركة والخير
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                مجانية
              </span>
            </div>
            <p className="text-[11px] text-stone-600 font-medium">
              دوّر العجلة واربح تخفيض فوري -15% أو وصفة زمنية دياري!
            </p>
          </div>
        </div>
        <button
          type="button"
          className="text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-3 py-1.5 rounded-xl transition-colors shrink-0 cursor-pointer"
        >
          العب &gt;
        </button>
      </div>

      {/* Search & Sort Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ابحث عن طماطم، برتقال مالطي، زيت زيتونة، دقلة نور، قفة خضار..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-8 py-2.5 bg-white border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-2xs placeholder:text-stone-400 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  playClickSound();
                  setSelectedCategory(cat.id as ProductCategory | 'flash');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sort & Count Row */}
        <div className="flex items-center justify-between text-xs text-stone-500 px-1 pt-1 font-semibold">
          <span>
            <strong>{sortedProducts.length}</strong> صابة ومحصول مباشر (شعاع {maxDistance} كم)
          </span>

          <div className="flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'distance' | 'price' | 'savings')}
              className="bg-transparent text-stone-700 font-bold focus:outline-none cursor-pointer"
            >
              <option value="savings">أكبر نسبة توفير</option>
              <option value="distance">الأقرب إليك</option>
              <option value="price">السعر الأقل</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-2">
          <p className="text-3xl">🧺</p>
          <h3 className="font-serif-display font-bold text-stone-800 text-sm">
            لا توجد منتوجات مطابقة للبحث حالياً
          </h3>
          <p className="text-xs text-stone-500">
            جرّب زيادة مسافة البحث بالكيلومتر أو اختر تصنيفاً آخر.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('tous');
              setSearchQuery('');
            }}
            className="mt-2 py-1.5 px-3 bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantityInCart={cartItemsMap[product.id] || 0}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onOpenDetails={onOpenDetails}
              onToggleLike={onToggleLike}
              isLiked={likedProductIds.has(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
