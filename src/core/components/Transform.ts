export class Transform {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;

  constructor(init: {
    x: number;
    y: number;
    rotation?: number;
    scaleX?: number;
    scaleY?: number;
  }) {
    this.x = init.x;
    this.y = init.y;
    this.rotation = init.rotation ?? 0;
    this.scaleX = init.scaleX ?? 1;
    this.scaleY = init.scaleY ?? 1;
  }
}
