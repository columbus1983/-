import React, { useState } from 'react';
import { Product, Producer } from '../types';
import { PlusCircle, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { playWinCelebration } from '../utils/audio';
import { formatDT } from '../utils/pricing';

interface ProducerPortalProps {
  producers: Producer[];
  onAddNewProduct: (newProduct: Product) => void;
  onExitProducerMode: () => void;
}

export const ProducerPortal: React.FC<ProducerPortalProps> = ({
  producers,
  onAddNewProduct,
  onExitProducerMode,
}) => {
  const currentProducer = producers[0]; // Active farmer profile (عمّ سالم وزهرة)

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState<Product['category']>('legumes');
  const [priceDirect, setPriceDirect] = useState('');
  const [priceSupermarket, setPriceSupermarket] = useState('');
  const [unit, setUnit] = useState('للكيلوغرام');
  const [stock, setStock] = useState('25');
  const [dealReason, setDealReason] = useState('صابة وفيرة جني صباح اليوم من السانية، طازجة وسوم يرضي الجميع!');
  const [qualityLabels, setQualityLabels] = useState('طبيعي 100%, جني الصباح, من السانية لمائدتك');
  const [isFlashDeal, setIsFlashDeal] = useState(true);
  const [governorate, setGovernorate] = useState('نابل');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Sample image suggestions for Tunisian agriculture
  const sampleImages = [
    { label: 'قفة خضار مشكلة', url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80' },
    { label: 'طماطم شمسية', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80' },
    { label: 'برتقال مالطي', url: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=800&q=80' },
    { label: 'زيت زيتون بكر', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80' },
  ];
  const [selectedImage, setSelectedImage] = useState(sampleImages[0].url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !priceDirect) return;

    const directNum = parseFloat(priceDirect.replace(',', '.')) || 2.500;
    const supermNum = parseFloat(priceSupermarket.replace(',', '.')) || directNum * 1.9;

    const newProd: Product = {
      id: `custom-prod-${Date.now()}`,
      producerId: currentProducer.id,
      farmName: currentProducer.farmName,
      name: productName.trim(),
      category,
      priceDirect: directNum,
      priceSupermarketEstimated: supermNum,
      unit,
      stock: parseInt(stock, 10) || 20,
      initialStock: parseInt(stock, 10) || 20,
      isFlashDeal,
      dealReason: dealReason.trim(),
      harvestDate: 'اليوم الساعة 06:15 صباحاً',
      qualityLabels: qualityLabels.split(',').map((s) => s.trim()).filter(Boolean),
      image: selectedImage,
      galleryImages: [selectedImage, sampleImages[1].url, sampleImages[2].url],
      description: `عرض صابة مباشرة من ${currentProducer.farmName} بولاية ${governorate}. مقطوعة باليد لأولاد الحومة بدون وساطة ولا قشارة. ${dealReason}`,
      farmDistanceKm: currentProducer.distanceKm,
      governorate,
      rating: 5.0,
      reviewsCount: 1,
      likesCount: 10,
      isAvailableToday: true,
    };

    onAddNewProduct(newProd);
    playWinCelebration();
    setSuccessNotice(`تم نشر عرضك الفلاحي "${newProd.name}" فوراً في سوق المواطنين!`);
    
    setProductName('');
    setPriceDirect('');
    setPriceSupermarket('');
    setTimeout(() => {
      setSuccessNotice(null);
    }, 4500);
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Producer Hero Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 border border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={currentProducer.photo}
            alt={currentProducer.farmName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-display font-bold text-lg text-white">
                {currentProducer.farmName}
              </span>
              <span className="text-[10px] font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded">
                فلاّح تونسي معتمد
              </span>
            </div>
            <p className="text-xs text-stone-400 font-semibold">
              {currentProducer.name} · {currentProducer.location}
            </p>
            <p className="text-[11px] text-emerald-400 mt-0.5 font-bold">
              ✓ 100% من مداخيل البيع تذهب لحسابك بدون أي عمولة قشارة
            </p>
          </div>
        </div>

        <button
          onClick={onExitProducerMode}
          className="py-2 px-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors self-start sm:self-center cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>الرجوع لسوق المواطنين</span>
        </button>
      </div>

      {/* Metrics of Producer Freedom */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white border border-stone-200 rounded-2xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-500 block">الدخل المباشر المحقق</span>
          <span className="font-serif-display font-extrabold text-base text-emerald-700 font-mono">2,450 د.ت</span>
          <span className="text-[10px] text-emerald-600 block font-bold">+120% مقارنة بالقشارة</span>
        </div>
        <div className="bg-white border border-stone-200 rounded-2xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-500 block">صابة تم تسويقها</span>
          <span className="font-serif-display font-extrabold text-base text-amber-700 font-mono">680 كغ</span>
          <span className="text-[10px] text-stone-500 block">0 هدر فلاحي</span>
        </div>
        <div className="bg-white border border-stone-200 rounded-2xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-500 block">عائلات تونسية وفية</span>
          <span className="font-serif-display font-extrabold text-base text-stone-900 font-mono">184</span>
          <span className="text-[10px] text-stone-500 block">في حومتك</span>
        </div>
      </div>

      {/* Quick Add Harvest Offer Form */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <PlusCircle className="w-5 h-5 text-emerald-700" />
          <div>
            <h3 className="font-serif-display font-bold text-base text-stone-900">
              نشر صابة أو محصول اليوم في 30 ثانية
            </h3>
            <p className="text-xs text-stone-500">
              أعلم المواطنين فوراً بالصابة الجديدة وتفادى كساد المحصول
            </p>
          </div>
        </div>

        {successNotice && (
          <div className="bg-emerald-100 border border-emerald-300 text-emerald-950 p-3 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-stone-800 mb-1">
              اسم المحصول أو الصابة (مثال: قفة 5 كغ فلفل وطماطم شمسية)
            </label>
            <input
              type="text"
              required
              placeholder="مثال : صندوق 5 كغ خوخ بوطبقايه حلو سكر"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                الصنف
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Product['category'])}
                className="w-full px-2.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold cursor-pointer"
              >
                <option value="legumes">خضروات</option>
                <option value="fruits">غلال وفواكه</option>
                <option value="huiles">زيت زيتون</option>
                <option value="fromages">أجبان وألبان</option>
                <option value="dattes">تمور دقلة نور</option>
                <option value="anti-gaspi">قفة خير مشكلة</option>
                <option value="epicerie">عسل وهريسة دياري</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                الوحدة
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-2.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold cursor-pointer"
              >
                <option value="للكيلوغرام">للكيلوغرام</option>
                <option value="صندوق 5 كغ">صندوق 5 كغ</option>
                <option value="القفة الكاملة">القفة الكاملة</option>
                <option value="بيدون 5 لتر">بيدون 5 لتر</option>
                <option value="القطعة">القطعة</option>
                <option value="بلاطو 15 بيضة">بلاطو 15 بيضة</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                الولاية
              </label>
              <select
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full px-2.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold cursor-pointer"
              >
                <option value="نابل">نابل</option>
                <option value="سيدي بوزيد">سيدي بوزيد</option>
                <option value="باجة">باجة</option>
                <option value="بنزرت">بنزرت</option>
                <option value="القيروان">القيروان</option>
                <option value="زغوان">زغوان</option>
                <option value="قبلي">قبلي</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                سعرك المباشر بالدينار (د.ت)
              </label>
              <input
                type="number"
                step="0.100"
                required
                placeholder="مثال: 1.800"
                value={priceDirect}
                onChange={(e) => setPriceDirect(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-bold text-emerald-800 font-mono"
              />
              <span className="text-[10px] text-stone-500">100% لك دون اقتطاعات</span>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">
                سعر السوق والمغازات التقديري (د.ت)
              </label>
              <input
                type="number"
                step="0.100"
                placeholder="مثال: 3.500"
                value={priceSupermarket}
                onChange={(e) => setPriceSupermarket(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
              />
              <span className="text-[10px] text-stone-500">لإظهار التوفير للمواطن</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                الكمية المتوفرة
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFlashDeal}
                  onChange={(e) => setIsFlashDeal(e.target.checked)}
                  className="w-4 h-4 text-emerald-700 rounded focus:ring-emerald-600"
                />
                <span className="font-bold text-stone-900">
                  ⚡ وسم "فرصة اليوم المباشرة"
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-1">
              كلمة طيبة تشرح فيها جودة المحصول
            </label>
            <input
              type="text"
              value={dealReason}
              onChange={(e) => setDealReason(e.target.value)}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
            />
          </div>

          {/* Photos Selection ("plus images") */}
          <div>
            <label className="block font-bold text-stone-800 mb-1.5">
              اختر صورة المحصول من الحقل
            </label>
            <div className="grid grid-cols-4 gap-2">
              {sampleImages.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === img.url
                      ? 'border-emerald-700 ring-2 ring-emerald-300'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-stone-900/70 text-[9px] text-white py-0.5 text-center truncate">
                    {img.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>نشر المحصول في سوق تونس الآن</span>
          </button>
        </form>
      </div>
    </div>
  );
};
