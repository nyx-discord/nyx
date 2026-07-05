import type {
  Identifier,
  Metadata,
  NyxBot,
  ReadonlyMetadata,
} from '@nyx-discord/framework';
import { AssertionError, NotImplementedError } from '@nyx-discord/framework';
import type {
  AnySelectMenuInteraction,
  Awaitable,
  ButtonInteraction,
  ModalSubmitInteraction,
} from 'discord.js';
import type { SessionCustomIdData } from '../../core/customId/data/SessionCustomIdData';
import type { SessionCustomIdCodec } from '../../core/customId/SessionCustomIdCodec';
import { SessionEndCodes } from '../../core/end/SessionEndCodes';
import type { SessionEndData } from '../../core/end/SessionEndData';
import type { SessionStartFilterResolvable } from '../../core/filter/start/SessionStartFilterResolvable';
import type { SessionUpdateFilterResolvable } from '../../core/filter/update/SessionUpdateFilterResolvable';
import type { SessionStartInteraction } from '../../core/interaction/SessionStartInteraction';
import type { SessionUpdateInteraction } from '../../core/interaction/SessionUpdateInteraction';
import type { Session } from '../../core/session/Session';
import {
  type SessionState,
  SessionStateEnum,
} from '../../core/state/SessionState';
import { SessionPlugin } from '../SessionPlugin';

export abstract class AbstractSession<Result = void>
  implements Session<Result>
{
  public static readonly DefaultTTL = 180_000; // 3 minutes

  protected readonly bot: NyxBot;

  protected readonly id: string;

  protected readonly startInteraction: SessionStartInteraction;

  protected readonly customIdData: Readonly<SessionCustomIdData>;

  protected readonly startFilter: SessionStartFilterResolvable<Result> | null =
    null;

  protected readonly updateFilter: SessionUpdateFilterResolvable<Result> | null =
    null;

  protected readonly ttl: number = AbstractSession.DefaultTTL;

  protected readonly codec: SessionCustomIdCodec;

  protected readonly meta: Metadata = Object.create(null);

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
    this.codec = SessionPlugin.getFromBot(options.bot).getCustomIdCodec();
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
    await SessionPlugin.getFromBot(this.bot).start(this);
  }

  public async onUpdate(
    interaction: SessionUpdateInteraction,
    meta: Metadata,
  ): Promise<boolean> {
    if (interaction.isButton()) return this.handleButton(interaction, meta);
    if (interaction.isModalSubmit()) return this.handleModal(interaction, meta);
    return this.handleSelectMenu(interaction, meta);
  }

  public abstract onStart(meta: Metadata): Awaitable<void>;

  public abstract onEnd(
    reason: string,
    code: Identifier | number,
    meta: Metadata,
  ): Awaitable<void>;

  public getResult(): Result | null {
    return this.result;
  }

  public getEndPromise(): Promise<SessionEndData<Result>> {
    return SessionPlugin.getFromBot(this.bot)
      .getPromiseRepository()
      .getPromise(this) as Promise<SessionEndData<Result>>;
  }

  public getMeta(): ReadonlyMetadata {
    return this.meta;
  }

  public getStartFilter(): SessionStartFilterResolvable<Result> | null {
    return this.startFilter;
  }

  public getUpdateFilter(): SessionUpdateFilterResolvable<Result> | null {
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

  public getBot(): NyxBot {
    return this.bot;
  }

  public buildCustomId(extra?: string): string {
    const data = { ...this.customIdData, extra: extra ?? null };
    return this.codec.serialize(data);
  }

  /** Handles a {@link ButtonInteraction} whose customId matches this session. */
  protected handleButton(
    _interaction: ButtonInteraction,
    _meta: Metadata,
  ): boolean | Promise<boolean> {
    throw new NotImplementedError();
  }

  /** Handles an {@link AnySelectMenuInteraction} whose customId matches this session. */
  protected handleSelectMenu(
    _interaction: AnySelectMenuInteraction,
    _meta: Metadata,
  ): boolean | Promise<boolean> {
    throw new NotImplementedError();
  }

  /** Handles a {@link ModalSubmitInteraction} whose customId matches this session. */
  protected handleModal(
    _interaction: ModalSubmitInteraction,
    _meta: Metadata,
  ): boolean | Promise<boolean> {
    throw new NotImplementedError();
  }

  /** Utility to self end this session. */
  protected async selfEnd(reason?: string): Promise<void> {
    const endReason = reason ?? String(SessionEndCodes.SelfEnded);
    await SessionPlugin.getFromBot(this.bot).end(
      this,
      endReason,
      SessionEndCodes.SelfEnded,
    );
  }
}
