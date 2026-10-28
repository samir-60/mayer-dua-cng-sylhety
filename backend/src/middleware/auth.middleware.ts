import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';

export interface AuthenticatedRequest extends Request {
  player?: any;
  guestSession?: any;
}

export async function requireGuestAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Missing or malformed Authorization header. Provide Bearer guest token.',
      });
      return;
    }

    const token = authHeader.substring(7).trim();
    if (!token) {
      res.status(401).json({ success: false, error: 'Empty session token' });
      return;
    }

    const session = await prisma.guestSession.findUnique({
      where: { token },
      include: {
        player: {
          include: {
            progress: true,
            items: {
              include: { garageItem: true },
            },
          },
        },
      },
    });

    if (!session || new Date() > session.expiresAt) {
      res.status(401).json({
        success: false,
        error: 'Session expired or invalid. Please re-authenticate as guest.',
      });
      return;
    }

    // Refresh lastActiveAt asynchronously
    prisma.guestSession.update({
      where: { id: session.id },
      data: { lastActiveAt: new Date() },
    }).catch(() => {});

    req.guestSession = session;
    req.player = session.player;
    next();
  } catch (err) {
    next(err);
  }
}
