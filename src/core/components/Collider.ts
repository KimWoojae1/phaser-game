import type { AABB } from '../physics/AABB';

export class Collider {
  bounds: AABB;
  autoSize: boolean;
  baseWidth: number;
  baseHeight: number;

  constructor(init: { bounds: AABB; autoSize?: boolean }) {
    this.bounds = init.bounds;
    this.autoSize = init.autoSize ?? true;
    this.baseWidth = init.bounds.width;
    this.baseHeight = init.bounds.height;
  }
}
