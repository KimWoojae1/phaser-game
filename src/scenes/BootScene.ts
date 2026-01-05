import Phaser from 'phaser';
import { GameServices } from '../core/GameServices';
import { World } from '../core/ECS/World';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    const services = new GameServices();
    const world = new World({ services });
    this.registry.set('services', services);
    this.registry.set('world', world);
    this.scene.start('Preload');
  }
}
