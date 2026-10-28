import { create } from 'zustand';
import { MissionDefinition, GeneratedNewspaper, Language } from '@shared/types';
import { soundService } from '../services/sound.service';
import { apiService } from '../services/api.service';
import { useCommentaryStore } from './useCommentaryStore';
import { usePlayerStore } from './usePlayerStore';
import { comedyEventBus } from '../comedy/ComedyEventBus';

export type GameMode =
  | 'MENU'
  | 'PLAYING'
  | 'FREE_ROAM'
  | 'DIALOGUE'
  | 'MISSION_COMPLETE'
  | 'GAME_OVER';

interface GameStoreState {
  gameMode: GameMode;
  language: Language;
  activeMission: MissionDefinition | null;
  missionSessionToken: string | null;
  missionStartTime: number;
  unlockedNextMissionId: string | null;

  // Real-time Vehicle & Gameplay Stats
  speedKmh: number;
  fuelPercent: number;
  chaosScore: number;
  damagePercent: number;
  negotiatedFareTaka: number;
  totalHornsHonked: number;

  // Public Anger & Chase System (পাবলিকের গালাগালি ও গণধোলাই)
  publicAngerScore: number;
  isPublicChasing: boolean;

  // Environment & Ambiance
  isRain: boolean;
  isHeadlightsOn: boolean;

  // Passenger & Objectives
  hasPassenger: boolean;
  distanceToTargetMeters: number;
  currentObjectiveTextBn: string;
  currentObjectiveTextEn: string;

  // Baper Rasta National Loss & Combo System
  nationalLossTaka: number;
  comboMultiplier: number;
  floatingLossList: { id: number; text: string; sub: string }[];

  // Active Generated Newspaper
  activeNewspaper: GeneratedNewspaper | null;

  // UI Modals
  isMissionModalOpen: boolean;
  isGarageModalOpen: boolean;
  isLeaderboardModalOpen: boolean;
  isSettingsModalOpen: boolean;
  isNewsHistoryModalOpen: boolean;
  isDialogueModalOpen: boolean;

  // Actions
  setGameMode: (mode: GameMode) => void;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  startMissionFlow: (mission: MissionDefinition, sessionToken: string) => void;
  startNextMissionStep: () => Promise<void>;
  startFreeRoam: () => void;
  restartRun: () => void;
  returnToMenu: () => void;
  updateVehicleTelemetry: (speed: number, fuelDelta: number) => void;
  incrementHorn: () => void;
  addChaos: (delta: number) => void;
  addNationalLoss: (amount: number, reasonBn: string) => void;
  addPublicAnger: (delta: number, reasonBn: string) => void;
  triggerPublicCatch: () => void;
  triggerGameOverCrash: () => void;
  setPassengerPickedUp: (fare: number) => void;
  setDistanceToTarget: (dist: number) => void;
  setUnlockedNextMissionId: (id: string | null) => void;
  toggleRain: () => void;
  toggleHeadlights: () => void;
  setActiveNewspaper: (newspaper: GeneratedNewspaper | null) => void;

  // Modal Toggles
  setMissionModalOpen: (open: boolean) => void;
  setGarageModalOpen: (open: boolean) => void;
  setLeaderboardModalOpen: (open: boolean) => void;
  setSettingsModalOpen: (open: boolean) => void;
  setNewsHistoryModalOpen: (open: boolean) => void;
  setDialogueModalOpen: (open: boolean) => void;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  gameMode: 'MENU',
  language: 'bn',
  activeMission: null,
  missionSessionToken: null,
  missionStartTime: 0,
  unlockedNextMissionId: null,

  speedKmh: 0,
  fuelPercent: 100,
  chaosScore: 10,
  damagePercent: 0,
  negotiatedFareTaka: 50,
  totalHornsHonked: 0,

  // Public Anger & Chase System
  publicAngerScore: 0,
  isPublicChasing: false,

  isRain: false,
  isHeadlightsOn: false,

