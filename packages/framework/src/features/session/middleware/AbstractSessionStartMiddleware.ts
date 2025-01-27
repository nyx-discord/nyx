import type {
  Session,
  SessionStartArgs,
  SessionStartMiddleware,
} from '@nyx-discord/core';
import { AbstractMiddleware } from '../../../middleware/AbstractMiddleware.js';

export abstract class AbstractSessionStartMiddleware
  extends AbstractMiddleware<Session<unknown>, SessionStartArgs>
  implements SessionStartMiddleware {}
