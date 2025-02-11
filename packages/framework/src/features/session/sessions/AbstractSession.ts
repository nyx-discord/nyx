import { Collection } from '@discordjs/collection';
import type {
  Identifier,
  MetaCollection,
  NyxBot,
  ReadonlyMetaCollection,
  Session,
  SessionCustomIdCodec,
  SessionCustomIdData,
  SessionEndData,
  SessionExecutionMeta,
  SessionStartFilter,
  SessionStartInteraction,
  SessionState,
  SessionUpdateFilter,
  SessionUpdateInteraction,
} from '@nyx-discord/core';
import {
  AssertionError,
  SessionEndCodes,
  SessionStateEnum,
} from '@nyx-discord/core';
import type {
  AnySelectMenuInteraction,
  Awaitable,
  ButtonInteraction,
  ModalSubmitInteraction,
} from 'discord.js';
import { NotImplementedError } from '../../../errors/NotImplementedError.js';

export abstract class AbstractSession<Result = void>
  implements Session<Result>
{
  public static readonly DefaultTTL = 180_000; // 3 minutes

  public readonly bot: NyxBot;

  protected readonly id: string;

  protected readonly startInteraction: SessionStartInteraction;

  protected readonly customIdData: Readonly<SessionCustomIdData>;

  protected readonly startFilter: SessionStartFilter<Result> | null = null;

  protected readonly updateFilter: SessionUpdateFilter<Result> | null = null;

  protected readonly ttl: number = AbstractSession.DefaultTTL;

  protected readonly codec: SessionCustomIdCodec;

  protected readonly meta: MetaCollection = new Collection<
    Identifier,
    unknown
  >();

  protected result: Result | null = null;

  protected state: SessionState = SessionStateEnum.Uninitalized;

  constructor(options: {
    bot: NyxBot;
    id: string;
    startInteraction: SessionStartInteraction;
    ttl?: number;
  }) {
    this.bot = options.bot;
    this.id = options.id;
    this.startInteraction = options.startInteraction;
    this.codec = options.bot.getSessionManager().getCustomIdCodec();
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
    await this.bot.getSessionManager().start(this);
  }

  public async onUpdate(
    interaction: SessionUpdateInteraction,
    meta: SessionExecutionMeta,
  ): Promise<boolean> {
    if (interaction.isButton()) return this.handleButton(interaction, meta);
    if (interaction.isModalSubmit()) return this.handleModal(interaction, meta);
    return this.handleSelectMenu(interaction, meta);
  }

  public abstract onStart(meta: SessionExecutionMeta): Awaitable<void>;

  public abstract onEnd(
    reason: string,
    code: Identifier | number,
    meta: SessionExecutionMeta,
  ): Awaitable<void>;

  public getResult(): Result | null {
    return this.result;
  }

  public getEndPromise(): Promise<SessionEndData<Result>> {
    return this.bot
      .getSessionManager()
      .getPromiseRepository()
      .getPromise(this) as Promise<SessionEndData<Result>>;
  }

  public getMeta(): ReadonlyMetaCollection {
    return this.meta;
  }

  public getStartFilter(): SessionStartFilter<Result> | null {
    return this.startFilter;
  }

  public getUpdateFilter(): SessionUpdateFilter<Result> | null {
    return this.updateFilter;
  }

  public getId(): string {
    return this.id;
  }

  public getTTL(): number {
    return this.ttl;
  }

  public getStartInteraction(): SessionStartInteraction {
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

  public buildCustomId(extra?: string): string {
    const data = { ...this.customIdData, extra: extra ?? null };
    return this.codec.serialize(data);
  }

  /** Handles a {@link ButtonInteraction} whose customId matches this session. */
  protected handleButton(
    _interaction: ButtonInteraction,
    _meta: SessionExecutionMeta,
  ): boolean | Promise<boolean> {
    throw new NotImplementedError();
  }

  /** Handles an {@link AnySelectMenuInteraction} whose customId matches this session. */
  protected handleSelectMenu(
    _interaction: AnySelectMenuInteraction,
    _meta: SessionExecutionMeta,
  ): boolean | Promise<boolean> {
    throw new NotImplementedError();
  }

  /** Handles a {@link ModalSubmitInteraction} whose customId matches this session. */
  protected handleModal(
    _interaction: ModalSubmitInteraction,
    _meta: SessionExecutionMeta,
  ): boolean | Promise<boolean> {
    throw new NotImplementedError();
  }

  /** Utility to self end this session. */
  protected async selfEnd(reason?: string): Promise<void> {
    const endReason = reason ?? String(SessionEndCodes.SelfEnded);
    await this.bot
      .getSessionManager()
      .end(this, endReason, SessionEndCodes.SelfEnded);
  }
}
