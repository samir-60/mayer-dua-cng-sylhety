import React, { useEffect, useState } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { usePlayerStore } from '../stores/usePlayerStore';
import { apiService } from '../services/api.service';
import { soundService } from '../services/sound.service';
import { MissionDefinition } from '@shared/types';
import { X, Play, Lock, Coins, MapPin, Clock, Award } from 'lucide-react';
import { CngIcon } from './CngIcon';

export const MissionSelectModal: React.FC = () => {
  const { isMissionModalOpen, setMissionModalOpen, startMissionFlow, language } = useGameStore();
  const { profile } = usePlayerStore();
  const [missions, setMissions] = useState<MissionDefinition[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isMissionModalOpen) {
      loadMissions();
    }
  }, [isMissionModalOpen]);

  const loadMissions = async () => {
    setLoading(true);
    const list = await apiService.getMissions();
    setMissions(list);
    setLoading(false);
  };

  if (!isMissionModalOpen) return null;

  const unlockedSet = new Set(profile?.unlockedMissions || ['mission_1']);

  const handleStartMission = async (m: MissionDefinition) => {
    soundService.playClick();
    const session = await apiService.startMission(m.id);
    startMissionFlow(m, session.sessionToken);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border-2 border-emerald-500/50 text-stone-100 max-w-3xl w-full rounded-3xl shadow-2xl overflow-hidden p-6 relative max-h-[90vh] flex flex-col font-bangla">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-stone-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <CngIcon className="w-6 h-6 text-emerald-400 inline-block" />
                <span>{language === 'bn' ? 'মিশন নির্বাচন করুন' : 'SELECT MISSION'}</span>
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black px-2.5 py-0.5 rounded-full font-sans">
                {language === 'bn' ? `মোট ${missions.length}টি মিশন উপলভ্য` : `${missions.length} Missions Available`}
              </span>
            </div>
            <p className="text-xs text-stone-400 font-sans mt-0.5">
              {language === 'bn'
                ? 'সিলেটের খাঁটি রাস্তায় যাত্রী উঠান, ভাড়া আদায় করুন এবং পরবর্তী মিশন আনলক করুন!'
                : 'Pick up passengers on real Sylhet roads, collect fares, and unlock next missions!'}
            </p>
          </div>
          <button
            onClick={() => setMissionModalOpen(false)}
            className="text-stone-400 hover:text-white p-2 rounded-xl hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Missions List */}
        <div className="overflow-y-auto flex-1 my-4 space-y-3.5 pr-1">
          {missions.map((m, index) => {
            const isUnlocked = unlockedSet.has(m.id) || m.isUnlockedDefault;
            const isMvp = m.isAvailableInMvp;

            return (
              <div
                key={m.id}
                className={`rounded-2xl border overflow-hidden transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isUnlocked && isMvp
                    ? 'bg-stone-800/90 border-emerald-500/40 hover:border-emerald-400 hover:bg-stone-800 shadow-lg'
                    : 'bg-stone-950/70 border-stone-800/70 opacity-60'
                }`}
              >
                {/* Left: Real Road Street Photo + Info */}
                <div className="flex flex-col sm:flex-row items-start gap-3.5 flex-1 min-w-0">
                  {/* Real Road Picture Thumbnail */}
                  <div className="w-full sm:w-32 h-24 shrink-0 relative bg-stone-900 border-b sm:border-b-0 sm:border-r border-stone-700/80 overflow-hidden">
                    <img
                      src={m.roadImage || '/images/roads/keane_bridge.jpg'}
                      alt={m.roadNameBn || 'সিলেটের রাস্তা'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent sm:hidden" />
                    <span className="absolute bottom-1 left-1.5 bg-black/80 text-yellow-300 text-[10px] font-black px-1.5 py-0.5 rounded font-sans">
                      {`মিশন ${index + 1}/১০`}
                    </span>
                  </div>

                  <div className="p-3 sm:p-0 sm:py-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base md:text-lg font-black text-white truncate">
                        {language === 'bn' ? m.titleBn : m.titleEn}
                      </h3>
                      {m.roadNameBn && (
                        <span className="bg-yellow-500/20 text-yellow-300 text-[11px] font-bold px-2 py-0.5 rounded-full border border-yellow-500/30 font-sans">
                          {language === 'bn' ? m.roadNameBn : m.roadNameEn}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-300 mt-1 line-clamp-1">
                      {language === 'bn' ? m.subtitleBn : m.subtitleEn}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400 mt-2 font-sans">
                      <span className="flex items-center gap-1 text-yellow-300 font-bold">
                        <Coins className="w-3.5 h-3.5" />
                        {m.rewardTaka} ৳
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        {language === 'bn' ? m.dropoffLocation.nameBn : m.dropoffLocation.nameEn}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        {m.timeLimitSeconds}s
                      </span>
                      <span className="text-[11px] text-emerald-400 font-bold">
                        {m.passengerNameBn}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Action Button */}
                <div className="p-3 pt-0 sm:p-0 sm:pr-4 shrink-0">
                  {isUnlocked && isMvp ? (
                    <button
                      onClick={() => handleStartMission(m)}
                      className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg transition active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>{language === 'bn' ? 'শুরু করুন' : 'Start'}</span>
                    </button>
                  ) : (
                    <div className="text-xs text-stone-500 font-bold px-4 py-2 bg-stone-900 rounded-xl border border-stone-800 text-center font-sans">
                      {language === 'bn' ? 'লকড (আগের মিশন শেষ করুন)' : 'Locked'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
