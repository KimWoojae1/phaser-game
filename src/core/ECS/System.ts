import type Phaser from 'phaser';
import type { World } from './World';

export interface System {
  id?: string;
  update(world: World, dt: number): void;
  setTimeSource?(time: { now: number; frame: number; dt: number }): void;
  setEventLevel?(level: 'debug' | 'info' | 'warn' | 'error'): void;
  setScene?(scene: Phaser.Scene | null): void;
}
