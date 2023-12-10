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

// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { themes } = require('prism-react-renderer');
import type { Config } from '@docusaurus/types';

const lightCodeTheme = themes.nightOwlLight;
const darkCodeTheme = themes.vsDark;

module.exports = async function createConfig(): Promise<Config> {
  const { remarkKroki } = await import('remark-kroki');

  return {
    title: 'nyx docs',
    tagline: 'Documentation of the nyx framework.',
    url: 'https://nyx-discord.github.io',
    baseUrl: '/nyx/docs/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'nyx-discord', // Usually your GitHub org/user name.
    projectName: 'nyx', // Usually your repo name.
    deploymentBranch: 'gh-pages',
    trailingSlash: false,

    // Even if you don't use internalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese,
    // you may want to replace "en" with "zh-Hans".
    i18n: {
      defaultLocale: 'en',
      locales: ['en'],
    },

    presets: [
      [
        'classic',
        /** @type {import('@docusaurus/preset-classic').Options} */
        {
          docs: {
            routeBasePath: '/',
            sidebarPath: './sidebars.ts',
            // Please change this to your repo.
            // Remove this to remove the "edit this page" links.
            editUrl:
              'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
            remarkPlugins: [
              [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
              [
                remarkKroki,
                {
                  alias: ['plantuml'],
                  target: 'mdx3',
                  server: 'https://kroki.io',
                  output: 'img-html-base64',
                },
              ],
            ],
          },
          blog: false,
          theme: {
            customCss: require.resolve('./src/css/custom.css'),
          },
        },
      ],
    ],

    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      {
        navbar: {
          title: 'Nyx Docs',
          logo: {
            alt: 'Nyx Logo',
            src: 'img/favicon.ico',
          },
          items: [
            {
              type: 'localeDropdown',
              position: 'left',
            },
            {
              href: 'https://nyx-discord.github.io/typedoc',
              label: 'TypeDoc',
              position: 'right',
            },
            {
              href: 'https://github.com/nyx-discord/nyx',
              label: 'GitHub',
              position: 'right',
            },
          ],
        },
        footer: {
          style: 'dark',
          copyright: `Copyright © ${new Date().getFullYear()} nyx. Built with Docusaurus.`,
        },
        prism: {
          theme: lightCodeTheme,
          darkTheme: darkCodeTheme,
          magicComments: [
            {
              className: 'theme-code-block-highlighted-line',
              line: 'highlight-next-line',
              block: { start: 'highlight-start', end: 'highlight-end' },
            },
            {
              className: 'code-block-error-line',
              line: 'error-next-line',
              block: { start: 'error-start', end: 'error-end' },
            },
            {
              className: 'code-block-warn-line',
              line: 'warn-next-line',
              block: { start: 'warn-start', end: 'warn-end' },
            },
          ],
        },
        zoom: {
          selector: 'img',
        },
      },
    plugins: [require.resolve('docusaurus-plugin-image-zoom')],
  };
};
