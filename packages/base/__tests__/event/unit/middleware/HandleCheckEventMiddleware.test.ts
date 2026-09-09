import { describe, expect, test } from 'vitest';
import { TypedFields, PriorityEnum } from '@nyx-discord/types';
import { HandleCheckEventMiddleware } from '../../../../src';
import { MockEventSubscriber } from '../../mocks/MockEventSubscriber';

describe('HandleCheckEventMiddleware', () => {
  test('GIVEN a new instance THEN priority is Highest', () => {
    const middleware = new HandleCheckEventMiddleware();

    expect(middleware.getPriority()).toBe(PriorityEnum.Highest);
  });

  test('GIVEN a new instance THEN is protected', () => {
    const middleware = new HandleCheckEventMiddleware();

    expect(middleware.isProtected()).toBe(true);
  });

  test('GIVEN event is not handled THEN returns true', async () => {
    const middleware = new HandleCheckEventMiddleware();
    const subscriber = new MockEventSubscriber();
    const meta = {};

    const result = await middleware.check(subscriber, meta);

    expect(result.allowed).toBe(true);
  });

  test('GIVEN event is handled AND subscriber ignores handled events THEN returns false', async () => {
    const middleware = new HandleCheckEventMiddleware();
    const subscriber = new MockEventSubscriber();
    const meta = {};
    TypedFields.EventHandled.set(meta, true);

    const result = await middleware.check(subscriber, meta);

    expect(result.allowed).toBe(false);
  });

  test('GIVEN event is handled BUT subscriber does not ignore handled events THEN returns true', async () => {
    const middleware = new HandleCheckEventMiddleware();
    const subscriber = MockEventSubscriber.create({ ignoreHandled: false });
    const meta = {};
    TypedFields.EventHandled.set(meta, true);

    const result = await middleware.check(subscriber, meta);

    expect(result.allowed).toBe(true);
  });

  test('GIVEN event handled field is false THEN returns true', async () => {
    const middleware = new HandleCheckEventMiddleware();
    const subscriber = new MockEventSubscriber();
    const meta = {};
    TypedFields.EventHandled.set(meta, false);

    const result = await middleware.check(subscriber, meta);

    expect(result.allowed).toBe(true);
  });
});
