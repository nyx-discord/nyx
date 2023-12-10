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

import type { PaginationCustomIdBuilder } from '../../customId/PaginationCustomIdBuilder';
import type { PaginationSession } from '../PaginationSession.js';
import type { SessionStage } from './SessionStage.js';
import type { SessionStageArray } from './SessionStageArray';

/**
 * A type of session that paginates a list of {@link SessionStage}.
 *
 * You can use this to start complex step by step sessions, each step being
 * called a "stage". Stages can also be seen as a way to "nest" sessions.
 *
 * For example:
 * * A session to create a ticket category.
 * * A session to set up server settings.
 */
export interface StagePaginationSession<Result>
  extends PaginationSession<Result> {
  /** Returns a copy of this session's custom id builder. */
  getCustomId(): PaginationCustomIdBuilder;

  /** Returns the stage previous to the current one, if any. */
  getPreviousStage(): SessionStage<unknown> | null;

  /** Returns the stage next to the current one, if any. */
  getNextStage(): SessionStage<unknown> | null;

  /** Returns the current stage. */
  getCurrentStage(): SessionStage<unknown>;

  /** Returns the stages of this session. */
  getStages(): Readonly<SessionStageArray>;
}
