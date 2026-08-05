import { createStubBot } from '#mocks/stubBot';
import { resolve } from 'path';
import { describe, expect, test } from 'vitest';
import { LoaderError } from '../../src/error/LoaderError';
import { EventLoader } from '../../src/loaders/event/EventLoader';

const fixturesDir = resolve(__dirname, '..', 'fixtures', 'events');
const bot = createStubBot();

describe('EventLoader', () => {
  test('GIVEN one file per subscriber type THEN all 6 buckets are populated correctly', async () => {
    const buckets = await EventLoader.load({
      bot,
      register: false,
      path: resolve(fixturesDir, 'all-types'),
    });

    expect(buckets.client).toHaveLength(1);
    expect(buckets.client[0]?.getEvent()).toBe('ready');

    expect(buckets.command).toHaveLength(1);
    expect(buckets.command[0]?.getEvent()).toBe('commandAdd');

    expect(buckets.service).toHaveLength(1);
    expect(buckets.service[0]?.getEvent()).toBe('start');

    expect(buckets.plugin).toHaveLength(1);
    expect(buckets.plugin[0]?.getEvent()).toBe('pluginAdd');

    expect(buckets.bus).toHaveLength(1);
    expect(buckets.bus[0]?.getEvent()).toBe('eventSubscriberAdd');

    expect(buckets.schedule).toHaveLength(1);
    expect(buckets.schedule[0]?.getEvent()).toBe('scheduleAdd');
  });

  test('GIVEN an export that extends no known subscriber base class THEN throws LoaderError', async () => {
    await expect(
      EventLoader.load({
        bot,
        register: false,
        path: resolve(fixturesDir, 'bad-unclassified'),
      }),
    ).rejects.toThrow(LoaderError);
  });
});
