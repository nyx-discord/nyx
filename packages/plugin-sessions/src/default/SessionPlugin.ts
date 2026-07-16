import type {
  EventBus,
  EventSubscriber,
  Identifier,
  Metadata,
  MetadataFactory,
  NyxBot,
  NyxPlugin,
  NyxPluginData,
} from '@nyx-discord/framework';
import {
  AssertionError,
  BasicEventBus,
  BotStatusEnum,
  DefaultMetadataFactory,
  ObjectNotFoundError,
  TypedFields,
} from '@nyx-discord/framework';
import type { ClientEvents, Events } from 'discord.js';
import type { SessionCustomIdCodec } from '../core/customId/SessionCustomIdCodec';
import type { SessionEndCode } from '../core/end/SessionEndCode';
import { SessionEndCodes } from '../core/end/SessionEndCodes';
import {
  type SessionEventArgs,
  SessionEventEnum,
} from '../core/events/SessionEvent';
import type { SessionExecutor } from '../core/execution/executor/SessionExecutor';
import type { AnySessionInteraction } from '../core/interaction/AnySessionInteraction';
import type { SessionUpdateInteraction } from '../core/interaction/SessionUpdateInteraction';
import type { SessionLimitManager } from '../core/limit/SessionLimitManager';
import type { SessionPromiseRepository } from '../core/promise/SessionPromiseRepository';
import type { ReadonlySessionRepository } from '../core/repository/ReadonlySessionRepository';
import type { SessionRepository } from '../core/repository/SessionRepository';
import type { Session } from '../core/session/Session';
import type { SessionState } from '../core/state/SessionState';
import { SessionStateEnum } from '../core/state/SessionState';
import { ensureKey } from '../core/util/ensureKey';
import { DefaultSessionCustomIdCodec } from './customId/DefaultSessionCustomIdCodec';
import { DefaultSessionUpdateSubscriber } from './event/DefaultSessionUpdateSubscriber';
import { DefaultSessionExecutor } from './executor/DefaultSessionExecutor';
import { DefaultSessionLimitManager } from './limit/DefaultSessionLimitManager';
import { DefaultSessionPromiseRepository } from './promise/DefaultSessionPromiseRepository';
import { DefaultSessionRepository } from './repository/DefaultSessionRepository';

type SessionManagerOptions = {
  customIdCodec: SessionCustomIdCodec;
  executor: SessionExecutor;
  repository: SessionRepository;
  promiseRepository: SessionPromiseRepository;
  subscriber: EventSubscriber<ClientEvents, Events.InteractionCreate>;
  bus: EventBus<SessionEventArgs>;
  metaFactory: MetadataFactory;
  limitManager?: SessionLimitManager;
};

export class SessionPlugin implements NyxPlugin {
  public static readonly ID: Identifier = Symbol('SessionPlugin');

  public static readonly Data: NyxPluginData = {
    name: 'Session Manager',
    description:
      'A nyx plugin to manage user interaction sessions in your bot.',
    git: 'https://github.com/nyx-discord/nyx/tree/main/packages/plugin-sessions',
  };

  protected readonly bus: EventBus<SessionEventArgs>;

  protected readonly codec: SessionCustomIdCodec;

  protected readonly executor: SessionExecutor;

  protected readonly repository: SessionRepository;

  protected readonly promiseRepository: SessionPromiseRepository;

  protected readonly metaFactory: MetadataFactory;

  protected readonly limitManager: SessionLimitManager;

  protected subscriber: EventSubscriber<ClientEvents, Events.InteractionCreate>;

  protected bot: NyxBot | null = null;

  constructor(options: SessionManagerOptions) {
    this.codec = options.customIdCodec;
    this.executor = options.executor;
    this.repository = options.repository;
    this.promiseRepository = options.promiseRepository;
    this.subscriber = options.subscriber;
    this.bus = options.bus;
    this.metaFactory = options.metaFactory;
    this.limitManager =
      options.limitManager ?? new DefaultSessionLimitManager(this);
    this.subscriber.protect();
  }

  public static getFromBot(bot: NyxBot): SessionPlugin {
    return bot.getPluginManager().getPluginByClass(this, true);
  }

