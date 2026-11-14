// Errors from commands, subscribers and schedules go to their executor's ErrorHandler.
// nyx never replies to users on errors: decide here what users see and where errors are reported.
// Docs: https://nyx-discord.github.io/nyx/guide/use/other/error-handling.md
import { CommandError, TypedFields, type DjsNyxBot } from '@nyx-discord/djs';

// Type bot parameters as DjsNyxBot (CoreNyxBot for @discordjs/core), not NyxBot, to keep the discord.js types.
export function setupErrorHandling(bot: DjsNyxBot) {
  const commandErrors = bot.getCommandManager().getExecutor().getErrorHandler();

  // Consumers are matched by error class, subclasses included. CommandError wraps errors thrown by execute().
  commandErrors.setConsumer(CommandError, async (error, command, [interaction, meta]) => {
    TypedFields.getLogger(meta).error(`Command ${command.getData().name} failed`, error);
    if (interaction.isRepliable() && !interaction.replied) {
      await interaction.reply({ content: 'Something went wrong.', ephemeral: true });
    }
  });

  commandErrors.setFallbackConsumer((error) => {
    bot.getLogger().error('Unhandled command error', error);
  });
  bot.getScheduleManager().getExecutor().getErrorHandler().setFallbackConsumer((error) => {
    bot.getLogger().error('Schedule error', error);
  });
  bot.getClientEventBus().getDispatcher().getErrorHandler().setFallbackConsumer((error) => {
    bot.getLogger().error('Client event error', error);
  });
}
