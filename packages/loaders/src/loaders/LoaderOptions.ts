import type {
  InjectableBotDependencies,
  InteractionTypes,
  NyxBot,
} from '@nyx-discord/types';

/** Options for a Loader. */
export type LoaderOptions<Types extends InteractionTypes = InteractionTypes> = {
  /** The bot to load objects for. This will also be passed to static create() methods. */
  bot: NyxBot<InjectableBotDependencies<Types, any, any, any>>;
  /** The path to load objects from. */
  path: string;
  /**
   * Whether to register the objects to the bot. If false, you'll need to manually register them.
   * @default true
   * @example
   * // With register: true or not passed (commands are still returned but they're purely informational)
   * await CommandLoader.load({ bot, path });
   *
   * // With register: false
   * const commands = await CommandLoader.load({ bot, path, register: false });
   * await bot.getCommandManager().addCommands(...commands);
   */
  register?: boolean;
  /**
   * Optional filter to include only specific files by their absolute path.
   * Files that return `false` are silently skipped.
   *
   * @example
   * // Only load files whose path contains "admin"
   * await CommandLoader.load({ bot, path, filter: (f) => f.includes('admin') });
   */
  filter?: (filePath: string) => boolean;
};
