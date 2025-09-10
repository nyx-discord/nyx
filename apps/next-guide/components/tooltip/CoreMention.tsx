import Link from 'next/link';
import { TooltipText } from './TooltipText';

export function CoreMention() {
  return TooltipText({
    text: <code>@core</code>,
    popupContent: (
      <div>
        <p>
          Shorthand for the <code>@nyx-discord/core</code> package, which
          defines the base interfaces that make up nyx.
        </p>
        <p>
          Check the <Link href="/home/packages">Packages</Link> page for more
          details.
        </p>
      </div>
    ),
  });
}
