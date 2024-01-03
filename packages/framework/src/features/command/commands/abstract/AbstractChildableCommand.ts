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

import type {
  ChildableCommand,
  ChildCommand,
  ClassImplements,
  CommandData,
} from '@nyx-discord/core';
import { AssertionError, ObjectNotFoundError } from '@nyx-discord/core';

import { AbstractCommand } from './AbstractCommand.js';

export abstract class AbstractChildableCommand<
    Data extends CommandData,
    Child extends ChildCommand<Data, ChildableCommand<CommandData, any>>,
  >
  extends AbstractCommand<Data>
  implements ChildableCommand<Data, Child>
{
  protected abstract readonly childLimit: number;

  protected abstract readonly children: Child[];

  public get size() {
    return this.children.length;
  }

  public addChild(child: Child): this {
    if (this.children.length + 1 > this.childLimit) {
      throw new RangeError(
        `Can't add child. Children limit of ${this.childLimit}`,
      );
    }

    if (child.getParent() !== this) {
      throw new AssertionError();
    }

    this.children.push(child);
    return this;
  }

  public addChildren(children: Child[]): this {
    children.forEach((child) => this.addChild(child));
    return this;
  }

  public removeChildByName(child: string): this {
    const childToRemove = this.findChildByName(child);
    if (!childToRemove) {
      throw new ObjectNotFoundError();
    }
    return this.removeChildByInstance(childToRemove);
  }

  public removeChildByInstance(child: Child) {
    if (this.children.length === 1) {
      throw new RangeError();
    }
    const index = this.children.indexOf(child);
    if (index === -1) {
      throw new ObjectNotFoundError();
    }
    this.children.splice(index, 1);
    return this;
  }

  public findChildByClass<SearchedChild extends ClassImplements<Child>>(
    SearchedChildClass: SearchedChild,
  ): InstanceType<SearchedChild> | null {
    const foundChild = this.children.find(
      (child) => child instanceof SearchedChildClass,
    ) as InstanceType<SearchedChild> | undefined;
    return foundChild ?? null;
  }

  public getMaxChildren(): number {
    return this.childLimit;
  }

  /** Find a subcommand belonging to this group by its name. */
  public findChildByName(name: string): Child | null {
    return (
      this.children.find((children) => children.getData().name === name) ?? null
    );
  }

  public getChildren(): ReadonlyArray<Child> {
    return this.children;
  }
}
