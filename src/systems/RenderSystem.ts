import type Phaser from 'phaser';
import type { System } from '../core/ECS/System';
import type { World } from '../core/ECS/World';
import { Collider } from '../core/components/Collider';
import { Origin } from '../core/components/Origin';
import { Render } from '../core/components/Render';
import { Spine } from '../core/components/Spine';
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
      const spine = entity.get(Spine);
      const origin = entity.get(Origin) ?? new Origin();
      const collider = entity.get(Collider);
      if (!render && sprite && this.scene) {
        const object = this.scene.add.sprite(
          transform?.x ?? 0,
          transform?.y ?? 0,
          sprite.key,
          sprite.frame
        );
        object.setOrigin(origin.x, origin.y);
        if (sprite.animation) {
          object.play(sprite.animation);
        }
        render = new Render({ object });
        entity.add(Render, render);
        this.resizeColliderFromObject(collider, object);
      } else if (!render && spine && this.scene) {
        const spineAdd = (this.scene.add as unknown as { spine?: Function }).spine;
        try {
          if (typeof spineAdd === 'function') {
            const object = spineAdd.call(
              this.scene.add,
              (transform?.x ?? 0) + spine.offsetX,
              (transform?.y ?? 0) + spine.offsetY,
              spine.key,
              spine.atlasKey
            );
            if (object?.setOrigin) {
              object.setOrigin(origin.x, origin.y);
            }
            if (object?.setScale) {
              object.setScale(spine.scale);
            }
            if (spine.animation) {
              if (object?.setAnimation) {
                object.setAnimation(0, spine.animation, spine.loop);
              } else if (object?.animationState?.setAnimation) {
                object.animationState.setAnimation(0, spine.animation, spine.loop);
              }
              this.scene.time.delayedCall(0, () => {
                if (object?.setAnimation) {
                  object.setAnimation(0, spine.animation, spine.loop);
                } else if (object?.animationState?.setAnimation) {
                  object.animationState.setAnimation(0, spine.animation, spine.loop);
                }
              });
            }
            render = new Render({ object });
            entity.add(Render, render);
            this.resizeColliderFromObject(collider, object);
          } else {
            console.warn(
              'Spine plugin not available on scene.add.spine, using fallback rect:',
              spine.key
            );
          }
        } catch (error) {
          console.warn('Spine add failed, using fallback rect:', error);
        }
        if (!render && this.scene) {
          const size = 100;
          const object = this.scene.add.rectangle(
            transform?.x ?? 0,
            transform?.y ?? 0,
            size,
            size,
            0xaa4444
          );
          object.setOrigin(origin.x, origin.y);
          render = new Render({ object });
          entity.add(Render, render);
          this.resizeColliderFromObject(collider, object);
        }
      }
      if (!transform || !render) {
        continue;
      }
      const object = render.object;
      const spineData = entity.get(Spine);
      if ('x' in object) {
        object.x = transform.x + (spineData?.offsetX ?? 0);
      }
      if ('y' in object) {
        object.y = transform.y + (spineData?.offsetY ?? 0);
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
      if (collider && collider.autoSize) {
        this.resizeColliderFromObject(collider, object);
      }
    }
  }

  private resizeColliderFromObject(
    collider: Collider | undefined,
    object: Phaser.GameObjects.GameObject
  ): void {
    if (!collider || !collider.autoSize) {
      return;
    }
    const bounds = (object as Phaser.GameObjects.GameObject & {
      getBounds?: () => Phaser.Geom.Rectangle;
    }).getBounds?.();
    if (bounds) {
      collider.bounds.width = bounds.width;
      collider.bounds.height = bounds.height;
      collider.baseWidth = bounds.width;
      collider.baseHeight = bounds.height;
      return;
    }
    const displayObject = object as Phaser.GameObjects.GameObject & {
      displayWidth?: number;
      displayHeight?: number;
    };
    if (typeof displayObject.displayWidth === 'number') {
      collider.bounds.width = displayObject.displayWidth;
      collider.baseWidth = displayObject.displayWidth;
    }
    if (typeof displayObject.displayHeight === 'number') {
      collider.bounds.height = displayObject.displayHeight;
      collider.baseHeight = displayObject.displayHeight;
    }
  }
}
