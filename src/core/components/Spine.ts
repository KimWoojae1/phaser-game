export class Spine {
  key: string;
  atlasKey: string;
  animation?: string;
  loop: boolean;
  scale: number;
  offsetX: number;
  offsetY: number;

  constructor(init: {
    key: string;
    atlasKey?: string;
    animation?: string;
    loop?: boolean;
    scale?: number;
    offsetX?: number;
    offsetY?: number;
  }) {
    this.key = init.key;
    this.atlasKey = init.atlasKey ?? init.key;
    this.animation = init.animation;
    this.loop = init.loop ?? true;
    this.scale = init.scale ?? 1;
    this.offsetX = init.offsetX ?? 0;
    this.offsetY = init.offsetY ?? 0;
  }
}
