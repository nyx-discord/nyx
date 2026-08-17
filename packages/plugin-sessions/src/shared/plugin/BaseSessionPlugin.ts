import type {
  AnyEventSubscriber,
  ClassImplements,
  EventBus,
  EventSubscriber,
  Identifier,
  InteractionTypes,
  Metadata,
  MetadataFactory,
  NyxBot,
  NyxPlugin,
  NyxPluginData,
} from '@nyx-discord/types';
import {
  AssertionError,
  BotStatusEnum,
  ObjectNotFoundError,
  TypedFields,
} from '@nyx-discord/types';
import type { SessionCustomIdCodec } from '../customId/SessionCustomIdCodec.js';
import type { SessionEndCode } from '../end/SessionEndCode.js';
import { SessionEndCodes } from '../end/SessionEndCodes.js';
import {
  type SessionEventArgs,
  SessionEventEnum,
} from '../events/SessionEvent.js';
import type { SessionExecutor } from '../execution/executor/SessionExecutor.js';
import type { AnySessionInteraction } from '../interaction/AnySessionInteraction.js';
import type { SessionInteractionMeta } from '../interaction/SessionInteractionMeta.js';
import type { SessionUpdateInteraction } from '../interaction/SessionUpdateInteraction.js';
import type { SessionLimitManager } from '../limit/SessionLimitManager.js';
import { DefaultSessionLimitManager } from '../limit/DefaultSessionLimitManager.js';
import type { SessionPromiseRepository } from '../promise/SessionPromiseRepository.js';
import type { ReadonlySessionRepository } from '../repository/ReadonlySessionRepository.js';
import type { SessionRepository } from '../repository/SessionRepository.js';
import type { Session } from '../session/Session.js';
import { type SessionState, SessionStateEnum } from '../state/SessionState.js';

export type SessionManagerOptions<
  Types extends InteractionTypes = InteractionTypes,
> = {
  customIdCodec: SessionCustomIdCodec;
  executor: SessionExecutor<Types>;
  repository: SessionRepository<Types>;
  promiseRepository: SessionPromiseRepository<Types>;
  subscriber: AnyEventSubscriber;
  bus: EventBus<SessionEventArgs<Types>>;
  metaFactory: MetadataFactory;
  limitManager?: SessionLimitManager<Types>;
};

/** Options to create a session plugin. */
export type SessionPluginCreateOptions<
  Types extends InteractionTypes = InteractionTypes,
> = {
  /** Optional overrides for the plugin's constructor injections. */
  injections?: Partial<SessionManagerOptions<Types>>;
};

/** A named value used to enrich a session's {@link Metadata}. */
type SessionMetaEntry = {
  name: string;
  value: string;
};

/** Options to create or populate a session's {@link Metadata}. */
type SessionMetaOptions<Types extends InteractionTypes = InteractionTypes> = {
  meta: Metadata | undefined;
  session: Session<unknown, Types>;
  customIdExtra: string | null;
  interaction: AnySessionInteraction<Types> | null;
  extraData: SessionMetaEntry[];
};

export abstract class BaseSessionPlugin<
  Types extends InteractionTypes = InteractionTypes,
