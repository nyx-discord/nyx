import type { Awaitable } from 'discord.js';
import type { NyxBot } from '../../../../bot/NyxBot';
import type { Filterable } from '../../../../filter/Filterable';
import type { CommandCustomIdData } from '../../customId/data/CommandCustomIdData';
import type { CommandExecutionMeta } from '../../execution/meta/CommandExecutionMeta';
import type { CommandFilter } from '../../filter/CommandFilter';
import type { ApplicationCommandInteraction } from '../../interaction/ApplicationCommandInteraction';
import type { ComponentCommandInteraction } from '../../interaction/ComponentCommandInteraction';
import type { Command } from '../Command';

/** A command that can be executed by an interaction. */
export interface ExecutableCommand<
  Data,
  Interaction extends ApplicationCommandInteraction,
> extends Command<Data>,
    Filterable<CommandFilter> {
  /** Executes this command from an interaction. */
  execute(
    interaction: Interaction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;

  /** Handle a ComponentCommandInteraction whose customId refers to this command. */
  handleInteraction(
    interaction: ComponentCommandInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;

  /** Builds this command's custom id, optionally with extra data. */
  buildCustomId(bot: NyxBot, extra?: string): string;

  /** Returns this command's custom id data. */
  getCustomIdData(extra?: string): CommandCustomIdData;
}
