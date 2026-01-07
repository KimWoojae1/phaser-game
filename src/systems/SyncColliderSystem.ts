import type { System } from '../core/ECS/System';
import type { World } from '../core/ECS/World';
import { Collider } from '../core/components/Collider';
import { Origin } from '../core/components/Origin';
import { Transform } from '../core/components/Transform';
import { syncColliderToTransform } from '../core/physics/syncCollider';

export class SyncColliderSystem implements System {
  update(world: World, _dt: number): void {
    for (const entity of world.getEntities()) {
      if (!entity.active) {
        continue;
      }
      const transform = entity.get(Transform);
      const collider = entity.get(Collider);
      const origin = entity.get(Origin);
      if (!transform || !collider) {
        continue;
      }
      syncColliderToTransform(transform, collider, origin);
    }
  }
}
