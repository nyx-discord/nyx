import { string, subcommand } from '../../src';

export const stubAddSubcommand = subcommand({
  name: 'add',
  description: 'Add a tag',
  options: { name: string({ description: 'Name', required: true }) },
});
