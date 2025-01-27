import type { CustomIdBuilder } from '../../../customId/CustomIdBuilder';
import type { CustomIdCodec } from '../../../customId/CustomIdCodec.js';
import type { StringIterator } from '../../../string/StringIterator';
import type { PaginationSession } from '../session/PaginationSession.js';
import type { Session } from '../session/Session.js';
import type { PaginationCustomIdBuilder } from './PaginationCustomIdBuilder';

/** An object responsible for creating and manipulating customIds that refer to session IDs. */
export interface SessionCustomIdCodec extends CustomIdCodec<Session<unknown>> {
  /** Extracts the page from the passed customId, if one is present. */
  extractPageFromCustomId(customId: string): number | null;

  /**
   * Creates a {@link PaginationCustomIdBuilder} that can be used to
   * start a customId that refers to the passed {@link PaginationSession}, to a
   * specific page number (pagination index).
   * @example
   * // Let's say you want to make a component that when used,
   * // it routes to the current session, with 'amgelo563' as an extra data, on
   * // the page 3.
   *
   * // Writing:
   * const customIdCodec = this.bot.getSessionManager().getCustomIdProcessor();
   * const builder: PaginationCustomIdBuilder = customIdProcessor
   *   .createPageCustomIdBuilder(this)
   *   .setAt(0, 'amgelo563')
   *   .setPage(3);
   *
   * const customId: string = builder.build(); // Use this as the customId.
   *
   * // Receiving:
   * const iterator: StringIterator = customIdCodec
   *   .createIteratorFromCustomId(interaction.customId);
   * const user: string = iterator.getAt(0); // amgelo563
   */
  createPageCustomIdBuilder(
    session: PaginationSession<unknown>,
    page?: number,
  ): PaginationCustomIdBuilder;

  /** Extracts the ID from the passed customId, if one is present. */
  deserializeToObjectId(customId: string): string | null;

  /**
   * Creates a {@link CustomIdBuilder} that can be used to create a
   * customId that refers to the passed session.
   * @example
   * // Let's say you want to make a component that when used, it routes to the
   *   current session, with 'Amgelo#1106' as an extra data.
   *
   * const customIdCodec = this.bot.getSessionManager().getCustomIdProcessor();
   *
   * const builder = customIdProcessor.createCustomIdBuilder(this);
   * builder.add('Amgelo#1106');
   *
   * const customId: string = builder.build(); // Now you can use this as a
   *   customId for your component.
   */
  createCustomIdBuilder(session: Session<unknown>): CustomIdBuilder;

  /**
   * Creates a {@link StringIterator} from a session customId, leaving only the
   * data that is not related to the referred command.
   * @example
   * // Let's say your session customId template is:
   *   '$SSN_sessionId_[extradata]'.
   *
   * // This is obtained from an Interaction, declared here for demonstration
   *   purposes. const customId = '$SSN_someSessionId_Amgelo#1106_extraInfo';
   *
   * const customIdCodec = this.bot.getSessionManager().getCustomIdCodec();
   * const iterator = customIdCodec.createIteratorFromCustomId(customId);
   *
   * console.log(iterator.getTokens()) // ['Amgelo#1106', 'extraInfo']
   */
  createIteratorFromCustomId(sessionCustomId: string): StringIterator | null;
}
