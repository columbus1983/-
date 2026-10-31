import React, { useState } from 'react';
import { Product } from '../types';
import { calculatePriceBreakdown, formatDT } from '../utils/pricing';
import { Heart, Plus, Minus, Info, Users, Sparkles, Images } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
  onToggleLike: (productId: string) => void;
  isLiked: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onAddToCart,
  onRemoveFromCart,
  onOpenDetails,
  onToggleLike,
  isLiked,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const breakdown = calculatePriceBreakdown(product.priceDirect, product.priceSupermarketEstimated);
  const images = product.galleryImages && product.galleryImages.length > 0 
    ? product.galleryImages 
    : [product.image];

  return (
    <article className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between" dir="rtl">
      {/* Product Image & Badges with Gallery Switcher */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden group">
        <img
          src={images[activeImageIndex] || product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-stone-900/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
          {product.isFlashDeal ? (
            <div className="bg-amber-400 text-stone-950 font-bold text-[11px] px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-stone-950" />
              <span>فرصة اليوم -{breakdown.citizenSavingsPercent}%</span>
            </div>
          ) : (
            <div className="bg-emerald-900/90 text-emerald-100 font-bold text-[11px] px-2 py-0.5 rounded-md backdrop-blur-xs">
              من السانية مباشرة
            </div>
          )}

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playClickSound();
              onToggleLike(product.id);
            }}
            aria-label={isLiked ? `حذف ${product.name} من المفضلة` : `إضافة ${product.name} للمفضلة`}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-red-600 flex items-center justify-center backdrop-blur-xs transition-transform active:scale-90 shadow-xs cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-stone-700'}`}
            />
          </button>
        </div>

        {/* Multi-image indicators if gallery exists */}
        {images.length > 1 && (
          <div className="absolute top-10 left-2.5 flex gap-1 z-10 bg-black/40 px-1.5 py-0.5 rounded-full backdrop-blur-xs">
            <Images className="w-3 h-3 text-white mr-1" />
            <span className="text-[10px] text-white font-medium">{activeImageIndex + 1}/{images.length}</span>
          </div>
        )}

        {/* Multiple Images Dots Selector */}
        {images.length > 1 && (
          <div className="absolute bottom-9 inset-x-0 flex justify-center gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  activeImageIndex === idx ? 'bg-amber-400 w-4' : 'bg-white/70 hover:bg-white'
                }`}
                aria-label={`عرض الصورة ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Bottom image overlay: Distance & Governorate */}
        <div className="absolute bottom-2 inset-x-2.5 flex items-center justify-between text-xs text-white drop-shadow-sm font-semibold">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {product.farmDistanceKm} كم · {product.governorate} ({product.farmName})
          </span>
          <span className="text-[11px] text-stone-200">
            {product.stock} متوفر
          </span>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Unboxed text with subtle typographic separators */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
            <span>{product.harvestDate}</span>
            <span aria-hidden="true">·</span>
            <span>{product.qualityLabels[0]}</span>
            {product.qualityLabels[1] && (
              <>
                <span aria-hidden="true">·</span>
                <span>{product.qualityLabels[1]}</span>
              </>
            )}
          </div>

          {/* Title */}
          <button
            onClick={() => onOpenDetails(product)}
            className="text-right group/title w-full cursor-pointer"
          >
            <h3 className="font-serif-display font-bold text-stone-900 text-base leading-snug group-hover/title:text-emerald-700 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </button>

          {/* Anti-waste / deal reason */}
          {product.dealReason && (
            <p className="mt-1.5 text-xs text-amber-900 bg-amber-50/80 border border-amber-200/60 rounded-md p-1.5 leading-relaxed font-medium">
              💡 {product.dealReason}
            </p>
          )}

          {/* Group Buy Alert if active */}
          {product.groupBuyActive && (
            <div className="mt-2 text-[11px] text-emerald-900 bg-emerald-50 rounded-md p-1.5 flex items-center justify-between border border-emerald-100">
              <span className="flex items-center gap-1 font-semibold">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                شراء جماعي لأولاد الحومة
              </span>
              <span className="font-bold text-emerald-800">
                {product.groupBuyJoined}/{product.groupBuyTarget} جيران سجلوا
              </span>
            </div>
          )}
        </div>

        {/* Pricing Comparison Breakdown in DT */}
        <div className="mt-3 pt-3 border-t border-stone-100">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-emerald-700 font-serif-display">
                  {formatDT(product.priceDirect)}
                </span>
                <span className="text-xs text-stone-500 font-semibold">
                  / {product.unit}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium">
                <span>سعر المغازات والقشارة:</span>
                <span className="line-through text-stone-400 font-mono">
                  {formatDT(product.priceSupermarketEstimated)}
                </span>
              </div>
            </div>

            {/* Savings percentage callout */}
            <div className="text-left">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded inline-block">
                وفرت {breakdown.citizenSavingsPercent}%
              </span>
              <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                95% في جيب الفلاّح
              </div>
            </div>
          </div>

          {/* Actions: View Details & Add to Cart */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => onOpenDetails(product)}
              className="flex-1 py-2 px-2 rounded-xl border border-stone-200 hover:border-emerald-600 text-stone-700 hover:text-emerald-700 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>الصور والأصل</span>
            </button>

            {quantityInCart === 0 ? (
              <button
                onClick={() => {
                  playClickSound();
                  onAddToCart(product);
                }}
                className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>زيد للقفة</span>
              </button>
            ) : (
              <div className="flex items-center bg-emerald-50 border border-emerald-200 rounded-xl p-0.5">
                <button
                  onClick={() => {
                    playClickSound();
                    onRemoveFromCart(product);
                  }}
                  aria-label={`إنقاص كمية ${product.name}`}
                  className="w-7 h-7 rounded-lg bg-white text-emerald-800 hover:bg-stone-100 flex items-center justify-center transition-colors shadow-xs cursor-pointer font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center font-bold text-xs text-emerald-950 font-mono">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => {
                    playClickSound();
                    onAddToCart(product);
                  }}
                  aria-label={`زيادة كمية ${product.name}`}
                  className="w-7 h-7 rounded-lg bg-emerald-700 text-white hover:bg-emerald-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
