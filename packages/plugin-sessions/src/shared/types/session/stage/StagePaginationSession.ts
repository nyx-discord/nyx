import type { InteractionTypes } from '@nyx-discord/types';
import type { PaginationSession } from '../PaginationSession.js';
import type { SessionStage } from './SessionStage.js';
import type { SessionStageArray } from './SessionStageArray.js';

/**
 * A type of session that paginates a list of {@link SessionStage}.
 *
 * You can use this to start complex step by step sessions, each step being
 * called a "stage". Stages can also be seen as a way to "nest" sessions.
 *
 * For example:
 * * A session to create a ticket category.
 * * A session to set up server settings.
 */
export interface StagePaginationSession<
  Result,
  Types extends InteractionTypes = InteractionTypes,
> extends PaginationSession<Result, Types> {
  /** Returns the stage previous to the current one, if any. */
  getPreviousStage(): SessionStage<unknown, Types> | null;

  /** Returns the stage next to the current one, if any. */
  getNextStage(): SessionStage<unknown, Types> | null;

  /** Returns the current stage. */
  getCurrentStage(): SessionStage<unknown, Types>;

  /** Returns the stages of this session. */
  getStages(): Readonly<SessionStageArray<Types>>;
}
