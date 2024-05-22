/*
 * MIT License
 *
 * Copyright (c) 2024 Amgelo563
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
  Identifier,
  MiddlewareList,
  Session,
  SessionEndArgs,
  SessionEndData,
  SessionErrorHandler,
  SessionExecutionMeta,
  SessionExecutor,
  SessionStartArgs,
  SessionStartMiddleware,
  SessionUpdateArgs,
  SessionUpdateInteraction,
  SessionUpdateMiddleware,
} from '@nyx-discord/core';
import {
  IllegalStateError,
  SessionStartMiddlewareError,
  SessionStateEnum,
  SessionUpdateMiddlewareError,
  UncaughtSessionStartMiddlewareError,
  UncaughtSessionUpdateMiddlewareError,
} from '@nyx-discord/core';

import { ActionRowList } from '../../../discord/ActionRowList.js';
import { BasicErrorHandler } from '../../../error/BasicErrorHandler.js';
import { SessionStartMiddlewareList } from '../middleware/SessionStartMiddlewareList';
import { SessionUpdateMiddlewareList } from '../middleware/SessionUpdateMiddlewareList';

export class DefaultSessionExecutor implements SessionExecutor {
  protected readonly startErrorHandler: SessionErrorHandler<SessionStartArgs>;

  protected readonly updateErrorHandler: SessionErrorHandler<SessionUpdateArgs>;

  protected readonly endErrorHandler: SessionErrorHandler<SessionEndArgs>;

  protected readonly startMiddleware: MiddlewareList<SessionStartMiddleware>;

  protected readonly updateMiddleware: MiddlewareList<SessionUpdateMiddleware>;

  constructor(
    startMiddleware: MiddlewareList<SessionStartMiddleware>,
    updateMiddleware: MiddlewareList<SessionUpdateMiddleware>,
    createErrorHandler: SessionErrorHandler<SessionStartArgs>,
    updateErrorHandler: SessionErrorHandler<SessionUpdateArgs>,
    stopErrorHandler: SessionErrorHandler<SessionEndArgs>,
  ) {
    this.startMiddleware = startMiddleware;
    this.updateMiddleware = updateMiddleware;

    this.startErrorHandler = createErrorHandler;
    this.updateErrorHandler = updateErrorHandler;
    this.endErrorHandler = stopErrorHandler;
  }

  public static create(): SessionExecutor {
    return new DefaultSessionExecutor(
      SessionStartMiddlewareList.create(),
      SessionUpdateMiddlewareList.create(),

      BasicErrorHandler.createWithFallbackLogger(
        (_error, session) => session.bot.logger,
      ),
      BasicErrorHandler.createWithFallbackLogger(
        (_error, session) => session.bot.logger,
      ),
      BasicErrorHandler.createWithFallbackLogger(
        (_error, session) => session.bot.logger,
      ),
    );
  }

  public async start(
    session: Session<unknown>,
    meta: SessionExecutionMeta,
  ): Promise<boolean> {
    if (session.getState() !== SessionStateEnum.Uninitalized) {
      throw new IllegalStateError(
        `Session ${session.getId()} is already initialized.`,
      );
    }

    try {
      const result = await this.startMiddleware.check(session, meta);
      if (!result) return false;
    } catch (error) {
      const wrappedError =
        error instanceof SessionStartMiddlewareError
          ? error
          : new UncaughtSessionStartMiddlewareError(
              error as Error,
              this.startMiddleware,
              session,
              meta,
            );

      await this.startErrorHandler.handle(wrappedError, session, [meta]);

      return false;
    }

    try {
      await session.onStart(meta);

      return true;
    } catch (error) {
      await this.startErrorHandler.handle(error as object, session, [meta]);

      const interaction = session.getStartInteraction();
      return interaction.replied;
    }
  }

  public async update(
    session: Session<unknown>,
    interaction: SessionUpdateInteraction,
    meta: SessionExecutionMeta,
  ): Promise<boolean> {
    if (session.getState() !== SessionStateEnum.Running) {
      throw new IllegalStateError();
    }

    try {
      const result = await this.updateMiddleware.check(
        session,
        interaction,
        meta,
      );
      if (!result) return false;
    } catch (error) {
      const wrappedError =
        error instanceof SessionUpdateMiddlewareError
          ? error
          : new UncaughtSessionUpdateMiddlewareError(
              error as Error,
              this.updateMiddleware,
              session,
              interaction,
              meta,
            );

      await this.updateErrorHandler.handle(wrappedError, session, [
        interaction,
        meta,
      ]);
      return false;
    }

    try {
      return await session.onUpdate(interaction, meta);
    } catch (error) {
      await this.updateErrorHandler.handle(error as object, session, [
        interaction,
        meta,
      ]);

      return false;
    }
  }

  public async end(
    session: Session<unknown>,
    reason: string,
    code: Identifier | number,
    meta: SessionExecutionMeta,
  ): Promise<SessionEndData<unknown>> {
    if (session.getState() !== SessionStateEnum.Running) {
      throw new IllegalStateError();
    }

    const endData: SessionEndData<unknown> = {
      reason,
      code,
      result: null,
    };

    try {
      await session.onEnd(reason, code, meta);

      endData.result = session.getResult();

      return endData;
    } catch (error) {
      await this.endErrorHandler.handle(error as object, session, [
        endData,
        meta,
      ]);

      return endData;
    }
  }

  public getStartMiddleware(): MiddlewareList<SessionStartMiddleware> {
    return this.startMiddleware;
  }

  public getUpdateMiddleware(): MiddlewareList<SessionUpdateMiddleware> {
    return this.updateMiddleware;
  }

  public getStartErrorHandler(): SessionErrorHandler<SessionStartArgs> {
    return this.startErrorHandler;
  }

  public getUpdateErrorHandler(): SessionErrorHandler<SessionUpdateArgs> {
    return this.updateErrorHandler;
  }

  public getEndErrorHandler(): SessionErrorHandler<SessionEndArgs> {
    return this.endErrorHandler;
  }

  public async handleMissing(
    _sessionId: string,
    interaction: SessionUpdateInteraction,
  ): Promise<void> {
    const { message } = interaction;
    const rowList = ActionRowList.fromMessage(message);
    rowList.setDisabled(true);

    await interaction.update({ components: rowList.toRowsData() });
  }

  public setMissingHandler(
    handler: (
      sessionId: string,
      interaction: SessionUpdateInteraction,
    ) => Promise<void>,
  ) {
    this.handleMissing = handler;
  }
}
