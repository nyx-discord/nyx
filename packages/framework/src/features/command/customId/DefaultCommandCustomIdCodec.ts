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
  CommandCustomIdCodec,
  CommandData,
  CommandReferenceData,
  ExecutableCommand,
} from '@nyx-discord/core';
import { CommandCustomIdBuilder } from '@nyx-discord/core';
import { BasicCustomIdCodec } from '../../../customId/BasicCustomIdCodec.js';

export class DefaultCommandCustomIdCodec
  extends BasicCustomIdCodec<ExecutableCommand<CommandData>>
  implements CommandCustomIdCodec
{
  public static readonly DefaultNamespace = 'CMD';

  constructor(
    prefix: string = DefaultCommandCustomIdCodec.DefaultNamespace,
    separator: string = DefaultCommandCustomIdCodec.DefaultSeparator,
    dataSeparator: string = DefaultCommandCustomIdCodec.DefaultDataSeparator,
  ) {
    super(prefix, separator, dataSeparator);
  }

  public static create(): CommandCustomIdCodec {
    return new DefaultCommandCustomIdCodec();
  }

  public override createCustomIdBuilder(
    command: ExecutableCommand<CommandData>,
  ) {
    const id = command.getId();
    const data = command.toReferenceData();

    return new CommandCustomIdBuilder({
      data,
      namespace: this.namespace,
      objectId: id,
      dataSeparator: this.dataSeparator,
      separator: this.separator,
    });
  }

  public deserializeToData(customId: string): CommandReferenceData | null {
    return (
      CommandCustomIdBuilder.fromCommandCustomId(
        customId,
        this.separator,
        this.dataSeparator,
      )?.getReferenceData() ?? null
    );
  }
}
