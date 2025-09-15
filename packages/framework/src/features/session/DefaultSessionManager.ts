import type {
  AnySessionInteraction,
  EventBus,
  EventSubscriber,
  MetaCollection,
  MetaCollectionFactory,
  NyxBot,
  ReadonlySessionRepository,
  Session,
  SessionCustomIdCodec,
  SessionEventArgs,
  SessionExecutor,
  SessionManager,
  SessionPromiseRepository,
  SessionRepository,
  SessionState,
  SessionUpdateInteraction,
} from '@nyx-discord/core';
import {
  AssertionError,
  ObjectNotFoundError,
  SessionEndCodes,
  SessionEventEnum,
  SessionStateEnum,
  TypedFields,
} from '@nyx-discord/core';
import type { ClientEvents, Events } from 'discord.js';
import { DefaultMetaCollectionFactory } from '../../meta/DefaultMetaCollectionFactory.js';
import { ensureKey } from '../../util/ensureKey.js';
import { BasicEventBus } from '../event/bus/BasicEventBus.js';
import { DefaultSessionCustomIdCodec } from './customId/DefaultSessionCustomIdCodec';
import { DefaultSessionUpdateSubscriber } from './event/DefaultSessionUpdateSubscriber.js';
import { DefaultSessionExecutor } from './executor/DefaultSessionExecutor.js';
import { DefaultSessionPromiseRepository } from './promise/DefaultSessionPromiseRepository.js';
import { DefaultSessionRepository } from './repository/DefaultSessionRepository.js';

type SessionManagerOptions = {
  customIdCodec: SessionCustomIdCodec;
  executor: SessionExecutor;
  repository: SessionRepository;
  promiseRepository: SessionPromiseRepository;
  subscriber: EventSubscriber<ClientEvents, Events.InteractionCreate>;
  bus: EventBus<SessionEventArgs>;
  metaFactory: MetaCollectionFactory;
  clientBus: EventBus<ClientEvents>;
};

export class DefaultSessionManager implements SessionManager {
  protected readonly bus: EventBus<SessionEventArgs>;

  protected readonly codec: SessionCustomIdCodec;

  protected readonly executor: SessionExecutor;

  protected readonly repository: SessionRepository;

  protected readonly clientBus: EventBus<ClientEvents>;

  protected readonly promiseRepository: SessionPromiseRepository;

  protected readonly metaFactory: MetaCollectionFactory;

  protected subscriber: EventSubscriber<ClientEvents, Events.InteractionCreate>;

  constructor(options: SessionManagerOptions) {
    this.codec = options.customIdCodec;
    this.executor = options.executor;
    this.repository = options.repository;
    this.promiseRepository = options.promiseRepository;
    this.subscriber = options.subscriber;
    this.bus = options.bus;
    this.metaFactory = options.metaFactory;
    this.clientBus = options.clientBus;
    this.subscriber.protect();
  }

  public static create(options: {
    bot: NyxBot;
    clientBus: EventBus<ClientEvents>;
    injections?: Partial<SessionManagerOptions>;
  }): SessionManager {
    const constructorOptions = options.injections ?? {};
    const metaFactory = DefaultMetaCollectionFactory.createWith([
      TypedFields.Bot,
      options.bot,
    ]);

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
      BasicEventBus.createAsync<SessionEventArgs>(
        Symbol('SessionManagerEventBus'),
        metaFactory,
      ),
    );
    ensureKey(constructorOptions, 'metaFactory', metaFactory);

    const manager = new DefaultSessionManager({
      ...constructorOptions,
      clientBus: options.clientBus,
    });

    constructorOptions.repository.setExpirationCallback(
      manager.expire.bind(manager),
    );

    return manager;
  }

  public async onStart(): Promise<void> {
    await this.clientBus.subscribe(this.subscriber);
    await this.repository.onStart();
  }

  public async onStop(): Promise<void> {
    await this.repository.onStop();
  }

  public async start(
    session: Session<unknown>,
    meta?: MetaCollection,
  ): Promise<boolean> {
    this.checkSessionState(session, SessionStateEnum.Running);

    try {
      await this.repository.save(session);

      const metadata = this.createOrPopulateMeta({
        meta,
        session,
        customIdExtra: null,
        interaction: session.getStartInteraction(),
        extraData: [],
      });

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
    } catch (_error) {
      return session.getStartInteraction().replied;
    }
  }

  public async update(
    interaction: SessionUpdateInteraction,
    meta?: MetaCollection,
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
    code: number,
    meta?: MetaCollection,
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
    this.subscriber.unprotect();
    await this.clientBus.unsubscribe(this.subscriber);
    subscriber.protect();
    await this.clientBus.subscribe(subscriber);
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

  public getMetaCollectionFactory(): MetaCollectionFactory {
    return this.metaFactory;
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
    meta: MetaCollection | undefined;
    session: Session<unknown>;
    customIdExtra: string | null;
    interaction: AnySessionInteraction | null;
    extraData: { name: string; value: string }[];
  }): MetaCollection {
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
