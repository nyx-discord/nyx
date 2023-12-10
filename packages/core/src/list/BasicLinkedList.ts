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

import type { LinkedList } from './LinkedList.js';
import type { LinkedListNode } from './LinkedListNode.js';

export class BasicLinkedList<T extends LinkedListNode<T>>
  implements LinkedList<T>
{
  protected head: T | null;

  protected tail: T | null;

  protected count: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.count = 0;
  }

  public static from<T extends LinkedListNode<T>>(
    elements: T[],
  ): LinkedList<T> {
    const linkedList = new BasicLinkedList<T>();
    linkedList.addAll(elements);
    return linkedList;
  }

  public static empty<T extends LinkedListNode<T>>(): LinkedList<T> {
    return new BasicLinkedList<T>();
  }

  public add(element: T): this {
    if (this.head) {
      const last = this.head.getLast();
      last.setNext(element);
      return this;
    }
    this.head = element;

    this.count += 1;
    return this;
  }

  public addAll(elements: T[]): this {
    for (const element of elements) {
      this.add(element);
    }
    return this;
  }

  public remove(element: T): boolean {
    let current = this.head;
    let previous: T | null = null;

    while (current) {
      if (current === element) {
        if (previous === null) {
          this.head = current.getNext();
        } else {
          previous.setNext(current.getNext());
          if (current === this.tail) {
            this.tail = previous;
          }
        }

        this.count -= 1;
        return true;
      }

      previous = current;
      current = current.getNext();
    }

    return false;
  }

  public removeAt(index: number): T | null {
    if (index < 0 || index >= this.count) {
      return null;
    }

    let current = this.head;
    let previous: T | null = null;
    let currentIndex = 0;

    while (current && currentIndex < index) {
      previous = current;
      current = current.getNext();
      currentIndex += 1;
    }

    if (current === null) {
      return null;
    }

    if (previous === null) {
      this.head = current.getNext();
    } else {
      previous.setNext(current.getNext());
      if (current === this.tail) {
        this.tail = previous;
      }
    }

    this.count -= 1;
    return current;
  }

  public getAt(index: number): T | null {
    if (index < 0 || index >= this.count) {
      return null;
    }

    let current = this.head;
    let currentIndex = 0;

    while (current && currentIndex < index) {
      current = current.getNext();
      currentIndex += 1;
    }

    return current;
  }

  public getFirst(): T | null {
    return this.head;
  }

  public getLast(): T | null {
    return this.tail;
  }

  public size(): number {
    return this.count;
  }

  public isEmpty(): boolean {
    return this.count === 0;
  }

  public clear(): this {
    this.head = null;
    this.tail = null;
    this.count = 0;
    return this;
  }

  public toArray(): T[] {
    const array: T[] = [];
    let current = this.head;

    while (current) {
      array.push(current);
      current = current.getNext();
    }

    return array;
  }

  public *[Symbol.iterator](): IterableIterator<T> {
    let current = this.head;

    while (current) {
      yield current;
      current = current.getNext();
    }
  }
}
