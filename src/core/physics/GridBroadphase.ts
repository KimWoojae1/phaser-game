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
      const minCellX = Math.floor(collider.bounds.x / this.cellSize);
      const minCellY = Math.floor(collider.bounds.y / this.cellSize);
      const maxCellX = Math.floor(
        (collider.bounds.x + collider.bounds.width) / this.cellSize
      );
      const maxCellY = Math.floor(
        (collider.bounds.y + collider.bounds.height) / this.cellSize
      );
      for (let cellX = minCellX; cellX <= maxCellX; cellX += 1) {
        for (let cellY = minCellY; cellY <= maxCellY; cellY += 1) {
          const key = `${cellX},${cellY}`;
          const list = buckets.get(key) ?? [];
          list.push(entity);
          buckets.set(key, list);
        }
      }
    }

    const pairs: Array<[Entity, Entity]> = [];
    const visited = new Set<string>();
    for (const [key, bucket] of buckets.entries()) {
      const [baseX, baseY] = key.split(',').map((value) => Number(value));
      for (let ox = -1; ox <= 1; ox += 1) {
        for (let oy = -1; oy <= 1; oy += 1) {
          const neighborKey = `${baseX + ox},${baseY + oy}`;
          const neighbor = buckets.get(neighborKey);
          if (!neighbor) {
            continue;
          }
          for (const a of bucket) {
            for (const b of neighbor) {
              if (a === b) {
                continue;
              }
              const idA = a.id ?? 0;
              const idB = b.id ?? 0;
              const pairKey = idA < idB ? `${idA}|${idB}` : `${idB}|${idA}`;
              if (visited.has(pairKey)) {
                continue;
              }
              visited.add(pairKey);
              pairs.push([a, b]);
            }
          }
        }
      }
    }
    return pairs;
  }
}
