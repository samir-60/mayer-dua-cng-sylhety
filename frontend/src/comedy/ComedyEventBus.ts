import { ComedyEventType } from '@shared/types';

export interface ComedyEventPayload {
  type: ComedyEventType;
  data?: any;
  timestamp: number;
}

type EventListener = (payload: ComedyEventPayload) => void;

class ComedyEventBus {
  private listeners: Map<string, Set<EventListener>> = new Map();

  on(event: ComedyEventType | '*', listener: EventListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    return () => this.off(event, listener);
  }

  off(event: ComedyEventType | '*', listener: EventListener): void {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(listener);
      if (set.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  emit(type: ComedyEventType, data?: any): void {
    const payload: ComedyEventPayload = {
      type,
      data,
      timestamp: Date.now(),
    };

    // Specific listeners
    const specific = this.listeners.get(type);
    if (specific) {
      specific.forEach((listener) => {
        try {
          listener(payload);
        } catch (e) {
          console.error('[ComedyEventBus Error]:', e);
        }
      });
    }

    // Wildcard listeners
    const wildcard = this.listeners.get('*');
    if (wildcard) {
      wildcard.forEach((listener) => {
        try {
          listener(payload);
        } catch (e) {
          console.error('[ComedyEventBus Wildcard Error]:', e);
        }
      });
    }
  }
}

export const comedyEventBus = new ComedyEventBus();
