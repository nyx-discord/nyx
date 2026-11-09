import type { APIInteraction, ToEventProps } from '@discordjs/core';
import { InteractionType } from '@discordjs/core';
import type { Metadata, NyxBot } from '@nyx-discord/base';
import { TypedFields } from '@nyx-discord/base';
import type { Interaction } from 'discord.js';
import { describe, expect, test, vi } from 'vitest';
import { DefaultSessionUpdateSubscriber as DjsSessionUpdateSubscriber } from '../../../src/djs';
import { DefaultSessionUpdateSubscriber as CoreSessionUpdateSubscriber } from '../../../src/djs-core';

const Custom = TypedFields.create<string>('Custom');

function createMeta() {
  const plugin = {
    update: vi.fn((..._args: unknown[]) => Promise.resolve(true)),
  };
  const meta: Metadata = {};
  TypedFields.Bot.set(meta, {
    getPluginManager: () => ({ getPluginByClass: () => plugin }),
  } as unknown as NyxBot);
  Custom.set(meta, 'from the bus');
  return { meta, plugin };
}

describe('DefaultSessionUpdateSubscriber (metadata)', () => {
  test('GIVEN bus metadata WHEN a @discordjs/core interaction updates a session THEN the plugin receives a copy with its fields', async () => {
    const { meta, plugin } = createMeta();

    await new CoreSessionUpdateSubscriber().handleEvent(meta, {
      data: { type: InteractionType.MessageComponent },
      api: {},
    } as unknown as ToEventProps<APIInteraction>);

    const received = plugin.update.mock.calls[0]?.[1] as Metadata;
    expect(received).not.toBe(meta);
    expect(Custom.get(received)).toBe('from the bus');
  });

  test('GIVEN bus metadata WHEN a discord.js interaction updates a session THEN the plugin receives a copy with its fields', async () => {
    const { meta, plugin } = createMeta();

    await new DjsSessionUpdateSubscriber().handleEvent(meta, {
      isAutocomplete: () => false,
      isCommand: () => false,
      isModalSubmit: () => false,
    } as unknown as Interaction);

    const received = plugin.update.mock.calls[0]?.[1] as Metadata;
    expect(received).not.toBe(meta);
    expect(Custom.get(received)).toBe('from the bus');
  });
});
