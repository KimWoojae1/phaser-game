import type { System } from '../core/ECS/System';
import type { World } from '../core/ECS/World';
import { Collider } from '../core/components/Collider';
import { Tag } from '../core/components/Tag';
import { Transform } from '../core/components/Transform';
import { Velocity } from '../core/components/Velocity';
import { intersects } from '../core/physics/Collision';

export class CollisionResponseSystem implements System {
  update(world: World, _dt: number): void {
    const iterations = world.getServices().collision.resolveIterations;
    const players = [];
    const walls = [];
    for (const entity of world.getEntities()) {
      const tag = entity.get(Tag);
      if (!tag) {
        continue;
      }
      if (tag.value === 'player') {
        players.push(entity);
      }
      if (tag.value === 'wall' && tag.solid !== false) {
        walls.push(entity);
      }
    }
    for (let pass = 0; pass < iterations; pass += 1) {
      let resolvedAny = false;
      for (const player of players) {
        const pCollider = player.get(Collider);
        const pTransform = player.get(Transform);
        const pVelocity = player.get(Velocity);
        if (!pCollider || !pTransform) {
          continue;
        }
        for (const wall of walls) {
          const wCollider = wall.get(Collider);
          if (!wCollider) {
            continue;
          }
          if (!intersects(pCollider.bounds, wCollider.bounds)) {
            continue;
          }
          const overlapX =
            Math.min(
              pCollider.bounds.x + pCollider.bounds.width,
              wCollider.bounds.x + wCollider.bounds.width
            ) - Math.max(pCollider.bounds.x, wCollider.bounds.x);
          const overlapY =
            Math.min(
              pCollider.bounds.y + pCollider.bounds.height,
              wCollider.bounds.y + wCollider.bounds.height
            ) - Math.max(pCollider.bounds.y, wCollider.bounds.y);
          const centerPX = pCollider.bounds.x + pCollider.bounds.width / 2;
          const centerPY = pCollider.bounds.y + pCollider.bounds.height / 2;
          const centerWX = wCollider.bounds.x + wCollider.bounds.width / 2;
          const centerWY = wCollider.bounds.y + wCollider.bounds.height / 2;
          const dx = centerPX - centerWX;
          const dy = centerPY - centerWY;
          if (overlapX < overlapY) {
            pTransform.x += (dx >= 0 ? 1 : -1) * overlapX;
            if (pVelocity) {
              pVelocity.vx = 0;
            }
          } else {
            pTransform.y += (dy >= 0 ? 1 : -1) * overlapY;
            if (pVelocity) {
              pVelocity.vy = 0;
            }
          }
          pCollider.bounds.x = pTransform.x - pCollider.bounds.width / 2;
          pCollider.bounds.y = pTransform.y - pCollider.bounds.height / 2;
          resolvedAny = true;
        }
      }
      if (!resolvedAny) {
        break;
      }
    }
  }
}
