import { createStubBot } from '#mocks/stubBot';
import { resolve } from 'path';
import { describe, expect, test } from 'vitest';
import { LoaderError } from '../../src/error/LoaderError';
import { CommandLoader } from '../../src/loaders/command/CommandLoader';

const fixturesDir = resolve(__dirname, '..', 'fixtures', 'commands');
const bot = createStubBot();

describe('CommandLoader', () => {
  describe('valid directories', () => {
    test('GIVEN standalone and context menu commands THEN both are instantiated', async () => {
      const commands = await CommandLoader.load({
        bot,
        register: false,
        path: resolve(fixturesDir, 'standalone'),
      });

      expect(commands).toHaveLength(2);
      const names = commands.map((c) => c.getData().name).sort();
      expect(names).toEqual(['Report User', 'ping']);
    });

    test('GIVEN a parent with subcommands and subcommand group with its own subcommands THEN full hierarchy is built', async () => {
      const commands = await CommandLoader.load({
        bot,
        register: false,
        path: resolve(fixturesDir, 'nested'),
      });

      const mod = commands.find((c) => c.getData().name === 'mod');
      expect(mod).toBeDefined();
      expect(mod!.isParent()).toBe(true);

      const children = (mod as any).getChildren();
      expect(children).toBeDefined();
      expect(children.size).toBeGreaterThanOrEqual(2);

      const ban = children.get('ban');
      expect(ban).toBeDefined();

      const settings = children.get('settings');
      expect(settings).toBeDefined();
      expect(settings.isSubCommandGroup()).toBe(true);

      const settingsChildren = settings.getChildren();
      expect(settingsChildren.size).toBeGreaterThanOrEqual(1);
      expect(settingsChildren.has('view')).toBe(true);
      expect(settingsChildren.has('edit')).toBe(true);
    });

    test('GIVEN an unclaimed organizational subdirectory THEN it is recursed as a new root', async () => {
      const commands = await CommandLoader.load({
        bot,
        register: false,
        path: resolve(fixturesDir, 'unclaimed'),
      });

      const format = commands.find((c) => c.getData().name === 'format');
      expect(format).toBeDefined();
      expect(format!.isStandalone()).toBe(true);

      const mod = commands.find((c) => c.getData().name === 'unclaimed');
      expect(mod).toBeDefined();
      expect(mod!.isParent()).toBe(true);
    });

    test('GIVEN a file exporting multiple command classes THEN all are instantiated', async () => {
      const commands = await CommandLoader.load({
        bot,
        register: false,
        path: resolve(fixturesDir, 'multi-export'),
      });

      const standalone = commands.find(
        (c) => c.getData().name === 'multi-standalone',
      );
      const parent = commands.find((c) => c.getData().name === 'multi-parent');
      expect(standalone).toBeDefined();
      expect(parent).toBeDefined();
    });
  });

  describe('error cases', () => {
    test('GIVEN a standalone command in a children folder THEN throws LoaderError', async () => {
      await expect(
        CommandLoader.load({
          bot,
          register: false,
          path: resolve(fixturesDir, 'bad-child'),
        }),
      ).rejects.toThrow(LoaderError);
    });

    test('GIVEN a subcommand at root level THEN throws LoaderError', async () => {
      await expect(
        CommandLoader.load({
          bot,
          register: false,
          path: resolve(fixturesDir, 'bad-root'),
        }),
      ).rejects.toThrow(LoaderError);
    });
  });
});
