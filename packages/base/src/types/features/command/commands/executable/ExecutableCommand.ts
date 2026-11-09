import type { NyxBot } from '#types/bot/NyxBot';
import type { Filterable } from '#types/filter/Filterable';
import type { Metadata } from '#types/meta/Metadata';
import type { Awaitable } from '#types/types/Awaitable';
import type { Nameable } from '#types/types/Nameable';
import type { CommandCustomIdData } from '../../customId/data/CommandCustomIdData';
import type { CommandFilterResolvable } from '../../filter/CommandFilterResolvable';
import type { ComponentCommandInteraction } from '../../interaction/ComponentCommandInteraction';
import type { InteractionTypes } from '../../InteractionTypes';
import type { Command } from '../Command';

/** A command that can be executed by an interaction. */
export interface ExecutableCommand<
  Data extends Nameable,
  CommandInteraction,
  Types extends InteractionTypes = InteractionTypes,
>
  extends Command<Data, Types>, Filterable<CommandFilterResolvable<Types>> {
  /** Executes this command from an interaction. */
  execute(interaction: CommandInteraction, metadata: Metadata): Awaitable<void>;

  /** Handle a ComponentCommandInteraction whose customId refers to this command. */
  handleInteraction(
    interaction: ComponentCommandInteraction<Types>,
    metadata: Metadata,
  ): Awaitable<void>;

  /** Builds this command's custom id, optionally with extra data. */
  buildCustomId(bot: NyxBot, extra?: string): string;

  /** Returns this command's custom id data. */
  getCustomIdData(extra?: string): CommandCustomIdData;
}
