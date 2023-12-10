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

import type { SessionExecutionMeta } from '../../execution/meta/SessionExecutionMeta';
import type { SessionUpdateInteraction } from '../../interaction/SessionUpdateInteraction.js';
import type { StagePaginationSession } from './StagePaginationSession';

/** An object that represents a stage inside a {@link StagePaginationSession}. */
export interface SessionStage<Result> {
  /**
   * Called when the user switches to this stage from another one.
   *
   * @returns {boolean} Whether this switch should cause a TTL reset.
   */
  onSwitch(
    interaction: SessionUpdateInteraction,
    previousStage: SessionStage<unknown>,
    meta: SessionExecutionMeta,
  ): Awaitable<boolean>;

  /**
   * Called when the user leaves this stage.
   *
   * Only for informational purposes, the stage shouldn't reply to the
   * interaction. That will be done by the next session's {@link onSwitch}.
   */
  onLeave(
    interaction: SessionUpdateInteraction,
    nextStage: SessionStage<unknown>,
    meta: SessionExecutionMeta,
  ): Awaitable<void>;

  /**
   * Updates the session's state with an interaction.
   *
   * @returns {boolean} Whether this update should cause a TTL reset.
   */
  update(
    interaction: SessionUpdateInteraction,
    meta: SessionExecutionMeta,
  ): Awaitable<boolean>;

  /** Returns this individual stage's result */
  getResult(): Result | null;

  /** Returns the session this stage belongs to. */
  getSession(): StagePaginationSession<unknown>;
}
