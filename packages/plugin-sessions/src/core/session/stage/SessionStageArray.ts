import type { SessionStage } from './SessionStage';
import type { SessionStartStage } from './SessionStartStage';

/** Type of array of session stages. */
export type SessionStageArray = readonly [
  SessionStartStage<any>,
  ...SessionStage<any>[],
];
