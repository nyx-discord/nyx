import type { CommandCustomIdData } from '@nyx-discord/core';
import { ApplicationCommandType } from 'discord.js';
import { describe } from 'node:test';
import { DefaultCommandCustomIdCodec } from '../../../../dist';

const createData = () => ({
  type: ApplicationCommandType.ChatInput,
  name: 'test',
  extra: 'extra',
  subcommand: 'subcommand',
  group: 'group',
});
const createCodec = () => DefaultCommandCustomIdCodec.create();

describe('DefaultCustomIdCodec', () => {
  it('SHOULD create an instance of itself', () => {
    expect(DefaultCommandCustomIdCodec.create()).toBeInstanceOf(
      DefaultCommandCustomIdCodec,
    );
  });

  test('GIVEN valid full data THEN serializes to a string', () => {
    const codec = createCodec();

    expect(typeof codec.serialize(createData())).toBe('string');
  });

  test('GIVEN valid partial data THEN serializes to a string', () => {
    const codec = createCodec();
    const partial: CommandCustomIdData = {
      type: ApplicationCommandType.ChatInput,
      name: 'test',
      extra: null,
      subcommand: null,
      group: null,
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
