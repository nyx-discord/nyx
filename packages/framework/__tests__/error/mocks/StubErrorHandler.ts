import type { ErrorConsumer } from '@nyx-discord/core';
import { vi } from 'vitest';
import { BasicErrorHandler } from '../../../src';

type Obj = object;
type Args = unknown[];
type Handler = BasicErrorHandler<Obj, Args>;
type Consumer = ErrorConsumer<Obj, Obj, Args>;

export class StubErrorHandler {
  public static create(fallback: Consumer = vi.fn<Consumer>()): Handler {
    return new BasicErrorHandler<Obj, Args>(undefined as never, fallback);
  }

  public static createNull(fallback: Consumer = vi.fn<Consumer>()): Handler {
    return new BasicErrorHandler<Obj, Args>(null as never, fallback);
  }
}