  public static create(options?: {
    injections?: Partial<SessionManagerOptions>;
  }): SessionPlugin {
    const constructorOptions = options?.injections ?? {};
    const metaFactory = new DefaultMetadataFactory();

    ensureKey(constructorOptions, 'executor', DefaultSessionExecutor.create());
    ensureKey(
      constructorOptions,
      'repository',
      DefaultSessionRepository.create(),
    );
    ensureKey(
      constructorOptions,
      'promiseRepository',
      DefaultSessionPromiseRepository.create(),
    );
    ensureKey(
      constructorOptions,
      'subscriber',
      new DefaultSessionUpdateSubscriber(),
    );
    ensureKey(
      constructorOptions,
      'customIdCodec',
      DefaultSessionCustomIdCodec.create(),
    );
    ensureKey(
      constructorOptions,
      'bus',
      BasicEventBus.createAsync<SessionEventArgs>(metaFactory),
    );
    ensureKey(constructorOptions, 'metaFactory', metaFactory);

    const manager = new this({
      ...constructorOptions,
    });

    constructorOptions.repository.setExpirationCallback(
      manager.expire.bind(manager),
    );

    return manager;
  }

  public async onRegister(bot: NyxBot): Promise<void> {
    this.bot = bot;
    this.metaFactory.addDefaultField(TypedFields.Bot, bot);

    await bot.subscribeToClient(this.subscriber);
    await this.repository.onStart();
  }

  public async onUnregister(): Promise<void> {
    await this.repository.onStop();
  }

  public async start(
    session: Session<unknown>,
    meta?: Metadata,
  ): Promise<boolean> {
    this.checkSessionState(session, SessionStateEnum.Running);

    const metadata = this.createOrPopulateMeta({
      meta,
      session,
      customIdExtra: null,
      interaction: session.getStartInteraction(),
      extraData: [],
    });

    await this.limitManager.checkAndReserve(session, metadata);

    try {
      await this.repository.save(session);

      const result = await Promise.resolve(
        this.executor.start(session, metadata),
      ).catch((e) => e);
      session.setState(SessionStateEnum.Running);
      if (result !== true) {
        await this.repository.delete(session.getId());
        return false;
      }

      Promise.resolve(
        this.bus.emit(SessionEventEnum.SessionStart, [
          session,
          session.getStartInteraction(),
          metadata,
        ]),
      ).catch((_error) => {});

      return true;
    } catch (error) {
      this.bot
        ?.getLogger()
        .error(`Failed to start session with ID '${session.getId()}}`, error);
      return session.getStartInteraction().replied;
    }
  }

  public async update(
    interaction: SessionUpdateInteraction,
    meta?: Metadata,
  ): Promise<boolean> {
    const { customId } = interaction;
    const customIdData = this.codec.deserialize(customId);
    if (!customIdData) return false;

    const { id } = customIdData;
    const session = await this.repository.get(id);

    if (!session) {
      await this.executor.handleMissing(id, interaction);
      return true;
    }

    if (session.getState() !== SessionStateEnum.Running) {
      throw new AssertionError();
    }

    const metadata = this.createOrPopulateMeta({
      meta,
      session,
      customIdExtra: customIdData.extra,
      interaction,
      extraData: [],
    });
    const updateTtl = await this.executor.update(
      session,
      interaction,
      metadata,
    );

    if (session.getState() === SessionStateEnum.Ended) {
      return true;
    }

    if (updateTtl) {
      await this.repository.setTTL(session.getId(), session.getTTL());
    }

    Promise.resolve(
      this.bus.emit(SessionEventEnum.SessionUpdate, [
        session,
        interaction,
        metadata,
      ]),
    ).catch((_error) => {});

    return true;
  }

  public async end(
    session: Session<unknown>,
    reason: string,
    code: SessionEndCode,
    meta?: Metadata,
  ): Promise<this> {
    this.checkSessionState(session, SessionStateEnum.Ended);

    const id = session.getId();

    if (!this.repository.has(id)) {
      throw new ObjectNotFoundError(
        `Session with ID '${String(id)}' not found.`,
      );
    }

    const metadata = this.createOrPopulateMeta({
      meta,
      session,
      customIdExtra: null,
      interaction: null,
      extraData: [
        { name: 'Reason', value: reason },
        { name: 'Code', value: code.toString() },
      ],
    });

    await this.repository.delete(id);
    const data = await this.executor.end(session, reason, code, metadata);
    session.setState(SessionStateEnum.Ended);

    this.promiseRepository.resolve(session, data);

    this.limitManager.release(session);

    Promise.resolve(
      this.bus.emit(SessionEventEnum.SessionEnd, [session, data, metadata]),
    ).catch((_error) => {});

    return this;
  }

