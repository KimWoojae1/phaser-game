import type { System } from '../core/ECS/System';
import type { World } from '../core/ECS/World';
import { Render } from '../core/components/Render';
import { Transform } from '../core/components/Transform';

export class RenderSystem implements System {
  update(world: World, _dt: number): void {
    for (const entity of world.getEntities()) {
      if (!entity.active) {
        continue;
      }
      const transform = entity.get(Transform);
      const render = entity.get(Render);
      if (!transform || !render) {
        continue;
      }
      const object = render.object;
      if ('x' in object) {
        object.x = transform.x;
      }
      if ('y' in object) {
        object.y = transform.y;
      }
      if ('rotation' in object) {
        object.rotation = transform.rotation;
      }
      if ('scaleX' in object) {
        object.scaleX = transform.scaleX;
      }
      if ('scaleY' in object) {
        object.scaleY = transform.scaleY;
      }
    }
  }
}
