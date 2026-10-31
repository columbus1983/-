import React, { useState } from 'react';
import { CartItem, Reservation } from '../types';
import { calculateCartTotals, formatDT } from '../utils/pricing';
import { X, Plus, Minus, ArrowLeft, ShieldCheck, MapPin, CheckCircle2, Ticket } from 'lucide-react';
import { playClickSound, playWinCelebration } from '../utils/audio';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onAddToCart: (product: CartItem['product']) => void;
  onRemoveFromCart: (product: CartItem['product']) => void;
  onClearCart: () => void;
  activePromoDiscount: number;
  activePromoCode?: string;
  onApplyManualCode: (code: string) => boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  activePromoDiscount,
  activePromoCode,
  onApplyManualCode,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState(false);
  const [pickupOption, setPickupOption] = useState<'ferme' | 'relais'>('ferme');
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  if (!isOpen) return null;

  const totals = calculateCartTotals(items, activePromoDiscount);

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = onApplyManualCode(promoInput.trim().toUpperCase());
    if (success) {
      setPromoError(false);
      setPromoInput('');
    } else {
      setPromoError(true);
    }
  };

  const handleConfirmReservation = () => {
    playWinCelebration();
    const reservationNum = `TN-${Math.floor(100000 + Math.random() * 900000)}`;
    const pin = `${Math.floor(1000 + Math.random() * 9000)}`;

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      reservationNumber: reservationNum,
      createdAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      items: [...items],
      totalDirect: totals.totalDirect,
      totalSavings: totals.totalCitizenSavings,
      producerBonus: totals.farmerRevenue,
      pickupSlot: 'اليوم من 16:30 إلى 19:30',
      pickupLocation: pickupOption === 'ferme' ? 'مباشرة من سانية الفلاّح' : 'نقطة تسليم بلدية / معتمدية',
      pickupFarmName: items[0]?.product.farmName || 'سانية تونسية',
      status: 'confirmée',
      paymentMode: 'sur_place_retrait',
      pinCode: pin,
    };

    setConfirmedReservation(newRes);
    onClearCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-stone-950/70 backdrop-blur-xs" dir="rtl">
      <div 
        className="bg-white w-full max-w-lg h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        {/* Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧺</span>
            <div>
              <h2 id="cart-title" className="font-serif-display font-bold text-base leading-tight">
                {confirmedReservation ? 'تم تأكيد حجز قفتك بنجاح !' : 'قفّتي من السانية مباشرة'}
              </h2>
              <p className="text-[11px] text-stone-400">
                {confirmedReservation ? 'جاهزة للاستلام بدون دفع مسبق' : `${items.length} منتوج من الحقل لمائدتك`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق القفة"
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Confirmed Reservation Pass Screen */}
        {confirmedReservation ? (
          <div className="p-5 overflow-y-auto space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded">
                حجز مضمون بدون أي دفع بالبطاقة البنكية مسبقاً
              </span>
              <h3 className="font-serif-display font-bold text-xl text-stone-900 mt-1">
                وصل الحجز رقم : {confirmedReservation.reservationNumber}
              </h3>
              <p className="text-xs text-stone-600 mt-0.5 font-medium">
                الخلاص نقداً مباشرة عند الفلاّح أو نقطة التسليم
              </p>
            </div>

            {/* Simulated QR Code Pass */}
            <div className="bg-stone-50 border-2 border-stone-200 rounded-3xl p-4 max-w-xs mx-auto shadow-inner space-y-3">
              <div className="bg-white p-3 rounded-2xl border border-stone-200 inline-block shadow-xs">
                <div className="w-36 h-36 mx-auto flex items-center justify-center bg-stone-950 rounded-xl p-2">
                  <div className="grid grid-cols-6 gap-1 w-full h-full bg-stone-950 p-1">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          (i % 2 === 0 && i % 3 !== 1) || i === 0 || i === 5 || i === 30 || i === 35
                            ? 'bg-white'
                            : 'bg-stone-950'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-stone-500 uppercase block font-bold">
                  رمز الاستلام (PIN)
                </span>
                <span className="text-2xl font-mono font-extrabold tracking-widest text-emerald-800">
                  {confirmedReservation.pinCode}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="bg-stone-50 rounded-2xl p-3.5 text-right text-xs space-y-2 border border-stone-200">
              <div className="flex justify-between">
                <span className="text-stone-500">نقطة الاستلام :</span>
                <span className="font-bold text-stone-900">{confirmedReservation.pickupLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">التوقيت المحدد :</span>
                <span className="font-bold text-stone-900">{confirmedReservation.pickupSlot}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 text-sm">
                <span className="font-bold text-stone-800">المبلغ المطلوب خلاصه :</span>
                <span className="font-extrabold text-emerald-700 font-serif-display font-mono">
                  {formatDT(confirmedReservation.totalDirect)}
                </span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-950 text-right space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>حصيلة شرائك التضامني المباشر :</span>
              </p>
              <p>• وفرت في ميزانيتك <strong>{formatDT(confirmedReservation.totalSavings)}</strong> مقارنة بالمضاربين والمغازات.</p>
              <p>• <strong>{formatDT(confirmedReservation.producerBonus)}</strong> تذهب مباشرة للفلاّح التونسي دعماً لأرضه وعائلته.</p>
            </div>

            <button
              onClick={() => {
                setConfirmedReservation(null);
                onClose();
              }}
              className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              تم · رجوع للسوق الفلاحي
            </button>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart */
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-3xl">
              🥕
            </div>
            <h3 className="font-serif-display font-bold text-lg text-stone-900">
              قفتك ما زالت فارغة
            </h3>
            <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
              تصفح غلال وخضروات وزيت الزيتون المعصور طازجاً من سواني ومزارع جيرانك!
            </p>
            <button
              onClick={onClose}
              className="mt-2 py-2 px-4 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-600 transition-colors cursor-pointer"
            >
              اكتشف صابة اليوم
            </button>
          </div>
        ) : (
          /* Cart List & Checkout */
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* List of items */}
            <div className="space-y-2.5">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-stone-50 border border-stone-200 rounded-2xl p-3 flex items-center justify-between gap-3"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif-display font-bold text-xs text-stone-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      {item.product.farmName} · {item.product.unit}
                    </p>
                    <div className="flex items-baseline gap-1 mt-0.5 font-mono">
                      <span className="font-bold text-xs text-emerald-700">
                        {formatDT(item.product.priceDirect * item.quantity)}
                      </span>
                      <span className="text-[10px] text-stone-400 line-through mr-1">
                        {formatDT(item.product.priceSupermarketEstimated * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl p-1 shadow-2xs shrink-0">
                    <button
                      onClick={() => {
                        playClickSound();
                        onRemoveFromCart(item.product);
                      }}
                      aria-label="إنقاص الكمية"
                      className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-bold text-xs text-stone-900 font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        playClickSound();
                        onAddToCart(item.product);
                      }}
                      aria-label="زيادة الكمية"
                      className="w-6 h-6 rounded-lg bg-emerald-700 hover:bg-emerald-600 flex items-center justify-center text-white cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Form */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3">
              <form onSubmit={handleApplyCode} className="flex gap-2">
                <input
                  type="text"
                  placeholder="كود التخفيض الفلاحي (مثال: BARAKA15)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600 uppercase font-mono"
                />
                <button
                  type="submit"
                  className="py-1.5 px-3 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
                >
                  تفعيل
                </button>
              </form>
              {activePromoCode && (
                <div className="mt-2 text-xs text-emerald-800 font-bold flex items-center gap-1">
                  <Ticket className="w-3.5 h-3.5" />
                  <span>الامتياز المفعّل : <strong>{activePromoCode}</strong> (-{activePromoDiscount}%)</span>
                </div>
              )}
              {promoError && (
                <p className="mt-1 text-[11px] text-red-600">
                  كود غير صحيح. دوّر عجلة البركة لتربح كود تخفيض فوري!
                </p>
              )}
            </div>

            {/* Pickup selection */}
            <div className="border border-stone-200 rounded-2xl p-3 space-y-2">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>اختر نقطة الاستلام بدون مصاريف إضافية</span>
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPickupOption('ferme')}
                  className={`p-2 rounded-xl text-right border transition-all cursor-pointer ${
                    pickupOption === 'ferme'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                      : 'bg-white border-stone-200 text-stone-700'
                  }`}
                >
                  <span>🚜 في السانية مباشرة</span>
                  <span className="block text-[10px] text-stone-500 font-normal">اليوم انطلاقاً من 16:30</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPickupOption('relais')}
                  className={`p-2 rounded-xl text-right border transition-all cursor-pointer ${
                    pickupOption === 'relais'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                      : 'bg-white border-stone-200 text-stone-700'
                  }`}
                >
                  <span>🏛️ نقطة تسليم ساحة البلدية</span>
                  <span className="block text-[10px] text-stone-500 font-normal">توزيع جماعي الساعة 18:00</span>
                </button>
              </div>
            </div>

            {/* Anti-Intermédiaire Financial Breakdown in DT */}
            <div className="bg-emerald-950 text-white rounded-2xl p-4 space-y-2 text-xs shadow-inner">
              <div className="flex justify-between text-stone-400">
                <span>المقابل عند القشارة والمغازات :</span>
                <span className="line-through font-mono">{formatDT(totals.subtotalSupermarket)}</span>
              </div>
              <div className="flex justify-between text-emerald-300 font-bold">
                <span>توفيرك المباشر في قفتك :</span>
                <span className="font-mono">-{formatDT(totals.totalCitizenSavings)} ({totals.savingsPercentage}%)</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-amber-300">
                  <span>هدية عجلة البركة :</span>
                  <span className="font-mono">-{formatDT(totals.discountAmount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-emerald-800 flex justify-between items-baseline">
                <span className="font-serif-display font-bold text-sm text-white">المجموع النهائي للقفة :</span>
                <span className="text-xl font-extrabold text-emerald-300 font-serif-display font-mono">
                  {formatDT(totals.totalDirect)}
                </span>
              </div>
              <p className="text-[10px] text-emerald-200/80 pt-1 border-t border-emerald-900 font-medium">
                🇹🇳 <strong>{formatDT(totals.farmerRevenue)}</strong> تذهب مباشرة للفلاحين بدون وساطة وسماسرة.
              </p>
            </div>
          </div>
        )}

        {/* Footer Confirmation Button */}
        {!confirmedReservation && items.length > 0 && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 shrink-0">
            <button
              onClick={handleConfirmReservation}
              className="w-full py-3.5 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span>تأكيد حجز القفة ({formatDT(totals.totalDirect)})</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <p className="text-center text-[11px] text-stone-500 mt-1.5 font-medium">
              بدون أي خلاص إلكتروني · الدفع نقداً عند استلام الخضار والغلال
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
