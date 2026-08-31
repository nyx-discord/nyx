import type { Awaitable, InteractionTypes, Metadata } from '@nyx-discord/types';
import type { SessionStartInteraction } from '../../../types/interaction/SessionStartInteraction';
import { BaseSessionStage } from './BaseSessionStage.js';
import type { SessionStartStage } from '../../../types/session/stage/SessionStartStage.js';

export abstract class BaseSessionStartStage<
  Result,
  Types extends InteractionTypes = InteractionTypes,
>
  extends BaseSessionStage<Result, Types>
  implements SessionStartStage<Result, Types>
{
  public abstract onStart(
    interaction: SessionStartInteraction<Types>,
    meta: Metadata,
  ): Awaitable<void>;
}
