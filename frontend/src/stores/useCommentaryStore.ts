import { create } from 'zustand';
import { ComedyComment } from '@shared/types';
import { generateLiveBreakingHeadline } from '../comedy/HeadlineGenerator';

interface CommentaryState {
  activeComment: ComedyComment | null;
  breakingHeadlineBn: string;
  breakingHeadlineEn: string;
  recentCommentsHistory: ComedyComment[];

  setActiveComment: (comment: ComedyComment | null) => void;
  updateBreakingHeadline: (headline: { bn: string; en: string }) => void;
  refreshRandomHeadline: () => void;
}

export const useCommentaryStore = create<CommentaryState>((set, get) => ({
  activeComment: null,
  breakingHeadlineBn: 'ব্রেকিং নিউজ: জিন্দাবাজার পয়েন্টে মায়ের দোয়া সিএনজির প্রচণ্ড হর্ন, সতর্ক অবস্থানে ট্রাফিক পুলিশ!',
  breakingHeadlineEn: 'BREAKING: Mayer Dua CNG honks fiercely at Zindabazar, traffic police on alert!',
  recentCommentsHistory: [],

  setActiveComment: (comment) => {
    set((state) => ({
      activeComment: comment,
      recentCommentsHistory: comment
        ? [comment, ...state.recentCommentsHistory.slice(0, 15)]
        : state.recentCommentsHistory,
    }));
  },

  updateBreakingHeadline: (headline) => {
    set({
      breakingHeadlineBn: headline.bn,
      breakingHeadlineEn: headline.en,
    });
  },

  refreshRandomHeadline: () => {
    const next = generateLiveBreakingHeadline();
    set({
      breakingHeadlineBn: next.headlineBn,
      breakingHeadlineEn: next.headlineEn,
    });
  },
}));
