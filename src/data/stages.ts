export type StageEntity = {
  type: 'player' | 'enemy' | 'wall' | 'npc' | 'item' | 'trigger';
  x: number;
  y: number;
  size?: number;
  scale?: number;
  key?: string;
  spriteKey?: string;
  spineKey?: string;
  spineAtlasKey?: string;
  render?: 'sprite' | 'spine';
  animation?: string;
  spineScale?: number;
  spineOffsetX?: number;
  spineOffsetY?: number;
  origin?: { x: number; y: number };
  collider?: { width: number; height: number };
  tag?: 'None' | 'Map' | 'Player' | 'Enemy' | 'Projectile';
  collidesWith?: Array<'None' | 'Map' | 'Player' | 'Enemy' | 'Projectile'>;
  controlled?: boolean;
  wallType?: 'solid' | 'sensor';
  color?: number;
};

export type StageData = {
  id: string;
  entities: StageEntity[];
};

export const stages: StageData[] = [
  {
    id: 'prototype',
    entities: [
      {
        type: 'player',
        x: 100,
        y: 100,
        render: 'sprite',
        spriteKey: 'player',
        tag: 'Player',
        collidesWith: ['Enemy'],
        controlled: true,
      },
      {
        type: 'enemy',
        x: 260,
        y: 140,
        render: 'spine',
        spineKey: 'gas_zombie',
        animation: 'zombie_idle',
        spineScale: 0.6,
        origin: { x: 0.5, y: 1.0 },
        collider: { width: 100, height: 100 },
        tag: 'Enemy',
        collidesWith: ['Player'],
      },
      { type: 'wall', x: 220, y: 100, size: 48, wallType: 'solid', color: 0x555555 },
      { type: 'npc', x: 160, y: 200, size: 32, color: 0x3366aa },
      { type: 'item', x: 260, y: 200, size: 24, color: 0xffcc33 },
      { type: 'trigger', x: 320, y: 120, size: 40, wallType: 'sensor', color: 0xaa33aa },
    ],
  },
];
