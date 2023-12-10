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

import { Collection } from '@discordjs/collection';
import type {
  Command,
  CommandData,
  CommandVisitor,
  ExecutableCommand,
  MetaCollection,
  ParentCommand,
  ReadonlyMetaCollection,
  StandaloneCommand,
  SubCommand,
  SubCommandGroup,
} from '@nyx-discord/core';

export abstract class AbstractCommand<Data extends CommandData>
  implements Command<Data>
{
  protected readonly meta: MetaCollection = new Collection();

  protected abstract data: Data;

  public isStandaloneCommand(): this is StandaloneCommand {
    return false;
  }

  public isParentCommand(): this is ParentCommand {
    return false;
  }

  public isSubCommand(): this is SubCommand {
    return false;
  }

  public isSubCommandGroup(): this is SubCommandGroup {
    return false;
  }

  public isExecutable(): this is ExecutableCommand<Data> {
    return false;
  }

  public getData(): Readonly<Data> {
    return this.data;
  }

  public getMeta(): ReadonlyMetaCollection {
    return this.meta;
  }

  public getReadableName(): string {
    return this.data.name;
  }

  public getId(): string {
    return this.getReadableName();
  }

  public toString(): string {
    return this.getReadableName();
  }

  public abstract acceptVisitor(visitor: CommandVisitor<unknown>): void;
}
