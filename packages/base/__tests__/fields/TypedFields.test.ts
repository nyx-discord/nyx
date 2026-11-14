import { describe, expect, test } from 'vitest';
import type { NyxBot, NyxLogger } from '../../src';
import { DefaultMetadataFactory, TypedFields } from '../../src';

describe('TypedFields (base)', () => {
  test('GIVEN metadata with the Bot field WHEN calling getLogger THEN returns the bot logger', () => {
    const logger = {} as NyxLogger;
    const bot = { getLogger: () => logger } as unknown as NyxBot;
    const meta = DefaultMetadataFactory.createWith([
      TypedFields.Bot,
      bot,
    ]).createOrPopulate(undefined, 'meta');

    expect(TypedFields.getLogger(meta)).toBe(logger);
  });

  test('GIVEN metadata without the Bot field WHEN calling getLogger THEN throws', () => {
    expect(() => TypedFields.getLogger(Object.create(null))).toThrow();
  });
});