  hasPassenger: false,
  distanceToTargetMeters: 0,
  currentObjectiveTextBn: 'যাত্রী উঠানোর জন্য জিন্দাবাজার পয়েন্টে যান',
  currentObjectiveTextEn: 'Head to Zindabazar Point to meet passenger',

  // Baper Rasta System Initial Values
  nationalLossTaka: 0,
  comboMultiplier: 1,
  floatingLossList: [],

  activeNewspaper: null,

  isMissionModalOpen: false,
  isGarageModalOpen: false,
  isLeaderboardModalOpen: false,
  isSettingsModalOpen: false,
  isNewsHistoryModalOpen: false,
  isDialogueModalOpen: false,

  setGameMode: (mode) => set({ gameMode: mode }),
  setLanguage: (lang) => set({ language: lang }),
  toggleLanguage: () => set((state) => ({ language: state.language === 'bn' ? 'en' : 'bn' })),
  setUnlockedNextMissionId: (id) => set({ unlockedNextMissionId: id }),

  startMissionFlow: (mission, sessionToken) => {
    soundService.startEngine();
    set({
      gameMode: 'PLAYING',
      activeNewspaper: null,
      activeMission: mission,
      missionSessionToken: sessionToken,
      missionStartTime: Date.now(),
      fuelPercent: 100,
      chaosScore: 15,
      damagePercent: 0,
      speedKmh: 0,
      negotiatedFareTaka: mission.baseFareTaka,
      totalHornsHonked: 0,
      hasPassenger: false,
      isMissionModalOpen: false,
      isRain: mission.id === 'mission_8',
      nationalLossTaka: 0,
      comboMultiplier: 1,
      floatingLossList: [],
      publicAngerScore: 0,
      isPublicChasing: false,
      currentObjectiveTextBn: `প্যাসেঞ্জার নিতে ${mission.pickupLocation.nameBn} যান`,
      currentObjectiveTextEn: `Drive to ${mission.pickupLocation.nameEn} to pick up passenger`,
    });
  },

  startNextMissionStep: async () => {
    soundService.startEngine();
    const { activeMission, unlockedNextMissionId } = get();

    try {
      const allMissions = await apiService.getMissions();
      let nextMission: MissionDefinition | undefined;

      if (unlockedNextMissionId) {
        nextMission = allMissions.find((m) => m.id === unlockedNextMissionId);
      }

      if (!nextMission && activeMission) {
        const curIdx = allMissions.findIndex((m) => m.id === activeMission.id);
        if (curIdx !== -1 && curIdx + 1 < allMissions.length) {
          nextMission = allMissions[curIdx + 1];
        }
      }

      if (!nextMission) {
        nextMission = allMissions[0];
      }

      if (nextMission) {
        const startRes = await apiService.startMission(nextMission.id);
        get().startMissionFlow(nextMission, startRes.sessionToken || `session_${Date.now()}`);
        usePlayerStore.getState().unlockMission(nextMission.id);
      }
    } catch (e) {
      console.error('Failed to auto-advance to next mission:', e);
      get().restartRun();
    }
  },

  startFreeRoam: () => {
    soundService.startEngine();
    set({
      gameMode: 'FREE_ROAM',
      activeMission: null,
      missionSessionToken: null,
      fuelPercent: 100,
      chaosScore: 0,
      damagePercent: 0,
      speedKmh: 0,
      hasPassenger: false,
      nationalLossTaka: 0,
      comboMultiplier: 1,
      floatingLossList: [],
      publicAngerScore: 0,
      isPublicChasing: false,
      currentObjectiveTextBn: 'সিলেটের রাস্তায় বাপের মতো সিএনজি চালান!',
      currentObjectiveTextEn: 'Free roam like you own the streets of Sylhet!',
    });
  },

  restartRun: () => {
    soundService.startEngine();
    const currentMode = get().gameMode;
    const nextMode = currentMode === 'FREE_ROAM' ? 'FREE_ROAM' : 'PLAYING';
    set({
      gameMode: nextMode,
      activeNewspaper: null,
      fuelPercent: 100,
      chaosScore: 0,
      damagePercent: 0,
      speedKmh: 0,
      hasPassenger: false,
      nationalLossTaka: 0,
      comboMultiplier: 1,
      floatingLossList: [],
      publicAngerScore: 0,
      isPublicChasing: false,
      isDialogueModalOpen: false,
    });
  },

