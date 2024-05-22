/*
 * MIT License
 *
 * Copyright (c) 2024 Amgelo563
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Collection } from '@discordjs/collection';
import type { AutocompleteInteraction } from 'discord.js';
import type { NyxBot } from '../../../../bot/NyxBot.js';
import type { Identifiable } from '../../../../identity/Identifiable.js';
import type { Identifier } from '../../../../identity/Identifier.js';
import type { MetaCollection } from '../../../../meta/MetaCollection.js';
import type { AnyExecutableCommand } from '../../commands/executable/AnyExecutableCommand';
import type { CommandExecutableInteraction } from '../../interaction/CommandExecutableInteraction.js';

/** An object that saves metadata about a command execution. */
export class CommandExecutionMeta
  extends Collection<Identifier, unknown>
  implements MetaCollection, Identifiable
{
  protected readonly id: symbol;

  protected readonly bot: NyxBot;

  protected readonly createdAt: number = Date.now();

  constructor(bot: NyxBot, id: symbol) {
    super();
    this.bot = bot;
    this.id = id;
  }

  /** Creates an CommandExecutionMeta using the given arguments, and an autogenerated ID. */
  public static fromCommandCall(
    command: AnyExecutableCommand,
    interaction: CommandExecutableInteraction,
    bot: NyxBot,
  ): CommandExecutionMeta {
    const name = command.constructor.name;
    const id = Symbol(
      `Command '${name}' | Interaction '${interaction.id}' | @${Date.now()}`,
    );
    return new CommandExecutionMeta(bot, id);
  }

  /** Creates an CommandExecutionMeta using the given arguments, and an autogenerated ID. */
  public static fromCommandAutocomplete(
    command: AnyExecutableCommand,
    interaction: AutocompleteInteraction,
    bot: NyxBot,
  ): CommandExecutionMeta {
    const name = command.constructor.name;
    const interactionId = interaction.id;
    const option = interaction.options.getFocused();

    const id = Symbol(
      `Command '${name}' | Interaction '${interactionId}' | Option '${option}' | @${Date.now()}`,
    );

    return new CommandExecutionMeta(bot, id);
  }

  /** Returns the bot that called this command. */
  public getBot(): NyxBot {
    return this.bot;
  }

  /** Returns the identifier of this command execution. */
  public getId(): Identifier {
    return this.id;
  }

  /** Returns the time when this command was executed. */
  public getCreatedAt(): number {
    return this.createdAt;
  }
}
