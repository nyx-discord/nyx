import type { Sequence } from '../sequence/Sequence';
import type { Step } from '../step/Step';

export type Workflow<ActorId extends string> = (
  | Sequence<ActorId>
  | (Step<ActorId> & { from: ActorId })
)[];
