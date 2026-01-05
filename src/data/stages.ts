export type StageEntity = {
  type: 'player' | 'wall';
  x: number;
  y: number;
};

export type StageData = {
  id: string;
  entities: StageEntity[];
};

export const stages: StageData[] = [
  {
    id: 'prototype',
    entities: [
      { type: 'player', x: 100, y: 100 },
      { type: 'wall', x: 220, y: 100 },
    ],
  },
];
