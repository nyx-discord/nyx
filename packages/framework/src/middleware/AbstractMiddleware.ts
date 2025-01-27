import type {
  Middleware,
  MiddlewareResponse,
  Priority,
} from '@nyx-discord/core';
import { PriorityEnum } from '@nyx-discord/core';
import type { Awaitable } from 'discord.js';

/** A base abstract Middleware implementation. */
export abstract class AbstractMiddleware<Check, Args extends readonly unknown[]>
  implements Middleware<Check, Args>
{
  protected locked = false;

  protected readonly priority: Priority = PriorityEnum.Normal;

  public getPriority(): Priority {
    return this.priority;
  }

  public lock(): this {
    this.locked = true;
    return this;
  }

  public unlock(): this {
    this.locked = false;
    return this;
  }

  public isLocked(): boolean {
    return this.locked;
  }

  public abstract check(
    checked: Check,
    ...args: Args
  ): Awaitable<MiddlewareResponse>;

  /** Creates a true {@link MiddlewareResponse}. */
  protected true(): MiddlewareResponse {
    return { allowed: true, checkNext: true };
  }

  /** Creates a true {@link MiddlewareResponse} that forces the check to end there. */
  protected forceTrue(): MiddlewareResponse {
    return { allowed: true, checkNext: false };
  }

  /** Creates a false {@link MiddlewareResponse}. */
  protected false(): MiddlewareResponse {
    return { allowed: false, checkNext: false };
  }
}
