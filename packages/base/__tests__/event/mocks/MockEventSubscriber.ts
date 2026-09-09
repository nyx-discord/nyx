import type { Awaitable, EventBusEventArgs, Metadata } from '@nyx-discord/types';
import { vi } from 'vitest';
import { AbstractEventSubscriber } from '../../../src';

export type TestEvents = {
  test: [data: string];
  other: [value: number];
  [key: string]: unknown[];
} & EventBusEventArgs;

export class MockEventSubscriber<
  EventArgsObject extends Record<string, unknown[]> = TestEvents,
  Event extends keyof EventArgsObject & string = 'test' & (keyof EventArgsObject & string),
> extends AbstractEventSubscriber<
  EventArgsObject,
  Event
> {
  protected override readonly event: Event = 'test' as Event;

  public override handleEvent = vi.fn<
    (meta: Metadata, ...args: EventArgsObject[Event]) => Awaitable<void>
  >();

  public static create(
    overrides?: Partial<{
      event: 'test' | 'other';
      priority: ReturnType<MockEventSubscriber['getPriority']>;
      lifetime: ReturnType<MockEventSubscriber['getLifetime']>;
      ignoreHandled: boolean;
    }>,
  ): MockEventSubscriber {
    const instance = new MockEventSubscriber();
    if (overrides?.event) {
      (instance as any).event = overrides.event;
    }
    if (overrides?.priority !== undefined) {
      (instance as any).priority = overrides.priority;
    }
    if (overrides?.lifetime !== undefined) {
      (instance as any).lifetime = overrides.lifetime;
    }
    if (overrides?.ignoreHandled !== undefined) {
      (instance as any).ignoreHandled = overrides.ignoreHandled;
    }
    return instance;
  }
}
