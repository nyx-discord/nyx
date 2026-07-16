import type { Metadata } from '@nyx-discord/core';
import type { Awaitable, ClientEvents } from 'discord.js';
import { vi } from 'vitest';
import { AbstractDJSClientSubscriber } from '../../../src';

export class MockDJSClientSubscriber<
  Event extends keyof ClientEvents = 'messageCreate',
> extends AbstractDJSClientSubscriber<Event> {
  protected override readonly event: Event;

  public override handleEvent = vi.fn<
    (meta: Metadata, ...args: ClientEvents[Event]) => Awaitable<void>
  >();

  constructor(event: Event) {
    super();
    this.event = event;
  }

  public static createMessageSubscriber(): MockDJSClientSubscriber<'messageCreate'> {
    return new MockDJSClientSubscriber('messageCreate' as const);
  }
}
