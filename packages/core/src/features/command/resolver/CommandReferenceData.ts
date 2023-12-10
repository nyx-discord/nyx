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

import type { ApplicationCommandType } from 'discord.js';

/** Type of resolved command on a command interaction. */
export enum ResolvedCommandType {
  StandaloneCommand = 'standaloneCommand',
  SubCommand = 'subCommand',
  SubCommandOnGroup = 'subCommandOnGroup',
}

/** Base data of a resolved command on a command interaction. */
export interface BaseCommandReferenceData<Type extends ResolvedCommandType> {
  type: Type;
  root: string;
}

/** Data of a resolved subcommand on a command interaction. */
export interface SubCommandReferenceData
  extends BaseCommandReferenceData<ResolvedCommandType.SubCommand> {
  subCommand: string;
}

/** Data of a resolved subcommand on a group on a command interaction. */
export interface SubCommandOnGroupReferenceData
  extends BaseCommandReferenceData<ResolvedCommandType.SubCommandOnGroup> {
  subCommand: string;
  group: string;
}

/** Data of a resolved standalone command on a command interaction. */
export interface StandaloneCommandReferenceData
  extends BaseCommandReferenceData<ResolvedCommandType.StandaloneCommand> {
  commandType: ApplicationCommandType;
}

/** Data of a resolved command on a command interaction. */
export type CommandReferenceData =
  | StandaloneCommandReferenceData
  | SubCommandReferenceData
  | SubCommandOnGroupReferenceData;
