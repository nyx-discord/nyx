import type { Awaitable } from 'discord.js';
import type { BotAware } from '../../../bot/BotAware.js';
import type { Identifiable } from '../../../identity/Identifiable.js';
import type { Metadatable } from '../../../meta/Metadatable.js';
import type { SessionEndCode } from '../end/SessionEndCode';
import type { SessionEndData } from '../end/SessionEndData';
import type { SessionExecutionMeta } from '../execution/meta/SessionExecutionMeta.js';
import type { SessionStartFilter } from '../filter/SessionStartFilter.js';
import type { SessionUpdateFilter } from '../filter/SessionUpdateFilter.js';
import type { SessionStartInteraction } from '../interaction/SessionStartInteraction.js';
import type { SessionUpdateInteraction } from '../interaction/SessionUpdateInteraction.js';
import type { SessionState } from '../state/SessionState.js';

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
   * Starts the session. Alias of `SessionManager#start(this)`.
   *
   * @throws {IllegalStateError} If the session has already started.
   */
  start(): Awaitable<void>;

  /**
   * Notifies the session about its start.
   *
   * @throws {IllegalStateError} If the session has already started.
   */
  onStart(meta: SessionExecutionMeta): Awaitable<void>;

  /**
   * Updates the session's state with an interaction.
   *
   * @throws {IllegalStateError} If the session is not running.
   *
   * @returns {boolean} Whether the session's TTL should be reset after this
   *                    update.
   */
  onUpdate(
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
    code: SessionEndCode,
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