  returnToMenu: () => {
    soundService.stopEngine();
    set({
      gameMode: 'MENU',
      activeMission: null,
      activeNewspaper: null,
      isDialogueModalOpen: false,
      isMissionModalOpen: false,
      nationalLossTaka: 0,
      comboMultiplier: 1,
      floatingLossList: [],
      publicAngerScore: 0,
      isPublicChasing: false,
    });
  },

  addPublicAnger: (delta, reasonBn) => {
    const { publicAngerScore, isPublicChasing, triggerPublicCatch } = get();
    const newAnger = Math.min(100, publicAngerScore + delta);
    set({ publicAngerScore: newAnger });

    // If anger hits 50 and not chasing, start public angry shouting and ticker
    if (newAnger >= 50 && !isPublicChasing) {
      set({ isPublicChasing: true });
      soundService.playAngryMob();
      comedyEventBus.emit('POTHOLE_HIT');

      useCommentaryStore.getState().updateBreakingHeadline({
        bn: 'ব্রেকিং: জিন্দাবাজারে বেপরোয়া সিএনজির পিছে ছুটছে ক্ষিপ্ত জনতা! চারিদিকে গালাগালি ও ধাওয়া!',
        en: 'BREAKING: Furious crowd pursues reckless CNG at Zindabazar amid shouting and pursuit!',
      });

      useCommentaryStore.getState().setActiveComment({
        id: `mob_${Date.now()}`,
        speakerBn: 'ক্ষিপ্ত জনতা ও রিকশাওয়ালা',
        speakerEn: 'Angry Mob & Pedestrians',
        avatar: 'walker',
        textBn: 'ঐ ড্রাইভার! গাড়ি থামা কইতাছি! বেপরোয়া গাড়ি চালাইয়া মানুষ মারবায় নি?!',
        textEn: 'Hey driver! Stop right there! Do you intend to run people over?!',
        priority: 9,
      });
    }

    if (newAnger >= 100) {
      triggerPublicCatch();
    }
  },

