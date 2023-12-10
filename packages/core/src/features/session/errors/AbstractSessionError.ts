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

import { FeatureError } from '../../../errors/FeatureError.js';
import type { SessionStartInteraction } from '../interaction/SessionStartInteraction.js';
import type { SessionUpdateInteraction } from '../interaction/SessionUpdateInteraction.js';
import type { Session } from '../session/Session.js';
import type { SessionExecutionMeta } from '../execution/meta/SessionExecutionMeta.js';

/** An Error that wraps errors that occur during the execution of a Session object. */
export abstract class AbstractSessionError<
  SessionInteraction extends
    | SessionStartInteraction
    | SessionUpdateInteraction
    | null,
> extends FeatureError<Session<unknown>> {
  protected readonly interaction: SessionInteraction;

  protected readonly meta: SessionExecutionMeta;

  constructor(
    error: Error,
    session: Session<unknown>,
    interaction: SessionInteraction,
    meta: SessionExecutionMeta,
  ) {
    super(error, session, 'There was an error while executing a Session.');
    this.interaction = interaction;
    this.meta = meta;
  }

  /** Return the interaction that caused this error. */
  public getInteraction(): SessionInteraction {
    return this.interaction;
  }
}
