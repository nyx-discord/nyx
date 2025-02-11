import type { NyxBot, SubCommandGroup } from '@nyx-discord/core';
import { ApplicationCommandType } from 'discord.js';
import { MockBot } from '../../../bot/MockBot';
import { MockStandaloneCommand } from '../../mocks/MockStandaloneCommand';
import { MockSubCommand } from '../../mocks/MockSubCommand';

const createBot = () => MockBot.createMock();
const codecOf = (bot: NyxBot) => bot.getCommandManager().getCustomIdCodec();

const createStandalone = () => new MockStandaloneCommand();
const createSubcommandOnParent = () => MockSubCommand.createOnParent();
const createSubcommandOnGroup = () => MockSubCommand.createOnGroup();

describe("Executable Commands' CustomIds", () => {
  describe('AbstractStandaloneCommand', () => {
    test('GIVEN no bot THEN throws', () => {
      const command = createStandalone();
      // @ts-expect-error no bot
      expect(() => command.buildCustomId()).toThrow();
    });

    test('GIVEN bot THEN customId is a string', () => {
      const command = createStandalone();
      const customId = command.buildCustomId(createBot());
      expect(typeof customId).toBe('string');
    });

    test('GIVEN bot and no extra THEN customId is equal to codec output', () => {
      const command = createStandalone();
      const bot = createBot();

      const commandGenerated = command.buildCustomId(bot);

      const commandData = command.getCustomIdData();
      const codecGenerated = codecOf(bot).serialize(commandData);

      expect(commandGenerated).toEqual(codecGenerated);
    });

    test('GIVEN bot and extra data THEN customId is equal to codec output', () => {
      const command = createStandalone();
      const bot = createBot();

      const commandGenerated = command.buildCustomId(bot, 'extra');

      const commandData = command.getCustomIdData('extra');
      const codecGenerated = codecOf(bot).serialize(commandData);

      expect(commandGenerated).toEqual(codecGenerated);
    });

    it('returns customId data matching its own command data', () => {
      const command = createStandalone();
      const customIdData = command.getCustomIdData();
      const commandData = command.getData();

      expect(customIdData).toEqual({
        type: ApplicationCommandType.ChatInput,
        name: commandData.name,
        extra: null,
        subcommand: null,
        group: null,
      });
    });
  });

  describe('AbstractSubCommand', () => {
    test('GIVEN no bot THEN throws', () => {
      const command = createSubcommandOnParent();
      // @ts-expect-error no bot
      expect(() => command.buildCustomId()).toThrow();
    });

    test('GIVEN bot THEN customId is a string', () => {
      const command = createSubcommandOnParent();
      const customId = command.buildCustomId(createBot());
      expect(typeof customId).toBe('string');
    });

    test('GIVEN bot and no extra THEN customId is equal to codec output', () => {
      const command = createSubcommandOnParent();
      const bot = createBot();

      const commandGenerated = command.buildCustomId(bot);

      const commandData = command.getCustomIdData();
      const codecGenerated = codecOf(bot).serialize(commandData);

      expect(commandGenerated).toEqual(codecGenerated);
    });

    test('GIVEN bot and extra data THEN customId is equal to codec output', () => {
      const command = createSubcommandOnParent();
      const bot = createBot();

      const commandGenerated = command.buildCustomId(bot, 'extra');

      const commandData = command.getCustomIdData('extra');
      const codecGenerated = codecOf(bot).serialize(commandData);

      expect(commandGenerated).toEqual(codecGenerated);
    });

    test('GIVEN inside group THEN customId data matches its own command data', () => {
      const subcommand = createSubcommandOnGroup();
      const customIdData = subcommand.getCustomIdData();
      const subcommandData = subcommand.getData();

      const group = subcommand.getParent() as SubCommandGroup;
      const groupData = group.getData();

      const parent = group.getParent();
      const parentData = parent.getData();

      expect(customIdData).toEqual({
        type: ApplicationCommandType.ChatInput,
        name: parentData.name,
        extra: null,
        subcommand: subcommandData.name,
        group: groupData.name,
      });
    });

    test('GIVEN not inside group THEN customId data matches its own command data', () => {
      const subcommand = createSubcommandOnParent();
      const customIdData = subcommand.getCustomIdData();
      const subcommandData = subcommand.getData();

      const parent = subcommand.getParent();
      const parentData = parent.getData();

      expect(customIdData).toEqual({
        type: ApplicationCommandType.ChatInput,
        name: parentData.name,
        extra: null,
        subcommand: subcommandData.name,
        group: null,
      });
    });
  });
});
