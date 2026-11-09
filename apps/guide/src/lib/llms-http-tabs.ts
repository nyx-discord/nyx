const TabsPattern = /<Tabs items=\{\[([^\]]*)\]\}>([\s\S]*?)<\/Tabs>/g;
const TabPattern = /<Tab>([\s\S]*?)<\/Tab>/g;

/** Adds an HTTP tab to the Markdown of adapter tabs that don't have one, like the `Tabs` component does on rendered pages.*/
export function withHttpTabs(markdown: string): string {
  return markdown.replace(
    TabsPattern,
    (block, rawItems: string, body: string) => {
      const items = [...rawItems.matchAll(/'([^']*)'/g)].map(
        ([, item]) => item,
      );
      const coreIndex = items.indexOf('@discordjs/core');
      if (coreIndex === -1 || items.includes('HTTP')) {
        return block;
      }

      const coreTab = [...body.matchAll(TabPattern)][coreIndex]?.[1];
      if (coreTab === undefined) {
        return block;
      }

      const httpTab = coreTab.replaceAll(
        "'@nyx-discord/djs-core'",
        "'@nyx-discord/http'",
      );
      const httpItems = [...items, 'HTTP']
        .map((item) => `'${item}'`)
        .join(', ');

      return `<Tabs items={[${httpItems}]}>${body}  <Tab>
  Same as \`@discordjs/core\`, importing from \`@nyx-discord/http\`:
${httpTab}</Tab>
</Tabs>`;
    },
  );
}
