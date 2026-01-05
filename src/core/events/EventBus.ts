import type { Entity } from '../ECS/Entity';
import type { Collider } from '../components/Collider';

type Handler<T> = (payload: T) => void;

export type EventsMap = {
  collision: {
    source: string;
    sourceId: string;
    level: 'debug' | 'info' | 'warn' | 'error';
    a: Entity;
    b: Entity;
    aCollider: Collider;
    bCollider: Collider;
    overlap: {
      x: number;
      y: number;
    };
    normal: {
      x: number;
      y: number;
    };
    time: number;
    frame: number;
    dt: number;
  };
};

const levelOrder = ['debug', 'info', 'warn', 'error'] as const;
type EventLevel = (typeof levelOrder)[number];

export class EventBus {
  private handlers = new Map<keyof EventsMap, Set<Handler<unknown>>>();
  private minLevel: EventLevel = 'debug';

  setMinLevel(level: EventLevel): void {
    this.minLevel = level;
  }

  on<K extends keyof EventsMap>(
    eventName: K,
    handler: Handler<EventsMap[K]>,
    options?: { level?: EventLevel }
  ): () => void {
    const set = this.handlers.get(eventName) ?? new Set();
    const wrapped = options?.level
      ? ((payload: EventsMap[K]) => {
          if (payload.level === options.level) {
            handler(payload);
          }
        }) as Handler<unknown>
      : (handler as Handler<unknown>);
    set.add(wrapped);
    this.handlers.set(eventName, set);
    return () => {
      set.delete(wrapped);
    };
  }

  onWithLevel<K extends keyof EventsMap>(
    eventName: K,
    level: EventLevel,
    handler: Handler<EventsMap[K]>
  ): () => void {
    return this.on(eventName, (payload) => {
      if (payload.level === level) {
        handler(payload);
      }
    });
  }

  emit<K extends keyof EventsMap>(eventName: K, payload: EventsMap[K]): void {
    const incomingLevel = (payload as { level?: EventLevel }).level;
    if (incomingLevel) {
      const incomingIndex = levelOrder.indexOf(incomingLevel);
      const minIndex = levelOrder.indexOf(this.minLevel);
      if (incomingIndex < minIndex) {
        return;
      }
    }
    const set = this.handlers.get(eventName);
    if (!set) {
      return;
    }
    for (const handler of set) {
      (handler as Handler<EventsMap[K]>)(payload);
    }
  }
}