  public async resolve(
    interaction: SessionUpdateInteraction,
  ): Promise<Session<unknown> | null> {
    const { customId } = interaction;
    const customIdData = this.codec.deserialize(customId);
    if (!customIdData) return null;

    const session = await this.repository.get(customIdData.id);
    return session ?? null;
  }

  public async subscribe(
    ...subscribers: EventSubscriber<SessionEventArgs, keyof SessionEventArgs>[]
  ): Promise<this> {
    await this.bus.subscribe(...subscribers);
    return this;
  }

  public async setUpdateSubscriber(
    subscriber: EventSubscriber<ClientEvents, Events.InteractionCreate>,
  ): Promise<this> {
    if (!this.bot) {
      throw new AssertionError('Bot not set, has the plugin been registered?');
    }
    const clientBus = this.bot.getClientEventBus();

    this.subscriber.unprotect();
    await clientBus.unsubscribe(this.subscriber);

    subscriber.protect();
    await clientBus.subscribe(subscriber);

    this.subscriber = subscriber;
    return this;
  }

  public getUpdateSubscriber(): EventSubscriber<
    ClientEvents,
    Events.InteractionCreate
  > {
    return this.subscriber;
  }

  public getCustomIdCodec(): SessionCustomIdCodec {
    return this.codec;
  }

  public getEventBus(): EventBus<SessionEventArgs> {
    return this.bus;
  }

  public getExecutor(): SessionExecutor {
    return this.executor;
  }

  public getRepository(): ReadonlySessionRepository {
    return this.repository;
  }

  public getPromiseRepository(): SessionPromiseRepository {
    return this.promiseRepository;
  }

  public getMetadataFactory(): MetadataFactory {
    return this.metaFactory;
  }

  public getSessionLimits(): SessionLimitManager {
    return this.limitManager;
  }

  public isRunning(): boolean {
    return !!this.bot && this.bot.getStatus() === BotStatusEnum.Running;
  }

  public getId(): Identifier {
    return SessionPlugin.ID;
  }

  public getData(): NyxPluginData {
    return SessionPlugin.Data;
  }

  protected async expire(session: Session<unknown>): Promise<void> {
    const metadata = this.createOrPopulateMeta({
      meta: undefined,
      session,
      customIdExtra: null,
      interaction: null,
      extraData: [],
    });
    const data = await this.executor.end(
      session,
      String(SessionEndCodes.Expired),
      SessionEndCodes.Expired,
      metadata,
    );
    session.setState(SessionStateEnum.Ended);

    if (!data) {
      return;
    }

    this.promiseRepository.resolve(session, data);

    Promise.resolve(
      this.bus.emit(SessionEventEnum.SessionExpire, [session, data]),
    ).catch((_error) => {});
  }

  /** Checks if a new state is valid given a session's current state. */
  protected checkSessionState(
    session: Session<unknown>,
    newState: SessionState,
  ): void {
    const oldState = session.getState();

    if (
      newState === SessionStateEnum.Uninitalized
      && oldState != SessionStateEnum.Uninitalized
    ) {
      throw new AssertionError();
    }

    if (
      newState == SessionStateEnum.Running
      && oldState !== SessionStateEnum.Uninitalized
    ) {
      throw new AssertionError();
    }

    if (
      newState == SessionStateEnum.Ended
      && oldState !== SessionStateEnum.Running
    ) {
      throw new AssertionError();
    }
  }

  /** Creates a meta collection for a session, or populates an existing one. */
  protected createOrPopulateMeta(options: {
    meta: Metadata | undefined;
    session: Session<unknown>;
    customIdExtra: string | null;
    interaction: AnySessionInteraction | null;
    extraData: { name: string; value: string }[];
  }): Metadata {
    const sessionId = options.session.getId();

    const executionData = [
      { name: 'Session', value: sessionId },
      { name: 'Date', value: new Date().toISOString() },
      ...options.extraData,
    ];

    if (options.interaction) {
      executionData.push(
        { name: 'Interaction ID', value: `${options.interaction.id}` },
        { name: 'Interaction Type', value: `${options.interaction.type}` },
      );
    }

    const executionId = Symbol(
      executionData.map((e) => `${e.name} '${e.value}'`).join(' | '),
    );

    const metadata = this.metaFactory.createOrPopulate(
      options.meta,
      executionId,
    );
    if (options.customIdExtra) {
      TypedFields.CustomIdExtra.set(metadata, options.customIdExtra);
    }

    return metadata;
  }
}
