import type { System } from '../core/ECS/System';
import type { World } from '../core/ECS/World';
import { MoveConfig } from '../core/components/MoveConfig';
import { Tag } from '../core/components/Tag';
import { Velocity } from '../core/components/Velocity';

export class PlayerControlSystem implements System {
  private dashUntil = 0;
  private dashCooldownUntil = 0;

  update(world: World, _dt: number): void {
    const input = world.getServices().input.states;
    const time = world.getServices().time;
    const settings = world.getServices().movement;
    const left = input.get('left') ? 1 : 0;
    const right = input.get('right') ? 1 : 0;
    const up = input.get('up') ? 1 : 0;
    const down = input.get('down') ? 1 : 0;
    let vx = right - left;
    let vy = down - up;
    if (vx !== 0 && vy !== 0) {
      const inv = 1 / Math.sqrt(2);
      vx *= inv;
      vy *= inv;
    }
    const wantsDash = input.get('dash') === true;
    const base = settings;
    const speed = base.maxSpeed;
    const accel = base.accel;
    const decel = base.decel;
    if (wantsDash && time.now >= this.dashCooldownUntil) {
      this.dashUntil = time.now + base.dashDurationMs;
      this.dashCooldownUntil = time.now + base.dashCooldownMs;
    }
    const dashActive = time.now <= this.dashUntil;
    const speedScale = dashActive ? base.dashMultiplier : 1;
    for (const entity of world.getEntities()) {
      const tag = entity.get(Tag);
      const velocity = entity.get(Velocity);
      const config = entity.get(MoveConfig);
      if (!tag || !velocity || tag.value !== 'player') {
        continue;
      }
      const maxSpeed = (config?.maxSpeed ?? speed) * speedScale;
      const targetX = vx * maxSpeed;
      const targetY = vy * maxSpeed;
      const ax = vx !== 0 ? config?.accel ?? accel : config?.decel ?? decel;
      const ay = vy !== 0 ? config?.accel ?? accel : config?.decel ?? decel;
      const step = time.dt;
      velocity.vx = approach(velocity.vx, targetX, ax * step);
      velocity.vy = approach(velocity.vy, targetY, ay * step);
    }
  }
}

function approach(current: number, target: number, maxDelta: number): number {
  if (current < target) {
    return Math.min(current + maxDelta, target);
  }
  if (current > target) {
    return Math.max(current - maxDelta, target);
  }
  return target;
}
