import type { Awaitable, InteractionTypes, Metadata } from '@nyx-discord/types';
import type { SessionStartInteraction } from '../../interaction/SessionStartInteraction.js';
import type { SessionStage } from './SessionStage.js';

/** A first {@link SessionStage} inside a {@link StagePaginationSession}. */
export interface SessionStartStage<
  Result,
  Types extends InteractionTypes = InteractionTypes,
> extends SessionStage<Result, Types> {
  /** Called when the user starts the session, entering this first stage. */
  onStart(
    interaction: SessionStartInteraction<Types>,
    meta: Metadata,
  ): Awaitable<void>;
}
