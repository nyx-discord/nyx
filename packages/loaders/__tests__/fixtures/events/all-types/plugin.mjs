import { AbstractPluginSubscriber } from '@nyx-discord/base';

export class PluginAddSubscriber extends AbstractPluginSubscriber {
  event = 'pluginAdd';

  handleEvent(meta, plugin) {}
}
