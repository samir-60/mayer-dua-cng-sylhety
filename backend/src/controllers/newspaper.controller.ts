import { Response } from 'express';
import prisma from '../prisma';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

const PublishNewspaperSchema = z.object({
  editionNo: z.number(),
  headlineBn: z.string(),
  headlineEn: z.string(),
  newspaperJson: z.string(),
});

export async function getNewspaperHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
  const player = req.player;

  const records = await prisma.missionCompletion.findMany({
    where: { playerId: player.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { mission: true },
  });

  const newspapers = records.map((r) => {
    try {
      return JSON.parse(r.newspaperJson);
    } catch {
      return null;
    }
  }).filter(Boolean);

  res.json({
    success: true,
    newspapers,
  });
}

export async function getCommunityNewspapers(req: AuthenticatedRequest, res: Response): Promise<void> {
  const published = await prisma.publishedNewspaper.findMany({
    orderBy: { createdAt: 'desc' },
    take: 25,
    include: {
      player: {
        select: { name: true },
      },
    },
  });

  const newspapers = published.map((p) => ({
    id: p.id,
    authorName: p.player.name,
    editionNo: p.editionNo,
    headlineBn: p.headlineBn,
    headlineEn: p.headlineEn,
    likesCount: p.likesCount,
    createdAt: p.createdAt,
    data: JSON.parse(p.newspaperJson),
  }));

  res.json({
    success: true,
    newspapers,
  });
}

export async function publishNewspaper(req: AuthenticatedRequest, res: Response): Promise<void> {
  const player = req.player;
  const body = PublishNewspaperSchema.parse(req.body);

  const entry = await prisma.publishedNewspaper.create({
    data: {
      playerId: player.id,
      editionNo: body.editionNo,
      headlineBn: body.headlineBn,
      headlineEn: body.headlineEn,
      newspaperJson: body.newspaperJson,
    },
  });

  res.json({
    success: true,
    id: entry.id,
    message: 'Newspaper published to Sylhet Community Newsstand!',
  });
}
