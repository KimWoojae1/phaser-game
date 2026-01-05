import type Phaser from 'phaser';
import { Entity } from '../core/ECS/Entity';
import { Collider } from '../core/components/Collider';
import { Render } from '../core/components/Render';
import { Transform } from '../core/components/Transform';
import { Velocity } from '../core/components/Velocity';

export function createTestPlayer(scene: Phaser.Scene, x = 100, y = 100): Entity {
  const entity = new Entity().add(Transform, {
    x,
    y,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
  });
  const rect = scene.add.rectangle(x, y, 32, 32, 0x22aa88);
  entity.add(Render, {
    object: rect,
  });
  entity.add(Collider, {
    bounds: {
      x,
      y,
      width: 32,
      height: 32,
    },
  });
  entity.add(Velocity, {
    vx: 40,
    vy: 0,
  });
  return entity;
}

export function createWall(scene: Phaser.Scene, x: number, y: number): Entity {
  const entity = new Entity().add(Transform, {
    x,
    y,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
  });
  const rect = scene.add.rectangle(x, y, 48, 48, 0x555555);
  entity.add(Render, {
    object: rect,
  });
  entity.add(Collider, {
    bounds: {
      x,
      y,
      width: 48,
      height: 48,
    },
  });
  return entity;
}
