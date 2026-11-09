import type { BotLifecycleObserver, InteractionTypes } from '@nyx-discord/base';
import type { SessionEndData } from '../end/SessionEndData.js';
import type { ExtractSessionResult } from '../ExtractSessionResult.js';
import type { Session } from '../session/Session.js';

export interface SessionPromiseRepository<
  Types extends InteractionTypes = InteractionTypes,
> extends BotLifecycleObserver {
  getPromise<const Of extends Session<unknown, Types>>(
    session: Of,
  ): Promise<SessionEndData<ExtractSessionResult<Of>>>;

  resolve<const Of extends Session<unknown, Types>>(
    session: Of,
    data: SessionEndData<ExtractSessionResult<Of>>,
  ): void;

  reject<const Of extends Session<unknown, Types>>(
    session: Of,
    reason?: Error,
  ): void;
}
