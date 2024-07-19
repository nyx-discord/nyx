/*
 * MIT License
 *
 * Copyright (c) 2024 Amgelo563
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

import { IllegalDuplicateError } from '@nyx-discord/core';
import type {
  ActionRowBuilder,
  ActionRowComponentData,
  ActionRowData,
  Message,
  MessageActionRowComponentBuilder,
  MessageActionRowComponentData,
  ModalActionRowComponentBuilder,
} from 'discord.js';
import { isJSONEncodable } from 'discord.js';

import { ActionRowWrapper } from './ActionRowWrapper.js';
import type { RowAssignable } from './RowAssignable';

type RowComponentEditCallback<ComponentData extends ActionRowComponentData> = (
  component: ComponentData,
  row: ActionRowWrapper<ComponentData>,
) => ComponentData;

/** An object for easy manipulation of multiple action row components. */
export class ActionRowList<ComponentData extends ActionRowComponentData> {
  protected readonly limit: number = 5;

  protected readonly rows: ActionRowWrapper<ComponentData>[];

  constructor(...data: RowAssignable<ComponentData>[]) {
    this.rows = [];
    this.push(...data);
  }

  /** Creates an ActionRowList from a {@link Message}. */
  public static fromMessage(
    message: Message<boolean>,
  ): ActionRowList<MessageActionRowComponentData> {
    return new ActionRowList<MessageActionRowComponentData>(
      ...message.components,
    );
  }

  /**
   * Pushes new action rows to the list.
   *
   * @throws {RangeError} If the amount of passed rows plus the rows in the list exceeds the limit (5).
   */
  public push(...rows: RowAssignable<ComponentData>[]): this {
    if (this.rows.length + rows.length > this.limit) {
      throw new RangeError(
        `Cannot push more than ${this.limit} action rows to an ActionRowList`,
      );
    }

    const mapped = rows.map(this.wrapRowAssignable);
    this.rows.push(...mapped);

    return this;
  }

  /**
   * Sets the action row at the given index to the passed row.
   *
   * @throws {RangeError} If the index is out of bounds (0 <= index < 5), or if there isn't a row at the previous index.
   * @throws {IllegalDuplicateError} If there's a row already at the given index.
   */
  public setAt(index: number, row: RowAssignable<ComponentData>): this {
    if (index < 0 || index >= this.limit) {
      throw new RangeError(
        `Index ${index} out of bounds (0 <= index < ${this.limit}).`,
      );
    }

    if (index > 0 && !this.rows[index - 1]) {
      throw new RangeError(`No action row at the previous index ${index - 1}.`);
    }

    if (this.rows[index]) {
      throw new IllegalDuplicateError(
        this.rows[index],
        row,
        `An action row already exists at index ${index}.`,
      );
    }

    this.rows[index] = this.wrapRowAssignable(row);
    return this;
  }

  /** Removes and returns the last action row from the list. */
  public pop(): ActionRowWrapper<ComponentData> | undefined {
    return this.rows.pop();
  }

  /** Returns a shalow copy of the action rows in the list, selected from start to end indexes. */
  public slice(start?: number, end?: number): ActionRowList<ComponentData> {
    return new ActionRowList<ComponentData>(...this.rows.slice(start, end));
  }

  /** Sets disabled state of the components of all the contained action rows. */
  public setDisabled(disabled = true): this {
    return this.editAll((component) => ({ ...component, disabled }));
  }

  /** Edits the components of all the contained action rows. */
  public editAll(callback: RowComponentEditCallback<ComponentData>): this {
    for (const row of this.rows) {
      const { components } = row.toRowData();
      for (const [index, component] of components.entries()) {
        components[index] = callback(component, row);
      }
    }
    return this;
  }

  /** Edits the components of all the contained action rows that satisfy a certain criteria. */
  public editWhere(
    where: (component: ComponentData) => boolean,
    callback: RowComponentEditCallback<ComponentData>,
    many = true,
  ): this {
    for (const row of this.rows) {
      const { components } = row.toRowData();
      let applicableComponents = components.filter((component) =>
        where(component),
      );
      if (!many) {
        applicableComponents = applicableComponents.length
          ? [applicableComponents[0]]
          : [];
      }
      for (const [index, component] of applicableComponents.entries()) {
        components[index] = callback(component, row);
      }
    }
    return this;
  }

  /** Clones this list to a new one. */
  public clone(): ActionRowList<ComponentData> {
    const rows = this.rows.map((row) => row.toRowData());
    return new ActionRowList<ComponentData>(...rows);
  }

  /** Serializes the contained rows to {@link ActionRowData} objects. */
  public toRowsData(): ActionRowData<ComponentData>[] {
    return this.rows.map((row) => row.toRowData());
  }

  /** Serializes the contained rows to {@link ActionRowBuilder} objects. */
  public toBuilders(): ActionRowBuilder<
    ComponentData extends MessageActionRowComponentData
      ? MessageActionRowComponentBuilder
      : ModalActionRowComponentBuilder
  >[] {
    return this.rows.map((row) => row.toBuilder());
  }

  /** Returns the contained rows. */
  public getRows(): ReadonlyArray<ActionRowWrapper<ComponentData>> {
    return this.rows;
  }

  /** Wraps a {@link RowAssignable} in an {@link ActionRowWrapper}. */
  protected wrapRowAssignable(
    row: RowAssignable<ComponentData>,
  ): ActionRowWrapper<ComponentData> {
    return row instanceof ActionRowWrapper
      ? row
      : new ActionRowWrapper<ComponentData>(
          // Map each component in the row to its raw data, if it's a JSONEncodable then it's a builder
          ...row.components.map((component) => {
            return isJSONEncodable(component)
              ? (component.toJSON() as ComponentData)
              : component;
          }),
        );
  }
}
