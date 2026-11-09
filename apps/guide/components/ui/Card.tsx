import { cn } from '@/lib/cn';
import { Card as BaseCard, type CardProps } from 'fumadocs-ui/components/card';
import { ExternalLinkIcon } from 'lucide-react';

export { Cards } from 'fumadocs-ui/components/card';

export function Card({
  href,
  title,
  className,
  children,
  ...props
}: CardProps) {
  if (!href) {
    return (
      <BaseCard title={title} className={className} {...props}>
        {children}
      </BaseCard>
    );
  }

  return (
    <BaseCard
      href={href}
      // padding keeps the title clear of the link icon
      title={<span className="block pr-6">{title}</span>}
      className={cn('group relative', className)}
      {...props}
    >
      <ExternalLinkIcon
        aria-hidden
        className="absolute top-4 right-4 size-4 text-fd-muted-foreground transition-colors group-hover:text-fd-primary"
      />
      {children}
    </BaseCard>
  );
}
