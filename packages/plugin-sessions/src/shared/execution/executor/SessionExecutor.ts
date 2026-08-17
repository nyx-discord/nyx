import type {
  Awaitable,
  InteractionTypes,
  Metadata,
  MiddlewareList,
} from '@nyx-discord/types';
import type { SessionEndCode } from '../../end/SessionEndCode.js';
import type { SessionEndData } from '../../end/SessionEndData.js';
import type { SessionErrorHandler } from '../../error/SessionErrorHandler.js';
import type { SessionUpdateInteraction } from '../../interaction/SessionUpdateInteraction.js';
import type { SessionStartMiddlewareResolvable } from '../../middleware/start/SessionStartMiddlewareResolvable.js';
import type { SessionUpdateMiddlewareResolvable } from '../../middleware/update/SessionUpdateMiddlewareResolvable.js';
import type { Session } from '../../session/Session.js';
import type { SessionEndArgs } from '../args/SessionEndArgs.js';
import type { SessionStartArgs } from '../args/SessionStartArgs.js';
import type { SessionUpdateArgs } from '../args/SessionUpdateArgs.js';

/** An object responsible for handling session execution, including middleware checking and error handling. */
export interface SessionExecutor<
  Types extends InteractionTypes = InteractionTypes,
> {
  /**
   * Executes a session start.
   *
   * @throws {IllegalStateError} If the session is already started.
   */
  start(session: Session<unknown, Types>, meta: Metadata): Awaitable<boolean>;

  /**
   * Executes a session update given an update interaction.
   *
   * @throws {IllegalStateError} If the session is not running.
   */
  update(
    session: Session<unknown, Types>,
    interaction: SessionUpdateInteraction<Types>,
    meta: Metadata,
  ): Awaitable<boolean>;

  /**
   * Executes a session end.
   *
   * @throws {IllegalStateError} If the session is not running.
   */
  end(
    session: Session<unknown, Types>,
    reason: string,
    code: SessionEndCode,
    meta: Metadata,
  ): Awaitable<SessionEndData<unknown>>;

  /** Handles an interaction that refers to a session that doesn't exist anymore. */
  handleMissing(
    sessionId: string,
    interaction: SessionUpdateInteraction<Types>,
  ): Awaitable<void>;

  /** Sets the handling method for interactions that refer to sessions that don't exist anymore. */
  setMissingHandler(
    handler: (
      sessionId: string,
      interaction: SessionUpdateInteraction<Types>,
    ) => Awaitable<void>,
  ): void;

  /** Returns the middleware used when a session is started. */
  getStartMiddleware(): MiddlewareList<SessionStartMiddlewareResolvable<Types>>;

  /** Returns the middleware used when a session is updated. */
  getUpdateMiddleware(): MiddlewareList<
    SessionUpdateMiddlewareResolvable<Types>
  >;

  /** Returns the {@link SessionErrorHandler} for errors thrown when a session is started. */
  getStartErrorHandler(): SessionErrorHandler<SessionStartArgs, Types>;

  /** Returns the {@link SessionErrorHandler} for errors thrown when a session is updated. */
  getUpdateErrorHandler(): SessionErrorHandler<SessionUpdateArgs<Types>, Types>;

  /** Returns the {@link SessionErrorHandler} for errors thrown when a session ends. */
  getEndErrorHandler(): SessionErrorHandler<SessionEndArgs, Types>;
}
