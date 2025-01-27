import type { BotLifecycleObserver } from '../../../types/BotLifecycleObserver';
import type { SessionEndData } from '../end/SessionEndData';
import type { Session } from '../session/Session.js';
import type { ExtractSessionResult } from '../types/ExtractSessionResult.js';

export interface SessionPromiseRepository extends BotLifecycleObserver {
  getPromise<const Of extends Session<unknown>>(
    session: Of,
  ): Promise<SessionEndData<ExtractSessionResult<Of>>>;

  resolve<const Of extends Session<unknown>>(
    session: Of,
    data: SessionEndData<ExtractSessionResult<Of>>,
  ): void;

  reject<const Of extends Session<unknown>>(session: Of, reason?: Error): void;
}
