import type { Awaitable, ClientEvents, Events } from 'discord.js';

import type { BotAware } from '../../bot/BotAware.js';
import type { BotLifecycleObserver } from '../../types/BotLifecycleObserver';
import type { EventBus } from '../event/bus/EventBus.js';
import type { EventSubscriber } from '../event/subscriber/EventSubscriber.js';
import type { SessionCustomIdCodec } from './customId/SessionCustomIdCodec.js';
import type { SessionEndCode } from './end/SessionEndCode';
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
    code: SessionEndCode,
    meta?: SessionExecutionMeta,
  ): Awaitable<this>;

  /** Resolves an {@link Session} given a {@link SessionUpdateInteraction}. */
  resolve(
    interaction: SessionUpdateInteraction,
  ): Awaitable<Session<unknown> | null>;

  /** Returns the event subscriber for {@link SessionUpdateInteraction}. */
  getUpdateSubscriber(): EventSubscriber<
    ClientEvents,
    Events.InteractionCreate
  >;

  /** Sets the event subscriber for {@link SessionUpdateInteraction}. */
  setUpdateSubscriber(
    subscriber: EventSubscriber<ClientEvents, Events.InteractionCreate>,
  ): Awaitable<this>;

  /**
   * Subscribes a list of event subscribers to the manager's bus.
   *
   * Alias of:
   * ```
   * const managerBus = sessionManager.getEventBus();
   * await managerBus.subscribe(subscriber);
   * ```
   */
  subscribe(
    ...subscribers: EventSubscriber<SessionEventArgs, keyof SessionEventArgs>[]
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
