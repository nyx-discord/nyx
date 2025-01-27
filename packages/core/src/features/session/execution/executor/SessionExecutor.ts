import type { Awaitable } from 'discord.js';
import type { MiddlewareList } from '../../../../middleware/list/MiddlewareList';
import type { SessionEndCode } from '../../end/SessionEndCode';
import type { SessionEndData } from '../../end/SessionEndData';
import type { SessionErrorHandler } from '../../error/SessionErrorHandler.js';
import type { SessionUpdateInteraction } from '../../interaction/SessionUpdateInteraction.js';
import type { SessionStartMiddleware } from '../../middleware/SessionStartMiddleware.js';
import type { SessionUpdateMiddleware } from '../../middleware/SessionUpdateMiddleware.js';
import type { Session } from '../../session/Session.js';
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
    code: SessionEndCode,
    meta: SessionExecutionMeta,
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
  getStartMiddleware(): MiddlewareList<SessionStartMiddleware>;

  /** Returns the middleware used when a session is updated. */
  getUpdateMiddleware(): MiddlewareList<SessionUpdateMiddleware>;

  /** Returns the {@link SessionErrorHandler} for errors thrown when a session is started. */
  getStartErrorHandler(): SessionErrorHandler<SessionStartArgs>;

  /** Returns the {@link SessionErrorHandler} for errors thrown when a session is updated. */
  getUpdateErrorHandler(): SessionErrorHandler<SessionUpdateArgs>;

  /** Returns the {@link SessionErrorHandler} for errors thrown when a session ends. */
  getEndErrorHandler(): SessionErrorHandler<SessionEndArgs>;
}
