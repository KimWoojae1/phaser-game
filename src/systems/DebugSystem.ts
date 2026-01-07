import type Phaser from 'phaser';
import type { System } from '../core/ECS/System';
import type { World } from '../core/ECS/World';
import { Collider } from '../core/components/Collider';

export class DebugSystem implements System {
  private scene: Phaser.Scene | null = null;
  private graphics: Phaser.GameObjects.Graphics | null = null;

  setScene(scene: Phaser.Scene | null): void {
    this.scene = scene;
  }

  update(world: World, _dt: number): void {
    if (!this.scene) {
      return;
    }
    if (!this.graphics) {
      this.graphics = this.scene.add.graphics();
      this.graphics.setDepth(9999);
    }
    const debug = world.getServices().debug;
    this.graphics.clear();
    if (!debug.showColliders) {
      if (!debug.showCenters) {
        return;
      }
    }
    for (const entity of world.getEntities()) {
      const collider = entity.get(Collider);
      if (!collider) {
        continue;
      }
      const b = collider.bounds;
      if (debug.showColliders) {
        this.graphics.lineStyle(1, 0x00ffcc, 0.6);
        this.graphics.strokeRect(b.x, b.y, b.width, b.height);
      }
      if (debug.showCenters) {
        const cx = b.x + b.width / 2;
        const cy = b.y + b.height / 2;
        this.graphics.lineStyle(1, 0xffcc00, 0.8);
        this.graphics.lineBetween(cx - 3, cy, cx + 3, cy);
        this.graphics.lineBetween(cx, cy - 3, cx, cy + 3);
      }
    }
  }
}
