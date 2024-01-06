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

import type { Awaitable, ClientEvents, Events } from 'discord.js';

import type { BotAware } from '../../bot/BotAware.js';
import type { Identifier } from '../../identity/Identifier';
import type { BotLifecycleObserver } from '../../types/BotLifecycleObserver';
import type { EventBus } from '../event/bus/EventBus.js';
import type { EventSubscriber } from '../event/subscriber/EventSubscriber.js';
import type { SessionCustomIdCodec } from './customId/SessionCustomIdCodec.js';
import type { SessionEventArgs } from './events/SessionEvent.js';
import type { SessionExecutor } from './execution/executor/SessionExecutor.js';
import type { SessionExecutionMeta } from './execution/meta/SessionExecutionMeta.js';
import type { SessionUpdateInteraction } from './interaction/SessionUpdateInteraction.js';
import type { SessionPromiseRepository } from './promise/SessionPromiseRepository.js';
import type { ReadonlySessionRepository } from './repository/ReadonlySessionRepository.js';
import type { Session } from './session/Session.js';

/** An object that holds the objects and methods that make together a bot's session system. */
export interface SessionManager extends BotAware, BotLifecycleObserver {
  /**
   * Starts a new session.
   *
   * @throws {IllegalDuplicateError} If a session with that ID already exists.
   */
  start(
    session: Session<unknown>,
    meta?: SessionExecutionMeta,
  ): Awaitable<boolean>;

  /**
   * Updates a session given a {@link SessionUpdateInteraction}, if it exists.
   *
   * @returns {boolean} If the interaction referred to a session.
   */
  update(
    interaction: SessionUpdateInteraction,
    meta?: SessionExecutionMeta,
  ): Awaitable<boolean>;

  /** Ends a session. */
  end(
    session: Session<unknown>,
    reason: string,
    code: Identifier | number,
    meta?: SessionExecutionMeta,
  ): Awaitable<this>;

  /** Returns the event subscriber for {@link SessionUpdateInteraction}. */
  getUpdateSubscriber(): EventSubscriber<
    ClientEvents,
    Events.InteractionCreate
  >;

  /** Sets the event subscriber for {@link SessionUpdateInteraction}. */
  setUpdateSubscriber(
    subscriber: EventSubscriber<ClientEvents, Events.InteractionCreate>,
  ): Awaitable<this>;

  /** Returns the {@link SessionPromiseRepository} for this manager. */
  getPromiseRepository(): SessionPromiseRepository;

  /** Returns the {@link EventBus} for this manager. */
  getEventBus(): EventBus<SessionEventArgs>;

  /** Returns the {@link SessionCustomIdCodec} for this manager. */
  getCustomIdCodec(): SessionCustomIdCodec;

  /** Returns the {@link SessionExecutor} for this manager. */
  getExecutor(): SessionExecutor;

  /** Returns the {@link ReadonlySessionRepository} for this manager. */
  getRepository(): ReadonlySessionRepository;
}
