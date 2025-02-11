import type { SessionCustomIdData } from '@nyx-discord/core';
import { describe } from 'node:test';
import { DefaultSessionCustomIdCodec } from '../../../src';

const createData = (page?: number) => ({
  id: 'test',
  extra: 'extra',
  page: page ?? null,
});
const createCodec = () => DefaultSessionCustomIdCodec.create();

describe('DefaultSessionCustomIdCodec', () => {
  it('SHOULD create an instance of itself', () => {
    expect(DefaultSessionCustomIdCodec.create()).toBeInstanceOf(
      DefaultSessionCustomIdCodec,
    );
  });

  test('GIVEN valid full data THEN serializes to a string', () => {
    const codec = createCodec();

    expect(typeof codec.serialize(createData())).toBe('string');
  });

  test('GIVEN valid partial data THEN serializes to a string', () => {
    const codec = createCodec();
    const partial: SessionCustomIdData = {
      id: 'test',
      extra: null,
      page: null,
    };

    const serialized = codec.serialize(partial);
    const deserialized = codec.deserialize(serialized);

    expect(deserialized).toEqual(partial);
  });

  test('GIVEN valid customId THEN deserializes to its serialize input', () => {
    const codec = createCodec();
    const data = createData();
    const serialized = codec.serialize(data);

    expect(codec.deserialize(serialized)).toEqual(data);
  });

  test('GIVEN invalid customId THEN returns null', () => {
    const codec = createCodec();

    expect(codec.deserialize('invalid')).toBeNull();
  });
});
