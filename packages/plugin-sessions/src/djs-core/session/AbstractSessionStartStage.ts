import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import type { Awaitable, Metadata } from '@nyx-discord/types';
import type { SessionStartInteraction } from '../../shared/types/interaction/SessionStartInteraction';
import type { SessionStartStage } from '../../shared/types/session/stage/SessionStartStage.js';
import { AbstractSessionStage } from './AbstractSessionStage.js';

export abstract class AbstractSessionStartStage<Result = void>
  extends AbstractSessionStage<Result>
  implements SessionStartStage<Result, CoreInteractionTypes>
{
  public abstract onStart(
    interaction: SessionStartInteraction<CoreInteractionTypes>,
    meta: Metadata,
  ): Awaitable<void>;
}
