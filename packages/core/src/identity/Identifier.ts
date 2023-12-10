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

/**
 * An variable that can identify something, either of type `symbol` or `string`.
 *
 * Take in mind:
 * * `symbol` guarantees uniqueness but can't be serialized since they are runtime generated, and
 * only exist inside the node engine at the current execution.
 *
 * * `string`'s uniqueness depends on the implementation but can be serialized and deserialized
 * back.
 *
 * In general it's advised to use `symbol` for every internal object, and `string` for objects
 * meant to have some representation at Discord.
 */
export type Identifier = string | symbol;

/** Returns whether a value fits the type to be an identifier. */
export function canBeIdentifier(id: unknown): id is Identifier {
  return typeof id === 'string' || typeof id === 'symbol';
}
