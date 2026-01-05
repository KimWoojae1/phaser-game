import type { System } from '../core/ECS/System';
import type { World } from '../core/ECS/World';
import { Tag } from '../core/components/Tag';
import { Transform } from '../core/components/Transform';
import { Velocity } from '../core/components/Velocity';

export class CollisionResponseSystem implements System {
  private subscribed = false;

  update(world: World, _dt: number): void {
    if (this.subscribed) {
      return;
    }
    world.getEvents().on(
      'collision',
      (event) => {
        const tagA = event.a.get(Tag);
        const tagB = event.b.get(Tag);
        const aIsPlayer = tagA?.value === 'player';
        const bIsPlayer = tagB?.value === 'player';
        const aIsWall = tagA?.value === 'wall';
        const bIsWall = tagB?.value === 'wall';
        if (!((aIsPlayer && bIsWall) || (bIsPlayer && aIsWall))) {
          return;
        }
        const wallTag = aIsWall ? tagA : tagB;
        if (wallTag && wallTag.solid === false) {
          return;
        }
        const target = aIsPlayer ? event.a : event.b;
        const transform = target.get(Transform);
        if (!transform) {
          return;
        }
        const normal = aIsPlayer
          ? event.normal
          : { x: -event.normal.x, y: -event.normal.y };
        if (Math.abs(normal.x) > 0) {
          transform.x += normal.x * event.overlap.x;
        } else {
          transform.y += normal.y * event.overlap.y;
        }
        const velocity = target.get(Velocity);
        if (velocity) {
          if (Math.abs(normal.x) > 0) {
            velocity.vx = 0;
          } else {
            velocity.vy = 0;
          }
        }
      },
      { level: 'debug' }
    );
    this.subscribed = true;
  }
}
