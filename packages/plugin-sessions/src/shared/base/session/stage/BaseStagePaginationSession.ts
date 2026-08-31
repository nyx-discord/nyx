import type { Awaitable, InteractionTypes, Metadata } from '@nyx-discord/types';
import type { SessionUpdateInteraction } from '../../../types/interaction/SessionUpdateInteraction';
import { BasePaginationSession } from '../BasePaginationSession.js';
import type { SessionStage } from '../../../types/session/stage/SessionStage.js';
import type { SessionStageArray } from '../../../types/session/stage/SessionStageArray.js';
import type { StagePaginationSession } from '../../../types/session/stage/StagePaginationSession.js';

export abstract class BaseStagePaginationSession<
  Result,
  Types extends InteractionTypes = InteractionTypes,
>
  extends BasePaginationSession<Result, Types>
  implements StagePaginationSession<Result, Types>
{
  protected abstract readonly stages: SessionStageArray<Types>;

  public onStart(meta: Metadata): Awaitable<void> {
    const stage = this.stages[0];

    return stage.onStart(this.startInteraction, meta);
  }

  public getStages(): Readonly<SessionStageArray<Types>> {
    return this.stages;
  }

  public getCurrentStage(): SessionStage<unknown, Types> {
    return this.stages[this.currentPage] as SessionStage<unknown, Types>;
  }

  public getNextStage(): SessionStage<unknown, Types> | null {
    const nextPage = this.currentPage + 1;
    return nextPage ? (this.stages[nextPage] ?? null) : null;
  }

  public getPreviousStage(): SessionStage<unknown, Types> | null {
    const previousPage = this.currentPage - 1;
    return previousPage ? (this.stages[previousPage] ?? null) : null;
  }

  public override getNextPage(): number | null {
    const nextPage = this.currentPage + 1;
    return this.stages[nextPage] ? nextPage : null;
  }

  public override getPreviousPage(): number | null {
    const previousPage = this.currentPage - 1;

    return this.stages[previousPage] ? previousPage : null;
  }

  public override buildPageCustomId(page: number, extra?: string): string {
    return this.codec.serialize({
      ...this.customIdData,
      page,
      extra: extra ?? null,
    });
  }

  /** Routes a stage update given the page extracted from an interaction's customId. */
  protected async routeUpdate(
    newPage: number | null,
    interaction: SessionUpdateInteraction<Types>,
    meta: Metadata,
  ): Promise<boolean> {
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

  /** No longer used in stage pagination sessions. */
  protected override updatePage(): Promise<boolean> {
    return Promise.resolve(false);
  }
}
