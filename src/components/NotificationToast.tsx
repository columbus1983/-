import React, { useEffect } from 'react';
import { AppNotification } from '../types';
import { Bell, X, ArrowLeft, Heart } from 'lucide-react';
import { formatDT } from '../utils/pricing';

interface NotificationToastProps {
  notification: AppNotification | null;
  onClose: () => void;
  onOpenProduct: (productId: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  onOpenProduct,
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 7000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div 
      role="status"
      aria-live="polite"
      className="fixed top-4 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-[100] w-auto sm:w-[420px] animate-in slide-in-from-top-4 duration-300 pointer-events-auto"
      dir="rtl"
    >
      <div className="bg-stone-900/95 text-white rounded-2xl p-3 shadow-2xl border border-amber-400/80 backdrop-blur-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <img
              src={notification.producerAvatar}
              alt={notification.producerName}
              className="w-11 h-11 rounded-xl object-cover border-2 border-amber-400"
            />
            <span className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[9px] shadow-xs">
              <Heart className="w-2.5 h-2.5 fill-white" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-bold">
              <Bell className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">صابة جديدة من {notification.producerName}</span>
            </div>

            <h4 className="font-serif-display font-bold text-xs text-white truncate mt-0.5">
              {notification.productName}
            </h4>

            <div className="flex items-center gap-2 text-[10px] text-stone-300 mt-0.5">
              <span className="text-emerald-400 font-extrabold font-mono">{formatDT(notification.priceDirect)}</span>
              <span>·</span>
              <span className="text-stone-400 truncate">{notification.farmName}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => {
              onOpenProduct(notification.productId);
              onClose();
            }}
            className="py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <span>عرض</span>
            <ArrowLeft className="w-3 h-3" />
          </button>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="إغلاق التنبيه"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
