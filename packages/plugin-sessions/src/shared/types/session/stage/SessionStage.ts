import type { Awaitable, InteractionTypes, Metadata } from '@nyx-discord/types';
import type { SessionUpdateInteraction } from '../../interaction/SessionUpdateInteraction';
import type { StagePaginationSession } from './StagePaginationSession.js';

/** An object that represents a stage inside a {@link StagePaginationSession}. */
export interface SessionStage<
  Result,
  Types extends InteractionTypes = InteractionTypes,
> {
  /**
   * Called when the user switches to this stage from another one.
   *
   * @returns {boolean} Whether this switch should cause a TTL reset.
   */
  onSwitch(
    interaction: SessionUpdateInteraction<Types>,
    previousStage: SessionStage<unknown, Types>,
    meta: Metadata,
  ): Awaitable<boolean>;

  /**
   * Called when the user leaves this stage.
   *
   * Only for informational purposes, the stage shouldn't reply to the
   * interaction. That will be done by the next session's {@link onSwitch}.
   */
  onLeave(
    interaction: SessionUpdateInteraction<Types>,
    nextStage: SessionStage<unknown, Types>,
    meta: Metadata,
  ): Awaitable<void>;

  /**
   * Updates the session's state with an interaction.
   *
   * @returns {boolean} Whether this update should cause a TTL reset.
   */
  update(
    interaction: SessionUpdateInteraction<Types>,
    meta: Metadata,
  ): Awaitable<boolean>;

  /** Returns this individual stage's result */
  getResult(): Result | null;

  /** Returns the session this stage belongs to. */
  getSession(): StagePaginationSession<unknown, Types>;
}
