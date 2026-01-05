export class Sprite {
  key: string;
  frame?: string | number;
  animation?: string;

  constructor(init: { key: string; frame?: string | number; animation?: string }) {
    this.key = init.key;
    this.frame = init.frame;
    this.animation = init.animation;
  }
}
