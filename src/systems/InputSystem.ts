import type Phaser from 'phaser';
import type { System } from '../core/ECS/System';
import type { World } from '../core/ECS/World';

export class InputSystem implements System {
  private scene: Phaser.Scene;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys: Record<string, Phaser.Input.Keyboard.Key>;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.cursors = this.scene.input.keyboard?.createCursorKeys() ?? {
      up: undefined,
      down: undefined,
      left: undefined,
      right: undefined,
    };
    this.keys = {};
  }

  bind(action: string, key: Phaser.Input.Keyboard.Key): void {
    this.keys[action] = key;
  }

  update(world: World, _dt: number): void {
    const input = world.getServices().input;
    input.states.set('left', this.cursors.left?.isDown ?? false);
    input.states.set('right', this.cursors.right?.isDown ?? false);
    input.states.set('up', this.cursors.up?.isDown ?? false);
    input.states.set('down', this.cursors.down?.isDown ?? false);
    for (const [action, key] of Object.entries(this.keys)) {
      input.states.set(action, key.isDown);
    }
  }
}
