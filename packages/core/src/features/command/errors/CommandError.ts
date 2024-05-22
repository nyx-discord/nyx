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

import { FeatureError } from '../../../errors/FeatureError.js';
import type { AnyExecutableCommand } from '../commands/executable/AnyExecutableCommand';
import type { CommandExecutionMeta } from '../execution/meta/CommandExecutionMeta.js';
import type { CommandResolvableInteraction } from '../interaction/CommandResolvableInteraction.js';

/** An Error that wraps errors that occur during the execution of an {@link ExecutableCommand} object. */
export class CommandError extends FeatureError<AnyExecutableCommand> {
  protected readonly interaction: CommandResolvableInteraction;

  protected readonly meta: CommandExecutionMeta;

  constructor(
    error: Error,
    command: AnyExecutableCommand,
    interaction: CommandResolvableInteraction,
    meta: CommandExecutionMeta,
    message?: string,
  ) {
    super(
      error,
      command,
      message ?? 'There was an error while executing a command.',
    );
    this.meta = meta;
    this.interaction = interaction;
  }

  /** Returns the execution meta that was passed alongside the interaction. */
  public getMeta(): CommandExecutionMeta {
    return this.meta;
  }

  /** Returns the interaction that triggered the command, and thus the error. */
  public getInteraction(): CommandResolvableInteraction {
    return this.interaction;
  }
}
