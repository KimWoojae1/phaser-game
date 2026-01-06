import type Phaser from 'phaser';
import type { UIComponent } from './UIComponent';

export class LoadingUI implements UIComponent {
  private scene: Phaser.Scene;
  private loadingText?: Phaser.GameObjects.Text;
  private loadingImage?: Phaser.GameObjects.Image;
  private loadingDots = 0;
  private loadingTimer?: Phaser.Time.TimerEvent;
  private loadingTween?: Phaser.Tweens.Tween;
  private grid?: Phaser.GameObjects.Graphics;
  private gridOffset = 0;
  private onProgress?: (value: number) => void;
  private onImageLoaded?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  setup(): void {
    const centerX = this.scene.cameras.main.width / 2;
    const centerY = this.scene.cameras.main.height / 2;
    this.grid = this.scene.add.graphics();
    this.grid.setDepth(-10);
    this.drawGrid();
    this.loadingText = this.scene.add.text(centerX, centerY + 60, 'Loading 0%', {
      color: '#88c2b4',
      fontSize: '16px',
      fontFamily: 'Georgia, serif',
    });
    this.loadingText.setOrigin(0.5, 0.5);
    this.loadingTimer = this.scene.time.addEvent({
      delay: 350,
      loop: true,
      callback: () => {
        this.loadingDots = (this.loadingDots + 1) % 4;
      },
    });
    this.onProgress = (value: number) => {
      if (this.loadingText) {
        const percent = Math.floor(value * 100);
        const dots = '.'.repeat(this.loadingDots);
        this.loadingText.setText(`Loading ${percent}%${dots}`);
      }
    };
    this.scene.load.on('progress', this.onProgress);
    this.onImageLoaded = () => {
      this.loadingImage = this.scene.add.image(centerX, centerY, 'loading');
      this.loadingImage.setScale(1);
      this.loadingTween = this.scene.tweens.add({
        targets: this.loadingImage,
        alpha: { from: 0.6, to: 1 },
        scale: { from: 0.98, to: 1.02 },
        duration: 700,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    };
    if (this.scene.textures.exists('loading')) {
      this.onImageLoaded();
    } else {
      this.scene.load.once('filecomplete-image-loading', this.onImageLoaded);
    }
  }

  update(delta: number): void {
    if (!this.grid) {
      return;
    }
    this.gridOffset = (this.gridOffset + delta * 0.02) % 40;
    this.drawGrid();
  }

  cleanup(): void {
    if (this.onProgress) {
      this.scene.load.off('progress', this.onProgress);
      this.onProgress = undefined;
    }
    if (this.onImageLoaded) {
      this.scene.load.off('filecomplete-image-loading', this.onImageLoaded);
      this.onImageLoaded = undefined;
    }
    if (this.loadingText) {
      this.loadingText.destroy();
      this.loadingText = undefined;
    }
    if (this.loadingTimer) {
      this.loadingTimer.remove(false);
      this.loadingTimer = undefined;
    }
    if (this.loadingImage) {
      this.loadingImage.destroy();
      this.loadingImage = undefined;
    }
    if (this.loadingTween) {
      this.loadingTween.stop();
      this.loadingTween = undefined;
    }
    if (this.grid) {
      this.grid.destroy();
      this.grid = undefined;
    }
  }

  private drawGrid(): void {
    if (!this.grid) {
      return;
    }
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;
    this.grid.clear();
    this.grid.lineStyle(1, 0x1d2a2f, 0.5);
    const step = 40;
    for (let x = -step; x <= width + step; x += step) {
      this.grid.lineBetween(x + this.gridOffset, 0, x + this.gridOffset, height);
    }
    for (let y = -step; y <= height + step; y += step) {
      this.grid.lineBetween(0, y + this.gridOffset, width, y + this.gridOffset);
    }
  }
}
