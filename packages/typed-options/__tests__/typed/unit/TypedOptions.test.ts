import type {
  APIInteractionDataResolvedGuildMember,
  APIUser,
  ChannelType,
} from 'discord-api-types/v10';
import { describe, expectTypeOf, test } from 'vitest';
import { stubAddSubcommand } from '#mocks/StubAddSubcommand';
import { stubBanData } from '#mocks/StubBanData';
import { stubCoreInteraction } from '#mocks/stubCoreInteraction';
import { stubTagData } from '#mocks/StubTagData';
import { typedOptions } from '../../../src/djs-core';

// only the types matter here, so the interaction is a stub
const interaction = stubCoreInteraction([]);

describe('TypedOptions (types)', () => {
  const options = typedOptions(stubBanData, interaction);

  test('GIVEN required and optional options WHEN reading them THEN nullability follows required', () => {
    expectTypeOf(options.getUser('target')).toEqualTypeOf<APIUser>();
    expectTypeOf(options.getString('reason')).toEqualTypeOf<string | null>();
  });

  test('GIVEN a user option WHEN reading its member THEN it is always nullable', () => {
    expectTypeOf(
      options.getMember('target'),
    ).toEqualTypeOf<APIInteractionDataResolvedGuildMember | null>();

    // @ts-expect-error members are always nullable
    const member: APIInteractionDataResolvedGuildMember =
      options.getMember('target');
    void member;
  });

  test('GIVEN choices WHEN reading the option THEN the type is the union of their values', () => {
    expectTypeOf(options.getString('mode')).toEqualTypeOf<'soft' | 'hard'>();
    expectTypeOf(options.getInteger('days')).toEqualTypeOf<0 | 7 | null>();
  });

  test('GIVEN channel types WHEN reading the channel THEN its type is narrowed', () => {
    expectTypeOf(options.getChannel('log')?.type).toEqualTypeOf<
      ChannelType.GuildText | undefined
    >();

    // @ts-expect-error narrowed to guild text channels
    const type: ChannelType.DM | undefined = options.getChannel('log')?.type;
    void type;
  });

  test('GIVEN a wrong name or kind WHEN reading an option THEN it does not compile', () => {
    // @ts-expect-error there is no option with that name
    options.getString('reasn');
    // @ts-expect-error target is a user option
    options.getString('target');
    // @ts-expect-error optional options are nullable
    const reason: string = options.getString('reason');
    void reason;
  });

  test('GIVEN a subcommand WHEN typing it by its own data THEN only its options are available', () => {
    expectTypeOf(
      typedOptions(stubAddSubcommand, interaction).getString('name'),
    ).toEqualTypeOf<string>();

    // @ts-expect-error the command itself has no options
    typedOptions(stubTagData, interaction).getString('name');
  });
});
