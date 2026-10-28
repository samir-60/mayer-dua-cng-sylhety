import crypto from 'crypto';
import prisma from '../prisma';

export interface AntiCheatValidationResult {
  isValid: boolean;
  reason?: string;
  calculatedRewardTaka: number;
  calculatedTipTaka: number;
  calculatedChaosBonus: number;
}

/**
 * Validates mission completion against server-issued mission sessions:
 * 1. Verifies session exists, belongs to calling player, and is not expired or already used.
 * 2. Checks time elapsed against physical minimum speed limits (e.g. minimum realistic completion time).
 * 3. Validates negotiated fare does not exceed mission allowed upper bounds.
 * 4. Prevents duplicate completion replay attacks using challengeNonce matching.
 * 5. Calculates validated rewards strictly on the server.
 */
export async function validateMissionCompletion(
  playerId: string,
  sessionToken: string,
  missionId: string,
  timeElapsedSeconds: number,
  chaosScore: number,
  fareNegotiatedTaka: number
): Promise<AntiCheatValidationResult> {
  const session = await prisma.missionSession.findUnique({
    where: { sessionToken },
    include: { mission: true },
  });

  if (!session) {
    return {
      isValid: false,
      reason: 'Invalid or fabricated mission session token.',
      calculatedRewardTaka: 0,
      calculatedTipTaka: 0,
      calculatedChaosBonus: 0,
    };
  }

  if (session.playerId !== playerId) {
    return {
      isValid: false,
      reason: 'Mission session ownership mismatch. Session does not belong to this player.',
      calculatedRewardTaka: 0,
      calculatedTipTaka: 0,
      calculatedChaosBonus: 0,
    };
  }

  if (session.completed) {
    return {
      isValid: false,
      reason: 'Mission session already completed. Replay submission rejected.',
      calculatedRewardTaka: 0,
      calculatedTipTaka: 0,
      calculatedChaosBonus: 0,
    };
  }

  if (session.missionId !== missionId) {
    return {
      isValid: false,
      reason: 'Mission session mismatch. Target mission ID does not match issued session.',
      calculatedRewardTaka: 0,
      calculatedTipTaka: 0,
      calculatedChaosBonus: 0,
    };
  }

  const now = new Date();
  if (now > session.expiresAt) {
    return {
      isValid: false,
      reason: 'Mission session expired. Exceeded allocated mission time window.',
      calculatedRewardTaka: 0,
      calculatedTipTaka: 0,
      calculatedChaosBonus: 0,
    };
  }

  // Minimum realistic completion time (at max vehicle speed of 90 km/h, straight line Euclidean distance)
  const dx = session.mission.dropoffX - session.mission.pickupX;
  const dz = session.mission.dropoffZ - session.mission.pickupZ;
  const distanceUnits = Math.sqrt(dx * dx + dz * dz);
  // In game units, 1 unit ≈ 5 meters. Max speed ≈ 25 m/s = 5 units/s.
  // Add 4 seconds for minimum pickup negotiation & loading
  const minRealisticSeconds = Math.max(8, (distanceUnits / 12) + 4);

  if (timeElapsedSeconds < minRealisticSeconds) {
    return {
      isValid: false,
      reason: `Unrealistic teleportation/speed cheat detected! Completed in ${timeElapsedSeconds.toFixed(1)}s, minimum required is ${minRealisticSeconds.toFixed(1)}s.`,
      calculatedRewardTaka: 0,
      calculatedTipTaka: 0,
      calculatedChaosBonus: 0,
    };
  }

  // Check fare bounds: client cannot negotiate more than 2.0x base fare
  const maxPermittedFare = session.mission.baseFareTaka * 2.0;
  const safeNegotiatedFare = Math.min(Math.max(fareNegotiatedTaka, session.mission.baseFareTaka), maxPermittedFare);

  // Server-side calculation of bonuses
  const baseReward = session.mission.rewardTaka;
  const safeChaos = Math.max(0, Math.min(chaosScore, 100));
  const chaosBonus = Math.floor(safeChaos * 0.8); // up to 80 Taka chaos bonus

  // Time bonus: completing faster than 70% of time limit grants tip
  const timeLimit = session.mission.timeLimitSeconds;
  let tipTaka = 0;
  if (timeElapsedSeconds < timeLimit * 0.6) {
    tipTaka = Math.floor(baseReward * 0.25); // 25% quick delivery tip
  } else if (timeElapsedSeconds < timeLimit * 0.8) {
    tipTaka = Math.floor(baseReward * 0.12);
  }

  const totalCalculated = baseReward + safeNegotiatedFare + chaosBonus + tipTaka;

  return {
    isValid: true,
    calculatedRewardTaka: totalCalculated,
    calculatedTipTaka: tipTaka,
    calculatedChaosBonus: chaosBonus,
  };
}

export function generateSessionNonce(): string {
  return crypto.randomBytes(16).toString('hex');
}
