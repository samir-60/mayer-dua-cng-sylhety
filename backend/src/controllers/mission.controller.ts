import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import prisma from '../prisma';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { validateMissionCompletion, generateSessionNonce } from '../services/antiCheat.service';
import { generateSatiricalNewspaper } from '../services/newspaper.service';

const CompleteMissionSchema = z.object({
  sessionToken: z.string().min(1),
  timeElapsedSeconds: z.number().min(1).max(3600),
  chaosScore: z.number().min(0).max(100),
  damagePercent: z.number().min(0).max(100).default(0),
  fareNegotiatedTaka: z.number().min(0).max(2000),
  specialEventsTriggered: z.array(z.string()).default([]),
  completedObjectives: z.array(z.string()).default([]),
  clientNonce: z.string().optional().default(''),
});

export async function getMissions(req: AuthenticatedRequest, res: Response): Promise<void> {
  const player = req.player;
  const progress = await prisma.playerProgress.findUnique({
    where: { playerId: player.id },
  });

  const unlockedSet = new Set<string>(JSON.parse(progress?.unlockedMissionsJson || '["mission_1"]'));

  const rawMissions = await prisma.mission.findMany({
    orderBy: { orderIndex: 'asc' },
  });

  const missions = rawMissions.map((m) => ({
    id: m.id,
    titleBn: m.titleBn,
    titleEn: m.titleEn,
    subtitleBn: m.subtitleBn,
    subtitleEn: m.subtitleEn,
    descriptionBn: m.descriptionBn,
    descriptionEn: m.descriptionEn,
    rewardTaka: m.rewardTaka,
    baseFareTaka: m.baseFareTaka,
    difficulty: m.difficulty,
    timeLimitSeconds: m.timeLimitSeconds,
    isAvailableInMvp: m.isAvailableInMvp,
    isUnlocked: unlockedSet.has(m.id),
    pickupLocation: {
      x: m.pickupX,
      y: m.pickupY,
      z: m.pickupZ,
      nameBn: m.pickupNameBn,
      nameEn: m.pickupNameEn,
    },
    dropoffLocation: {
      x: m.dropoffX,
      y: m.dropoffY,
      z: m.dropoffZ,
      nameBn: m.dropoffNameBn,
      nameEn: m.dropoffNameEn,
    },
    passengerNameBn: m.passengerNameBn,
    passengerNameEn: m.passengerNameEn,
    passengerAvatar: m.passengerNameBn.includes('খাসি') ? '🐐' : m.passengerNameBn.includes('মুরগি') ? '🐔' : '👴🏽',
    dialogue: JSON.parse(m.dialogueJson || '{}'),
    specialGimmick: m.specialGimmick,
    roadNameBn: m.id === 'mission_1' ? 'জিন্দাবাজার - চৌহাট্টা রোড'
      : m.id === 'mission_2' ? 'আম্বরখানা - এয়ারপোর্ট কানেক্টিং রোড'
      : m.id === 'mission_3' ? 'ক্বীন ব্রিজ - সুরমা রিভার রোড'
      : m.id === 'mission_4' ? 'চৌহাট্টা - শহীদ মিনার রোড'
      : m.id === 'mission_5' ? 'শাহজালাল দরগাহ গেট রোড'
      : m.id === 'mission_6' ? 'টিলাগড় - এমসি কলেজ রোড'
      : m.id === 'mission_7' ? 'ক্বীন ব্রিজ - কদমতলী এভিনিউ'
      : m.id === 'mission_8' ? 'আম্বরখানা - সুবিদবাজার রেইনওয়ে'
      : m.id === 'mission_9' ? 'মালনীছড়া চা বাগান রোড'
      : 'সুরমা ভ্যালি গ্র্যান্ড সার্কিট',
    roadNameEn: m.id === 'mission_1' ? 'Zindabazar - Chowhatta Road'
      : m.id === 'mission_2' ? 'Ambarkhana - Airport Connecting Road'
      : m.id === 'mission_3' ? 'Keane Bridge - Surma River Road'
      : m.id === 'mission_4' ? 'Chowhatta - Shaheed Minar Road'
      : m.id === 'mission_5' ? 'Shahjalal Dargah Gate Road'
      : m.id === 'mission_6' ? 'Tilagarh - MC College Road'
      : m.id === 'mission_7' ? 'Keane Bridge - Kadamtali Avenue'
      : m.id === 'mission_8' ? 'Ambarkhana - Subidbazar Rainway'
      : m.id === 'mission_9' ? 'Malnicherra Tea Estate Road'
      : 'Surma Valley Grand Circuit',
    roadImage: m.id === 'mission_1' ? '/images/roads/zindabazar_road.jpg'
      : m.id === 'mission_2' ? '/images/roads/ambarkhana_road.jpg'
      : m.id === 'mission_3' ? '/images/roads/keane_bridge.jpg'
      : m.id === 'mission_4' ? '/images/roads/chowhatta_road.jpg'
      : m.id === 'mission_5' ? '/images/roads/dargah_gate_road.jpg'
      : m.id === 'mission_6' ? '/images/roads/tilagarh_road.jpg'
      : m.id === 'mission_7' ? '/images/roads/keane_bridge.jpg'
      : m.id === 'mission_8' ? '/images/roads/ambarkhana_road.jpg'
      : m.id === 'mission_9' ? '/images/roads/malnicherra_tea_road.jpg'
      : '/images/roads/keane_bridge.jpg',
  }));

  res.json({
    success: true,
    missions,
  });
}

