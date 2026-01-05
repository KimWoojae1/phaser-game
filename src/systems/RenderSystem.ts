import type Phaser from 'phaser';
import type { System } from '../core/ECS/System';
import type { World } from '../core/ECS/World';
import { Render } from '../core/components/Render';
import { Sprite } from '../core/components/Sprite';
import { Transform } from '../core/components/Transform';

export class RenderSystem implements System {
  private scene: Phaser.Scene | null = null;

  setScene(scene: Phaser.Scene | null): void {
    this.scene = scene;
  }

  update(world: World, _dt: number): void {
    for (const entity of world.getEntities()) {
      if (!entity.active) {
        continue;
      }
      const transform = entity.get(Transform);
      let render = entity.get(Render);
      const sprite = entity.get(Sprite);
      if (!render && sprite && this.scene) {
        const object = this.scene.add.sprite(
          transform?.x ?? 0,
          transform?.y ?? 0,
          sprite.key,
          sprite.frame
        );
        if (sprite.animation) {
          object.play(sprite.animation);
        }
        render = new Render({ object });
        entity.add(Render, render);
      }
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
