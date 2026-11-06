import { absoluteUrl } from '@/lib/site';
import { docsLlms } from '@/lib/source';

export const revalidate = false;

// https://llmstxt.org: title, a summary, guidance, then the list of pages.
const preamble = `# nyx

> nyx is an interface-first TypeScript framework for Discord bots. It handles application commands, events, schedules and plugins on top of discord.js (\`@nyx-discord/djs\`) or @discordjs/core (\`@nyx-discord/djs-core\`).

- Import everything from the adapter the project uses (\`@nyx-discord/djs\` or \`@nyx-discord/djs-core\`); both re-export \`@nyx-discord/base\`.
- Every page below is plain Markdown. Pages show both adapters in \`<Tab>\` blocks: use the one matching the project. Ignore twoslash lines in code blocks (\`// ---cut---\`, \`// @ts-expect-error\`, \`// ^?\`) and \`declare const\` stubs.
- nyx only supports application commands, never replies to users on errors by itself, and doesn't ship storage: those are the bot's own code.
- Agent skill with typechecked examples: \`npx skills add nyx-discord/nyx\` (source: https://github.com/nyx-discord/nyx/tree/main/skills/nyx).
- All pages in one file: ${absoluteUrl('/llms-full.txt')}
- API reference: https://nyx-discord.github.io/nyx/typedoc/
`;

export function GET() {
  // Fumadocs titles the index after the page tree ("# Docs"); nest it under the preamble's title instead.
  const index = docsLlms.index().replace(/^# .*$/m, '## Docs');
  return new Response(`${preamble}\n${index}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
