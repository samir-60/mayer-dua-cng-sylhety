import React from 'react';
import { useGameStore } from '../stores/useGameStore';
import { usePlayerStore } from '../stores/usePlayerStore';
import { soundService } from '../services/sound.service';
import {
  Play,
  Compass,
  Wrench,
  Trophy,
  Newspaper as NewspaperIcon,
  Settings,
  Coins,
  Globe,
  Flame,
} from 'lucide-react';
import { CngIcon } from './CngIcon';

export const MainMenu: React.FC = () => {
  const {
    startFreeRoam,
    setMissionModalOpen,
    setGarageModalOpen,
    setLeaderboardModalOpen,
    setSettingsModalOpen,
    setNewsHistoryModalOpen,
    language,
    toggleLanguage,
  } = useGameStore();

  const { profile } = usePlayerStore();

  const handlePlayClick = () => {
    soundService.playClick();
    setMissionModalOpen(true);
  };

  const handleFreeRoamClick = () => {
    soundService.playClick();
    startFreeRoam();
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-8 z-20 pointer-events-none select-none font-bangla">
      {/* TOP HEADER BAR */}
      <div className="flex justify-between items-start pointer-events-auto">
        {/* Brand Tagline Badge */}
        <div className="bg-stone-900/90 border border-emerald-500/40 text-stone-200 px-3.5 py-1.5 rounded-2xl shadow-xl flex items-center gap-2 backdrop-blur-md">
          <CngIcon className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest font-sans">
              SYLHET AUTO-RICKSHAW SIMULATOR
            </div>
            <div className="text-xs font-bold text-stone-300">
              {language === 'bn' ? '"মায়ের দোয়া আছে, কিন্তু ডানা নাই!"' : '"Mother\'s blessing is here, but wings are missing!"'}
            </div>
          </div>
        </div>

        {/* Top Right: Player Wallet & Language */}
        <div className="flex items-center gap-2.5">
          {/* Taka Wallet Badge */}
          <div className="bg-stone-900/90 border border-yellow-500/50 text-yellow-300 px-3.5 py-1.5 rounded-2xl shadow-xl flex items-center gap-2 font-mono font-bold backdrop-blur-md">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-base">{profile?.taka ?? 150} ৳</span>
          </div>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700 px-3 py-1.5 rounded-2xl shadow-lg flex items-center gap-1.5 text-xs font-bold transition font-sans"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'bn' ? 'বাংলা' : 'EN'}</span>
          </button>
        </div>
      </div>

      {/* CENTER: Baper Rasta Hero Title Banner & Satirical Rules */}
      <div className="flex flex-col items-center text-center my-auto pointer-events-auto max-w-xl mx-auto">
        {/* Satirical Flag pill */}
        <div className="inline-flex items-center gap-1.5 bg-red-950/90 border border-red-500/80 text-yellow-300 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-2 shadow-lg font-sans">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{language === 'bn' ? 'বাপের রাস্তা: সিলেটি সিএনজি' : 'BAPER RASTA: SYLHETI CNG'}</span>
        </div>

        {/* Grand Title with Bengali typography & 3D shadow */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600 drop-shadow-[0_8px_16px_rgba(0,0,0,0.95)] tracking-tight leading-none">
          মায়ের দোয়া
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mt-1 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] tracking-wider">
          {language === 'bn' ? 'বাপের রাস্তা (সিলেটি সংস্করণ)' : 'Baper Rasta (Sylheti Edition)'}
        </h2>
        <p className="text-xs md:text-sm text-yellow-300 font-bold mt-1.5 drop-shadow">
          {language === 'bn'
            ? '"রাস্তা কি আপনার বাপের? চালানি শুরু করুন!"'
            : '"Does the road belong to your father? Start driving!"'}
        </p>

        {/* Satirical Baper Rasta Rules Card */}
        <div className="mt-4 bg-stone-900/90 border-2 border-stone-700/80 p-3 rounded-xl shadow-2xl text-left text-xs space-y-1.5 text-stone-200 backdrop-blur-md w-full max-w-md">
          <div className="text-[11px] font-black text-red-400 uppercase tracking-wider flex items-center gap-1 font-sans border-b border-stone-800 pb-1 mb-1">
            <span>[নিয়মাবলী ও ড্রাইভিং সনদ]</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-400 font-black">•</span>
            <span><strong>নো ব্রেক, নো লাইসেন্স:</strong> স্টিয়ারিংয়ে হাত দিলেই আপনি বাপের রাস্তার রাজা!</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-400 font-black">•</span>
            <span><strong>জাতীয় ক্ষতি বাড়ান:</strong> রিকশা, লেগুনা ও টং দোকানে গুঁতো মারলে ডাবল পয়েন্ট!</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-400 font-black">•</span>
            <span><strong>পাবলিক ধরার আগেই পালান:</strong> জিন্দাবাজার থেকে ক্বীন ব্রিজ পর্যন্ত তাণ্ডব চালান!</span>
          </div>
        </div>

        {/* PRIMARY ACTION BUTTONS (Start Baper Rasta Driving & Play Missions) */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-5 font-sans">
          {/* Big Baper Rasta CTA: রাস্তায় নামেন */}
          <button
            onClick={handleFreeRoamClick}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-black px-8 py-3.5 rounded-2xl shadow-[0_10px_25px_-5px_rgba(5,150,105,0.7)] text-base md:text-lg transition transform hover:-translate-y-0.5 active:scale-95 border-2 border-emerald-300"
          >
            <Play className="w-5 h-5 fill-white" />
            <span className="font-bangla">{language === 'bn' ? 'রাস্তায় নামেন [চালানি শুরু]' : 'Hit The Road [Drive]'}</span>
          </button>

          {/* Passenger Missions with total count */}
          <button
            onClick={handlePlayClick}
            className="flex items-center gap-2 bg-stone-900/90 hover:bg-stone-800 text-yellow-300 font-bold px-6 py-3.5 rounded-2xl border-2 border-yellow-500/50 shadow-xl text-sm md:text-base transition transform hover:-translate-y-0.5 active:scale-95"
          >
            <Compass className="w-5 h-5 text-yellow-400" />
            <span className="font-bangla">{language === 'bn' ? 'যাত্রী মিশনসমূহ' : 'Passenger Missions'}</span>
            <span className="bg-yellow-400 text-stone-950 font-black text-xs px-2 py-0.5 rounded-full font-sans">
              ১০টি
            </span>
          </button>
        </div>
      </div>

      {/* BOTTOM NAV BAR: Garage, Leaderboard, Newsstand, Settings */}
      <div className="flex justify-center items-center gap-2 md:gap-3 pointer-events-auto">
        {/* Garage */}
        <button
          onClick={() => {
            soundService.playClick();
            setGarageModalOpen(true);
          }}
          className="glass-panel hover:bg-stone-800/90 text-stone-200 px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs md:text-sm font-bold border border-yellow-500/30 transition transform hover:-translate-y-0.5"
        >
          <Wrench className="w-4 h-4 text-yellow-400" />
          <span>{language === 'bn' ? 'গ্যারেজ' : 'Garage'}</span>
        </button>

        {/* Leaderboard */}
        <button
          onClick={() => {
            soundService.playClick();
            setLeaderboardModalOpen(true);
          }}
          className="glass-panel hover:bg-stone-800/90 text-stone-200 px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs md:text-sm font-bold border border-amber-500/30 transition transform hover:-translate-y-0.5"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>{language === 'bn' ? 'সেরা তালিকা' : 'Leaderboard'}</span>
        </button>

        {/* Newspaper Archive */}
        <button
          onClick={() => {
            soundService.playClick();
            setNewsHistoryModalOpen(true);
          }}
          className="glass-panel hover:bg-stone-800/90 text-stone-200 px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs md:text-sm font-bold border border-emerald-500/30 transition transform hover:-translate-y-0.5"
        >
          <NewspaperIcon className="w-4 h-4 text-emerald-400" />
          <span>{language === 'bn' ? 'সংবাদপত্র' : 'Newspaper'}</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => {
            soundService.playClick();
            setSettingsModalOpen(true);
          }}
          className="glass-panel hover:bg-stone-800/90 text-stone-200 px-3 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs md:text-sm font-bold border border-stone-600 transition transform hover:-translate-y-0.5"
        >
          <Settings className="w-4 h-4 text-stone-400" />
          <span className="hidden sm:inline">{language === 'bn' ? 'সেটিংস' : 'Settings'}</span>
        </button>
      </div>
    </div>
  );
};
