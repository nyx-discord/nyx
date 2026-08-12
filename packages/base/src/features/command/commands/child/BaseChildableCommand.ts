import type { ReadonlyCollection } from '@discordjs/collection';
import { Collection } from '@discordjs/collection';
import type {
  ChildableCommand,
  ChildCommand,
  ClassImplements,
  InteractionTypes,
  Nameable,
} from '@nyx-discord/types';
import {
  AssertionError,
  IllegalDuplicateError,
  ObjectNotFoundError,
} from '@nyx-discord/types';
import { BaseCommand } from '../BaseCommand';

export abstract class BaseChildableCommand<
  Data extends Nameable,
  Child extends ChildCommand<Nameable, any>,
  Types extends InteractionTypes = InteractionTypes,
>
  extends BaseCommand<Data, Types>
  implements ChildableCommand<Data, Child, Types>
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
