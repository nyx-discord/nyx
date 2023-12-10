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
import type { BotAware } from '../../../bot/BotAware.js';
import type { Identifiable } from '../../../identity/Identifiable.js';
import type { Identifier } from '../../../identity/Identifier.js';
import type { Metadatable } from '../../../meta/Metadatable.js';
import type { SessionExecutionMeta } from '../execution/meta/SessionExecutionMeta.js';
import type { SessionStartFilter } from '../filter/SessionStartFilter.js';
import type { SessionUpdateFilter } from '../filter/SessionUpdateFilter.js';
import type { SessionStartInteraction } from '../interaction/SessionStartInteraction.js';
import type { SessionUpdateInteraction } from '../interaction/SessionUpdateInteraction.js';
import type { SessionState } from '../state/SessionState.js';
import type { SessionEndData } from '../stop/SessionEndData';

/**
 * An object that represents a user's interaction session with a
 * {@link NyxBot bot}.
 *
 * A session stores its state, and can be updated and respond to
 * {@link SessionUpdateInteraction user interactions}.
 */
export interface Session<Result>
  extends BotAware,
    Identifiable<string>,
    Metadatable {
  /**
   * Starts the session.
   *
   * @throws {IllegalStateError} If the session has already started.
   */
  start(meta: SessionExecutionMeta): Awaitable<void>;

  /**
   * Updates the session's state with an interaction.
   *
   * @throws {IllegalStateError} If the session is not running.
   *
   * @returns {boolean} Whether the session's TTL should be reset after this
   *                    update.
   */
  update(
    interaction: SessionUpdateInteraction,
    meta: SessionExecutionMeta,
  ): Awaitable<boolean>;

  /**
   * Ends the session.
   *
   * @throws {IllegalStateError} If the session is already stopped.
   */
  onEnd(
    reason: string,
    code: Identifier | number,
    meta: SessionExecutionMeta,
  ): Awaitable<void>;

  /** Returns the filter for starting this session. */
  getStartFilter(): SessionStartFilter<Result> | null;

  /** Returns the filter for update interactions of this session. */
  getUpdateFilter(): SessionUpdateFilter<Result> | null;

  /** Returns the result of this session. */
  getResult(): Result | null;

  /** Returns the {@link SessionStartInteraction} that started this session. */
  getStartInteraction(): SessionStartInteraction;

  /** Returns the TTL of this session. */
  getTTL(): number;

  /** Returns the end promise that will resolve to a {@link SessionEndData} when this session ends. */
  getEndPromise(): Promise<SessionEndData<Result>>;

  /** Returns the state of this session. */
  getState(): SessionState;

  /** Sets the state of this session. */
  setState(state: SessionState): void;
}
