import type Phaser from 'phaser';

export interface UIComponent {
  setup(): void;
  update(delta: number): void;
  cleanup(): void;
}

export type UIComponentFactory<T extends UIComponent> = (scene: Phaser.Scene) => T;
