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
  BotService,
  BotServiceEventArgs,
  BotStatus,
  EventBus,
  NyxBot,
} from '@nyx-discord/core';
import {
  BotServiceEventEnum,
  BotStatusEnum,
  IllegalStateError,
} from '@nyx-discord/core';

import { BasicEventBus } from '../features/event/bus/BasicEventBus.js';

type StartPromiseData = {
  promise: Promise<NyxBot>;
  resolve: (value: NyxBot) => void;
  reject: (reason?: any) => void;
};

export class DefaultBotService implements BotService {
  public readonly bot: NyxBot;

  protected readonly bus: EventBus<BotServiceEventArgs>;

  protected startPromise!: StartPromiseData;

  protected status: BotStatus = BotStatusEnum.Unprepared;

  public static createStartPromiseData(): StartPromiseData {
    const startPromise: Partial<StartPromiseData> = {};
    startPromise.promise = new Promise<NyxBot>((resolve, reject) => {
      startPromise.resolve = resolve;
      startPromise.reject = reject;
    });

    return startPromise as StartPromiseData;
  }

  constructor(bot: NyxBot, bus: EventBus<BotServiceEventArgs>) {
    this.bot = bot;
    this.bus = bus;

    this.startPromise = DefaultBotService.createStartPromiseData();
  }

  public static create(bot: NyxBot): BotService {
    const busId = Symbol('BotServiceEventBus');

    const bus = BasicEventBus.createAsync<BotServiceEventArgs>(bot, busId);

    return new DefaultBotService(bot, bus);
  }

  public async start(): Promise<this> {
    if (this.status === BotStatusEnum.Running) {
      throw new IllegalStateError();
    }

    if (this.status == BotStatusEnum.Unprepared) {
      await this.setup();
    }

    try {
      const token = this.bot.getToken();
      await this.bot.client.login(token);

      await this.bot.events.onStart();

      await Promise.all([
        await this.bot.commands.onStart(),
        await this.bot.schedules.onStart(),
        await this.bot.sessions.onStart(),
        await this.bot.plugins.onStart(),
      ]);

      this.status = BotStatusEnum.Running;

      Promise.resolve(this.bus.emit(BotServiceEventEnum.Start, [])).catch(
        (error) => {
          this.bot.logger.error(
            'Uncaught bus error while emitting start event.',
            error,
          );
        },
      );
    } catch (error) {
      try {
        this.bot.logger.error('Error while starting bot:', error);
      } finally {
        this.startPromise.reject(error);
        this.status = BotStatusEnum.Killed;
      }
      throw error;
    }
    this.startPromise.resolve(this.bot);
    this.startPromise = DefaultBotService.createStartPromiseData();

    return this;
  }

  public async setup(): Promise<this> {
    if (this.status !== BotStatusEnum.Unprepared) {
      throw new IllegalStateError();
    }

    try {
      await this.bot.events.onSetup();

      await Promise.all([
        await this.bot.commands.onSetup(),
        await this.bot.schedules.onSetup(),
        await this.bot.sessions.onSetup(),
        await this.bot.plugins.onSetup(),
        await this.bus.onRegister(),
      ]);

      this.status = BotStatusEnum.Waiting;

      Promise.resolve(this.bus.emit(BotServiceEventEnum.Setup, [])).catch(
        (error) => {
          this.bot.logger.error(
            'Uncaught bus error while emitting setup event.',
            error,
          );
        },
      );

      return this;
    } catch (error) {
      this.status = BotStatusEnum.Killed;
      throw error;
    }
  }

  public async stop(reason?: string): Promise<this> {
    if (this.status !== BotStatusEnum.Running) {
      throw new IllegalStateError();
    }

    await Promise.all([
      await this.bot.events.onStop(),
      await this.bot.commands.onStop(),
      await this.bot.schedules.onStop(),
      await this.bot.events.onStop(),
      await this.bot.sessions.onStop(),
      await this.bot.plugins.onStop(),
    ]);

    this.status = BotStatusEnum.Stopped;

    Promise.resolve(this.bus.emit(BotServiceEventEnum.Stop, [reason])).catch(
      (error) => {
        this.bot.logger.error(
          'Uncaught bus error while emitting stop event.',
          error,
        );
      },
    );

    await this.bus.onUnregister();

    await this.bot.client.destroy();

    return this;
  }

  public isRunning(): boolean {
    return this.status === BotStatusEnum.Running;
  }

  public getStartPromise(): Promise<NyxBot> {
    return this.startPromise.promise;
  }

  public getStatus(): BotStatus {
    return this.status;
  }

  public getEventBus(): EventBus<BotServiceEventArgs> {
    return this.bus;
  }
}
