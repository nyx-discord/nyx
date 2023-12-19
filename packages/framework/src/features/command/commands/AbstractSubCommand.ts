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
  CommandReferenceData,
  CommandVisitor,
  ParentCommand,
  SubCommand,
  SubCommandData,
  SubCommandGroup,
} from '@nyx-discord/core';
import { ResolvedCommandType } from '@nyx-discord/core';

import { AbstractExecutableCommand } from './abstract/AbstractExecutableCommand.js';

/** A child, executable command that belongs to an {@link ParentCommand} or {@link SubCommandGroup}. */
export abstract class AbstractSubCommand
  extends AbstractExecutableCommand<SubCommandData>
  implements SubCommand
{
  protected readonly parent: ParentCommand | SubCommandGroup;

  constructor(parent: ParentCommand | SubCommandGroup) {
    super();
    this.parent = parent;
  }

  public getParent(): ParentCommand | SubCommandGroup {
    return this.parent;
  }

  public override acceptVisitor(visitor: CommandVisitor<unknown>): void {
    visitor.visitSubCommand(this);
  }

  public override isSubCommand(): this is SubCommand {
    return true;
  }

  public override getReadableName(): string {
    const names: string[] = [this.parent.getReadableName(), this.data.name];
    return names.join('/');
  }

  public toReferenceData(): CommandReferenceData {
    if (this.parent.isParentCommand()) {
      return {
        type: ResolvedCommandType.SubCommand,
        root: this.parent.getData().name,
        subCommand: this.data.name,
      };
    } else {
      const root = this.parent.getParent();

      return {
        type: ResolvedCommandType.SubCommandOnGroup,
        root: root.getData().name,
        group: this.parent.getData().name,
        subCommand: this.data.name,
      };
    }
  }
}
