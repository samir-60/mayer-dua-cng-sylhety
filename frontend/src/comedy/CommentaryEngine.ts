import { ComedyEventType, ComedyComment } from '@shared/types';
import { comedyEventBus, ComedyEventPayload } from './ComedyEventBus';
import { soundService } from '../services/sound.service';
import dialogueJson from './sylhetiDialogue.json';

const COOLDOWNS_MS: Record<ComedyEventType, number> = {
  HORN_SPAM: 5000,
  SLOW_DRIVING: 8000,
  SPEEDING: 6000,
  WRONG_ROUTE: 10000,
  LOW_FUEL: 12000,
  PASSENGER_BARGAIN: 4000,
  PASSENGER_PICKUP: 3000,
  MISSION_SUCCESS: 1000,
  MISSION_FAIL: 1000,
  GOAT_BLOCKING: 6000,
  CHICKEN_PANIC: 5000,
  CNG_BOUNCE: 4000,
  RAIN_START: 15000,
  MOTHER_CALL: 20000,
  TEA_BREAK: 15000,
  VEHICLE_STUCK: 7000,
  DESTINATION_REACHED: 2000,
  POTHOLE_HIT: 3500,
  TRAFFIC_JAM: 9000,
  NEAR_MISS: 4500,
};

const PRIORITY_LEVELS: Record<ComedyEventType, number> = {
  MISSION_SUCCESS: 10,
  MISSION_FAIL: 10,
  MOTHER_CALL: 9,
  PASSENGER_PICKUP: 8,
  DESTINATION_REACHED: 8,
  GOAT_BLOCKING: 7,
  CHICKEN_PANIC: 7,
  NEAR_MISS: 6,
  POTHOLE_HIT: 5,
  CNG_BOUNCE: 5,
  SPEEDING: 4,
  WRONG_ROUTE: 4,
  HORN_SPAM: 3,
  SLOW_DRIVING: 3,
  LOW_FUEL: 3,
  TEA_BREAK: 3,
  PASSENGER_BARGAIN: 3,
  RAIN_START: 2,
  VEHICLE_STUCK: 2,
  TRAFFIC_JAM: 2,
};

class CommentaryEngine {
  private lastTriggeredTimes: Map<ComedyEventType, number> = new Map();
  private lastJokeIdPerEvent: Map<ComedyEventType, string> = new Map();
  private onCommentCallback: ((comment: ComedyComment) => void) | null = null;
  private currentActivePriority: number = 0;
  private clearTimer: any = null;

  constructor() {
    this.init();
  }

  private init() {
    comedyEventBus.on('*', (payload: ComedyEventPayload) => {
      this.handleEvent(payload);
    });
  }

  public registerCommentCallback(callback: (comment: ComedyComment) => void) {
    this.onCommentCallback = callback;
  }

  private handleEvent(payload: ComedyEventPayload) {
    const type = payload.type;
    const now = Date.now();

    // Check cooldown
    const cooldown = COOLDOWNS_MS[type] || 5000;
    const lastTime = this.lastTriggeredTimes.get(type) || 0;
    if (now - lastTime < cooldown) {
      return; // Suppressed by cooldown
    }

    const priority = PRIORITY_LEVELS[type] || 1;
    // If a higher priority dialogue is actively displaying, don't interrupt unless priority is >=
    if (this.currentActivePriority > priority) {
      return;
    }

    // Fetch dialogues for event
    const pool = (dialogueJson.dialogues as Record<string, any[]>)[type];
    if (!pool || pool.length === 0) return;

    // Filter out consecutively repeated joke
    const lastId = this.lastJokeIdPerEvent.get(type);
    const eligible = pool.filter((d) => d.id !== lastId);
    const candidate = eligible.length > 0 ? eligible[Math.floor(Math.random() * eligible.length)] : pool[0];

    // Update state
    this.lastTriggeredTimes.set(type, now);
    this.lastJokeIdPerEvent.set(type, candidate.id);
    this.currentActivePriority = priority;

    const comment: ComedyComment = {
      id: candidate.id,
      speakerBn: candidate.speakerBn,
      speakerEn: candidate.speakerEn,
      avatar: candidate.avatar,
      textBn: candidate.textBn,
      textEn: candidate.textEn,
      priority,
    };

    // Play situational sound effects
    if (type === 'GOAT_BLOCKING') {
      soundService.playGoatBleat();
    } else if (type === 'HORN_SPAM' || type === 'TRAFFIC_JAM') {
      soundService.playPoliceWhistle();
    } else if (type === 'SPEEDING') {
      soundService.playExhaustPop();
    } else if (type === 'TEA_BREAK') {
      soundService.playRickshawBell();
    }

    // Real-Time Funny Sylheti Voice Audio Generation!
    soundService.speakSylheti(candidate.textBn, candidate.speakerBn, priority >= 8);

    if (this.onCommentCallback) {
      this.onCommentCallback(comment);
    }

    // Reset active priority after 4.5 seconds
    if (this.clearTimer) clearTimeout(this.clearTimer);
    this.clearTimer = setTimeout(() => {
      this.currentActivePriority = 0;
    }, 4500);
  }
}

export const commentaryEngine = new CommentaryEngine();
