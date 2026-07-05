import type { TypedField } from 'typed-field';
import type { Identifier } from '../identity/Identifier';
import type { Metadata } from './Metadata';

/** Creates {@link Metadata}s populated with nyx-specific fields. */
export interface MetadataFactory {
  /** Creates a new {@link Metadata} populated with nyx-specific fields, or populates the passed one. */
  createOrPopulate(collection: Metadata | undefined, id: Identifier): Metadata;

  /** Adds a default field that will be populated to {@link Metadata}s created or populated by this factory. */
  addDefaultField<T>(
    field: TypedField<T>,
    valueOrGetter: NoInfer<T> | (() => NoInfer<T>),
  ): this;
}
