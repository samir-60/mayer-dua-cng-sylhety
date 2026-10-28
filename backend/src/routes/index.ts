import { Router } from 'express';
import { createOrResumeGuestSession, getPlayerMe } from '../controllers/guest.controller';
import { getMissions, startMission, completeMission } from '../controllers/mission.controller';
import { getGarage, purchaseItem, equipItem } from '../controllers/garage.controller';
import { getLeaderboard } from '../controllers/leaderboard.controller';
import { getNewspaperHistory, getCommunityNewspapers, publishNewspaper } from '../controllers/newspaper.controller';
import { requireGuestAuth } from '../middleware/auth.middleware';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    game: 'MAYER DUA: FUNNY SYLHETI CNG SIMULATOR',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Guest Session & Profile
router.post('/guest-session', createOrResumeGuestSession);
router.get('/player/me', requireGuestAuth, getPlayerMe);

// Missions
router.get('/missions', requireGuestAuth, getMissions);
router.post('/missions/:id/start', requireGuestAuth, startMission);
router.post('/missions/:id/complete', requireGuestAuth, completeMission);

// Garage
router.get('/garage', requireGuestAuth, getGarage);
router.post('/garage/purchase', requireGuestAuth, purchaseItem);
router.post('/garage/equip', requireGuestAuth, equipItem);

// Leaderboard
router.get('/leaderboard', getLeaderboard);

// Newspaper & History
router.get('/newspaper/history', requireGuestAuth, getNewspaperHistory);
router.get('/newspaper/community', requireGuestAuth, getCommunityNewspapers);
router.post('/newspaper/publish', requireGuestAuth, publishNewspaper);

export default router;
