import { BaseCommandSubscriber } from '@nyx-discord/base';
import type {
  Awaitable,
  CommandEventArgs,
  CommandEvent,
  Metadata,
} from '@nyx-discord/types';
import type { DjsInteractionTypes } from '../../../types/DjsInteractionTypes.js';

/** Utility to make a subscriber for the {@link CommandManager#getEventBus CommandManager event bus}. */
export abstract class AbstractCommandSubscriber<
  Event extends CommandEvent,
> extends BaseCommandSubscriber<DjsInteractionTypes, Event> {
  protected abstract override readonly event: Event;

  public abstract override handleEvent(
    meta: Metadata,
    ...args: CommandEventArgs<DjsInteractionTypes>[Event]
  ): Awaitable<void>;
}
