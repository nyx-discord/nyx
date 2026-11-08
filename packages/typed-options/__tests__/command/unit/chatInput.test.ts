import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { stubBanData } from '#mocks/StubBanData';
import { stubTagData } from '#mocks/StubTagData';

describe('chatInput (command data)', () => {
  test('GIVEN an options record WHEN creating data THEN options are named in order', () => {
    expect(stubBanData.options?.map((option) => option.name)).toEqual([
      'target',
      'reason',
      'mode',
      'days',
      'log',
      'who',
    ]);
  });

  test('GIVEN a required user option WHEN creating data THEN it is plain API JSON', () => {
    expect(stubBanData.options?.[0]).toMatchObject({
      name: 'target',
      type: ApplicationCommandOptionType.User,
      required: true,
    });
  });

  test('GIVEN subcommands and groups WHEN creating data THEN they become options', () => {
    expect(
      stubTagData.options?.map((option) => [option.name, option.type]),
    ).toEqual([
      ['add', ApplicationCommandOptionType.Subcommand],
      ['admin', ApplicationCommandOptionType.SubcommandGroup],
    ]);
  });

  test('GIVEN created data WHEN checking for the brand THEN it does not exist at runtime', () => {
    expect(Object.getOwnPropertySymbols(stubBanData)).toHaveLength(0);
  });
});
