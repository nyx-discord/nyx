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

import type {
  ActionRow,
  ActionRowBuilder,
  ActionRowComponentData,
  ActionRowData,
  Message,
  MessageActionRowComponent,
  MessageActionRowComponentBuilder,
  MessageActionRowComponentData,
  ModalActionRowComponentBuilder,
} from 'discord.js';
import { ActionRowWrapper } from './ActionRowWrapper.js';

type RowComponentEditCallback<ComponentData extends ActionRowComponentData> = (
  component: ComponentData,
  row: ActionRowWrapper<ComponentData>,
) => ComponentData;

/** An object for easy manipulation of multiple action row components. */
export class ActionRowList<ComponentData extends ActionRowComponentData> {
  protected readonly rows: ActionRowWrapper<ComponentData>[];

  constructor(...data: ActionRowData<ComponentData>[]) {
    this.rows = data.map(
      (row) => new ActionRowWrapper<ComponentData>(...row.components),
    );
  }

  /** Creates an ActionRowList from a {@link Message}. */
  public static fromMessage(
    message: Message<boolean>,
  ): ActionRowList<MessageActionRowComponentData> {
    return new ActionRowList<MessageActionRowComponentData>(
      ...(message.components.map((row) => ({
        ...row,
        components: row.components.map((component) => ({
          ...component.data,
        })),
      })) as ActionRow<MessageActionRowComponent>[]),
    );
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
}
