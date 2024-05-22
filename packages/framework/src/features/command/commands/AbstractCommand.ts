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
import type {
  Command,
  ContextMenuCommand,
  MetaCollection,
  ParentCommand,
  ReadonlyMetaCollection,
  StandaloneCommand,
  SubCommand,
  SubCommandGroup,
} from '@nyx-discord/core';

export abstract class AbstractCommand<Data> implements Command<Data> {
  protected readonly meta: MetaCollection = new Collection();

  public isStandalone(): this is StandaloneCommand {
    return false;
  }

  public isParent(): this is ParentCommand {
    return false;
  }

  public isSubCommand(): this is SubCommand {
    return false;
  }

  public isSubCommandGroup(): this is SubCommandGroup {
    return false;
  }

  public isContextMenu(): this is ContextMenuCommand {
    return false;
  }

  public getMeta(): ReadonlyMetaCollection {
    return this.meta;
  }

  public toString(): string {
    return this.getName();
  }

  public abstract getNameTree(): ReadonlyArray<string>;

  public abstract getData(): Data;

  public abstract getName(): string;
}
