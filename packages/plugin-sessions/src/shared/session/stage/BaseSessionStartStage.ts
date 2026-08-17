import type { Awaitable, InteractionTypes, Metadata } from '@nyx-discord/types';
import type { SessionStartInteraction } from '../../interaction/SessionStartInteraction.js';
import type { SessionStartStage } from './SessionStartStage.js';
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
