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

import type {
  CommandVisitor,
  ParentCommand,
  ParentCommandData,
  SubCommand,
  SubCommandGroup,
} from '@nyx-discord/core';
import { AbstractChildableCommand } from './abstract/AbstractChildableCommand.js';

/**
 * A top level command that serves only to contain
 * {@link AbstractSubCommand subcommands} or
 * {@link AbstractSubCommandGroup subcommand groups}.
 *
 * Parent commands cannot be executed by themselves.
 */
export abstract class AbstractParentCommand
  extends AbstractChildableCommand<
    ParentCommandData,
    SubCommand | SubCommandGroup
  >
  implements ParentCommand
{
  protected override readonly childLimit = 25;

  public override acceptVisitor(visitor: CommandVisitor<unknown>): void {
    visitor.visitParentCommand(this);
  }

  public override isParentCommand(): this is ParentCommand {
    return true;
  }
}