  triggerPublicCatch: () => {
    soundService.playCollision(true);
    soundService.playAngryMob();
    soundService.playPoliceWhistle();

    const { nationalLossTaka, totalHornsHonked, speedKmh } = get();
    const finalLoss = Math.max(9500, nationalLossTaka);

    useCommentaryStore.getState().updateBreakingHeadline({
      bn: 'ব্রেকিং: ক্বীন ব্রিজে পাবলিকর জুতার বাড়ি খাইয়া খাঁচাত কান্দে সিএনজি মামা! সব নগরামি ছুডাইয়া দিল ক্ষিপ্ত জনতা!',
      en: 'BREAKING: Reckless CNG driver cornered and disciplined by furious Sylhet crowd at Keane Bridge!',
    });

    const mobPaper: GeneratedNewspaper = {
      id: `catch_${Date.now()}`,
      editionNo: Math.floor(Math.random() * 900) + 100,
      dateStrBn: 'আইজ দুপুর ১:১৫',
      dateStrEn: 'Today 1:15 PM',
      priceTagBn: 'মূল্য: ১০ টেকা',
      priceTagEn: 'Price: 10 Taka',
      headlineBn: 'হায়রে বাজি! পাবলিক কয় "পিটাইয়া লাল করমু, সব নগরামি বাইর করমু!" ক্বীন ব্রিজে খাঁচাত আটক সিএনজি মামা!',
      headlineEn: 'Furious Crowd: "Will teach you a lesson for life!" Reckless CNG trapped at Keane Bridge!',
      subheadingBn: 'জিন্দাবাজার থাকি সুরমার পার পর্যন্ত তাণ্ডব: খাঁচা ঘেরাও করিয়া জুতা আর বাঁশর লাঠি প্রদর্শন!',
      subheadingEn: 'Wild chase from Zindabazar to Surma river: Mob surrounds vehicle with shoes and bamboo sticks!',
      leadArticleBn: `আইজ দুপুরবেলা সিলেটর ব্যাস্ত জিন্দাবাজার-ক্বীন ব্রিজ রাস্তাত একের বাদে এক রিকশা আর পানর দোকানত গুতা মারিয়া ক্ষিপ্ত পাবলিকর দাবড়ানির মুখে পড়ছইন সবুজ মায়ের দোয়া সিএনজির মামা! ক্বীন ব্রিজর মুখে জ্যামত গাড়ি আটকিবার বাদে চারোবায়েদি 'ঐ ব্যাটা থামা, পিটাইয়া চামড়া লাল করমু, সব নগরামি বাইর করমু!' চিল্লাইয়া পথচারী আর রিকশাওয়ালারা গাড়ি ঘেরাও করছইন! খাঁচার ভিতর মামা কান্দন শুরু করিয়া কয় "মামা মাফ করি দেও, রাস্তা কিতা আমার বাপরনি?" পুলিশ সময় মত না আইলে সিএনজির তিন চাকা ছাড়া আর কিচ্ছু খুজিয়া পাওয়া গেল না অনে!`,
      leadArticleEn: `After clipping multiple rickshaws and tea stalls on the busy Zindabazar route, the reckless green CNG was cornered at Keane Bridge. An infuriated crowd brandishing shoes surrounded the cage yelling "We will beat your arrogance out of you!" The trembling driver sobbed inside the cage until traffic police intervened.`,
      incidentLocationBn: 'ক্বীন ব্রিজ গোলচত্বর ও সুরমা পার',
      incidentLocationEn: 'Keane Bridge Roundabout & Surma Bank',
      chaosRatingBn: 'চরম গণধোলাই ও জুতার বাড়ি',
      witnesses: [
        {
          id: 'w_mob1',
          nameBn: 'আম্বরখানার বদরুল মিয়া',
          nameEn: 'Badrul Mia',
          roleBn: 'প্রত্যক্ষদর্শী চা বিক্রেতা',
          roleEn: 'Eyewitness Tea Vendor',
          avatar: 'tea',
          commentBn: 'পাবলিক যেমনে বাঁশর লাঠি নিয়া কয় "তোর সব নগরামি আইজ ছুডাইয়া লাল করমু", মামা সিএনজির খাঁচার ভিতর মাথা লুকাইয়া কয় "আমি আর জীবনেও বাপর রাস্তায় গাড়ি চালাইতাম নায়!"',
          commentEn: 'The crowd shouted "We will cure your arrogance today!" while the driver hid inside the cage sobbing "I will never drive like my father owns the road again!"',
        },
        {
          id: 'w_mob2',
          nameBn: 'সার্জেন্ট কফিল উদ্দিন',
          nameEn: 'Sergeant Kofil Uddin',
          roleBn: 'চৌহাট্টা ট্রাফিক পুলিশ',
          roleEn: 'Chowhatta Traffic Sergeant',
          avatar: 'police',
          commentBn: 'আমরা ২ মিনিট দেরি করলে সিএনজির স্ক্রু ছাড়া আর কিচ্ছু আস্তা থাকত না! পাবলিকর মেজাজ যে গরম আছিল!',
          commentEn: 'Had we arrived 2 minutes late, not a single bolt of this CNG would remain intact! The crowd was that furious!',
        },
      ],
      stats: {
        timeSeconds: 52,
        topSpeedKmh: Math.max(62, speedKmh),
        hornsHonked: Math.max(12, totalHornsHonked),
        nearMisses: 8,
        chaosLevel: 100,
      },
      takaEarned: 0,
    };

    set({
      gameMode: 'GAME_OVER',
      activeNewspaper: mobPaper,
      damagePercent: 100,
      isPublicChasing: false,
      publicAngerScore: 100,
    });
  },

