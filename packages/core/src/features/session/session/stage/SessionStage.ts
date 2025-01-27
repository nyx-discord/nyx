import type { Awaitable } from 'discord.js';

import type { SessionExecutionMeta } from '../../execution/meta/SessionExecutionMeta';
import type { SessionUpdateInteraction } from '../../interaction/SessionUpdateInteraction.js';
import type { StagePaginationSession } from './StagePaginationSession';

/** An object that represents a stage inside a {@link StagePaginationSession}. */
export interface SessionStage<Result> {
  /**
   * Called when the user switches to this stage from another one.
   *
   * @returns {boolean} Whether this switch should cause a TTL reset.
   */
  onSwitch(
    interaction: SessionUpdateInteraction,
    previousStage: SessionStage<unknown>,
    meta: SessionExecutionMeta,
  ): Awaitable<boolean>;

  /**
   * Called when the user leaves this stage.
   *
   * Only for informational purposes, the stage shouldn't reply to the
   * interaction. That will be done by the next session's {@link onSwitch}.
   */
  onLeave(
    interaction: SessionUpdateInteraction,
    nextStage: SessionStage<unknown>,
    meta: SessionExecutionMeta,
  ): Awaitable<void>;

  /**
   * Updates the session's state with an interaction.
   *
   * @returns {boolean} Whether this update should cause a TTL reset.
   */
  update(
    interaction: SessionUpdateInteraction,
    meta: SessionExecutionMeta,
  ): Awaitable<boolean>;

  /** Returns this individual stage's result */
  getResult(): Result | null;

  /** Returns the session this stage belongs to. */
  getSession(): StagePaginationSession<unknown>;
}
