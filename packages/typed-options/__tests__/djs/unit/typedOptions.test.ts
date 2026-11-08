import { stubBanData } from '#mocks/StubBanData';
import type { APIInteractionDataResolvedGuildMember } from 'discord-api-types/v10';
import type {
  ChatInputCommandInteraction,
  GuildMember,
  User,
} from 'discord.js';
import { describe, expect, expectTypeOf, test } from 'vitest';
import { typedOptions } from '../../../src/djs';

// only the types matter here, so the interaction is a stub
const interaction = {
  options: {
    getUser: () => null,
    getString: () => null,
    getMember: () => null,
  },
} as unknown as ChatInputCommandInteraction;

describe('typedOptions (discord.js)', () => {
  test('GIVEN an interaction WHEN typing its options THEN the discord.js resolver is returned', () => {
    expect(typedOptions(stubBanData, interaction)).toBe(interaction.options);
  });

  test('GIVEN command data WHEN reading options THEN getters are typed by definition', () => {
    const options = typedOptions(stubBanData, interaction);

    expectTypeOf(options.getUser('target')).toEqualTypeOf<User>();
    expectTypeOf(options.getString('mode')).toEqualTypeOf<'soft' | 'hard'>();
    expectTypeOf(options.getMember('target')).toEqualTypeOf<
      GuildMember | APIInteractionDataResolvedGuildMember | null
    >();

    // @ts-expect-error there is no option with that name
    options.getString('reasn');
  });
});
