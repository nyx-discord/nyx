import { getLinks } from '@/lib/docsEntities';
import { Book } from 'lucide-react';
import Link from 'next/link';

export async function DocsLink({ pkg, name }: { pkg: string; name: string }) {
  const links = await getLinks(pkg, name);
  if (!links?.typedoc) return <span>{name}</span>;

  return (
    <Link
      href={links.typedoc}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border border-fd-primary bg-transparent px-2 py-0.5 text-sm no-underline"
    >
      <Book className="w-3.5 h-3.5 text-fd-primary" />
      <span>{name} docs</span>
    </Link>
  );
}
