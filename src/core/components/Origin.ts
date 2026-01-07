export class Origin {
  x: number;
  y: number;

  constructor(init?: { x?: number; y?: number }) {
    this.x = init?.x ?? 0.5;
    this.y = init?.y ?? 1.0;
  }
}
