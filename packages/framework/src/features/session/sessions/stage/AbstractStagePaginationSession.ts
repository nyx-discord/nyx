import type {
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

  public onStart(meta: SessionExecutionMeta): Awaitable<void> {
    const stage = this.stages[0];

    return stage.onStart(this.startInteraction, meta);
  }

  public override async onUpdate(
    interaction: SessionUpdateInteraction,
    meta: SessionExecutionMeta,
  ): Promise<boolean> {
    const newPage = this.extractPageFromCustomId(interaction.customId);
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

  public buildPageCustomId(page: number, extra?: string): string {
    return this.codec.serialize({
      ...this.customIdData,
      page,
      extra: extra ?? null,
    });
  }

  /** No longer used in stage pagination sessions. */
  protected updatePage(): Promise<boolean> {
    return Promise.resolve(false);
  }
}
