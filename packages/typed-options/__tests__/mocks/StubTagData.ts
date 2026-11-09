import { chatInput, group, subcommand } from '../../src';
import { stubAddSubcommand } from './StubAddSubcommand';

export const stubTagData = chatInput({
  name: 'tag',
  description: 'Tags',
  subcommands: [
    stubAddSubcommand,
    group({
      name: 'admin',
      description: 'Admin',
      subcommands: [subcommand({ name: 'purge', description: 'Purge' })],
    }),
  ],
});
