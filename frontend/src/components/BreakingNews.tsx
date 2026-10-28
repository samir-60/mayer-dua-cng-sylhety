import React, { useEffect } from 'react';
import { useCommentaryStore } from '../stores/useCommentaryStore';
import { useGameStore } from '../stores/useGameStore';
import { Radio } from 'lucide-react';

export const BreakingNews: React.FC = () => {
  const { breakingHeadlineBn, breakingHeadlineEn, refreshRandomHeadline } = useCommentaryStore();
  const { language } = useGameStore();

  useEffect(() => {
    const timer = setInterval(() => {
      refreshRandomHeadline();
    }, 18000); // cycle headline periodically
    return () => clearInterval(timer);
  }, [refreshRandomHeadline]);

  const headline = language === 'bn' ? breakingHeadlineBn : breakingHeadlineEn;

  return (
    <div className="fixed bottom-0 inset-x-0 h-9 bg-gradient-to-r from-red-950 via-stone-950 to-stone-900 border-t-2 border-red-600 shadow-2xl flex items-center px-2.5 z-40 select-none overflow-hidden">
      {/* Red Breaking Badge */}
      <div className="flex items-center gap-1.5 bg-red-600 text-white font-black px-2.5 py-0.5 rounded-sm text-[11px] uppercase tracking-wider shrink-0 mr-3 animate-pulse shadow-md font-sans">
        <Radio className="w-3.5 h-3.5" />
        <span>{language === 'bn' ? 'ব্রেকিং নিউজ' : 'BREAKING'}</span>
      </div>

      {/* Marquee Content */}
      <div className="overflow-hidden whitespace-nowrap w-full">
        <div className="inline-block animate-ticker-slide font-bold text-yellow-300 text-xs md:text-sm tracking-wide font-bangla drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          [সর্বশেষ] {headline}
        </div>
      </div>
    </div>
  );
};
