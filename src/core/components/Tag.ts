export type TagType = 'None' | 'Map' | 'Player' | 'Enemy' | 'Projectile';

export class Tag {
  value: TagType;
  solid?: boolean;
  collidesWith: TagType[];

  constructor(init: { value: TagType; solid?: boolean; collidesWith?: TagType[] }) {
    this.value = init.value;
    this.solid = init.solid;
    this.collidesWith = init.collidesWith ?? [];
  }
}
