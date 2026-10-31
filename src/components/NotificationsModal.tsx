import React, { useState } from 'react';
import { AppNotification, Producer, Product } from '../types';
import { formatDT } from '../utils/pricing';
import { Bell, Heart, X, CheckCheck, Trash2, ArrowLeft, Sparkles, PlusCircle } from 'lucide-react';
import { playClickSound, playWinCelebration } from '../utils/audio';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onOpenProduct: (productId: string) => void;
  onSimulateNewHarvestAlert: (producerId: string, harvestName: string, price: number, unit: string) => void;
  producers: Producer[];
  likedProducerIds: Set<string>;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onOpenProduct,
  onSimulateNewHarvestAlert,
  producers,
  likedProducerIds,
}) => {
  const [filter, setFilter] = useState<'all' | 'liked' | 'unread'>('all');

  // Simulation controls state
  const [simProducerId, setSimProducerId] = useState<string>(producers[0]?.id || 'prod-1');
  const [simHarvestPreset, setSimHarvestPreset] = useState<number>(0);

  if (!isOpen) return null;

  const harvestPresets = [
    { name: 'فراولو نابل البلدي معصور وحلو (باركيطة 500 غ)', price: 3.200, unit: 'باركيطة 500 غ' },
    { name: 'مشمش بلدي شامي طازج من الشجرة مباشرة', price: 2.800, unit: 'للكيلوغرام' },
    { name: 'زيتون شملالي مسللة دياري بالليمون والزعتر', price: 4.500, unit: 'سطل 1 كغ' },
    { name: 'زبدة عربية بقرية طبيعية 100% من مروج باجة', price: 5.500, unit: 'القطعة 500 غ' },
  ];

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'liked') {
      return likedProducerIds.has(notif.producerId);
    }
    if (filter === 'unread') {
      return !notif.isRead;
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleRunSimulation = () => {
    playWinCelebration();
    const preset = harvestPresets[simHarvestPreset];
    onSimulateNewHarvestAlert(simProducerId, preset.name, preset.price, preset.unit);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/75 backdrop-blur-xs" dir="rtl">
      <div 
        className="bg-white w-full max-w-lg max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-stone-200 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notif-title"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-900 to-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-lg shadow-xs">
              🔔
            </div>
            <div>
              <h2 id="notif-title" className="font-serif-display font-bold text-base leading-tight">
                إشعارات الفلاحة والصابة الموسمية
              </h2>
              <p className="text-[11px] text-emerald-300">
                {unreadCount > 0 ? `${unreadCount} تنبيهات جديدة لم تفتح بعد` : 'أنت مطلع على كل صابة الفلاحة المفضلين'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-[11px] text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer"
                title="تحديد الكل كمقروء"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">قراءة الكل</span>
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="إغلاق الإشعارات"
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Simulator Box (Requested feature: simulation d'interface de notification) */}
        <div className="bg-amber-50/80 border-b border-amber-200/80 p-3.5 space-y-2.5 shrink-0">
          <div className="flex items-center justify-between">
            <span className="font-serif-display font-bold text-xs text-amber-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>محاكي إضافة صابة موسمية جديدة من فلاّح مفضل</span>
            </span>
            <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded">
              تجربة تفاعلية
            </span>
          </div>

          <p className="text-[11px] text-stone-600 leading-tight">
            اختر الفلاّح ونوع الصابة، واضغط الزر لاختبار ظهور التنبيه اللحظي (Push Notification) مع الصوت وشارة التنبيهات.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-stone-700 mb-0.5">
                الفلاّح المُعجب به :
              </label>
              <select
                value={simProducerId}
                onChange={(e) => setSimProducerId(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-xl px-2 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {producers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.farmName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-700 mb-0.5">
                الصابة الموسمية الجديدة :
              </label>
              <select
                value={simHarvestPreset}
                onChange={(e) => setSimHarvestPreset(Number(e.target.value))}
                className="w-full bg-white border border-amber-300 rounded-xl px-2 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {harvestPresets.map((preset, idx) => (
                  <option key={idx} value={idx}>
                    {preset.name} ({preset.price.toFixed(3)} د.ت)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleRunSimulation}
            className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>محاكاة: إرسال تنبيه "صابة جديدة من فلاّحي المفضل" الآن</span>
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="px-4 py-2 border-b border-stone-100 flex items-center gap-2 bg-stone-50 shrink-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
            }`}
          >
            الكل ({notifications.length})
          </button>

          <button
            onClick={() => setFilter('liked')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filter === 'liked'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
            }`}
          >
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>الفلاحة المفضلين ({notifications.filter((n) => likedProducerIds.has(n.producerId)).length})</span>
          </button>

          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'unread'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
            }`}
          >
            غير مقروءة ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center p-8 space-y-2 text-stone-500">
              <Bell className="w-12 h-12 mx-auto text-stone-300" />
              <p className="font-serif-display font-bold text-sm text-stone-700">لا توجد إشعارات مطابقة حالياً</p>
              <p className="text-xs text-stone-400">عندما يقوم الفلاّح الذي أعجبت به بإضافة صابة جديدة، ستصلك رسالة فورية هنا!</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isFavorite = likedProducerIds.has(notif.producerId);
              return (
                <div
                  key={notif.id}
                  onClick={() => onMarkAsRead(notif.id)}
                  className={`rounded-2xl p-3.5 border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    notif.isRead
                      ? 'bg-white border-stone-200 text-stone-800 opacity-90'
                      : 'bg-emerald-50/70 border-emerald-300 shadow-2xs text-stone-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Producer Avatar with Heart badge */}
                    <div className="relative shrink-0">
                      <img
                        src={notif.producerAvatar}
                        alt={notif.producerName}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-xs"
                      />
                      {isFavorite && (
                        <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center absolute -bottom-1 -left-1 shadow-xs">
                          <Heart className="w-2.5 h-2.5 fill-white" />
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-serif-display font-bold text-xs text-stone-900">
                            {notif.producerName}
                          </h4>
                          {isFavorite && (
                            <span className="text-[9px] bg-red-100 text-red-800 font-bold px-1.5 py-0.2 rounded">
                              فلاّحك المفضل
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {notif.timestamp}
                        </span>
                      </div>

                      <p className="text-[11px] text-stone-500">
                        {notif.farmName} · ولاية {notif.governorate}
                      </p>

                      <p className="text-xs text-stone-800 mt-1 font-semibold leading-relaxed">
                        {notif.message}
                      </p>

                      {/* Product Preview Snippet */}
                      <div className="mt-2 bg-white/90 border border-stone-200 rounded-xl p-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={notif.productImage}
                            alt={notif.productName}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-stone-900 block truncate">
                              {notif.productName}
                            </span>
                            <span className="text-[11px] text-emerald-700 font-bold font-mono">
                              {formatDT(notif.priceDirect)} / {notif.unit}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playClickSound();
                            onMarkAsRead(notif.id);
                            onClose();
                            onOpenProduct(notif.productId);
                          }}
                          className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                        >
                          <span>حجز الصابة</span>
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-100">
                    <span className="flex items-center gap-1">
                      {notif.isRead ? (
                        <span className="text-stone-400">✓ تمت القراءة</span>
                      ) : (
                        <span className="text-emerald-700 font-bold">● تنبيه غير مقروء</span>
                      )}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNotification(notif.id);
                      }}
                      className="text-stone-400 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
                      title="حذف الإشعار"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
