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

import type { MetadatableCustomIdBuilderOptions } from '../../../customId/MetadatableCustomIdBuilder';
import { MetadatableCustomIdBuilder } from '../../../customId/MetadatableCustomIdBuilder';
import type { CommandReferenceData } from '../resolver/CommandReferenceData';
import { ResolvedCommandType } from '../resolver/CommandReferenceData';

export interface CommandCustomIdBuilderOptions
  extends MetadatableCustomIdBuilderOptions {
  data: CommandReferenceData;
}

export class CommandCustomIdBuilder extends MetadatableCustomIdBuilder {
  public static readonly DataIndex = 0;

  protected readonly data: CommandReferenceData;

  constructor(options: CommandCustomIdBuilderOptions) {
    super(options);

    this.data = options.data;
    this.setMetaAt(
      CommandCustomIdBuilder.DataIndex,
      JSON.stringify(options.data),
    );
  }

  public static fromCommandCustomId(
    string: string,
    separator: string,
    dataSeparator: string,
  ): CommandCustomIdBuilder | null {
    const builder = MetadatableCustomIdBuilder.fromMetadatableString(
      string,
      separator,
      dataSeparator,
    );

    if (!builder) return null;

    const dataString = builder.getMetaAt(CommandCustomIdBuilder.DataIndex);
    if (!dataString) return null;

    let raw: object;
    try {
      raw = JSON.parse(dataString);
    } catch (error) {
      return null;
    }

    const data = CommandCustomIdBuilder.parseCommandReferenceData(raw);
    if (!data) return null;

    return new CommandCustomIdBuilder({
      data,
      separator,
      dataSeparator,
      namespace: builder.getNamespace(),
      objectId: builder.getObjectId(),
    });
  }

  protected static parseCommandReferenceData(
    raw: any,
  ): CommandReferenceData | null {
    if (raw && typeof raw === 'object' && 'type' in raw && 'root' in raw) {
      switch (raw.type) {
        case ResolvedCommandType.StandaloneCommand:
          if ('commandType' in raw && typeof raw.commandType === 'number') {
            return raw;
          }
          break;
        case ResolvedCommandType.SubCommand:
          if ('subCommand' in raw && typeof raw.subCommand === 'string') {
            return raw;
          }
          break;
        case ResolvedCommandType.SubCommandOnGroup:
          if (
            'subCommand' in raw
            && typeof raw.subCommand === 'string'
            && 'group' in raw
            && typeof raw.group === 'string'
          ) {
            return raw;
          }
          break;
      }
    }

    return null;
  }

  public getReferenceData(): CommandReferenceData {
    return this.data;
  }
}
