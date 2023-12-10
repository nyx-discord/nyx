/*
 * MIT License
 *
 * Copyright (c) 2023 Amgelo563
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

import type { CustomIdBuilder } from '../../../customId/CustomIdBuilder';
import type { CustomIdCodec } from '../../../customId/CustomIdCodec.js';
import type { StringIterator } from '../../../string/StringIterator';
import type { ExecutableCommand } from '../commands/abstract/ExecutableCommand.js';
import type { CommandData } from '../data/command/CommandData.js';

/** An object responsible for creating and manipulating customIds that refer to command names. */
export interface CommandCustomIdCodec
  extends CustomIdCodec<ExecutableCommand<CommandData>> {
  /**
   * Creates a {@link CustomIdBuilder} that can be used to start a
   * customId that refers to the passed command.
   * @example
   * // Let's say you want to make a component that when used, it routes to the
   * // userinfo command, with 'Amgelo#1106' as an extra data.
   *
   * const commandManager = myBot.commands;
   *
   * const commandRouter = commandManager.getRouter();
   *
   * const userInfoCommand =
   *   commandRouter.locateCommandByTree(UserInfoCommandClass);
   * if (!userInfoCommand) return;
   *
   * const customIdCodec = commandManager.getCustomIdCodec();
   *
   * const builder = customIdCodec.createCustomIdBuilder(userInfoCommand);
   * builder.add('Amgelo#1106');
   *
   * // Use this for your component's customId.
   * const customId: string = builder.build();
   */
  createCustomIdBuilder(
    command: ExecutableCommand<CommandData>,
  ): CustomIdBuilder;

  /**
   * Creates a {@link StringIterator} from a command customId, leaving only the
   * data that is not related to the referred command.
   * @example
   * // Let's say your command customId template is:
   *   '$CMD_commandName_[extradata]'.
   *
   * // This is obtained from an Interaction, declared here for demonstration
   *   purposes. const customId = '$CMD_userinfo_Amgelo#1106_extraInfo';
   *
   * const customIdCodec = myBot.commands.getCustomIdCodec();
   * const iterator = customIdCodec.createIteratorFromCustomId(customId);
   *
   * console.log(iterator.getTokens()) // ['Amgelo#1106', 'extraInfo']
   */
  createIteratorFromCustomId(commandCustomId: string): StringIterator | null;
}
