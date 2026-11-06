// Subscribing to discord.js client events, and to your own event buses.
// Docs: https://nyx-discord.github.io/nyx/guide/use/events.md
//       https://nyx-discord.github.io/nyx/guide/use/events/subscribers.md
//       https://nyx-discord.github.io/nyx/guide/use/events/buses.md
import {
  AbstractDJSClientSubscriber,
  AbstractEventSubscriber,
  BasicEventBus,
  EventSubscriberLifetimeEnum,
  PriorityEnum,
  TypedFields,
  type Metadata,
} from '@nyx-discord/djs';
import { Events, type Client, type GuildMember } from 'discord.js';

// Register with bot.subscribeToClient(new ReadyLogger()).
export class ReadyLogger extends AbstractDJSClientSubscriber<typeof Events.ClientReady> {
  protected readonly event = Events.ClientReady;

  // Run once, like EventEmitter#once().
  protected override readonly lifetime = EventSubscriberLifetimeEnum.Once;

  // The meta comes first, then the event's arguments.
  public async handleEvent(meta: Metadata, client: Client<true>) {
    const bot = TypedFields.Bot.get(meta, true);
    bot.getLogger().log(`Logged in as ${client.user.tag}`);
  }
}

export class WelcomeSubscriber extends AbstractDJSClientSubscriber<typeof Events.GuildMemberAdd> {
  protected readonly event = Events.GuildMemberAdd;

  // Higher priorities run first. Calling this.setHandled(meta) stops lower ones,
  // unless they set `ignoreHandled = false`.
  protected override readonly priority = PriorityEnum.High;

  public async handleEvent(_meta: Metadata, member: GuildMember) {
    await member.send(`Welcome to ${member.guild.name}!`);
  }
}

// Your own events: declare their argument types, then create a bus.
type ShopEvents = {
  purchase: [userId: string, item: string];
};

export const shopBus = BasicEventBus.createAsync<ShopEvents>();

export class PurchaseLogger extends AbstractEventSubscriber<ShopEvents, 'purchase'> {
  protected readonly event = 'purchase';

  public async handleEvent(_meta: Metadata, userId: string, item: string) {
    console.log(`${userId} bought ${item}`);
  }
}

// Your services emit, subscribers react:
//   await shopBus.subscribe(new PurchaseLogger());
//   await shopBus.emit('purchase', ['123', 'sword']);
