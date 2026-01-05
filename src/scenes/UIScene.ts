import Phaser from 'phaser';
import { GameServices } from '../core/GameServices';
import { World } from '../core/ECS/World';

export class UIScene extends Phaser.Scene {
  private unsubscribeLevelClick: (() => void) | null = null;
  constructor() {
    super('UI');
  }

  create(): void {
    const services =
      (this.registry.get('services') as GameServices | undefined) ??
      new GameServices();
    const world =
      (this.registry.get('world') as World | undefined) ??
      new World({ services });
    const stageText = this.add.text(
      10,
      10,
      `Stage: ${services.stage.name} (${services.stage.index})`
    );
    stageText.setDepth(1000);
    stageText.setScrollFactor(0);

    const levelText = this.add.text(
      10,
      30,
      `Event Level: ${services.eventLevel}`
    );
    levelText.setDepth(1000);
    levelText.setScrollFactor(0);
    levelText.setInteractive({ useHandCursor: true });

    const levels: Array<GameServices['eventLevel']> = [
      'debug',
      'info',
      'warn',
      'error',
    ];
    const onLevelClick = () => {
      const index = levels.indexOf(services.eventLevel);
      const next = levels[(index + 1) % levels.length];
      world.setEventLevel(next);
      levelText.setText(`Event Level: ${services.eventLevel}`);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('eventLevel', services.eventLevel);
      }
    };
    levelText.on('pointerdown', onLevelClick);
    this.unsubscribeLevelClick = () => {
      levelText.off('pointerdown', onLevelClick);
    };

  }

  override shutdown(): void {
    if (this.unsubscribeLevelClick) {
      this.unsubscribeLevelClick();
      this.unsubscribeLevelClick = null;
    }
  }
}
