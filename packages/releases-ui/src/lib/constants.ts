export type Channel = typeof channels[number];
export const channels = ['lts', 'stable', 'beta', 'unstable'] as const;
