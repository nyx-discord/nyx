import { TypedFields } from '@nyx-discord/types';
import { describe, expect, it } from 'vitest';
import { DefaultMetadataFactory } from '../../src';

describe('DefaultMetadataFactory', () => {
  it('SHOULD allow adding and retrieving fields', () => {
    const factory = new DefaultMetadataFactory();
    factory.addDefaultField(TypedFields.Id, 'testValue');

    expect(factory.getFields()).toHaveLength(1);
    expect(factory.getFields()[0]![1]).toBe('testValue');
  });

  it('SHOULD create or populate metadata', () => {
    const factory = DefaultMetadataFactory.createWith([
      TypedFields.Bot,
      'testValue',
    ] as any);

    const meta = factory.createOrPopulate(undefined, 'my-id');
    expect(TypedFields.Bot.get(meta)).toBe('testValue');
    expect(TypedFields.Id.get(meta)).toBe('my-id');
    expect(TypedFields.CreationDate.get(meta)).toBeInstanceOf(Date);

    const existingMeta = {};
    const populated = factory.createOrPopulate(existingMeta, 'my-id-2');
    expect(populated).toBe(existingMeta);
    expect(TypedFields.Bot.get(populated)).toBe('testValue');
  });
});
