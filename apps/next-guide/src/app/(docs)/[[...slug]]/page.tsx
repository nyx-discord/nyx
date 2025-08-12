import { source } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';
import Link from 'fumadocs-core/link';
import { getGithubLastEdit } from 'fumadocs-core/server';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import * as path from 'node:path';
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

  const MDXContent = page.data.body;

  const lastUpdated = await getGithubLastEdit({
    owner: 'nyx-discord',
    repo: 'nyx',
    path: `apps/guide/content/docs/${page.data._file.path}`,
  });

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      editOnGithub={{
        owner: 'nyx-discord',
        repo: 'nyx',
        sha: 'main',
        path: `apps/guide/content/docs/${page.data._file.path}`,
      }}
      tableOfContent={{ single: false, style: 'clerk' }}
      lastUpdate={lastUpdated ? new Date(lastUpdated) : undefined}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">
        {page.data.description}
      </DocsDescription>
      <div className="mb-2 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-fd-muted-foreground">Reading time:</span>
          <span>
            {Math.round(
              page.data.structuredData.contents.reduce(
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
            a: ({ href, ...props }) => {
              const found = source.getPageByHref(href ?? '', {
                dir: path.dirname(page.path),
                language: page.locale,
              });

              if (!found) {
                return <Link href={href} {...props} />;
              }

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
                    <p className="font-medium">{found.page.data.title}</p>
                    <p className="text-fd-muted-foreground">
                      {found.page.data.description}
                    </p>
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

export async function generateStaticParams() {
  const params = source.generateParams();
  return [...params, { slug: [] }];
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
