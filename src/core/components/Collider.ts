import type { AABB } from '../physics/AABB';

export class Collider {
  bounds: AABB;

  constructor(init: { bounds: AABB }) {
    this.bounds = init.bounds;
  }
}
