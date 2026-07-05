import { getLinks } from '@/lib/docsEntities';
import { SiGithub } from '@icons-pack/react-simple-icons';
import Link from 'next/link';

export async function GithubLink({
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
  const labelText = label ?? `${name} source`;

  const links = await getLinks(pkg, name);
  if (!links?.github) {
    console.warn(`No github found for ${pkg} ${name}`);
    return <span>{labelText}</span>;
  }

  if (!decorated) {
    return (
      <Link href={links.github} target="_blank" rel="noopener noreferrer">
        {label ? label : name}
      </Link>
    );
  }

  return (
    <Link
      href={links.github}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border border-fd-primary bg-transparent px-2 py-0.5 text-sm no-underline"
    >
      <SiGithub className="w-3.5 h-3.5 text-fd-primary" />
      <span>{labelText}</span>
    </Link>
  );
}
