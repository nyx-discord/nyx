// A parent command with subcommands and a subcommand group: /mod ban, /mod settings view.
// Docs: https://nyx-discord.github.io/nyx/guide/use/commands/types/parent.md
//       https://nyx-discord.github.io/nyx/guide/use/commands/types/parent/subcommand.md
//       https://nyx-discord.github.io/nyx/guide/use/commands/types/parent/subcommand-group.md
import {
  AbstractParentCommand,
  AbstractSubCommand,
  AbstractSubCommandGroup,
  type ParentCommand,
  type SubCommandGroup,
} from '@nyx-discord/djs';
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  type ChatInputCommandInteraction,
} from 'discord.js';

// Children receive their parent (a parent command or a group) in the constructor.
class BanSubCommand extends AbstractSubCommand {
  protected readonly data = new SlashCommandSubcommandBuilder()
    .setName('ban')
    .setDescription('Ban a user')
    .addUserOption((option) => option.setName('user').setDescription('Who to ban').setRequired(true))
    .toJSON();

  public async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user', true);
    await interaction.reply(`Banning ${user.username}...`);
  }
}

class ViewSettingsSubCommand extends AbstractSubCommand {
  protected readonly data = new SlashCommandSubcommandBuilder()
    .setName('view')
    .setDescription('View the moderation settings')
    .toJSON();

  public async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({ content: 'Settings: ...', ephemeral: true });
  }
}

// Groups aren't executable, they only hold subcommands.
class SettingsGroup extends AbstractSubCommandGroup {
  protected readonly data = new SlashCommandSubcommandGroupBuilder()
    .setName('settings')
    .setDescription('Moderation settings')
    .toJSON();

  constructor(parent: ParentCommand) {
    super(parent);
    this.addChildren(new ViewSettingsSubCommand(this));
  }
}

// Parents aren't executable either. Their `data` must not include options: children are added below.
export class ModCommand extends AbstractParentCommand {
  protected readonly data = new SlashCommandBuilder().setName('mod').setDescription('Moderation commands').toJSON();

  constructor() {
    super();
    this.addChildren(new BanSubCommand(this), new SettingsGroup(this));
  }
}

// Type children's parents with the interfaces, not the Abstract classes.
export function createSubCommandFor(parent: ParentCommand | SubCommandGroup) {
  return new BanSubCommand(parent);
}
