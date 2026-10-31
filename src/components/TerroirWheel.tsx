import React, { useState, useRef } from 'react';
import { SPIN_REWARDS } from '../data/mockData';
import { SpinReward } from '../types';
import { playTickSound, playWinCelebration } from '../utils/audio';
import { Sparkles, Trophy, Check, ArrowLeft, RotateCw, Gift } from 'lucide-react';

interface TerroirWheelProps {
  onApplyReward: (reward: SpinReward) => void;
  activePromoCode?: string;
  onGoToMarket: () => void;
}

export const TerroirWheel: React.FC<TerroirWheelProps> = ({
  onApplyReward,
  activePromoCode,
  onGoToMarket,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonReward, setWonReward] = useState<SpinReward | null>(null);
  const [spinsLeft, setSpinsLeft] = useState(3);
  const wheelRef = useRef<HTMLDivElement>(null);

  const rewards = SPIN_REWARDS;
  const numSegments = rewards.length;
  const segmentAngle = 360 / numSegments;

  const handleSpin = () => {
    if (isSpinning || spinsLeft <= 0) return;

    setIsSpinning(true);
    setWonReward(null);

    let tickCount = 0;
    const tickInterval = setInterval(() => {
      playTickSound();
      tickCount++;
      if (tickCount > 25) clearInterval(tickInterval);
    }, 120);

    const randomIndex = Math.floor(Math.random() * numSegments);
    const selectedReward = rewards[randomIndex];

    const extraTurns = 5 * 360;
    const targetOffset = 360 - (randomIndex * segmentAngle + segmentAngle / 2);
    const newRotation = rotation + extraTurns + targetOffset;

    setRotation(newRotation);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setWonReward(selectedReward);
      setSpinsLeft((prev) => Math.max(0, prev - 1));
      playWinCelebration();
      onApplyReward(selectedReward);
    }, 3200);
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 text-white rounded-3xl p-5 shadow-sm text-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-stone-950 px-3 py-1 rounded-full text-xs font-bold mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>لعبة البركة والتضامن التونسي</span>
          </div>
          <h2 className="font-serif-display font-extrabold text-xl sm:text-2xl text-white">
            عجلة الخير والبركة 🎡
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-sm mx-auto mt-1 leading-relaxed">
            دور العجلة كل يوم واربح تخفيضات مباشرة على قفتك، هدايا فلاحية، أو وصفات تونسية زمنية من أمهاتنا وجداتنا!
          </p>
        </div>
      </div>

      {/* Wheel Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs flex flex-col items-center">
        {/* Pointer indicator */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 my-2 flex items-center justify-center">
          {/* Top arrow pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-30 filter drop-shadow-md">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-500" />
          </div>

          {/* Wheel Disc */}
          <div
            ref={wheelRef}
            className="w-full h-full rounded-full border-8 border-stone-800 shadow-xl overflow-hidden relative"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? 'transform 3.2s cubic-bezier(0.15, 0.9, 0.25, 1)'
                : 'none',
            }}
          >
            {rewards.map((reward, i) => {
              const startAngle = i * segmentAngle;
              return (
                <div
                  key={reward.id}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    transform: `rotate(${startAngle}deg)`,
                    transformOrigin: '50% 50%',
                  }}
                >
                  {/* Slice background */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-36 origin-bottom"
                    style={{
                      backgroundColor: reward.color,
                      clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                    }}
                  />

                  {/* Slice Text */}
                  <div
                    className="absolute top-4 left-1/2 -translate-x-1/2 text-center text-white font-bold select-none pointer-events-none"
                    style={{ width: '85px' }}
                  >
                    <span className="text-[11px] leading-tight block drop-shadow-xs font-serif-display">
                      {reward.title}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Central hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-stone-900 border-4 border-amber-400 flex items-center justify-center text-white text-xl font-bold shadow-lg z-20">
              🇹🇳
            </div>
          </div>
        </div>

        {/* Spin action button */}
        <div className="mt-4 w-full max-w-xs flex flex-col items-center gap-2">
          <button
            onClick={handleSpin}
            disabled={isSpinning || spinsLeft <= 0}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer ${
              isSpinning
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : spinsLeft <= 0
                ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                : 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-emerald-700/20'
            }`}
          >
            <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>
              {isSpinning ? 'العجلة تدور...' : `دوّر العجلة (${spinsLeft} محاولة متبقية)`}
            </span>
          </button>

          <p className="text-[11px] text-stone-500">
            مجانية 100% · مهداة من مجمع الفلاحين التونسيين
          </p>
        </div>

        {/* Reward celebration card */}
        {wonReward && (
          <div className="mt-5 w-full bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 animate-in zoom-in-95 duration-300 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-400/30 text-amber-900 flex items-center justify-center text-2xl">
              🎉
            </div>
            <div>
              <span className="text-xs font-bold text-amber-900">
                مبروك عليك، ربحت معنا :
              </span>
              <h3 className="font-serif-display font-bold text-lg text-stone-900 mt-0.5">
                {wonReward.title}
              </h3>
              <p className="text-xs text-stone-600">
                {wonReward.subtitle}
              </p>
            </div>

            <div className="bg-white border border-dashed border-amber-400 p-2.5 rounded-xl flex items-center justify-between text-xs">
              <span className="text-stone-600 font-medium">كود الهدية :</span>
              <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                {wonReward.code}
              </span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                تم التطبيق في القفة
              </span>
            </div>

            {wonReward.type === 'recipe' && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-right text-xs text-emerald-950 space-y-1 leading-relaxed">
                <strong className="block font-serif-display font-bold">🌶️ سر السلاطة المشوية التونسية الفاوحة :</strong>
                <p>
                  1. اشوي فلفل بقلوطي حار مع طماطم وثوم على كانون فحم أو طابونة.
                  2. قشر الخضار بهدوء بدون غسلها بالماء حتى تحافظ على ريحة الشواء.
                  3. اهرس بالمهراس مع كروية، تابل، ملح وزيت زيتونة شملالي جديد من عند خالتي فاطمة. شاهية طيبة!
                </p>
              </div>
            )}

            <button
              onClick={onGoToMarket}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>استعمل التخفيض في السوق</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Current Active Promo Code Status */}
        {activePromoCode && !wonReward && (
          <div className="mt-4 w-full bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-600" />
              <span>الامتياز المفعّل : <strong>{activePromoCode}</strong></span>
            </div>
            <button
              onClick={onGoToMarket}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              شوف القفة &gt;
            </button>
          </div>
        )}
      </div>

      {/* Community Convivial Highlights */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-1.5">
        <h4 className="font-serif-display font-bold text-xs text-stone-900 flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>هل تعلم؟</span>
        </h4>
        <p className="text-xs text-stone-600 leading-relaxed font-medium">
          كل دينار تونسي تشريه مباشرة من الفلاّح يرجع بنسبة 95% لعائلات الفلاحة وأرض تونس، ويقطع الطريق على المضاربين وسماسرة الأزمات.
        </p>
      </div>
    </div>
  );
};
