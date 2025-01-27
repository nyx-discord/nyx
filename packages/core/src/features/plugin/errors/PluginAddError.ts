import { FeatureError } from '../../../errors/FeatureError.js';
import type { NyxPlugin } from '../plugin/NyxPlugin.js';

/** An Error that wraps errors that occur during the add of a NyxPlugin object. */
export class PluginAddError extends FeatureError<NyxPlugin> {
  constructor(error: Error, plugin: NyxPlugin) {
    super(error, plugin, 'There was an error while adding a plugin.');
  }
}
