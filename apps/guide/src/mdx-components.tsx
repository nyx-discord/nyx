import { DocsLink } from 'components/links/DocsLink';
import { GithubLink } from 'components/links/GithubLink';
import { GithubInfo } from 'components/links/SafeGithubInfo';
import { BaseMention } from 'components/tooltip/BaseMention';
import * as Twoslash from 'fumadocs-twoslash/ui';
import { Tabs as FumadocsTabs, Tab } from 'fumadocs-ui/components/tabs';
import defaultComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import { Children, isValidElement } from 'react';

const CoreTab = '@discordjs/core';
const HttpTab = 'HTTP';

// HTTP bots run @discordjs/core code, so adapter tabs without their own HTTP tab reuse the @discordjs/core one
function withHttpTab(items: string[], children: React.ReactNode): [string[], React.ReactNode] {
  const coreIndex = items.indexOf(CoreTab);
  if (coreIndex === -1 || items.includes(HttpTab)) {
    return [items, children];
  }

  const tabs = Children.toArray(children).filter(isValidElement<{ children?: React.ReactNode }>);
  const coreTab = tabs[coreIndex];
  if (!coreTab) {
    return [items, children];
  }

  const httpTab = (
    <Tab key="http" value={HttpTab}>
      <p className="text-sm text-fd-muted-foreground">
        HTTP bots use the same code as <code>@discordjs/core</code>, importing from{' '}
        <Link href="/use/http"><code>@nyx-discord/http</code></Link> instead.
      </p>
      {coreTab.props.children}
    </Tab>
  );

  return [[...items, HttpTab], [...tabs, httpTab]];
}

function Tabs({ groupId, persist, items, children, ...props }: React.ComponentProps<typeof FumadocsTabs>) {
  const isPackageManager = items?.some(
    (item) => typeof item === 'string' && ['npm', 'pnpm', 'yarn', 'bun'].includes(item.toLowerCase()),
  );
  const defaultGroupId = isPackageManager ? 'package-manager' : 'client';
  const [resolvedItems, resolvedChildren] = items ? withHttpTab(items, children) : [items, children];

  return (
    <FumadocsTabs
      groupId={groupId ?? defaultGroupId}
      persist={persist ?? true}
      items={resolvedItems}
      {...props}
    >
      {resolvedChildren}
    </FumadocsTabs>
  );
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    ...Twoslash,
    Tabs,
    Tab,
    BaseMention,
    DocsLink,
    GithubLink,
    GithubInfo,
    ...components,
  };
}
