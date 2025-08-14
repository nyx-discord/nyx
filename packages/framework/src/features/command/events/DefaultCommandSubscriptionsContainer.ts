import type {
  CommandSubscriptionsContainer,
  EventBus,
  EventSubscriber,
} from '@nyx-discord/core';
import type { ClientEvents, Events } from 'discord.js';

export class DefaultCommandSubscriptionsContainer
  implements CommandSubscriptionsContainer
{
  protected readonly eventBus: EventBus<ClientEvents>;

  protected interactionSubscriber: EventSubscriber<
    ClientEvents,
    Events.InteractionCreate
  >;

  protected autocompleteSubscriber: EventSubscriber<
    ClientEvents,
    Events.InteractionCreate
  >;

  constructor(
    eventBus: EventBus<ClientEvents>,
    interactionSubscriber: EventSubscriber<
      ClientEvents,
      Events.InteractionCreate
    >,
    autocompleteSubscriber: EventSubscriber<
      ClientEvents,
      Events.InteractionCreate
    >,
  ) {
    this.eventBus = eventBus;
    this.interactionSubscriber = interactionSubscriber;
    this.autocompleteSubscriber = autocompleteSubscriber;

    this.interactionSubscriber.protect();
    this.autocompleteSubscriber.protect();
  }

  public static create(
    eventBus: EventBus<ClientEvents>,
    interactionSubscriber: EventSubscriber<
      ClientEvents,
      Events.InteractionCreate
    >,
    autocompleteSubscriber: EventSubscriber<
      ClientEvents,
      Events.InteractionCreate
    >,
  ) {
    return new DefaultCommandSubscriptionsContainer(
      eventBus,
      interactionSubscriber,
      autocompleteSubscriber,
    );
  }

  public async onStart(): Promise<void> {
    await this.eventBus.subscribe(this.interactionSubscriber);
    await this.eventBus.subscribe(this.autocompleteSubscriber);
  }

  public onStop(): void {
    /** Do nothing by default. */
  }

  public getInteractionSubscriber(): EventSubscriber<
    ClientEvents,
    Events.InteractionCreate
  > {
    return this.interactionSubscriber;
  }

  public async setInteractionSubscriber(
    subscriber: EventSubscriber<ClientEvents, Events.InteractionCreate>,
  ): Promise<this> {
    await this.swapSubscribers(this.interactionSubscriber, subscriber);

    this.interactionSubscriber = subscriber;
    return this;
  }

  public getAutocompleteSubscriber(): EventSubscriber<
    ClientEvents,
    Events.InteractionCreate
  > {
    return this.autocompleteSubscriber;
  }

  public async setAutocompleteSubscriber(
    subscriber: EventSubscriber<ClientEvents, Events.InteractionCreate>,
  ): Promise<this> {
    await this.swapSubscribers(this.autocompleteSubscriber, subscriber);

    this.autocompleteSubscriber = subscriber;
    return this;
  }

  protected async swapSubscribers(
    oldSubscriber: EventSubscriber<ClientEvents, Events.InteractionCreate>,
    newSubscriber: EventSubscriber<ClientEvents, Events.InteractionCreate>,
  ): Promise<void> {
    oldSubscriber.unprotect();
    await this.eventBus.unsubscribe(oldSubscriber);

    newSubscriber.protect();
    await this.eventBus.subscribe(newSubscriber);
  }
}
