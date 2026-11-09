import type { Metadata, NyxBot } from '@nyx-discord/base';
import { TypedFields } from '@nyx-discord/base';
import type { Interaction } from 'discord.js';
import { describe, expect, test, vi } from 'vitest';
import {
  DefaultCommandAutocompleteSubscriber,
  DefaultCommandInteractionSubscriber,
} from '../../../../src';

const Custom = TypedFields.create<string>('Custom');

function createMeta() {
  const manager = {
    execute: vi.fn((..._args: unknown[]) => Promise.resolve(true)),
    autocomplete: vi.fn((..._args: unknown[]) => Promise.resolve(true)),
  };
  const meta: Metadata = {};
  TypedFields.Bot.set(meta, {
    getCommandManager: () => manager,
  } as unknown as NyxBot);
  Custom.set(meta, 'from the bus');
  return { meta, manager };
}

function interaction(autocomplete: boolean) {
  return {
    isAutocomplete: () => autocomplete,
    isPrimaryEntryPointCommand: () => false,
  } as unknown as Interaction;
}

describe('Default command subscribers (metadata)', () => {
  test('GIVEN bus metadata WHEN an interaction is executed THEN the command manager receives a copy with its fields', async () => {
    const { meta, manager } = createMeta();

    await new DefaultCommandInteractionSubscriber().handleEvent(
      meta,
      interaction(false),
    );

    const received = manager.execute.mock.calls[0]?.[1] as Metadata;
    expect(received).not.toBe(meta);
    expect(Custom.get(received)).toBe('from the bus');
  });

  test('GIVEN bus metadata WHEN an autocomplete is handled THEN the command manager receives a copy with its fields', async () => {
    const { meta, manager } = createMeta();

    await new DefaultCommandAutocompleteSubscriber().handleEvent(
      meta,
      interaction(true),
    );

    const received = manager.autocomplete.mock.calls[0]?.[1] as Metadata;
    expect(received).not.toBe(meta);
    expect(Custom.get(received)).toBe('from the bus');
  });
});
