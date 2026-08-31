import { DocsLink } from 'components/links/DocsLink';
import { GithubLink } from 'components/links/GithubLink';
import { GithubInfo } from 'components/links/SafeGithubInfo';
import { BaseMention } from 'components/tooltip/BaseMention';
import { TypesMention } from 'components/tooltip/TypesMention';
import * as Twoslash from 'fumadocs-twoslash/ui';
import { Tabs as FumadocsTabs, Tab } from 'fumadocs-ui/components/tabs';
import defaultComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

function Tabs({ groupId, persist, items, ...props }: React.ComponentProps<typeof FumadocsTabs>) {
  const isPackageManager = items?.some(
    (item) => typeof item === 'string' && ['npm', 'pnpm', 'yarn', 'bun'].includes(item.toLowerCase()),
  );
  const defaultGroupId = isPackageManager ? 'package-manager' : 'client';

  return (
    <FumadocsTabs
      groupId={groupId ?? defaultGroupId}
      persist={persist ?? true}
      items={items}
      {...props}
    />
  );
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    ...Twoslash,
    Tabs,
    Tab,
    TypesMention,
    BaseMention,
    DocsLink,
    GithubLink,
    GithubInfo,
    ...components,
  };
}
