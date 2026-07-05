import { getLinks } from '@/lib/docsEntities';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { BookOpenText } from 'lucide-react';
import Link from 'next/link';

export async function DefinedInCard({
  pkg,
  name,
}: {
  pkg: string;
  name: string;
}) {
  const links = await getLinks(pkg, name);
  if (!links) return null;

  return (
    <div className="inline-flex items-center rounded-md border border-fd-primary/50 bg-fd-card text-fd-card-foreground shadow-sm">
      <span className="px-3 py-1 text-sm font-medium border-r border-fd-border/50">
        {name}
      </span>

      {links.github && (
        <Link
          href={links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-1 hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors border-r border-fd-border/50 last:border-r-0 flex items-center justify-center"
          title={`${name} source`}
        >
          <SiGithub className="w-4 h-4" />
        </Link>
      )}

      {links.typedoc && (
        <Link
          href={links.typedoc}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-1 hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors flex items-center justify-center"
          title={`${name} docs`}
        >
          <BookOpenText className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
