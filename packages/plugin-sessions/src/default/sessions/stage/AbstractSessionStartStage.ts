import type { Metadata } from '@nyx-discord/framework';
import type { Awaitable } from 'discord.js';
import type { SessionStartInteraction } from '../../../core/interaction/SessionStartInteraction';
import type { SessionStartStage } from '../../../core/session/stage/SessionStartStage';
import { AbstractSessionStage } from './AbstractSessionStage';

export abstract class AbstractSessionStartStage<Result = void>
  extends AbstractSessionStage<Result>
  implements SessionStartStage<Result>
{
  public abstract onStart(
    interaction: SessionStartInteraction,
    meta: Metadata,
  ): Awaitable<void>;
}
