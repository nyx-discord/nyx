import type { Awaitable } from 'discord.js';
import type { Identifiable } from '../../../identity/Identifiable';
import type { BotLifecycleObserver } from '../../../types/BotLifecycleObserver';
import type { NyxPluginData } from '../data/NyxPluginData.js';

/** Represents a plugin. */
export interface NyxPlugin extends BotLifecycleObserver, Identifiable {
  /** Called when the plugin is registered. */
  onRegister(): Awaitable<void>;

  /** Called when the plugin is unregistered. */
  onUnregister(): Awaitable<void>;

  /** Returns this plugin's data. */
  getData(): NyxPluginData;
}
