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

import type { PriorityAware } from '../priority/PriorityAware.js';
import { BasicLinkedList } from './BasicLinkedList.js';
import type { LinkedListNode } from './LinkedListNode.js';

export class SortedLinkedList<
  T extends PriorityAware & LinkedListNode<T>,
> extends BasicLinkedList<T> {
  public static sortedListFrom<
    T extends PriorityAware & LinkedListNode<T>,
    List extends SortedLinkedList<T> = SortedLinkedList<T>,
  >(elements: T[]): List {
    const linkedList = new SortedLinkedList<T>();
    linkedList.addAll(elements);
    return linkedList as List;
  }

  public override add(element: T): this {
    if (!this.head || element.getPriority() > this.head.getPriority()) {
      element.setNext(this.head);
      this.head = element;
      this.count += 1;

      return this;
    }

    let current: T | null = this.head;
    let previous = null;

    while (current && element.getPriority() <= current.getPriority()) {
      previous = current;
      current = current.getNext();
    }

    if (previous) {
      previous.setNext(element);
      element.setNext(current);
      this.count += 1;

      return this;
    }

    element.setNext(this.head);
    this.head = element;

    this.count += 1;
    return this;
  }
}
