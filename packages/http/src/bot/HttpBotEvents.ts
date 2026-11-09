import type { MappedEvents } from '@discordjs/core';
import type { HttpClientEvents } from '../client/HttpClientEvents.js';

/** The events of an {@link HttpBot}'s client event bus: @discordjs/core's events plus webhook events. */
export type HttpBotEvents = Omit<MappedEvents, keyof HttpClientEvents>
  & HttpClientEvents;
