export type StageEntity = {
  type: 'player' | 'wall' | 'npc' | 'item' | 'trigger';
  x: number;
  y: number;
  size?: number;
  spriteKey?: string;
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
      { type: 'player', x: 100, y: 100, spriteKey: 'player' },
      { type: 'wall', x: 220, y: 100, size: 48, wallType: 'solid', color: 0x555555 },
      { type: 'npc', x: 160, y: 200, size: 32, color: 0x3366aa },
      { type: 'item', x: 260, y: 200, size: 24, color: 0xffcc33 },
      { type: 'trigger', x: 320, y: 120, size: 40, wallType: 'sensor', color: 0xaa33aa },
    ],
  },
];
