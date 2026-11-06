import { config } from '@repo/eslint-config/base';

const typesBoundaryMessage =
  'types must not depend on defaults. Only import within #types, or move the required file to types if it belongs there instead.';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    // the interfaces in types must stay independent from the default implementations
    files: ['src/types/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: '@nyx-discord/base', message: typesBoundaryMessage },
            {
              name: '@nyx-discord/base/defaults',
              message: typesBoundaryMessage,
            },
          ],
          patterns: [
            {
              group: ['**/defaults', '**/defaults/**'],
              message: typesBoundaryMessage,
            },
          ],
        },
      ],
    },
  },
];
