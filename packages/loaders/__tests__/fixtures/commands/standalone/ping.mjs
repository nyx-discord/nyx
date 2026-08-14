import { BaseStandaloneCommand } from '@nyx-discord/base';

export class PingCommand extends BaseStandaloneCommand {
  data = { name: 'ping', description: 'Replies with pong', type: 1 };

  execute() {}

  handleInteraction() {}
}
