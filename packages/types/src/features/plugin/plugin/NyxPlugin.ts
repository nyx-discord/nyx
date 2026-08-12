import type { Awaitable } from '../../../types/Awaitable.js';
import type { NyxBot } from '../../../bot/NyxBot';
import type { Identifiable } from '../../../identity/Identifiable';
import type { NyxPluginData } from '../data/NyxPluginData.js';

/** Represents a plugin. */
export interface NyxPlugin extends Identifiable {
  /** Called when the plugin is registered. */
  onRegister(bot: NyxBot): Awaitable<void>;

  /** Called when the plugin is unregistered. */
  onUnregister(bot: NyxBot): Awaitable<void>;

  /** Returns this plugin's data. */
  getData(): NyxPluginData;
}
