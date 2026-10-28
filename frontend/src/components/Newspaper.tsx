import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/useGameStore';
import {
  Share2,
  RotateCcw,
  Trophy,
  CheckCircle2,
  Scissors,
  AlertTriangle,
  Play,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { CngIcon } from './CngIcon';
import { soundService } from '../services/sound.service';

export const Newspaper: React.FC = () => {
  const {
    activeNewspaper,
    activeMission,
    nationalLossTaka,
    gameMode,
    startNextMissionStep,
    restartRun,
    setLeaderboardModalOpen,
    language,
  } = useGameStore();
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<number>(5);

  const isMissionSuccess = gameMode === 'MISSION_COMPLETE';
  const isPublicCatch = activeNewspaper?.id.startsWith('catch_');

  // Auto-countdown to start next mission step-by-step
  useEffect(() => {
    if (!isMissionSuccess) return;

    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          startNextMissionStep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isMissionSuccess, startNextMissionStep]);

  // Keyboard shortcut: Space or Enter to continue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (isMissionSuccess) {
          startNextMissionStep();
        } else {
          restartRun();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMissionSuccess, startNextMissionStep, restartRun]);

  if (!activeNewspaper) return null;

  const displayLoss = Math.max(
    isPublicCatch ? 15000 : activeNewspaper.id.startsWith('crash') ? 12500 : 3500,
    nationalLossTaka > 0 ? nationalLossTaka : 8500
  );

  const cupsOfTea = Math.round(displayLoss / 10);
  const platesOfBiryani = Math.round(displayLoss / 220);

  const handleShare = async () => {
    const shareText = isPublicCatch
      ? `[দৈনিক যানজট - গণধোলাই বুলেটিন]\n"পাবলিকের গালাগালি ও গণধোলাই: ক্বীন ব্রিজে আটক বেপরোয়া সিএনজি মামা!"\n\nজাতীয় ক্ষতি ও জরিমানা: ৳${displayLoss.toLocaleString('bn-BD')}\nএই টাকায় হতো: ${cupsOfTea} কাপ সাতকড়া চা বা ${platesOfBiryani} প্লেট আখনি বিরিয়ানি!\n\nমায়ের দোয়া: বাপের রাস্তা (সিলেটি সিএনজি সিমুলেটর)।`
      : `[দৈনিক যানজট - বাপের রাস্তা ক্র্যাশ বুলেটিন]\n"বেপরোয়া সিএনজির তাণ্ডবে ক্বীন ব্রিজ এলাকা অচল!"\n\nজাতীয় ক্ষতি: ৳${displayLoss.toLocaleString('bn-BD')}\nএই টাকায় হতো: ${cupsOfTea} কাপ সাতকড়া চা বা ${platesOfBiryani} প্লেট আখনি বিরিয়ানি!\n\nমায়ের দোয়া: বাপের রাস্তা (সিলেটি সিএনজি সিমুলেটর)।`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'দৈনিক যানজট: বাপের রাস্তা',
          text: shareText,
          url: window.location.href,
        });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2.5 md:p-6 overflow-y-auto font-bangla select-none">
      {/* NEWSPAPER SHEET CONTAINER */}
      <div className="bg-[#f6f1e4] text-[#1e1e1e] w-full max-w-2xl rounded-sm shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-4 md:p-6 border-4 border-[#2b2520] relative max-h-[92vh] flex flex-col justify-between overflow-hidden">
        {/* ROTATED RED RUBBER STAMP */}
        <div className="absolute top-14 right-3 md:right-7 z-30 pointer-events-none transform -rotate-12 border-4 border-red-700 text-red-700 bg-red-100/95 px-3.5 py-1 rounded-sm shadow-xl font-sans uppercase tracking-widest text-center animate-pulse">
          <div className="text-[10px] font-black text-red-600 leading-none">
            {isPublicCatch ? 'গণধোলাই ও জরিমানা' : isMissionSuccess ? 'মিশন সম্পন্ন ছাড়পত্র' : 'জাতীয় ক্ষতি রেকর্ড'}
          </div>
          <div className="text-xl md:text-2xl font-black font-sans text-red-700 leading-tight">
            ৳ {displayLoss.toLocaleString('bn-BD')}
          </div>
        </div>

        {/* TOP EAR TAGS & DATE BAR */}
        <div className="flex justify-between items-center text-[11px] font-bold border-b-2 border-[#2b2520] pb-1.5 mb-2 text-[#4a3f35] font-sans">
          <div className={`${isPublicCatch ? 'bg-red-800 text-white' : 'bg-red-900 text-yellow-300'} px-2 py-0.5 rounded-sm font-black uppercase text-[10px]`}>
            {isPublicCatch
              ? 'বিশেষ গণধোলাই সংস্করণ'
              : isMissionSuccess
              ? 'মিশন সফল সংস্করণ'
              : 'আইজর সিলেট: প্রচণ্ড যানজট'}
          </div>
          <div className="text-center font-bold">
            <span>{activeNewspaper.dateStrBn}</span>
            <span className="mx-1.5">•</span>
            <span>{activeNewspaper.priceTagBn}</span>
          </div>
          <div className="text-red-700 font-black text-[10px] uppercase">
            {isPublicCatch ? 'পাবলিক চড়াও অইছে!' : 'সতর্কতা: সিএনজি সামনে!'}
          </div>
        </div>

        {/* NEWSPAPER MASTHEAD */}
        <div className="text-center py-1 border-b-4 border-double border-[#2b2520]">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#1a1410] font-bangla">
            দৈনিক যানজট
          </h1>
          <p className="text-[10px] md:text-[11px] uppercase tracking-widest text-[#5c4d3c] font-sans font-black mt-0.5">
            THE DAILY TRAFFIC JAM • SYLHET SPECIAL CNG CHRONICLE
          </p>
        </div>

        {/* AUTO MISSION PROGRESSION BANNER IF MISSION SUCCESS */}
        {isMissionSuccess && (
          <div className="mt-2 bg-emerald-100 border-2 border-emerald-600 text-emerald-950 px-3 py-1.5 rounded-sm flex items-center justify-between text-xs font-bold font-sans shadow-sm">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>প্যাসেঞ্জার সফলভাবে নামাইয়া দেওয়া অইছে! পরবর্তী মিশন প্রস্তুত।</span>
            </span>
            <span className="bg-emerald-700 text-white px-2 py-0.5 rounded text-[11px] font-black animate-pulse">
              অটো রান: {countdown}s
            </span>
          </div>
        )}

        {/* SCROLLABLE ARTICLE BODY */}
        <div className="overflow-y-auto flex-1 min-h-0 pr-1.5 mt-2.5 space-y-3 text-stone-900 custom-scrollbar">
          {/* BREAKING KICKER & HEADLINE */}
          <div>
            <div className={`inline-flex items-center gap-1 ${isPublicCatch ? 'bg-red-800' : 'bg-red-700'} text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-wider mb-1 font-sans rounded-xs`}>
              {isPublicCatch ? (
                <ShieldAlert className="w-3 h-3 text-yellow-300" />
              ) : (
                <AlertTriangle className="w-3 h-3 text-yellow-300" />
              )}
              <span>
                {isPublicCatch
                  ? 'পাবলিকর গালাগালি ও গণধোলাই বুলেটিন'
                  : isMissionSuccess
                  ? 'মিশন রিপোর্ট'
                  : 'জরুরি ক্র্যাশ বুলেটিন'}
              </span>
            </div>
            <h2 className="text-base md:text-xl font-black text-[#1a1410] leading-snug">
              {activeNewspaper.headlineBn}
            </h2>
            <h3 className="text-xs md:text-sm font-semibold text-stone-700 italic mt-0.5">
              "{activeNewspaper.subheadingBn}"
            </h3>
          </div>

          <div className="border-t border-[#3a3028]" />

          {/* MAIN STORY & INCIDENT ROAD PHOTO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
            {/* Real Road / Incident Photo Frame */}
            <div className="bg-[#e8decb] border-2 border-[#2b2520] p-1.5 shadow-inner rounded-xs">
              <div className="h-28 md:h-32 bg-stone-900 rounded flex flex-col items-center justify-center text-white relative overflow-hidden group">
                <img
                  src={activeMission?.roadImage || '/images/roads/keane_bridge.jpg'}
                  alt={activeMission?.roadNameBn || 'সিলেটের রাজপথ'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to stylized SVG CNG if local image path fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute bottom-1.5 left-2 bg-black/85 px-2 py-0.5 rounded text-[10px] text-yellow-300 font-sans border border-yellow-500/50 backdrop-blur-xs">
                  {activeMission?.roadNameBn || activeNewspaper.incidentLocationBn}
                </div>
              </div>
              <p className="text-[10px] text-stone-700 italic mt-1 text-center font-sans">
                {isPublicCatch
                  ? 'ঘটনাস্থল: ক্ষিপ্ত জনতার হাতে ঘেরাও হওয়া সবুজ সিএনজি।'
                  : activeMission?.roadNameBn
                  ? `ঘটনাস্থল: ${activeMission.roadNameBn} - প্রত্যক্ষদর্শী ও যানজট দৃশ্য।`
                  : 'ঘটনাস্থল: খসিয়া পড়া বাম লুকিং গ্লাস ও পানর পিক উদ্ধার।'}
              </p>
            </div>

            {/* Lead Article text */}
            <div className="flex flex-col justify-between">
              <p className="text-justify text-xs leading-normal font-medium text-stone-800">
                {activeNewspaper.leadArticleBn}
              </p>
              {/* Eyewitness testimony */}
              <div className="mt-1.5 bg-stone-100 p-2 border border-stone-300 rounded text-[11px] italic text-stone-800 shadow-2xs">
                <span className="font-bold text-stone-900 not-italic block">
                  প্রত্যক্ষদর্শী বদরুল মামা:
                </span>
                {isPublicCatch
                  ? '"পাবলিক যেমনে জুতা আর বাঁশর লাঠি লইয়া ধাওয়া দিল, মামা সিএনজির খাঁচার ভিতর কান্দে আর কয় রাস্তা কিতা আমার বাপরনি!"'
                  : '"গাড়ি যেমনে সাইড মারল বাজি, ভাবছিলাম পাইলট মনে হয় ককপিট ছাড়ি দিয়া পানর দোকানত বইছে!"'}
              </div>
            </div>
          </div>

          {/* BAPER RASTA CUTOUT COUPON (এই টেকায় যা কিনা যাইতো) */}
          <div className="border-2 border-dashed border-red-700 bg-amber-50/90 p-2.5 rounded-sm relative shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-black text-red-700 uppercase tracking-wider mb-1 font-sans">
              <Scissors className="w-3.5 h-3.5 text-red-700" />
              <span>এই টেকায় যা কিনা যাইতো (কাটআউট কুপন)</span>
            </div>
            <div className="text-xs md:text-sm font-bold text-stone-800 leading-snug">
              জাতীয় ক্ষতি ও জরিমানা <span className="font-sans font-black text-red-700">৳{displayLoss.toLocaleString('bn-BD')}</span> দিয়া সিলেটর বাজার থাকি কিনা যাইতো সর্বমোট{' '}
              <span className="font-black text-[#1F6B3A]">{cupsOfTea.toLocaleString('bn-BD')} কাপ</span> খাঁটি সাতকড়া লাল চা অথবা{' '}
              <span className="font-black text-[#B3372B]">{platesOfBiryani.toLocaleString('bn-BD')} প্লেট</span> গরম গরম খাসির আখনি বিরিয়ানি!
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS: Fluid tactile motion and audio click */}
        <div className="border-t-2 border-[#2b2520] pt-2.5 mt-2.5 flex flex-wrap justify-between items-center gap-2 font-sans shrink-0">
          {/* Share Button with Shimmer Sweep & Hover Lift */}
          <button
            onClick={() => {
              soundService.playClick();
              handleShare();
            }}
            className="relative group overflow-hidden flex items-center gap-2 bg-[#2b2520] hover:bg-stone-800 text-yellow-300 px-4 py-2.5 rounded text-xs md:text-sm font-bold shadow-md hover:shadow-xl hover:shadow-black/40 transition-all duration-200 hover:-translate-y-1 active:scale-95 active:translate-y-0.5 border border-yellow-600/40 cursor-pointer"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            ) : (
              <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            )}
            <span>{copied ? 'রসিদ কপি অইছে!' : 'মামলা রসিদ (শেয়ার)'}</span>
          </button>

          {/* Most Wanted Leaderboard with Rotate & Hover Lift */}
          <button
            onClick={() => {
              soundService.playClick();
              setLeaderboardModalOpen(true);
            }}
            className="relative group overflow-hidden flex items-center gap-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-4 py-2.5 rounded text-xs md:text-sm font-bold shadow-md hover:shadow-xl hover:shadow-amber-600/30 transition-all duration-200 hover:-translate-y-1 active:scale-95 active:translate-y-0.5 border border-amber-300/40 cursor-pointer"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            <Trophy className="w-4 h-4 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-200 text-yellow-200" />
            <span>মোস্ট ওয়ান্টেড</span>
          </button>

          {/* Primary Action Button: Next Mission if Completed, else Restart */}
          {isMissionSuccess ? (
            <button
              onClick={() => {
                soundService.playClick();
                startNextMissionStep();
              }}
              className="relative group overflow-hidden flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white px-6 py-2.5 rounded text-xs md:text-sm font-black shadow-lg hover:shadow-2xl hover:shadow-emerald-600/40 transition-all duration-200 hover:-translate-y-1 active:scale-95 active:translate-y-0.5 border-2 border-emerald-300 cursor-pointer"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
              <span>পরবর্তী মিশন চালান ({countdown}s) [Enter]</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
            </button>
          ) : (
            <button
              onClick={() => {
                soundService.playClick();
                restartRun();
              }}
              className="relative group overflow-hidden flex items-center gap-2 bg-gradient-to-r from-red-700 via-red-600 to-red-800 hover:from-red-600 hover:to-red-700 text-white px-6 py-2.5 rounded text-xs md:text-sm font-black shadow-lg hover:shadow-2xl hover:shadow-red-600/40 transition-all duration-200 hover:-translate-y-1 active:scale-95 active:translate-y-0.5 border border-red-300 cursor-pointer"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
              <span>আবার চালান [স্পেস]</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
