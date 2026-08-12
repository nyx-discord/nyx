import type {
  Awaitable,
  CommandEvent,
  CommandEventArgs,
  EventSubscriber,
  InteractionTypes,
  Metadata,
} from '@nyx-discord/types';
import { AbstractEventSubscriber } from './AbstractEventSubscriber.js';

/** Utility to make a subscriber for the {@link CommandManager#getEventBus CommandManager event bus}. */
export abstract class BaseCommandSubscriber<
  Types extends InteractionTypes = InteractionTypes,
  Event extends CommandEvent = CommandEvent,
>
  extends AbstractEventSubscriber<CommandEventArgs<Types>, Event>
  implements EventSubscriber<CommandEventArgs<Types>, Event>
{
  protected abstract override readonly event: Event;

  public abstract override handleEvent(
    meta: Metadata,
    ...args: CommandEventArgs<Types>[Event]
  ): Awaitable<void>;
}
