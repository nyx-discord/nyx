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

import { Collection } from '@discordjs/collection';
import type { Identifiable } from '../../../../identity/Identifiable.js';
import type { Identifier } from '../../../../identity/Identifier.js';
import type { MetaCollection } from '../../../../meta/MetaCollection.js';
import type { Session } from '../../session/Session.js';

/** An object that saves metadata about a session execution. */
export class SessionExecutionMeta
  extends Collection<Identifier, unknown>
  implements MetaCollection, Identifiable
{
  protected readonly id: Identifier;

  protected readonly createdAt: number = Date.now();

  constructor(id: Identifier) {
    super();
    this.id = id;
  }

  /** Creates a SessionExecutionMeta using the given arguments, and an autogenerated ID. */
  public static fromSession(session: Session<unknown>): SessionExecutionMeta {
    const sessionId = session.getId();
    const id = Symbol(`Session-${sessionId} @${Date.now()}`);

    return new SessionExecutionMeta(id);
  }

  /** Returns the identifier of this session execution. */
  public getId(): Identifier {
    return this.id;
  }

  /** Returns the time when this session was executed. */
  public getCreatedAt(): number {
    return this.createdAt;
  }
}
