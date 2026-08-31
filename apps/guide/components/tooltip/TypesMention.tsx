import Link from 'next/link';
import { TooltipText } from './TooltipText';

export function TypesMention() {
  return TooltipText({
    text: <code className="text-fd-primary">@types</code>,
    popupContent: (
      <div>
        <p>
          Shorthand for the <code>@nyx-discord/types</code> package, which
          defines the base interfaces that make up nyx.
        </p>
        <p>
          Check the <Link href="/use/packages">Packages</Link> page for more
          details.
        </p>
      </div>
    ),
  });
}
