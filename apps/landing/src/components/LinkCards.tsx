import { docsUrl, guideUrl } from '@/lib/links';
import { ArrowRight, BookOpenText, CodeXml } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

const cards: {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
}[] = [
  {
    icon: <CodeXml />,
    title: 'Guide',
    description:
      'Learn how to use nyx, from your first command to replacing its internals, with typechecked examples.',
    href: guideUrl,
    color: 'var(--guide-color)',
  },
  {
    icon: <BookOpenText />,
    title: 'Documentation',
    description:
      'The API reference for every package: each class, interface and type nyx exports.',
    href: docsUrl,
    color: 'var(--docs-color)',
  },
];

/** Cards linking to the guide and the API documentation. */
export function LinkCards() {
  return (
    <div className="mt-10 grid w-full max-w-3xl gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <a
          key={card.href}
          href={card.href}
          className="group flex flex-col rounded-xl border bg-fd-card p-5 transition-colors hover:border-(--card-color) hover:bg-fd-accent/50"
          style={{ '--card-color': card.color } as CSSProperties}
        >
          <div className="mb-2 flex items-center gap-3">
            <div className="inline-flex size-9 items-center justify-center rounded-lg bg-(--card-color)/15 text-(--card-color) [&_svg]:size-5">
              {card.icon}
            </div>
            <h2 className="flex items-center gap-1 text-lg font-semibold">
              {card.title}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </h2>
          </div>
          <p className="text-sm text-fd-muted-foreground">{card.description}</p>
        </a>
      ))}
    </div>
  );
}
