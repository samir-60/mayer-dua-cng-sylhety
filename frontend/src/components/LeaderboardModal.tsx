import React, { useEffect, useState } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { apiService } from '../services/api.service';
import { LeaderboardRecord } from '@shared/types';
import { X, Trophy, Flame, Coins, ShieldAlert } from 'lucide-react';

export const LeaderboardModal: React.FC = () => {
  const { isLeaderboardModalOpen, setLeaderboardModalOpen, language } = useGameStore();
  const [records, setRecords] = useState<LeaderboardRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLeaderboardModalOpen) {
      loadLeaderboard();
    }
  }, [isLeaderboardModalOpen]);

  const loadLeaderboard = async () => {
    setLoading(true);
    const data = await apiService.getLeaderboard();
    setRecords(data);
    setLoading(false);
  };

  if (!isLeaderboardModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border-2 border-yellow-500/40 text-stone-100 max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden p-6 relative max-h-[90vh] flex flex-col font-bangla">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                {language === 'bn' ? 'সিলেটের সেরা ড্রাইভার তালিকা' : 'SYLHET DRIVER LEADERBOARD'}
              </h2>
              <p className="text-xs text-stone-400 font-sans">
                {language === 'bn' ? 'সর্বোচ্চ আয় ও ক্যাওয়াস র‍্যাঙ্কিং' : 'Ranked by verified Taka & street chaos'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setLeaderboardModalOpen(false)}
            className="text-stone-400 hover:text-white p-2 rounded-xl hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-y-auto flex-1 my-4 space-y-2 pr-1 font-sans">
          {records.map((r) => {
            const isTop3 = r.rank <= 3;
            const rankBadgeColor =
              r.rank === 1
                ? 'bg-yellow-400 text-stone-950 font-black'
                : r.rank === 2
                ? 'bg-slate-300 text-stone-950 font-black'
                : r.rank === 3
                ? 'bg-amber-600 text-white font-black'
                : 'bg-stone-800 text-stone-400';

            return (
              <div
                key={r.id}
                className={`p-3 rounded-2xl border flex items-center justify-between ${
                  isTop3
                    ? 'bg-stone-800/80 border-yellow-500/30 shadow'
                    : 'bg-stone-900/60 border-stone-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${rankBadgeColor}`}
                  >
                    {r.rank}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white font-bangla">
                      {r.playerName}
                    </h4>
                    <span className="text-[11px] text-stone-400">
                      {r.favoriteCNGStyle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-yellow-300 font-bold flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{r.taka} ৳</span>
                  </div>
                  <div className="text-red-400 font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{r.totalChaos}</span>
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