  addNationalLoss: (amount, reasonBn) => {
    const { comboMultiplier, nationalLossTaka, damagePercent, triggerGameOverCrash, addPublicAnger } = get();
    const addedLoss = amount * comboMultiplier;
    const newLoss = nationalLossTaka + addedLoss;
    const newDamage = Math.min(100, damagePercent + Math.max(3, Math.round(amount / 400)));
    const nextCombo = Math.min(5, comboMultiplier + 1);

    const newItem = {
      id: Date.now() + Math.random(),
      text: `+৳${addedLoss.toLocaleString('bn-BD')}`,
      sub: reasonBn,
    };

    // Increment public anger on damage
    addPublicAnger(Math.max(8, Math.round(amount / 80)), reasonBn);

    set((state) => ({
      nationalLossTaka: newLoss,
      damagePercent: newDamage,
      comboMultiplier: nextCombo,
      floatingLossList: [...state.floatingLossList.slice(-4), newItem],
      chaosScore: Math.min(100, state.chaosScore + 6),
    }));

    // Auto-remove floating text after 2 seconds
    setTimeout(() => {
      set((state) => ({
        floatingLossList: state.floatingLossList.filter((item) => item.id !== newItem.id),
      }));
    }, 2000);

    // Auto-decrement combo after 3.5s of no hits
    setTimeout(() => {
      set((state) => ({
        comboMultiplier: Math.max(1, state.comboMultiplier - 1),
      }));
    }, 3500);

    if (newDamage >= 100) {
      triggerGameOverCrash();
    }
  },

  triggerGameOverCrash: () => {
    soundService.playCollision(true);
    soundService.playAngryMob();
    const { nationalLossTaka, totalHornsHonked, speedKmh } = get();
    const finalLoss = Math.max(5000, nationalLossTaka);

    const crashPaper: GeneratedNewspaper = {
      id: `crash_${Date.now()}`,
      editionNo: Math.floor(Math.random() * 800) + 100,
      dateStrBn: 'আইজ দুপুর ১২:৪৫',
      dateStrEn: 'Today 12:45 PM',
      priceTagBn: 'দাম: ১০ টেকা',
      priceTagEn: 'Price: 10 Taka',
      headlineBn: 'সিএনজি মামার পাগলা টান: সিলেটর রাজপথত তুলকালাম তাণ্ডব, পাবলিক কয় "চামড়া লাল করমু!"',
      headlineEn: 'Wild CNG Rampage: Public vows retribution across Sylhet streets!',
      subheadingBn: 'জিন্দাবাজার থাকি চৌহাট্টা পর্যন্ত ভাঙচুর: ঘটনাস্থল থাকি খসিয়া পড়া লুকিং গ্লাস ও পানর পিক উদ্ধার!',
      subheadingEn: 'Recovered at scene: Shattered mirror, betel leaf stains and furious crowd shouts!',
      leadArticleBn: `আইজ দুপুরবেলা সিলেটর প্রাণকেন্দ্র জিন্দাবাজার থাকি ক্বীন ব্রিজ পর্যন্ত এক দুর্ধর্ষ সবুজ সিএনজির পাগলা তাণ্ডব চলল! একের বাদে এক রিকশাত সাইড ঘষা, চানর দোকানর কেতলি উল্টানি আর ট্রাফিক সার্জেন্টর বাঁশি উড়াইয়া সর্বমোট ৳${finalLoss.toLocaleString('bn-BD')} টেকার ক্ষতি করিয়া খানাখন্দর মাজে মুখ থুবড়াইয়া পড়ছে! চারোবায় থাকি ক্ষিপ্ত পাবলিক দৌড়াইয়া আইয়া কয় "ঐ ব্যাটা তোর সব নগরামি আইজ ছুডাইয়া চামড়া লাল করমু!" মামা খাঁচার ভিতর কান্দি কয় "রাস্তা কিতা আমার বাপর না আপনার বাপর?"`,
      leadArticleEn: `A whirlwind green CNG wreaked historic havoc from Zindabazar to Keane Bridge today. Scraping past parked cycle-rickshaws and toppling roadside tea kettles, it inflicted a national loss of ৳${finalLoss}. Furious crowds surrounded the cage yelling "We will beat your arrogance out of you!"`,
      incidentLocationBn: 'ক্বীন ব্রিজ মোড়, সিলেট',
      incidentLocationEn: 'Keane Bridge Point, Sylhet',
      chaosRatingBn: 'চরম বিশৃঙ্খলা ও গুতাগুতি',
      witnesses: [
        {
          id: 'w1',
          nameBn: 'আম্বরখানার বদরুল মিয়া',
          nameEn: 'Badrul Mia',
          roleBn: 'প্রবীণ চা বিক্রেতা',
          roleEn: 'Senior Tea Vendor',
          avatar: 'tea',
          commentBn: 'গাড়ি যেমনে সাইড মারল বাজি, ভাবছিলাম পাইলট মনে হয় ককপিট ছাড়ি দিয়া পানর দোকানত বইছে!',
          commentEn: 'The way he swerved, I thought the pilot abandoned the cockpit for a betel stall!',
        },
        {
          id: 'w2',
          nameBn: 'সার্জেন্ট কফিল উদ্দিন',
          nameEn: 'Sergeant Kofil Uddin',
          roleBn: 'চৌহাট্টা ট্রাফিক পুলিশ',
          roleEn: 'Chowhatta Traffic Sergeant',
          avatar: 'police',
          commentBn: 'বাঁশি মারতাম গেছিলাম, কিন্তু পিছনোর "মায়ের দোয়া" সাইনবোর্ড দেখিয়া শ্রদ্ধায় স্যালুট মারি দিছি!',
          commentEn: 'I went to blow my whistle, but reading "Mayer Dua" on the bumper, I saluted!',
        },
      ],
      stats: {
        timeSeconds: 45,
        topSpeedKmh: Math.max(58, speedKmh),
        hornsHonked: Math.max(8, totalHornsHonked),
        nearMisses: 6,
        chaosLevel: 100,
      },
      takaEarned: 0,
    };

    set({
      gameMode: 'GAME_OVER',
      activeNewspaper: crashPaper,
      damagePercent: 100,
    });
  },

