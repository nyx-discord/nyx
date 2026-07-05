import type {
  ChildableCommand,
  ChildCommand,
  ClassImplements,
  Nameable,
} from '@nyx-discord/core';
import {
  AssertionError,
  IllegalDuplicateError,
  ObjectNotFoundError,
} from '@nyx-discord/core';
import type { ReadonlyCollection } from 'discord.js';
import { Collection } from 'discord.js';
import { AbstractCommand } from '../AbstractCommand';

export abstract class AbstractChildableCommand<
    Data extends Nameable,
    Child extends ChildCommand<Nameable, any>,
  >
  extends AbstractCommand<Data>
  implements ChildableCommand<Data, Child>
{
  protected abstract readonly childLimit: number;

  protected readonly children: Collection<string, Child> = new Collection();

  public get size() {
    return this.children.size;
  }

  public addChildren(...children: Child[]): this {
    for (const child of children) {
      if (this.children.size + 1 > this.childLimit) {
        throw new RangeError(
          `Can't add child. Children limit of ${this.childLimit}`,
        );
      }

      if (child.getParent() !== this) {
        throw new AssertionError();
      }
      const name = child.getData().name;

      const duplicate = this.children.get(name);
      if (duplicate) {
        throw new IllegalDuplicateError(duplicate, child);
      }

      this.children.set(name, child);
    }
    return this;
  }

  public removeChildByName(child: string): this {
    const childToRemove = this.children.get(child);
    if (!childToRemove) {
      throw new ObjectNotFoundError();
    }
    this.children.delete(child);

    return this;
  }

  public removeChildByInstance(child: Child) {
    if (this.children.size === 1) {
      throw new RangeError();
    }
    const key = this.children.findKey((storedChild) => storedChild === child);
    if (!key) {
      throw new ObjectNotFoundError();
    }

    this.children.delete(key);
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

  public findChildByName(name: string): Child | null {
    return this.children.get(name) ?? null;
  }

  public getMaxChildren(): number {
    return this.childLimit;
  }

  public getChildren(): ReadonlyCollection<string, Child> {
    return this.children;
  }
}
