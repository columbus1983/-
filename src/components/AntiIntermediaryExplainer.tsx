import React, { useState } from 'react';
import { X, Sparkles, Scale } from 'lucide-react';
import { formatDT } from '../utils/pricing';

interface AntiIntermediaryExplainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AntiIntermediaryExplainer: React.FC<AntiIntermediaryExplainerProps> = ({
  isOpen,
  onClose,
}) => {
  const [basketAmount, setBasketAmount] = useState<number>(50);

  if (!isOpen) return null;

  // Real world Tunisian market economics:
  // In traditional circuits, "القشارة" and multiple middlemen swallow ~78% of the consumer's bill:
  const supermarketFarmer = basketAmount * 0.22;
  const supermarketIntermediaries = basketAmount * 0.78;

  // In Fellahna direct circuit:
  const directBasketCost = basketAmount * 0.52;
  const directFarmer = directBasketCost * 0.95;
  const citizenSaved = basketAmount - directBasketCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs" dir="rtl">
      <div 
        className="bg-white w-full max-w-lg max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-stone-200 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="explainer-title"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-900 to-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇹🇳</span>
            <div>
              <h2 id="explainer-title" className="font-serif-display font-bold text-base leading-tight">
                كيفاش نقضيو على دور القشارة والمضاربين؟
              </h2>
              <p className="text-[11px] text-emerald-300">
                من السانية للمائدة : التونسي يربح والفلاّح يعيش بكرامة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق التوضيح"
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-700">
          {/* Manifesto summary */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 space-y-1.5">
            <div className="font-bold text-amber-900 flex items-center gap-1.5 font-serif-display text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>واقع السوق في تونس : مشكل القشارة والوسطاء</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed font-medium">
              في المنظومة الكلاسيكية، كيلو الطماطم أو البطاطا يخرج من عند الفلاّح بـ 600 مليم، يتعدى على القشار الأول، ثم سوق الجملة، ثم النقال، ثم تاجر التفصيل، ليصل للمواطن بأكثر من 2.500 د.ت!
            </p>
            <p className="text-xs text-stone-950 font-bold leading-relaxed">
              النتيجة : المواطن التونسي يكتوي بغلاء الأسعار، والفلاّح لا يغطي حتى كلفة البذور والماء، بينما أرباح طائلة تمشي لجيوب الوسطاء والسماسرة.
            </p>
          </div>

          {/* Interactive Comparison Simulator in DT */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="budget-slider" className="font-bold text-stone-900 text-xs flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-emerald-700" />
                <span>جرّب قيمة قفتك المعتادة :</span>
              </label>
              <span className="font-serif-display font-extrabold text-emerald-800 text-base font-mono">
                {basketAmount} دينار في السوق العادي
              </span>
            </div>

            <input
              id="budget-slider"
              type="range"
              min="20"
              max="200"
              step="10"
              value={basketAmount}
              onChange={(e) => setBasketAmount(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              {/* مسار القشارة والمغازات */}
              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-2">
                <strong className="text-stone-800 block font-bold">في مسار القشارة والمغازات</strong>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between text-stone-500 font-medium">
                    <span>تدفع :</span>
                    <span className="font-bold text-stone-800 font-mono">{formatDT(basketAmount)}</span>
                  </div>
                  <div className="flex justify-between text-red-600 font-medium">
                    <span>أرباح الوسطاء والقشارة :</span>
                    <span className="font-bold font-mono">-{formatDT(supermarketIntermediaries)}</span>
                  </div>
                  <div className="flex justify-between text-stone-700 border-t border-stone-100 pt-1">
                    <span>ما يبقى للفلاّح التونسي :</span>
                    <span className="font-bold text-amber-700 font-mono">{formatDT(supermarketFarmer)}</span>
                  </div>
                </div>
              </div>

              {/* تطبيق فلّاحنا المباشر */}
              <div className="bg-emerald-950 text-white p-3 rounded-xl space-y-2 shadow-xs">
                <strong className="text-emerald-300 block font-bold">مع تطبيق فلّاحنا المباشر</strong>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between text-emerald-200 font-medium">
                    <span>تدفع فقط :</span>
                    <span className="font-extrabold text-emerald-300 font-serif-display text-sm font-mono">{formatDT(directBasketCost)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>توفيرك المالي :</span>
                    <span className="font-mono">+{formatDT(citizenSaved)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-100 border-t border-emerald-800 pt-1">
                    <span>يذهب للفلاّح مباشرة :</span>
                    <span className="font-bold text-emerald-300 font-mono">{formatDT(directFarmer)}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-emerald-900 bg-emerald-50 p-2.5 rounded-lg font-bold text-center leading-relaxed">
              🎉 نفس الخضار والغلال، الفلاّح يربح أكثر من الضعف ({formatDT(directFarmer)} مقابل {formatDT(supermarketFarmer)}) وأنت توفر في ميزانيتك {formatDT(citizenSaved)} !
            </p>
          </div>

          {/* 3 Pillars of Fellahna */}
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs">
                1
              </div>
              <div>
                <strong className="text-stone-900 block text-xs">فرص حقيقية وتخفيضات للمواطن البسيط</strong>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  قفة خضار متكاملة بأقل من 8 دنانير، تمور ملكية وزيت زيتون بكر ممتاز مباشرة من المعصرة بدون أي مضاربة.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs">
                2
              </div>
              <div>
                <strong className="text-stone-900 block text-xs">حماية الفلاّح التونسي وصيانة كرامته</strong>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  الفلاّح يحدد سعره العادل بنفسه ويبيع صابته في نفس اليوم طازجة دون أن يضطر لرميها أو التفريط فيها ببخس الأثمان.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs">
                3
              </div>
              <div>
                <strong className="text-stone-900 block text-xs">جو عائلي، تضامني وممتع للجميع</strong>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  تواصل عبر الهاتف أو الرسائل مع الفلاّح، استلام في السانية أو نقطة الحومة، وعجلة بركة تمنحك هدايا أسبوعية.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            فهمت المنظومة، وريني صابة اليوم والأسعار
          </button>
        </div>
      </div>
    </div>
  );
};
