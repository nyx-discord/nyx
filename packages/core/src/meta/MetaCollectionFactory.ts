import { TypedField } from 'typed-field';
import { Identifier } from '../identity/Identifier';
import { MetaCollection } from './MetaCollection';

/** Creates {@link MetaCollection}s populated with nyx-specific fields. */
export interface MetaCollectionFactory {
  /** Creates a new {@link MetaCollection} populated with nyx-specific fields, or populates the passed one. */
  createOrPopulate(
    collection: MetaCollection | undefined,
    id: Identifier,
  ): MetaCollection;

  /** Creates a new {@link MetaCollection} populated with nyx-specific fields. */
  create(id: Identifier): MetaCollection;

  /** Populates the passed {@link MetaCollection} with nyx-specific fields. */
  populate(collection: MetaCollection, id: Identifier): MetaCollection;

  /** Adds a default field that will be populated to newly created {@link MetaCollection}s. */
  addDefaultField<T>(
    field: TypedField<T>,
    valueOrGetter: NoInfer<T> | (() => NoInfer<T>),
  ): this;
}
