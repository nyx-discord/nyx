import type { Metadata, NyxBot } from '@nyx-discord/framework';
import {
  NotImplementedError,
  ObjectNotFoundError,
} from '@nyx-discord/framework';
import type {
  ActionRowData,
  AnySelectMenuInteraction,
  Awaitable,
  ButtonInteraction,
  InteractionButtonComponentData,
  ModalSubmitInteraction,
} from 'discord.js';
import { ButtonStyle, ComponentType } from 'discord.js';
import type { SessionCustomIdData } from '../../../core/customId/data/SessionCustomIdData';
import type { SessionCustomIdCodec } from '../../../core/customId/SessionCustomIdCodec';
import type { SessionUpdateInteraction } from '../../../core/interaction/SessionUpdateInteraction';
import type { SessionStage } from '../../../core/session/stage/SessionStage';
import type { StagePaginationSession } from '../../../core/session/stage/StagePaginationSession';
import { SessionPlugin } from '../../SessionPlugin';

export abstract class AbstractSessionStage<Result = void>
  implements SessionStage<Result>
{
  protected readonly bot: NyxBot;

  protected readonly codec: SessionCustomIdCodec;

  protected readonly session: StagePaginationSession<unknown>;

  protected readonly customIdData: SessionCustomIdData;

  protected result: Result | null = null;

  constructor(session: StagePaginationSession<unknown>) {
    this.bot = session.getBot();
    this.session = session;
    this.customIdData = session.getCustomIdData();
    const plugin = session
      .getBot()
      .getPluginManager()
      .getPluginByClass(SessionPlugin, true);
    this.codec = plugin.getCustomIdCodec();
  }

  public abstract onSwitch(
    interaction: SessionUpdateInteraction,
    previousStage: SessionStage<unknown>,
    meta: Metadata,
  ): Awaitable<boolean>;

  public abstract onLeave(
    interaction: SessionUpdateInteraction,
    nextStage: SessionStage<unknown>,
    meta: Metadata,
  ): Awaitable<void>;

  public async update(
    interaction: SessionUpdateInteraction,
    meta: Metadata,
  ): Promise<boolean> {
    if (interaction.isButton()) return this.handleButton(interaction, meta);
    if (interaction.isModalSubmit()) {
      return this.handleModal(interaction, meta);
    }
    return this.handleSelect(interaction, meta);
  }

  public getSession(): StagePaginationSession<unknown> {
    return this.session;
  }

  public getResult(): Result | null {
    return this.result;
  }

  /** Handles a {@link ButtonInteraction} whose customId matches this session stage. */
  protected handleButton(
    _interaction: ButtonInteraction,
    _meta: Metadata,
  ): Awaitable<boolean> {
    throw new NotImplementedError();
  }

  /** Handles an {@link AnySelectMenuInteraction} whose customId matches this session stage. */
  protected handleSelect(
    _interaction: AnySelectMenuInteraction,
    _meta: Metadata,
  ): Awaitable<boolean> {
    throw new NotImplementedError();
  }

  /** Handles a {@link ModalSubmitInteraction} whose customId matches this session stage. */
  protected handleModal(
    _interaction: ModalSubmitInteraction,
    _meta: Metadata,
  ): Awaitable<boolean> {
    throw new NotImplementedError();
  }

  /** Utility to build a pagination ActionRow, considering next/previous pages and disabling buttons accordingly. */
  protected buildBasicPageRow(): ActionRowData<InteractionButtonComponentData> {
    const currentPage = this.session.getCurrentPage();

    const nextPage = currentPage + 1;
    const previousPage = currentPage - 1;

    return {
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          customId: this.buildPageCustomId(previousPage),
          emoji: '⬅',
          style: ButtonStyle.Secondary,
          disabled: currentPage === 0,
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Secondary,
          customId: this.buildPageCustomId(nextPage),
          emoji: '➡',
          disabled: currentPage === this.session.getStages().length - 1,
        },
      ],
    };
  }

  /** Builds a customId for a given stage. */
  protected buildCustomIdForStage(
    stage: SessionStage<unknown>,
    extra?: string,
  ): string {
    const page = this.session.getStages().indexOf(stage);
    if (page === -1) {
      throw new ObjectNotFoundError('Stage not found in session');
    }
    return this.buildPageCustomId(page, extra);
  }

  /** Builds a customId for a given page. */
  protected buildPageCustomId(page: number, extra?: string): string {
    return this.codec.serialize({
      ...this.customIdData,
      page,
      extra: extra ?? null,
    });
  }
}
