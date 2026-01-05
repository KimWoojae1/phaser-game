import type { Entity } from '../ECS/Entity';

export interface Broadphase {
  getPairs(entities: Entity[]): Array<[Entity, Entity]>;
}
