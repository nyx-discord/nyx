import type { Awaitable, InteractionTypes, Metadata } from '@nyx-discord/base';
import type { SessionStartInteraction } from '../../../types/interaction/SessionStartInteraction';
import type { SessionStartStage } from '../../../types/session/stage/SessionStartStage.js';
import { BaseSessionStage } from './BaseSessionStage.js';

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
