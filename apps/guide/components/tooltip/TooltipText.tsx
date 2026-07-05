import { cn } from '@/lib/cn';
import { Popup, PopupContent, PopupTrigger } from 'fumadocs-twoslash/ui';

export function TooltipText({
  text,
  popupContent,
  delay = 300,
  className,
}: {
  text: React.ReactNode;
  popupContent: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <Popup delay={delay}>
      <PopupTrigger asChild>
        <span
          className={cn(
            'underline border-b border-dotted border-current cursor-help decoration-dashed',
            className,
          )}
        >
          {text}
        </span>
      </PopupTrigger>
      <PopupContent>
        <div className="prose twoslash-popup-docs tooltip-popup-style">
          {popupContent}
        </div>
      </PopupContent>
    </Popup>
  );
}
