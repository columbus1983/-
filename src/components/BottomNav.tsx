import React from 'react';
import { Store, MapPin, Disc, ShoppingBag, Tractor, MessageSquare, Heart } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export type ActiveTab = 'market' | 'map' | 'favorites' | 'wheel' | 'chat' | 'producer';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  cartCount: number;
  onOpenCart: () => void;
  unreadChatCount?: number;
  favoriteProducersCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  cartCount,
  onOpenCart,
  unreadChatCount = 3,
  favoriteProducersCount = 2,
}) => {
  return (
    <nav 
      aria-label="شريط التنقل الرئيسي"
      className="fixed bottom-0 inset-x-0 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 z-40 py-1.5 px-2 max-w-lg mx-auto sm:rounded-t-3xl shadow-lg"
      dir="rtl"
    >
      <div className="flex items-center justify-around">
        {/* السوق */}
        <button
          onClick={() => {
            playClickSound();
            onChangeTab('market');
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'market'
              ? 'text-emerald-400 font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Store className={`w-5 h-5 ${activeTab === 'market' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-bold">السوق</span>
        </button>

        {/* الخريطة */}
        <button
          onClick={() => {
            playClickSound();
            onChangeTab('map');
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'map'
              ? 'text-emerald-400 font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <MapPin className={`w-5 h-5 ${activeTab === 'map' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-bold">الخريطة</span>
        </button>

        {/* فلاحتي المفضلون */}
        <button
          onClick={() => {
            playClickSound();
            onChangeTab('favorites');
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'favorites'
              ? 'text-emerald-400 font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${activeTab === 'favorites' ? 'fill-emerald-400 stroke-emerald-400' : ''}`} />
            {favoriteProducersCount > 0 && (
              <span className="absolute -top-1 -left-1.5 bg-emerald-600 text-white font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono">
                {favoriteProducersCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">فلاحتي</span>
        </button>


        {/* شات الحوار والمحادثة المباشرة */}
        <button
          onClick={() => {
            playClickSound();
            onChangeTab('chat');
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'chat'
              ? 'text-emerald-400 font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <div className="relative">
            <MessageSquare className={`w-5 h-5 ${activeTab === 'chat' ? 'stroke-[2.5]' : ''}`} />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1 -left-2 bg-emerald-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {unreadChatCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">الشات</span>
        </button>

        {/* عجلة البركة */}
        <button
          onClick={() => {
            playClickSound();
            onChangeTab('wheel');
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'wheel'
              ? 'text-amber-400 font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <div className="relative">
            <Disc className={`w-5 h-5 ${activeTab === 'wheel' ? 'stroke-[2.5] text-amber-400' : ''}`} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          </div>
          <span className="text-[10px] font-bold">العجلة</span>
        </button>

        {/* القفة */}
        <button
          onClick={() => {
            playClickSound();
            onOpenCart();
          }}
          aria-label={`عرض القفة (${cartCount} منتجات)`}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer text-stone-400 hover:text-stone-200"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -left-2 bg-amber-400 text-stone-950 font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">القفة</span>
        </button>

        {/* فضاء الفلاّح */}
        <button
          onClick={() => {
            playClickSound();
            onChangeTab('producer');
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'producer'
              ? 'text-amber-400 font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Tractor className={`w-5 h-5 ${activeTab === 'producer' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-bold">الفلاّح</span>
        </button>
      </div>
    </nav>
  );
};
