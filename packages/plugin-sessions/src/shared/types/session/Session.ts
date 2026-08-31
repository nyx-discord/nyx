import type {
  Awaitable,
  Identifiable,
  InteractionTypes,
  Metadata,
  Metadatable,
  NyxBot,
} from '@nyx-discord/types';
import type { SessionCustomIdData } from '../customId/data/SessionCustomIdData.js';
import type { SessionEndCode } from '../end/SessionEndCode.js';
import type { SessionEndData } from '../end/SessionEndData.js';
import type { SessionStartFilterResolvable } from '../filter/start/SessionStartFilterResolvable.js';
import type { SessionUpdateFilterResolvable } from '../filter/update/SessionUpdateFilterResolvable.js';
import type { SessionUpdateInteraction } from '../interaction/SessionUpdateInteraction.js';
import type { SessionStartInteraction } from '../interaction/SessionStartInteraction.js';
import type { SessionState } from '../state/SessionState.js';

/**
 * An object that represents a user's interaction session with a
 * {@link NyxBot bot}.
 *
 * A session stores its state, and can be updated and respond to
 * {@link SessionUpdateInteraction user interactions}.
 */
export interface Session<
  Result,
  Types extends InteractionTypes = InteractionTypes,
>
  extends Identifiable<string>, Metadatable {
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
  onStart(meta: Metadata): Awaitable<void>;

  /**
   * Updates the session's state with an interaction.
   *
   * @throws {IllegalStateError} If the session is not running.
   *
   * @returns {boolean} Whether the session's TTL should be reset after this
   *                    update.
   */
  onUpdate(
    interaction: SessionUpdateInteraction<Types>,
    meta: Metadata,
  ): Awaitable<boolean>;

  /**
   * Ends the session.
   *
   * @throws {IllegalStateError} If the session is already stopped.
   */
  onEnd(reason: string, code: SessionEndCode, meta: Metadata): Awaitable<void>;

  /** Returns the filter for starting this session. */
  getStartFilter(): SessionStartFilterResolvable<Result, Types> | null;

  /** Returns the filter for update interactions of this session. */
  getUpdateFilter(): SessionUpdateFilterResolvable<Result, Types> | null;

  /** Returns the result of this session. */
  getResult(): Result | null;

  /** Returns the {@link SessionStartInteraction} that started this session. */
  getStartInteraction(): SessionStartInteraction<Types>;

  /** Returns the ID of the user that started this session. */
  getUserId(): string;

  /** Returns the ID of the guild this session was started in, or `null` if in a DM. */
  getGuildId(): string | null;

  /** Returns the ID of the channel this session was started in. */
  getChannelId(): string;

  /** Returns whether the interaction that started this session has already been replied to. */
  hasReplied(): boolean;

  /** Returns the TTL of this session. */
  getTTL(): number;

  /** Returns the end promise that will resolve to a {@link SessionEndData} when this session ends. */
  getEndPromise(): Promise<SessionEndData<Result>>;

  /** Builds this session's custom id, optionally with extra data. */
  buildCustomId(extra?: string): string;

  /** Returns this session's custom id data. */
  getCustomIdData(extra?: string): SessionCustomIdData;

  /** Returns the state of this session. */
  getState(): SessionState;

  /** Sets the state of this session. */
  setState(state: SessionState): void;

  /** Returns the bot that owns this session. */
  getBot(): NyxBot;
}
