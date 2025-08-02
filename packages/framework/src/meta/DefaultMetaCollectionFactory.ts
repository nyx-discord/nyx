import type {
  Identifier,
  MetaCollection,
  MetaCollectionFactory,
  TypedField,
} from '@nyx-discord/core';
import { TypedFields } from '@nyx-discord/core';
import { Collection } from 'discord.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const _addDefaultField: MetaCollectionFactory['addDefaultField'];

export class DefaultMetaCollectionFactory implements MetaCollectionFactory {
  public static createWith<T extends unknown[]>(
    ...fields: {
      [K in keyof T]: Parameters<typeof _addDefaultField<T[K]>>;
    }
  ): MetaCollectionFactory {
    const factory = new DefaultMetaCollectionFactory();
    for (const [field, valueOrGetter] of fields) {
      factory.addDefaultField(field, valueOrGetter);
    }
    return factory;
  }

  protected readonly fields: Parameters<
    MetaCollectionFactory['addDefaultField']
  >[] = [];

  public createOrPopulate(
    collection: MetaCollection | undefined,
    id: Identifier,
  ): MetaCollection {
    return collection ? this.populate(collection, id) : this.create(id);
  }

  public create(id: Identifier): MetaCollection {
    const collection = new Collection<Identifier, unknown>();
    this.populate(collection, id);
    return collection;
  }

  public populate(collection: MetaCollection, id: Identifier): MetaCollection {
    TypedFields.Id.set(collection, id);
    TypedFields.CreationDate.set(collection, new Date());

    for (const [field, valueOrGetter] of this.fields) {
      const value =
        valueOrGetter instanceof Function ? valueOrGetter() : valueOrGetter;

      field.set(collection, value);
    }

    return collection;
  }

  public addDefaultField<T>(
    field: TypedField<T>,
    valueOrGetter: NoInfer<T | (() => T)>,
  ): this {
    this.fields.push([field, valueOrGetter]);
    return this;
  }
}
