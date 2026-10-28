import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../prisma';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

const GuestSessionSchema = z.object({
  existingToken: z.string().optional(),
  name: z.string().min(2).max(40).optional(),
});

export async function createOrResumeGuestSession(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = GuestSessionSchema.parse(req.body || {});
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  if (parsed.existingToken) {
    const existingSession = await prisma.guestSession.findUnique({
      where: { token: parsed.existingToken },
      include: {
        player: {
          include: {
            progress: true,
            items: true,
          },
        },
      },
    });

    if (existingSession && new Date() <= existingSession.expiresAt) {
      // Refresh session
      await prisma.guestSession.update({
        where: { id: existingSession.id },
        data: { expiresAt, lastActiveAt: new Date() },
      });

      res.json({
        success: true,
        token: existingSession.token,
        player: {
          id: existingSession.player.id,
          name: existingSession.player.name,
          taka: existingSession.player.taka,
          totalChaos: existingSession.player.totalChaos,
          reputation: existingSession.player.reputation,
          equippedPaint: existingSession.player.equippedPaint,
          equippedDecal: existingSession.player.equippedDecal,
          equippedHorn: existingSession.player.equippedHorn,
          equippedAccessory: existingSession.player.equippedAccessory,
          unlockedMissions: JSON.parse(existingSession.player.progress?.unlockedMissionsJson || '["mission_1"]'),
        },
      });
      return;
    }
  }

  // Create brand new guest player
  const token = `guest_${uuidv4()}`;
  const playerName = parsed.name || 'সিলেটি মামা ' + Math.floor(Math.random() * 900 + 100);

  const newPlayer = await prisma.player.create({
    data: {
      guestToken: token,
      name: playerName,
      taka: 150, // Starting Taka
      totalChaos: 0,
      reputation: 100,
      equippedPaint: 'paint_classic_green',
      equippedDecal: 'decal_mayer_dua',
      equippedHorn: 'horn_sylheti_pee',
      equippedAccessory: 'acc_none',
      progress: {
        create: {
          unlockedMissionsJson: JSON.stringify(['mission_1']),
        },
      },
      guestSessions: {
        create: {
          token,
          expiresAt,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'] || 'Browser',
        },
      },
      leaderboard: {
        create: {
          playerName,
          taka: 150,
          totalChaos: 0,
          completedMissionsCount: 0,
          favoriteCNGStyle: 'Classic Green & Yellow',
        },
      },
      items: {
        create: [
          { garageItemId: 'paint_classic_green' },
          { garageItemId: 'decal_mayer_dua' },
          { garageItemId: 'horn_sylheti_pee' },
          { garageItemId: 'acc_none' },
        ],
      },
    },
    include: {
      progress: true,
    },
  });

  res.json({
    success: true,
    token,
    player: {
      id: newPlayer.id,
      name: newPlayer.name,
      taka: newPlayer.taka,
      totalChaos: newPlayer.totalChaos,
      reputation: newPlayer.reputation,
      equippedPaint: newPlayer.equippedPaint,
      equippedDecal: newPlayer.equippedDecal,
      equippedHorn: newPlayer.equippedHorn,
      equippedAccessory: newPlayer.equippedAccessory,
      unlockedMissions: ['mission_1'],
    },
  });
}

export async function getPlayerMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  const player = req.player;
  const progress = await prisma.playerProgress.findUnique({
    where: { playerId: player.id },
  });

  res.json({
    success: true,
    player: {
      id: player.id,
      guestToken: player.guestToken,
      name: player.name,
      taka: player.taka,
      totalChaos: player.totalChaos,
      reputation: player.reputation,
      equippedPaint: player.equippedPaint,
      equippedDecal: player.equippedDecal,
      equippedHorn: player.equippedHorn,
      equippedAccessory: player.equippedAccessory,
      unlockedMissions: JSON.parse(progress?.unlockedMissionsJson || '["mission_1"]'),
      createdAt: player.createdAt,
    },
  });
}
