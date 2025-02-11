import type {
  EventBus,
  EventSubscriber,
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
  SessionExecutionMeta,
  SessionStateEnum,
} from '@nyx-discord/core';
import type { ClientEvents, Events } from 'discord.js';

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
};

export class DefaultSessionManager implements SessionManager {
  public readonly bot: NyxBot;

  protected readonly bus: EventBus<SessionEventArgs>;

  protected readonly codec: SessionCustomIdCodec;

  protected readonly executor: SessionExecutor;

  protected readonly repository: SessionRepository;

  protected readonly subscriber: EventSubscriber<
    ClientEvents,
    Events.InteractionCreate
  >;

  protected readonly promiseRepository: SessionPromiseRepository;

  constructor(bot: NyxBot, options: SessionManagerOptions) {
    this.bot = bot;
    this.codec = options.customIdCodec;
    this.executor = options.executor;
    this.repository = options.repository;
    this.promiseRepository = options.promiseRepository;
    this.subscriber = options.subscriber;
    this.bus = options.bus;

    this.subscriber.lock();
  }

  public static create(
    bot: NyxBot,
    options?: Partial<SessionManagerOptions>,
  ): SessionManager {
    const constructorOptions = options ?? {};

    if (!constructorOptions.executor) {
      constructorOptions.executor = DefaultSessionExecutor.create();
    }

    if (!constructorOptions.repository) {
      constructorOptions.repository = DefaultSessionRepository.create();
    }

    if (!constructorOptions.promiseRepository) {
      constructorOptions.promiseRepository =
        DefaultSessionPromiseRepository.create();
    }

    if (!constructorOptions.subscriber) {
      constructorOptions.subscriber = new DefaultSessionUpdateSubscriber();
    }

    if (!constructorOptions.customIdCodec) {
      constructorOptions.customIdCodec = DefaultSessionCustomIdCodec.create();
    }

    if (!constructorOptions.bus) {
      const busId = Symbol('SessionManagerEventBus');

      constructorOptions.bus = BasicEventBus.createAsync<SessionEventArgs>(
        bot,
        busId,
      );
    }

    const fullOptions = constructorOptions as SessionManagerOptions;

    const manager = new DefaultSessionManager(bot, fullOptions);

    fullOptions.repository.setExpirationCallback(manager.expire.bind(manager));

    return manager;
  }

  public async onSetup() {
    await this.repository.onSetup();

    const bus = this.bot.getEventManager().getClientBus();
    await bus.subscribe(this.subscriber);
  }

  public async onStart(): Promise<void> {
    await this.repository.onStart();
  }

  public async onStop(): Promise<void> {
    await this.repository.onStop();
  }

  public async start(
    session: Session<unknown>,
    meta?: SessionExecutionMeta,
  ): Promise<boolean> {
    this.checkSessionState(session, SessionStateEnum.Running);

    try {
      await this.repository.save(session);

      const metadata = meta ?? SessionExecutionMeta.fromSession(session);
      await this.executor.start(session, metadata);
      session.setState(SessionStateEnum.Running);

      Promise.resolve(
        this.bus.emit(SessionEventEnum.SessionStart, [
          session,
          session.getStartInteraction(),
          metadata,
        ]),
      ).catch((error) => {
        const executionId = String(metadata.getId());

        this.bot
          .getLogger()
          .error(
            `Uncaught event bus error while emitting session start '${executionId}'.`,
            error,
          );
      });

      return true;
    } catch (e) {
      return session.getStartInteraction().replied;
    }
  }

  public async update(
    interaction: SessionUpdateInteraction,
    meta?: SessionExecutionMeta,
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

    const metadata = meta ?? SessionExecutionMeta.fromSession(session);
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
    ).catch((error) => {
      const executionId = String(metadata.getId());

      this.bot
        .getLogger()
        .error(
          `Uncaught event bus error while emitting session update '${executionId}'.`,
          error,
        );
    });

    return true;
  }

  public async end(
    session: Session<unknown>,
    reason: string,
    code: number,
    meta?: SessionExecutionMeta,
  ): Promise<this> {
    this.checkSessionState(session, SessionStateEnum.Ended);

    const id = session.getId();

    if (!this.repository.has(id)) {
      throw new ObjectNotFoundError(
        `Session with ID '${String(id)}' not found.`,
      );
    }

    const metadata = meta ?? SessionExecutionMeta.fromSession(session);

    await this.repository.delete(id);
    const data = await this.executor.end(session, reason, code, metadata);
    session.setState(SessionStateEnum.Ended);

    this.promiseRepository.resolve(session, data);

    Promise.resolve(
      this.bus.emit(SessionEventEnum.SessionEnd, [session, data, metadata]),
    ).catch((error) => {
      const sessionId = String(session.getId());

      this.bot
        .getLogger()
        .error(
          `Uncaught bus error while emitting session end '${sessionId}'.`,
          error,
        );
    });

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
    const bus = this.bot.getEventManager().getClientBus();

    this.subscriber.unlock();
    await bus.unsubscribe(this.subscriber);

    subscriber.lock();
    await bus.subscribe(subscriber);
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

  protected async expire(session: Session<unknown>): Promise<void> {
    const metadata = SessionExecutionMeta.fromSession(session);
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
    ).catch((error) => {
      const sessionId = String(session.getId());

      this.bot
        .getLogger()
        .error(
          `Uncaught bus error while emitting session expire '${sessionId}'.`,
          error,
        );
    });
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
}
