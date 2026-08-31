import { NotImplementedError } from '@nyx-discord/base';
import type {
  Awaitable,
  InteractionTypes,
  Metadata,
  NyxBot,
} from '@nyx-discord/types';
import { ObjectNotFoundError } from '@nyx-discord/types';
import type {
  APIActionRowComponent,
  APIButtonComponent,
} from 'discord-api-types/v10';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import type { SessionCustomIdData } from '../../../types/customId/data/SessionCustomIdData.js';
import type { SessionCustomIdCodec } from '../../../types/customId/SessionCustomIdCodec.js';
import type { SessionUpdateInteraction } from '../../../types/interaction/SessionUpdateInteraction.js';
import { BaseSessionPlugin } from '../../plugin/BaseSessionPlugin.js';
import type { SessionStage } from '../../../types/session/stage/SessionStage.js';
import type { StagePaginationSession } from '../../../types/session/stage/StagePaginationSession.js';

export abstract class BaseSessionStage<
  Result,
  Types extends InteractionTypes = InteractionTypes,
> implements SessionStage<Result, Types> {
  protected readonly bot: NyxBot;

  protected readonly codec: SessionCustomIdCodec;

  protected readonly session: StagePaginationSession<unknown, Types>;

  protected readonly customIdData: SessionCustomIdData;

  protected result: Result | null = null;

  constructor(session: StagePaginationSession<unknown, Types>) {
    this.bot = session.getBot();
    this.session = session;
    this.customIdData = session.getCustomIdData();
    this.codec = BaseSessionPlugin.getFromBot<Types>(
      session.getBot(),
    ).getCustomIdCodec();
  }

  public abstract onSwitch(
    interaction: SessionUpdateInteraction<Types>,
    previousStage: SessionStage<unknown, Types>,
    meta: Metadata,
  ): Awaitable<boolean>;

  public abstract onLeave(
    interaction: SessionUpdateInteraction<Types>,
    nextStage: SessionStage<unknown, Types>,
    meta: Metadata,
  ): Awaitable<void>;

  public abstract update(
    interaction: SessionUpdateInteraction<Types>,
    meta: Metadata,
  ): Awaitable<boolean>;

  public getSession(): StagePaginationSession<unknown, Types> {
    return this.session;
  }

  public getResult(): Result | null {
    return this.result;
  }

  /** Handles a button interaction whose customId matches this session stage. */
  protected handleButton(
    _interaction: Types['ButtonInteraction'],
    _meta: Metadata,
  ): Awaitable<boolean> {
    throw new NotImplementedError();
  }

  /** Handles a select menu interaction whose customId matches this session stage. */
  protected handleSelect(
    _interaction: Types['SelectMenuInteraction'],
    _meta: Metadata,
  ): Awaitable<boolean> {
    throw new NotImplementedError();
  }

  /** Handles a modal submit interaction whose customId matches this session stage. */
  protected handleModal(
    _interaction: Types['ModalSubmitInteraction'],
    _meta: Metadata,
  ): Awaitable<boolean> {
    throw new NotImplementedError();
  }

  /** Utility to build a pagination ActionRow, considering next/previous pages and disabling buttons accordingly. */
  protected buildBasicPageRow(): APIActionRowComponent<APIButtonComponent> {
    const currentPage = this.session.getCurrentPage();

    const nextPage = currentPage + 1;
    const previousPage = currentPage - 1;

    return {
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          custom_id: this.buildPageCustomId(previousPage),
          emoji: { name: '⬅' },
          style: ButtonStyle.Secondary,
          disabled: currentPage === 0,
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Secondary,
          custom_id: this.buildPageCustomId(nextPage),
          emoji: { name: '➡' },
          disabled: currentPage === this.session.getStages().length - 1,
        },
      ],
    };
  }

  /** Builds a customId for a given stage. */
  protected buildCustomIdForStage(
    stage: SessionStage<unknown, Types>,
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
