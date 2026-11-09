// A context menu command, shown when right-clicking a user (or a message).
// Docs: https://nyx-discord.github.io/nyx/guide/use/commands/types/context-menu.md
import { AbstractContextMenuCommand } from '@nyx-discord/djs';
import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  type UserContextMenuCommandInteraction,
} from 'discord.js';

export class UserInfoCommand extends AbstractContextMenuCommand {
  protected readonly data = new ContextMenuCommandBuilder()
    .setName('User info')
    .setType(ApplicationCommandType.User)
    .toJSON();

  // Implement executeUser() for User menus, executeMessage() for Message menus.
  public override async executeUser(interaction: UserContextMenuCommandInteraction) {
    const user = interaction.targetUser;
    await interaction.reply({ content: `${user.username} joined Discord on ${user.createdAt.toDateString()}`, ephemeral: true });
  }
}
