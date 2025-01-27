import type { Awaitable } from 'discord.js';

import type { SessionExecutionMeta } from '../../execution/meta/SessionExecutionMeta';
import type { SessionStartInteraction } from '../../interaction/SessionStartInteraction';
import type { SessionStage } from './SessionStage';

/** A first {@link SessionStage} inside a {@link StagePaginationSession}. */
export interface SessionStartStage<Result> extends SessionStage<Result> {
  /** Called when the user starts the session, entering this first stage. */
  onStart(
    interaction: SessionStartInteraction,
    meta: SessionExecutionMeta,
  ): Awaitable<void>;
}
