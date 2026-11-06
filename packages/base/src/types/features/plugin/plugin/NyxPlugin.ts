import type { NyxBot } from '#types/bot/NyxBot';
import type { Identifiable } from '#types/identity/Identifiable';
import type { Awaitable } from '#types/types/Awaitable';
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
