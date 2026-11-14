import { DefaultMetadataFactory } from '@nyx-discord/base';
import { describe, expect, test } from 'vitest';
import type { NyxBot } from '../../../src';
import { TypedFields } from '../../../src';

describe('TypedFields (djs)', () => {
  test('GIVEN metadata with only the Bot field WHEN reading DjsBot THEN returns the same bot', () => {
    const bot = {} as NyxBot;
    const meta = DefaultMetadataFactory.createWith([
      TypedFields.Bot,
      bot,
    ]).createOrPopulate(undefined, 'meta');

    expect(TypedFields.DjsBot.get(meta)).toBe(bot);
  });

  test('GIVEN metadata with the Bot field WHEN calling getBot and getClient THEN returns the bot and its client emitter', () => {
    const client = {};
    const bot = {
      getClient: () => ({ getEmitter: () => client }),
    } as unknown as NyxBot;
    const meta = DefaultMetadataFactory.createWith([
      TypedFields.Bot,
      bot,
    ]).createOrPopulate(undefined, 'meta');

    expect(TypedFields.getBot(meta)).toBe(bot);
    expect(TypedFields.getClient(meta)).toBe(client);
  });

  test('GIVEN metadata without the Bot field WHEN calling getBot THEN throws', () => {
    expect(() => TypedFields.getBot(Object.create(null))).toThrow();
  });
});