  updateVehicleTelemetry: (speed, fuelDelta) => {
    set((state) => {
      const newFuel = Math.max(0, state.fuelPercent - fuelDelta);
      return {
        speedKmh: Math.round(speed),
        fuelPercent: newFuel,
      };
    });
  },

  incrementHorn: () => {
    set((state) => ({
      totalHornsHonked: state.totalHornsHonked + 1,
      chaosScore: Math.min(100, state.chaosScore + 2),
    }));
  },

  addChaos: (delta) => {
    set((state) => ({
      chaosScore: Math.min(100, Math.max(0, state.chaosScore + delta)),
    }));
  },

  setPassengerPickedUp: (fare) => {
    const { activeMission } = get();
    set({
      hasPassenger: true,
      negotiatedFareTaka: fare,
      currentObjectiveTextBn: activeMission
        ? `সাবধানে চালিয়ে ${activeMission.dropoffLocation.nameBn} পৌঁছান`
        : 'গন্তব্যে পৌঁছান',
      currentObjectiveTextEn: activeMission
        ? `Carefully drive and reach ${activeMission.dropoffLocation.nameEn}`
        : 'Reach destination',
    });
  },

  setDistanceToTarget: (dist) => set({ distanceToTargetMeters: Math.round(dist) }),

  toggleRain: () => set((state) => ({ isRain: !state.isRain })),
  toggleHeadlights: () => set((state) => ({ isHeadlightsOn: !state.isHeadlightsOn })),

  setActiveNewspaper: (newspaper) => set({ activeNewspaper: newspaper }),

  setMissionModalOpen: (open) => set({ isMissionModalOpen: open }),
  setGarageModalOpen: (open) => set({ isGarageModalOpen: open }),
  setLeaderboardModalOpen: (open) => set({ isLeaderboardModalOpen: open }),
  setSettingsModalOpen: (open) => set({ isSettingsModalOpen: open }),
  setNewsHistoryModalOpen: (open) => set({ isNewsHistoryModalOpen: open }),
  setDialogueModalOpen: (open) => set({ isDialogueModalOpen: open }),
}));
