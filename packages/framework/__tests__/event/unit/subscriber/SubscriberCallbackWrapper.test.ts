import { describe, expect, it, test, vi } from 'vitest';
import { SubscriberCallbackWrapper } from '../../../../src';
import type { Metadata } from '@nyx-discord/core';
import { EventSubscriberLifetimeEnum, PriorityEnum } from '@nyx-discord/core';

type TestEvents = {
  test: [data: string];
  other: [value: number];
};

describe('SubscriberCallbackWrapper', () => {
  test('GIVEN an event and callback THEN creates an instance', () => {
    const callback = vi.fn();
    const wrapper = new SubscriberCallbackWrapper<TestEvents, 'test'>(
      'test',
      callback,
    );

    expect(wrapper).toBeInstanceOf(SubscriberCallbackWrapper);
  });

  test('GIVEN an event and callback THEN getEvent returns the event', () => {
    const callback = vi.fn();
    const wrapper = new SubscriberCallbackWrapper<TestEvents, 'other'>(
      'other',
      callback,
    );

    expect(wrapper.getEvent()).toBe('other');
  });

  test('GIVEN a callback THEN handleEvent delegates to the callback', async () => {
    const callback = vi.fn();
    const wrapper = new SubscriberCallbackWrapper<TestEvents, 'test'>(
      'test',
      callback,
    );
    const meta: Metadata = {};

    await wrapper.handleEvent(meta, 'hello');

    expect(callback).toHaveBeenCalledWith(meta, 'hello');
  });

  it('SHOULD have default priority Normal', () => {
    const wrapper = new SubscriberCallbackWrapper<TestEvents, 'test'>(
      'test',
      vi.fn(),
    );

    expect(wrapper.getPriority()).toBe(PriorityEnum.Normal);
  });

  it('SHOULD have default lifetime On', () => {
    const wrapper = new SubscriberCallbackWrapper<TestEvents, 'test'>(
      'test',
      vi.fn(),
    );

    expect(wrapper.getLifetime()).toBe(EventSubscriberLifetimeEnum.On);
  });

  it('SHOULD ignore handled events by default', () => {
    const wrapper = new SubscriberCallbackWrapper<TestEvents, 'test'>(
      'test',
      vi.fn(),
    );

    expect(wrapper.ignoresHandledEvents()).toBe(true);
  });

  it('SHOULD not be protected by default', () => {
    const wrapper = new SubscriberCallbackWrapper<TestEvents, 'test'>(
      'test',
      vi.fn(),
    );

    expect(wrapper.isProtected()).toBe(false);
  });

  it('SHOULD have no filter by default', () => {
    const wrapper = new SubscriberCallbackWrapper<TestEvents, 'test'>(
      'test',
      vi.fn(),
    );

    expect(wrapper.getFilter()).toBeNull();
  });

  it('SHOULD return a symbol as its ID', () => {
    const wrapper = new SubscriberCallbackWrapper<TestEvents, 'test'>(
      'test',
      vi.fn(),
    );

    expect(typeof wrapper.getId()).toBe('symbol');
  });

  it('SHOULD return a metadata object', () => {
    const wrapper = new SubscriberCallbackWrapper<TestEvents, 'test'>(
      'test',
      vi.fn(),
    );

    const meta = wrapper.getMeta();
    expect(meta).toBeDefined();
    expect(typeof meta).toBe('object');
  });

  test('GIVEN protect is called THEN isProtected returns true', () => {
    const wrapper = new SubscriberCallbackWrapper<TestEvents, 'test'>(
      'test',
      vi.fn(),
    );

    wrapper.protect();

    expect(wrapper.isProtected()).toBe(true);
  });

  test('GIVEN unprotect is called THEN isProtected returns false', () => {
    const wrapper = new SubscriberCallbackWrapper<TestEvents, 'test'>(
      'test',
      vi.fn(),
    );
    wrapper.protect();

    wrapper.unprotect();

    expect(wrapper.isProtected()).toBe(false);
  });
});
