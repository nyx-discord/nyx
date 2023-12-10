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

import type { Awaitable } from 'discord.js';
import type { Identifier } from '../../../../identity/Identifier.js';
import type { MiddlewareLinkedList } from '../../../../middleware/list/MiddlewareLinkedList.js';
import type { SessionErrorHandler } from '../../error/SessionErrorHandler.js';
import type { SessionUpdateInteraction } from '../../interaction/SessionUpdateInteraction.js';
import type { SessionStartMiddleware } from '../../middleware/SessionStartMiddleware.js';
import type { SessionUpdateMiddleware } from '../../middleware/SessionUpdateMiddleware.js';
import type { Session } from '../../session/Session.js';
import type { SessionEndData } from '../../stop/SessionEndData';
import type { SessionEndArgs } from '../args/SessionEndArgs';
import type { SessionStartArgs } from '../args/SessionStartArgs.js';
import type { SessionUpdateArgs } from '../args/SessionUpdateArgs.js';
import type { SessionExecutionMeta } from '../meta/SessionExecutionMeta.js';

/** An object responsible for handling session execution, including middleware checking and error handling. */
export interface SessionExecutor {
  /**
   * Executes a session start.
   *
   * @throws {IllegalStateError} If the session is already started.
   */
  start(
    session: Session<unknown>,
    meta: SessionExecutionMeta,
  ): Awaitable<boolean>;

  /**
   * Executes a session update given an update interaction.
   *
   * @throws {IllegalStateError} If the session is not running.
   */
  update(
    session: Session<unknown>,
    interaction: SessionUpdateInteraction,
    meta: SessionExecutionMeta,
  ): Awaitable<boolean>;

  /**
   * Executes a session end.
   *
   * @throws {IllegalStateError} If the session is not running.
   */
  end(
    session: Session<unknown>,
    reason: string,
    code: Identifier | number,
    meta: SessionExecutionMeta,
  ): Awaitable<SessionEndData<unknown> | null>;

  /** Handles an interaction that refers to a session that doesn't exist anymore. */
  handleMissing(
    sessionId: string,
    interaction: SessionUpdateInteraction,
  ): Awaitable<void>;

  /** Sets the handling method for interactions that refer to sessions that don't exist anymore. */
  setMissingHandler(
    handler: (
      sessionId: string,
      interaction: SessionUpdateInteraction,
    ) => Awaitable<void>,
  ): void;

  /** Returns the middleware used when a session is started. */
  getStartMiddleware(): MiddlewareLinkedList<SessionStartMiddleware>;

  /** Returns the middleware used when a session is updated. */
  getUpdateMiddleware(): MiddlewareLinkedList<SessionUpdateMiddleware>;

  /** Returns the {@link SessionErrorHandler} for errors thrown when a session is started. */
  getStartErrorHandler(): SessionErrorHandler<SessionStartArgs>;

  /** Returns the {@link SessionErrorHandler} for errors thrown when a session is updated. */
  getUpdateErrorHandler(): SessionErrorHandler<SessionUpdateArgs>;

  /** Returns the {@link SessionErrorHandler} for errors thrown when a session ends. */
  getEndErrorHandler(): SessionErrorHandler<SessionEndArgs>;
}
