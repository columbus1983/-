import React from 'react';
import { ShoppingBag, Sparkles, MapPin, Smartphone, Monitor, Tractor, User, HelpCircle, Bell } from 'lucide-react';

interface HeaderProps {
  maxDistance: number;
  onDistanceChange: (km: number) => void;
  cartCount: number;
  onOpenCart: () => void;
  isProducerMode: boolean;
  onToggleProducerMode: () => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  onOpenExplainer: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  onOpenProfile: () => void;
  favoriteProducersCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  maxDistance,
  onDistanceChange,
  cartCount,
  onOpenCart,
  isProducerMode,
  onToggleProducerMode,
  isPhoneFrame,
  onTogglePhoneFrame,
  onOpenExplainer,
  onOpenNotifications,
  unreadNotificationsCount,
  onOpenProfile,
  favoriteProducersCount = 0,
}) => {
  return (
    <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-40 shadow-sm" dir="rtl">
      {/* Top Banner: Anti-Intermédiaire & Anti-Gachara */}
      <div className="bg-emerald-800 px-3 py-1.5 text-xs text-emerald-100 flex items-center justify-between font-medium">
        <div className="flex items-center gap-1.5 truncate">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="truncate">
            <strong className="text-white">0% قشارة أو سماسرة :</strong> من السانية لمائدتك مباشرة · سوم معقول للمواطن والربح للفلاّح
          </span>
        </div>
        <button
          onClick={onOpenExplainer}
          className="text-amber-200 hover:text-white underline mr-2 shrink-0 flex items-center gap-1 text-[11px] cursor-pointer"
          title="كيفاش المنظومة تربح المواطن والفلاّح وتلغي القشارة"
        >
          <HelpCircle className="w-3 h-3" />
          <span>كيفاش تخدم؟</span>
        </button>
      </div>

      {/* Main Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center shadow-inner text-amber-300 font-bold text-xl">
            🇹🇳
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-display font-extrabold text-xl tracking-tight text-white">
                فلّاحنا
              </span>
              <span className="text-[10px] tracking-wider font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/80 px-1.5 py-0.5 rounded">
                تونس الخضراء
              </span>
            </div>
            <p className="text-[11px] text-stone-400 leading-none">
              خيرات بلادنا بأعز الأسعار والجودة
            </p>
          </div>
        </div>

        {/* Quick controls: Distance & Cart */}
        <div className="flex items-center gap-2">
          {/* Distance Dropdown */}
          <div className="flex items-center gap-1 bg-stone-800/80 border border-stone-700/80 rounded-lg px-2 py-1 text-xs text-stone-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              aria-label="المسافة حولك بالكيلومتر"
              value={maxDistance}
              onChange={(e) => onDistanceChange(Number(e.target.value))}
              className="bg-transparent text-stone-200 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value={3} className="bg-stone-900 text-white">&lt; 3 كم</option>
              <option value={5} className="bg-stone-900 text-white">&lt; 5 كم</option>
              <option value={10} className="bg-stone-900 text-white">&lt; 10 كم</option>
              <option value={20} className="bg-stone-900 text-white">&lt; 20 كم</option>
            </select>
          </div>

          {/* Desktop Only: Phone frame toggle */}
          <button
            onClick={onTogglePhoneFrame}
            className="hidden md:flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-stone-300 px-2 py-1 rounded-lg text-xs transition-colors cursor-pointer"
            title={isPhoneFrame ? "شاشة عريضة" : "عرض في شكل هاتف"}
          >
            {isPhoneFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-[11px]">عريض</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[11px]">هاتف</span>
              </>
            )}
          </button>

          {/* Producer / Citizen Switch Button */}
          <button
            onClick={onToggleProducerMode}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isProducerMode
                ? 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
            }`}
            title="التبديل بين واجهة المواطن وواجهة الفلاّح"
          >
            {isProducerMode ? (
              <>
                <User className="w-3.5 h-3.5" />
                <span className="text-[11px]">رجوع للمواطن</span>
              </>
            ) : (
              <>
                <Tractor className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] hidden sm:inline">فضاء الفلاّح</span>
                <span className="text-[11px] sm:hidden">فلاّح</span>
              </>
            )}
          </button>

          {/* Notifications Bell Button */}
          <button
            onClick={onOpenNotifications}
            aria-label={`مركز الإشعارات (${unreadNotificationsCount} إشعارات غير مقروءة)`}
            className="relative bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-200 hover:text-white p-2 rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer border border-stone-700"
            title="إشعارات الفلاحة المفضلين والصابة الجديدة"
          >
            <Bell className="w-4 h-4 text-amber-300" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -left-1 bg-red-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Profile & Mes Producteurs Favoris Button */}
          <button
            onClick={onOpenProfile}
            aria-label="الملف الشخصي وفلاحتي المفضلون"
            className="relative bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-200 hover:text-white p-2 rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer border border-stone-700"
            title="الملف الشخصي · فلاحتي المفضلون (Mes Producteurs Favoris)"
          >
            <User className="w-4 h-4 text-emerald-400" />
            {favoriteProducersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {favoriteProducersCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            aria-label={`فتح القفة (${cartCount} منتجات)`}
            className="relative bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white p-2 rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -left-1 bg-amber-400 text-stone-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
