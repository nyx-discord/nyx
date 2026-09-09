import { describe, expect, test, vi } from 'vitest';
import {
  TypedFields,
  PriorityEnum,
  EventSubscriberLifetimeEnum,
} from '@nyx-discord/types';
import { LifetimeCheckEventMiddleware } from '../../../../src';
import { MockEventSubscriber } from '../../mocks/MockEventSubscriber';
import { StubMetadata } from '../../../command/mocks/StubMetadata';

describe('LifetimeCheckEventMiddleware', () => {
  test('GIVEN a new instance THEN priority is Lowest', () => {
    const middleware = new LifetimeCheckEventMiddleware();

    expect(middleware.getPriority()).toBe(PriorityEnum.Lowest);
  });

  test('GIVEN a new instance THEN is protected', () => {
    const middleware = new LifetimeCheckEventMiddleware();

    expect(middleware.isProtected()).toBe(true);
  });

  test('GIVEN subscriber has lifetime Once THEN unsubscribes and returns true', async () => {
    const middleware = new LifetimeCheckEventMiddleware();
    const subscriber = MockEventSubscriber.create({
      lifetime: EventSubscriberLifetimeEnum.Once,
    });
    const meta = StubMetadata.create();
    const mockBus = {
      unsubscribe: vi.fn().mockResolvedValue(undefined),
    };
    TypedFields.EventBus.set(meta, mockBus as never);

    const result = await middleware.check(subscriber, meta);

    expect(result.allowed).toBe(true);
    expect(mockBus.unsubscribe).toHaveBeenCalledWith(subscriber);
  });

  test('GIVEN subscriber has lifetime On THEN does not unsubscribe and returns true', async () => {
    const middleware = new LifetimeCheckEventMiddleware();
    const subscriber = MockEventSubscriber.create({
      lifetime: EventSubscriberLifetimeEnum.On,
    });
    const meta = StubMetadata.create();
    const mockBus = {
      unsubscribe: vi.fn(),
    };
    TypedFields.EventBus.set(meta, mockBus as never);

    const result = await middleware.check(subscriber, meta);

    expect(result.allowed).toBe(true);
    expect(mockBus.unsubscribe).not.toHaveBeenCalled();
  });

  test('GIVEN default subscriber (lifetime On) THEN does not unsubscribe and returns true', async () => {
    const middleware = new LifetimeCheckEventMiddleware();
    const subscriber = new MockEventSubscriber();
    const meta = StubMetadata.create();
    const mockBus = {
      unsubscribe: vi.fn(),
    };
    TypedFields.EventBus.set(meta, mockBus as never);

    const result = await middleware.check(subscriber, meta);

    expect(result.allowed).toBe(true);
    expect(mockBus.unsubscribe).not.toHaveBeenCalled();
  });
});
