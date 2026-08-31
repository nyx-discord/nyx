import type { DjsInteractionTypes } from '@nyx-discord/djs';
import type { Awaitable, Metadata } from '@nyx-discord/types';
import type { SessionStartInteraction } from '../../shared/types/interaction/SessionStartInteraction';
import type { SessionStartStage } from '../../shared/types/session/stage/SessionStartStage.js';
import { AbstractSessionStage } from './AbstractSessionStage.js';

export abstract class AbstractSessionStartStage<Result = void>
  extends AbstractSessionStage<Result>
  implements SessionStartStage<Result, DjsInteractionTypes>
{
  public abstract onStart(
    interaction: SessionStartInteraction<DjsInteractionTypes>,
    meta: Metadata,
  ): Awaitable<void>;
}
