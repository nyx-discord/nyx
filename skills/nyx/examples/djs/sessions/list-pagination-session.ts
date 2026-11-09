// A paginated list: pass the items, render getCurrentPageItems(), and page buttons switch pages for you.
// Docs: https://nyx-discord.github.io/nyx/guide/session/types/pagination-session.md
//       https://nyx-discord.github.io/nyx/guide/session/types/list-pagination-session.md
import { randomBytes } from 'node:crypto';

import { AbstractStandaloneCommand, TypedFields, type Metadata } from '@nyx-discord/djs';
import {
  AbstractListPaginationSession,
  type DjsSessionUpdateInteraction,
} from '@nyx-discord/plugin-sessions/djs';
import { EmbedBuilder, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';

type Warning = { reason: string; date: Date };

// Type arguments: the item type, then the session's result type.
export class WarningsSession extends AbstractListPaginationSession<Warning, void> {
  public async onStart() {
    // buildBasicPageRow() makes previous/next buttons whose customIds point at the right pages.
    await this.startInteraction.reply({ embeds: [this.buildEmbed()], components: [this.buildBasicPageRow()] });
  }

  // Called after currentPage changes because the user clicked a page button.
  // Interactions that don't point at a page go to handleButton/handleSelectMenu/handleModal instead.
  protected async updatePage(interaction: DjsSessionUpdateInteraction): Promise<boolean> {
    if ('update' in interaction) {
      await interaction.update({ embeds: [this.buildEmbed()], components: [this.buildBasicPageRow()] });
    }
    return true; // Renew the TTL.
  }

  public async onEnd() {
    await this.startInteraction.editReply({ components: [] });
  }

  protected buildEmbed() {
    const lines = this.getCurrentPageItems().map((warning) => `- ${warning.reason} (${warning.date.toDateString()})`);
    return new EmbedBuilder()
      .setTitle(`Warnings, page ${this.currentPage + 1}`)
      .setDescription(lines.join('\n') || 'No warnings.');
  }
}

export class WarningsCommand extends AbstractStandaloneCommand {
  protected readonly data = new SlashCommandBuilder().setName('warnings').setDescription('List your warnings').toJSON();

  public async execute(interaction: ChatInputCommandInteraction, meta: Metadata) {
    // Load the items from your own storage.
    const items: Warning[] = [{ reason: 'Spam', date: new Date() }];

    const session = new WarningsSession({
      bot: TypedFields.Bot.get(meta, true),
      id: randomBytes(6).toString('base64url'),
      startInteraction: interaction,
      items,
      itemsPerPage: 5,
    });
    await session.start();
  }
}
