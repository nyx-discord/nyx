import { DocsLink } from 'components/links/DocsLink';
import { GithubLink } from 'components/links/GithubLink';
import { CoreMention } from 'components/tooltip/CoreMention';
import { FrameworkMention } from 'components/tooltip/FrameworkMention';
import * as Twoslash from 'fumadocs-twoslash/ui';
import defaultComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    ...Twoslash,
    FrameworkMention,
    CoreMention,
    DocsLink,
    GithubLink,
    ...components,
  };
}
