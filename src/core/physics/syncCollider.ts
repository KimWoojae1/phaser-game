import type { Collider } from '../components/Collider';
import type { Transform } from '../components/Transform';

export function syncColliderToTransform(
  transform: Transform,
  collider: Collider
): void {
  collider.bounds.x = transform.x;
  collider.bounds.y = transform.y;
}
