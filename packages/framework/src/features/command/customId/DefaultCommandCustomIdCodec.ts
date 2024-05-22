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
  AnyExecutableCommand,
  CommandCustomIdCodec,
} from '@nyx-discord/core';

import { AbstractCustomIdCodec } from '../../../customId/AbstractCustomIdCodec';

export class DefaultCommandCustomIdCodec
  extends AbstractCustomIdCodec<AnyExecutableCommand>
  implements CommandCustomIdCodec
{
  public static readonly DefaultNamespace = 'CMD';

  public static readonly DefaultNamesSeparator = ':';

  protected readonly namesSeparator: string;

  constructor(
    prefix: string = DefaultCommandCustomIdCodec.DefaultNamespace,
    separator: string = DefaultCommandCustomIdCodec.DefaultSeparator,
    dataSeparator: string = DefaultCommandCustomIdCodec.DefaultDataSeparator,
    namesSeparator: string = DefaultCommandCustomIdCodec.DefaultNamesSeparator,
  ) {
    super(prefix, separator, dataSeparator);

    this.namesSeparator = namesSeparator;
  }

  public static create(): CommandCustomIdCodec {
    return new DefaultCommandCustomIdCodec();
  }

  public getNamesSeparator(): string {
    return this.namesSeparator;
  }

  protected getIdOf(serialized: AnyExecutableCommand): string {
    return serialized.getNameTree().join(this.namesSeparator);
  }
}
