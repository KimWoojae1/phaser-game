import { Entity } from '../core/ECS/Entity';
import { Collider } from '../core/components/Collider';
import { Origin } from '../core/components/Origin';
import { Spine } from '../core/components/Spine';
import { Sprite } from '../core/components/Sprite';
import { Tag } from '../core/components/Tag';
import { Transform } from '../core/components/Transform';

type EnemyRender =
  | { render: 'sprite'; key: string }
  | {
      render: 'spine';
      key: string;
      animation?: string;
      loop?: boolean;
      atlasKey?: string;
      spineScale?: number;
      spineOffsetX?: number;
      spineOffsetY?: number;
    };

type EnemyOptions = EnemyRender & {
  x: number;
  y: number;
  size?: number;
  scale?: number;
  collider?: { width: number; height: number };
  origin?: { x: number; y: number };
};

export class Enemy extends Entity {
  constructor(options: EnemyOptions) {
    super();
    const size = options.size ?? 32;
    const colliderSize = options.collider ?? { width: size, height: size };
    const autoSize = options.collider ? false : true;
    const origin = new Origin(options.origin);
    this.add(
      Transform,
      new Transform({
        x: options.x,
        y: options.y,
        rotation: 0,
        scaleX: options.scale ?? 1,
        scaleY: options.scale ?? 1,
      })
    );
    if (options.render === 'sprite') {
      this.add(Sprite, new Sprite({ key: options.key }));
    } else {
      this.add(
        Spine,
        new Spine({
          key: options.key,
          atlasKey: options.atlasKey,
          animation: options.animation,
          loop: options.loop,
          scale: options.spineScale,
          offsetX: options.spineOffsetX,
          offsetY: options.spineOffsetY,
        })
      );
    }
    this.add(Origin, origin);
    this.add(
      Tag,
      new Tag({
        value: 'Enemy',
        collidesWith: ['Player'],
      })
    );
    this.add(
      Collider,
      new Collider({
        bounds: {
          x: options.x - colliderSize.width * origin.x,
          y: options.y - colliderSize.height * origin.y,
          width: colliderSize.width,
          height: colliderSize.height,
        },
        autoSize,
      })
    );
  }
}
