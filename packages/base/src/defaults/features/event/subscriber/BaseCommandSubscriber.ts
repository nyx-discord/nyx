import type {
  CommandEvent,
  CommandEventArgs,
} from '#types/features/command/events/CommandEvent';
import type { InteractionTypes } from '#types/features/command/InteractionTypes';
import type { EventSubscriber } from '#types/features/event/subscriber/EventSubscriber';
import type { Metadata } from '#types/meta/Metadata';
import type { Awaitable } from '#types/types/Awaitable';
import { AbstractEventSubscriber } from './AbstractEventSubscriber';

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
