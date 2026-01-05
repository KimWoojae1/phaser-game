import { Entity } from './Entity';
import type { System } from './System';
import { EventBus } from '../events/EventBus';
import { GameServices } from '../GameServices';

type WorldOptions = {
  services?: GameServices;
  eventLevel?: 'debug' | 'info' | 'warn' | 'error';
};

export class World {
  private nextEntityId = 1;
  private entities = new Set<Entity>();
  private systems: System[] = [];
  private events = new EventBus();
  private services: GameServices;

  constructor(options?: WorldOptions) {
    this.services = options?.services ?? new GameServices();
    const level = options?.eventLevel ?? this.services.eventLevel;
    this.events.setMinLevel(level);
  }

  addEntity(entity: Entity): this {
    if (entity.id === null) {
      entity.id = this.nextEntityId;
      this.nextEntityId += 1;
    }
    this.entities.add(entity);
    return this;
  }

  removeEntity(entity: Entity): this {
    this.entities.delete(entity);
    return this;
  }

  addSystem(system: System): this {
    if (system.setTimeSource) {
      system.setTimeSource(this.services.time);
    }
    if (system.setEventLevel) {
      system.setEventLevel(this.services.eventLevel);
    }
    this.systems.push(system);
    return this;
  }

  getEntities(): Iterable<Entity> {
    return this.entities;
  }

  getEvents(): EventBus {
    return this.events;
  }

  getServices(): GameServices {
    return this.services;
  }

  update(dt: number): void {
    for (const system of this.systems) {
      system.update(this, dt);
    }
  }

  clear(): void {
    this.entities.clear();
    this.systems = [];
    this.nextEntityId = 1;
    this.services.stageManager.reset();
  }

  reset(options?: WorldOptions): void {
    this.clear();
    if (options?.services) {
      this.services = options.services;
    }
    if (options?.eventLevel) {
      this.setEventLevel(options.eventLevel);
    }
  }

  setEventLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {
    this.services.eventLevel = level;
    this.events.setMinLevel(level);
    for (const system of this.systems) {
      if (system.setEventLevel) {
        system.setEventLevel(level);
      }
    }
  }
}
