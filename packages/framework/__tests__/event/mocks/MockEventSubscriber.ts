import type { Metadata } from '@nyx-discord/core';
import type { Awaitable } from 'discord.js';
import { vi } from 'vitest';
import { AbstractEventSubscriber } from '../../../src';

type TestEvents = {
  test: [data: string];
  other: [value: number];
};

export class MockEventSubscriber extends AbstractEventSubscriber<
  TestEvents,
  'test'
> {
  protected override readonly event = 'test' as const;

  public override handleEvent = vi.fn<(meta: Metadata, data: string) => Awaitable<void>>();

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
