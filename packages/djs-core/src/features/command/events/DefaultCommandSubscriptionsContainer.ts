import type {
  CommandSubscriptionsContainer,
  EventBus,
  EventSubscriber,
} from '@nyx-discord/types';
import type { GatewayDispatchEvents, MappedEvents } from '@discordjs/core';

export class DefaultCommandSubscriptionsContainer implements CommandSubscriptionsContainer<MappedEvents> {
  protected readonly eventBus: EventBus<MappedEvents>;

  protected interactionSubscriber: EventSubscriber<
    MappedEvents,
    GatewayDispatchEvents.InteractionCreate
  >;

  protected autocompleteSubscriber: EventSubscriber<
    MappedEvents,
    GatewayDispatchEvents.InteractionCreate
  >;

  constructor(
    eventBus: EventBus<MappedEvents>,
    interactionSubscriber: EventSubscriber<
      MappedEvents,
      GatewayDispatchEvents.InteractionCreate
    >,
    autocompleteSubscriber: EventSubscriber<
      MappedEvents,
      GatewayDispatchEvents.InteractionCreate
    >,
  ) {
    this.eventBus = eventBus;
    this.interactionSubscriber = interactionSubscriber;
    this.autocompleteSubscriber = autocompleteSubscriber;

    this.interactionSubscriber.protect();
    this.autocompleteSubscriber.protect();
  }

  public static create(
    eventBus: EventBus<MappedEvents>,
    interactionSubscriber: EventSubscriber<
      MappedEvents,
      GatewayDispatchEvents.InteractionCreate
    >,
    autocompleteSubscriber: EventSubscriber<
      MappedEvents,
      GatewayDispatchEvents.InteractionCreate
    >,
  ) {
    return new this(eventBus, interactionSubscriber, autocompleteSubscriber);
  }

  public async subscribe(): Promise<void> {
    if (!this.eventBus.isSubscribed(this.interactionSubscriber)) {
      await this.eventBus.subscribe(this.interactionSubscriber);
    }

    if (!this.eventBus.isSubscribed(this.autocompleteSubscriber)) {
      await this.eventBus.subscribe(this.autocompleteSubscriber);
    }
  }

  public async unsubscribe(): Promise<void> {
    if (this.eventBus.isSubscribed(this.interactionSubscriber)) {
      await this.eventBus.unsubscribe(this.interactionSubscriber);
    }

    if (this.eventBus.isSubscribed(this.autocompleteSubscriber)) {
      await this.eventBus.unsubscribe(this.autocompleteSubscriber);
    }
  }

  public getInteractionSubscriber(): EventSubscriber<
    MappedEvents,
    GatewayDispatchEvents.InteractionCreate
  > {
    return this.interactionSubscriber;
  }

  public async setInteractionSubscriber(
    subscriber: EventSubscriber<
      MappedEvents,
      GatewayDispatchEvents.InteractionCreate
    >,
  ): Promise<this> {
    await this.swapSubscribers(this.interactionSubscriber, subscriber);

    this.interactionSubscriber = subscriber;
    return this;
  }

  public getAutocompleteSubscriber(): EventSubscriber<
    MappedEvents,
    GatewayDispatchEvents.InteractionCreate
  > {
    return this.autocompleteSubscriber;
  }

  public async setAutocompleteSubscriber(
    subscriber: EventSubscriber<
      MappedEvents,
      GatewayDispatchEvents.InteractionCreate
    >,
  ): Promise<this> {
    await this.swapSubscribers(this.autocompleteSubscriber, subscriber);

    this.autocompleteSubscriber = subscriber;
    return this;
  }

  protected async swapSubscribers(
    oldSubscriber: EventSubscriber<
      MappedEvents,
      GatewayDispatchEvents.InteractionCreate
    >,
    newSubscriber: EventSubscriber<
      MappedEvents,
      GatewayDispatchEvents.InteractionCreate
    >,
  ): Promise<void> {
    oldSubscriber.unprotect();
    await this.eventBus.unsubscribe(oldSubscriber);

    newSubscriber.protect();
    await this.eventBus.subscribe(newSubscriber);
  }
}
