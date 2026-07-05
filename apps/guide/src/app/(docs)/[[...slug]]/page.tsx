import { source } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';
import { DefinedInCard } from 'components/links/DefinedInCard';
import { getGithubLastEdit } from 'fumadocs-core/content/github';
import Link from 'fumadocs-core/link';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import { icons as lucideIcons } from 'lucide-react';
import { notFound } from 'next/navigation';
import { createElement } from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../../../../components/ui/HoverCard';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const pageData = await page.data.load();
  const { body: MDXContent, toc, structuredData } = pageData;

  const lastUpdated = await getGithubLastEdit({
    owner: 'nyx-discord',
    repo: 'nyx',
    path: `apps/guide/content/docs/${page.path}`,
  });

  const { icon } = page.data;
  const iconElement =
    icon && icon in lucideIcons
      ? createElement(lucideIcons[icon as keyof typeof lucideIcons], {
          size: '3em',
        })
      : null;

  const { definedIn } = page.data;
  const definedInElement = definedIn ? (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-fd-muted-foreground">See in:</span>{' '}
      {definedIn.map((def) => {
        const [pkg, name] = def.split('/');
        return <DefinedInCard pkg={pkg} name={name} key={def} />;
      })}
    </div>
  ) : null;

  return (
    <DocsPage
      toc={toc}
      full={page.data.full}
      editOnGithub={{
        owner: 'nyx-discord',
        repo: 'nyx',
        sha: 'main',
        path: `apps/guide/content/docs/${page.path}`,
      }}
      tableOfContent={{ single: false, style: 'clerk' }}
      lastUpdate={lastUpdated ? new Date(lastUpdated) : undefined}
    >
      <div className="flex items-center gap-2">
        <span className="text-fd-primary">{iconElement}</span>
        <DocsTitle>{page.data.title}</DocsTitle>
      </div>
      <DocsDescription className="mb-0">
        {page.data.description}
      </DocsDescription>
      {definedInElement}
      <div className="mb-2 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-fd-muted-foreground">Reading time:</span>
          <span>
            {Math.round(
              structuredData.contents.reduce(
                (acc, curr) => acc + curr.content.split(/\s+/).length,
                0,
              ) / 120,
            )}{' '}
            min read
          </span>
        </div>
      </div>

      <DocsBody>
        <hr />
        <MDXContent
          components={getMDXComponents({
            a: async ({ href, ...props }) => {
              const found = source.getPageByHref(href ?? '', {
                dir: page.path.split('/').slice(0, -1).join('/'),
              });

              if (!found) {
                return <Link href={href} {...props} />;
              }

              const { data } = found.page;
              const { icon } = data;

              const iconElement =
                icon && icon in lucideIcons
                  ? createElement(lucideIcons[icon as keyof typeof lucideIcons])
                  : null;

              const content = (await data.load()).structuredData.contents[0]
                ?.content;

              const shortenedContent = content
                ? content.length > 100
                  ? `\n\n${content.slice(0, 100)}…`
                  : `\n\n${content}`
                : null;

              return (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Link
                      href={
                        found.hash
                          ? `${found.page.url}#${found.hash}`
                          : found.page.url
                      }
                      {...props}
                    />
                  </HoverCardTrigger>
                  <HoverCardContent className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-fd-primary">{iconElement}</span>
                      <p className="font-medium mb-2">{data.title}</p>
                    </div>
                    <p className="text-fd-muted-foreground mb-2">
                      {data.description}
                    </p>
                    <hr className="mb-2" />
                    {shortenedContent}
                  </HoverCardContent>
                </HoverCard>
              );
            },
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  const params = source.generateParams();
  return [...params, { slug: [] }];
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const section = params.slug?.[0];
  const prefix = section
    ? `${section.charAt(0).toUpperCase()}${section.slice(1)}`
    : 'Home';

  const title =
    (params.slug?.length ?? 0) > 1
      ? `${prefix} | ${page.data.title}`
      : page.data.title;

  return {
    title,
    description: page.data.description,
  };
}
