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
  ActionRowComponentData,
  ActionRowData,
  Message,
  MessageActionRowComponentBuilder,
  MessageActionRowComponentData,
  ModalActionRowComponentBuilder,
} from 'discord.js';
import {
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
  isJSONEncodable,
} from 'discord.js';

type ComponentEditCallback<ComponentData extends ActionRowComponentData> = (
  component: ComponentData,
) => ComponentData;

/** An object for easy manipulation of an action row component. */
export class ActionRowWrapper<ComponentData extends ActionRowComponentData> {
  protected components: ComponentData[];

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

  public editComponent(
    customId: string,
    callback: ComponentEditCallback<ComponentData>,
  ): this {
    return this.editWhere(
      (component) => {
        if (isJSONEncodable(component)) {
          const json = component.toJSON();
          if (
            json.type === ComponentType.Button
            && json.style === ButtonStyle.Link
          ) {
            return false;
          }

          return json.custom_id === customId;
        } else {
          if (
            component.type === ComponentType.Button
            && component.style === ButtonStyle.Link
          ) {
            return false;
          }

          return component.customId === customId;
        }
      },
      callback,
      false,
    );
  }

  public editWhere(
    where: (component: ComponentData) => boolean,
    callback: ComponentEditCallback<ComponentData>,
    many = true,
  ): this {
    for (const component of this.components) {
      if (where(component)) {
        const index = this.components.indexOf(component);
        this.components[index] = callback(component);
        if (!many) break;
      }
    }

    return this;
  }

  public has(where: (component: ComponentData) => boolean): boolean {
    const found = this.components.find(where);
    return !!found;
  }

  public map<T>(callback: (component: ComponentData) => T): T[] {
    return this.components.map(callback);
  }

  public filter(
    where: (component: ComponentData) => boolean,
  ): ActionRowWrapper<ComponentData> {
    return new ActionRowWrapper<ComponentData>(
      ...this.components.filter(where),
    );
  }

  public forEach(callback: (component: ComponentData) => void): this {
    this.components.forEach(callback);
    return this;
  }

  public find(
    where: (component: ComponentData) => boolean,
  ): ComponentData | undefined {
    return this.components.find(where);
  }

  public remove(where: (component: ComponentData) => boolean): this {
    this.components = this.components.filter((component) => !where(component));
    return this;
  }

  public removeAll(): this {
    this.components = [];
    return this;
  }

  public getComponents(): ReadonlyArray<ComponentData> {
    return this.components;
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
