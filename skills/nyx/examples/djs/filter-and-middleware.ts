// Filters restrict one command; middlewares run before every command.
// Docs: https://nyx-discord.github.io/nyx/guide/use/commands/filters.md
//       https://nyx-discord.github.io/nyx/guide/use/commands/middlewares.md
import {
  AbstractStandaloneCommand,
  BaseCommandFilter,
  BaseCommandMiddleware,
  type AnyExecutableCommand,
  type CommandFilterResolvable,
  type CommandResolvableInteraction,
  type DjsInteractionTypes,
  type Metadata,
} from '@nyx-discord/djs';
import { PermissionFlagsBits, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';

// A filter returns a boolean. When it returns false the command just doesn't run:
// nyx doesn't reply for you, so reply in the filter if the user should know why.
export class PermissionFilter extends BaseCommandFilter {
  constructor(protected readonly permissions: bigint) {
    super();
  }

  public async check(
    _command: AnyExecutableCommand,
    interaction: CommandResolvableInteraction<DjsInteractionTypes>,
    _meta: Metadata,
  ): Promise<boolean> {
    if (interaction.inCachedGuild() && interaction.member.permissions.has(this.permissions)) return true;

    if (interaction.isRepliable()) {
      await interaction.reply({ content: "You can't use this.", ephemeral: true });
    }
    return false;
  }
}

// A filter can also be a plain function.
const guildOnly: CommandFilterResolvable<DjsInteractionTypes> = (_command, interaction) => interaction.inGuild();

export class PurgeCommand extends AbstractStandaloneCommand {
  protected readonly data = new SlashCommandBuilder().setName('purge').setDescription('Delete messages').toJSON();

  protected override readonly filter = new PermissionFilter(PermissionFlagsBits.ManageMessages);

  public async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply('Purged!');
  }
}

export class HelloCommand extends AbstractStandaloneCommand {
  protected readonly data = new SlashCommandBuilder().setName('hello').setDescription('Say hello').toJSON();

  protected override readonly filter = guildOnly;

  public async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply('Hello!');
  }
}

// Middlewares return a MiddlewareResponse: this.true() continues, this.false() stops the command.
// Register with bot.getCommandManager().getExecutor().getMiddleware().add(new LoggingMiddleware()).
export class LoggingMiddleware extends BaseCommandMiddleware {
  public async check(
    command: AnyExecutableCommand,
    interaction: CommandResolvableInteraction<DjsInteractionTypes>,
    _meta: Metadata,
  ) {
    console.log(`${interaction.user.tag} used ${command.getData().name}`);
    return this.true();
  }
}

