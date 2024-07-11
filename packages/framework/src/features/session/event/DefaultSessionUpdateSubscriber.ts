/*
 * MIT License
 *
 * Copyright (c) 2024 Amgelo563
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

import type { EventDispatchMeta } from '@nyx-discord/core';
import type { Interaction } from 'discord.js';
import { Events } from 'discord.js';

import { AbstractDJSClientSubscriber as Subscriber } from '../../event/subscriber/AbstractDJSClientSubscriber.js';

export class DefaultSessionUpdateSubscriber extends Subscriber<Events.InteractionCreate> {
  protected readonly event = Events.InteractionCreate;

  protected override locked = true;

  public async handleEvent(
    meta: EventDispatchMeta,
    interaction: Interaction,
  ): Promise<void> {
    if (
      interaction.isAutocomplete()
      || interaction.isCommand()
      || (interaction.isModalSubmit() && !interaction.isFromMessage())
    ) {
      return;
    }

    const bot = meta.getBot(true);
    const handled = await bot.getSessionManager().update(interaction);
    if (handled) meta.setHandled();
  }
}
