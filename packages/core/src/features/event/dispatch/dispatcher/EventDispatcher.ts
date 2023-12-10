/*
 * MIT License
 *
 * Copyright (c) 2023 Amgelo563
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type { Awaitable } from 'discord.js';
import type { ErrorHandlerContainer } from '../../../../error/handler/ErrorHandlerContainer.js';
import type { MiddlewareListContainer } from '../../../../middleware/list/MiddlewareListContainer.js';
import type { EventSubscriberMiddleware } from '../../middleware/EventSubscriberMiddleware.js';
import type { EventSubscriberErrorHandler } from '../../subscriber/error/EventSubscriberErrorHandler.js';
import type { AnyEventSubscriber } from '../../subscriber/types/AnyEventSubscriber';

/**
 * An object for dispatching events to an array of {@link EventSubscriber},
 * performing middleware and error catching logic in the process.
 */
export interface EventDispatcher
  extends MiddlewareListContainer<EventSubscriberMiddleware>,
    ErrorHandlerContainer<EventSubscriberErrorHandler> {
  /** Notifies a given subscriber array about an event, using the passed args. */
  dispatch(
    subscribers: AnyEventSubscriber[],
    args: Parameters<(typeof subscribers)[number]['handleEvent']>,
  ): Awaitable<void>;
}
