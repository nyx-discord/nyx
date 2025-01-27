import type { CommandDeployer } from './CommandDeployer';

export type ReadonlyCommandDeployer = Omit<
  CommandDeployer,
  'addCommands' | 'removeCommands' | 'start' | 'editCommands' | 'setCommands'
>;
