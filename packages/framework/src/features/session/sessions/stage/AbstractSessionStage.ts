/*
 * MIT License
 *
 * Copyright (c) 2023 Amgelo563
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type {
  NyxBot,
  PaginationCustomIdBuilder,
  SessionExecutionMeta,
  SessionStage,
  SessionUpdateInteraction,
  StagePaginationSession,
} from '@nyx-discord/core';
import { ObjectNotFoundError } from '@nyx-discord/core';
import type {
  ActionRowData,
  AnySelectMenuInteraction,
  Awaitable,
  ButtonInteraction,
  InteractionButtonComponentData,
  ModalSubmitInteraction,
} from 'discord.js';
import { ButtonStyle, ComponentType } from 'discord.js';

import { NotImplementedError } from '../../../../errors/NotImplementedError.js';

export abstract class AbstractSessionStage<Result = void>
  implements SessionStage<Result>
{
  public readonly bot: NyxBot;

  protected readonly session: StagePaginationSession<unknown>;

  protected customId: PaginationCustomIdBuilder;

  protected result: Result | null = null;

  constructor(session: StagePaginationSession<unknown>) {
    this.bot = session.bot;
    this.session = session;
    this.customId = session.getCustomId();
  }

  public abstract onSwitch(
    interaction: SessionUpdateInteraction,
    previousStage: SessionStage<unknown>,
    meta: SessionExecutionMeta,
  ): Awaitable<boolean>;

  public abstract onLeave(
    interaction: SessionUpdateInteraction,
    nextStage: SessionStage<unknown>,
    meta: SessionExecutionMeta,
  ): Awaitable<void>;

  public async update(
    interaction: SessionUpdateInteraction,
    meta: SessionExecutionMeta,
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

  protected handleButton(
    _interaction: ButtonInteraction,
    _meta: SessionExecutionMeta,
  ): Awaitable<boolean> {
    throw new NotImplementedError();
  }

  protected handleSelect(
    _interaction: AnySelectMenuInteraction,
    _meta: SessionExecutionMeta,
  ): Awaitable<boolean> {
    throw new NotImplementedError();
  }

  protected handleModal(
    _interaction: ModalSubmitInteraction,
    _meta: SessionExecutionMeta,
  ): Awaitable<boolean> {
    throw new NotImplementedError();
  }

  protected buildDefaultPageRow(): ActionRowData<InteractionButtonComponentData> {
    const currentPage = this.session.getCurrentPage();

    const nextPage = currentPage + 1;
    const previousPage = currentPage - 1;

    return {
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          customId: this.buildCustomIdForPage(previousPage),
          emoji: '⬅',
          style: ButtonStyle.Secondary,
          disabled: currentPage === 0,
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Secondary,
          customId: this.buildCustomIdForPage(nextPage),
          emoji: '➡',
          disabled: currentPage === this.session.getStages().length - 1,
        },
      ],
    };
  }

  protected buildCustomIdForStage(stage: SessionStage<unknown>): string {
    const page = this.session.getStages().indexOf(stage);

    if (page === -1) {
      throw new ObjectNotFoundError('Stage not found in session');
    }

    return this.buildCustomIdForPage(page);
  }

  protected buildCustomIdForPage(page: number): string {
    return this.customId.clone().setPage(page).build();
  }
}
