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

import type { ReadonlyCollection } from '@discordjs/collection';
import { Collection } from '@discordjs/collection';
import type {
  ClassImplements,
  EventBus,
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

  public async register(plugin: NyxPlugin): Promise<this> {
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

        this.bot.logger.error(
          `Uncaught bus error while emitting plugin add '${pluginId}'.`,
          error,
        );
      },
    );

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

      this.bot.logger.error(
        `Uncaught bus error while emitting plugin remove '${pluginId}'.`,
        error,
      );
    });

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
}
