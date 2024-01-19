/*
 * MIT License
 *
 * Copyright (c) 2024 Amgelo563
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
  PaginationCustomIdBuilder,
  SessionExecutionMeta,
  SessionStage,
  SessionStageArray,
  SessionUpdateInteraction,
  StagePaginationSession,
} from '@nyx-discord/core';
import type { Awaitable } from 'discord.js';

import { AbstractPaginationSession } from '../AbstractPaginationSession.js';

export abstract class AbstractStagePaginationSession<Result>
  extends AbstractPaginationSession<Result>
  implements StagePaginationSession<Result>
{
  protected abstract readonly stages: SessionStageArray;

  public start(meta: SessionExecutionMeta): Awaitable<void> {
    const stage = this.stages[0];

    return stage.onStart(this.startInteraction, meta);
  }

  public override async update(
    interaction: SessionUpdateInteraction,
    meta: SessionExecutionMeta,
  ): Promise<boolean> {
    const codec = this.bot.sessions.getCustomIdCodec();
    const newPage = codec.extractPageFromCustomId(interaction.customId);
    const newStage = this.stages[newPage ?? -1];

    /** Not a stage switch interaction. Route to current interaction. */
    if (newPage === null || !newStage || newPage === this.currentPage) {
      const currentStage = this.getCurrentStage();

      return currentStage.update(interaction, meta);
    }

    const oldStage = this.getCurrentStage();
    await oldStage.onLeave(interaction, newStage, meta);

    this.currentPage = newPage;
    return newStage.onSwitch(interaction, oldStage, meta);
  }

  public getStages(): SessionStageArray {
    return this.stages;
  }

  public getCurrentStage(): SessionStage<unknown> {
    return this.stages[this.currentPage];
  }

  public getNextStage(): SessionStage<unknown> | null {
    const nextPage = this.getNextPage();

    return nextPage ? this.stages[nextPage] : null;
  }

  public getPreviousStage(): SessionStage<unknown> | null {
    const previousPage = this.getPreviousPage();

    return previousPage ? this.stages[previousPage] : null;
  }

  public override getNextPage(): number | null {
    const nextPage = this.currentPage + 1;

    return this.stages[nextPage] ? nextPage : null;
  }

  public override getPreviousPage(): number | null {
    const previousPage = this.currentPage - 1;

    return this.stages[previousPage] ? previousPage : null;
  }

  public getCustomId(): PaginationCustomIdBuilder {
    return this.customId.clone();
  }

  protected updatePage(): Promise<boolean> {
    return Promise.resolve(false);
  }
}
