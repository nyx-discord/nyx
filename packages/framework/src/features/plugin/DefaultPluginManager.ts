import type { ReadonlyCollection } from '@discordjs/collection';
import { Collection } from '@discordjs/collection';
import type {
  ClassImplements,
  EventBus,
  EventSubscriber,
  Identifier,
  NyxBot,
  NyxPlugin,
  PluginEventArgs,
  PluginManager,
} from '@nyx-discord/core';
import {
  canBeIdentifier,
  IllegalDuplicateError,
  ObjectNotFoundError,
  PluginEventEnum,
  TypedFields,
} from '@nyx-discord/core';
import { DefaultMetaCollectionFactory } from '../../meta/DefaultMetaCollectionFactory.js';
import { ensureKey } from '../../util/ensureKey';
import { BasicEventBus } from '../event/bus/BasicEventBus.js';

type PluginManagerOptions = {
  bus: EventBus<PluginEventArgs>;
};

export class DefaultPluginManager implements PluginManager {
  protected readonly bot: NyxBot;

  protected readonly plugins: Collection<Identifier, NyxPlugin>;

  protected readonly bus: EventBus<PluginEventArgs>;

  constructor(options: { bot: NyxBot; bus: EventBus<PluginEventArgs> }) {
    this.bot = options.bot;
    this.bus = options.bus;
    this.plugins = new Collection<Identifier, NyxPlugin>();
  }

  public static create(options: {
    bot: NyxBot;
    injections?: Partial<PluginManagerOptions>;
  }): PluginManager {
    const constructorOptions = options.injections ?? {};
    const metaFactory = DefaultMetaCollectionFactory.createWith([
      TypedFields.Bot,
      options.bot,
    ]);

    ensureKey(
      constructorOptions,
      'bus',
      BasicEventBus.createAsync<PluginEventArgs>(
        Symbol('PluginManagerEventBus'),
        metaFactory,
      ),
    );

    return new this({
      bot: options.bot,
      ...constructorOptions,
    });
  }

  public async onStart(): Promise<void> {
    /** Do nothing by default */
  }

  public async onStop(): Promise<void> {
    /** Do nothing by default */
  }

  public async register(...plugins: NyxPlugin[]): Promise<this> {
    for (const plugin of plugins) {
      const id = plugin.getId();

      const presentPlugin = this.plugins.get(id);
      if (presentPlugin) {
        throw new IllegalDuplicateError(
          presentPlugin,
          plugin,
          `Plugin with ID ${String(id)} has already been registered.`,
        );
      }
      this.plugins.set(id, plugin);
      await plugin.onRegister(this.bot);

      Promise.resolve(this.bus.emit(PluginEventEnum.PluginAdd, [plugin])).catch(
        (error) => {
          const pluginId = String(plugin.getId());

          this.bot
            .getLogger()
            .error(
              `Uncaught bus error while emitting plugin add '${pluginId}'.`,
              error,
            );
        },
      );
    }

    return this;
  }

  public async unregister(pluginOrId: NyxPlugin | Identifier): Promise<this> {
    const id = canBeIdentifier(pluginOrId) ? pluginOrId : pluginOrId.getId();
    const presentPlugin = this.plugins.get(id);
    if (!presentPlugin) {
      throw new ObjectNotFoundError(
        `Plugin with ID ${String(id)} has not been registered.`,
      );
    }
    this.plugins.delete(id);
    await presentPlugin.onUnregister(this.bot);

    Promise.resolve(
      this.bus.emit(PluginEventEnum.PluginRemove, [presentPlugin]),
    ).catch((error) => {
      const pluginId = String(presentPlugin.getId());

      this.bot
        .getLogger()
        .error(
          `Uncaught bus error while emitting plugin remove '${pluginId}'.`,
          error,
        );
    });

    return this;
  }

  public async subscribe(
    ...subscribers: EventSubscriber<PluginEventArgs, keyof PluginEventArgs>[]
  ): Promise<this> {
    await this.bus.subscribe(...subscribers);
    return this;
  }

  public getPluginById(id: Identifier): NyxPlugin | null {
    return this.plugins.get(id) ?? null;
  }

  public getPluginByClass(
    PluginClass: ClassImplements<NyxPlugin>,
  ): InstanceType<typeof PluginClass> | null {
    const foundPlugin = this.plugins.find(
      (plugin) => plugin instanceof PluginClass,
    );
    return foundPlugin ?? null;
  }

  public getPlugins(): ReadonlyCollection<Identifier, NyxPlugin> {
    return this.plugins;
  }

  public getEventBus(): EventBus<PluginEventArgs> {
    return this.bus;
  }

  public *values(): IterableIterator<NyxPlugin> {
    yield* this.plugins.values();
  }

  public *keys(): IterableIterator<Identifier> {
    yield* this.plugins.keys();
  }

  public *entries(): IterableIterator<[Identifier, NyxPlugin]> {
    yield* this.plugins.entries();
  }

  public next(): IteratorResult<[Identifier, NyxPlugin]> {
    return this.entries().next();
  }

  public [Symbol.iterator](): IterableIterator<[Identifier, NyxPlugin]> {
    return this.entries();
  }
}
