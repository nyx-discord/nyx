/*
 * MIT License
 *
 * Copyright (c) 2023 Amgelo563
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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

    const bus = this.bot.events.getClientBus();
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

        this.bot.logger.error(
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
    const sessionCustomId = this.codec.deserializeToObjectId(customId);
    if (!sessionCustomId) return false;

    const session = await this.repository.get(sessionCustomId);

    if (!session) {
      await this.executor.handleMissing(sessionCustomId, interaction);
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

      this.bot.logger.error(
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

    if (!data) {
      return this;
    }

    Promise.resolve(
      this.bus.emit(SessionEventEnum.SessionEnd, [session, data, metadata]),
    ).catch((error) => {
      const sessionId = String(session.getId());

      this.bot.logger.error(
        `Uncaught bus error while emitting session end '${sessionId}'.`,
        error,
      );
    });

    return this;
  }

  public async setUpdateSubscriber(
    subscriber: EventSubscriber<ClientEvents, Events.InteractionCreate>,
  ): Promise<this> {
    const bus = this.bot.events.getClientBus();

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
      String(DefaultSessionExecutor.SessionExpiredCode),
      DefaultSessionExecutor.SessionExpiredCode,
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

      this.bot.logger.error(
        `Uncaught bus error while emitting session expire '${sessionId}'.`,
        error,
      );
    });
  }

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
