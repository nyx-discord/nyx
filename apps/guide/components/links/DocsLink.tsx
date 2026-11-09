import { getLinks } from '@/lib/docsEntities';
import { BookOpenText } from 'lucide-react';
import Link from 'next/link';

export async function DocsLink({
  pkg,
  name,
  label,
  decorated = true,
}: {
  pkg: string;
  name: string;
  label?: string;
  decorated?: boolean;
}) {
  const labelText = label ?? `${name} docs`;

  const links = await getLinks(pkg, name);
  if (!links?.typedoc) {
    console.warn(`No docs found for ${pkg} ${name}`);
    return <span>{labelText}</span>;
  }

  if (!decorated) {
    return (
      <Link href={links.typedoc} target="_blank" rel="noopener noreferrer">
        {label ? label : <code>{name}</code>}
      </Link>
    );
  }

  return (
    <Link
      href={links.typedoc}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border border-fd-primary bg-transparent px-2 py-0.5 text-sm no-underline"
    >
      <BookOpenText className="w-3.5 h-3.5 text-fd-primary" />
      <span>{labelText}</span>
    </Link>
  );
}
