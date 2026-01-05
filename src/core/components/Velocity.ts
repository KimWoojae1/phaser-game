export class Velocity {
  vx: number;
  vy: number;

  constructor(init: { vx: number; vy: number }) {
    this.vx = init.vx;
    this.vy = init.vy;
  }
}
