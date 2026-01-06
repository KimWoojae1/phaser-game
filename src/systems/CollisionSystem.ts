import type { System } from '../core/ECS/System';
import type { World } from '../core/ECS/World';
import type { Entity } from '../core/ECS/Entity';
import { Collider } from '../core/components/Collider';
import { intersects } from '../core/physics/Collision';
import type { Broadphase } from '../core/physics/Broadphase';

export class CollisionSystem implements System {
  id = 'collision';
  level: 'debug' | 'info' | 'warn' | 'error' = 'debug';
  private broadphase: Broadphase | null = null;
  private time = {
    now: 0,
    frame: 0,
    dt: 0,
  };
  private lastPairs = new Set<string>();

  update(world: World, dt: number): void {
    const entities = Array.from(world.getEntities()).filter((entity) => {
      return entity.active && entity.has(Collider);
    });

    const currentPairs = new Set<string>();
    const pairs = this.broadphase
      ? this.broadphase.getPairs(entities)
      : this.getAllPairs(entities);
    for (const [entityA, entityB] of pairs) {
      const a = entityA.get(Collider);
      const bCollider = entityB.get(Collider);
      if (!a || !bCollider) {
        continue;
      }
      if (intersects(a.bounds, bCollider.bounds)) {
        const pairId = this.getPairId(entityA, entityB);
        currentPairs.add(pairId);
        if (!this.lastPairs.has(pairId)) {
          world.getEvents().emit('collisionStart', {
            source: 'CollisionSystem',
            sourceId: this.id,
            level: this.level,
            a: entityA,
            b: entityB,
          });
        } else {
          world.getEvents().emit('collisionStay', {
            source: 'CollisionSystem',
            sourceId: this.id,
            level: this.level,
            a: entityA,
            b: entityB,
          });
        }
        const overlapX =
          Math.min(
            a.bounds.x + a.bounds.width,
            bCollider.bounds.x + bCollider.bounds.width
          ) - Math.max(a.bounds.x, bCollider.bounds.x);
        const overlapY =
          Math.min(
            a.bounds.y + a.bounds.height,
            bCollider.bounds.y + bCollider.bounds.height
          ) - Math.max(a.bounds.y, bCollider.bounds.y);
        const centerAX = a.bounds.x + a.bounds.width / 2;
        const centerAY = a.bounds.y + a.bounds.height / 2;
        const centerBX = bCollider.bounds.x + bCollider.bounds.width / 2;
        const centerBY = bCollider.bounds.y + bCollider.bounds.height / 2;
        const dx = centerAX - centerBX;
        const dy = centerAY - centerBY;
        const normal =
          overlapX < overlapY
            ? { x: dx >= 0 ? 1 : -1, y: 0 }
            : { x: 0, y: dy >= 0 ? 1 : -1 };
        world.getEvents().emit('collision', {
          source: 'CollisionSystem',
          sourceId: this.id,
          level: this.level,
          a: entityA,
          b: entityB,
          aCollider: a,
          bCollider: bCollider,
          overlap: {
            x: overlapX,
            y: overlapY,
          },
          normal,
          time: this.time.now,
          frame: this.time.frame,
          dt,
        });
      }
    }
    for (const pairId of this.lastPairs) {
      if (!currentPairs.has(pairId)) {
        const [aId, bId] = pairId.split('|').map((v) => Number(v));
        const entityA = entities.find((e) => e.id === aId);
        const entityB = entities.find((e) => e.id === bId);
        if (entityA && entityB) {
          world.getEvents().emit('collisionEnd', {
            source: 'CollisionSystem',
            sourceId: this.id,
            level: this.level,
            a: entityA,
            b: entityB,
          });
        }
      }
    }
    this.lastPairs = currentPairs;
  }

  setTimeSource(time: { now: number; frame: number; dt: number }): void {
    this.time = time;
  }

  setEventLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {
    this.level = level;
  }

  setBroadphase(broadphase: Broadphase): void {
    this.broadphase = broadphase;
  }

  private getAllPairs(entities: Entity[]): Array<[Entity, Entity]> {
    const pairs: Array<[Entity, Entity]> = [];
    for (let i = 0; i < entities.length; i += 1) {
      for (let j = i + 1; j < entities.length; j += 1) {
        pairs.push([entities[i], entities[j]]);
      }
    }
    return pairs;
  }

  private getPairId(a: Entity, b: Entity): string {
    const aId = a.id ?? 0;
    const bId = b.id ?? 0;
    return aId < bId ? `${aId}|${bId}` : `${bId}|${aId}`;
  }
}
