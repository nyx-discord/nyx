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

import type { Identifiable } from '../identity/Identifiable.js';
import type { StringIterator } from '../string/StringIterator';
import type { CustomIdBuilder } from './CustomIdBuilder';

/** An object responsible for creating and manipulating customIds that refer to objects. */
export interface CustomIdCodec<Serialized extends Identifiable<string>> {
  /** Creates a customId that refers to the passed object. */
  serializeToCustomId(object: Serialized): string;

  /** Extracts the ID from the passed customId, if one is present. */
  deserializeToObjectId(customId: string): string | null;

  /** Creates a {@link CustomIdBuilder} that can be used to start a customId that refers to the passed object. */
  createCustomIdBuilder(object: Serialized): CustomIdBuilder;

  /** Creates a {@link StringIterator} from a customId, leaving only the data that is not related to the referred object. */
  createIteratorFromCustomId(customId: string): StringIterator | null;
}
