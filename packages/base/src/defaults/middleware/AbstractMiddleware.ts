import type { Middleware } from '#types/middleware/Middleware';
import type { MiddlewareResponse } from '#types/middleware/response/MiddlewareResponse';
import type { Priority } from '#types/priority/Priority';
import { PriorityEnum } from '#types/priority/Priority';
import type { Awaitable } from '#types/types/Awaitable';

/** A base abstract Middleware implementation. */
export abstract class AbstractMiddleware<
  Check,
  Args extends readonly unknown[],
> implements Middleware<Check, Args> {
  protected protected = false;

  protected readonly priority: Priority = PriorityEnum.Normal;

  public getPriority(): Priority {
    return this.priority;
  }

  public protect(): this {
    this.protected = true;
    return this;
  }

  public unprotect(): this {
    this.protected = false;
    return this;
  }

  public isProtected(): boolean {
    return this.protected;
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
