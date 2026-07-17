import type {
  Identifier,
  Metadata,
  MetadataFactory,
  TypedField,
} from '@nyx-discord/core';
import { TypedFields } from '@nyx-discord/core';

// workaround: generic function types can't be instantiated directly from an indexed access type
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const _addDefaultField: MetadataFactory['addDefaultField'];

export class DefaultMetadataFactory implements MetadataFactory {
  protected readonly fields: Parameters<MetadataFactory['addDefaultField']>[] =
    [];

  public static createWith<T extends unknown[]>(
    ...fields: {
      [K in keyof T]: Parameters<typeof _addDefaultField<T[K]>>;
    }
  ): MetadataFactory {
    const factory = new DefaultMetadataFactory();
    for (const [field, valueOrGetter] of fields) {
      factory.addDefaultField(field, valueOrGetter);
    }
    return factory;
  }

  public createOrPopulate(
    collection: Metadata | undefined,
    id: Identifier,
  ): Metadata {
    return collection ? this.populate(collection, id) : this.create(id);
  }

  public addDefaultField<T>(
    field: TypedField<T>,
    valueOrGetter: NoInfer<T | (() => T)>,
  ): this {
    this.fields.push([field, valueOrGetter]);
    return this;
  }

  public getFields() {
    return [...this.fields];
  }

  protected create(id: Identifier): Metadata {
    const collection = Object.create(null) as Metadata;
    this.populate(collection, id);
    return collection;
  }

  protected populate(meta: Metadata, id: Identifier): Metadata {
    TypedFields.Id.set(meta, id);
    TypedFields.CreationDate.set(meta, new Date());

    for (const [field, valueOrGetter] of this.fields) {
      const value =
        valueOrGetter instanceof Function ? valueOrGetter() : valueOrGetter;

      field.set(meta, value);
    }

    return meta;
  }
}
