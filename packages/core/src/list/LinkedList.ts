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

import type { LinkedListNode } from './LinkedListNode.js';

/**
 * A linked list object that stores objects in a sequence of nodes linked by references.
 *
 * Each object in the list is represented a node, which is the object itself and a reference
 * to the next node in the sequence.
 *
 * This linked list object provides methods to add, remove, and retrieve elements efficiently.
 */
export interface LinkedList<T extends LinkedListNode<T>> {
  /** Adds an element to the end of the list. */
  add(element: T): this;

  /** Adds all elements from the given array to the end of the list. */
  addAll(elements: T[]): this;

  /**
   * Removes the first occurrence of the specified element from the list, if it exists.
   * @returns Whether the element was found and removed.
   */
  remove(element: T): boolean;

  /** Removes the element at the specified index from the list.
   * @returns The removed element, or null if the index is out of range.
   */
  removeAt(index: number): T | null;

  /** Retrieves the element at the specified index in the list. */
  getAt(index: number): T | null;

  /** Returns the first element in the list. */
  getFirst(): T | null;

  /** Returns the last element in the list. */
  getLast(): T | null;

  /** Returns the number of elements in the list. */
  size(): number;

  /** Checks if the linked list is empty. */
  isEmpty(): boolean;

  /** Removes all elements from the list. */
  clear(): this;

  /** Converts the list to an array. */
  toArray(): T[];
}
