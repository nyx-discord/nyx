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

/**
 * The status of a {@link NyxBot}.
 *
 * *  `Unprepared` - The bot hasn't been set up and is on an unsafe state.
 * *  `Waiting` - The bot has been set up and is waiting to be started.
 * *  `Running` - The bot is running.
 * *  `Stopped` - The bot has been stopped.
 * *  `Killed` - The bot has been killed by an error during its start.
 */
export const BotStatusEnum = {
  Unprepared: 'unprepared',
  Waiting: 'waiting',
  Running: 'running',
  Stopped: 'stopped',
  Killed: 'killed',
} as const;

/** Type of values of {@link BotStatusEnum}. */
export type BotStatus = (typeof BotStatusEnum)[keyof typeof BotStatusEnum];
