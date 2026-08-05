import { AbstractPluginSubscriber } from '@nyx-discord/framework';

export class PluginAddSubscriber extends AbstractPluginSubscriber {
  event = 'pluginAdd';

  handleEvent(meta, plugin) {}
}
