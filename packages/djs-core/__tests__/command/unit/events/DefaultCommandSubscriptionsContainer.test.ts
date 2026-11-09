import type { MappedEvents } from '@discordjs/core';
import { BasicEventBus } from '@nyx-discord/base';
import { describe, expect, test } from 'vitest';
import {
  DefaultCommandAutocompleteSubscriber,
  DefaultCommandInteractionSubscriber,
  DefaultCommandSubscriptionsContainer,
} from '../../../../src';

function createContainer() {
  const bus = BasicEventBus.createSync<MappedEvents>();
  const container = DefaultCommandSubscriptionsContainer.create(
    bus,
    new DefaultCommandInteractionSubscriber(),
    new DefaultCommandAutocompleteSubscriber(),
  );
  return { bus, container };
}

describe('DefaultCommandSubscriptionsContainer (subscriptions)', () => {
  test('GIVEN subscribed subscribers WHEN unsubscribing THEN removes them although they are protected', async () => {
    const { bus, container } = createContainer();
    await container.subscribe();

    await expect(container.unsubscribe()).resolves.toBeUndefined();

    expect(bus.isSubscribed(container.getInteractionSubscriber())).toBe(false);
    expect(bus.isSubscribed(container.getAutocompleteSubscriber())).toBe(false);
  });

  test('GIVEN subscribers that were never subscribed WHEN setting a new one THEN swaps it without subscribing it', async () => {
    const { bus, container } = createContainer();
    const subscriber = new DefaultCommandInteractionSubscriber();

    await container.setInteractionSubscriber(subscriber);

    expect(container.getInteractionSubscriber()).toBe(subscriber);
    expect(subscriber.isProtected()).toBe(true);
    expect(bus.isSubscribed(subscriber)).toBe(false);
  });

  test('GIVEN subscribed subscribers WHEN setting a new one THEN replaces the old one on the bus', async () => {
    const { bus, container } = createContainer();
    const old = container.getAutocompleteSubscriber();
    await container.subscribe();
    const subscriber = new DefaultCommandAutocompleteSubscriber();

    await container.setAutocompleteSubscriber(subscriber);

    expect(bus.isSubscribed(old)).toBe(false);
    expect(old.isProtected()).toBe(false);
    expect(bus.isSubscribed(subscriber)).toBe(true);
  });
});
