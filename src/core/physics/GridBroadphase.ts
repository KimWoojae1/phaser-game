import type { Broadphase } from './Broadphase';
import type { Entity } from '../ECS/Entity';
import { Collider } from '../components/Collider';

export class GridBroadphase implements Broadphase {
  private cellSize: number;

  constructor(cellSize: number) {
    this.cellSize = cellSize;
  }

  getPairs(entities: Entity[]): Array<[Entity, Entity]> {
    const buckets = new Map<string, Entity[]>();
    for (const entity of entities) {
      const collider = entity.get(Collider);
      if (!collider) {
        continue;
      }
      const cellX = Math.floor(collider.bounds.x / this.cellSize);
      const cellY = Math.floor(collider.bounds.y / this.cellSize);
      const key = `${cellX},${cellY}`;
      const list = buckets.get(key) ?? [];
      list.push(entity);
      buckets.set(key, list);
    }

    const pairs: Array<[Entity, Entity]> = [];
    for (const bucket of buckets.values()) {
      for (let i = 0; i < bucket.length; i += 1) {
        for (let j = i + 1; j < bucket.length; j += 1) {
          pairs.push([bucket[i], bucket[j]]);
        }
      }
    }
    return pairs;
  }
}
