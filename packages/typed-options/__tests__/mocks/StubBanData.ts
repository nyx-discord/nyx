import { ChannelType } from 'discord-api-types/v10';
import {
  channel,
  chatInput,
  integer,
  mentionable,
  string,
  user,
} from '../../src';

export const stubBanData = chatInput({
  name: 'ban',
  description: 'Ban a member',
  options: {
    target: user({ description: 'Who', required: true }),
    reason: string({ description: 'Why' }),
    mode: string({
      description: 'How',
      required: true,
      choices: [
        { name: 'Soft', value: 'soft' },
        { name: 'Hard', value: 'hard' },
      ],
    }),
    days: integer({
      description: 'History',
      choices: [
        { name: 'None', value: 0 },
        { name: 'Week', value: 7 },
      ],
    }),
    log: channel({
      description: 'Log channel',
      channel_types: [ChannelType.GuildText],
    }),
    who: mentionable({ description: 'Anyone' }),
  },
});
