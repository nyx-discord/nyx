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
