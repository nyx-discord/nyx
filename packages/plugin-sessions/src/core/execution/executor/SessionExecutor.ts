import type { Metadata, MiddlewareList } from '@nyx-discord/framework';
import type { Awaitable } from 'discord.js';
import type { SessionEndCode } from '../../end/SessionEndCode';
import type { SessionEndData } from '../../end/SessionEndData';
import type { SessionErrorHandler } from '../../error/SessionErrorHandler';
import type { SessionUpdateInteraction } from '../../interaction/SessionUpdateInteraction';
import type { SessionStartMiddlewareResolvable } from '../../middleware/start/SessionStartMiddlewareResolvable';
import type { SessionUpdateMiddlewareResolvable } from '../../middleware/update/SessionUpdateMiddlewareResolvable';
import type { Session } from '../../session/Session';
import type { SessionEndArgs } from '../args/SessionEndArgs';
import type { SessionStartArgs } from '../args/SessionStartArgs';
import type { SessionUpdateArgs } from '../args/SessionUpdateArgs';

/** An object responsible for handling session execution, including middleware checking and error handling. */
export interface SessionExecutor {
  /**
   * Executes a session start.
   *
   * @throws {IllegalStateError} If the session is already started.
   */
  start(session: Session<unknown>, meta: Metadata): Awaitable<boolean>;

  /**
   * Executes a session update given an update interaction.
   *
   * @throws {IllegalStateError} If the session is not running.
   */
  update(
    session: Session<unknown>,
    interaction: SessionUpdateInteraction,
    meta: Metadata,
  ): Awaitable<boolean>;

  /**
   * Executes a session end.
   *
   * @throws {IllegalStateError} If the session is not running.
   */
  end(
    session: Session<unknown>,
    reason: string,
    code: SessionEndCode,
    meta: Metadata,
  ): Awaitable<SessionEndData<unknown>>;

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
  getStartMiddleware(): MiddlewareList<SessionStartMiddlewareResolvable>;

  /** Returns the middleware used when a session is updated. */
  getUpdateMiddleware(): MiddlewareList<SessionUpdateMiddlewareResolvable>;

  /** Returns the {@link SessionErrorHandler} for errors thrown when a session is started. */
  getStartErrorHandler(): SessionErrorHandler<SessionStartArgs>;

  /** Returns the {@link SessionErrorHandler} for errors thrown when a session is updated. */
  getUpdateErrorHandler(): SessionErrorHandler<SessionUpdateArgs>;

  /** Returns the {@link SessionErrorHandler} for errors thrown when a session ends. */
  getEndErrorHandler(): SessionErrorHandler<SessionEndArgs>;
}
