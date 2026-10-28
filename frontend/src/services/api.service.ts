import {
  PlayerProfile,
  MissionDefinition,
  MissionSessionStartResponse,
  MissionCompletionPayload,
  MissionCompletionResponse,
  GarageItem,
  LeaderboardRecord,
  GeneratedNewspaper,
} from '@shared/types';
import { generateOfflineNewspaper } from '../comedy/NewspaperGenerator';

const API_BASE = '/api';
const TOKEN_KEY = 'mayer_dua_guest_token';

class ApiService {
  private guestToken: string | null = null;
  private isBackendOffline: boolean = false;

  constructor() {
    this.guestToken = localStorage.getItem(TOKEN_KEY);
  }

  public getGuestToken(): string | null {
    return this.guestToken;
  }

  public setGuestToken(token: string) {
    this.guestToken = token;
    localStorage.setItem(TOKEN_KEY, token);
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.guestToken) {
      headers['Authorization'] = `Bearer ${this.guestToken}`;
    }
    return headers;
  }

  public async initGuestSession(): Promise<{ token: string; player: PlayerProfile }> {
    if (!this.isBackendOffline) {
      try {
        const res = await fetch(`${API_BASE}/guest-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ existingToken: this.guestToken || undefined }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.token) {
            this.setGuestToken(data.token);
            return data;
          }
        } else {
          this.isBackendOffline = true;
        }
      } catch {
        this.isBackendOffline = true;
      }
    }

    // Local fallback
    const fallbackToken = this.guestToken || `local_guest_${Date.now()}`;
    this.setGuestToken(fallbackToken);
    const localProfile: PlayerProfile = {
      id: 'local_player',
      guestToken: fallbackToken,
      name: 'সিলেটি মামা (অফলাইন)',
      taka: 250,
      totalChaos: 0,
      reputation: 100,
      equippedPaint: 'paint_classic_green',
      equippedDecal: 'decal_mayer_dua',
      equippedHorn: 'horn_sylheti_pee',
      equippedAccessory: 'acc_none',
      unlockedMissions: ['mission_1'],
      createdAt: new Date().toISOString(),
    };
    return { token: fallbackToken, player: localProfile };
  }

  public async getMissions(): Promise<MissionDefinition[]> {
    try {
      const res = await fetch(`${API_BASE}/missions`, {
        headers: this.getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return data.missions;
      }
    } catch (e) {
      console.warn('Failed to fetch missions from API, using fallback data:', e);
    }

    // Return the MVP 3 missions + 7 locked milestones
    return this.getLocalMissions();
  }

  public async startMission(missionId: string): Promise<MissionSessionStartResponse> {
    try {
      const res = await fetch(`${API_BASE}/missions/${missionId}/start`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Failed to start mission on server:', e);
    }

    // Local session fallback
    return {
      sessionToken: `local_session_${Date.now()}`,
      missionId,
      serverTimestamp: Date.now(),
      challengeNonce: 'local_nonce',
    };
  }

  public async completeMission(payload: MissionCompletionPayload): Promise<MissionCompletionResponse> {
    try {
      const res = await fetch(`${API_BASE}/missions/${payload.missionId}/complete`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Failed to complete mission on server, generating local result:', e);
    }

    // Local calculation fallback
    const baseReward = 150;
    const chaosBonus = Math.floor(payload.chaosScore * 0.8);
    const tip = payload.timeElapsedSeconds < 60 ? 30 : 10;
    const total = baseReward + payload.fareNegotiatedTaka + chaosBonus + tip;

    const newspaper = generateOfflineNewspaper({
      missionId: payload.missionId,
      missionTitleBn: 'মিশন সম্পন্ন',
      missionTitleEn: 'Mission Accomplished',
      locationBn: 'চৌহাট্টা পয়েন্ট',
      locationEn: 'Chowhatta Point',
      timeElapsedSeconds: payload.timeElapsedSeconds,
      chaosScore: payload.chaosScore,
      damagePercent: payload.damagePercent,
      fareTaka: payload.fareNegotiatedTaka,
      rewardTaka: total,
      hornsHonked: 12,
      passengerNameBn: 'আবুল চাচা',
    });

    // Sequential automatic progression: advance from current mission index to next
    const allMissions = this.getLocalMissions();
    const currentIdx = allMissions.findIndex((m) => m.id === payload.missionId);
    let nextUnlockedId: string | undefined;
    if (currentIdx !== -1 && currentIdx + 1 < allMissions.length) {
      nextUnlockedId = allMissions[currentIdx + 1].id;
    }

    return {
      success: true,
      takaEarned: total,
      newBalance: 400 + total,
      chaosBonus,
      tipTaka: tip,
      newspaper,
      isNewBestTime: true,
      unlockedNextMissionId: nextUnlockedId,
    };
  }

  public async getGarage(): Promise<{ playerTaka: number; items: GarageItem[] }> {
    if (!this.isBackendOffline) {
      try {
        const res = await fetch(`${API_BASE}/garage`, {
          headers: this.getHeaders(),
        });
        if (res.ok) {
          return await res.json();
        } else {
          this.isBackendOffline = true;
        }
      } catch {
        this.isBackendOffline = true;
      }
    }

    return {
      playerTaka: 250,
      items: this.getLocalGarageItems(),
    };
  }

  public async purchaseItem(itemId: string): Promise<any> {
    if (!this.isBackendOffline) {
      try {
        const res = await fetch(`${API_BASE}/garage/purchase`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ itemId }),
        });
        if (res.ok) return res.json();
      } catch {
        this.isBackendOffline = true;
      }
    }
    return { success: true, message: 'Purchased locally' };
  }

  public async equipItem(itemId: string, category: string): Promise<any> {
    if (!this.isBackendOffline) {
      try {
        const res = await fetch(`${API_BASE}/garage/equip`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ itemId, category }),
        });
        if (res.ok) return res.json();
      } catch {
        this.isBackendOffline = true;
      }
    }
    return { success: true, message: 'Equipped locally' };
  }

  public async getLeaderboard(): Promise<LeaderboardRecord[]> {
    try {
      const res = await fetch(`${API_BASE}/leaderboard`);
      if (res.ok) {
        const data = await res.json();
        return data.leaderboard;
      }
    } catch (e) {
      console.warn('Failed to fetch leaderboard:', e);
    }

    return [
      {
        id: '1',
        rank: 1,
        playerName: 'বদরুল স্পিডমাস্টার',
        taka: 5420,
        totalChaos: 890,
        completedMissionsCount: 18,
        favoriteCNGStyle: 'Londoni VIP Gold',
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        rank: 2,
        playerName: 'সুরমা রকেট কাওছার',
        taka: 4100,
        totalChaos: 720,
        completedMissionsCount: 14,
        favoriteCNGStyle: 'Surma Cyber Neon',
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        rank: 3,
        playerName: 'মায়ের দোয়া মানিক',
        taka: 3850,
        totalChaos: 640,
        completedMissionsCount: 12,
        favoriteCNGStyle: 'Classic Green & Yellow',
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        rank: 4,
        playerName: 'জিন্দাবাজার ট্রাফিক রাজা',
        taka: 2900,
        totalChaos: 990,
        completedMissionsCount: 9,
        favoriteCNGStyle: 'Royal Bengal Stripes',
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  public async getNewspaperHistory(): Promise<GeneratedNewspaper[]> {
    try {
      const res = await fetch(`${API_BASE}/newspaper/history`, {
        headers: this.getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return data.newspapers || [];
      }
    } catch (e) {}
    return [];
  }

  private getLocalMissions(): MissionDefinition[] {
    return [
      {
        id: 'mission_1',
        titleBn: '১. জিন্দাবাজার ভাড়া যুদ্ধ',
        titleEn: '1. Zindabazar Fare Battle',
        subtitleBn: 'কিপটা চাচার লগে দামাদামি ও চৌহাট্টা দৌড়',
        subtitleEn: 'Stingy uncle bargaining & rush to Chowhatta',
        descriptionBn: 'জিন্দাবাজার পয়েন্টে এক কিপটা চাচা সিএনজি খুঁজতাছে। কয় ৩০ টাকা দিব, আপনি ৫০ টাকার কমে নড়বেন না! ভাড়া ঠিক কইরা চৌহাট্টা পয়েন্টে নামান।',
        descriptionEn: 'A notoriously stingy uncle at Zindabazar wants a ride. He offers 30 Tk, but you demand 50 Tk minimum! Negotiate and dash through traffic to Chowhatta.',
        roadNameBn: 'জিন্দাবাজার - চৌহাট্টা রোড',
        roadNameEn: 'Zindabazar - Chowhatta Road',
        roadImage: '/images/roads/zindabazar_road.jpg',
        rewardTaka: 120,
        baseFareTaka: 50,
        difficulty: 'EASY',
        timeLimitSeconds: 150,
        isAvailableInMvp: true,
        isUnlockedDefault: true,
        pickupLocation: { x: -45.0, y: 0.5, z: 10.0, nameBn: 'জিন্দাবাজার পয়েন্ট', nameEn: 'Zindabazar Point' },
        dropoffLocation: { x: 40.0, y: 0.5, z: -35.0, nameBn: 'চৌহাট্টা মোড়', nameEn: 'Chowhatta Intersection' },
        passengerNameBn: 'আবুল চাচা (কিপটা প্যাসেঞ্জার)',
        passengerNameEn: 'Abul Chacha (Stingy Passenger)',
        passengerAvatar: '👴🏽',
        dialogue: {
          speakerBn: 'আবুল চাচা',
          speakerEn: 'Abul Chacha',
          avatar: '👴🏽',
          initialTextBn: 'ও মামা! চৌহাট্টা যাইমু, ৩০ টেকা দিমু। যাইবায় নি?',
          initialTextEn: 'O Mama! Going to Chowhatta, will pay 30 Taka. Will you go?',
          choices: [
            {
              id: 'c1',
              textBn: 'মামা, তেলের দাম জানইন নি? ৬০ টাকার এক পয়সা কম হইতো নায়!',
              textEn: 'Mama, do you know fuel prices? Not a penny less than 60!',
              responseBn: 'আরে বাপরে বাপ! আচ্ছা ৫০ টাকা দিমু, আর এক পয়সাও না!',
              responseEn: 'Uff! Fine, I will give 50 Taka, not a paisa more!',
              takaImpact: 50,
              chaosImpact: 10,
            },
            {
              id: 'c2',
              textBn: 'চাচা উঠেন, মায়ের দোয়ায় ৫০ টেকাত লইয়া যাইমু!',
              textEn: 'Get in Chacha, with Mother\'s Blessing I take you for 50!',
              responseBn: 'হায়রে পুয়া, দোয়া দিয়া পেট ভরবনি! জলদি চালাও!',
              responseEn: 'Oh son, will prayers fill my tummy? Drive quickly!',
              takaImpact: 45,
              chaosImpact: 5,
            },
            {
              id: 'c3',
              textBn: '৩০ টেকা দিয়া রিকশাত যান চাচা, সিএনজিত পাও দেওয়া লাগব না!',
              textEn: 'Take a rickshaw for 30 Tk uncle, no need to step on my CNG!',
              responseBn: 'রাগিও না বাজি! ৫০ টাকাই দিমু, খালি সময় মত পৌঁছাই দেও!',
              responseEn: 'Don\'t get angry dear! I will give 50 Taka, just be on time!',
              takaImpact: 55,
              chaosImpact: 25,
            },
          ],
        },
      },
      {
        id: 'mission_2',
        titleBn: '২. আম্বরখানা ভিআইপি খাসি',
        titleEn: '2. Ambarkhana VIP Goat',
        subtitleBn: 'বড়লোকের খাসি লাফাইতে না দিয়া টিলাগড় পৌঁছান',
        subtitleEn: 'Transport prized Eid goat without it escaping',
        descriptionBn: 'আম্বরখানার এক ধনাঢ্য লন্ডনীর আদরের কুরবানির খাসি সিএনজির পিছন সিটে বইয়া টিলাগড় যাইব! সিএনজি বেশি দোলাইলে খাসি ম্যা ম্যা করিয়া লাফ দিব!',
        descriptionEn: 'A wealthy Londoni\'s pampered goat needs a VIP ride on the back seat from Ambarkhana to Tilagor. Don\'t bounce too violently or the goat will panic!',
        roadNameBn: 'আম্বরখানা - এয়ারপোর্ট কানেক্টিং রোড',
        roadNameEn: 'Ambarkhana - Airport Connecting Road',
        roadImage: '/images/roads/ambarkhana_road.jpg',
        rewardTaka: 220,
        baseFareTaka: 100,
        difficulty: 'MEDIUM',
        timeLimitSeconds: 180,
        isAvailableInMvp: true,
        isUnlockedDefault: false,
        pickupLocation: { x: 65.0, y: 0.5, z: 40.0, nameBn: 'আম্বরখানা গোলচত্বর', nameEn: 'Ambarkhana Circle' },
        dropoffLocation: { x: -60.0, y: 0.5, z: 70.0, nameBn: 'টিলাগড় ইকো পার্ক গেট', nameEn: 'Tilagor Eco Park Gate' },
        passengerNameBn: 'সোলেমান সাহেব ও ভিআইপি খাসি',
        passengerNameEn: 'Soleman Saheb & VIP Goat',
        passengerAvatar: '🐐',
        specialGimmick: 'VIP_GOAT',
        dialogue: {
          speakerBn: 'সোলেমান সাহেব',
          speakerEn: 'Soleman Saheb',
          avatar: '🐐',
          initialTextBn: 'ড্রাইভার ভাই, আমার লাখ টেকার লাল খাসিটারে টিলাগড় নিতে হইব। সাবধানে চালাইও, খাসির মাথা ঘুরলে তোমারে জরিমানা করমু!',
          initialTextEn: 'Driver bhai, take my 1-Lakh Taka red goat to Tilagor. Drive smooth, if the goat gets dizzy I will fine you!',
          choices: [
            {
              id: 'g1',
              textBn: 'টেনশন নিয়েন না সাব, আমার সিএনজি প্লেনের লাখান মসৃণ!',
              textEn: 'Don\'t worry sir, my CNG glides smooth like a Boeing plane!',
              responseBn: 'খাসি কয়: ম্যাআআআআ! সাব কয়: হুনছ নি? সাবধানে!',
              responseEn: 'Goat bleats: MEHHH! Saheb says: Heard that? Careful!',
              takaImpact: 100,
              chaosImpact: 15,
            },
            {
              id: 'g2',
              textBn: 'খাসিরে পেছনের সিটে সিটবেল্ট বান্ধিয়া বইয়া দেন!',
              textEn: 'Fasten the seatbelt on the goat in the backseat!',
              responseBn: 'খাসির লাইগা সিটবেল্ট? তোমারে ডবল বকশিশ দিমু!',
              responseEn: 'Seatbelt for a goat? Brilliant, take an extra tip!',
              takaImpact: 130,
              chaosImpact: 20,
            },
          ],
        },
      },
      {
        id: 'mission_3',
        titleBn: '৩. বন্দরবাজার মুরগি ডেলিভারি',
        titleEn: '3. Bandar Bazar Chicken Delivery',
        subtitleBn: 'রেস্তোরাঁর জরুরি তাজা মুরগি চালান!',
        subtitleEn: 'Urgent live Sylheti chicken delivery for wedding feast',
        descriptionBn: 'বন্দরবাজার আড়ত থেকে তাজা মুরগির খাঁচা নিয়া কিন ব্রিজের পারের বিয়ের বাবুর্চির কাছে পৌঁছান। খাঁচা যেন ঝাঁকুনিতে রাস্তায় পইড়া না যায়!',
        descriptionEn: 'Crates of live squawking Sylheti desi chickens must reach the master chef near Keane Bridge before the wedding biryani runs out. Speed without flipping!',
        roadNameBn: 'ক্বীন ব্রিজ - সুরমা রিভার রোড',
        roadNameEn: 'Keane Bridge - Surma River Road',
        roadImage: '/images/roads/keane_bridge.jpg',
        rewardTaka: 280,
        baseFareTaka: 120,
        difficulty: 'HARD',
        timeLimitSeconds: 160,
        isAvailableInMvp: true,
        isUnlockedDefault: false,
        pickupLocation: { x: -20.0, y: 0.5, z: -75.0, nameBn: 'বন্দরবাজার পাইকারি আড়ত', nameEn: 'Bandar Bazar Chicken Market' },
        dropoffLocation: { x: 30.0, y: 0.5, z: -80.0, nameBn: 'কিন ব্রিজ সংলগ্ন কমিউনিটি সেন্টার', nameEn: 'Keane Bridge Feast Hall' },
        passengerNameBn: 'বাবুর্চি আলাউদ্দিন',
        passengerNameEn: 'Chef Alauddin',
        passengerAvatar: '🐔',
        specialGimmick: 'CHICKEN_DELIVERY',
        dialogue: {
          speakerBn: 'বাবুর্চি আলাউদ্দিন',
          speakerEn: 'Chef Alauddin',
          avatar: '🐔',
          initialTextBn: 'ও মামা! বরযাত্রী আইয়া পড়ছে, রোস্ট রান্ধার মুরগি শেষ! ৫ মিনিটের মধ্যে কিন ব্রিজ পৌছাই দেও!',
          initialTextEn: 'O Mama! The wedding party arrived, no chicken for roast! Get to Keane Bridge in 5 minutes!',
          choices: [
            {
              id: 'ch1',
              textBn: 'আল্লাহর নাম লইয়া খাঁচা তুলেন, সিএনজি বাতাসে ভাসব!',
              textEn: 'Load the cages bismillah, this CNG will fly on air!',
              responseBn: 'কুক্কুরু ক্কু! আলাউদ্দিন কয়: মুরগি উড়ার আগেই পৌঁছাও!',
              responseEn: 'Rooster crows! Alauddin screams: Reach before chickens fly!',
              takaImpact: 120,
              chaosImpact: 30,
            },
            {
              id: 'ch2',
              textBn: 'রাস্তাত জ্যাম পাইলে কিন্তু ফুটপাত দিয়া উঠাইমু!',
              textEn: 'If there\'s traffic jam, I\'m mounting the footpath!',
              responseBn: 'যেমনে পারো যাও, খালি বিয়া ভাইঙ্গো না!',
              responseEn: 'Go whatever way you can, just don\'t ruin the wedding!',
              takaImpact: 140,
              chaosImpact: 45,
            },
          ],
        },
      },
      {
        id: 'mission_4',
        titleBn: '৪. মায়ের ফোন কল',
        titleEn: '4. Mayer Phone Call',
        subtitleBn: 'জরুরি কল: "ভাত খাইছস নি রে বাজি?"',
        subtitleEn: 'Mid-drift phone call from worried mother',
        descriptionBn: 'সিএনজি হাই স্পিডে চলনকালে মায়ের ফোন! এক হাতে স্টিয়ারিং, আরেক হাতে মোবাইল ধইরা প্যাসেঞ্জার সামলান।',
        descriptionEn: 'Driving at top speed while Mom calls to ask if you ate lunch. Balance the phone while steering!',
        roadNameBn: 'চৌহাট্টা - শহীদ মিনার রোড',
        roadNameEn: 'Chowhatta - Shaheed Minar Road',
        roadImage: '/images/roads/chowhatta_road.jpg',
        rewardTaka: 350,
        baseFareTaka: 150,
        difficulty: 'MEDIUM',
        timeLimitSeconds: 180,
        isAvailableInMvp: true,
        isUnlockedDefault: false,
        pickupLocation: { x: 0.0, y: 0.5, z: 15.0, nameBn: 'চৌহাট্টা সেন্ট্রাল পয়েন্ট', nameEn: 'Chowhatta Central Point' },
        dropoffLocation: { x: 50.0, y: 0.5, z: 50.0, nameBn: 'মীরের ময়দান স্কয়ার', nameEn: 'Mirer Moydan Square' },
        passengerNameBn: 'আম্মা (ফোনে)',
        passengerNameEn: 'Amma (On Call)',
        passengerAvatar: '👵🏽',
        dialogue: {
          speakerBn: 'আম্মা',
          speakerEn: 'Amma',
          avatar: '👵🏽',
          initialTextBn: 'বাজিরে, ভাত খাইছস নি? সিএনজি বেশি স্পিডে চালাইস না কইলাম!',
          initialTextEn: 'Son, did you eat? Do not drive the CNG too fast!',
          choices: [
            {
              id: 'm1',
              textBn: 'আম্মা টেনশন নিয়েন না, আমি সাবধানেই চালাই!',
              textEn: 'Do not worry Mom, I drive safely!',
              responseBn: 'হুনলাম তুই নাকি কিন ব্রিজে রিকশাত ধাক্কা মারছস!',
              responseEn: 'I heard you hit a rickshaw at Keane Bridge!',
              takaImpact: 150,
              chaosImpact: 10,
            },
            {
              id: 'm2',
              textBn: 'আম্মা পরে কথা কই, ট্রাফিক পুলিশ সামনে খাড়াইয়া!',
              textEn: 'Call later Mom, traffic police ahead!',
              responseBn: 'আল্লাহ বাজি তোরে হেদায়াত দেউক, জলদি বাসায় আয়!',
              responseEn: 'May Allah protect you, come home quick!',
              takaImpact: 180,
              chaosImpact: 20,
            },
          ],
        },
      },
      {
        id: 'mission_5',
        titleBn: '৫. চৌহাট্টা উল্টা দিক নির্দেশনা',
        titleEn: '5. Chowhatta Wrong Directions',
        subtitleBn: 'চাচা কয় ডানে, ম্যাপ কয় বাঁয়ে!',
        subtitleEn: 'Backseat driver gives 100% wrong turns',
        descriptionBn: 'প্যাসেঞ্জার নিজে জানে না কই যাইব, খালি উল্টা দিকে ঘুরায়! তাকে দরগাহ গেটে পৌঁছান।',
        descriptionEn: 'Passenger insists on shortcuts that end in dead-end alleys. Drop him at Dargah Gate!',
        roadNameBn: 'শাহজালাল দরগাহ গেট রোড',
        roadNameEn: 'Shahjalal Dargah Gate Road',
        roadImage: '/images/roads/dargah_gate_road.jpg',
        rewardTaka: 400,
        baseFareTaka: 160,
        difficulty: 'HARD',
        timeLimitSeconds: 200,
        isAvailableInMvp: true,
        isUnlockedDefault: false,
        pickupLocation: { x: 40.0, y: 0.5, z: -35.0, nameBn: 'চৌহাট্টা গোলচত্বর', nameEn: 'Chowhatta Roundabout' },
        dropoffLocation: { x: 120.0, y: 0.5, z: -80.0, nameBn: 'শাহজালাল দরগাহ প্রধান গেট', nameEn: 'Shahjalal Dargah Gate' },
        passengerNameBn: 'দিশাহারা চাচা',
        passengerNameEn: 'Lost Passenger',
        passengerAvatar: '👴🏽',
        dialogue: {
          speakerBn: 'দিশাহারা চাচা',
          speakerEn: 'Lost Passenger',
          avatar: '👴🏽',
          initialTextBn: 'মামা, দরগাহ গেট কোনবায়? আমি তো মনে হয় আম্বরখানা আইয়া পড়ছি!',
          initialTextEn: 'Mama, which way to Dargah Gate? I think I arrived at Ambarkhana!',
          choices: [
            {
              id: 'd1',
              textBn: 'চাচা আপনি চুপচাপ বসেন, আমি আসল দরগাহ গেট দেখাইমু!',
              textEn: 'Sit quietly uncle, I will show you the real Dargah Gate!',
              responseBn: 'আইচ্ছা বাবা, ঠিক জায়গাত নামাইয়া দেও খালি!',
              responseEn: 'Fine son, just drop me at the right spot!',
              takaImpact: 160,
              chaosImpact: 15,
            },
          ],
        },
      },
      {
        id: 'mission_6',
        titleBn: '৬. টিলাগড় বরযাত্রী রাশ',
        titleEn: '6. Tilagor Wedding Rush',
        subtitleBn: '৭ জন বরযাত্রী এক সিএনজিতে!',
        subtitleEn: 'Overloaded CNG with 7 wedding guests',
        descriptionBn: 'সিএনজির ছাদ আর পেছনের সিটে ভরা বরযাত্রী। টিলাগড় রোড দিয়ে উপশহরে পৌঁছান।',
        descriptionEn: '7 heavy guests squeezed into one 3-seater CNG! Rush through Tilagarh to Uposhohor.',
        roadNameBn: 'টিলাগড় - এমসি কলেজ রোড',
        roadNameEn: 'Tilagarh - MC College Road',
        roadImage: '/images/roads/tilagarh_road.jpg',
        rewardTaka: 500,
        baseFareTaka: 200,
        difficulty: 'HARD',
        timeLimitSeconds: 210,
        isAvailableInMvp: true,
        isUnlockedDefault: false,
        pickupLocation: { x: -60.0, y: 0.5, z: 70.0, nameBn: 'টিলাগড় মোড়', nameEn: 'Tilagarh Crossing' },
        dropoffLocation: { x: 60.0, y: 0.5, z: -60.0, nameBn: 'উপশহর মেইন রোড', nameEn: 'Uposhohor Main Road' },
        passengerNameBn: 'বরযাত্রী দল',
        passengerNameEn: 'Groom Squad',
        passengerAvatar: '👥',
        dialogue: {
          speakerBn: 'বরযাত্রী দল',
          speakerEn: 'Groom Squad',
          avatar: '👥',
          initialTextBn: 'মামা, আমরা সাতজন আছি, সিএনজিত জাগা অইব নি? ডবল ভাড়া দিমু!',
          initialTextEn: 'Mama, we are 7 people, will we fit? We will pay double fare!',
          choices: [
            {
              id: 'w1',
              textBn: 'চাপাচাপি করিয়া বসেন, মায়ের দোয়ায় সব সম্ভব!',
              textEn: 'Squeeze in, with Mother\'s Blessing anything is possible!',
              responseBn: 'সাবাস মামা! টানেন, বিয়া লাগি যাইব!',
              responseEn: 'Bravo Mama! Step on it, wedding time!',
              takaImpact: 200,
              chaosImpact: 35,
            },
          ],
        },
      },
      {
        id: 'mission_7',
        titleBn: '৭. কদমতলী এসি প্যাসেঞ্জার',
        titleEn: '7. Kadamtali AC Passenger',
        subtitleBn: '"মামা, সিএনজি তে এসি নাই?"',
        subtitleEn: 'London-returned passenger asks for AC in open CNG',
        descriptionBn: 'লন্ডন ফেরত বড়লোক প্যাসেঞ্জার গরমে অস্থির হইয়া এসির বাতাস খুঁজতাছে। বাতাস দিতে হাই স্পিডে টানেন!',
        descriptionEn: 'London tourist demands AC in a non-AC green CNG. Drive fast so the natural breeze cools him down!',
        roadNameBn: 'ক্বীন ব্রিজ - কদমতলী এভিনিউ',
        roadNameEn: 'Keane Bridge - Kadamtali Avenue',
        roadImage: '/images/roads/keane_bridge.jpg',
        rewardTaka: 550,
        baseFareTaka: 250,
        difficulty: 'HARD',
        timeLimitSeconds: 190,
        isAvailableInMvp: true,
        isUnlockedDefault: false,
        pickupLocation: { x: 0.0, y: 0.5, z: -150.0, nameBn: 'কদমতলী বাস টার্মিনাল', nameEn: 'Kadamtali Bus Terminal' },
        dropoffLocation: { x: -50.0, y: 0.5, z: -50.0, nameBn: 'গ্র্যান্ড সিলেট হোটেল', nameEn: 'Grand Sylhet Hotel' },
        passengerNameBn: 'লন্ডনী রাজু',
        passengerNameEn: 'Londoni Raju',
        passengerAvatar: '🕶️',
        dialogue: {
          speakerBn: 'লন্ডনী রাজু',
          speakerEn: 'Londoni Raju',
          avatar: '🕶️',
          initialTextBn: 'মামা, হোয়াট ইজ দিস? তোমার সিএনজিত এসি চলে না কেন?',
          initialTextEn: 'Mama, what is this? Why is the AC not running in your CNG?',
          choices: [
            {
              id: 'l1',
              textBn: 'স্যার, ফুল স্পিডে টানলে সিলেটের প্রাকৃতিক ১০০% অর্গানিক এসি পাইবেন!',
              textEn: 'Sir, at full speed you get 100% organic natural Sylhet AC!',
              responseBn: 'ওয়াও, ন্যাচারাল উইন্ড! ভেরি গুড মামা, ড্রাইভ ফাস্ট!',
              responseEn: 'Wow, natural wind! Very good Mama, drive fast!',
              takaImpact: 250,
              chaosImpact: 25,
            },
          ],
        },
      },
      {
        id: 'mission_8',
        titleBn: '৮. সিলেট বৃষ্টি চ্যালেঞ্জ',
        titleEn: '8. Sylhet Rain Challenge',
        subtitleBn: 'হঠাৎ মুষলধারে সিলেটর বিখ্যাত বৃষ্টি!',
        subtitleEn: 'Heavy flash torrential downpour and slippery roads',
        descriptionBn: 'বৃষ্টি নামলে টার্পুলিন পর্দা ঝুলাইয়া ড্রাগ রেস! পিচ্ছিল রাস্তায় ব্রেক কষা নিষেধ!',
        descriptionEn: 'Torrential Sylhet rains. Waterlogged roads and drifting on wet asphalt.',
        roadNameBn: 'আম্বরখানা - সুবিদবাজার রেইনওয়ে',
        roadNameEn: 'Ambarkhana - Subidbazar Rainway',
        roadImage: '/images/roads/ambarkhana_road.jpg',
        rewardTaka: 650,
        baseFareTaka: 300,
        difficulty: 'LEGENDARY',
        timeLimitSeconds: 220,
        isAvailableInMvp: true,
        isUnlockedDefault: false,
        pickupLocation: { x: 65.0, y: 0.5, z: 40.0, nameBn: 'আম্বরখানা মোড়', nameEn: 'Ambarkhana Point' },
        dropoffLocation: { x: 40.0, y: 0.5, z: 40.0, nameBn: 'সুবিদবাজার স্কয়ার', nameEn: 'Subidbazar Square' },
        passengerNameBn: 'ভিজা সাংবাদিক',
        passengerNameEn: 'Drenched Reporter',
        passengerAvatar: '🌧️',
        dialogue: {
          speakerBn: 'ভিজা সাংবাদিক',
          speakerEn: 'Drenched Reporter',
          avatar: '🌧️',
          initialTextBn: 'মামা, ক্যামেরা আর মাইক ভিজিয়া গেল! বৃষ্টি থামার আগেই টিভি স্টুডিও পৌঁছাও!',
          initialTextEn: 'Mama, my camera and mic got wet! Get to the TV studio before the rain stops!',
          choices: [
            {
              id: 'r1',
              textBn: 'পর্দা নামান মামা, সিএনজি পানির উপর দিয়া স্পিডবোটের লাখান যাইব!',
              textEn: 'Drop the plastic flaps Mama, this CNG sails like a speedboat!',
              responseBn: 'সাবাস সিলেটর বাঘ! টানেন!',
              responseEn: 'Bravo Tiger of Sylhet! Go!',
              takaImpact: 300,
              chaosImpact: 40,
            },
          ],
        },
      },
      {
        id: 'mission_9',
        titleBn: '৯. চা খাইয়া যাই',
        titleEn: '9. Cha Khaiya Jai',
        subtitleBn: 'মালনীছড়া চা বাগানের ৭ রঙের চা ব্রেক',
        subtitleEn: 'Mid-shift Sylheti tea break with biscuit',
        descriptionBn: 'মালনীছড়া চা বাগানের আঁকাবাঁকা রাস্তা দিয়া পর্যটককে বিমানবন্দর পৌঁছে দিন।',
        descriptionEn: 'Drive through winding tea hills of Malnicherra and rush to the airport.',
        roadNameBn: 'মালনীছড়া চা বাগান রোড',
        roadNameEn: 'Malnicherra Tea Estate Road',
        roadImage: '/images/roads/malnicherra_tea_road.jpg',
        rewardTaka: 700,
        baseFareTaka: 320,
        difficulty: 'HARD',
        timeLimitSeconds: 200,
        isAvailableInMvp: true,
        isUnlockedDefault: false,
        pickupLocation: { x: 110.0, y: 0.5, z: 80.0, nameBn: 'মালনীছড়া বাগান মোড়', nameEn: 'Malnicherra Tea Estate' },
        dropoffLocation: { x: 0.0, y: 0.5, z: 80.0, nameBn: 'বিমানবন্দর সংযোগ রোড', nameEn: 'Airport Link Road' },
        passengerNameBn: 'চা প্রেমী মন্টু',
        passengerNameEn: 'Tea Lover Montu',
        passengerAvatar: '☕',
        dialogue: {
          speakerBn: 'চা প্রেমী মন্টু',
          speakerEn: 'Tea Lover Montu',
          avatar: '☕',
          initialTextBn: 'মামা, এক কাপ সাত রঙের চা খাইয়া লই! তারপর এয়ারপোর্টে টান দিবা!',
          initialTextEn: 'Mama, let us have a cup of 7-colour tea first, then speed to the airport!',
          choices: [
            {
              id: 't1',
              textBn: 'চা খাইলে বিমান ছুটি যাইব মামা, সিএনজি তেই সাতকড়া চা ঢালিয়া দিই!',
              textEn: 'If you drink tea you miss your flight, drink on the go!',
              responseBn: 'হা হা হা! খাস সিলেটি আইডিয়া! টানেন মামা!',
              responseEn: 'Haha! Classic Sylheti idea! Step on the gas!',
              takaImpact: 320,
              chaosImpact: 30,
            },
          ],
        },
      },
      {
        id: 'mission_10',
        titleBn: '১০. মায়ের দোয়া ফিনালে',
        titleEn: '10. Mayer Dua Finale',
        subtitleBn: 'সিলেট শহরের কিংবদন্তি সিএনজি পাইলট!',
        subtitleEn: 'The Ultimate Grand Grand Prix through all Sylhet checkpoints',
        descriptionBn: 'পুরো সিলেট শহর চক্কর দিয়া কিন ব্রিজ, জিন্দাবাজার, আম্বরখানা ও দরগাহ পার হইয়া স্টেডিয়ামে সেরা খেতাব অর্জন করুন!',
        descriptionEn: 'The grand tour of Sylhet. Speed past all landmarks into the Hall of Fame at Sylhet Stadium!',
        roadNameBn: 'সুরমা ভ্যালি গ্র্যান্ড সার্কিট',
        roadNameEn: 'Surma Valley Grand Circuit',
        roadImage: '/images/roads/keane_bridge.jpg',
        rewardTaka: 1500,
        baseFareTaka: 500,
        difficulty: 'LEGENDARY',
        timeLimitSeconds: 300,
        isAvailableInMvp: true,
        isUnlockedDefault: false,
        pickupLocation: { x: 0.0, y: 0.5, z: -110.0, nameBn: 'কিন ব্রিজ উত্তর পার', nameEn: 'Keane Bridge North' },
        dropoffLocation: { x: -130.0, y: 0.5, z: -80.0, nameBn: 'সিলেট জেলা স্টেডিয়াম', nameEn: 'Sylhet Stadium' },
        passengerNameBn: 'মেয়র সাহেব',
        passengerNameEn: 'City Mayor',
        passengerAvatar: '🎖️',
        dialogue: {
          speakerBn: 'মেয়র সাহেব',
          speakerEn: 'City Mayor',
          avatar: '🎖️',
          initialTextBn: 'ড্রাইভার সাহেব, পুরা সিলেট শহরের জ্যাম কাটাইয়া স্টেডিয়ামে ট্রফি প্রদান অনুষ্ঠানে নিয়ে চলেন!',
          initialTextEn: 'Driver saheb, navigate through Sylhet traffic to the stadium trophy ceremony!',
          choices: [
            {
              id: 'f1',
              textBn: 'মেয়র সাব, রাস্তা তো আমার বাপের! সাইরেন বাজাইয়া স্টেডিয়ামে ঢুকাইমু!',
              textEn: 'Mayor saheb, the road belongs to my father! Siren on to the stadium!',
              responseBn: 'সাবাস মায়ের দোয়া! আজকের সিলেট তোমার!',
              responseEn: 'Bravo Mayer Dua! Sylhet belongs to you today!',
              takaImpact: 500,
              chaosImpact: 50,
            },
          ],
        },
      },
    ];
  }

  private getLocalGarageItems(): GarageItem[] {
    return [
      {
        id: 'paint_classic_green',
        nameBn: 'ক্লাসিক সবুজ ও হলুদ',
        nameEn: 'Classic Green & Yellow',
        descriptionBn: 'সিলেট শহরের ঐতিহ্যবাহী সবুজ বডি আর হলুদ ছাদ। ১০০% অরিজিনাল!',
        descriptionEn: 'Traditional Sylheti green body with iconic yellow roof canvas.',
        category: 'PAINT',
        priceTaka: 0,
        previewColor: '#059669',
        isPurchased: true,
        isEquipped: true,
      },
      {
        id: 'paint_golden_vip',
        nameBn: 'লন্ডনী গোল্ডেন ভিআইপি',
        nameEn: 'Londoni VIP Gold',
        descriptionBn: 'লন্ডন ফেরত আত্মীয়র চোখ ধাঁধানো চকচকা খাঁটি সোনালী রঙ!',
        descriptionEn: 'Dazzling polished gold finish for the ultimate Londoni swag.',
        category: 'PAINT',
        priceTaka: 500,
        previewColor: '#eab308',
      },
      {
        id: 'paint_cyber_neon',
        nameBn: 'সুরমা সাইবার নিওন',
        nameEn: 'Surma Cyber Neon',
        descriptionBn: 'রাতের কিন ব্রিজের তলে জ্বলজ্বল করা ভবিষ্যৎ প্রজন্মের রঙ।',
        descriptionEn: 'High-visibility fluorescent neon green for late night cruising.',
        category: 'PAINT',
        priceTaka: 750,
        previewColor: '#22c55e',
      },
      {
        id: 'paint_bengal_tiger',
        nameBn: 'বাঘ মামা স্ট্রাইপ',
        nameEn: 'Royal Bengal Stripes',
        descriptionBn: 'রাস্তায় নামলেই বাকি গাড়ি ডরে সাইড দিব!',
        descriptionEn: 'Ferocious royal tiger stripes that make rickshaws yield in fear.',
        category: 'PAINT',
        priceTaka: 1000,
        previewColor: '#f97316',
      },
      {
        id: 'decal_mayer_dua',
        nameBn: 'মায়ের দোয়া',
        nameEn: 'Mayer Dua (Mother\'s Blessings)',
        descriptionBn: 'যেই সিএনজির মাথায় মায়ের দোয়া আছে, তার কোনো সমস্যা নাই!',
        descriptionEn: 'The supreme blessing script on the rear bumper.',
        category: 'DECAL',
        priceTaka: 0,
        previewIcon: '',
        isPurchased: true,
        isEquipped: true,
      },
      {
        id: 'decal_allah_shorboshoktiman',
        nameBn: 'আল্লাহ সর্বশক্তিমান',
        nameEn: 'Allah Almighty',
        descriptionBn: 'বিশ্বাস আর ভরসার প্রতীক। পাহাড়ি রাস্তাতো ভরসা!',
        descriptionEn: 'Sacred trust decal for extra peace of mind at high speeds.',
        category: 'DECAL',
        priceTaka: 200,
        previewIcon: '',
      },
      {
        id: 'decal_durutto_rakhun',
        nameBn: '১০০ হাত দূরে থাকুন',
        nameEn: 'Keep 100 Hands Distance',
        descriptionBn: 'পিছনে বাম্পারে লাগানো সতর্কবাণী: ধাক্কা মারলে জরিমানা ৫০ টাকা!',
        descriptionEn: 'Back bumper warning script for tailgating rickshaws.',
        category: 'DECAL',
        priceTaka: 350,
        previewIcon: '',
      },
      {
        id: 'horn_sylheti_pee',
        nameBn: 'সিলেটি পীপ-পীপ হর্ন',
        nameEn: 'Classic Sylheti Pee-Pee',
        descriptionBn: 'স্টক হর্ন। পাতলা কিন্তু জেদি শব্দ।',
        descriptionEn: 'Standard high-pitched dual honk.',
        category: 'HORN',
        priceTaka: 0,
        previewIcon: '',
        isPurchased: true,
        isEquipped: true,
      },
      {
        id: 'horn_hydraulic_blast',
        nameBn: 'হাইড্রোলিক ব্লাস্ট হর্ন',
        nameEn: 'Hydraulic Thunderblast',
        descriptionBn: 'এক হর্নে রাস্তার খাসি, মুরগি আর পথচারী এক সাথে বাতাসে উড়ব!',
        descriptionEn: 'Deafening truck horn.',
        category: 'HORN',
        priceTaka: 400,
        previewIcon: '',
      },
      {
        id: 'acc_none',
        nameBn: 'কোনো এক্সট্রা নাই',
        nameEn: 'Stock Factory Look',
        descriptionBn: 'সাদামাটা সিএনজি।',
        descriptionEn: 'Bare essentials.',
        category: 'ACCESSORY',
        priceTaka: 0,
        isPurchased: true,
        isEquipped: true,
      },
      {
        id: 'acc_cd_mirror',
        nameBn: 'লটকানো সিডি ও লেবু-মরিচ',
        nameEn: 'CD Mirror & Chili-Lemon Charm',
        descriptionBn: 'লুকিং গ্লাসে ঝুলানো চকচকে পুরনো সিডি আর বদনজর কাটানোর লেবু-মরিচ!',
        descriptionEn: 'Vintage shiny CD hanging from rear-view mirror with charm.',
        category: 'ACCESSORY',
        priceTaka: 150,
        previewIcon: '',
      },
    ];
  }
}

export const apiService = new ApiService();
