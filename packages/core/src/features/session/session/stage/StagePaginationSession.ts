import type { PaginationCustomIdBuilder } from '../../customId/PaginationCustomIdBuilder';
import type { PaginationSession } from '../PaginationSession.js';
import type { SessionStage } from './SessionStage.js';
import type { SessionStageArray } from './SessionStageArray';

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
export interface StagePaginationSession<Result>
  extends PaginationSession<Result> {
  /** Returns a copy of this session's custom id builder. */
  getCustomId(): PaginationCustomIdBuilder;

  /** Returns the stage previous to the current one, if any. */
  getPreviousStage(): SessionStage<unknown> | null;

  /** Returns the stage next to the current one, if any. */
  getNextStage(): SessionStage<unknown> | null;

  /** Returns the current stage. */
  getCurrentStage(): SessionStage<unknown>;

  /** Returns the stages of this session. */
  getStages(): Readonly<SessionStageArray>;
}
