import type Phaser from 'phaser';
import type { System } from '../core/ECS/System';
import type { World } from '../core/ECS/World';
import { Render } from '../core/components/Render';
import { Tag } from '../core/components/Tag';

export class CameraSystem implements System {
  private scene: Phaser.Scene | null = null;
  private following = false;

  setScene(scene: Phaser.Scene | null): void {
    this.scene = scene;
  }

  update(world: World, _dt: number): void {
    if (!this.scene) {
      return;
    }
    const camera = this.scene.cameras.main;
    const settings = world.getServices().world;
    camera.setBounds(0, 0, settings.width, settings.height);
    camera.setZoom(settings.zoom);

    if (this.following) {
      return;
    }

    for (const entity of world.getEntities()) {
      const tag = entity.get(Tag);
      const render = entity.get(Render);
      if (tag?.value === 'player' && render?.object) {
        camera.startFollow(render.object as Phaser.GameObjects.GameObject);
        this.following = true;
        break;
      }
    }
  }
}
