import { MetaCollection } from '../../../meta/MetaCollection';
import type { SessionEndData } from '../end/SessionEndData';
import type { SessionStartInteraction } from '../interaction/SessionStartInteraction.js';
import type { SessionUpdateInteraction } from '../interaction/SessionUpdateInteraction.js';
import type { Session } from '../session/Session.js';

/** Enum of possible session events. */
export const SessionEventEnum = {
  /** Emitted when a session starts. */
  SessionStart: 'sessionStart',
  /** Emitted when a session is updated by a {@link SessionUpdateInteraction}. */
  SessionUpdate: 'sessionUpdate',
  /** Emitted when a session ends. */
  SessionEnd: 'sessionEnd',
  /** Emitted when a session's TTL expires. */
  SessionExpire: 'sessionExpire',
} as const satisfies Record<string, keyof SessionEventArgs>;

/** Type of values of {@link SessionEventEnum}. */
export type SessionEvent =
  (typeof SessionEventEnum)[keyof typeof SessionEventEnum];

/** Record of arguments for each session event. */
export interface SessionEventArgs {
  sessionStart: [
    session: Session<unknown>,
    interaction: SessionStartInteraction,
    meta: MetaCollection,
  ];
  sessionEnd: [
    session: Session<unknown>,
    data: SessionEndData<unknown>,
    meta: MetaCollection,
  ];
  sessionUpdate: [
    session: Session<unknown>,
    interaction: SessionUpdateInteraction,
    meta: MetaCollection,
  ];
  sessionExpire: [session: Session<unknown>, data: SessionEndData<unknown>];
}
