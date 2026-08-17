import type { InteractionTypes, Metadata } from '@nyx-discord/types';
import type { SessionEndData } from '../end/SessionEndData.js';
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
export interface SessionEventArgs<
  Types extends InteractionTypes = InteractionTypes,
> {
  sessionStart: [
    session: Session<unknown, Types>,
    interaction: SessionStartInteraction<Types>,
    meta: Metadata,
  ];
  sessionEnd: [
    session: Session<unknown, Types>,
    data: SessionEndData<unknown>,
    meta: Metadata,
  ];
  sessionUpdate: [
    session: Session<unknown, Types>,
    interaction: SessionUpdateInteraction<Types>,
    meta: Metadata,
  ];
  sessionExpire: [
    session: Session<unknown, Types>,
    data: SessionEndData<unknown>,
  ];
}
