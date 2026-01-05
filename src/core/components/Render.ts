import type Phaser from 'phaser';

export class Render {
  object: Phaser.GameObjects.GameObject;

  constructor(init: { object: Phaser.GameObjects.GameObject }) {
    this.object = init.object;
  }
}