export async function startMission(req: AuthenticatedRequest, res: Response): Promise<void> {
  const missionId = req.params.id;
  const player = req.player;

  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
  });

  if (!mission) {
    res.status(404).json({ success: false, error: 'Mission not found' });
    return;
  }

  // Check if mission is unlocked
  const progress = await prisma.playerProgress.findUnique({
    where: { playerId: player.id },
  });
  const unlocked = new Set<string>(JSON.parse(progress?.unlockedMissionsJson || '["mission_1"]'));
  if (!unlocked.has(missionId)) {
    res.status(403).json({ success: false, error: 'Mission is locked. Complete previous missions first!' });
    return;
  }

  const sessionToken = `ms_${uuidv4()}`;
  const challengeNonce = generateSessionNonce();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes window

  await prisma.missionSession.create({
    data: {
      sessionToken,
      playerId: player.id,
      missionId,
      challengeNonce,
      expiresAt,
    },
  });

  res.json({
    success: true,
    sessionToken,
    missionId,
    serverTimestamp: Date.now(),
    challengeNonce,
  });
}

export async function completeMission(req: AuthenticatedRequest, res: Response): Promise<void> {
  const missionId = req.params.id;
  const player = req.player;
  const body = CompleteMissionSchema.parse(req.body);

  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
  });

  if (!mission) {
    res.status(404).json({ success: false, error: 'Mission not found' });
    return;
  }

  // Anti-cheat verification
  const antiCheat = await validateMissionCompletion(
    player.id,
    body.sessionToken,
    missionId,
    body.timeElapsedSeconds,
    body.chaosScore,
    body.fareNegotiatedTaka
  );

  if (!antiCheat.isValid) {
    res.status(400).json({
      success: false,
      error: antiCheat.reason || 'Mission validation failed.',
    });
    return;
  }

  // Mark session completed to prevent replay attacks
  await prisma.missionSession.update({
    where: { sessionToken: body.sessionToken },
    data: { completed: true },
  });

  // Calculate unlocked next mission
  const progress = await prisma.playerProgress.findUnique({
    where: { playerId: player.id },
  });
  const currentUnlocked: string[] = JSON.parse(progress?.unlockedMissionsJson || '["mission_1"]');
  const unlockedSet = new Set<string>(currentUnlocked);

  let nextUnlockedId: string | undefined;
  const allMissions = await prisma.mission.findMany({ orderBy: { orderIndex: 'asc' } });
  const currentIndex = allMissions.findIndex((m) => m.id === missionId);
  if (currentIndex !== -1 && currentIndex + 1 < allMissions.length) {
    const nextMission = allMissions[currentIndex + 1];
    unlockedSet.add(nextMission.id);
    nextUnlockedId = nextMission.id;
  }

  // Generate Satirical Newspaper
  const newspaper = generateSatiricalNewspaper({
    missionId: mission.id,
    missionTitleBn: mission.titleBn,
    missionTitleEn: mission.titleEn,
    locationBn: mission.dropoffNameBn,
    locationEn: mission.dropoffNameEn,
    timeElapsedSeconds: body.timeElapsedSeconds,
    chaosScore: body.chaosScore,
    damagePercent: body.damagePercent,
    fareTaka: body.fareNegotiatedTaka,
    rewardTaka: antiCheat.calculatedRewardTaka,
    hornsHonked: Math.max(8, Math.floor(body.timeElapsedSeconds / 3)),
    gimmick: mission.specialGimmick,
    passengerNameBn: mission.passengerNameBn,
  });

  // Update Player Database Record
  const newTaka = player.taka + antiCheat.calculatedRewardTaka;
  const newTotalChaos = player.totalChaos + body.chaosScore;

  await prisma.player.update({
    where: { id: player.id },
    data: {
      taka: newTaka,
      totalChaos: newTotalChaos,
    },
  });

  // Update Progress
  await prisma.playerProgress.update({
    where: { playerId: player.id },
    data: {
      unlockedMissionsJson: JSON.stringify(Array.from(unlockedSet)),
      totalPassengers: { increment: 1 },
      totalNewspapers: { increment: 1 },
      highestChaos: Math.max(progress?.highestChaos || 0, body.chaosScore),
      bestScore: Math.max(progress?.bestScore || 0, newTaka),
    },
  });

  // Save MissionCompletion
  await prisma.missionCompletion.create({
    data: {
      playerId: player.id,
      missionId,
      timeElapsedSeconds: body.timeElapsedSeconds,
      chaosScore: body.chaosScore,
      fareNegotiatedTaka: body.fareNegotiatedTaka,
      tipTaka: antiCheat.calculatedTipTaka,
      damagePercent: body.damagePercent,
      takaEarned: antiCheat.calculatedRewardTaka,
      newspaperJson: JSON.stringify(newspaper),
    },
  });

  // Update or Upsert Leaderboard Entry
  await prisma.leaderboardEntry.upsert({
    where: { playerId: player.id },
    update: {
      taka: newTaka,
      totalChaos: newTotalChaos,
      completedMissionsCount: { increment: 1 },
    },
    create: {
      playerId: player.id,
      playerName: player.name,
      taka: newTaka,
      totalChaos: newTotalChaos,
      completedMissionsCount: 1,
      favoriteCNGStyle: player.equippedPaint,
    },
  });

  // Store newspaper in published list
  await prisma.publishedNewspaper.create({
    data: {
      playerId: player.id,
      editionNo: newspaper.editionNo,
      headlineBn: newspaper.headlineBn,
      headlineEn: newspaper.headlineEn,
      newspaperJson: JSON.stringify(newspaper),
    },
  });

  res.json({
    success: true,
    takaEarned: antiCheat.calculatedRewardTaka,
    newBalance: newTaka,
    chaosBonus: antiCheat.calculatedChaosBonus,
    tipTaka: antiCheat.calculatedTipTaka,
    newspaper,
    isNewBestTime: true,
    unlockedNextMissionId: nextUnlockedId,
  });
}
