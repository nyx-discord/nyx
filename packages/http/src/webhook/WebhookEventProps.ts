import type { ToEventProps } from '@discordjs/core';

/** The props a webhook event is emitted with: the @discordjs/core event props plus when the event happened, since webhook events can arrive late or out of order. */
export type WebhookEventProps<Data> = ToEventProps<Data> & {
  /** When the event occurred, in ISO8601 format. */
  timestamp: string;
};
