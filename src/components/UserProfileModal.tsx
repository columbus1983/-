import React, { useState } from 'react';
import {
  User,
  Heart,
  Bell,
  BellOff,
  Tractor,
  MapPin,
  Check,
  Phone,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Sliders,
  ChevronDown,
  ChevronUp,
  X,
  Radio,
  ShoppingBag,
  Share2,
} from 'lucide-react';
import { Producer, ProducerSubscription, UserProfile } from '../types';
import { playClickSound, playPopSound, playWinCelebration } from '../utils/audio';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  producers: Producer[];
  subscriptions: Record<string, ProducerSubscription>;
  onToggleSubscription: (producerId: string) => void;
  onUpdateSubscriptionSettings: (
    producerId: string,
    updates: Partial<Omit<ProducerSubscription, 'producerId'>>
  ) => void;
  onOpenChatWithProducer: (producerId: string) => void;
  onSimulateHarvestAlert: (
    producerId: string,
    harvestName: string,
    price: number,
    unit: string
  ) => void;
  onFilterMarketByProducer?: (producerId: string) => void;
  isInline?: boolean;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  producers,
  subscriptions,
  onToggleSubscription,
  onUpdateSubscriptionSettings,
  onOpenChatWithProducer,
  onSimulateHarvestAlert,
  onFilterMarketByProducer,
  isInline = false,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'subscribed' | 'discover'>('subscribed');
  const [expandedSettingsProducerId, setExpandedSettingsProducerId] = useState<string | null>(null);
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('all');
  const [copiedPhoneProducerId, setCopiedPhoneProducerId] = useState<string | null>(null);

  if (!isInline && !isOpen) return null;

  const subscribedCount = Object.values(subscriptions).filter((s) => s.isSubscribed).length;

  const filteredProducers = producers.filter((p) => {
    const isSub = Boolean(subscriptions[p.id]?.isSubscribed);
    if (activeFilter === 'subscribed' && !isSub) return false;
    if (activeFilter === 'discover' && isSub) return false;
    if (selectedGovernorate !== 'all' && p.governorate !== selectedGovernorate) return false;
    return true;
  });

  const governorates = Array.from(new Set(producers.map((p) => p.governorate)));

  const handleCopyPhone = (producerId: string, phone: string) => {
    navigator.clipboard?.writeText(phone);
    setCopiedPhoneProducerId(producerId);
    playPopSound();
    setTimeout(() => setCopiedPhoneProducerId(null), 2500);
  };

  const content = (
    <div className={`bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl w-full flex flex-col shadow-2xl overflow-hidden ${isInline ? 'mb-6' : 'max-w-xl max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900 p-4 border-b border-stone-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700/60 border border-emerald-500/50 flex items-center justify-center text-emerald-300">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 id="profile-title" className="text-base font-bold text-white leading-tight">
              الملف الشخصي وفلاحتي المفضلون
            </h2>
            <p className="text-xs text-stone-400">
              إدارة اشتراكات الصابة الموسمية بدون قشارة ولا وسطاء
            </p>
          </div>
        </div>
        {!isInline && (
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            aria-label="إغلاق الملف الشخصي"
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>


        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-6 flex-1">
          {/* User Citizen Identity Card */}
          <div className="bg-gradient-to-br from-stone-800/90 to-stone-850 border border-stone-700/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative shrink-0">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-md"
                />
                <span
                  title="مواطن تونسي موثق"
                  className="absolute -bottom-1 -left-1 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-stone-900 flex items-center gap-0.5 shadow-sm"
                >
                  🇹🇳 موثق
                </span>
              </div>

              <div className="text-center sm:text-right flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-lg font-bold text-white">{userProfile.name}</h3>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {userProfile.antiGacharaBadge}
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-1 flex items-center justify-center sm:justify-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{userProfile.city}</span>
                  <span className="text-stone-600">·</span>
                  <span>عضو منذ {userProfile.memberSince}</span>
                </p>

                {/* Citizen Circuit-Court Direct Impact Badges */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-700/60 text-center">
                  <div className="bg-stone-900/80 rounded-xl p-2 border border-stone-800">
                    <span className="block text-emerald-400 font-mono font-extrabold text-sm sm:text-base">
                      {userProfile.totalSavedDT.toFixed(3)} د.ت
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium leading-tight block">
                      وفرتها عن القشارة
                    </span>
                  </div>
                  <div className="bg-stone-900/80 rounded-xl p-2 border border-stone-800">
                    <span className="block text-amber-400 font-mono font-extrabold text-sm sm:text-base">
                      {userProfile.directOrdersCount}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium leading-tight block">
                      طلبيات بالدائرة القصيرة
                    </span>
                  </div>
                  <div className="bg-stone-900/80 rounded-xl p-2 border border-stone-800">
                    <span className="block text-white font-mono font-extrabold text-sm sm:text-base">
                      95%
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium leading-tight block">
                      في جيب الفلاّح
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN SECTION: Mes Producteurs Favoris (فلاحتي المفضلون واشتراكات الصابة) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500 shrink-0" />
                  <h3 className="text-base font-extrabold text-white">
                    فلاحتي المفضلون (Mes Producteurs Favoris)
                  </h3>
                  <span className="bg-emerald-950 border border-emerald-600/50 text-emerald-300 font-bold text-xs px-2 py-0.5 rounded-full font-mono">
                    {subscribedCount} مشترك
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  تحكّم في استلام تنبيهات الصابة الطازجة والتخفيضات اللحظية من الفلاحة التوانسة المفضلين
                </p>
              </div>

              {/* Quick Governorate Filter */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <span className="text-[11px] text-stone-400">الولاية:</span>
                <select
                  aria-label="تصفية حسب الولاية"
                  value={selectedGovernorate}
                  onChange={(e) => setSelectedGovernorate(e.target.value)}
                  className="bg-stone-800 border border-stone-700 text-stone-200 text-xs rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="all">كل الولايات</option>
                  {governorates.map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  playClickSound();
                  setActiveFilter('subscribed');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeFilter === 'subscribed'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>المتابعون فقط ({subscribedCount})</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setActiveFilter('all');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                }`}
              >
                <Tractor className="w-3.5 h-3.5" />
                <span>كل الفلاحة ({producers.length})</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setActiveFilter('discover');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeFilter === 'discover'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>اكتشف جدداً ({producers.length - subscribedCount})</span>
              </button>
            </div>

            {/* Producers List */}
            {filteredProducers.length === 0 ? (
              <div className="text-center py-10 px-4 bg-stone-800/40 rounded-2xl border border-dashed border-stone-700">
                <Heart className="w-10 h-10 text-stone-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-stone-300">لا يوجد فلاحة في هذا التبويب</h4>
                <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                  {activeFilter === 'subscribed'
                    ? 'لم تقم بمتابعة أي فلاّح حتى الآن. تصفح الفلاحة واضغط زر المتابعة لتصلك صاباتهم أولاً بأول!'
                    : 'جرب تغيير تصفية الولاية لمشاهدة بقية الفلاحة التوانسة.'}
                </p>
                {activeFilter === 'subscribed' && (
                  <button
                    onClick={() => {
                      playClickSound();
                      setActiveFilter('all');
                    }}
                    className="mt-3 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    عرض كل الفلاحة للاشتراك
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducers.map((producer) => {
                  const sub = subscriptions[producer.id] || {
                    producerId: producer.id,
                    isSubscribed: false,
                    alertFrequency: 'all_harvests',
                    notifySound: true,
                    notifySMS: false,
                    subscribedAt: 'الآن',
                  };
                  const isSubscribed = sub.isSubscribed;
                  const isExpanded = expandedSettingsProducerId === producer.id;

                  return (
                    <div
                      key={producer.id}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isSubscribed
                          ? 'bg-stone-850/90 border-emerald-600/40 shadow-sm'
                          : 'bg-stone-850/50 border-stone-800 opacity-90 hover:opacity-100'
                      }`}
                    >
                      {/* Farmer Card Top Banner */}
                      <div className="p-4 sm:p-4.5">
                        <div className="flex items-start gap-3.5">
                          {/* Producer Avatar with Status */}
                          <div className="relative shrink-0">
                            <img
                              src={producer.avatar}
                              alt={producer.name}
                              className={`w-14 h-14 rounded-2xl object-cover border-2 shadow-sm ${
                                isSubscribed ? 'border-emerald-500' : 'border-stone-700'
                              }`}
                            />
                            {isSubscribed && (
                              <span
                                title="مشترك في تنبيهات الصابة"
                                className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow"
                              >
                                <Heart className="w-3 h-3 fill-white text-white" />
                              </span>
                            )}
                          </div>

                          {/* Producer Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="font-extrabold text-sm sm:text-base text-white">
                                    {producer.name}
                                  </h4>
                                  <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-800">
                                    فلاّح معتمد
                                  </span>
                                </div>
                                <p className="text-xs font-semibold text-amber-300 mt-0.5">
                                  {producer.farmName}
                                </p>
                              </div>

                              {/* Big Subscription Toggle Button */}
                              <button
                                onClick={() => {
                                  playPopSound();
                                  onToggleSubscription(producer.id);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm ${
                                  isSubscribed
                                    ? 'bg-emerald-600/20 hover:bg-red-950/40 text-emerald-300 hover:text-red-300 border border-emerald-500/40 hover:border-red-500/40'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                }`}
                                title={isSubscribed ? 'اضغط لإلغاء المتابعة' : 'اضغط للمتابعة وتفعيل تنبيهات الصابة'}
                              >
                                {isSubscribed ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>مشترك</span>
                                  </>
                                ) : (
                                  <>
                                    <Heart className="w-3.5 h-3.5" />
                                    <span>متابعة + اشتراك</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <p className="text-xs text-stone-400 mt-1 flex items-center gap-1.5 flex-wrap">
                              <span className="flex items-center gap-0.5">
                                <MapPin className="w-3 h-3 text-emerald-400" />
                                {producer.location} ({producer.distanceKm} كم)
                              </span>
                              <span className="text-stone-600">·</span>
                              <span className="text-amber-400/90 font-medium">
                                نسبة الرضا {producer.trustScore}%
                              </span>
                              {isSubscribed && (
                                <>
                                  <span className="text-stone-600">·</span>
                                  <span className="text-[11px] text-stone-400">
                                    مشترك منذ {sub.subscribedAt}
                                  </span>
                                </>
                              )}
                            </p>

                            {/* Specialties tags */}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {producer.specialties.map((spec, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-md border border-stone-700/60"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Subscription State & Management Banner */}
                        <div
                          className={`mt-3.5 p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors ${
                            isSubscribed
                              ? 'bg-emerald-950/30 border-emerald-700/40 text-emerald-100'
                              : 'bg-stone-800/40 border-stone-700/50 text-stone-400'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isSubscribed ? (
                              <div className="w-7 h-7 rounded-lg bg-emerald-600/30 flex items-center justify-center text-emerald-300 shrink-0">
                                <Bell className="w-4 h-4 animate-bounce" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-lg bg-stone-800 flex items-center justify-center text-stone-500 shrink-0">
                                <BellOff className="w-4 h-4" />
                              </div>
                            )}

                            <div>
                              <div className="text-xs font-bold flex items-center gap-1">
                                {isSubscribed ? (
                                  <>
                                    <span className="text-emerald-300">تنبيهات الصابة الموسمية مفعّلة</span>
                                    <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 rounded">
                                      {sub.alertFrequency === 'all_harvests'
                                        ? 'كل الصابات'
                                        : 'التخفيضات الكبرى'}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-stone-400">
                                    التنبيهات متوقفة (لن تصلك إشعارات صابات هذا الفلاّح)
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-stone-400">
                                {isSubscribed
                                  ? `تصلك فوراً على التطبيق ${sub.notifySMS ? 'ورسالة SMS مجانية' : ''}`
                                  : 'فعّل المتابعة لتكون أول من يحجز قبل نفاذ الصابة'}
                              </p>
                            </div>
                          </div>

                          {/* Quick Settings Expand Toggle */}
                          {isSubscribed && (
                            <button
                              onClick={() => {
                                playClickSound();
                                setExpandedSettingsProducerId(isExpanded ? null : producer.id);
                              }}
                              className="text-[11px] font-bold text-emerald-300 hover:text-emerald-200 flex items-center gap-1 self-end sm:self-auto px-2 py-1 bg-stone-900/80 rounded-lg border border-stone-700/80 cursor-pointer"
                            >
                              <Sliders className="w-3 h-3" />
                              <span>تخصيص التنبيهات</span>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Detailed Subscription Settings Panel (Collapsible) */}
                        {isSubscribed && isExpanded && (
                          <div className="mt-3 p-3 bg-stone-900 rounded-xl border border-stone-800 space-y-3 animate-in fade-in duration-150">
                            <h5 className="text-xs font-bold text-stone-200 flex items-center gap-1">
                              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                              <span>خيارات الاشتراك المخصصة لـ {producer.name}</span>
                            </h5>

                            {/* Alert Frequency */}
                            <div>
                              <label className="text-[11px] text-stone-400 font-medium block mb-1.5">
                                متى تود استلام التنبيه؟
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    playClickSound();
                                    onUpdateSubscriptionSettings(producer.id, {
                                      alertFrequency: 'all_harvests',
                                    });
                                  }}
                                  className={`p-2 rounded-lg text-[11px] font-bold border text-right transition-all cursor-pointer ${
                                    sub.alertFrequency === 'all_harvests'
                                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                                      : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-300'
                                  }`}
                                >
                                  <span className="block font-bold">كل صابة جديدة</span>
                                  <span className="text-[9px] text-stone-400 block font-normal">
                                    أي جني جديد ينشره الفلاّح
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    playClickSound();
                                    onUpdateSubscriptionSettings(producer.id, {
                                      alertFrequency: 'flash_deals_only',
                                    });
                                  }}
                                  className={`p-2 rounded-lg text-[11px] font-bold border text-right transition-all cursor-pointer ${
                                    sub.alertFrequency === 'flash_deals_only'
                                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                                      : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-300'
                                  }`}
                                >
                                  <span className="block font-bold">صابات التخفيض فقط</span>
                                  <span className="text-[9px] text-stone-400 block font-normal">
                                    تخفيضات تفوق 30% من السعر
                                  </span>
                                </button>
                              </div>
                            </div>

                            {/* Notification Channels */}
                            <div className="space-y-2 pt-2 border-t border-stone-800">
                              <label className="text-[11px] text-stone-400 font-medium block">
                                قنوات استلام الإشعار:
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <label className="flex items-center gap-2 bg-stone-850 p-2 rounded-lg border border-stone-800 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={sub.notifySound}
                                    onChange={(e) => {
                                      playClickSound();
                                      onUpdateSubscriptionSettings(producer.id, {
                                        notifySound: e.target.checked,
                                      });
                                    }}
                                    className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                                  />
                                  <span className="text-xs text-stone-300 font-medium">
                                    🔔 نغمة تنبيه صوتية
                                  </span>
                                </label>

                                <label className="flex items-center gap-2 bg-stone-850 p-2 rounded-lg border border-stone-800 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={sub.notifySMS}
                                    onChange={(e) => {
                                      playClickSound();
                                      onUpdateSubscriptionSettings(producer.id, {
                                        notifySMS: e.target.checked,
                                      });
                                    }}
                                    className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                                  />
                                  <span className="text-xs text-stone-300 font-medium">
                                    💬 إشعار رسالة قصيرة SMS
                                  </span>
                                </label>
                              </div>
                            </div>

                            {/* Quick Test Alert Button for this producer */}
                            <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                              <span className="text-[10px] text-stone-400">
                                تريد اختبار كيف يصلك الإشعار من هذا الفلاّح؟
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  playWinCelebration();
                                  onSimulateHarvestAlert(
                                    producer.id,
                                    `صابة طازجة جديدة من ${producer.farmName}`,
                                    4.5,
                                    'للكيلوغرام'
                                  );
                                }}
                                className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-[11px] px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                              >
                                <Sparkles className="w-3 h-3 text-stone-900" />
                                <span>تجربة تنبيه حي الآن</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Producer Interaction Buttons */}
                        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-stone-800/80">
                          {/* Chat Button */}
                          <button
                            onClick={() => {
                              playClickSound();
                              onClose();
                              onOpenChatWithProducer(producer.id);
                            }}
                            className="flex-1 min-w-[120px] bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-bold py-1.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                            <span>محادثة الفلاّح بالشات</span>
                          </button>

                          {/* Phone / Call */}
                          <button
                            onClick={() => handleCopyPhone(producer.id, producer.phone)}
                            className="bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold py-1.5 px-3 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                            title="رقم الفلاّح المباشر بدون وسطاء"
                          >
                            <Phone className="w-3.5 h-3.5 text-amber-400" />
                            <span className="font-mono text-xs" dir="ltr">
                              {producer.phone}
                            </span>
                            {copiedPhoneProducerId === producer.id && (
                              <span className="text-[10px] text-emerald-400 font-bold">
                                تم النسخ!
                              </span>
                            )}
                          </button>

                          {/* Quick Harvest Test if not expanded */}
                          {!isExpanded && isSubscribed && (
                            <button
                              onClick={() => {
                                playWinCelebration();
                                onSimulateHarvestAlert(
                                  producer.id,
                                  `صابة ${producer.specialties[0] || 'موسمية'} مقطوعة اليوم`,
                                  3.8,
                                  'للكيلوغرام'
                                );
                              }}
                              className="bg-stone-800 hover:bg-amber-400 hover:text-stone-950 text-amber-300 text-xs font-bold py-1.5 px-2.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                              title="اختبر وصول تنبيه صابة من هذا الفلاّح"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">اختبار تنبيه</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>0% قشارة أو سماسرة · حماية الفلاّح التونسي والمستهلك</span>
          </div>
          {!isInline ? (
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              تم وحفظ
            </button>
          ) : (
            <span className="text-[11px] text-emerald-400 font-bold">
              ✓ اشتراكاتك محفوظة ومفعّلة تلقائياً
            </span>
          )}
        </div>
      </div>
  );

  if (isInline) {
    return (
      <div className="w-full" dir="rtl">
        {content}
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto"
      dir="rtl"
    >
      {content}
    </div>
  );
};

