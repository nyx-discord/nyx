import { NotImplementedError } from '@nyx-discord/base';
import type {
  Awaitable,
  InteractionTypes,
  Metadata,
  NyxBot,
  ReadonlyMetadata,
} from '@nyx-discord/types';
import { AssertionError } from '@nyx-discord/types';
import type { SessionCustomIdData } from '../../types/customId/data/SessionCustomIdData.js';
import type { SessionCustomIdCodec } from '../../types/customId/SessionCustomIdCodec.js';
import type { SessionEndCode } from '../../types/end/SessionEndCode.js';
import { SessionEndCodes } from '../../types/end/SessionEndCodes.js';
import type { SessionEndData } from '../../types/end/SessionEndData.js';
import type { SessionStartFilterResolvable } from '../../types/filter/start/SessionStartFilterResolvable.js';
import type { SessionUpdateFilterResolvable } from '../../types/filter/update/SessionUpdateFilterResolvable.js';
import type { SessionUpdateInteraction } from '../../types/interaction/SessionUpdateInteraction.js';
import type { SessionInteractionInfo } from '../../types/interaction/SessionInteractionInfo.js';
import type { SessionStartInteraction } from '../../types/interaction/SessionStartInteraction.js';
import { BaseSessionPlugin } from '../plugin/BaseSessionPlugin.js';
import {
  type SessionState,
  SessionStateEnum,
} from '../../types/state/SessionState.js';
import type { Session } from '../../types/session/Session.js';
import type { SessionOptions } from '../../types/session/SessionOptions.js';

export abstract class BaseSession<
  Result,
  Types extends InteractionTypes = InteractionTypes,
> implements Session<Result, Types> {
  public static readonly DefaultTTL = 180_000; // 3 minutes

  protected readonly bot: NyxBot;

  protected readonly id: string;

  protected readonly startInteraction: SessionStartInteraction<Types>;

  protected readonly customIdData: Readonly<SessionCustomIdData>;

  protected readonly startFilter: SessionStartFilterResolvable<
    Result,
    Types
  > | null = null;

  protected readonly updateFilter: SessionUpdateFilterResolvable<
    Result,
    Types
  > | null = null;

  protected readonly ttl: number = BaseSession.DefaultTTL;

  protected readonly codec: SessionCustomIdCodec;

  protected readonly meta: Metadata = Object.create(null);

  protected result: Result | null = null;

  protected state: SessionState = SessionStateEnum.Uninitalized;

  constructor(options: SessionOptions<Types>) {
    this.bot = options.bot;
    this.id = options.id;
    this.startInteraction = options.startInteraction;
    this.codec = BaseSessionPlugin.getFromBot<Types>(
      options.bot,
    ).getCustomIdCodec();
    this.customIdData = {
      id: this.id,
      extra: null,
      page: null,
    };
    if (options.ttl !== undefined) {
      this.ttl = options.ttl;
    }
  }

  public async start(): Promise<void> {
    await BaseSessionPlugin.getFromBot<Types>(this.bot).start(this);
  }

  public abstract onUpdate(
    interaction: SessionUpdateInteraction<Types>,
    meta: Metadata,
  ): Awaitable<boolean>;

  public abstract onStart(meta: Metadata): Awaitable<void>;

  public abstract onEnd(
    reason: string,
    code: SessionEndCode,
    meta: Metadata,
  ): Awaitable<void>;

  /** Returns the ID of the user that started this session. */
  public getUserId(): string {
    return this.getStartInteractionInfo().userId;
  }

  /** Returns the ID of the guild this session was started in, or `null` if in a DM. */
  public getGuildId(): string | null {
    return this.getStartInteractionInfo().guildId;
  }

  /** Returns the ID of the channel this session was started in. */
  public getChannelId(): string {
    return this.getStartInteractionInfo().channelId;
  }

  /** Returns whether the interaction that started this session has already been replied to. */
  public hasReplied(): boolean {
    return this.getStartInteractionInfo().replied;
  }

  public getResult(): Result | null {
    return this.result;
  }

  public getEndPromise(): Promise<SessionEndData<Result>> {
    return BaseSessionPlugin.getFromBot<Types>(this.bot)
      .getPromiseRepository()
      .getPromise(this) as Promise<SessionEndData<Result>>;
  }

  public getMeta(): ReadonlyMetadata {
    return this.meta;
  }

  public getStartFilter(): SessionStartFilterResolvable<Result, Types> | null {
    return this.startFilter;
  }

  public getUpdateFilter(): SessionUpdateFilterResolvable<
    Result,
    Types
  > | null {
    return this.updateFilter;
  }

  public getId(): string {
    return this.id;
  }

  public getTTL(): number {
    return this.ttl;
  }

  public getStartInteraction(): SessionStartInteraction<Types> {
    return this.startInteraction;
  }

  public getState(): SessionState {
    return this.state;
  }

  public setState(state: SessionState): void {
    if (
      state === SessionStateEnum.Uninitalized
      && this.state != SessionStateEnum.Uninitalized
    ) {
      throw new AssertionError();
    }

    if (
      state == SessionStateEnum.Running
      && this.state !== SessionStateEnum.Uninitalized
    ) {
      throw new AssertionError();
    }

    if (
      state == SessionStateEnum.Ended
      && this.state !== SessionStateEnum.Running
    ) {
      throw new AssertionError();
    }

    this.state = state;
  }

  public getCustomIdData(extra?: string): SessionCustomIdData {
    return {
      ...this.customIdData,
      extra: extra ?? null,
    };
  }

  public getBot(): NyxBot {
    return this.bot;
  }

  public buildCustomId(extra?: string): string {
    const data = { ...this.customIdData, extra: extra ?? null };
    return this.codec.serialize(data);
  }

  /** Extracts identity information from the interaction that started this session. */
  protected abstract getStartInteractionInfo(): SessionInteractionInfo;

  /** Handles a button interaction whose customId matches this session. */
  protected handleButton(
    _interaction: Types['ButtonInteraction'],
    _meta: Metadata,
  ): boolean | Promise<boolean> {
    throw new NotImplementedError();
  }

  /** Handles a select menu interaction whose customId matches this session. */
  protected handleSelectMenu(
    _interaction: Types['SelectMenuInteraction'],
    _meta: Metadata,
  ): boolean | Promise<boolean> {
    throw new NotImplementedError();
  }

  /** Handles a modal submit interaction whose customId matches this session. */
  protected handleModal(
    _interaction: Types['ModalSubmitInteraction'],
    _meta: Metadata,
  ): boolean | Promise<boolean> {
    throw new NotImplementedError();
  }

  /** Utility to self end this session. */
  protected async selfEnd(reason?: string): Promise<void> {
    const endReason = reason ?? String(SessionEndCodes.SelfEnded);
    await BaseSessionPlugin.getFromBot<Types>(this.bot).end(
      this,
      endReason,
      SessionEndCodes.SelfEnded,
    );
  }
}
