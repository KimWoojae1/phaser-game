import Phaser from 'phaser';
import { SpinePlugin } from '@esotericsoftware/spine-phaser-v3';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { GameScene } from './scenes/GameScene';
import { UIScene } from './scenes/UIScene';
import './style.css';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 1024,
  height: 1024,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.NO_CENTER,
    width: 1024,
    height: 1024,
  },
  backgroundColor: '#1d1d1d',
  plugins: {
    scene: [
      {
        key: 'SpinePlugin',
        plugin: SpinePlugin,
        mapping: 'spine',
        start: true,
      },
    ],
  },
  scene: [BootScene, PreloadScene, GameScene, UIScene],
};

new Phaser.Game(config);