> implements NyxPlugin {
  public static readonly ID: Identifier = Symbol('SessionPlugin');

  public static readonly Data: NyxPluginData = {
    name: 'Session Manager',
    description:
      'A nyx plugin to manage user interaction sessions in your bot.',
    git: 'https://github.com/nyx-discord/nyx/tree/main/packages/plugin-sessions',
  };

  protected readonly bus: EventBus<SessionEventArgs<Types>>;

  protected readonly codec: SessionCustomIdCodec;

  protected readonly executor: SessionExecutor<Types>;

  protected readonly repository: SessionRepository<Types>;

  protected readonly promiseRepository: SessionPromiseRepository<Types>;

  protected readonly metaFactory: MetadataFactory;

  protected readonly limitManager: SessionLimitManager<Types>;

  protected subscriber: AnyEventSubscriber;

  protected bot: NyxBot | null = null;

  constructor(options: SessionManagerOptions<Types>) {
    this.codec = options.customIdCodec;
    this.executor = options.executor;
    this.repository = options.repository;
    this.promiseRepository = options.promiseRepository;
    this.subscriber = options.subscriber;
    this.bus = options.bus;
    this.metaFactory = options.metaFactory;
    this.limitManager =
      options.limitManager ?? new DefaultSessionLimitManager<Types>(this);
    this.subscriber.protect();
  }

  public static getFromBot<Types extends InteractionTypes = InteractionTypes>(
    bot: NyxBot,
  ): BaseSessionPlugin<Types> {
    return bot
      .getPluginManager()
      .getPluginByClass(
        BaseSessionPlugin as unknown as ClassImplements<NyxPlugin>,
        true,
      ) as unknown as BaseSessionPlugin<Types>;
  }

  public async onRegister(bot: NyxBot): Promise<void> {
    this.bot = bot;
    this.metaFactory.addDefaultField(TypedFields.Bot, bot);

    await bot.subscribeToClient(this.subscriber);
    await this.repository.onStart();
  }

  public async onUnregister(): Promise<void> {
    await this.repository.onStop();
  }

  public async start(
    session: Session<unknown, Types>,
    meta?: Metadata,
  ): Promise<boolean> {
    this.checkSessionState(session, SessionStateEnum.Running);

    const metadata = this.createOrPopulateMeta({
      meta,
      session,
      customIdExtra: null,
      interaction: session.getStartInteraction(),
      extraData: [],
    });

    await this.limitManager.checkAndReserve(session, metadata);

    try {
      await this.repository.save(session);

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
    } catch (error) {
      this.bot
        ?.getLogger()
        .error(`Failed to start session with ID '${session.getId()}}`, error);
      return session.hasReplied();
    }
  }

  public async update(
    interaction: SessionUpdateInteraction<Types>,
    meta?: Metadata,
  ): Promise<boolean> {
    const customIdData = this.codec.deserialize(this.getCustomId(interaction));
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
    session: Session<unknown, Types>,
    reason: string,
    code: SessionEndCode,
    meta?: Metadata,
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

    this.limitManager.release(session);

    Promise.resolve(
      this.bus.emit(SessionEventEnum.SessionEnd, [session, data, metadata]),
    ).catch((_error) => {});

    return this;
  }

  public async resolve(
    interaction: SessionUpdateInteraction<Types>,
  ): Promise<Session<unknown, Types> | null> {
    const customIdData = this.codec.deserialize(this.getCustomId(interaction));
    if (!customIdData) return null;

    const session = await this.repository.get(customIdData.id);
    return session ?? null;
  }

  public async subscribe(
    ...subscribers: EventSubscriber<
      SessionEventArgs<Types>,
      keyof SessionEventArgs<Types>
    >[]
  ): Promise<this> {
    await this.bus.subscribe(...subscribers);
    return this;
  }

  public async setUpdateSubscriber(
    subscriber: AnyEventSubscriber,
  ): Promise<this> {
    if (!this.bot) {
      throw new AssertionError('Bot not set, has the plugin been registered?');
    }
    const clientBus = this.bot.getClientEventBus();

    this.subscriber.unprotect();
    await clientBus.unsubscribe(this.subscriber);

    subscriber.protect();
    await clientBus.subscribe(subscriber);

    this.subscriber = subscriber;
    return this;
  }

  public getUpdateSubscriber(): AnyEventSubscriber {
    return this.subscriber;
  }

  public getCustomIdCodec(): SessionCustomIdCodec {
    return this.codec;
  }

  public getEventBus(): EventBus<SessionEventArgs<Types>> {
    return this.bus;
  }

  public getExecutor(): SessionExecutor<Types> {
    return this.executor;
  }

  public getRepository(): ReadonlySessionRepository<Types> {
    return this.repository;
  }

  public getPromiseRepository(): SessionPromiseRepository<Types> {
    return this.promiseRepository;
  }

  public getMetadataFactory(): MetadataFactory {
    return this.metaFactory;
  }

  public getSessionLimits(): SessionLimitManager<Types> {
    return this.limitManager;
  }

  public isRunning(): boolean {
    return !!this.bot && this.bot.getStatus() === BotStatusEnum.Running;
  }

  public getId(): Identifier {
    return BaseSessionPlugin.ID;
  }

  public getData(): NyxPluginData {
    return BaseSessionPlugin.Data;
  }

  /** Extracts the customId from an update interaction. */
  protected abstract getCustomId(
    interaction: SessionUpdateInteraction<Types>,
  ): string;

  /** Extracts the ID and type of an interaction for metadata. */
  protected abstract getInteractionMeta(
    interaction: AnySessionInteraction<Types>,
  ): SessionInteractionMeta;

  protected async expire(session: Session<unknown, Types>): Promise<void> {
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
    session: Session<unknown, Types>,
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
  protected createOrPopulateMeta(options: SessionMetaOptions<Types>): Metadata {
    const sessionId = options.session.getId();

    const executionData = [
      { name: 'Session', value: sessionId },
      { name: 'Date', value: new Date().toISOString() },
      ...options.extraData,
    ];

    if (options.interaction) {
      const { id, type } = this.getInteractionMeta(options.interaction);
      executionData.push(
        { name: 'Interaction ID', value: id },
        { name: 'Interaction Type', value: `${type}` },
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
