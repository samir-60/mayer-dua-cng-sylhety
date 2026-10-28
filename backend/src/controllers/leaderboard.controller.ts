import { Request, Response } from 'express';
import prisma from '../prisma';

export async function getLeaderboard(req: Request, res: Response): Promise<void> {
  const entries = await prisma.leaderboardEntry.findMany({
    orderBy: [{ taka: 'desc' }, { totalChaos: 'desc' }],
    take: 50,
  });

  const ranked = entries.map((entry, index) => ({
    id: entry.id,
    rank: index + 1,
    playerName: entry.playerName,
    taka: entry.taka,
    totalChaos: entry.totalChaos,
    completedMissionsCount: entry.completedMissionsCount,
    favoriteCNGStyle: entry.favoriteCNGStyle,
    updatedAt: entry.updatedAt.toISOString(),
  }));

  res.json({
    success: true,
    leaderboard: ranked,
  });
}
