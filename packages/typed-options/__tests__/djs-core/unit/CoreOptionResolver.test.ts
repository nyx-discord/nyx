import {
  ApplicationCommandOptionType,
  ChannelType,
} from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { stubAddSubcommand } from '#mocks/StubAddSubcommand';
import { stubBanData } from '#mocks/StubBanData';
import { stubCoreInteraction } from '#mocks/stubCoreInteraction';
import { typedOptions } from '../../../src/djs-core';

const user = { id: '1', username: 'user' };
const member = { roles: [] };

describe('CoreOptionResolver (options)', () => {
  const interaction = stubCoreInteraction(
    [
      { name: 'target', type: ApplicationCommandOptionType.User, value: '1' },
      {
        name: 'mode',
        type: ApplicationCommandOptionType.String,
        value: 'soft',
      },
      { name: 'days', type: ApplicationCommandOptionType.Integer, value: 7 },
      { name: 'log', type: ApplicationCommandOptionType.Channel, value: '9' },
    ],
    {
      users: { '1': user },
      members: { '1': member },
      channels: { '9': { id: '9', type: ChannelType.GuildText } },
    },
  );

  test('GIVEN a bare payload WHEN reading options THEN values and resolved entities are returned', () => {
    const options = typedOptions(stubBanData, interaction);

    expect(options.getUser('target')).toBe(user);
    expect(options.getMember('target')).toBe(member);
    expect(options.getString('mode')).toBe('soft');
    expect(options.getInteger('days')).toBe(7);
    expect(options.getChannel('log')?.id).toBe('9');
  });

  test('GIVEN core event props WHEN reading options THEN the wrapped interaction is read', () => {
    const options = typedOptions(stubBanData, { data: interaction });

    expect(options.getString('mode')).toBe('soft');
  });

  test('GIVEN missing options WHEN reading them THEN null is returned', () => {
    const options = typedOptions(
      stubBanData,
      stubCoreInteraction(
        [
          {
            name: 'target',
            type: ApplicationCommandOptionType.User,
            value: '1',
          },
        ],
        { users: { '1': user } },
      ),
    );

    expect(options.getString('reason')).toBeNull();
    expect(options.getMember('target')).toBeNull();
    expect(options.getChannel('log')).toBeNull();
  });

  test('GIVEN a mentionable role WHEN reading it THEN the role is returned', () => {
    const options = typedOptions(
      stubBanData,
      stubCoreInteraction(
        [
          {
            name: 'who',
            type: ApplicationCommandOptionType.Mentionable,
            value: '5',
          },
        ],
        { roles: { '5': { id: '5' } } },
      ),
    );

    expect(options.getMentionable('who')).toEqual({ id: '5' });
  });

  test('GIVEN a subcommand WHEN reading options THEN they are found inside it', () => {
    const options = typedOptions(
      stubAddSubcommand,
      stubCoreInteraction([
        {
          name: 'add',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'name',
              type: ApplicationCommandOptionType.String,
              value: 'faq',
            },
          ],
        },
      ]),
    );

    expect(options.getString('name')).toBe('faq');
  });

  test('GIVEN a subcommand inside a group WHEN reading options THEN they are found inside it', () => {
    const options = typedOptions(
      stubAddSubcommand,
      stubCoreInteraction([
        {
          name: 'admin',
          type: ApplicationCommandOptionType.SubcommandGroup,
          options: [
            {
              name: 'add',
              type: ApplicationCommandOptionType.Subcommand,
              options: [
                {
                  name: 'name',
                  type: ApplicationCommandOptionType.String,
                  value: 'deep',
                },
              ],
            },
          ],
        },
      ]),
    );

    expect(options.getString('name')).toBe('deep');
  });
});
