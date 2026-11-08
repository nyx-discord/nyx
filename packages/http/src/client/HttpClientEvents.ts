import type {
  APIWebhookEventBody,
  GatewayDispatchEvents,
  MappedEvents,
} from '@discordjs/core';
import type { WebhookEventProps } from '../webhook/WebhookEventProps.js';

/** The events an {@link HttpNyxClient} emits: `InteractionCreate` as @discordjs/core emits it, and each webhook event under its type. */
export type HttpClientEvents = Pick<
  MappedEvents,
  GatewayDispatchEvents.InteractionCreate
> & {
  [Event in APIWebhookEventBody as Event['type']]: [
    WebhookEventProps<Event['data']>,
  ];
};
