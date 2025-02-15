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
} from '@nyx-discord/core';
import { BasicEventBus } from '../event/bus/BasicEventBus.js';

export class DefaultPluginManager implements PluginManager {
  public readonly bot: NyxBot;

  protected readonly plugins: Collection<Identifier, NyxPlugin>;

  protected readonly bus: EventBus<PluginEventArgs>;

  constructor(bot: NyxBot, bus: EventBus<PluginEventArgs>) {
    this.bot = bot;
    this.bus = bus;
    this.plugins = new Collection<Identifier, NyxPlugin>();
  }

  public static create(bot: NyxBot): PluginManager {
    const busId = Symbol('PluginManagerEventBus');

    const bus = BasicEventBus.createAsync(bot, busId);

    return new DefaultPluginManager(bot, bus);
  }

  public async onStart(): Promise<void> {
    const startPromises = this.plugins.map((plugin) => plugin.onStart());
    await Promise.all(startPromises);
  }

  public async onStop(): Promise<void> {
    const stopPromises = this.plugins.map((plugin) => plugin.onStop());
    await Promise.all(stopPromises);

    await this.bus.onUnregister();
  }

  public async onSetup(): Promise<void> {
    await this.bus.onRegister();
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
      await plugin.onRegister();

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
    await presentPlugin.onUnregister();

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
