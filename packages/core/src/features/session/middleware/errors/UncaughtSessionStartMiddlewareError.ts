/*
 * MIT License
 *
 * Copyright (c) 2024 Amgelo563
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

import type { MiddlewareList } from '../../../../middleware/list/MiddlewareList';
import { AbstractSessionError } from '../../errors/AbstractSessionError.js';
import type { SessionExecutionMeta } from '../../execution/meta/SessionExecutionMeta.js';
import type { SessionStartInteraction } from '../../interaction/SessionStartInteraction.js';
import type { Session } from '../../session/Session.js';
import type { SessionStartMiddleware } from '../SessionStartMiddleware.js';

// eslint-disable-next-line max-len
export class UncaughtSessionStartMiddlewareError extends AbstractSessionError<SessionStartInteraction> {
  protected readonly middlewareList: MiddlewareList<SessionStartMiddleware>;

  constructor(
    error: Error,
    middlewareList: MiddlewareList<SessionStartMiddleware>,
    session: Session<unknown>,
    meta: SessionExecutionMeta,
  ) {
    super(error, session, session.getStartInteraction(), meta);
    this.middlewareList = middlewareList;
  }

  /** Returns the middleware list that threw this error. */
  public getMiddlewareList(): MiddlewareList<SessionStartMiddleware> {
    return this.middlewareList;
  }
}
