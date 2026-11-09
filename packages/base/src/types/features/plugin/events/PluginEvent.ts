import type { NyxPlugin } from '../plugin/NyxPlugin.js';

/** Enum of possible plugin events. */
export const PluginEventEnum = {
  /** Emitted when a plugin is added. */
  PluginAdd: 'pluginAdd',
  /** Emitted when a plugin is removed. */
  PluginRemove: 'pluginRemove',
} as const satisfies Record<string, keyof PluginEventArgs>;

/** Type of values of {@link PluginEventEnum}. */
export type PluginEvent =
  (typeof PluginEventEnum)[keyof typeof PluginEventEnum];

/** Record of arguments for each plugin event. */
export interface PluginEventArgs {
  pluginAdd: [plugin: NyxPlugin];
  pluginRemove: [plugin: NyxPlugin];
}
