/*
 * MIT License
 *
 * Copyright (c) 2023 Amgelo563
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type { SessionExecutionMeta } from '../execution/meta/SessionExecutionMeta.js';
import type { SessionStartInteraction } from '../interaction/SessionStartInteraction.js';
import type { SessionUpdateInteraction } from '../interaction/SessionUpdateInteraction.js';
import type { Session } from '../session/Session.js';
import type { SessionEndData } from '../stop/SessionEndData';

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
    meta: SessionExecutionMeta,
  ];
  sessionEnd: [
    session: Session<unknown>,
    data: SessionEndData<unknown>,
    meta: SessionExecutionMeta,
  ];
  sessionUpdate: [
    session: Session<unknown>,
    interaction: SessionUpdateInteraction,
    meta: SessionExecutionMeta,
  ];
  sessionExpire: [session: Session<unknown>, data: SessionEndData<unknown>];
}
