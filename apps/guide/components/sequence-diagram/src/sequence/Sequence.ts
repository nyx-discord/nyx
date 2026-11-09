import type { Step } from '../step/Step';

export type Sequence<ActorId extends string = string> = {
  from: ActorId;
  steps: Step<ActorId>[];
};
