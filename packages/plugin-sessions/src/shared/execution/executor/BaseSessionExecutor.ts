import type {
  Awaitable,
  InteractionTypes,
  Metadata,
  MiddlewareList,
} from '@nyx-discord/types';
import { IllegalStateError } from '@nyx-discord/types';
import type { APIMessageTopLevelComponent } from 'discord-api-types/v10';
import type { SessionEndCode } from '../../end/SessionEndCode.js';
import type { SessionEndData } from '../../end/SessionEndData.js';
import type { SessionErrorHandler } from '../../error/SessionErrorHandler.js';
import type { SessionEndArgs } from '../args/SessionEndArgs.js';
import type { SessionStartArgs } from '../args/SessionStartArgs.js';
import type { SessionUpdateArgs } from '../args/SessionUpdateArgs.js';
import type { SessionExecutor } from './SessionExecutor.js';
import type { SessionUpdateInteraction } from '../../interaction/SessionUpdateInteraction.js';
import { SessionStartMiddlewareError } from '../../middleware/errors/SessionStartMiddlewareError.js';
import { SessionUpdateMiddlewareError } from '../../middleware/errors/SessionUpdateMiddlewareError.js';
import { UncaughtSessionStartMiddlewareError } from '../../middleware/errors/UncaughtSessionStartMiddlewareError.js';
import { UncaughtSessionUpdateMiddlewareError } from '../../middleware/errors/UncaughtSessionUpdateMiddlewareError.js';
import type { SessionStartMiddlewareResolvable } from '../../middleware/start/SessionStartMiddlewareResolvable.js';
import type { SessionUpdateMiddlewareResolvable } from '../../middleware/update/SessionUpdateMiddlewareResolvable.js';
import type { Session } from '../../session/Session.js';
import { SessionStateEnum } from '../../state/SessionState.js';
import { disableAllComponents } from '../../util/disableAllComponents.js';

export abstract class BaseSessionExecutor<
  Types extends InteractionTypes = InteractionTypes,
> implements SessionExecutor<Types> {
  protected readonly startErrorHandler: SessionErrorHandler<
    SessionStartArgs,
    Types
  >;

  protected readonly updateErrorHandler: SessionErrorHandler<
    SessionUpdateArgs<Types>,
    Types
  >;

  protected readonly endErrorHandler: SessionErrorHandler<
    SessionEndArgs,
    Types
  >;

  protected readonly startMiddleware: MiddlewareList<
    SessionStartMiddlewareResolvable<Types>
  >;

  protected readonly updateMiddleware: MiddlewareList<
    SessionUpdateMiddlewareResolvable<Types>
  >;

  constructor(
    startMiddleware: MiddlewareList<SessionStartMiddlewareResolvable<Types>>,
    updateMiddleware: MiddlewareList<SessionUpdateMiddlewareResolvable<Types>>,
    createErrorHandler: SessionErrorHandler<SessionStartArgs, Types>,
    updateErrorHandler: SessionErrorHandler<SessionUpdateArgs<Types>, Types>,
    stopErrorHandler: SessionErrorHandler<SessionEndArgs, Types>,
  ) {
    this.startMiddleware = startMiddleware;
    this.updateMiddleware = updateMiddleware;

    this.startErrorHandler = createErrorHandler;
    this.updateErrorHandler = updateErrorHandler;
    this.endErrorHandler = stopErrorHandler;
  }

  public async start(
    session: Session<unknown, Types>,
    meta: Metadata,
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
          : new UncaughtSessionStartMiddlewareError<Types>(
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
      return session.hasReplied();
    }
  }

  public async update(
    session: Session<unknown, Types>,
    interaction: SessionUpdateInteraction<Types>,
    meta: Metadata,
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
          : new UncaughtSessionUpdateMiddlewareError<Types>(
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
    session: Session<unknown, Types>,
    reason: string,
    code: SessionEndCode,
    meta: Metadata,
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

  public getStartMiddleware(): MiddlewareList<
    SessionStartMiddlewareResolvable<Types>
  > {
    return this.startMiddleware;
  }

  public getUpdateMiddleware(): MiddlewareList<
    SessionUpdateMiddlewareResolvable<Types>
  > {
    return this.updateMiddleware;
  }

  public getStartErrorHandler(): SessionErrorHandler<SessionStartArgs, Types> {
    return this.startErrorHandler;
  }

  public getUpdateErrorHandler(): SessionErrorHandler<
    SessionUpdateArgs<Types>,
    Types
  > {
    return this.updateErrorHandler;
  }

  public getEndErrorHandler(): SessionErrorHandler<SessionEndArgs, Types> {
    return this.endErrorHandler;
  }

  public async handleMissing(
    _sessionId: string,
    interaction: SessionUpdateInteraction<Types>,
  ): Promise<void> {
    const rows = this.getRawComponentRows(interaction);
    const disabled = disableAllComponents(rows);
    await this.updateInteraction(interaction, disabled);
  }

  public setMissingHandler(
    handler: (
      sessionId: string,
      interaction: SessionUpdateInteraction<Types>,
    ) => Promise<void>,
  ) {
    this.handleMissing = handler;
  }

  /** Extracts the raw top-level components of an update interaction's message. */
  protected abstract getRawComponentRows(
    interaction: SessionUpdateInteraction<Types>,
  ): APIMessageTopLevelComponent[];

  /** Updates the interaction's message with the given (already disabled) components. */
  protected abstract updateInteraction(
    interaction: SessionUpdateInteraction<Types>,
    components: APIMessageTopLevelComponent[],
  ): Awaitable<void>;
}
