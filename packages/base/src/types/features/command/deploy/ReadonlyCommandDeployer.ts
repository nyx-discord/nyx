import type { APIApplicationCommand } from 'discord-api-types/v10';
import type { InteractionTypes } from '../InteractionTypes';
import type { CommandDeployer } from './CommandDeployer';

export type ReadonlyCommandDeployer<
  Types extends InteractionTypes = InteractionTypes,
  ApplicationCommand = APIApplicationCommand,
> = Omit<
  CommandDeployer<Types, ApplicationCommand>,
  'addCommands' | 'removeCommands' | 'start' | 'editCommands' | 'setCommands'
>;
