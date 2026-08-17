import type { InteractionTypes } from '@nyx-discord/types';
import type { SessionStage } from './SessionStage.js';
import type { SessionStartStage } from './SessionStartStage.js';

/** Type of array of session stages. */
export type SessionStageArray<
  Types extends InteractionTypes = InteractionTypes,
> = readonly [SessionStartStage<any, Types>, ...SessionStage<any, Types>[]];
