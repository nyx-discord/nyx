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

import type { Awaitable, ClientEvents, Events } from 'discord.js';

import type { BotLifecycleObserver } from '../../../types/BotLifecycleObserver.js';
import type { EventSubscriber } from '../../event/subscriber/EventSubscriber.js';

/** An object that stores the current subscribers for a {@link CommandManager} */
export interface CommandSubscriptionsContainer extends BotLifecycleObserver {
  /** Returns the event subscriber for {@link CommandExecutableInteraction} events. */
  getInteractionSubscriber(): EventSubscriber<
    ClientEvents,
    Events.InteractionCreate
  >;

  /** Sets the event subscriber for {@link CommandExecutableInteraction} events. */
  setInteractionSubscriber(
    subscriber: EventSubscriber<ClientEvents, Events.InteractionCreate>,
  ): Awaitable<this>;

  /** Returns an event subscriber for autocomplete events (interactionCreate). */
  getAutocompleteSubscriber(): EventSubscriber<
    ClientEvents,
    Events.InteractionCreate
  >;

  /** Sets the event subscriber for autocomplete events (interactionCreate). */
  setAutocompleteSubscriber(
    subscriber: EventSubscriber<ClientEvents, Events.InteractionCreate>,
  ): Awaitable<this>;
}
