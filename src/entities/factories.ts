import type Phaser from 'phaser';
import { Entity } from '../core/ECS/Entity';
import { Collider } from '../core/components/Collider';
import { Interactable } from '../core/components/Interactable';
import { Render } from '../core/components/Render';
import { Sprite } from '../core/components/Sprite';
import { Tag } from '../core/components/Tag';
import { Transform } from '../core/components/Transform';
import { Velocity } from '../core/components/Velocity';

export function createTestPlayer(
  x = 100,
  y = 100,
  spriteKey = 'player'
): Entity {
  const entity = new Entity().add(
    Transform,
    new Transform({
      x,
      y,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    })
  );
  entity.add(Sprite, new Sprite({ key: spriteKey }));
  entity.add(Tag, new Tag({ value: 'player' }));
  entity.add(
    Collider,
    new Collider({
      bounds: {
        x: x - 16,
        y: y - 16,
        width: 32,
        height: 32,
      },
    })
  );
  entity.add(Velocity, new Velocity({ vx: 40, vy: 0 }));
  return entity;
}

export function createWall(
  scene: Phaser.Scene,
  x: number,
  y: number,
  size = 48,
  color = 0x555555,
  solid = true
): Entity {
  const entity = new Entity().add(
    Transform,
    new Transform({
      x,
      y,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    })
  );
  const rect = scene.add.rectangle(x, y, size, size, color);
  entity.add(Render, new Render({ object: rect }));
  entity.add(Tag, new Tag({ value: 'wall', solid }));
  entity.add(
    Collider,
    new Collider({
      bounds: {
        x: x - size / 2,
        y: y - size / 2,
        width: size,
        height: size,
      },
    })
  );
  return entity;
}

export function createNpc(
  scene: Phaser.Scene,
  x: number,
  y: number,
  size = 32,
  color = 0x3366aa
): Entity {
  const entity = new Entity().add(
    Transform,
    new Transform({
      x,
      y,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    })
  );
  const rect = scene.add.rectangle(x, y, size, size, color);
  entity.add(Render, new Render({ object: rect }));
  entity.add(Tag, new Tag({ value: 'npc' }));
  entity.add(Interactable, new Interactable({ action: 'talk' }));
  return entity;
}

export function createItem(
  scene: Phaser.Scene,
  x: number,
  y: number,
  size = 24,
  color = 0xffcc33
): Entity {
  const entity = new Entity().add(
    Transform,
    new Transform({
      x,
      y,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    })
  );
  const rect = scene.add.rectangle(x, y, size, size, color);
  entity.add(Render, new Render({ object: rect }));
  entity.add(Tag, new Tag({ value: 'item' }));
  entity.add(Interactable, new Interactable({ action: 'pickup' }));
  return entity;
}

export function createTrigger(
  scene: Phaser.Scene,
  x: number,
  y: number,
  size = 40,
  color = 0xaa33aa
): Entity {
  const entity = new Entity().add(
    Transform,
    new Transform({
      x,
      y,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    })
  );
  const rect = scene.add.rectangle(x, y, size, size, color);
  entity.add(Render, new Render({ object: rect }));
  entity.add(Tag, new Tag({ value: 'trigger', solid: false }));
  entity.add(
    Collider,
    new Collider({
      bounds: {
        x: x - size / 2,
        y: y - size / 2,
        width: size,
        height: size,
      },
    })
  );
  return entity;
}
