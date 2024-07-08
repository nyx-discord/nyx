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

import { Collection } from '@discordjs/collection';
import type {
  CustomIdBuilder,
  Identifier,
  MetaCollection,
  NyxBot,
  ReadonlyMetaCollection,
  Session,
  SessionCustomIdCodec,
  SessionEndData,
  SessionExecutionMeta,
  SessionStartFilter,
  SessionStartInteraction,
  SessionState,
  SessionUpdateFilter,
  SessionUpdateInteraction,
} from '@nyx-discord/core';
import {
  AssertionError,
  SessionEndCodes,
  SessionStateEnum,
} from '@nyx-discord/core';
import type {
  AnySelectMenuInteraction,
  Awaitable,
  ButtonInteraction,
  ModalSubmitInteraction,
} from 'discord.js';

import { NotImplementedError } from '../../../errors/NotImplementedError.js';

export abstract class AbstractSession<Result = void>
  implements Session<Result>
{
  public static readonly DefaultTTL = 180_000; // 3 minutes

  public readonly bot: NyxBot;

  protected readonly id: string;

  protected readonly startInteraction: SessionStartInteraction;

  protected readonly customId: CustomIdBuilder;

  protected readonly startFilter: SessionStartFilter<Result> | null = null;

  protected readonly updateFilter: SessionUpdateFilter<Result> | null = null;

  protected readonly ttl: number = AbstractSession.DefaultTTL;

  protected readonly codec: SessionCustomIdCodec;

  protected readonly meta: MetaCollection = new Collection<
    Identifier,
    unknown
  >();

  protected result: Result | null = null;

  protected state: SessionState = SessionStateEnum.Uninitalized;

  constructor(
    bot: NyxBot,
    id: string,
    startInteraction: SessionStartInteraction,
    ttl?: number,
  ) {
    this.bot = bot;
    this.id = id;
    this.startInteraction = startInteraction;

    this.codec = bot.sessions.getCustomIdCodec();
    this.customId = this.codec.createCustomIdBuilder(this);
    if (ttl !== undefined) this.ttl = ttl;
  }

  public async start(): Promise<void> {
    await this.bot.sessions.start(this);
  }

  public async onUpdate(
    interaction: SessionUpdateInteraction,
    meta: SessionExecutionMeta,
  ): Promise<boolean> {
    if (interaction.isButton()) return this.handleButton(interaction, meta);
    if (interaction.isModalSubmit()) return this.handleModal(interaction, meta);
    return this.handleSelectMenu(interaction, meta);
  }

  public abstract onStart(meta: SessionExecutionMeta): Awaitable<void>;

  public abstract onEnd(
    reason: string,
    code: Identifier | number,
    meta: SessionExecutionMeta,
  ): Awaitable<void>;

  public getResult(): Result | null {
    return this.result;
  }

  public getEndPromise(): Promise<SessionEndData<Result>> {
    return this.bot.sessions.getPromiseRepository().getPromise(this) as Promise<
      SessionEndData<Result>
    >;
  }

  public getMeta(): ReadonlyMetaCollection {
    return this.meta;
  }

  public getStartFilter(): SessionStartFilter<Result> | null {
    return this.startFilter;
  }

  public getUpdateFilter(): SessionUpdateFilter<Result> | null {
    return this.updateFilter;
  }

  public getId(): string {
    return this.id;
  }

  public getTTL(): number {
    return this.ttl;
  }

  public getStartInteraction(): SessionStartInteraction {
    return this.startInteraction;
  }

  public getState(): SessionState {
    return this.state;
  }

  public setState(state: SessionState): void {
    if (
      state === SessionStateEnum.Uninitalized
      && this.state != SessionStateEnum.Uninitalized
    ) {
      throw new AssertionError();
    }

    if (
      state == SessionStateEnum.Running
      && this.state !== SessionStateEnum.Uninitalized
    ) {
      throw new AssertionError();
    }

    if (
      state == SessionStateEnum.Ended
      && this.state !== SessionStateEnum.Running
    ) {
      throw new AssertionError();
    }

    this.state = state;
  }

  /** Handles a {@link ButtonInteraction} whose customId matches this session. */
  protected handleButton(
    _interaction: ButtonInteraction,
    _meta: SessionExecutionMeta,
  ): boolean | Promise<boolean> {
    throw new NotImplementedError();
  }

  /** Handles an {@link AnySelectMenuInteraction} whose customId matches this session. */
  protected handleSelectMenu(
    _interaction: AnySelectMenuInteraction,
    _meta: SessionExecutionMeta,
  ): boolean | Promise<boolean> {
    throw new NotImplementedError();
  }

  /** Handles a {@link ModalSubmitInteraction} whose customId matches this session. */
  protected handleModal(
    _interaction: ModalSubmitInteraction,
    _meta: SessionExecutionMeta,
  ): boolean | Promise<boolean> {
    throw new NotImplementedError();
  }

  /** Utility to self end this session. */
  protected async selfEnd(reason: string): Promise<void> {
    await this.bot.sessions.end(this, reason, SessionEndCodes.SelfEnded);
  }
}
