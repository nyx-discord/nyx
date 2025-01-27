import type {
  Session,
  SessionUpdateArgs,
  SessionUpdateMiddleware,
} from '@nyx-discord/core';
import { AbstractMiddleware } from '../../../middleware/AbstractMiddleware.js';

export abstract class AbstractSessionUpdateMiddleware
  extends AbstractMiddleware<Session<unknown>, SessionUpdateArgs>
  implements SessionUpdateMiddleware {}
