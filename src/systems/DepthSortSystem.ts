import type { System } from '../core/ECS/System';
import type { World } from '../core/ECS/World';
import { Render } from '../core/components/Render';
import { Transform } from '../core/components/Transform';

export class DepthSortSystem implements System {
  update(world: World, _dt: number): void {
    for (const entity of world.getEntities()) {
      const render = entity.get(Render);
      const transform = entity.get(Transform);
      if (!render || !transform) {
        continue;
      }
      const object = render.object;
      if (object.setDepth) {
        object.setDepth(Math.floor(transform.y));
      }
    }
  }
}
