import React, { useEffect, useState } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { usePlayerStore } from '../stores/usePlayerStore';
import { apiService } from '../services/api.service';
import { soundService } from '../services/sound.service';
import { GarageCategory, GarageItem } from '@shared/types';
import { X, Check, Coins, Sparkles, Volume2, Shield, Wrench, Paintbrush } from 'lucide-react';
import { CngIcon } from './CngIcon';

export const GarageModal: React.FC = () => {
  const { isGarageModalOpen, setGarageModalOpen, language } = useGameStore();
  const { profile, garageItems, fetchGarage, equipCustomization, updateTaka } = usePlayerStore();
  const [activeCategory, setActiveCategory] = useState<GarageCategory>('PAINT');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isGarageModalOpen) {
      fetchGarage();
    }
  }, [isGarageModalOpen]);

  if (!isGarageModalOpen) return null;

  const filteredItems = garageItems.filter((i) => i.category === activeCategory);

  const handlePurchase = async (item: GarageItem) => {
    soundService.playClick();
    if (!profile) return;

    if (profile.taka < item.priceTaka) {
      setStatusMsg(
        language === 'bn'
          ? `টাকা কম মামা! আপনার কাছে আছে ${profile.taka}৳, দরকার ${item.priceTaka}৳`
          : `Not enough Taka! You have ${profile.taka}৳, item costs ${item.priceTaka}৳`
      );
      setTimeout(() => setStatusMsg(null), 3500);
      return;
    }

    try {
      const res = await apiService.purchaseItem(item.id);
      if (res.success) {
        soundService.playCashRegister();
        updateTaka(res.newTaka);
        equipCustomization(item.category, item.id);
        await apiService.equipItem(item.id, item.category);
        setStatusMsg(language === 'bn' ? 'সফলভাবে কেনা ও লাগানো হয়েছে!' : 'Purchased and equipped!');
        setTimeout(() => setStatusMsg(null), 3000);
      } else {
        setStatusMsg(res.error || 'Purchase failed');
      }
    } catch {
      // Local fallback purchase
      const newBal = profile.taka - item.priceTaka;
      updateTaka(newBal);
      equipCustomization(item.category, item.id);
      setStatusMsg(language === 'bn' ? 'কেনা ও লাগানো হয়েছে!' : 'Equipped!');
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleEquip = async (item: GarageItem) => {
    soundService.playClick();
    equipCustomization(item.category, item.id);
    await apiService.equipItem(item.id, item.category).catch(() => {});
  };

  const categories: Array<{ id: GarageCategory; labelBn: string; labelEn: string; icon: any }> = [
    { id: 'PAINT', labelBn: 'বডি কালার', labelEn: 'Body Paint', icon: Sparkles },
    { id: 'DECAL', labelBn: 'দোয়া স্টিকার', labelEn: 'Decals & Script', icon: Shield },
    { id: 'HORN', labelBn: 'হর্ন অপশন', labelEn: 'Horns', icon: Volume2 },
    { id: 'ACCESSORY', labelBn: 'এক্সেসরিজ', labelEn: 'Accessories', icon: Wrench },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border-2 border-yellow-500/40 text-stone-100 max-w-3xl w-full rounded-3xl shadow-2xl overflow-hidden p-6 relative max-h-[90vh] flex flex-col font-bangla">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-stone-800 pb-3">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <span>🔧</span>
              <span>{language === 'bn' ? 'সিএনজি গ্যারেজ ও কাস্টমাইজেশন' : 'CNG GARAGE & CUSTOMS'}</span>
            </h2>
            <p className="text-xs text-stone-400 font-sans">
              {language === 'bn' ? 'সিএনজির রূপ বদলান, শক্তি বাড়ান!' : 'Upgrade your CNG with Sylheti swag!'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Taka Wallet Badge */}
            <div className="bg-yellow-500/20 text-yellow-300 font-bold px-3 py-1.5 rounded-xl border border-yellow-500/40 flex items-center gap-2 font-mono">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span>{profile?.taka ?? 150} ৳</span>
            </div>

            <button
              onClick={() => setGarageModalOpen(false)}
              className="text-stone-400 hover:text-white p-2 rounded-xl hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div className="bg-amber-600/30 border border-amber-500 text-amber-200 text-xs font-bold px-3 py-1.5 rounded-xl my-2 text-center animate-shake">
            {statusMsg}
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex gap-2 my-3 border-b border-stone-800 pb-2 overflow-x-auto">
          {categories.map((c) => {
            const Icon = c.icon;
            const isActive = activeCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  soundService.playClick();
                  setActiveCategory(c.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-yellow-500 text-stone-950 shadow'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{language === 'bn' ? c.labelBn : c.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Items Grid */}
        <div className="overflow-y-auto flex-1 my-2 grid grid-cols-1 md:grid-cols-2 gap-3 pr-1">
          {filteredItems.map((item) => {
            const isEquipped = item.isEquipped;
            const isPurchased = item.isPurchased || item.priceTaka === 0;

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isEquipped
                    ? 'bg-emerald-950/40 border-emerald-400'
                    : 'bg-stone-800/70 border-stone-700 hover:border-stone-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Swatch or Icon Preview */}
                  <div
                    className="w-12 h-12 rounded-xl border border-stone-600 flex items-center justify-center text-xl shrink-0 shadow"
                    style={{ backgroundColor: item.previewColor || '#1c1917' }}
                  >
                    {item.category === 'PAINT' ? (
                      <Paintbrush className="w-5 h-5 text-amber-300" />
                    ) : (
                      <CngIcon className="w-5 h-5 text-emerald-300" />
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {language === 'bn' ? item.nameBn : item.nameEn}
                    </h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {language === 'bn' ? item.descriptionBn : item.descriptionEn}
                    </p>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-3 pt-2 border-t border-stone-700/50 flex justify-between items-center font-sans">
                  <div className="text-xs font-bold text-yellow-300 flex items-center gap-1">
                    {item.priceTaka === 0 ? (
                      <span className="text-emerald-400 uppercase tracking-wider text-[11px]">Free</span>
                    ) : (
                      <>
                        <Coins className="w-3.5 h-3.5" />
                        <span>{item.priceTaka} ৳</span>
                      </>
                    )}
                  </div>

                  <div>
                    {isEquipped ? (
                      <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-lg border border-emerald-500/40">
                        <Check className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'লাগানো আছে' : 'Equipped'}</span>
                      </span>
                    ) : isPurchased ? (
                      <button
                        onClick={() => handleEquip(item)}
                        className="bg-stone-700 hover:bg-stone-600 text-white text-xs font-bold px-3 py-1 rounded-lg transition"
                      >
                        {language === 'bn' ? 'লাগান' : 'Equip'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(item)}
                        className="bg-yellow-500 hover:bg-yellow-400 text-stone-950 text-xs font-black px-3.5 py-1 rounded-lg transition shadow"
                      >
                        {language === 'bn' ? 'কিনুন' : 'Buy'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
