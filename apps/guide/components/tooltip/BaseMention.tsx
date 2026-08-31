import Link from 'next/link';
import { TooltipText } from './TooltipText';
import { TypesMention } from './TypesMention';

export function BaseMention() {
  return TooltipText({
    text: <code className="text-fd-primary">@base</code>,
    popupContent: (
      <div>
        <p>
          Shorthand for the <code>@nyx-discord/base</code> package, which
          provides the default implementations for <TypesMention />.
        </p>
        <p>
          Check the <Link href="/use/packages">Packages</Link> page for more
          details.
        </p>
      </div>
    ),
  });
}
