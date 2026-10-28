import { create } from 'zustand';
import { PlayerProfile, GarageItem } from '@shared/types';
import { apiService } from '../services/api.service';

interface PlayerState {
  profile: PlayerProfile | null;
  garageItems: GarageItem[];
  isLoading: boolean;

  fetchProfile: () => Promise<void>;
  fetchGarage: () => Promise<void>;
  updateTaka: (newTaka: number) => void;
  unlockMission: (missionId: string) => void;
  equipCustomization: (category: 'PAINT' | 'DECAL' | 'HORN' | 'ACCESSORY', itemId: string) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  profile: null,
  garageItems: [],
  isLoading: false,

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const data = await apiService.initGuestSession();
      set({ profile: data.player, isLoading: false });
    } catch (e) {
      console.warn('Failed to fetch profile:', e);
      set({ isLoading: false });
    }
  },

  fetchGarage: async () => {
    try {
      const res = await apiService.getGarage();
      set({ garageItems: res.items });
      if (get().profile) {
        set((state) => ({
          profile: state.profile ? { ...state.profile, taka: res.playerTaka } : null,
        }));
      }
    } catch (e) {
      console.warn('Failed to fetch garage:', e);
    }
  },

  updateTaka: (newTaka: number) => {
    set((state) => ({
      profile: state.profile ? { ...state.profile, taka: newTaka } : null,
    }));
  },

  unlockMission: (missionId: string) => {
    set((state) => {
      if (!state.profile) return state;
      const current = new Set(state.profile.unlockedMissions);
      current.add(missionId);
      return {
        profile: {
          ...state.profile,
          unlockedMissions: Array.from(current),
        },
      };
    });
  },

  equipCustomization: (category, itemId) => {
    set((state) => {
      if (!state.profile) return state;
      const updated = { ...state.profile };
      if (category === 'PAINT') updated.equippedPaint = itemId;
      if (category === 'DECAL') updated.equippedDecal = itemId;
      if (category === 'HORN') updated.equippedHorn = itemId;
      if (category === 'ACCESSORY') updated.equippedAccessory = itemId;

      // Also update garageItems local flags
      const updatedItems = state.garageItems.map((item) => ({
        ...item,
        isEquipped: item.category === category ? item.id === itemId : item.isEquipped,
      }));

      return { profile: updated, garageItems: updatedItems };
    });
  },
}));
