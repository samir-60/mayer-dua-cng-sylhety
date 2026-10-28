import React, { useEffect, useState } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { apiService } from '../services/api.service';
import { GeneratedNewspaper } from '@shared/types';
import { X, Newspaper as NewspaperIcon, ArrowRight, Calendar, Coins } from 'lucide-react';

export const NewsHistoryModal: React.FC = () => {
  const { isNewsHistoryModalOpen, setNewsHistoryModalOpen, setActiveNewspaper, language } = useGameStore();
  const [history, setHistory] = useState<GeneratedNewspaper[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isNewsHistoryModalOpen) {
      loadHistory();
    }
  }, [isNewsHistoryModalOpen]);

  const loadHistory = async () => {
    setLoading(true);
    const list = await apiService.getNewspaperHistory();
    setHistory(list);
    setLoading(false);
  };

  if (!isNewsHistoryModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border-2 border-stone-700 text-stone-100 max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden p-6 relative max-h-[90vh] flex flex-col font-bangla">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <NewspaperIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                {language === 'bn' ? 'মায়ের দোয়া সংবাদ আর্কাইভ' : 'NEWSPAPER ARCHIVE'}
              </h2>
              <p className="text-xs text-stone-400 font-sans">
                {language === 'bn' ? 'আপনার অতীত ড্রাইভের প্রকাশিত সব ব্যঙ্গ সংবাদ' : 'All published satirical issues of your rides'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setNewsHistoryModalOpen(false)}
            className="text-stone-400 hover:text-white p-2 rounded-xl hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="overflow-y-auto flex-1 my-4 space-y-3 pr-1 font-newspaper">
          {history.length === 0 ? (
            <div className="text-center py-12 text-stone-500 font-sans text-sm">
              {language === 'bn'
                ? 'এখনো কোনো সংবাদ প্রকাশিত হয়নি! একটি মিশন শেষ করলেই আপনার প্রথম পত্রিকা বের হবে!'
                : 'No published newspapers yet! Complete a mission to publish your first edition!'}
            </div>
          ) : (
            history.map((paper) => (
              <div
                key={paper.id}
                onClick={() => {
                  setActiveNewspaper(paper);
                  setNewsHistoryModalOpen(false);
                }}
                className="newspaper-paper text-stone-900 p-4 rounded-xl border border-stone-700 shadow hover:shadow-lg cursor-pointer transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-red-700 flex items-center gap-2 font-bangla">
                    <span>সংস্করণ #{paper.editionNo}</span>
                    <span>•</span>
                    <span>{paper.dateStrBn}</span>
                  </div>
                  <h4 className="font-black text-base text-stone-950 mt-1 font-bangla group-hover:text-amber-800 transition">
                    {language === 'bn' ? paper.headlineBn : paper.headlineEn}
                  </h4>
                  <div className="text-xs text-stone-700 font-sans mt-1 flex items-center gap-2">
                    <span className="flex items-center gap-1 font-bold text-emerald-800">
                      <Coins className="w-3.5 h-3.5" />
                      +{paper.takaEarned} ৳
                    </span>
                    <span>•</span>
                    <span>ক্যাওয়াস: {paper.stats.chaosLevel}%</span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-stone-800 text-yellow-300 flex items-center justify-center shrink-0 ml-3 group-hover:bg-amber-600 transition">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
