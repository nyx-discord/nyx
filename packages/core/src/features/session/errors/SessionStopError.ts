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
import type { SessionUpdateInteraction } from '../interaction/SessionUpdateInteraction';
import type { Session } from '../session/Session.js';
import type { SessionEndData } from '../stop/SessionEndData';
import { AbstractSessionError } from './AbstractSessionError.js';

export class SessionStopError<
  Data extends SessionEndData<unknown>,
> extends AbstractSessionError<SessionUpdateInteraction | null> {
  protected readonly data: Data;

  constructor(
    error: Error,
    session: Session<unknown>,
    data: Data,
    interaction: SessionUpdateInteraction | null,
    meta: SessionExecutionMeta,
  ) {
    super(error, session, interaction, meta);

    this.data = data;
  }

  /** Returns the data about this session's stop. */
  public getData(): Data {
    return this.data;
  }
}
