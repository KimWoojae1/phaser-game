import type Phaser from 'phaser';

export class AssetLoader {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  loadImage(key: string, url: string): void {
    this.scene.load.image(key, url);
  }

  loadSpine(
    key: string,
    jsonUrl: string,
    atlasUrl: string,
    atlasKey?: string
  ): void {
    const loader = this.scene.load as unknown as {
      spineJson?: Function;
      spineAtlas?: Function;
    };
    if (typeof loader.spineJson === 'function') {
      loader.spineJson.call(this.scene.load, key, jsonUrl);
    }
    if (typeof loader.spineAtlas === 'function') {
      loader.spineAtlas.call(this.scene.load, atlasKey ?? key, atlasUrl);
    }
  }
}
