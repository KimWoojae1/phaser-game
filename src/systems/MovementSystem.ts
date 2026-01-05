import type { System } from '../core/ECS/System';
import type { World } from '../core/ECS/World';
import { Transform } from '../core/components/Transform';
import { Velocity } from '../core/components/Velocity';

export class MovementSystem implements System {
  private time = {
    now: 0,
    frame: 0,
    dt: 0,
  };

  update(world: World, dt: number): void {
    for (const entity of world.getEntities()) {
      if (!entity.active) {
        continue;
      }
      const transform = entity.get(Transform);
      const velocity = entity.get(Velocity);
      if (!transform || !velocity) {
        continue;
      }
      const speedScale = world.getServices().dataStore.get('speedScale');
      const scale = typeof speedScale === 'number' ? speedScale : 1;
      transform.x += velocity.vx * dt * scale;
      transform.y += velocity.vy * dt * scale;
    }
  }

  setTimeSource(time: { now: number; frame: number; dt: number }): void {
    this.time = time;
  }
}
