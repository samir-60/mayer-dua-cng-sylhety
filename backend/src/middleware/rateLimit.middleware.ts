import { Request, Response, NextFunction } from 'express';

const ipHits = new Map<string, { count: number; resetAt: number }>();

export function rateLimiter(limit: number = 100, windowMs: number = 60000) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    const record = ipHits.get(ip);
    if (!record || now > record.resetAt) {
      ipHits.set(ip, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    record.count++;
    if (record.count > limit) {
      res.status(429).json({
        success: false,
        error: 'Too many requests. Mama, slow down your CNG!',
      });
      return;
    }

    next();
  };
}
