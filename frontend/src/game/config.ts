// Mayer Duya CNG: All tunable numbers and configurations
// As required by Master Build Prompt Part 1, 2, 3, 4, 5, 9, 10

export const GAME_PALETTE = {
  cngGreen: '#1F6B3A',
  signalYellow: '#F2C230',
  wetRoadCharcoal: '#26282B',
  teaGardenGreen: '#5E8C3A',
  hillHazeBlue: '#9DB4C0',
  brickRed: '#B3372B',
  monsoonSkyGrey: '#B9C2C6',
  warmPaper: '#F6F1E4',
  paperBorder: '#26282B',
  charcoal: '#1A1C1E',
  warningAmber: '#D97706',
  dangerRed: '#DC2626',
  policePink: '#EC4899',
} as const;

export const VEHICLE_CONFIG = {
  // Dimensions in metres
  length: 2.6,
  width: 1.35,
  height: 1.75,
  wheelRadius: 0.28,

  // Physics & Handling
  maxSpeedKmh: 65,
  reverseMaxSpeedKmh: 20,
  acceleration: 18.0,
  braking: 32.0,
  naturalDrag: 4.5,
  reverseAcceleration: 10.0,
  boostMultiplier: 1.45,
  boostDurationMax: 5.0, // seconds
  boostRechargeRate: 0.8, // seconds per second

  turnSpeed: 2.6,
  turnSpeedHighSpeedDamping: 0.55,
  maxSteerAngle: 0.58, // radians (~33 deg)
  bodyRollFactor: 0.18,
  suspensionBounceFactor: 0.08,
  driftFactor: 0.15,

  // Health & Damage
  initialHealth: 100,
  lightHitMinDamage: 5,
  lightHitMaxDamage: 15,
  heavyHitMinDamage: 30,
  axleBreakSpeedKmh: 40, // Collision with truck/bus above this speed ends the run
};

export const GAS_CONFIG = {
  initialGas: 100,
  normalDrainRate: 0.75, // percent per second at full speed
  idleDrainRate: 0.05, // percent per second when stopped
  boostDrainMultiplier: 2.5,
  refillRatePerSec: 35.0, // percent per second on pad
  refillStopSecondsRequired: 3.0,
  costPerFullTankTaka: 180, // Taka
  lowGasWarningPercent: 18,
  criticalDistanceToStationMeters: 150,
};

export const SHIFT_CONFIG = {
  durationSeconds: 720, // 12 real minutes = 1 full in-game 12-hour shift
  hoursStart: 7, // 7:00 AM
  hoursEnd: 19, // 7:00 PM
};

export const CHALLAN_CONFIG = {
  maxChallan: 100,
  redLightRunPenalty: 25,
  wrongWayPerSecond: 10,
  policeIgnorePenalty: 35,
  fineTakaOnMax: 200,
  timePenaltySecondsOnMax: 20,
};

export const MOOD_CONFIG = {
  initialMood: 100,
  hardBrakeDrop: 8,
  bumpDrop: 5,
  wrongWayPerSecondDrop: 4,
  latenessPerSecondDrop: 1.5,
  tipThresholdMood: 50,
  teaBreakBonus: 25,
  teaBreakCostTaka: 20,
};

export const FARE_CONFIG = {
  baseFareTaka: 40,
  takaPer100Meters: 12,
  speedBonusMaxTaka: 35,
  damagePenaltyMultiplier: 0.5,
  latePenaltyPerSecondTaka: 1.5,
};

export const ZONES = {
  OLD_BAZAAR: {
    id: 'old_bazaar',
    nameBn: 'পুরাতন বাজার',
    nameEn: 'Old Bazaar',
    center: [0, 0, 80] as [number, number, number],
    color: '#B3372B',
    descriptionBn: 'সংকীর্ণ রাস্তা, দোকানপাট ও রিকশার ভিড়',
    descriptionEn: 'Narrow market lanes, signboards, pushcarts',
  },
  RIVER_BANK: {
    id: 'river_bank',
    nameBn: 'সুরমা নদীঘাট',
    nameEn: 'River Bank',
    center: [-120, 0, 100] as [number, number, number],
    color: '#3B82F6',
    descriptionBn: 'প্রশস্ত বাঁধ সড়ক, কাঠের নৌকা ও শান্ত সুরমা',
    descriptionEn: 'Wide embankment road, boats, ghat steps',
  },
  IRON_BRIDGE: {
    id: 'iron_bridge',
    nameBn: 'লোহার কিন ব্রিজ',
    nameEn: 'Iron Bridge',
    center: [0, 2.5, 0] as [number, number, number],
    color: '#D97706',
    descriptionBn: '১৮০ মিটার ঐতিহাসিক স্টিল আর্চ ব্রিজ',
    descriptionEn: '180m steel arch bridge over Surma River',
  },
  SHRINE_QUARTER: {
    id: 'shrine_quarter',
    nameBn: 'দরগাহ মহল্লা',
    nameEn: 'Shrine Quarter',
    center: [120, 0, -80] as [number, number, number],
    color: '#10B981',
    descriptionBn: 'সাদা গম্বুজ, মিনার ও ভক্তদের পদচারণা',
    descriptionEn: 'White domes, minarets, flower stalls, crowds',
  },
  UNIVERSITY_STADIUM: {
    id: 'university_stadium',
    nameBn: 'ভার্সিটি ও স্টেডিয়াম',
    nameEn: 'University & Stadium',
    center: [-130, 0, -80] as [number, number, number],
    color: '#8B5CF6',
    descriptionBn: 'প্রশস্ত রাজপথ, তোরণ ও সুবিশাল স্টেডিয়াম',
    descriptionEn: 'Wide boulevard, campus gates, floodlights',
  },
  RAIL_BUS_HUB: {
    id: 'rail_bus_hub',
    nameBn: 'রেলওয়ে ও বাস টার্মিনাল',
    nameEn: 'Rail & Bus Hub',
    center: [120, 0, 80] as [number, number, number],
    color: '#EF4444',
    descriptionBn: 'ঘড়ির মিনার, দূরপাল্লার বাস ও কুলিযাত্রী',
    descriptionEn: 'Clock tower, bus bays, luggage porters',
  },
  TEA_HILLS: {
    id: 'tea_hills',
    nameBn: 'জাফলং রোড চা বাগান',
    nameEn: 'Tea Hills',
    center: [0, 0, -170] as [number, number, number],
    color: '#5E8C3A',
    descriptionBn: 'সবুজ চা পাতার টিলা ও আঁকাবাঁকা পাহাড়ি পথ',
    descriptionEn: 'Terraced tea bushes, winding climb, morning mist',
  },
} as const;

export type ZoneId = keyof typeof ZONES;

export const PAINT_JOBS = [
  {
    id: 'paint_standard_green',
    nameBn: 'স্ট্যান্ডার্ড সবুজ',
    nameEn: 'Standard Green',
    colorMain: '#1F6B3A',
    colorTrim: '#F2C230',
    unlockFareTaka: 0,
    roofCoverColor: '#1A1C1E',
  },
  {
    id: 'paint_dusk',
    nameBn: 'গোধূলি ডাস্ক',
    nameEn: 'Dusk Edition',
    colorMain: '#0F3820',
    colorTrim: '#EA580C',
    unlockFareTaka: 600,
    roofCoverColor: '#27272A',
  },
  {
    id: 'paint_festival',
    nameBn: 'সিলেটি উৎসব',
    nameEn: 'Festival Joy',
    colorMain: '#047857',
    colorTrim: '#FBBF24',
    unlockFareTaka: 1500,
    roofCoverColor: '#1C1917',
  },
];
