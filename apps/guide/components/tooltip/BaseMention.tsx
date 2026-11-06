import Link from 'next/link';
import { TooltipText } from './TooltipText';

export function BaseMention() {
  return TooltipText({
    text: <code className="text-fd-primary">@base</code>,
    popupContent: (
      <div>
        <p>
          Shorthand for the <code>@nyx-discord/base</code> package, which
          defines the framework&apos;s interfaces and provides their default
          implementations.
        </p>
        <p>
          Check the <Link href="/use/packages">Packages</Link> page for more
          details.
        </p>
      </div>
    ),
  });
}
