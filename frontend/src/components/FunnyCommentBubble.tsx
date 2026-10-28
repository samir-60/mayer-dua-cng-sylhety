import React, { useEffect, useState } from 'react';
import { useCommentaryStore } from '../stores/useCommentaryStore';
import { useGameStore } from '../stores/useGameStore';
import { MessageSquareText } from 'lucide-react';
import { CngIcon } from './CngIcon';

export const FunnyCommentBubble: React.FC = () => {
  const { activeComment, setActiveComment } = useCommentaryStore();
  const { language } = useGameStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (activeComment) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setActiveComment(null), 300);
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, [activeComment, setActiveComment]);

  if (!activeComment) return null;

  return (
    <div
      className={`fixed bottom-11 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 transform pointer-events-none w-full max-w-lg px-4 ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
      }`}
    >
      <div className="bg-stone-900/95 border-2 border-yellow-400 text-stone-100 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-lg mx-4 backdrop-blur-md">
        {/* Speaker Avatar */}
        <div className="w-12 h-12 rounded-full bg-stone-800 border-2 border-emerald-500 flex items-center justify-center shrink-0 shadow-inner">
          <CngIcon className="w-6 h-6 text-emerald-400" />
        </div>

        {/* Speech Bubble Content */}
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-400">
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>
              {language === 'bn' ? activeComment.speakerBn : activeComment.speakerEn}
            </span>
          </div>
          {/* Main Sylheti dialogue in Bangla */}
          <p className="text-sm md:text-base font-bold text-white tracking-wide mt-0.5 font-bangla">
            "{activeComment.textBn}"
          </p>
          {/* English subtitles */}
          <p className="text-xs text-stone-400 italic">
            "{activeComment.textEn}"
          </p>
        </div>
      </div>
    </div>
  );
};
