import { DefaultMetadataFactory } from '@nyx-discord/base';
import type { API, Client } from '@discordjs/core';
import { describe, expect, expectTypeOf, test } from 'vitest';
import type { CoreClient, CoreNyxClient, NyxBot } from '../../../src';
import { TypedFields } from '../../../src';

describe('TypedFields (djs-core)', () => {
  test('GIVEN metadata with only the Bot field WHEN reading the adapter fields THEN returns the same bot', () => {
    const bot = {} as NyxBot;
    const meta = DefaultMetadataFactory.createWith([
      TypedFields.Bot,
      bot,
    ]).createOrPopulate(undefined, 'meta');

    expect(TypedFields.CoreBot.get(meta)).toBe(bot);
    expect(TypedFields.GatewayCoreBot.get(meta)).toBe(bot);
  });

  test('GIVEN the adapter fields WHEN reading their clients THEN they are typed', () => {
    type CoreBotType = NonNullable<ReturnType<typeof TypedFields.CoreBot.get>>;
    type GatewayBotType = NonNullable<
      ReturnType<typeof TypedFields.GatewayCoreBot.get>
    >;

    expectTypeOf<
      ReturnType<CoreBotType['getClient']>
    >().toEqualTypeOf<CoreClient>();
    expectTypeOf<
      ReturnType<GatewayBotType['getClient']>
    >().toEqualTypeOf<CoreNyxClient>();
    expectTypeOf<
      ReturnType<ReturnType<GatewayBotType['getClient']>['getEmitter']>
    >().toEqualTypeOf<Client>();
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
    expectTypeOf(TypedFields.getClient).returns.toEqualTypeOf<Client>();
  });

  test('GIVEN metadata with the Bot field WHEN calling getApi THEN returns the client API', () => {
    const api = {};
    const bot = {
      getClient: () => ({ getApi: () => api }),
    } as unknown as NyxBot;
    const meta = DefaultMetadataFactory.createWith([
      TypedFields.Bot,
      bot,
    ]).createOrPopulate(undefined, 'meta');

    expect(TypedFields.getApi(meta)).toBe(api);
    expectTypeOf(TypedFields.getApi).returns.toEqualTypeOf<API>();
  });
});
