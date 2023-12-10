/*
 * MIT License
 *
 * Copyright (c) 2023 Amgelo563
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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

    this.interactionSubscriber.lock();
    this.autocompleteSubscriber.lock();
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

  public onStart(): void {
    /** Do nothing by default. */
  }

  public onStop(): void {
    /** Do nothing by default. */
  }

  public async onSetup(): Promise<void> {
    await this.eventBus.subscribe(this.interactionSubscriber);
    await this.eventBus.subscribe(this.autocompleteSubscriber);
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
    oldSubscriber.unlock();
    await this.eventBus.unsubscribe(oldSubscriber);

    newSubscriber.lock();
    await this.eventBus.subscribe(newSubscriber);
  }
}
