import Phaser from 'phaser';
import { GameServices } from '../core/GameServices';
import { World } from '../core/ECS/World';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload(): void {
    // Asset loading goes here.
  }

  create(): void {
    const services =
      (this.registry.get('services') as GameServices | undefined) ??
      new GameServices();
    const world =
      (this.registry.get('world') as World | undefined) ??
      new World({ services });
    services.dataStore.set('speedScale', 1);
    services.stage.index = 0;
    services.stage.name = 'prototype';
    services.eventLevel = 'debug';
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('eventLevel');
      if (stored === 'debug' || stored === 'info' || stored === 'warn' || stored === 'error') {
        services.eventLevel = stored;
      }
    }
    this.registry.set('services', services);
    this.registry.set('world', world);
    world.setEventLevel(services.eventLevel);
    this.scene.start('Game');
  }
}
