import { DefaultMetadataFactory } from '@nyx-discord/base';
import { describe, expect, test } from 'vitest';
import type { NyxBot } from '../../../src';
import { TypedFields } from '../../../src';

describe('TypedFields (djs)', () => {
  test('GIVEN metadata with only the Bot field WHEN reading DjsBot THEN returns the same bot', () => {
    const bot = {} as NyxBot;
    const meta = DefaultMetadataFactory.createWith([
      TypedFields.Bot,
      bot,
    ]).createOrPopulate(undefined, 'meta');

    expect(TypedFields.DjsBot.get(meta)).toBe(bot);
  });
});
