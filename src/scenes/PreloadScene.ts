import Phaser from 'phaser';
import { GameServices } from '../core/GameServices';
import { World } from '../core/ECS/World';
import { LoadingUI } from '../ui/LoadingUI';

export class PreloadScene extends Phaser.Scene {
  private loadingUI?: LoadingUI;

  constructor() {
    super('Preload');
  }

  preload(): void {
    this.load.image('loading', '/loading.svg');
    this.loadingUI = new LoadingUI(this);
    this.loadingUI.setup();
    this.load.image('player', '/player.png');
  }

  create(): void {
    const cleanup = () => {
      this.loadingUI?.cleanup();
      this.loadingUI = undefined;
    };
    const { world } = this.initServices();
    this.time.delayedCall(800, () => {
      cleanup();
      this.scene.start('Game');
    });
  }

  update(_: number, delta: number): void {
    this.loadingUI?.update(delta);
  }

  private initServices(): { services: GameServices; world: World } {
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
      if (
        stored === 'debug' ||
        stored === 'info' ||
        stored === 'warn' ||
        stored === 'error'
      ) {
        services.eventLevel = stored;
      }
    }
    this.registry.set('services', services);
    this.registry.set('world', world);
    world.setEventLevel(services.eventLevel);
    return { services, world };
  }
}
