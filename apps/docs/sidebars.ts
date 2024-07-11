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
import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  nyxSidebar: [
    'welcome',
    'start',

    {
      type: 'category',
      label: '🌟 Features',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: '📸 Events',
          link: {
            type: 'doc',
            id: 'features/events/event-overview',
          },
          items: [
            'features/events/event-interception',
            'features/events/event-manager',
            'features/events/event-bus',
            'features/events/event-subscriber',
            'features/events/event-dispatcher',
            'features/events/event-manager-bus',
          ],
        },
        {
          type: 'category',
          label: '💻 Commands',
          link: {
            type: 'doc',
            id: 'features/commands/command-overview',
          },
          items: [
            {
              type: 'category',
              label: '📖 Command types',
              items: [
                'features/commands/commands/standalone-command',
                'features/commands/commands/context-menu-command',
                'features/commands/commands/parent-command',
                'features/commands/commands/subcommand',
                'features/commands/commands/subcommand-group',
              ],
            },
            'features/commands/command-interception',
            'features/commands/command-manager',
            'features/commands/command-customid-codec',
            'features/commands/command-executor',
            'features/commands/command-repository',
            'features/commands/command-deployer',
            'features/commands/command-resolver',
            'features/commands/command-subscribers',
            'features/commands/command-bus',
          ],
        },
        {
          type: 'category',
          label: '⏰ Schedules',
          link: {
            type: 'doc',
            id: 'features/schedules/schedule-overview',
          },
          items: [
            'features/schedules/schedule',
            'features/schedules/schedule-interception',
            'features/schedules/schedule-manager',
            'features/schedules/schedule-scheduler',
            'features/schedules/schedule-executor',
            'features/schedules/schedule-repository',
            'features/schedules/schedule-bus',
          ],
        },
        {
          type: 'category',
          label: '👤 Sessions',
          link: {
            type: 'doc',
            id: 'features/sessions/session-overview',
          },
          items: [
            {
              type: 'category',
              label: '👤 Session types',
              items: [
                'features/sessions/types/session',
                'features/sessions/types/pagination-session',
                'features/sessions/types/list-pagination-session',
                'features/sessions/types/stage-pagination-session',
              ],
            },
            'features/sessions/session-interception',
            'features/sessions/session-manager',
            'features/sessions/session-subscriber',
            'features/sessions/session-promise-repository',
            'features/sessions/session-bus',
            'features/sessions/session-customid-codec',
            'features/sessions/session-executor',
            'features/sessions/session-repository',
          ],
        },
      ],
    },

    'error/error-handling',
  ],
};

module.exports = sidebars;
