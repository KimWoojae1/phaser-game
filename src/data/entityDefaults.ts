export const entityDefaults = {
  player: {
    render: 'sprite' as const,
    key: 'player',
    animation: undefined as string | undefined,
  },
  enemy: {
    render: 'spine' as const,
    key: 'gas_zombie',
    animation: 'zombie_idle',
  },
};
