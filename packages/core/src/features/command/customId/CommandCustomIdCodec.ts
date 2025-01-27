import type { CustomIdBuilder } from '../../../customId/CustomIdBuilder';
import type { CustomIdCodec } from '../../../customId/CustomIdCodec.js';
import type { StringIterator } from '../../../string/StringIterator';
import type { AnyExecutableCommand } from '../commands/executable/AnyExecutableCommand';

/** An object responsible for creating and manipulating customIds that refer to command names. */
export interface CommandCustomIdCodec
  extends CustomIdCodec<AnyExecutableCommand> {
  /**
   * Creates a {@link CustomIdBuilder} that can be used to start a
   * customId that refers to the passed command.
   * @example
   * // Let's say you want to make a component that when used, it routes to the
   * // userinfo command, with 'Amgelo#1106' as an extra data.
   *
   * const commandManager = myBot.getCommandManager();
   * const repository = commandManager.getRepository();
   *
   * const userInfoCommand =
   *   repository.locateCommandByTree(UserInfoCommandClass);
   * if (!userInfoCommand) return;
   *
   * const customIdCodec = commandManager.getCustomIdCodec();
   *
   * const builder = customIdCodec.createCustomIdBuilder(userInfoCommand);
   * builder.add('Amgelo#1106');
   *
   * // Use this for your component's customId.
   * const customId: string = builder.build();
   */
  createCustomIdBuilder(command: AnyExecutableCommand): CustomIdBuilder;

  /**
   * Creates a {@link StringIterator} from a command customId, leaving only the
   * data that is not related to the referred command.
   * @example
   * // Let's say your command customId template is:
   *   '$CMD_commandName_[extradata]'.
   *
   * // This is obtained from an Interaction, declared here for demonstration
   *   purposes. const customId = '$CMD_userinfo_Amgelo#1106_extraInfo';
   *
   * const customIdCodec = myBot.getCommandManager().getCustomIdCodec();
   * const iterator = customIdCodec.createIteratorFromCustomId(customId);
   *
   * console.log(iterator.getTokens()) // ['Amgelo#1106', 'extraInfo']
   */
  createIteratorFromCustomId(commandCustomId: string): StringIterator | null;

  /** Returns a name tree given the passed command id, extracted with {@link deserializeToObjectId}. */
  getNameTreeFromId(id: string): [string, ...string[]];

  /** Returns a name tree from a command customId.
   * Alias of:
   * ```ts
   * const id = codec.deserializeToObjectId(interaction.customId);
   * const nameTree = codec.getNameTreeFromId(id);
   * ```
   */
  deserializeToNameTree(customId: string): [string, ...string[]] | null;
}
