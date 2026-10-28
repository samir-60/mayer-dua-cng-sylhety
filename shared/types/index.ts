// Shared TypeScript types for Mayer Dua: Funny Sylheti CNG Simulator

export type Language = 'bn' | 'en';

export interface PlayerProfile {
  id: string;
  guestToken: string;
  name: string;
  taka: number;
  totalChaos: number;
  reputation: number;
  equippedPaint: string;
  equippedDecal: string;
  equippedHorn: string;
  equippedAccessory: string;
  unlockedMissions: string[];
  createdAt: string;
}

export type MissionDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'LEGENDARY';

export interface MissionObjective {
  id: string;
  textBn: string;
  textEn: string;
  type: 'PICKUP' | 'REACH_DESTINATION' | 'DELIVERY' | 'EVADE' | 'MIN_CHAOS' | 'MAX_DAMAGE';
  targetLocation?: string;
  targetCount?: number;
  currentCount?: number;
  completed: boolean;
}

export interface MissionDialogueChoice {
  id: string;
  textBn: string;
  textEn: string;
  responseBn: string;
  responseEn: string;
  takaImpact: number;
  chaosImpact: number;
}

export interface MissionDialogue {
  speakerBn: string;
  speakerEn: string;
  avatar: string;
  initialTextBn: string;
  initialTextEn: string;
  choices: MissionDialogueChoice[];
}

export interface MissionDefinition {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  rewardTaka: number;
  baseFareTaka: number;
  difficulty: MissionDifficulty;
  pickupLocation: { x: number; y: number; z: number; nameBn: string; nameEn: string };
  dropoffLocation: { x: number; y: number; z: number; nameBn: string; nameEn: string };
  passengerNameBn: string;
  passengerNameEn: string;
  passengerAvatar: string;
  dialogue: MissionDialogue;
  timeLimitSeconds: number;
  isUnlockedDefault: boolean;
  isAvailableInMvp: boolean;
  roadNameBn?: string;
  roadNameEn?: string;
  roadImage?: string;
  specialGimmick?: 'VIP_GOAT' | 'CHICKEN_DELIVERY' | 'RAIN_STORM' | 'PHONE_CALL';
}

export interface MissionSessionStartResponse {
  sessionToken: string;
  missionId: string;
  serverTimestamp: number;
  challengeNonce: string;
}

export interface MissionCompletionPayload {
  sessionToken: string;
  missionId: string;
  timeElapsedSeconds: number;
  chaosScore: number;
  damagePercent: number;
  fareNegotiatedTaka: number;
  specialEventsTriggered: string[];
  completedObjectives: string[];
  clientNonce: string;
}

export interface MissionCompletionResponse {
  success: boolean;
  takaEarned: number;
  newBalance: number;
  chaosBonus: number;
  tipTaka: number;
  newspaper: GeneratedNewspaper;
  isNewBestTime: boolean;
  unlockedNextMissionId?: string;
}

export interface WitnessComment {
  id: string;
  nameBn: string;
  nameEn: string;
  roleBn: string;
  roleEn: string;
  avatar: string;
  commentBn: string;
  commentEn: string;
}

export interface GeneratedNewspaper {
  id: string;
  editionNo: number;
  dateStrBn: string;
  dateStrEn: string;
  priceTagBn: string;
  priceTagEn: string;
  headlineBn: string;
  headlineEn: string;
  subheadingBn: string;
  subheadingEn: string;
  leadArticleBn: string;
  leadArticleEn: string;
  incidentLocationBn: string;
  incidentLocationEn: string;
  chaosRatingBn: string;
  takaEarned: number;
  witnesses: WitnessComment[];
  imageUrl?: string;
  stats: {
    timeSeconds: number;
    topSpeedKmh: number;
    hornsHonked: number;
    nearMisses: number;
    chaosLevel: number;
  };
}

export type GarageCategory = 'PAINT' | 'DECAL' | 'HORN' | 'ACCESSORY';

export interface GarageItem {
  id: string;
  nameBn: string;
  nameEn: string;
  descriptionBn: string;
  descriptionEn: string;
  category: GarageCategory;
  priceTaka: number;
  previewColor?: string;
  previewIcon?: string;
  isEquipped?: boolean;
  isPurchased?: boolean;
  statBonus?: {
    speedBoost?: number;
    handlingBoost?: number;
    chaosMultiplier?: number;
  };
}

export interface LeaderboardRecord {
  id: string;
  rank: number;
  playerName: string;
  taka: number;
  totalChaos: number;
  completedMissionsCount: number;
  favoriteCNGStyle: string;
  updatedAt: string;
}

export type ComedyEventType =
  | 'HORN_SPAM'
  | 'SLOW_DRIVING'
  | 'SPEEDING'
  | 'WRONG_ROUTE'
  | 'LOW_FUEL'
  | 'PASSENGER_BARGAIN'
  | 'PASSENGER_PICKUP'
  | 'MISSION_SUCCESS'
  | 'MISSION_FAIL'
  | 'GOAT_BLOCKING'
  | 'CHICKEN_PANIC'
  | 'CNG_BOUNCE'
  | 'RAIN_START'
  | 'MOTHER_CALL'
  | 'TEA_BREAK'
  | 'VEHICLE_STUCK'
  | 'DESTINATION_REACHED'
  | 'POTHOLE_HIT'
  | 'TRAFFIC_JAM'
  | 'NEAR_MISS';

export interface ComedyComment {
  id: string;
  speakerBn: string;
  speakerEn: string;
  avatar: string;
  textBn: string;
  textEn: string;
  audioKey?: string;
  priority: number; // Higher number = higher priority
  chaosDelta?: number;
}
