import React, { useState } from 'react';
import { Producer, Product } from '../types';
import { MapPin, Navigation, Clock, Phone, Check } from 'lucide-react';
import { playClickSound } from '../utils/audio';
import { formatDT } from '../utils/pricing';

interface InteractiveMapProps {
  producers: Producer[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  maxDistance: number;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  producers,
  products,
  onSelectProduct,
  onAddToCart,
  maxDistance,
}) => {
  const [selectedProducerId, setSelectedProducerId] = useState<string>(producers[0]?.id || '');

  const filteredProducers = producers.filter((p) => p.distanceKm <= maxDistance);
  const selectedProducer = producers.find((p) => p.id === selectedProducerId) || filteredProducers[0];
  const producerProducts = products.filter((p) => p.producerId === selectedProducer?.id);

  return (
    <div className="space-y-4" dir="rtl">
      {/* Map visual canvas simulation for Tunisia */}
      <div className="relative w-full aspect-16/10 sm:aspect-2/1 bg-stone-100 rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
        {/* Subtle SVG Map Grid Background representing Tunisian parcels, olive groves and coastline */}
        <svg className="w-full h-full object-cover opacity-85" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="tunisian-groves" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="#fefae0" opacity="0.35" />
          <rect width="100%" height="100%" fill="url(#tunisian-groves)" />

          {/* Mediterranean Coastline simulation (Tunisia shape) */}
          <path
            d="M 5 20 Q 35 15, 55 10 T 80 40 Q 95 65, 85 95"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Roads */}
          <path
            d="M 15 15 L 45 40 L 75 45"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="2.2"
            strokeDasharray="1,1"
          />
          <path
            d="M 45 40 L 40 85 L 70 80"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="2"
            strokeDasharray="1,1"
          />

          {/* Olive & Citrus Parcels */}
          <polygon points="12,18 30,15 26,34 10,30" fill="#dcfce7" opacity="0.75" />
          <polygon points="50,15 72,12 78,32 55,36" fill="#fef08a" opacity="0.6" />
          <polygon points="15,55 35,50 38,72 20,70" fill="#ffedd5" opacity="0.7" />
          <polygon points="55,55 82,50 80,75 58,78" fill="#dcfce7" opacity="0.75" />
        </svg>

        {/* User position indicator */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
          style={{ right: '48%', top: '45%' }}
        >
          <div className="relative">
            <span className="w-5 h-5 rounded-full bg-blue-500 animate-ping absolute inset-0 opacity-40"></span>
            <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-[10px] text-white">
              📍
            </div>
          </div>
          <span className="bg-stone-900/80 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow mt-1">
            موقعك
          </span>
        </div>

        {/* Farm Pins */}
        {filteredProducers.map((prod) => {
          const isSelected = prod.id === selectedProducer?.id;
          return (
            <button
              key={prod.id}
              onClick={() => {
                playClickSound();
                setSelectedProducerId(prod.id);
              }}
              style={{
                right: `${prod.coordinates.xPercent}%`,
                top: `${prod.coordinates.yPercent}%`,
              }}
              className="absolute transform translate-x-1/2 -translate-y-1/2 z-20 group transition-all duration-300 focus:outline-none cursor-pointer"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center text-sm shadow-md transition-transform ${
                    isSelected
                      ? 'bg-emerald-700 text-white ring-4 ring-emerald-300 scale-110'
                      : 'bg-white hover:bg-emerald-50 text-stone-900 border border-stone-300'
                  }`}
                >
                  🌾
                </div>
                <div
                  className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap ${
                    isSelected
                      ? 'bg-emerald-900 text-white'
                      : 'bg-white/95 text-stone-800 border border-stone-200'
                  }`}
                >
                  {prod.farmName} ({prod.distanceKm} كم)
                </div>
              </div>
            </button>
          );
        })}

        {/* Top Floating Map Legend */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs border border-stone-200 rounded-xl px-2.5 py-1 text-[11px] text-stone-700 shadow-xs flex items-center gap-1.5 font-bold">
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span>{filteredProducers.length} سواني ومزارع مباشرة في شعاع {maxDistance} كم</span>
        </div>
      </div>

      {/* Selected Farm Detailed Card */}
      {selectedProducer && (
        <div className="bg-white rounded-3xl border border-stone-200 p-4 shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={selectedProducer.photo}
                alt={selectedProducer.farmName}
                className="w-14 h-14 rounded-2xl object-cover border border-stone-200"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif-display font-bold text-base text-stone-900">
                    {selectedProducer.farmName}
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                    {selectedProducer.distanceKm} كم · {selectedProducer.governorate}
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-semibold">
                  {selectedProducer.name} · {selectedProducer.role}
                </p>
                <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{selectedProducer.address}</span>
                </p>
              </div>
            </div>

            <a
              href={`tel:${selectedProducer.phone}`}
              className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-emerald-100 text-emerald-800 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              title={`الاتصال بـ ${selectedProducer.name}`}
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          <p className="text-xs text-stone-700 bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 font-medium leading-relaxed">
            "{selectedProducer.story}"
          </p>

          {/* Horaires et créneaux de retrait */}
          <div className="bg-stone-50 rounded-xl p-2.5 text-xs text-stone-700 space-y-1">
            <div className="font-bold text-[11px] text-stone-600 flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-500" />
              <span>أوقات ونقاط الاستلام المباشر بدون انتظار</span>
            </div>
            {selectedProducer.openSlots.map((slot, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>{slot}</span>
              </div>
            ))}
          </div>

          {/* Products available at this farm right now */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-serif-display font-bold text-xs text-stone-900">
                صابة اليوم المتوفرة في السانية ({producerProducts.length})
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {producerProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-stone-50 hover:bg-emerald-50/50 border border-stone-200 rounded-xl p-2.5 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                  onClick={() => onSelectProduct(product)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold font-mono">
                        <span>{formatDT(product.priceDirect)}</span>
                        <span className="text-[10px] text-stone-500 font-normal font-sans">/ {product.unit}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playClickSound();
                      onAddToCart(product);
                    }}
                    className="py-1 px-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer"
                  >
                    + القفة
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
