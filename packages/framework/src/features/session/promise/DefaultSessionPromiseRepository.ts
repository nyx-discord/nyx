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
  ExtractSessionResult,
  Session,
  SessionEndData,
  SessionPromiseRepository,
} from '@nyx-discord/core';

type SessionPromiseData = {
  promise: Promise<SessionEndData<unknown>>;
  resolve: (data: SessionEndData<unknown>) => void;
  reject: (reason?: any) => void;
};

export class DefaultSessionPromiseRepository
  implements SessionPromiseRepository
{
  public static readonly BotStopEndCode = Symbol('Bot stop');

  protected readonly promises: Map<string, SessionPromiseData> = new Map();

  public static create(): SessionPromiseRepository {
    return new DefaultSessionPromiseRepository();
  }

  public onSetup(): void {
    /** Do nothing by default. */
  }

  public onStart(): void {
    /** Do nothing by default. */
  }

  public onStop(): void {
    for (const promiseData of this.promises.values()) {
      const data: SessionEndData<unknown> = {
        reason: String(DefaultSessionPromiseRepository.BotStopEndCode),
        code: DefaultSessionPromiseRepository.BotStopEndCode,
        result: undefined,
      };

      promiseData.resolve(data);
    }
    this.promises.clear();
  }

  public getPromise<const Of extends Session<unknown>>(
    session: Of,
  ): Promise<SessionEndData<ExtractSessionResult<Of>>> {
    /**
     * TODO: Rewrite entirely if
     * {@link https://github.com/tc39/proposal-promise-with-resolvers Promise#withResolvers()} is released.
     */

    const id = session.getId();
    const presentPromise = this.promises.get(id);

    if (presentPromise) {
      return presentPromise.promise as Promise<
        SessionEndData<ExtractSessionResult<Of>>
      >;
    }

    const data: Partial<SessionPromiseData> = {};

    const promise = new Promise<SessionEndData<ExtractSessionResult<Of>>>(
      (resolve, reject) => {
        data.resolve = resolve as (data: SessionEndData<unknown>) => void;
        data.reject = reject;
      },
    );

    data.promise = promise;

    this.promises.set(id, data as SessionPromiseData);
    return promise;
  }

  public reject<const Of extends Session<unknown>>(
    session: Of,
    reason?: Error,
  ): void {
    const id = session.getId();

    const promiseData = this.promises.get(id);
    if (!promiseData) {
      return;
    }

    this.promises.delete(id);
    promiseData.reject(reason);
  }

  public resolve<const Of extends Session<unknown>>(
    session: Of,
    data: SessionEndData<ExtractSessionResult<Of>>,
  ): void {
    const id = session.getId();

    const promiseData = this.promises.get(id);
    if (!promiseData) {
      return;
    }

    this.promises.delete(id);
    promiseData.resolve(data);
  }
}
