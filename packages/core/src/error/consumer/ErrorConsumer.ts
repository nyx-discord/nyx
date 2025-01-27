import type { Awaitable } from 'discord.js';

/** An Error consumer function. Gets passed the Error instance and the ErrorHandler this consumer belongs to. */
export type ErrorConsumer<ErrorType, ErroredObject, Args extends unknown[]> = (
  error: ErrorType,
  object: ErroredObject,
  args: Args,
) => Awaitable<void>;
