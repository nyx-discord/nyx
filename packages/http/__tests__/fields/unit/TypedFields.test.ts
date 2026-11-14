import { describe, expect, expectTypeOf, test } from 'vitest';
import type { HttpBot, HttpNyxClient, NyxBot } from '../../../src';
import { DefaultMetadataFactory, TypedFields } from '../../../src';

describe('TypedFields (http)', () => {
  test('GIVEN metadata with only the Bot field WHEN reading HttpBot THEN returns the same bot', () => {
    const bot = {} as NyxBot;
    const meta = DefaultMetadataFactory.createWith([
      TypedFields.Bot,
      bot,
    ]).createOrPopulate(undefined, 'meta');

    expect(TypedFields.HttpBot.get(meta)).toBe(bot);
    expect(TypedFields.getBot(meta)).toBe(bot);
  });

  test('GIVEN the http TypedFields WHEN reading their types THEN HttpBot has an HttpNyxClient and GatewayCoreBot is hidden', () => {
    type HttpBotType = NonNullable<ReturnType<typeof TypedFields.HttpBot.get>>;

    expectTypeOf<
      ReturnType<HttpBotType['getClient']>
    >().toEqualTypeOf<HttpNyxClient>();
    expectTypeOf(TypedFields).not.toHaveProperty('GatewayCoreBot');
    expectTypeOf(TypedFields).not.toHaveProperty('getClient');
    expectTypeOf(TypedFields).toHaveProperty('getApi');
    expectTypeOf(TypedFields).toHaveProperty('getLogger');
    expectTypeOf(TypedFields.getBot).returns.toEqualTypeOf<HttpBot>();
  });
});
