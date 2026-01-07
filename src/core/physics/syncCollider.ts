import type { Collider } from '../components/Collider';
import type { Origin } from '../components/Origin';
import type { Transform } from '../components/Transform';

export function syncColliderToTransform(
  transform: Transform,
  collider: Collider,
  origin?: Origin
): void {
  const ox = origin?.x ?? 0.5;
  const oy = origin?.y ?? 1.0;
  if (!collider.autoSize) {
    collider.bounds.width = collider.baseWidth * transform.scaleX;
    collider.bounds.height = collider.baseHeight * transform.scaleY;
  }
  collider.bounds.x = transform.x - collider.bounds.width * ox;
  collider.bounds.y = transform.y - collider.bounds.height * oy;
}
