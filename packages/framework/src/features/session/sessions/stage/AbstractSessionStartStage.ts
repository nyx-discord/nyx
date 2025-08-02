import type {
  MetaCollection,
  SessionStartInteraction,
  SessionStartStage,
} from '@nyx-discord/core';
import type { Awaitable } from 'discord.js';
import { AbstractSessionStage } from './AbstractSessionStage';

export abstract class AbstractSessionStartStage<Result = void>
  extends AbstractSessionStage<Result>
  implements SessionStartStage<Result>
{
  public abstract onStart(
    interaction: SessionStartInteraction,
    meta: MetaCollection,
  ): Awaitable<void>;
}
