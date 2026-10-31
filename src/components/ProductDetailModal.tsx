import React, { useState } from 'react';
import { Product, Producer } from '../types';
import { calculatePriceBreakdown, formatDT } from '../utils/pricing';
import { X, Volume2, VolumeX, MapPin, Calendar, Check, Plus, Minus, Phone, MessageSquare, ShieldCheck, Heart, ChevronRight, ChevronLeft } from 'lucide-react';
import { playClickSound, playFarmerVoiceGreeting, stopFarmerVoiceGreeting } from '../utils/audio';

interface ProductDetailModalProps {
  product: Product;
  producer?: Producer;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (product: Product) => void;
  onClose: () => void;
  isLiked: boolean;
  onToggleLike: (productId: string) => void;
  onOpenChatWithProducer?: (producerId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  producer,
  quantityInCart,
  onAddToCart,
  onRemoveFromCart,
  onClose,
  isLiked,
  onToggleLike,
  onOpenChatWithProducer,
}) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [contactSuccessMessage, setContactSuccessMessage] = useState<string | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const breakdown = calculatePriceBreakdown(product.priceDirect, product.priceSupermarketEstimated);
  const images = product.galleryImages && product.galleryImages.length > 0 
    ? product.galleryImages 
    : [product.image];

  const handleToggleVoice = () => {
    if (isPlayingVoice) {
      stopFarmerVoiceGreeting();
      setIsPlayingVoice(false);
    } else {
      setIsPlayingVoice(true);
      const greeting = producer?.voiceNote || `عسلامة ومرحباً بيكم في ${product.farmName}. خضار وغلال تونسية طازجة من الحقل مباشرة لمائدتكم، بدون قشارة ولا غلاء!`;
      playFarmerVoiceGreeting(greeting, () => {
        setIsPlayingVoice(false);
      });
    }
  };

  const handleSimulateContact = (channel: 'sms' | 'appel') => {
    playClickSound();
    if (channel === 'sms') {
      setContactSuccessMessage(`تم إرسال إشعار لـ ${producer?.name || 'الفلاّح'}: "عسلامة عمي، راني حبيت نحجز من ${product.name}!"`);
    } else {
      setContactSuccessMessage(`مكالمة هاتفية مباشرة مع ${producer?.name || 'الفلاّح'} (${producer?.phone || '98 450 120'}).`);
    }
    setTimeout(() => {
      setContactSuccessMessage(null);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/70 backdrop-blur-xs" dir="rtl">
      <div 
        className="bg-white w-full max-w-lg max-h-[92vh] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-stone-200 animate-in fade-in slide-in-from-bottom duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-product-title"
      >
        {/* Modal Top Bar: Gallery Carousel */}
        <div className="relative aspect-16/10 w-full bg-stone-900 shrink-0">
          <img
            src={images[activeImageIdx] || product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-stone-950/40" />

          {/* Close button */}
          <button
            onClick={() => {
              stopFarmerVoiceGreeting();
              onClose();
            }}
            aria-label="إغلاق تفاصيل المنتج"
            className="absolute top-3 left-3 w-9 h-9 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Favorite button */}
          <button
            onClick={() => {
              playClickSound();
              onToggleLike(product.id);
            }}
            aria-label={isLiked ? "حذف من المفضلة" : "إضافة للمفضلة"}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>

          {/* Gallery navigation arrows if multiple images */}
          {images.length > 1 && (
            <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
              <button
                type="button"
                onClick={() => setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center pointer-events-auto hover:bg-black/70 cursor-pointer"
                aria-label="الصورة السابقة"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center pointer-events-auto hover:bg-black/70 cursor-pointer"
                aria-label="الصورة التالية"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Overlay info */}
          <div className="absolute bottom-3 inset-x-4 text-white">
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold mb-1">
              <span>{product.farmName}</span>
              <span aria-hidden="true">·</span>
              <span>ولاية {product.governorate} (على بعد {product.farmDistanceKm} كم)</span>
            </div>
            <h2 id="modal-product-title" className="font-serif-display font-bold text-xl sm:text-2xl leading-tight text-white drop-shadow-sm">
              {product.name}
            </h2>
          </div>
        </div>

        {/* Thumbnails row if multiple images ("plus images") */}
        {images.length > 1 && (
          <div className="px-4 py-2 bg-stone-100 flex items-center gap-2 overflow-x-auto border-b border-stone-200">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative w-14 h-12 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                  activeImageIdx === idx ? 'border-emerald-700 ring-2 ring-emerald-400' : 'border-stone-300 opacity-60'
                }`}
              >
                <img src={img} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Producer Greeting & Voice Note */}
          {producer && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={producer.avatar}
                  alt={producer.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-stone-900 text-xs sm:text-sm">
                      {producer.name}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      فلاّح معتمد
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 line-clamp-1">
                    {producer.role} · في الفلاحة من سنة {producer.sinceYear}
                  </p>
                </div>
              </div>

              {/* Voice greeting button */}
              <button
                onClick={handleToggleVoice}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer ${
                  isPlayingVoice
                    ? 'bg-amber-600 text-white animate-pulse'
                    : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-300'
                }`}
                title="استمع لكلمة الفلاّح"
              >
                {isPlayingVoice ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>إيقاف</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>صوت الفلاّح</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-serif-display font-bold text-stone-900 text-sm mb-1">
              تفاصيل الصابة والجودة
            </h3>
            <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quality Labels & Harvest Time */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-2.5">
              <span className="text-stone-500 text-[11px] block">توقيت الجني</span>
              <span className="font-bold text-stone-900 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                {product.harvestDate}
              </span>
            </div>
            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-2.5">
              <span className="text-stone-500 text-[11px] block">الضمانات والأصل</span>
              <span className="font-bold text-stone-900 flex items-center gap-1 mt-0.5 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{product.qualityLabels.join(' · ')}</span>
              </span>
            </div>
          </div>

          {/* ANTI-INTERMÉDIAIRE / ANTI-GACHARA TRANSPARENCY VISUALIZER IN DT */}
          <div className="bg-emerald-950 text-white rounded-2xl p-4 shadow-inner space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-base">⚖️</span>
                <h4 className="font-serif-display font-bold text-sm text-emerald-100">
                  مقارنة الشفافية ضد القشارة والمضاربين
                </h4>
              </div>
              <span className="text-[11px] bg-emerald-800 text-emerald-200 font-bold px-2 py-0.5 rounded">
                0% قشارة وسماسرة
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* السمسار والقشارة والمغازة */}
              <div className="bg-stone-900/70 p-2.5 rounded-xl border border-stone-800">
                <span className="text-[11px] text-stone-400 block font-semibold">المغازات وسماسرة الجملة</span>
                <div className="text-base font-bold text-stone-300 mt-0.5 font-mono">
                  {formatDT(product.priceSupermarketEstimated)}
                </div>
                <div className="mt-2 space-y-1 text-[10px] text-stone-400">
                  <div className="flex justify-between">
                    <span>نصيب الفلاّح (22% فقط):</span>
                    <span className="text-amber-400 font-mono">{formatDT(breakdown.supermarketFarmerShare)}</span>
                  </div>
                  <div className="flex justify-between text-red-300">
                    <span>أرباح القشارة والمضاربة:</span>
                    <span className="font-mono">{formatDT(breakdown.intermediaryCostSupermarket)}</span>
                  </div>
                </div>
              </div>

              {/* دائرة فلّاحنا المباشرة */}
              <div className="bg-emerald-900/70 p-2.5 rounded-xl border border-emerald-600/60">
                <span className="text-[11px] text-emerald-300 block font-bold">سعر فلّاحنا المباشر</span>
                <div className="text-base font-bold text-emerald-300 mt-0.5 font-mono">
                  {formatDT(product.priceDirect)}
                </div>
                <div className="mt-2 space-y-1 text-[10px] text-emerald-200">
                  <div className="flex justify-between">
                    <span>يذهب للفلاّح (95%):</span>
                    <span className="text-emerald-300 font-bold font-mono">{formatDT(breakdown.farmerDirectShare)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>توفير المواطن:</span>
                    <span>وفرت {breakdown.citizenSavingsPercent}%</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-emerald-200/90 leading-snug bg-emerald-900/40 p-2 rounded-lg font-medium">
              ✨ <strong className="text-white">ربح مشترك :</strong> أنت توفر {formatDT(breakdown.citizenSavingsAmount)} والفلاّح التونسي يتحصل على {breakdown.farmerGainPercent}% إضافية مقابل تعبه وعرقه.
            </p>
          </div>

          {/* Pickup locations & Schedule */}
          {producer && (
            <div className="border border-stone-200 rounded-2xl p-3.5 space-y-2">
              <h4 className="font-serif-display font-bold text-xs text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>أماكن وتوقيت الاستلام المجاني</span>
              </h4>
              <p className="text-xs text-stone-600 font-medium">
                <strong>عنوان السانية :</strong> {producer.address}
              </p>
              <ul className="text-xs text-stone-700 space-y-1 bg-stone-50 p-2 rounded-xl">
                {producer.openSlots.map((slot, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{slot}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Direct producer interaction buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                if (onOpenChatWithProducer && producer) {
                  stopFarmerVoiceGreeting();
                  onClose();
                  onOpenChatWithProducer(producer.id);
                } else {
                  handleSimulateContact('sms');
                }
              }}
              className="flex-1 py-2 px-3 rounded-xl border border-stone-200 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
              <span>محادثة الفلاّح بالشات</span>
            </button>
            <button
              onClick={() => handleSimulateContact('appel')}
              className="flex-1 py-2 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>اتصال مباشر ({producer?.phone || 'مباشر'})</span>
            </button>
          </div>

          {/* Feedback message */}
          {contactSuccessMessage && (
            <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs p-2.5 rounded-xl animate-in fade-in font-medium">
              {contactSuccessMessage}
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-stone-500 font-semibold">سعر الفلاّح المباشر</div>
            <div className="text-xl font-extrabold text-emerald-700 font-serif-display font-mono">
              {formatDT(product.priceDirect)}
              <span className="text-xs text-stone-600 font-normal mr-1 font-sans">/ {product.unit}</span>
            </div>
          </div>

          {quantityInCart === 0 ? (
            <button
              onClick={() => {
                playClickSound();
                onAddToCart(product);
              }}
              className="py-3 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة للقفة</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-white border border-stone-300 rounded-2xl p-1 shadow-xs">
              <button
                onClick={() => {
                  playClickSound();
                  onRemoveFromCart(product);
                }}
                aria-label="إنقاص الكمية"
                className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-9 text-center font-bold text-sm text-stone-900 font-mono">
                {quantityInCart}
              </span>
              <button
                onClick={() => {
                  playClickSound();
                  onAddToCart(product);
                }}
                aria-label="زيادة الكمية"
                className="w-9 h-9 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
