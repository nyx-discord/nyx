import type { CommandFilter } from './CommandFilter';

export type CommandFilterResolvable = CommandFilter | CommandFilter['check'];
