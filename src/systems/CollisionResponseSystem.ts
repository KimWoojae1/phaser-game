import type { System } from '../core/ECS/System';
import type { World } from '../core/ECS/World';
import { Transform } from '../core/components/Transform';

export class CollisionResponseSystem implements System {
  private subscribed = false;

  update(world: World, _dt: number): void {
    if (this.subscribed) {
      return;
    }
    world.getEvents().on(
      'collision',
      (event) => {
      const transformA = event.a.get(Transform);
      if (!transformA) {
        return;
      }
      transformA.x += event.normal.x * event.overlap.x;
      transformA.y += event.normal.y * event.overlap.y;
      },
      { level: 'debug' }
    );
    this.subscribed = true;
  }
}
