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

import type {
  ActionRowComponentData,
  ActionRowData,
  Message,
  MessageActionRowComponentBuilder,
  MessageActionRowComponentData,
  ModalActionRowComponentBuilder,
} from 'discord.js';
import { ActionRowBuilder, ComponentType } from 'discord.js';

type ComponentEditCallback<ComponentData extends ActionRowComponentData> = (
  component: ComponentData,
) => ComponentData;

/** An object for easy manipulation of an action row component. */
export class ActionRowWrapper<ComponentData extends ActionRowComponentData> {
  protected readonly components: ComponentData[];

  constructor(...components: ComponentData[]) {
    this.components = components;
  }

  public static fromMessage(
    message: Message<boolean>,
    row = 0,
  ): ActionRowWrapper<MessageActionRowComponentData> {
    return new ActionRowWrapper<MessageActionRowComponentData>(
      ...message.components[row].components,
    );
  }

  public add(...components: ComponentData[]): this {
    this.components.push(...components);
    return this;
  }

  public setDisabled(disabled = true): this {
    return this.editAll((component) => ({ ...component, disabled }));
  }

  public editAll(callback: ComponentEditCallback<ComponentData>): this {
    for (const [index, component] of this.components.entries()) {
      this.components[index] = callback(component);
    }
    return this;
  }

  public editWhere(
    where: (component: ComponentData) => boolean,
    callback: ComponentEditCallback<ComponentData>,
    many = true,
  ): this {
    let appliableComponents = this.components.filter((component) =>
      where(component),
    );
    if (!many) {
      appliableComponents = appliableComponents.length
        ? [appliableComponents[0]]
        : [];
    }
    for (const [index, component] of appliableComponents.entries()) {
      this.components[index] = callback(component);
    }
    return this;
  }

  public has(where: (component: ComponentData) => boolean): boolean {
    const found = this.components.find(where);
    return !!found;
  }

  public toRowData(): ActionRowData<ComponentData> {
    return { type: ComponentType.ActionRow, components: this.components };
  }

  public toBuilder(): ActionRowBuilder<
    ComponentData extends MessageActionRowComponentData
      ? MessageActionRowComponentBuilder
      : ModalActionRowComponentBuilder
  > {
    return new ActionRowBuilder(this.toRowData());
  }
}
